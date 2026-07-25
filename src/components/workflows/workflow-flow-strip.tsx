import { memo, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, GitBranch, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { WorkflowEdge, WorkflowNode } from "@/api/hooks/useWorkflows";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { motionTokens } from "@/lib/motion";
import { orderNodes as orderNodeIds, resolveEdgeNodeId } from "@/lib/workflowGraph";
import { workflowNodeMeta } from "@/lib/workflowCatalog";
import { cn } from "@/lib/utils";

const CARD_W = 168;
const CARD_H = 72;
const GAP = 56;
const PRIMARY_STROKE = "var(--primary)";

type Props = {
  workflowId: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  isLoading?: boolean;
};

function WorkflowFlowStripInner({ workflowId, nodes, edges, isLoading }: Props) {
  const reduceMotion = useMotionPrefs();
  /** Animación de entrada solo la primera vez que hay nodos (evita parpadeo en refetch). */
  const enteredRef = useRef(false);
  const ordered = useMemo(() => {
    if (nodes.length <= 1) return nodes;
    const byId = new Map(nodes.map((n) => [String(n.id), n]));
    const ids = orderNodeIds(nodes, edges);
    const orderedNodes = ids.map((id) => byId.get(id)).filter((n): n is WorkflowNode => !!n);
    if (orderedNodes.length === nodes.length) return orderedNodes;
    return [...nodes].sort(
      (a, b) => (a.position_x ?? 0) - (b.position_x ?? 0) || a.name.localeCompare(b.name),
    );
  }, [nodes, edges]);
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
      const from = resolveEdgeNodeId(e, "from", nodes);
      const to = resolveEdgeNodeId(e, "to", nodes);
      if (!from || !to) continue;
      const a = positions.get(from);
      const b = positions.get(to);
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
      <EmptyState
        className="rounded-2xl py-12"
        icon={<Sparkles className="h-5 w-5" aria-hidden />}
        title="Sin nodos aún"
        description="Abrí el canvas para armar el grafo."
        action={
          <Button size="sm" asChild>
            <Link to={`/workflows/${workflowId}`}>Abrir canvas</Link>
          </Button>
        }
      />
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
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-[11px] gap-1 relative z-[1]"
          asChild
        >
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
                <path d="M0,0 L7,3.5 L0,7 Z" fill={PRIMARY_STROKE} fillOpacity="0.85" />
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
                    stroke={PRIMARY_STROKE}
                    strokeOpacity={layout.ghost ? 0.25 : 0.45}
                    strokeWidth={2}
                    strokeDasharray={layout.ghost ? "5 5" : undefined}
                  />
                  <path
                    d={d}
                    fill="none"
                    stroke={PRIMARY_STROKE}
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
                transition={{
                  duration: motionTokens.base,
                  delay: playEnter ? motionTokens.stagger * i : 0,
                  ease: motionTokens.easeOut,
                }}
                className={cn(
                  "absolute rounded-xl border backdrop-blur-sm px-3 py-2.5",
                  "shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_6%,transparent)]",
                  "hover:shadow-[0_0_24px_-8px_color-mix(in_oklab,var(--primary)_35%,transparent)] transition-shadow duration-motion-base",
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

export const WorkflowFlowStrip = memo(WorkflowFlowStripInner);
