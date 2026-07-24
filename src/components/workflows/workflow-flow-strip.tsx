import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, GitBranch, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WorkflowEdge, WorkflowNode } from "@/api/hooks/useWorkflows";
import { workflowNodeMeta } from "@/lib/workflowCatalog";
import { cn } from "@/lib/utils";

const CARD_W = 168;
const CARD_H = 72;
const GAP = 56;

function resolveIds(
  e: WorkflowEdge,
  nodes: WorkflowNode[],
): { from: string; to: string } | null {
  const from =
    e.from_node != null
      ? String(e.from_node)
      : nodes.find((n) => n.node_key === e.from_node_key)?.id;
  const to =
    e.to_node != null
      ? String(e.to_node)
      : nodes.find((n) => n.node_key === e.to_node_key)?.id;
  if (!from || !to) return null;
  return { from: String(from), to: String(to) };
}

/** Orden lineal por edges; fallback por position_x. */
function orderNodes(nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowNode[] {
  if (nodes.length <= 1) return nodes;
  const byId = new Map(nodes.map((n) => [String(n.id), n]));
  const outgoing = new Map<string, string[]>();
  const indeg = new Map<string, number>();
  for (const n of nodes) {
    outgoing.set(String(n.id), []);
    indeg.set(String(n.id), 0);
  }
  for (const e of edges) {
    const ids = resolveIds(e, nodes);
    if (!ids || !byId.has(ids.from) || !byId.has(ids.to)) continue;
    outgoing.get(ids.from)!.push(ids.to);
    indeg.set(ids.to, (indeg.get(ids.to) || 0) + 1);
  }
  const starts = nodes
    .filter((n) => (indeg.get(String(n.id)) || 0) === 0)
    .sort((a, b) => (a.node_type === "trigger" ? -1 : b.node_type === "trigger" ? 1 : 0));
  const ordered: WorkflowNode[] = [];
  const seen = new Set<string>();
  const queue = starts.map((n) => String(n.id));
  while (queue.length) {
    const id = queue.shift()!;
    if (seen.has(id)) continue;
    seen.add(id);
    const node = byId.get(id);
    if (node) ordered.push(node);
    for (const next of outgoing.get(id) || []) {
      if (!seen.has(next)) queue.push(next);
    }
  }
  for (const n of nodes) {
    if (!seen.has(String(n.id))) ordered.push(n);
  }
  if (ordered.length === nodes.length) return ordered;
  return [...nodes].sort(
    (a, b) => (a.position_x ?? 0) - (b.position_x ?? 0) || a.name.localeCompare(b.name),
  );
}

type Props = {
  workflowId: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  isLoading?: boolean;
};

export function WorkflowFlowStrip({ workflowId, nodes, edges, isLoading }: Props) {
  const reduceMotion = useReducedMotion();
  /** Animación de entrada solo la primera vez que hay nodos (evita parpadeo en refetch). */
  const enteredRef = useRef(false);
  const ordered = useMemo(() => orderNodes(nodes, edges), [nodes, edges]);
  const playEnter = !reduceMotion && !enteredRef.current && ordered.length > 0;

  useEffect(() => {
    enteredRef.current = false;
  }, [workflowId]);

  useEffect(() => {
    if (ordered.length > 0) enteredRef.current = true;
  }, [ordered.length, workflowId]);

  const layout = useMemo(() => {
    const positions = new Map<string, { x: number; y: number }>();
    ordered.forEach((n, i) => {
      positions.set(String(n.id), { x: i * (CARD_W + GAP), y: 24 });
    });
    const width = Math.max(ordered.length * (CARD_W + GAP) - GAP + 48, 320);
    const height = CARD_H + 64;
    const links: { key: string; x1: number; y1: number; x2: number; y2: number }[] = [];
    for (const e of edges) {
      const ids = resolveIds(e, nodes);
      if (!ids) continue;
      const a = positions.get(ids.from);
      const b = positions.get(ids.to);
      if (!a || !b) continue;
      links.push({
        key: String(e.id),
        x1: a.x + CARD_W,
        y1: a.y + CARD_H / 2,
        x2: b.x,
        y2: b.y + CARD_H / 2,
      });
    }
    if (links.length === 0 && ordered.length > 1) {
      for (let i = 0; i < ordered.length - 1; i++) {
        const a = positions.get(String(ordered[i].id))!;
        const b = positions.get(String(ordered[i + 1].id))!;
        links.push({
          key: `ghost-${i}`,
          x1: a.x + CARD_W,
          y1: a.y + CARD_H / 2,
          x2: b.x,
          y2: b.y + CARD_H / 2,
        });
      }
    }
    return { positions, width, height, links, ghost: edges.length === 0 && ordered.length > 1 };
  }, [ordered, edges, nodes]);

  if (isLoading && ordered.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/40 px-4 py-10 text-center text-xs text-muted-foreground">
        Armando el flujo…
      </div>
    );
  }

  if (ordered.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/70 bg-card/30 px-6 py-12 text-center space-y-3">
        <Sparkles className="h-6 w-6 text-primary mx-auto opacity-80" />
        <p className="text-sm text-muted-foreground">Sin nodos aún. Abrí el canvas para armar el grafo.</p>
        <Button size="sm" asChild>
          <Link to={`/workflows/${workflowId}`}>Abrir canvas</Link>
        </Button>
      </div>
    );
  }

  const markerId = `wf-preview-arrow-${workflowId}`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 via-background to-primary/[0.04]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--border) 80%, transparent) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden
      />
      <div className="relative flex items-center justify-between gap-2 px-4 pt-3 pb-1">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <GitBranch className="h-3.5 w-3.5 text-primary" />
          <span>
            {nodes.length} nodos · {edges.length} conexiones
            {layout.ghost ? " · vista en cadena" : ""}
          </span>
        </div>
        <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1 relative z-[1]" asChild>
          <Link to={`/workflows/${workflowId}`}>
            Abrir canvas
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>

      <div className="relative overflow-x-auto px-4 pb-5 pt-2">
        <div
          className="relative mx-auto"
          style={{ width: layout.width, height: layout.height, minWidth: "100%" }}
        >
          <svg
            className="absolute inset-0 pointer-events-none overflow-visible"
            width={layout.width}
            height={layout.height}
            aria-hidden
          >
            <defs>
              <marker
                id={markerId}
                markerWidth="7"
                markerHeight="7"
                refX="6"
                refY="3.5"
                orient="auto"
              >
                <path d="M0,0 L7,3.5 L0,7 Z" fill="#2dd4bf" fillOpacity="0.85" />
              </marker>
            </defs>
            {layout.links.map((l) => {
              const mx = (l.x1 + l.x2) / 2;
              const d = `M ${l.x1} ${l.y1} C ${mx} ${l.y1}, ${mx} ${l.y2}, ${l.x2} ${l.y2}`;
              return (
                <g key={l.key}>
                  <path
                    d={d}
                    fill="none"
                    stroke="#2dd4bf"
                    strokeOpacity={layout.ghost ? 0.25 : 0.45}
                    strokeWidth={2}
                    strokeDasharray={layout.ghost ? "5 5" : undefined}
                  />
                  <path
                    d={d}
                    fill="none"
                    stroke="#2dd4bf"
                    strokeOpacity={layout.ghost ? 0.5 : 0.85}
                    strokeWidth={2}
                    markerEnd={`url(#${markerId})`}
                  />
                </g>
              );
            })}
          </svg>

          {ordered.map((n, i) => {
            const pos = layout.positions.get(String(n.id))!;
            const meta = workflowNodeMeta(n.node_type);
            return (
              <motion.div
                key={n.id}
                initial={playEnter ? { opacity: 0, y: 8 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: playEnter ? 0.04 * i : 0, ease: "easeOut" }}
                className={cn(
                  "absolute rounded-xl border backdrop-blur-sm px-3 py-2.5",
                  "shadow-[0_0_0_1px_rgba(45,212,191,0.06)]",
                  "hover:shadow-[0_0_24px_-8px_rgba(45,212,191,0.35)] transition-shadow duration-200",
                  meta?.accentBg || "bg-card/90 border-border",
                )}
                style={{ left: pos.x, top: pos.y, width: CARD_W, height: CARD_H }}
              >
                <p
                  className={cn(
                    "text-[10px] font-semibold uppercase tracking-wider",
                    meta?.accent || "text-muted-foreground",
                  )}
                >
                  {meta?.label || n.node_type}
                </p>
                <p className="text-sm font-medium truncate mt-0.5 text-foreground">{n.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{n.node_key}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
