import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
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
import { toast } from "sonner";

export type FlowLinkMode = "requires" | "capture" | "prerequisites";

type BoardProps = {
  slots: SlotDraft[];
  skills: SkillRuleDraft[];
  linkMode: FlowLinkMode;
  layout?: Record<string, { x: number; y: number }> | null;
  onLayoutChange?: (layout: Record<string, { x: number; y: number }>) => void;
  onToggleRequires: (skillSlug: string, slotId: string) => void;
  onToggleCapture: (skillSlug: string, slotId: string) => void;
  onTogglePrerequisite: (skillSlug: string, otherSlug: string) => void;
  onEnableSkill: (skillSlug: string) => void;
  /** Llena el alto del contenedor (layout repisa + pizarra). */
  fillHeight?: boolean;
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

const COL = { slots: 40, skills: 440 };
const SLOT_W = 168;
const SKILL_W = 220;
const GAP_Y = 28;
const SLOT_H = 88;

/** Referencias estables: objetos inline en <ReactFlow> disparan loop en StoreUpdater. */
const PRO_OPTIONS = { hideAttribution: true } as const;
const DEFAULT_EDGE_OPTIONS = { type: "default" as const };
const FIT_VIEW_OPTS = { padding: 0.2, duration: 220 };

function estimateSkillHeight(sk: SkillRuleDraft): number {
  const tags = sk.requires.length + sk.capture.length;
  const tagRows = Math.ceil(Math.max(tags, 1) / 3);
  return 96 + tagRows * 24 + (tags > 0 ? 10 : 0);
}

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
    skills: skills.map((s) => [
      s.slug,
      s.name,
      s.enabled,
      s.requires,
      s.capture,
      s.prerequisites,
      s.prerequisitesAny,
    ]),
  });
}

/** Empuja nodos para que no se solapen verticalmente (por columna lógica). */
function unstackColumn(
  nodes: Node[],
  heights: Map<string, number>,
  columnX: number,
  colWidth: number,
) {
  const col = nodes
    .filter((n) => Math.abs(n.position.x - columnX) < colWidth * 0.75)
    .sort((a, b) => a.position.y - b.position.y || a.id.localeCompare(b.id));
  let y = 24;
  for (const n of col) {
    if (n.position.y < y) n.position = { ...n.position, y };
    y = n.position.y + (heights.get(n.id) ?? 96) + GAP_Y;
  }
}

/** Corrige solapes entre nodos del mismo tipo aunque estén fuera de la columna base. */
function unstackOverlapping(nodes: Node[], heights: Map<string, number>, type: "slot" | "skill") {
  const width = type === "slot" ? SLOT_W : SKILL_W;
  const group = nodes
    .filter((n) => n.type === type)
    .sort((a, b) => a.position.y - b.position.y || a.id.localeCompare(b.id));
  for (let i = 1; i < group.length; i++) {
    const cur = group[i]!;
    let minY = Number.NEGATIVE_INFINITY;
    for (let j = 0; j < i; j++) {
      const prev = group[j]!;
      const overlapX =
        prev.position.x < cur.position.x + width * 0.9 &&
        cur.position.x < prev.position.x + width * 0.9;
      if (!overlapX) continue;
      minY = Math.max(minY, prev.position.y + (heights.get(prev.id) ?? 96) + GAP_Y);
    }
    if (Number.isFinite(minY) && cur.position.y < minY) {
      cur.position = { ...cur.position, y: minY };
    }
  }
}

