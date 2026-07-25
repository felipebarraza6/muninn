import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Copy,
  Link2,
  Loader2,
  Pencil,
  Play,
  Save,
  StretchHorizontal,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { WorkflowNodePalette, WF_PALETTE_MIME } from "@/components/workflows/workflow-node-palette";
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
  type WorkflowNode,
  type WorkflowNodeType,
} from "@/api/hooks/useWorkflows";
import { apiErrorMessage } from "@/lib/apiError";
import { ErrorBanner } from "@/components/ui/error-banner";
import { prettyJson } from "@/lib/json";
import { cn } from "@/lib/utils";
import {
  WORKFLOW_NODE_CATALOG,
  slugifyNodeKey,
  workflowNodeLabel,
  workflowNodeMeta,
} from "@/lib/workflowCatalog";
import { isExecutionLive, normalizeRunStatus, resolveEdgeNodeId } from "@/lib/workflowGraph";
import {
  COL_GAP,
  EDGE_FAILED,
  EDGE_STROKE,
  EDGE_SUCCESS,
  NODE_H,
  NODE_W,
  buildNodeRunMap,
  layoutCenteredFlow,
} from "@/lib/workflowLayout";

type SidePanelTab = "node" | "console";

function shortError(message: string, max = 160): { head: string; rest: string } {
  const trimmed = message.trim();
  const nl = trimmed.indexOf("\n");
  const first = (nl >= 0 ? trimmed.slice(0, nl) : trimmed).trim();
  if (first.length <= max && nl < 0) return { head: first, rest: "" };
  if (first.length <= max) return { head: first, rest: trimmed.slice(nl + 1).trim() };
  return { head: `${first.slice(0, max)}…`, rest: trimmed };
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
  const [confirmDeleteNodeId, setConfirmDeleteNodeId] = useState<string | null>(null);
  const [confirmDeleteEdgeId, setConfirmDeleteEdgeId] = useState<string | null>(null);
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
  const dragRafRef = useRef<number | null>(null);
  const pendingDragPos = useRef<{ id: string; x: number; y: number } | null>(null);
  const pointerRafRef = useRef<number | null>(null);
  const pendingPointer = useRef<{ x: number; y: number } | null>(null);
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
        setConfirmDeleteNodeId(selectedNodeId);
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
      at?.x ?? (xs.length ? Math.max(...xs) + COL_GAP : Math.round(viewport.w / 2 - NODE_W / 2));
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

  const executionLive = useMemo(
    () => isExecutionLive(executionDetail?.status),
    [executionDetail?.status],
  );

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
      .filter((x): x is { id: string; fromId: string; toId: string; d: string } => x != null);
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
        <PageSkeleton variant="canvas" className="h-full max-w-none" padded={false} />
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center gap-3 px-6">
        <ErrorBanner
          className="max-w-md w-full"
          message={apiErrorMessage(error, "No se pudo cargar el workflow")}
        />
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
            addNode(type, {
              x: Math.max(16, pt.x - NODE_W / 2),
              y: Math.max(16, pt.y - NODE_H / 2),
            });
          }}
          onMouseMove={(e) => {
            const d = dragRef.current;
            if (d) {
              const x = Math.max(0, d.sx + (e.clientX - d.ox));
              const y = Math.max(0, d.sy + (e.clientY - d.oy));
              pendingDragPos.current = { id: d.id, x, y };
              if (dragRafRef.current == null) {
                dragRafRef.current = requestAnimationFrame(() => {
                  dragRafRef.current = null;
                  const p = pendingDragPos.current;
                  if (!p) return;
                  setPositions((prev) => ({ ...prev, [p.id]: { x: p.x, y: p.y } }));
                });
              }
              return;
            }
            if (linkFromId) {
              const pt = localPoint(e.clientX, e.clientY);
              pendingPointer.current = pt;
              if (pointerRafRef.current == null) {
                pointerRafRef.current = requestAnimationFrame(() => {
                  pointerRafRef.current = null;
                  const p = pendingPointer.current;
                  if (p) setPointer(p);
                });
              }
            }
          }}
          onMouseUp={() => {
            const d = dragRef.current;
            if (!d) return;
            dragRef.current = null;
            const pending = pendingDragPos.current;
            const pos =
              pending && pending.id === d.id ? { x: pending.x, y: pending.y } : positions[d.id];
            pendingDragPos.current = null;
            if (!pos) return;
            setPositions((prev) => ({ ...prev, [d.id]: pos }));
            updateNode.mutate(
              { id: d.id, position_x: Math.round(pos.x), position_y: Math.round(pos.y) },
              {
                onError: (err) =>
                  toast.error(apiErrorMessage(err, "No se pudo guardar la posición")),
              },
            );
          }}
          onMouseLeave={() => {
            const d = dragRef.current;
            if (!d) return;
            dragRef.current = null;
            const pending = pendingDragPos.current;
            const pos =
              pending && pending.id === d.id ? { x: pending.x, y: pending.y } : positions[d.id];
            pendingDragPos.current = null;
            if (!pos) return;
            setPositions((prev) => ({ ...prev, [d.id]: pos }));
            updateNode.mutate(
              { id: d.id, position_x: Math.round(pos.x), position_y: Math.round(pos.y) },
              {
                onError: (err) =>
                  toast.error(apiErrorMessage(err, "No se pudo guardar la posición")),
              },
            );
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
                executionLive &&
                (fromRun === "running" || toRun === "running" || toRun === "pending");
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
                      setConfirmDeleteEdgeId(e.id);
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
                      "shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_6%,transparent)] transition-[box-shadow,transform] duration-motion-base",
                      "hover:shadow-[0_0_28px_-10px_color-mix(in_oklab,var(--primary)_45%,transparent)] hover:-translate-y-0.5 motion-safe:hover:-translate-y-0.5",
                      meta?.accentBg || "bg-card/95 border-border",
                      selected &&
                        "ring-2 ring-primary/45 shadow-[0_0_32px_-8px_color-mix(in_oklab,var(--primary)_55%,transparent)]",
                      isLinkSource && "ring-2 ring-primary/60",
                      run === "running" && "wf-node-running ring-2 ring-primary/70",
                      run === "success" && "ring-2 ring-success/50",
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
                          run === "success" && "border-success text-success",
                          run === "failed" && "border-destructive text-destructive",
                          run === "pending" && "border-warning text-warning",
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
                    onSelect={() => setConfirmDeleteNodeId(nodeId)}
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
                    Toca un nodo o agrega desde la palette. Clic derecho para editar / clonar /
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
                        onClick={() => setConfirmDeleteNodeId(String(selected.id))}
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
                    Sin corridas. Usa Ejecutar para probar el flujo.
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
                    Elige una corrida para ver el detalle.
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
                                      <details
                                        className="mt-0.5"
                                        onClick={(e) => e.stopPropagation()}
                                      >
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
                                      {prettyJson(log.output_data)}
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
                          {prettyJson(executionDetail.context)}
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

      <ConfirmDialog
        open={confirmDeleteNodeId != null}
        onOpenChange={(open) => {
          if (!open) setConfirmDeleteNodeId(null);
        }}
        title="¿Eliminar este nodo?"
        description={(() => {
          const node = nodes.find((n) => String(n.id) === confirmDeleteNodeId);
          const name = node?.name ? `«${node.name}»` : "el nodo";
          return `Se eliminará ${name} junto con sus conexiones. Esta acción no se puede deshacer.`;
        })()}
        confirmLabel="Eliminar nodo"
        destructive
        busy={deleteNode.isPending || deleteEdge.isPending}
        onConfirm={() => {
          const id = confirmDeleteNodeId;
          if (!id) return;
          setConfirmDeleteNodeId(null);
          void removeNode(id);
        }}
      />

      <ConfirmDialog
        open={confirmDeleteEdgeId != null}
        onOpenChange={(open) => {
          if (!open) setConfirmDeleteEdgeId(null);
        }}
        title="¿Eliminar esta conexión?"
        description="Se quitará la conexión entre los dos nodos. Esta acción no se puede deshacer."
        confirmLabel="Eliminar conexión"
        destructive
        busy={deleteEdge.isPending}
        onConfirm={() => {
          const id = confirmDeleteEdgeId;
          if (!id || !workflow) return;
          deleteEdge.mutate(
            { id, workflow: workflow.id },
            {
              onSuccess: () => {
                toast.success("Conexión eliminada");
                setConfirmDeleteEdgeId(null);
                void refetch();
              },
              onError: (err) => {
                toast.error(apiErrorMessage(err, "No se pudo eliminar"));
                setConfirmDeleteEdgeId(null);
              },
            },
          );
        }}
      />
    </div>
  );
}
