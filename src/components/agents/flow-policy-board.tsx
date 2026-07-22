import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  MarkerType,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";
import type { SkillRuleDraft, SlotDraft } from "@/lib/flowPolicy";
import { slugifySlotId } from "@/lib/flowPolicy";

export type FlowLinkMode = "requires" | "capture" | "prerequisites";

type BoardProps = {
  slots: SlotDraft[];
  skills: SkillRuleDraft[];
  linkMode: FlowLinkMode;
  onToggleRequires: (skillSlug: string, slotId: string) => void;
  onToggleCapture: (skillSlug: string, slotId: string) => void;
  onTogglePrerequisite: (skillSlug: string, otherSlug: string) => void;
  onEnableSkill: (skillSlug: string) => void;
};

type SlotNodeData = { label: string; ask: string; linkCount: number };
type SkillNodeData = {
  label: string;
  slug: string;
  enabled: boolean;
  requires: string[];
  capture: string[];
  focused: boolean;
  dimmed: boolean;
};

const COL = { slots: 32, skills: 420 };
const ROW_SLOT = 96;
const ROW_SKILL = 118;

function SlotNode({ data }: NodeProps<Node<SlotNodeData>>) {
  return (
    <div className="w-[168px] rounded-xl border border-amber-500/40 bg-[#121a16] px-3 py-2 shadow-md">
      <div className="flex items-center justify-between gap-1">
        <p className="text-[9px] font-semibold uppercase tracking-wide text-amber-300/90">Dato</p>
        {data.linkCount > 0 && (
          <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[9px] tabular-nums text-amber-200/90">
            {data.linkCount}
          </span>
        )}
      </div>
      <p className="truncate font-mono text-[12px] font-semibold text-foreground">{data.label}</p>
      <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-muted-foreground">
        {data.ask}
      </p>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2.5 !w-2.5 !border-amber-400 !bg-amber-500"
      />
    </div>
  );
}