function buildGraph(
  slots: SlotDraft[],
  skills: SkillRuleDraft[],
  prevPositions: Map<string, { x: number; y: number }>,
  focusSkill: string | null,
  showIdle: boolean,
): { nodes: Node[]; edges: Edge[]; heights: Map<string, number> } {
  const visibleSkills = showIdle ? skills : skills.filter((s) => s.enabled);
  const linkCount = new Map<string, number>();
  const heights = new Map<string, number>();

  for (const sk of visibleSkills) {
    if (!sk.enabled) continue;
    for (const id of sk.requires) linkCount.set(id, (linkCount.get(id) ?? 0) + 1);
    for (const id of sk.capture) linkCount.set(id, (linkCount.get(id) ?? 0) + 1);
  }

  const orderedSlots = [...slots].sort((a, b) => {
    const ai = slugifySlotId(a.id);
    const bi = slugifySlotId(b.id);
    return (linkCount.get(bi) ?? 0) - (linkCount.get(ai) ?? 0) || ai.localeCompare(bi);
  });

  const nodes: Node[] = [];

  orderedSlots.forEach((s, i) => {
    const id = slugifySlotId(s.id) || `slot_${i}`;
    const nid = `slot:${id}`;
    heights.set(nid, SLOT_H);
    nodes.push({
      id: nid,
      type: "slot",
      position: prevPositions.get(nid) ?? { x: COL.slots, y: 24 + i * (SLOT_H + GAP_Y) },
      data: {
        label: id,
        ask: s.ask || "Sin pregunta",
        linkCount: linkCount.get(id) ?? 0,
      },
    });
  });

  visibleSkills.forEach((sk, i) => {
    const nid = `skill:${sk.slug}`;
    const h = estimateSkillHeight(sk);
    heights.set(nid, h);
    const focused = focusSkill === sk.slug;
    nodes.push({
      id: nid,
      type: "skill",
      position: prevPositions.get(nid) ?? { x: COL.skills, y: 24 + i * (h + GAP_Y) },
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

  // Nunca pisarse: reacomoda columnas y corrige solapes residuales.
  unstackColumn(nodes, heights, COL.slots, SLOT_W);
  unstackColumn(nodes, heights, COL.skills, SKILL_W);
  unstackOverlapping(nodes, heights, "slot");
  unstackOverlapping(nodes, heights, "skill");

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
    for (const pre of [...sk.prerequisites, ...sk.prerequisitesAny]) {
      if (focusSkill && focusSkill !== sk.slug && focusSkill !== pre) continue;
      const isAny = sk.prerequisitesAny.includes(pre);
      edges.push({
        id: `pre:${sk.slug}:${pre}`,
        source: `skill:${pre}`,
        sourceHandle: "out",
        target: `skill:${sk.slug}`,
        targetHandle: "pre",
        style: {
          stroke: "hsl(199 85% 52%)",
          strokeWidth: 2,
          opacity: 0.9,
          ...(isAny ? { strokeDasharray: "4 3" } : {}),
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "hsl(199 85% 52%)",
          width: 14,
          height: 14,
        },
      });
    }
  }

  return { nodes, edges, heights };
}

function linkModeStroke(mode: FlowLinkMode): string {
  if (mode === "capture") return "hsl(168 72% 42%)";
  if (mode === "prerequisites") return "hsl(199 85% 52%)";
  return "hsl(38 92% 52%)";
}

function BoardCanvas({
  slots,
  skills,
  linkMode,
  layout,
  onLayoutChange,
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
  const appliedSigRef = useRef<string | null>(null);
  const layoutKeyRef = useRef<string | null>(null);
  const readyRef = useRef(false);
  const appliedLayoutJsonRef = useRef<string>("");

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Aplicar layout guardado (carga / reset / refetch).
  useEffect(() => {
    const json = JSON.stringify(layout ?? {});
    if (json === appliedLayoutJsonRef.current) return;
    appliedLayoutJsonRef.current = json;
    if (layout && Object.keys(layout).length > 0) {
      for (const [id, pos] of Object.entries(layout)) {
        positionsRef.current.set(id, { x: pos.x, y: pos.y });
      }
    }
    appliedSigRef.current = null;
  }, [layout]);

  useEffect(() => {
    if (appliedSigRef.current === signature) return;
    appliedSigRef.current = signature;

    const next = buildGraph(slots, skills, positionsRef.current, focusSkill, showIdle);
    for (const n of next.nodes) positionsRef.current.set(n.id, n.position);
    setNodes(next.nodes);
    setEdges(next.edges);

    const layoutKey = graphSignature(slots, skills, null, showIdle);
    if (readyRef.current && layoutKeyRef.current !== layoutKey && next.nodes.length > 0) {
      layoutKeyRef.current = layoutKey;
      requestAnimationFrame(() => {
        fitView(FIT_VIEW_OPTS);
      });
    } else if (!layoutKeyRef.current) {
      layoutKeyRef.current = layoutKey;
    }
  }, [signature, slots, skills, focusSkill, showIdle, setNodes, setEdges, fitView]);

  const emitLayout = useCallback(() => {
    if (!onLayoutChange) return;
    const next: Record<string, { x: number; y: number }> = {};
    for (const [id, pos] of positionsRef.current) next[id] = pos;
    appliedLayoutJsonRef.current = JSON.stringify(next);
    onLayoutChange(next);
  }, [onLayoutChange]);

  const onInit = useCallback(() => {
    readyRef.current = true;
    if (positionsRef.current.size > 0) {
      requestAnimationFrame(() => fitView(FIT_VIEW_OPTS));
    }
  }, [fitView]);

  const onNodeDragStop = useCallback(
    (_: unknown, node: Node) => {
      positionsRef.current.set(node.id, { ...node.position });
      // Re-unstack la columna afectada para que no queden pisados tras soltar.
      const heights = new Map<string, number>();
      for (const n of nodes) {
        if (n.type === "slot") heights.set(n.id, SLOT_H);
        else {
          const sk = skills.find((s) => `skill:${s.slug}` === n.id);
          heights.set(n.id, sk ? estimateSkillHeight(sk) : 96);
        }
      }
      const updated = nodes.map((n) =>
        n.id === node.id ? { ...n, position: { ...node.position } } : { ...n },
      );
      const colX = node.id.startsWith("slot:") ? COL.slots : COL.skills;
      const colW = node.id.startsWith("slot:") ? SLOT_W : SKILL_W;
      unstackColumn(updated, heights, colX, colW);
      unstackOverlapping(updated, heights, node.id.startsWith("slot:") ? "slot" : "skill");
      for (const n of updated) positionsRef.current.set(n.id, n.position);
      setNodes(updated);
      emitLayout();
    },
    [emitLayout, nodes, setNodes, skills],
  );

  const onNodeClick = useCallback(
    (_: MouseEvent, node: Node) => {
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

  const isValidConnection = useCallback(
    (connection: Connection | Edge) => {
      const source = connection.source || "";
      const target = connection.target || "";
      if (!source || !target || source === target) return false;
      if (linkMode === "prerequisites") {
        return source.startsWith("skill:") && target.startsWith("skill:");
      }
      return source.startsWith("slot:") && target.startsWith("skill:");
    },
    [linkMode],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const source = connection.source || "";
      const target = connection.target || "";
      if (!source || !target) return;

      if (linkMode === "prerequisites") {
        if (source.startsWith("skill:") && target.startsWith("skill:") && source !== target) {
          onEnableSkill(target.slice(6));
          onTogglePrerequisite(target.slice(6), source.slice(6));
          return;
        }
        toast.message("Modo Antes: uní skill → skill (asa derecha → asa superior).");
        return;
      }

      if (source.startsWith("slot:") && target.startsWith("skill:")) {
        const slotId = source.slice(5);
        const skillSlug = target.slice(6);
        onEnableSkill(skillSlug);
        if (linkMode === "capture") onToggleCapture(skillSlug, slotId);
        else onToggleRequires(skillSlug, slotId);
        return;
      }

      toast.message(
        linkMode === "capture"
          ? "Modo Recordar: arrastra desde un Dato hacia una Skill."
          : "Modo Obligatorio: arrastra desde un Dato hacia una Skill.",
      );
    },
    [linkMode, onEnableSkill, onToggleCapture, onTogglePrerequisite, onToggleRequires],
  );

  const onEdgeClick = useCallback(
    (_: MouseEvent, edge: Edge) => {
      const [kind, skillSlug, other] = edge.id.split(":");
      if (!skillSlug || !other) return;
      if (kind === "req") onToggleRequires(skillSlug, other);
      else if (kind === "cap") onToggleCapture(skillSlug, other);
      else if (kind === "pre") onTogglePrerequisite(skillSlug, other);
    },
    [onToggleCapture, onTogglePrerequisite, onToggleRequires],
  );

  const minimapNodeColor = useCallback(
    (n: Node) => (n.type === "slot" ? "#d97706" : "#2dd4bf"),
    [],
  );

  const connectionLineStyle = useMemo(
    () => ({
      stroke: linkModeStroke(linkMode),
      strokeWidth: 2,
      ...(linkMode === "capture" ? { strokeDasharray: "5 4" } : {}),
    }),
    [linkMode],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onInit={onInit}
      onNodeDragStop={onNodeDragStop}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      onConnect={onConnect}
      onEdgeClick={onEdgeClick}
      isValidConnection={isValidConnection}
      connectionLineStyle={connectionLineStyle}
      nodeTypes={NODE_TYPES}
      colorMode="dark"
      proOptions={PRO_OPTIONS}
      defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
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
        nodeColor={minimapNodeColor}
        maskColor="rgba(0,0,0,0.55)"
      />
    </ReactFlow>
  );
}

export function FlowPolicyBoard(props: BoardProps) {
  const { fillHeight = false, ...boardProps } = props;
  const [focusSkill, setFocusSkill] = useState<string | null>(null);
  // Solo skills con reglas (enabled). Las Off no aparecen en la pizarra.
  const showIdle = false;
  const empty = boardProps.slots.length === 0 && boardProps.skills.every((s) => !s.enabled);
  const enabledCount = boardProps.skills.filter((s) => s.enabled).length;

  if (empty) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/15 px-6 text-center",
          fillHeight ? "h-full min-h-[560px]" : "h-[420px]",
        )}
      >
        <p className="max-w-sm text-sm text-muted-foreground">
          Activá una <strong className="text-foreground/80">skill</strong> en la repisa o uní un
          dato con una skill. Arrastrá desde los puntos según el modo (Obligatorio / Recordar /
          Antes).
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", fillHeight && "flex h-full min-h-0 flex-col")}>
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 bg-muted/15 px-3 py-2 text-[11px] shrink-0">
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
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <span className="h-0.5 w-4 rounded border-t border-dashed border-sky-400 bg-transparent" />{" "}
          Antes (alguna)
        </span>
        <span className="ml-auto text-muted-foreground/80 tabular-nums">
          {enabledCount} skill{enabledCount === 1 ? "" : "s"} en pizarra
        </span>
        {focusSkill ? (
          <button
            type="button"
            className="text-primary underline-offset-2 hover:underline"
            onClick={() => setFocusSkill(null)}
          >
            Ver todas las líneas
          </button>
        ) : (
          <span className="text-muted-foreground/80 hidden sm:inline">
            Clic en skill para enfocar · arrastra para unir
          </span>
        )}
      </div>

      <div
        className={cn(
          "overflow-hidden rounded-xl border border-border/70 bg-[#0b1210]",
          fillHeight ? "min-h-0 flex-1 h-full" : "h-[min(70vh,720px)]",
        )}
      >
        <ReactFlowProvider>
          <BoardCanvas
            {...boardProps}
            focusSkill={focusSkill}
            showIdle={showIdle}
            onFocusSkill={setFocusSkill}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
