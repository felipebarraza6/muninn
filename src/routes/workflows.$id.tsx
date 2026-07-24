import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Copy, Link2, Loader2, Pencil, Play, Save, StretchHorizontal, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  WorkflowNodePalette,
  WF_PALETTE_MIME,
} from "@/components/workflows/workflow-node-palette";
import { WorkflowNodeConfigForm } from "@/components/workflows/workflow-node-config-form";
import {
  useCreateWorkflowEdge,
  useCreateWorkflowNode,
  useDeleteWorkflowEdge,
  useDeleteWorkflowNode,
  useExecuteWorkflow,
  useUpdateWorkflowNode,
  useWorkflow,
  useWorkflowExecution,
  useWorkflowExecutions,
  type WorkflowExecutionLog,
  type WorkflowNode,
  type WorkflowNodeType,
} from "@/api/hooks/useWorkflows";
import { apiErrorMessage } from "@/lib/apiError";
import { cn } from "@/lib/utils";
import {
  WORKFLOW_NODE_CATALOG,
  slugifyNodeKey,
  workflowNodeLabel,
  workflowNodeMeta,
} from "@/lib/workflowCatalog";

const NODE_W = 180;
const NODE_H = 56;
/** Hex directo: --primary es #2dd4bf; hsl(var(--primary)) rompe el stroke SVG. */
const EDGE_STROKE = "#2dd4bf";
const EDGE_SUCCESS = "#34d399";
const EDGE_FAILED = "#f87171";
const COL_GAP = 320; // separación horizontal entre nodos (~140px libres)
const ROW_GAP = 140;
const VIEW_PAD_X = 48;
const VIEW_PAD_Y = 56;

type SidePanelTab = "node" | "console";
type NodeRunStatus = "idle" | "pending" | "running" | "success" | "failed" | "skipped";

function normalizeRunStatus(status?: string): NodeRunStatus {
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

function buildNodeRunMap(
  logs: WorkflowExecutionLog[] | undefined,
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
    map.set(nodeId, normalizeRunStatus(log.status));
  }
  return map;
}

function resolveEdgeNodeId(
  e: { from_node?: string; to_node?: string; from_node_key?: string; to_node_key?: string },
  side: "from" | "to",
  nodes: { id: string; node_key: string }[],
): string {
  const direct = side === "from" ? e.from_node : e.to_node;
  if (direct != null && String(direct).trim() !== "") return String(direct);
  const key = side === "from" ? e.from_node_key : e.to_node_key;
  if (!key) return "";
  const hit = nodes.find((n) => n.node_key === key);
  return hit ? String(hit.id) : "";
}

function shortError(message: string, max = 160): { head: string; rest: string } {
  const trimmed = message.trim();
  const nl = trimmed.indexOf("\n");
  const first = (nl >= 0 ? trimmed.slice(0, nl) : trimmed).trim();
  if (first.length <= max && nl < 0) return { head: first, rest: "" };
  if (first.length <= max) return { head: first, rest: trimmed.slice(nl + 1).trim() };
  return { head: `${first.slice(0, max)}…`, rest: trimmed };
}

