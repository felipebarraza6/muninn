"use strict";

/**
 * Pure helpers + GitHub Actions handler to open/comment/close CI failure issues.
 * Used by .github/workflows/ci-status-issues.yml via actions/github-script.
 */

function isTrackedBranch(branch) {
  return branch === "main" || branch === "production";
}

function resolveCiEnvironment(branch) {
  return branch === "main" ? "staging" : "production";
}

function buildMarker(workflowName, branch) {
  return `<!-- ci-status:${workflowName}:${branch} -->`;
}

function failedJobs(jobs) {
  return (jobs || []).filter(
    (job) => job.conclusion === "failure" || job.conclusion === "timed_out",
  );
}

function findExistingIssue(issues, marker) {
  const match = (issues || []).find(
    (issue) => !issue.pull_request && typeof issue.body === "string" && issue.body.includes(marker),
  );
  return match ?? null;
}

function formatFailedJobs(jobs) {
  const failed = failedJobs(jobs);
  if (failed.length === 0) return "- (sin jobs con conclusion failure/timed_out)";
  return failed.map((job) => `- [${job.name}](${job.html_url}) (\`${job.conclusion}\`)`).join("\n");
}

function formatFailureBody({ marker, env, branch, workflowName, runUrl, sha, commitUrl, jobs }) {
  return [
    marker,
    `Falló el workflow **${workflowName}** en \`${branch}\` (entorno **${env}**).`,
    "",
    `- Ejecución: ${runUrl}`,
    `- Commit: [\`${sha}\`](${commitUrl})`,
    `- Jobs fallidos:`,
    formatFailedJobs(jobs),
    "",
    "Este issue se actualiza si el fallo se repite y se cierra cuando el workflow vuelve a verde en esta rama.",
  ].join("\n");
}

function formatFollowupComment({ env, branch, runUrl, sha, commitUrl, jobs }) {
  return [
    `Nuevo fallo en **${env}** (\`${branch}\`).`,
    "",
    `- Ejecución: ${runUrl}`,
    `- Commit: [\`${sha}\`](${commitUrl})`,
    `- Jobs fallidos:`,
    formatFailedJobs(jobs),
  ].join("\n");
}

function formatRecoveryComment({ env, branch, runUrl, sha, commitUrl }) {
  return [
    `El workflow volvió a **verde** en **${env}** (\`${branch}\`).`,
    "",
    `- Ejecución: ${runUrl}`,
    `- Commit: [\`${sha}\`](${commitUrl})`,
    "",
    "Cierro este issue automáticamente.",
  ].join("\n");
}

function planCiStatusAction({
  event,
  branch,
  workflowName,
  conclusion,
  runUrl,
  sha,
  commitUrl,
  jobs,
  existing,
}) {
  if (event !== "push") return { type: "noop" };
  if (!isTrackedBranch(branch)) return { type: "noop" };
  if (conclusion === "cancelled" || conclusion === "skipped") return { type: "noop" };

  const env = resolveCiEnvironment(branch);
  const marker = buildMarker(workflowName, branch);

  if (conclusion === "success") {
    if (!existing) return { type: "noop" };
    return {
      type: "close",
      issueNumber: existing.number,
      body: formatRecoveryComment({ env, branch, runUrl, sha, commitUrl }),
    };
  }

  if (conclusion !== "failure" && conclusion !== "timed_out") {
    return { type: "noop" };
  }

  const labels = ["ci-failure", env];
  const title = `CI/CD falló en ${env} (${branch})`;

  if (existing) {
    return {
      type: "comment",
      issueNumber: existing.number,
      body: formatFollowupComment({ env, branch, runUrl, sha, commitUrl, jobs }),
    };
  }

  return {
    type: "create",
    title,
    labels,
    body: formatFailureBody({
      marker,
      env,
      branch,
      workflowName,
      runUrl,
      sha,
      commitUrl,
      jobs,
    }),
  };
}

const LABEL_META = {
  "ci-failure": { color: "d73a4a", description: "Fallo de CI o deploy" },
  staging: { color: "f9c513", description: "Entorno staging (rama main)" },
  production: { color: "0e8a16", description: "Entorno production" },
};

async function ensureLabel(github, { owner, repo, name }) {
  try {
    await github.rest.issues.getLabel({ owner, repo, name });
  } catch (error) {
    if (error.status !== 404) throw error;
    const meta = LABEL_META[name] || { color: "ededed", description: name };
    await github.rest.issues.createLabel({
      owner,
      repo,
      name,
      color: meta.color,
      description: meta.description,
    });
  }
}

async function handleWorkflowRun({ github, context, core }) {
  const run = context.payload.workflow_run;
  if (!run) {
    core.info("Sin workflow_run en el payload");
    return { type: "noop" };
  }

  const owner = context.repo.owner;
  const repo = context.repo.repo;
  const branch = run.head_branch;
  const workflowName = run.name || "CI";
  const sha = run.head_sha;
  const commitUrl = `https://github.com/${owner}/${repo}/commit/${sha}`;

  const jobsResponse = await github.rest.actions.listJobsForWorkflowRun({
    owner,
    repo,
    run_id: run.id,
    per_page: 100,
  });

  const marker = buildMarker(workflowName, branch);
  const openIssues = await github.paginate(github.rest.issues.listForRepo, {
    owner,
    repo,
    state: "open",
    labels: "ci-failure",
    per_page: 100,
  });
  const existing = findExistingIssue(openIssues, marker);

  const action = planCiStatusAction({
    event: run.event,
    branch,
    workflowName,
    conclusion: run.conclusion,
    runUrl: run.html_url,
    sha,
    commitUrl,
    jobs: jobsResponse.data.jobs,
    existing,
  });

  core.info(`Acción CI status: ${action.type} (${branch} / ${run.conclusion})`);

  if (action.type === "noop") return action;

  if (action.type === "create") {
    for (const name of action.labels) {
      await ensureLabel(github, { owner, repo, name });
    }
    const created = await github.rest.issues.create({
      owner,
      repo,
      title: action.title,
      body: action.body,
      labels: action.labels,
    });
    core.info(`Issue creado: #${created.data.number}`);
    return action;
  }

  if (action.type === "comment") {
    await github.rest.issues.createComment({
      owner,
      repo,
      issue_number: action.issueNumber,
      body: action.body,
    });
    core.info(`Comentario en #${action.issueNumber}`);
    return action;
  }

  if (action.type === "close") {
    await github.rest.issues.createComment({
      owner,
      repo,
      issue_number: action.issueNumber,
      body: action.body,
    });
    await github.rest.issues.update({
      owner,
      repo,
      issue_number: action.issueNumber,
      state: "closed",
      state_reason: "completed",
    });
    core.info(`Issue cerrado: #${action.issueNumber}`);
    return action;
  }

  return action;
}

module.exports = {
  isTrackedBranch,
  resolveCiEnvironment,
  buildMarker,
  failedJobs,
  findExistingIssue,
  planCiStatusAction,
  handleWorkflowRun,
};
