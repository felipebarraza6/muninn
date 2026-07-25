import {
  layeredNodeOrder,
  normalizeRunStatus,
  type NodeRunStatus,
  type WorkflowGraphEdge,
  type WorkflowGraphNode,
} from "@/lib/workflowGraph";

export const NODE_W = 180;
export const NODE_H = 56;
export const COL_GAP = 320;
export const ROW_GAP = 140;
export const VIEW_PAD_X = 48;
export const VIEW_PAD_Y = 56;

/** CSS vars (hex en tema) — válidos en stroke SVG. */
export const EDGE_STROKE = "var(--primary)";
export const EDGE_SUCCESS = "var(--success)";
export const EDGE_FAILED = "var(--destructive)";

export type LayoutNode = Pick<WorkflowGraphNode, "id" | "node_key" | "node_type"> & {
  position_x?: number;
  position_y?: number;
};

export type LayoutEdge = WorkflowGraphEdge;

export function isLayoutCramped(
  pos: Record<string, { x: number; y: number }>,
  nodeW = NODE_W,
): boolean {
  const pts = Object.values(pos);
  if (pts.length < 2) return false;
  const sorted = [...pts].sort((a, b) => a.x - b.x || a.y - b.y);
  let minGap = Infinity;
  for (let i = 1; i < sorted.length; i++) {
    const gap = sorted[i].x - (sorted[i - 1].x + nodeW);
    minGap = Math.min(minGap, gap);
  }
  const minX = Math.min(...pts.map((p) => p.x));
  const minY = Math.min(...pts.map((p) => p.y));
  return minGap < 72 || (minX < 60 && minY < 60 && pts.length >= 2);
}

/** Layout por capas centrado en el viewport (force = siempre reorganizar). */
export function layoutCenteredFlow(
  nodes: LayoutNode[],
  edges: LayoutEdge[],
  viewport: { w: number; h: number },
  force = false,
): Record<string, { x: number; y: number }> {
  if (nodes.length === 0) return {};

  const raw: Record<string, { x: number; y: number }> = {};
  for (const n of nodes) {
    raw[String(n.id)] = {
      x: Number(n.position_x ?? 40),
      y: Number(n.position_y ?? 40),
    };
  }

  const cramped = force || isLayoutCramped(raw);
  let placed: Record<string, { x: number; y: number }>;

  if (cramped) {
    placed = {};
    const layers = layeredNodeOrder(nodes, edges);
    layers.forEach((layer, col) => {
      const blockH = Math.max(0, layer.length - 1) * ROW_GAP + NODE_H;
      const yBase = -blockH / 2;
      layer.forEach((id, row) => {
        placed[id] = {
          x: col * COL_GAP,
          y: yBase + row * ROW_GAP,
        };
      });
    });
  } else {
    placed = { ...raw };
  }

  const pts = Object.values(placed);
  const minX = Math.min(...pts.map((p) => p.x));
  const maxX = Math.max(...pts.map((p) => p.x)) + NODE_W;
  const minY = Math.min(...pts.map((p) => p.y));
  const maxY = Math.max(...pts.map((p) => p.y)) + NODE_H;
  const graphW = Math.max(1, maxX - minX);
  const graphH = Math.max(1, maxY - minY);
  const viewW = Math.max(viewport.w || 800, graphW + VIEW_PAD_X * 2);
  const viewH = Math.max(viewport.h || 560, graphH + VIEW_PAD_Y * 2);
  const ox = Math.round((viewW - graphW) / 2 - minX);
  const oy = Math.round((viewH - graphH) / 2 - minY);

  const out: Record<string, { x: number; y: number }> = {};
  for (const [id, p] of Object.entries(placed)) {
    out[id] = {
      x: Math.max(VIEW_PAD_X, p.x + ox),
      y: Math.max(VIEW_PAD_Y, p.y + oy),
    };
  }
  return out;
}

type RunLog = {
  node?: string | number | null;
  node_name?: string | null;
  status?: string | null;
};

/** Mapa nodeId → estado de ejecución a partir de logs. */
export function buildNodeRunMap(
  logs: RunLog[] | undefined,
  nodes: { id: string; node_key: string; name: string }[],
): Map<string, NodeRunStatus> {
  const map = new Map<string, NodeRunStatus>();
  if (!logs?.length) return map;
  const byId = new Map(nodes.map((n) => [String(n.id), String(n.id)]));
  const byKey = new Map(nodes.map((n) => [n.node_key, String(n.id)]));
  const byName = new Map(nodes.map((n) => [n.name.toLowerCase(), String(n.id)]));

  for (const log of logs) {
    let nodeId = "";
    if (log.node != null && byId.has(String(log.node))) {
      nodeId = String(log.node);
    } else if (log.node_name && byKey.has(log.node_name)) {
      nodeId = byKey.get(log.node_name)!;
    } else if (log.node_name && byName.has(log.node_name.toLowerCase())) {
      nodeId = byName.get(log.node_name.toLowerCase())!;
    }
    if (!nodeId) continue;
    map.set(nodeId, normalizeRunStatus(log.status ?? undefined));
  }
  return map;
}