/** Orden topológico por capas (trigger → … → fin). */
function layeredNodeOrder(
  nodes: { id: string; node_key: string; node_type?: string }[],
  edges: {
    from_node?: string;
    to_node?: string;
    from_node_key?: string;
    to_node_key?: string;
  }[],
): string[][] {
  const ids = nodes.map((n) => String(n.id));
  const idSet = new Set(ids);
  const outgoing = new Map<string, string[]>();
  const indeg = new Map<string, number>();
  for (const id of ids) {
    outgoing.set(id, []);
    indeg.set(id, 0);
  }
  for (const e of edges) {
    const from = resolveEdgeNodeId(e, "from", nodes);
    const to = resolveEdgeNodeId(e, "to", nodes);
    if (!from || !to || !idSet.has(from) || !idSet.has(to) || from === to) continue;
    outgoing.get(from)!.push(to);
    indeg.set(to, (indeg.get(to) || 0) + 1);
  }

  const layers: string[][] = [];
  const remaining = new Map(indeg);
  let frontier = ids.filter((id) => (remaining.get(id) || 0) === 0);
  frontier.sort((a, b) => {
    const na = nodes.find((n) => String(n.id) === a);
    const nb = nodes.find((n) => String(n.id) === b);
    const sa = na?.node_type === "trigger" ? 0 : 1;
    const sb = nb?.node_type === "trigger" ? 0 : 1;
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

function isLayoutCramped(pos: Record<string, { x: number; y: number }>): boolean {
  const pts = Object.values(pos);
  if (pts.length < 2) return false;
  const sorted = [...pts].sort((a, b) => a.x - b.x || a.y - b.y);
  let minGap = Infinity;
  for (let i = 1; i < sorted.length; i++) {
    const gap = sorted[i].x - (sorted[i - 1].x + NODE_W);
    minGap = Math.min(minGap, gap);
  }
  const minX = Math.min(...pts.map((p) => p.x));
  const minY = Math.min(...pts.map((p) => p.y));
  // Pegados al origen o con hueco horizontal chico
  return minGap < 72 || (minX < 60 && minY < 60 && pts.length >= 2);
}

function layoutCenteredFlow(
  nodes: {
    id: string;
    node_key: string;
    node_type?: string;
    position_x?: number;
    position_y?: number;
  }[],
  edges: {
    from_node?: string;
    to_node?: string;
    from_node_key?: string;
    to_node_key?: string;
  }[],
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

function pretty(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export default function WorkflowCanvasPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: workflow, isLoading, error, refetch } = useWorkflow(id);
  const { data: executions = [] } = useWorkflowExecutions(id);
  const updateNode = useUpdateWorkflowNode();
  const createNode = useCreateWorkflowNode();
  const createEdge = useCreateWorkflowEdge();
  const deleteEdge = useDeleteWorkflowEdge();
  const deleteNode = useDeleteWorkflowNode();
  const execute = useExecuteWorkflow();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftConfig, setDraftConfig] = useState<Record<string, unknown>>({});
  const [showRawJson, setShowRawJson] = useState(false);
  const [rawJsonText, setRawJsonText] = useState("{}");
  const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(null);
  const [sideTab, setSideTab] = useState<SidePanelTab>("console");
  const [linkMode, setLinkMode] = useState(false);
  const [linkFromId, setLinkFromId] = useState<string | null>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const [paletteCollapsed, setPaletteCollapsed] = useState(false);
  const { data: executionDetail, isLoading: executionDetailLoading } = useWorkflowExecution(
    selectedExecutionId || undefined,
  );
  const dragRef = useRef<{ id: string; ox: number; oy: number; sx: number; sy: number } | null>(
    null,
  );
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [viewport, setViewport] = useState({ w: 960, h: 640 });
  const layoutAppliedFor = useRef<string | null>(null);

  const nodes = useMemo(
    () => (workflow?.nodes ?? []).filter((n) => n.is_active !== false),
    [workflow?.nodes],
  );
  const edges = useMemo(
    () => (workflow?.edges ?? []).filter((e) => e.is_active !== false),
    [workflow?.edges],
  );

  const removeNode = async (nodeId: string) => {
    if (!workflow) return;
    const related = edges.filter((e) => {
      const from = resolveEdgeNodeId(e, "from", nodes);
      const to = resolveEdgeNodeId(e, "to", nodes);
      return from === nodeId || to === nodeId;
    });
    try {
      // Borrar edges primero (por si el backend aún soft-deletea el nodo)
      for (const e of related) {
        try {
          await deleteEdge.mutateAsync({ id: String(e.id), workflow: workflow.id });
        } catch {
          // edge ya ausente / soft-deleted
        }
      }
      try {
        await deleteNode.mutateAsync({ id: nodeId, workflow: workflow.id });
      } catch (err) {
        const msg = apiErrorMessage(err, "");
        // Nodo ya soft-deleted o hard-deleted: tratar como OK
        if (!/does not exist|matches the given query|404|not found/i.test(msg)) {
          throw err;
        }
      }
      setSelectedNodeId((cur) => (cur === nodeId ? null : cur));
      setPositions((prev) => {
        const next = { ...prev };
        delete next[nodeId];
        return next;
      });
      toast.success("Nodo eliminado");
      await refetch();
    } catch (err) {
      toast.error(apiErrorMessage(err, "No se pudo eliminar el nodo"));
      void refetch();
    }
  };

  const cloneNode = (node: WorkflowNode) => {
    if (!workflow) return;
    const pos = positions[String(node.id)] ?? {
      x: Number(node.position_x ?? 40),
      y: Number(node.position_y ?? 40),
    };
    const x = pos.x + 36;
    const y = pos.y + 36;
    const name = `${node.name} (copia)`;
    createNode.mutate(
      {
        workflow: workflow.id,
        node_type: node.node_type,
        node_key: slugifyNodeKey(name, node.node_type),
        name,
        position_x: Math.round(x),
        position_y: Math.round(y),
        config: node.config ?? {},
      },
      {
        onSuccess: (created) => {
          toast.success("Nodo clonado");
          setSelectedNodeId(String(created.id));
          setSideTab("node");
          setPositions((prev) => ({
            ...prev,
            [String(created.id)]: { x: Math.round(x), y: Math.round(y) },
          }));
          void refetch();
        },
        onError: (e) => toast.error(apiErrorMessage(e, "No se pudo clonar")),
      },
    );
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (linkFromId || linkMode) {
          setLinkFromId(null);
          setLinkMode(false);
          setPointer(null);
          return;
        }
        const t = e.target as HTMLElement | null;
        if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
        navigate("/workflows");
        return;
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        const t = e.target as HTMLElement | null;
        if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
        if (!selectedNodeId) return;
        e.preventDefault();
        void removeNode(selectedNodeId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, linkFromId, linkMode, selectedNodeId, workflow, edges, nodes]);

  useEffect(() => {
    if (selectedExecutionId || executions.length === 0) return;
    setSelectedExecutionId(String(executions[0].id));
  }, [executions, selectedExecutionId]);

  const prevExecutePending = useRef(false);
  useEffect(() => {
    if (prevExecutePending.current && !execute.isPending && execute.isSuccess && executions[0]) {
      setSelectedExecutionId(String(executions[0].id));
    }
    prevExecutePending.current = execute.isPending;
  }, [execute.isPending, execute.isSuccess, executions]);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const measure = () => {
      setViewport({
        w: Math.max(320, el.clientWidth),
        h: Math.max(240, el.clientHeight),
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [workflow?.id]);

  useEffect(() => {
    if (!workflow?.id || nodes.length === 0) {
      setPositions({});
      layoutAppliedFor.current = null;
      return;
    }
    const sig = `${workflow.id}|${nodes.map((n) => n.id).join(",")}|${edges.map((e) => e.id).join(",")}`;
    if (layoutAppliedFor.current === sig) return;
    layoutAppliedFor.current = sig;
    // Esperar a que el canvas tenga tamaño real
    requestAnimationFrame(() => {
      const el = canvasRef.current;
      const vp = {
        w: Math.max(320, el?.clientWidth || viewport.w),
        h: Math.max(240, el?.clientHeight || viewport.h),
      };
      setViewport(vp);
      setPositions(layoutCenteredFlow(nodes, edges, vp, true));
    });
  }, [workflow?.id, nodes, edges]);

  const organizeFlow = () => {
    const next = layoutCenteredFlow(nodes, edges, viewport, true);
    setPositions(next);
    layoutAppliedFor.current = `${workflow?.id}|${nodes.map((n) => n.id).join(",")}|${edges.map((e) => e.id).join(",")}`;
    for (const [nid, pos] of Object.entries(next)) {
      updateNode.mutate({
        id: nid,
        position_x: Math.round(pos.x),
        position_y: Math.round(pos.y),
      });
    }
    toast.success("Flujo centrado y separado");
  };

  const addNode = (type: WorkflowNodeType, at?: { x: number; y: number }) => {
    if (!workflow) return;
    const catalog = WORKFLOW_NODE_CATALOG.find((c) => c.type === type);
    const name = catalog?.defaultName || type;
    const xs = Object.values(positions).map((p) => p.x);
    const ys = Object.values(positions).map((p) => p.y);
    const x =
      at?.x ??
      (xs.length ? Math.max(...xs) + COL_GAP : Math.round(viewport.w / 2 - NODE_W / 2));
    const y =
      at?.y ??
      (ys.length
        ? Math.round(ys.reduce((a, b) => a + b, 0) / ys.length)
        : Math.round(viewport.h / 2 - NODE_H / 2));
    createNode.mutate(
      {
        workflow: workflow.id,
        node_type: type,
        node_key: slugifyNodeKey(name, type),
        name,
        position_x: Math.round(x),
        position_y: Math.round(y),
        config: catalog?.defaultConfig ?? {},
      },
      {
        onSuccess: (node) => {
          toast.success(`Nodo «${name}» agregado`);
          setSelectedNodeId(String(node.id));
          setSideTab("node");
          setPositions((prev) => ({
            ...prev,
            [String(node.id)]: { x: Math.round(x), y: Math.round(y) },
          }));
          void refetch();
        },
        onError: (e) => toast.error(apiErrorMessage(e, "No se pudo agregar el nodo")),
      },
    );
  };

  const nodeRunMap = useMemo(
    () => buildNodeRunMap(executionDetail?.logs, nodes),
    [executionDetail?.logs, nodes],
  );

  const executionLive = useMemo(() => {
    const s = String(executionDetail?.status || "").toLowerCase();
    return (
      s.includes("run") ||
      s.includes("pend") ||
      s === "started" ||
      s === "queued" ||
      s === "in_progress" ||
      s === "processing"
    );
  }, [executionDetail?.status]);

  const selected = useMemo(
    () => nodes.find((n) => String(n.id) === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  useEffect(() => {
    if (!selected) {
      setDraftName("");
      setDraftConfig({});
      setRawJsonText("{}");
      return;
    }
    setDraftName(selected.name || "");
    const cfg =
      selected.config && typeof selected.config === "object" ? { ...selected.config } : {};
    setDraftConfig(cfg);
    setRawJsonText(JSON.stringify(cfg, null, 2));
    setShowRawJson(false);
  }, [selected]);

  const localPoint = (clientX: number, clientY: number) => {
    const el = canvasRef.current;
    if (!el) return { x: clientX, y: clientY };
    const r = el.getBoundingClientRect();
    return { x: clientX - r.left + el.scrollLeft, y: clientY - r.top + el.scrollTop };
  };

  const edgeExists = (from: string, to: string) => {
    const fromKey = String(from);
    const toKey = String(to);
    return edges.some((e) => {
      const fromId = resolveEdgeNodeId(e, "from", nodes);
      const toId = resolveEdgeNodeId(e, "to", nodes);
      return fromId === fromKey && toId === toKey;
    });
  };

  const connectNodes = (fromId: string, toId: string) => {
    if (!workflow) return;
    if (fromId === toId) {
      toast.message("Elige un nodo distinto como destino");
      return;
    }
    if (edgeExists(fromId, toId)) {
      toast.message("Esos nodos ya están conectados");
      setLinkFromId(null);
      setPointer(null);
      return;
    }
    createEdge.mutate(
      { workflow: workflow.id, from_node: fromId, to_node: toId },
      {
        onSuccess: () => {
          toast.success("Conexión creada");
          setLinkFromId(null);
          setPointer(null);
          void refetch();
        },
        onError: (err) => toast.error(apiErrorMessage(err, "No se pudo conectar")),
      },
    );
  };

  const edgePaths = useMemo(() => {
    return edges
      .map((e) => {
        const fromId = resolveEdgeNodeId(e, "from", nodes);
        const toId = resolveEdgeNodeId(e, "to", nodes);
        if (!fromId || !toId) return null;
        const a = positions[fromId];
        const b = positions[toId];
        if (!a || !b) return null;
        const x1 = a.x + NODE_W;
        const y1 = a.y + NODE_H / 2;
        const x2 = b.x;
        const y2 = b.y + NODE_H / 2;
        const mx = (x1 + x2) / 2;
        return {
          id: String(e.id),
          fromId,
          toId,
          d: `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`,
        };
      })
      .filter(
        (x): x is { id: string; fromId: string; toId: string; d: string } => x != null,
      );
  }, [edges, nodes, positions]);

  const canvasSize = useMemo(() => {
    let maxX = viewport.w;
    let maxY = viewport.h;
    for (const p of Object.values(positions)) {
      maxX = Math.max(maxX, p.x + NODE_W + 120);
      maxY = Math.max(maxY, p.y + NODE_H + 120);
    }
    if (pointer) {
      maxX = Math.max(maxX, pointer.x + 40);
      maxY = Math.max(maxY, pointer.y + 40);
    }
    return { w: maxX, h: maxY };
  }, [positions, pointer, viewport.w, viewport.h]);

  if (isLoading) {
    return (
      <div className="h-dvh bg-background">
        <PageSkeleton variant="chat" className="h-full max-w-none px-4 py-4" padded={false} />
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center gap-3">
        <p className="text-destructive">
          {apiErrorMessage(error, "No se pudo cargar el workflow")}
        </p>
        <Button asChild variant="outline">
          <Link to="/workflows">Volver</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col bg-background overflow-hidden">
      <div className="shrink-0 border-b bg-card/80 backdrop-blur px-3 py-2 flex items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2" asChild>
          <Link to="/workflows">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xs font-medium">OPS-agents</span>
          </Link>
        </Button>
        <span className="text-sm font-medium truncate">{workflow.name}</span>
        <div className="ml-auto flex gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1"
            onClick={organizeFlow}
            title="Centrar y separar nodos"
          >
            <StretchHorizontal className="h-3.5 w-3.5" />
            Organizar
          </Button>
          <Button
            size="sm"
            variant={linkMode ? "default" : "outline"}
            className="h-8 gap-1"
            onClick={() => {
              setLinkMode((v) => !v);
              setLinkFromId(null);
              setPointer(null);
            }}
          >
            <Link2 className="h-3.5 w-3.5" />
            {linkMode ? "Conectando…" : "Conectar"}
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1"
            disabled={execute.isPending}
            onClick={() =>
              execute.mutate(
                { id: workflow.id },
                {
                  onSuccess: (res) => {
                    toast.success("Ejecución disparada");
                    setSideTab("console");
                    const maybeId =
                      res && typeof res === "object" && "id" in res
                        ? String((res as { id: string }).id)
                        : null;
                    if (maybeId) setSelectedExecutionId(maybeId);
                    void refetch();
                  },
                  onError: (e) => toast.error(apiErrorMessage(e, "No se pudo ejecutar")),
                },
              )
            }
          >
            {execute.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            Ejecutar
          </Button>
        </div>
      </div>

      {linkMode ? (
        <div className="shrink-0 border-b bg-primary/10 px-3 py-1.5 text-[11px] text-primary">
          {linkFromId
            ? "Clic en el nodo destino (o en su asa izquierda). Esc cancela."
            : "Clic en el nodo origen (o arrastra desde el asa derecha)."}
        </div>
      ) : null}

      <div className="flex flex-1 min-h-0">
        <WorkflowNodePalette
          onAdd={addNode}
          disabled={createNode.isPending}
          collapsed={paletteCollapsed}
          onCollapsedChange={setPaletteCollapsed}
        />
        <div
          ref={canvasRef}
          className="relative flex-1 min-w-0 overflow-auto bg-[radial-gradient(circle_at_1px_1px,hsl(var(--border))_1px,transparent_0)] [background-size:24px_24px]"
          onDragOver={(e) => {
            if (e.dataTransfer.types.includes(WF_PALETTE_MIME)) {
              e.preventDefault();
              e.dataTransfer.dropEffect = "copy";
            }
          }}
          onDrop={(e) => {
            const type = e.dataTransfer.getData(WF_PALETTE_MIME) as WorkflowNodeType;
            if (!type) return;
            e.preventDefault();
            const pt = localPoint(e.clientX, e.clientY);
            addNode(type, { x: Math.max(16, pt.x - NODE_W / 2), y: Math.max(16, pt.y - NODE_H / 2) });
          }}
          onMouseMove={(e) => {
            const d = dragRef.current;
            if (d) {
              const x = Math.max(0, d.sx + (e.clientX - d.ox));
              const y = Math.max(0, d.sy + (e.clientY - d.oy));
              setPositions((prev) => ({ ...prev, [d.id]: { x, y } }));
              return;
            }
            if (linkFromId) {
              setPointer(localPoint(e.clientX, e.clientY));
            }
          }}
          onMouseUp={() => {
            const d = dragRef.current;
            if (!d) return;
            const pos = positions[d.id];
            dragRef.current = null;
            if (!pos) return;
            updateNode.mutate(
              { id: d.id, position_x: Math.round(pos.x), position_y: Math.round(pos.y) },
              {
                onError: (err) =>
                  toast.error(apiErrorMessage(err, "No se pudo guardar la posición")),
              },
            );
          }}
          onMouseLeave={() => {
            dragRef.current = null;
          }}
          onClick={() => {
            if (linkMode && linkFromId) {
              setLinkFromId(null);
              setPointer(null);
            }
          }}
        >
          <svg
            width={canvasSize.w}
            height={canvasSize.h}
            className="absolute left-0 top-0 z-0 pointer-events-none overflow-visible"
            aria-hidden
          >
            <defs>
              <marker
                id="wf-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill={EDGE_STROKE} fillOpacity={0.85} />
              </marker>
            </defs>
            {edgePaths.map((e) => {
              const fromRun = nodeRunMap.get(e.fromId);
              const toRun = nodeRunMap.get(e.toId);
              const stroke =
                toRun === "failed" || fromRun === "failed"
                  ? EDGE_FAILED
                  : toRun === "success" && (fromRun === "success" || fromRun === "running")
                    ? EDGE_SUCCESS
                    : EDGE_STROKE;
              const flowing =
                executionLive && (fromRun === "running" || toRun === "running" || toRun === "pending");
              return (
              <g key={e.id} className="pointer-events-auto">
                <path
                  d={e.d}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="14"
                  className="cursor-pointer"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    deleteEdge.mutate(
                      { id: e.id, workflow: workflow.id },
                      {
                        onSuccess: () => {
                          toast.success("Conexión eliminada");
                          void refetch();
                        },
                        onError: (err) => toast.error(apiErrorMessage(err, "No se pudo eliminar")),
                      },
                    );
                  }}
                />
                <path
                  d={e.d}
                  fill="none"
                  stroke={stroke}
                  strokeOpacity={0.35}
                  strokeWidth="2.5"
                  className="pointer-events-none"
                  style={{ stroke }}
                />
                <path
                  d={e.d}
                  fill="none"
                  stroke={stroke}
                  strokeOpacity={0.95}
                  strokeWidth="2.5"
                  strokeDasharray={flowing ? "8 10" : undefined}
                  markerEnd="url(#wf-arrow)"
                  className={cn("pointer-events-none", flowing && "wf-edge-flow")}
                  style={{ stroke }}
                />
              </g>
              );
            })}
            {linkFromId && pointer && positions[linkFromId] ? (
              <line
                x1={positions[linkFromId].x + NODE_W}
                y1={positions[linkFromId].y + NODE_H / 2}
                x2={pointer.x}
                y2={pointer.y}
                stroke={EDGE_STROKE}
                strokeOpacity={0.85}
                strokeWidth="2"
                strokeDasharray="6 4"
              />
            ) : null}
          </svg>

          {nodes.map((n) => {
            const nodeId = String(n.id);
            const pos = positions[nodeId] ?? { x: 40, y: 40 };
            const isLinkSource = linkFromId === nodeId;
            const meta = workflowNodeMeta(n.node_type);
            const selected = selectedNodeId === nodeId;
            const run = nodeRunMap.get(nodeId) || "idle";
            return (
              <ContextMenu key={nodeId}>
                <ContextMenuTrigger asChild>
              <div
                className={cn(
                  "absolute z-10 w-[180px] rounded-xl border backdrop-blur-md px-3 py-2.5 text-left",
                  "shadow-[0_0_0_1px_rgba(45,212,191,0.06)] transition-[box-shadow,transform] duration-200",
                  "hover:shadow-[0_0_28px_-10px_rgba(45,212,191,0.45)] hover:-translate-y-0.5",
                  meta?.accentBg || "bg-card/95 border-border",
                  selected && "ring-2 ring-primary/45 shadow-[0_0_32px_-8px_rgba(45,212,191,0.55)]",
                  isLinkSource && "ring-2 ring-primary/60",
                  run === "running" && "wf-node-running ring-2 ring-primary/70",
                  run === "success" && "ring-2 ring-emerald-400/50",
                  run === "failed" && "ring-2 ring-destructive/60",
                  run === "pending" && "opacity-80",
                  linkMode && "cursor-crosshair",
                )}
                style={{ left: pos.x, top: pos.y }}
                onContextMenu={() => {
                  setSelectedNodeId(nodeId);
                }}
              >
                {run !== "idle" ? (
                  <span
                    className={cn(
                      "absolute -top-1.5 -right-1.5 z-20 flex h-5 w-5 items-center justify-center rounded-full border bg-background shadow-sm",
                      run === "running" && "border-primary text-primary",
                      run === "success" && "border-emerald-400 text-emerald-400",
                      run === "failed" && "border-destructive text-destructive",
                      run === "pending" && "border-amber-400 text-amber-400",
                      run === "skipped" && "border-muted-foreground text-muted-foreground",
                    )}
                    title={run}
                  >
                    {run === "running" || run === "pending" ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : run === "success" ? (
                      <Check className="h-3 w-3" />
                    ) : run === "failed" ? (
                      <X className="h-3 w-3" />
                    ) : (
                      <span className="text-[8px] font-bold">–</span>
                    )}
                  </span>
                ) : null}
                <button
                  type="button"
                  className={cn(
                    "w-full text-left",
                    !linkMode && "cursor-grab active:cursor-grabbing",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (linkMode) {
                      if (!linkFromId) {
                        setLinkFromId(nodeId);
                        setPointer({ x: pos.x + NODE_W, y: pos.y + NODE_H / 2 });
                      } else {
                        connectNodes(linkFromId, nodeId);
                      }
                      return;
                    }
                    setSelectedNodeId(nodeId);
                    setSideTab("node");
                  }}
                  onMouseDown={(e) => {
                    if (linkMode) return;
                    if (e.button !== 0) return;
                    e.stopPropagation();
                    dragRef.current = {
                      id: nodeId,
                      ox: e.clientX,
                      oy: e.clientY,
                      sx: pos.x,
                      sy: pos.y,
                    };
                  }}
                >
                  <p
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-wider",
                      meta?.accent || "text-muted-foreground",
                    )}
                  >
                    {meta?.label || n.node_type}
                  </p>
                  <p className="text-sm font-medium truncate mt-0.5">{n.name}</p>
                </button>

                {/* Input handle */}
                <button
                  type="button"
                  title="Entrada"
                  aria-label="Handle de entrada"
                  className={cn(
                    "absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-primary bg-background",
                    linkMode &&
                      linkFromId &&
                      linkFromId !== nodeId &&
                      "ring-2 ring-primary/50 scale-125",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!linkMode) {
                      setLinkMode(true);
                    }
                    if (linkFromId && linkFromId !== nodeId) {
                      connectNodes(linkFromId, nodeId);
                    }
                  }}
                  onMouseUp={(e) => {
                    e.stopPropagation();
                    if (linkFromId && linkFromId !== nodeId) {
                      connectNodes(linkFromId, nodeId);
                    }
                  }}
                />

                {/* Output handle */}
                <button
                  type="button"
                  title="Salida — arrastra o clic para conectar"
                  aria-label="Handle de salida"
                  className={cn(
                    "absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-primary bg-primary",
                    "hover:scale-125 transition-transform",
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLinkMode(true);
                    setLinkFromId(nodeId);
                    setPointer({ x: pos.x + NODE_W, y: pos.y + NODE_H / 2 });
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setLinkMode(true);
                    setLinkFromId(nodeId);
                    setPointer(localPoint(e.clientX, e.clientY));
                  }}
                />
              </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-52">
                  <ContextMenuLabel className="text-[11px] truncate">{n.name}</ContextMenuLabel>
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    className="gap-2 text-xs"
                    onSelect={() => {
                      setSelectedNodeId(nodeId);
                      setSideTab("node");
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </ContextMenuItem>
                  <ContextMenuItem
                    className="gap-2 text-xs"
                    onSelect={() => {
                      setLinkMode(true);
                      setLinkFromId(nodeId);
                      setPointer({ x: pos.x + NODE_W, y: pos.y + NODE_H / 2 });
                    }}
                  >
                    <Link2 className="h-3.5 w-3.5" />
                    Conectar desde aquí
                  </ContextMenuItem>
                  <ContextMenuItem className="gap-2 text-xs" onSelect={() => cloneNode(n)}>
                    <Copy className="h-3.5 w-3.5" />
                    Clonar
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem
                    className="gap-2 text-xs text-destructive focus:text-destructive"
                    disabled={deleteNode.isPending}
                    onSelect={() => void removeNode(nodeId)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Eliminar
                    <ContextMenuShortcut>Del</ContextMenuShortcut>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })}
        </div>

        <aside className="w-[300px] xl:w-[340px] border-l bg-card flex flex-col shrink-0 min-h-0">
          <div className="shrink-0 border-b px-2.5 py-1.5 flex items-center gap-1.5">
            <div className="flex rounded-md border border-border/70 p-0.5 bg-muted/30">
              <button
                type="button"
                onClick={() => setSideTab("node")}
                className={cn(
                  "h-7 px-2.5 rounded text-[11px] font-medium transition-colors",
                  sideTab === "node"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Nodo
              </button>
              <button
                type="button"
                onClick={() => {
                  setSideTab("console");
                  if (!selectedExecutionId && executions[0]) {
                    setSelectedExecutionId(String(executions[0].id));
                  }
                }}
                className={cn(
                  "h-7 px-2.5 rounded text-[11px] font-medium transition-colors",
                  sideTab === "console"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Consola
                {executions.length > 0 ? (
                  <span className="ml-1 text-[10px] text-muted-foreground">
                    {executions.length}
                  </span>
                ) : null}
              </button>
            </div>
            <span
              className={cn(
                "ml-auto text-[10px] tabular-nums",
                edges.length > 0 ? "text-muted-foreground" : "text-amber-500/90",
              )}
              title="Conexiones del grafo"
            >
              {edges.length} link{edges.length === 1 ? "" : "s"}
            </span>
          </div>

          {sideTab === "node" ? (
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-3 space-y-2.5">
                {!selected ? (
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Tocá un nodo o agregá desde la palette. Clic derecho para editar / clonar /
                    borrar.
                  </p>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Nombre</Label>
                        <Input
                          value={draftName}
                          onChange={(e) => setDraftName(e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Tipo</Label>
                        <Input
                          value={workflowNodeLabel(selected.node_type)}
                          readOnly
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>

                    <div className="rounded-lg border border-border/60 bg-muted/20 p-2.5 space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Configuración
                      </p>
                      <WorkflowNodeConfigForm
                        nodeType={selected.node_type}
                        config={draftConfig}
                        onChange={(next) => {
                          setDraftConfig(next);
                          setRawJsonText(JSON.stringify(next, null, 2));
                        }}
                      />
                    </div>

                    <details
                      className="rounded-md border border-dashed px-2.5 py-2"
                      open={showRawJson}
                      onToggle={(e) => setShowRawJson((e.target as HTMLDetailsElement).open)}
                    >
                      <summary className="cursor-pointer text-[10px] text-muted-foreground">
                        JSON avanzado
                      </summary>
                      <Textarea
                        value={rawJsonText}
                        onChange={(e) => {
                          setRawJsonText(e.target.value);
                          try {
                            setDraftConfig(JSON.parse(e.target.value || "{}"));
                          } catch {
                            /* keep typing */
                          }
                        }}
                        rows={6}
                        className="mt-2 font-mono text-[11px] min-h-[100px]"
                      />
                    </details>

                    <Button
                      size="sm"
                      className="w-full h-8 gap-1.5"
                      disabled={updateNode.isPending}
                      onClick={() => {
                        let config = draftConfig;
                        if (showRawJson) {
                          try {
                            config = JSON.parse(rawJsonText || "{}");
                          } catch {
                            toast.error("JSON inválido");
                            return;
                          }
                        }
                        if (config && typeof config === "object") {
                          // Normalizar delay dual seconds/delay_seconds
                          if (
                            selected.node_type === "delay" &&
                            config.seconds != null &&
                            config.delay_seconds == null
                          ) {
                            config = {
                              ...config,
                              delay_seconds: config.seconds,
                            };
                          }
                        }
                        updateNode.mutate(
                          {
                            id: selected.id,
                            name: draftName.trim() || selected.name,
                            config,
                          },
                          {
                            onSuccess: () => toast.success("Nodo guardado"),
                            onError: (e) =>
                              toast.error(apiErrorMessage(e, "No se pudo guardar el nodo")),
                          },
                        );
                      }}
                    >
                      <Save className="h-3.5 w-3.5" />
                      Guardar
                    </Button>
                    <div className="flex gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-8 gap-1.5 text-[11px]"
                        disabled={createNode.isPending}
                        onClick={() => cloneNode(selected)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Clonar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-8 gap-1.5 text-[11px] text-destructive hover:text-destructive"
                        disabled={deleteNode.isPending}
                        onClick={() => void removeNode(String(selected.id))}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Borrar
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-snug">
                      Tip: clic derecho en un nodo · Delete para borrar
                    </p>
                  </>
                )}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="shrink-0 border-b max-h-[34%] overflow-y-auto">
                {executions.length === 0 ? (
                  <p className="px-3 py-4 text-[11px] text-muted-foreground">
                    Sin corridas. Usá Ejecutar para probar el flujo.
                  </p>
                ) : (
                  <ul className="p-1.5 space-y-0.5">
                    {executions.slice(0, 12).map((ex) => {
                      const active = selectedExecutionId === String(ex.id);
                      const failed = String(ex.status || "")
                        .toLowerCase()
                        .includes("fail");
                      return (
                        <li key={ex.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedExecutionId(String(ex.id))}
                            className={cn(
                              "w-full text-left rounded-md px-2 py-1.5 text-[11px] transition-colors",
                              active
                                ? "bg-primary/12 border border-primary/30"
                                : "hover:bg-muted/50 border border-transparent",
                            )}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={cn(
                                  "shrink-0 font-medium capitalize",
                                  failed ? "text-destructive" : "text-foreground",
                                )}
                              >
                                {ex.status || "—"}
                              </span>
                              <span className="truncate text-muted-foreground tabular-nums">
                                {(ex.started_at || ex.created || "").replace("T", " ").slice(0, 19)}
                              </span>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto p-2.5">
                {!selectedExecutionId ? (
                  <p className="text-[11px] text-muted-foreground px-0.5">
                    Elegí una corrida para ver el detalle.
                  </p>
                ) : executionDetailLoading || !executionDetail ? (
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground py-6 justify-center">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Cargando…
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px]">
                      <span
                        className={cn(
                          "font-semibold capitalize",
                          String(executionDetail.status || "")
                            .toLowerCase()
                            .includes("fail")
                            ? "text-destructive"
                            : "text-foreground",
                        )}
                      >
                        {executionDetail.status}
                      </span>
                      <span className="text-muted-foreground">
                        {executionDetail.completed_nodes ?? 0}/{executionDetail.total_nodes ?? 0}{" "}
                        nodos
                        {executionDetail.duration_ms != null
                          ? ` · ${executionDetail.duration_ms} ms`
                          : ""}
                      </span>
                    </div>

                    {executionDetail.error_message
                      ? (() => {
                          const { head, rest } = shortError(executionDetail.error_message);
                          return (
                            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-2 py-1.5">
                              <p className="text-[11px] text-destructive font-medium leading-snug">
                                {head}
                              </p>
                              {rest ? (
                                <details className="mt-1">
                                  <summary className="cursor-pointer text-[10px] text-muted-foreground">
                                    Ver stack / detalle
                                  </summary>
                                  <pre className="mt-1 max-h-[40vh] overflow-auto text-[10px] leading-snug whitespace-pre-wrap break-words text-destructive/90 font-mono">
                                    {rest}
                                  </pre>
                                </details>
                              ) : null}
                            </div>
                          );
                        })()
                      : null}

                    {(executionDetail.logs || []).length === 0 ? (
                      <p className="text-[11px] text-muted-foreground">Sin logs de nodos.</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {(executionDetail.logs || []).map((log) => {
                          const err = log.error_message ? shortError(log.error_message, 120) : null;
                          const logRun = normalizeRunStatus(log.status);
                          const focusId =
                            (log.node != null &&
                              nodes.some((n) => String(n.id) === String(log.node)) &&
                              String(log.node)) ||
                            nodes.find((n) => n.node_key === log.node_name)?.id ||
                            nodes.find(
                              (n) =>
                                log.node_name &&
                                n.name.toLowerCase() === log.node_name.toLowerCase(),
                            )?.id ||
                            null;
                          return (
                            <li key={log.id}>
                              <button
                                type="button"
                                className={cn(
                                  "w-full text-left rounded-md border bg-background/70 px-2 py-1.5 transition-colors",
                                  focusId && "hover:border-primary/40 hover:bg-primary/5",
                                  logRun === "failed" && "border-destructive/30",
                                  logRun === "success" && "border-emerald-500/25",
                                  logRun === "running" && "border-primary/40",
                                )}
                                onClick={() => {
                                  if (!focusId) return;
                                  setSelectedNodeId(String(focusId));
                                  setSideTab("node");
                                }}
                              >
                              <p className="text-[11px] font-medium leading-tight">
                                {log.node_name || "Nodo"}
                                <span className="text-muted-foreground font-normal">
                                  {" "}
                                  · {log.status}
                                </span>
                              </p>
                              {err ? (
                                <div className="mt-1">
                                  <p className="text-[10px] text-destructive leading-snug">
                                    {err.head}
                                  </p>
                                  {err.rest ? (
                                    <details className="mt-0.5" onClick={(e) => e.stopPropagation()}>
                                      <summary className="cursor-pointer text-[10px] text-muted-foreground">
                                        Más detalle
                                      </summary>
                                      <pre className="mt-1 max-h-40 overflow-auto text-[10px] whitespace-pre-wrap break-words text-destructive/90 font-mono">
                                        {err.rest}
                                      </pre>
                                    </details>
                                  ) : null}
                                </div>
                              ) : null}
                              {log.output_data && Object.keys(log.output_data).length > 0 ? (
                                <details className="mt-1" onClick={(e) => e.stopPropagation()}>
                                  <summary className="cursor-pointer text-[10px] text-muted-foreground">
                                    Output
                                  </summary>
                                  <pre className="mt-0.5 text-[10px] whitespace-pre-wrap break-words font-mono text-muted-foreground max-h-32 overflow-auto">
                                    {pretty(log.output_data)}
                                  </pre>
                                </details>
                              ) : null}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    {executionDetail.context && Object.keys(executionDetail.context).length > 0 ? (
                      <details className="text-[11px]">
                        <summary className="cursor-pointer text-muted-foreground">
                          Contexto final
                        </summary>
                        <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-[10px] text-muted-foreground max-h-28 overflow-auto">
                          {pretty(executionDetail.context)}
                        </pre>
                      </details>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
