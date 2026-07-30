/** Helpers compartidos de grafo / estado de ejecución de workflows. */

export type WorkflowGraphNode = {
  id: string;
  node_key: string;
  name?: string;
  node_type?: string;
};

export type WorkflowGraphEdge = {
  from_node?: string;
  to_node?: string;
  from_node_key?: string;
  to_node_key?: string;
};

export type NodeRunStatus = "idle" | "pending" | "running" | "success" | "failed" | "skipped";

export function isExecutionLive(status?: string): boolean {
  const s = String(status || "").toLowerCase();
  return (
    s.includes("run") ||
    s.includes("pend") ||
    s === "started" ||
    s === "queued" ||
    s === "in_progress" ||
    s === "processing"
  );
}

export function normalizeRunStatus(status?: string): NodeRunStatus {
  const s = String(status || "").toLowerCase();
  if (!s) return "idle";
  if (s.includes("fail") || s.includes("error")) return "failed";
  if (s.includes("skip")) return "skipped";
  if (s.includes("run") || s.includes("progress") || s === "started" || s === "active") {
    return "running";
  }
  if (
    s.includes("success") ||
    s.includes("complet") ||
    s === "done" ||
    s === "ok" ||
    s === "finished"
  ) {
    return "success";
  }
  if (s.includes("pend") || s.includes("wait") || s.includes("queued")) return "pending";
  return "idle";
}

export function resolveEdgeNodeId(
  e: WorkflowGraphEdge,
  side: "from" | "to",
  nodes: Pick<WorkflowGraphNode, "id" | "node_key">[],
  keyIndex?: Map<string, string>,
): string {
  const direct = side === "from" ? e.from_node : e.to_node;
  if (direct != null && String(direct).trim() !== "") return String(direct);
  const key = side === "from" ? e.from_node_key : e.to_node_key;
  if (!key) return "";
  if (keyIndex) return keyIndex.get(key) || "";
  const hit = nodes.find((n) => n.node_key === key);
  return hit ? String(hit.id) : "";
}

/** Orden topológico lineal (BFS por indegree). */
export function orderNodes(
  nodes: Pick<WorkflowGraphNode, "id" | "node_key">[],
  edges: WorkflowGraphEdge[],
): string[] {
  const ids = nodes.map((n) => String(n.id));
  const idSet = new Set(ids);
  const keyIndex = new Map(nodes.map((n) => [n.node_key, String(n.id)]));
  const outgoing = new Map<string, string[]>();
  const indeg = new Map<string, number>();
  for (const id of ids) {
    outgoing.set(id, []);
    indeg.set(id, 0);
  }
  for (const e of edges) {
    const from = resolveEdgeNodeId(e, "from", nodes, keyIndex);
    const to = resolveEdgeNodeId(e, "to", nodes, keyIndex);
    if (!from || !to || !idSet.has(from) || !idSet.has(to) || from === to) continue;
    outgoing.get(from)!.push(to);
    indeg.set(to, (indeg.get(to) || 0) + 1);
  }

  const ordered: string[] = [];
  const queue = ids.filter((id) => (indeg.get(id) || 0) === 0);
  let qi = 0;
  const seen = new Set<string>();
  while (qi < queue.length) {
    const id = queue[qi++];
    if (seen.has(id)) continue;
    seen.add(id);
    ordered.push(id);
    for (const t of outgoing.get(id) || []) {
      indeg.set(t, (indeg.get(t) || 0) - 1);
      if ((indeg.get(t) || 0) <= 0 && !seen.has(t)) queue.push(t);
    }
  }
  for (const id of ids) {
    if (!seen.has(id)) ordered.push(id);
  }
  return ordered;
}

/** Orden topológico por capas (trigger → … → fin). */
export function layeredNodeOrder(
  nodes: Pick<WorkflowGraphNode, "id" | "node_key" | "node_type">[],
  edges: WorkflowGraphEdge[],
): string[][] {
  const ids = nodes.map((n) => String(n.id));
  const idSet = new Set(ids);
  const keyIndex = new Map(nodes.map((n) => [n.node_key, String(n.id)]));
  const typeById = new Map(nodes.map((n) => [String(n.id), n.node_type]));
  const outgoing = new Map<string, string[]>();
  const indeg = new Map<string, number>();
  for (const id of ids) {
    outgoing.set(id, []);
    indeg.set(id, 0);
  }
  for (const e of edges) {
    const from = resolveEdgeNodeId(e, "from", nodes, keyIndex);
    const to = resolveEdgeNodeId(e, "to", nodes, keyIndex);
    if (!from || !to || !idSet.has(from) || !idSet.has(to) || from === to) continue;
    outgoing.get(from)!.push(to);
    indeg.set(to, (indeg.get(to) || 0) + 1);
  }

  const layers: string[][] = [];
  const remaining = new Map(indeg);
  let frontier = ids.filter((id) => (remaining.get(id) || 0) === 0);
  frontier.sort((a, b) => {
    const sa = typeById.get(a) === "trigger" ? 0 : 1;
    const sb = typeById.get(b) === "trigger" ? 0 : 1;
    return sa - sb;
  });
  const seen = new Set<string>();

  while (frontier.length > 0) {
    layers.push([...frontier]);
    for (const id of frontier) seen.add(id);
    const next: string[] = [];
    for (const id of frontier) {
      for (const t of outgoing.get(id) || []) {
        if (seen.has(t)) continue;
        remaining.set(t, (remaining.get(t) || 0) - 1);
        if ((remaining.get(t) || 0) <= 0 && !next.includes(t)) next.push(t);
      }
    }
    frontier = next;
  }

  const missing = ids.filter((id) => !seen.has(id));
  if (missing.length) layers.push(missing);
  return layers.length ? layers : [ids];
}
