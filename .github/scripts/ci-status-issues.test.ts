/** @vitest-environment node */
import { describe, it, expect } from "vitest";
import {
  buildMarker,
  failedJobs,
  findExistingIssue,
  isTrackedBranch,
  planCiStatusAction,
  resolveCiEnvironment,
} from "./ci-status-issues.cjs";

describe("isTrackedBranch", () => {
  it("tracks main and production", () => {
    expect(isTrackedBranch("main")).toBe(true);
    expect(isTrackedBranch("production")).toBe(true);
  });

  it("ignores feature branches and tags", () => {
    expect(isTrackedBranch("chore/cicd-staging")).toBe(false);
    expect(isTrackedBranch("v1.2.3")).toBe(false);
  });
});

describe("resolveCiEnvironment", () => {
  it("maps main to staging and production to production", () => {
    expect(resolveCiEnvironment("main")).toBe("staging");
    expect(resolveCiEnvironment("production")).toBe("production");
  });
});

describe("buildMarker", () => {
  it("is unique per workflow and branch", () => {
    expect(buildMarker("CI", "main")).toBe("<!-- ci-status:CI:main -->");
    expect(buildMarker("CI", "production")).toBe("<!-- ci-status:CI:production -->");
  });
});

describe("failedJobs", () => {
  it("keeps failure and timed_out jobs", () => {
    const jobs = [
      { name: "validate", conclusion: "success", html_url: "https://example.com/1" },
      { name: "deploy-staging", conclusion: "failure", html_url: "https://example.com/2" },
      { name: "deploy-ftp-void", conclusion: "timed_out", html_url: "https://example.com/3" },
      { name: "deploy-ftp-agencia", conclusion: "skipped", html_url: "https://example.com/4" },
    ];
    expect(failedJobs(jobs).map((j) => j.name)).toEqual(["deploy-staging", "deploy-ftp-void"]);
  });
});

describe("findExistingIssue", () => {
  it("finds an open issue with the same workflow/branch marker", () => {
    const marker = buildMarker("CI", "main");
    const issues = [
      { number: 1, body: "otra cosa", pull_request: undefined },
      { number: 2, body: `hola\n${marker}\n`, pull_request: undefined },
    ];
    expect(findExistingIssue(issues, marker)?.number).toBe(2);
  });

  it("ignores pull requests even if the body has the marker", () => {
    const marker = buildMarker("CI", "main");
    const issues = [{ number: 3, body: marker, pull_request: { url: "https://example.com/pr" } }];
    expect(findExistingIssue(issues, marker)).toBeNull();
  });
});

describe("planCiStatusAction", () => {
  const base = {
    event: "push",
    branch: "main",
    workflowName: "CI",
    conclusion: "failure",
    runUrl: "https://github.com/org/repo/actions/runs/99",
    sha: "abc123def",
    commitUrl: "https://github.com/org/repo/commit/abc123def",
    jobs: [
      {
        name: "validate",
        conclusion: "failure",
        html_url: "https://github.com/org/repo/actions/runs/99/job/1",
      },
    ],
    existing: null as { number: number; body?: string } | null,
  };

  it("creates a labeled issue on first failure", () => {
    const action = planCiStatusAction(base);
    expect(action.type).toBe("create");
    if (action.type !== "create") throw new Error("expected create");
    expect(action.labels).toEqual(["ci-failure", "staging"]);
    expect(action.title).toContain("staging");
    expect(action.body).toContain(base.runUrl);
    expect(action.body).toContain(base.sha);
    expect(action.body).toContain("validate");
    expect(action.body).toContain(buildMarker("CI", "main"));
  });

  it("comments on the existing issue instead of opening a duplicate", () => {
    const action = planCiStatusAction({
      ...base,
      existing: { number: 8, body: buildMarker("CI", "main") },
    });
    expect(action.type).toBe("comment");
    if (action.type !== "comment") throw new Error("expected comment");
    expect(action.issueNumber).toBe(8);
    expect(action.body).toContain(base.runUrl);
    expect(action.body).toContain("validate");
  });

  it("closes the existing issue when the run is green", () => {
    const action = planCiStatusAction({
      ...base,
      conclusion: "success",
      jobs: [{ name: "validate", conclusion: "success", html_url: "https://example.com/ok" }],
      existing: { number: 8, body: buildMarker("CI", "main") },
    });
    expect(action.type).toBe("close");
    if (action.type !== "close") throw new Error("expected close");
    expect(action.issueNumber).toBe(8);
    expect(action.body).toContain(base.runUrl);
    expect(action.body).toContain(base.sha);
  });

  it("does nothing on green when there is no open issue", () => {
    expect(planCiStatusAction({ ...base, conclusion: "success", existing: null }).type).toBe(
      "noop",
    );
  });

  it("does nothing for cancelled runs and untracked branches", () => {
    expect(planCiStatusAction({ ...base, conclusion: "cancelled" }).type).toBe("noop");
    expect(planCiStatusAction({ ...base, branch: "chore/cicd-staging" }).type).toBe("noop");
    expect(planCiStatusAction({ ...base, event: "pull_request" }).type).toBe("noop");
  });

  it("labels production failures with the production environment", () => {
    const action = planCiStatusAction({ ...base, branch: "production" });
    expect(action.type).toBe("create");
    if (action.type !== "create") throw new Error("expected create");
    expect(action.labels).toEqual(["ci-failure", "production"]);
  });
});