function SkillNode({ data }: NodeProps<Node<SkillNodeData>>) {
  return (
    <div
      className={cn(
        "w-[220px] rounded-xl border px-3 py-2.5 shadow-md transition-opacity",
        data.enabled ? "border-primary/45 bg-[#0f1c19]" : "border-border/50 bg-muted/30 opacity-55",
        data.dimmed && "opacity-35",
        data.focused && "ring-2 ring-primary/50",
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className="!h-2.5 !w-2.5 !border-primary !bg-primary"
      />
      <p className="text-[9px] font-semibold uppercase tracking-wide text-primary/90">Skill</p>
      <p className="text-[12px] font-semibold leading-snug text-foreground line-clamp-2">
        {data.label}
      </p>
      <p className="mt-0.5 truncate font-mono text-[9px] text-muted-foreground">{data.slug}</p>
      {(data.requires.length > 0 || data.capture.length > 0) && (
        <div className="mt-2 space-y-1">
          {data.requires.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {data.requires.map((r) => (
                <span
                  key={`r-${r}`}
                  className="rounded border border-amber-500/35 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[8px] text-amber-200"
                >
                  {r}
                </span>
              ))}
            </div>
          )}
          {data.capture.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {data.capture.map((r) => (
                <span
                  key={`c-${r}`}
                  className="rounded border border-primary/35 bg-primary/10 px-1.5 py-0.5 font-mono text-[8px] text-primary"
                >
                  ·{r}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="!h-2.5 !w-2.5 !border-sky-400 !bg-sky-500"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="pre"
        className="!h-2.5 !w-2.5 !border-sky-400 !bg-sky-500"
      />
    </div>
  );
}

const NODE_TYPES = { slot: SlotNode, skill: SkillNode };

function graphSignature(
  slots: SlotDraft[],
  skills: SkillRuleDraft[],
  focusSkill: string | null,
  showIdle: boolean,
): string {
  return JSON.stringify({
    focusSkill,
    showIdle,
    slots: slots.map((s) => [slugifySlotId(s.id), s.ask]),
    skills: skills.map((s) => [s.slug, s.name, s.enabled, s.requires, s.capture, s.prerequisites]),
  });
}

function buildGraph(
  slots: SlotDraft[],
  skills: SkillRuleDraft[],
  prevPositions: Map<string, { x: number; y: number }>,
  focusSkill: string | null,
  showIdle: boolean,
): { nodes: Node[]; edges: Edge[] } {
  const visibleSkills = showIdle ? skills : skills.filter((s) => s.enabled);
  const linkCount = new Map<string, number>();

  for (const sk of visibleSkills) {
    if (!sk.enabled) continue;
    for (const id of sk.requires) linkCount.set(id, (linkCount.get(id) ?? 0) + 1);
    for (const id of sk.capture) linkCount.set(id, (linkCount.get(id) ?? 0) + 1);
  }

  // Datos más usados arriba (más legible en policies densas como WM).
  const orderedSlots = [...slots].sort((a, b) => {
    const ai = slugifySlotId(a.id);
    const bi = slugifySlotId(b.id);
    return (linkCount.get(bi) ?? 0) - (linkCount.get(ai) ?? 0) || ai.localeCompare(bi);
  });

  const nodes: Node[] = [];

  orderedSlots.forEach((s, i) => {
    const id = slugifySlotId(s.id) || `slot_${i}`;
    const nid = `slot:${id}`;
    nodes.push({
      id: nid,
      type: "slot",
      position: prevPositions.get(nid) ?? { x: COL.slots, y: 28 + i * ROW_SLOT },
      data: {
        label: id,
        ask: s.ask || "Sin pregunta",
        linkCount: linkCount.get(id) ?? 0,
      },
    });
  });

  visibleSkills.forEach((sk, i) => {
    const nid = `skill:${sk.slug}`;
    const focused = focusSkill === sk.slug;
    nodes.push({
      id: nid,
      type: "skill",
      position: prevPositions.get(nid) ?? { x: COL.skills, y: 28 + i * ROW_SKILL },
      data: {
        label: sk.name,
        slug: sk.slug,
        enabled: sk.enabled,
        requires: sk.requires,
        capture: sk.capture,
        focused,
        dimmed: Boolean(focusSkill && !focused),
      },
    });
  });

  const edges: Edge[] = [];
  const edgeVisible = (skillSlug: string) => !focusSkill || focusSkill === skillSlug;

  for (const sk of visibleSkills) {
    if (!sk.enabled || !edgeVisible(sk.slug)) continue;

    const captureOnly = new Set(sk.capture);
    for (const slotId of sk.requires) {
      const alsoCap = captureOnly.has(slotId);
      if (alsoCap) captureOnly.delete(slotId);
      edges.push({
        id: `req:${sk.slug}:${slotId}`,
        source: `slot:${slotId}`,
        target: `skill:${sk.slug}`,
        targetHandle: "in",
        // Sin label: la leyenda evita el amontonamiento de WM.
        style: {
          stroke: "hsl(38 92% 52%)",
          strokeWidth: alsoCap ? 2.4 : 1.8,
          opacity: 0.85,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "hsl(38 92% 52%)",
          width: 14,
          height: 14,
        },
      });
    }
    for (const slotId of captureOnly) {
      edges.push({
        id: `cap:${sk.slug}:${slotId}`,
        source: `slot:${slotId}`,
        target: `skill:${sk.slug}`,
        targetHandle: "in",
        style: {
          stroke: "hsl(168 72% 42%)",
          strokeWidth: 1.5,
          strokeDasharray: "5 4",
          opacity: 0.7,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "hsl(168 72% 42%)",
          width: 12,
          height: 12,
        },
      });
    }
    for (const pre of sk.prerequisites) {
      if (focusSkill && focusSkill !== sk.slug && focusSkill !== pre) continue;
      edges.push({
        id: `pre:${sk.slug}:${pre}`,
        source: `skill:${pre}`,
        sourceHandle: "out",
        target: `skill:${sk.slug}`,
        targetHandle: "pre",
        style: { stroke: "hsl(199 85% 52%)", strokeWidth: 2, opacity: 0.9 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "hsl(199 85% 52%)",
          width: 14,
          height: 14,
        },
      });
    }
  }

  return { nodes, edges };
}

function BoardCanvas({
  slots,
  skills,
  linkMode,
  focusSkill,
  showIdle,
  onToggleRequires,
  onToggleCapture,
  onTogglePrerequisite,
  onEnableSkill,
  onFocusSkill,
}: BoardProps & {
  focusSkill: string | null;
  showIdle: boolean;
  onFocusSkill: (slug: string | null) => void;
}) {
  const { fitView } = useReactFlow();
  const signature = useMemo(
    () => graphSignature(slots, skills, focusSkill, showIdle),
    [slots, skills, focusSkill, showIdle],
  );
  const positionsRef = useRef(new Map<string, { x: number; y: number }>());
  const fittedSigRef = useRef<string | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    const next = buildGraph(slots, skills, positionsRef.current, focusSkill, showIdle);
    for (const n of next.nodes) positionsRef.current.set(n.id, n.position);
    setNodes(next.nodes);
    setEdges(next.edges);

    // Re-encuadrar solo cuando cambia el set de nodos (no al enfocar).
    const layoutKey = graphSignature(slots, skills, null, showIdle);
    if (fittedSigRef.current !== layoutKey && next.nodes.length > 0) {
      fittedSigRef.current = layoutKey;
      requestAnimationFrame(() => fitView({ padding: 0.18, duration: 220 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync por firma
  }, [signature]);

  const onNodeDragStop = useCallback((_: unknown, node: Node) => {
    positionsRef.current.set(node.id, node.position);
  }, []);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (!node.id.startsWith("skill:")) {
        onFocusSkill(null);
        return;
      }
      const slug = node.id.slice(6);
      onFocusSkill(focusSkill === slug ? null : slug);
    },
    [focusSkill, onFocusSkill],
  );

  const onPaneClick = useCallback(() => onFocusSkill(null), [onFocusSkill]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const source = connection.source || "";
      const target = connection.target || "";
      if (!source || !target) return;

      if (source.startsWith("slot:") && target.startsWith("skill:")) {
        const slotId = source.slice(5);
        const skillSlug = target.slice(6);
        onEnableSkill(skillSlug);
        if (linkMode === "capture") onToggleCapture(skillSlug, slotId);
        else onToggleRequires(skillSlug, slotId);
        return;
      }

      if (source.startsWith("skill:") && target.startsWith("skill:") && source !== target) {
        onEnableSkill(target.slice(6));
        onTogglePrerequisite(target.slice(6), source.slice(6));
      }
    },
    [linkMode, onEnableSkill, onToggleCapture, onTogglePrerequisite, onToggleRequires],
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      const [kind, skillSlug, other] = edge.id.split(":");
      if (!skillSlug || !other) return;
      if (kind === "req") onToggleRequires(skillSlug, other);
      else if (kind === "cap") onToggleCapture(skillSlug, other);
      else if (kind === "pre") onTogglePrerequisite(skillSlug, other);
    },
    [onToggleCapture, onTogglePrerequisite, onToggleRequires],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeDragStop={onNodeDragStop}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      onConnect={onConnect}
      onEdgeClick={onEdgeClick}
      nodeTypes={NODE_TYPES}
      colorMode="dark"
      proOptions={{ hideAttribution: true }}
      defaultEdgeOptions={{ type: "bezier" }}
      deleteKeyCode={null}
      nodesDraggable
      elementsSelectable
      minZoom={0.35}
      maxZoom={1.6}
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1a2420" />
      <Controls className="!border-border !bg-card !shadow-md" />
      <MiniMap
        className="!border-border !bg-card/90"
        nodeColor={(n) => (n.type === "slot" ? "#d97706" : "#2dd4bf")}
        maskColor="rgba(0,0,0,0.55)"
      />
    </ReactFlow>
  );
}

export function FlowPolicyBoard(props: BoardProps) {
  const [focusSkill, setFocusSkill] = useState<string | null>(null);
  const [showIdle, setShowIdle] = useState(false);
  const empty = props.slots.length === 0 && props.skills.length === 0;
  const enabledCount = props.skills.filter((s) => s.enabled).length;

  if (empty) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/15 px-6 text-center">
        <p className="max-w-sm text-sm text-muted-foreground">
          Creá al menos un <strong className="text-foreground/80">dato</strong> y asigná skills al
          agente. Acá vas a ver cajas y podés unirlas arrastrando desde los puntos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 bg-muted/15 px-3 py-2 text-[11px]">
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <span className="h-0.5 w-4 rounded bg-amber-500" /> Obligatorio
        </span>
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <span className="h-0.5 w-4 rounded border-t border-dashed border-primary bg-transparent" />{" "}
          Recordar
        </span>
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <span className="h-0.5 w-4 rounded bg-sky-500" /> Antes
        </span>
        <label className="ml-auto inline-flex cursor-pointer items-center gap-1.5 text-muted-foreground">
          <input
            type="checkbox"
            className="accent-primary"
            checked={showIdle}
            onChange={(e) => setShowIdle(e.target.checked)}
          />
          Skills sin reglas ({props.skills.length - enabledCount})
        </label>
        {focusSkill ? (
          <button
            type="button"
            className="text-primary underline-offset-2 hover:underline"
            onClick={() => setFocusSkill(null)}
          >
            Ver todas las líneas
          </button>
        ) : (
          <span className="text-muted-foreground/80">Clic en una skill para enfocarla</span>
        )}
      </div>

      <div className="h-[min(620px,72vh)] overflow-hidden rounded-xl border border-border/70 bg-[#0b1210]">
        <ReactFlowProvider>
          <BoardCanvas
            {...props}
            focusSkill={focusSkill}
            showIdle={showIdle}
            onFocusSkill={setFocusSkill}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
