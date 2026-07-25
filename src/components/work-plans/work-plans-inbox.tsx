import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Bot,
  CheckCircle2,
  CircleDashed,
  ClipboardList,
  Loader2,
  Play,
  Plus,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Trash2,
  Workflow,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import { WorkResultViewer } from "@/components/work-plans/work-result-viewer";
import { useAgents } from "@/api/hooks/useAgents";
import { useWorkflowExecution, useWorkflows } from "@/api/hooks/useWorkflows";
import {
  useCreateWorkItem,
  useCreateWorkPlan,
  useDeleteWorkItem,
  useDeleteWorkPlan,
  useRetryWorkItem,
  useRunAllWorkPlan,
  useRunNextWorkPlan,
  useRunWorkItem,
  useUpdateWorkItem,
  useUpdateWorkPlan,
  useWorkPlan,
  useWorkPlans,
  type CreateWorkPlanPayload,
  type WorkItem,
  type WorkItemKind,
  type WorkPlan,
  type WorkPlanRunEnvelope,
  type WorkPlanStatus,
} from "@/api/hooks/useWorkPlans";
import { apiErrorDetail, apiErrorMessage, apiErrorStatus } from "@/lib/apiError";
import { StatusChip } from "@/components/ui/status-chip";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBanner } from "@/components/ui/error-banner";
import { fromDatetimeLocal, toDatetimeLocal } from "@/lib/datetime";
import { parseJsonObject, prettyJson } from "@/lib/json";
import { itemStatusLabel, planStatusLabel, workPlanStatusTone } from "@/lib/workPlanStatus";
import { cn } from "@/lib/utils";
import { isOrganizationOwnerScope, isSuperAdmin } from "@/lib/authGuards";
import {
  WORK_PLAN_TEMPLATES,
  templateAvailability,
  type WorkPlanTemplateId,
} from "@/lib/workPlanTemplates";

const ITEM_KIND_LABEL: Record<WorkItemKind, string> = {
  agent_turn: "Turno de agente",
  workflow: "Workflow",
  function: "Skill",
  note: "Nota",
};

const ITEM_KIND_HINT: Record<WorkItemKind, string> = {
  agent_turn: "El agente recibe un mensaje y puede usar sus skills.",
  workflow: "Dispara un workflow de la sucursal (por id o nombre).",
  function: "Ejecuta una skill/función por slug con parámetros JSON.",
  note: "Solo deja una nota en el plan; no llama al modelo.",
};

const BUCKETS = [
  {
    id: "inbox",
    label: "Bandeja",
    match: (s: WorkPlanStatus) => s === "draft" || s === "scheduled" || s === "running",
  },
  { id: "done", label: "Hechos", match: (s: WorkPlanStatus) => s === "completed" },
  {
    id: "failed",
    label: "Con error",
    match: (s: WorkPlanStatus) => s === "failed" || s === "cancelled",
  },
] as const;

type BucketId = (typeof BUCKETS)[number]["id"];

type DraftItem = {
  key: string;
  title: string;
  kind: WorkItemKind;
  message: string;
  functionSlug: string;
  parametersJson: string;
  workflowId: string;
  workflowName: string;
  noteText: string;
};

function ItemStatusIcon({ status }: { status?: string }) {
  if (status === "running") return <Loader2 className="h-3.5 w-3.5 animate-spin text-info" />;
  if (status === "done" || status === "completed")
    return <CheckCircle2 className="h-3.5 w-3.5 text-success" />;
  if (status === "failed") return <XCircle className="h-3.5 w-3.5 text-destructive" />;
  return <CircleDashed className="h-3.5 w-3.5 text-muted-foreground" />;
}

function payloadFromDraft(item: DraftItem): Record<string, unknown> | null {
  if (item.kind === "agent_turn") {
    return { message: item.message.trim() || item.title };
  }
  if (item.kind === "note") {
    return { text: item.noteText.trim() || item.title };
  }
  if (item.kind === "function") {
    if (!item.functionSlug.trim()) {
      toast.error("La skill necesita un function_slug");
      return null;
    }
    const parsed = parseJsonObject(item.parametersJson || "{}", "Parámetros");
    if (!parsed.ok) {
      toast.error(parsed.error);
      return null;
    }
    return { function_slug: item.functionSlug.trim(), parameters: parsed.value };
  }
  if (item.kind === "workflow") {
    if (!item.workflowId.trim() && !item.workflowName.trim()) {
      toast.error("El ítem workflow necesita workflow_id o nombre");
      return null;
    }
    const payload: Record<string, unknown> = {};
    if (item.workflowId.trim()) payload.workflow_id = item.workflowId.trim();
    if (item.workflowName.trim()) payload.workflow_name = item.workflowName.trim();
    return payload;
  }
  return {};
}

function draftFromPayload(
  kind: WorkItemKind,
  payload?: Record<string, unknown> | null,
): Omit<DraftItem, "key" | "title" | "kind"> {
  const p = payload && typeof payload === "object" ? payload : {};
  return {
    message: typeof p.message === "string" ? p.message : "",
    functionSlug: typeof p.function_slug === "string" ? p.function_slug : "",
    parametersJson: prettyJson(p.parameters ?? {}) || "{}",
    workflowId: typeof p.workflow_id === "string" ? p.workflow_id : "",
    workflowName: typeof p.workflow_name === "string" ? p.workflow_name : "",
    noteText: typeof p.text === "string" ? p.text : "",
  };
}

function extractToolCalls(result: Record<string, unknown> | null): Array<{
  name: string;
  detail: string;
}> {
  if (!result) return [];
  const raw = result.tool_calls;
  if (!Array.isArray(raw)) return [];
  return raw.map((tc, i) => {
    if (tc && typeof tc === "object") {
      const o = tc as Record<string, unknown>;
      const fn =
        o.function && typeof o.function === "object"
          ? (o.function as Record<string, unknown>)
          : null;
      const name =
        (typeof o.name === "string" && o.name) ||
        (typeof o.tool === "string" && o.tool) ||
        (typeof fn?.name === "string" && fn.name) ||
        (typeof o.function === "string" && o.function) ||
        `tool_${i + 1}`;
      let args: unknown = o.arguments ?? o.args ?? o.input ?? o.result ?? o.output;
      if (args == null && fn) args = fn.arguments ?? fn.args ?? fn;
      if (typeof args === "string") {
        try {
          args = JSON.parse(args);
        } catch {
          /* keep string */
        }
      }
      return { name, detail: prettyJson(args ?? o) };
    }
    return { name: `tool_${i + 1}`, detail: prettyJson(tc) };
  });
}

type ResultView = {
  replyText: string;
  hasResult: boolean;
  nodes: Array<{
    node: string;
    node_type?: string;
    status?: string;
    output?: unknown;
    error?: string;
  }>;
  metaJson: string;
  executionId?: string;
  workflowStatus?: string;
};

function extractResultView(item: WorkItem): ResultView {
  const resultObj =
    item.result && typeof item.result === "object"
      ? (item.result as Record<string, unknown>)
      : null;

  let replyText = "";
  if (resultObj) {
    for (const key of [
      "content",
      "response_text",
      "response",
      "note",
      "summary",
      "message",
      "text",
    ]) {
      const v = resultObj[key];
      if (typeof v === "string" && v.trim()) {
        replyText = v;
        break;
      }
    }
    if (!replyText && resultObj.result != null) {
      replyText =
        typeof resultObj.result === "string" ? resultObj.result : prettyJson(resultObj.result);
    }
    if (!replyText && resultObj.value != null) {
      replyText =
        typeof resultObj.value === "string" ? resultObj.value : prettyJson(resultObj.value);
    }
  }

  const nodesRaw = Array.isArray(resultObj?.nodes) ? resultObj!.nodes : [];
  const nodes = nodesRaw
    .filter((n): n is Record<string, unknown> => !!n && typeof n === "object")
    .map((n) => ({
      node: typeof n.node === "string" ? n.node : "Nodo",
      node_type: typeof n.node_type === "string" ? n.node_type : undefined,
      status: typeof n.status === "string" ? n.status : undefined,
      output: n.output,
      error: typeof n.error === "string" ? n.error : undefined,
    }));

  const skipKeys = new Set([
    "content",
    "note",
    "response",
    "response_text",
    "summary",
    "message",
    "text",
    "tool_calls",
    "nodes",
    "ok",
  ]);
  const meta =
    resultObj && Object.fromEntries(Object.entries(resultObj).filter(([k]) => !skipKeys.has(k)));
  const metaJson = meta && Object.keys(meta).length ? prettyJson(meta) : "";

  const executionId =
    (typeof resultObj?.execution_id === "string" && resultObj.execution_id) ||
    (typeof item.workflow_execution === "string" ? item.workflow_execution : undefined);

  return {
    replyText,
    hasResult:
      item.status === "done" ||
      item.status === "failed" ||
      Boolean(item.error_message?.trim()) ||
      Boolean(item.workflow_execution) ||
      (resultObj != null && Object.keys(resultObj).length > 0),
    nodes,
    metaJson,
    executionId,
    workflowStatus: typeof resultObj?.status === "string" ? resultObj.status : undefined,
  };
}

function itemPreview(item: WorkItem): string {
  const view = extractResultView(item);
  if (item.error_message) return item.error_message;
  if (view.replyText) return view.replyText;
  if (view.workflowStatus) return `Workflow: ${view.workflowStatus}`;
  if (item.status === "done") return "Completado (sin texto de respuesta)";
  return "";
}

function insumoPreview(item: WorkItem): string {
  const p = item.payload && typeof item.payload === "object" ? item.payload : {};
  if (item.kind === "agent_turn") {
    const msg = typeof p.message === "string" ? p.message : item.title;
    return msg.trim();
  }
  if (item.kind === "note") {
    const text = typeof p.text === "string" ? p.text : item.title;
    return text.trim();
  }
  if (item.kind === "function") {
    const slug = typeof p.function_slug === "string" ? p.function_slug : "";
    return slug ? `skill · ${slug}` : "Skill sin slug";
  }
  if (item.kind === "workflow") {
    const name =
      (typeof p.workflow_name === "string" && p.workflow_name) ||
      (typeof p.workflow_id === "string" && p.workflow_id.slice(0, 8)) ||
      "";
    return name ? `workflow · ${name}` : "Workflow";
  }
  return "";
}

function newDraftItem(partial?: Partial<DraftItem>): DraftItem {
  return {
    key: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: "",
    kind: "agent_turn",
    message: "",
    functionSlug: "",
    parametersJson: "{}",
    workflowId: "",
    workflowName: "",
    noteText: "",
    ...partial,
  };
}

export function WorkPlansInbox() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const idFromUrl = searchParams.get("id");
  const showBranchFilter = isSuperAdmin() || isOrganizationOwnerScope();

  const { data: plans = [], isLoading, error, refetch, isFetching } = useWorkPlans();
  const [selectedId, setSelectedId] = useState(idFromUrl ?? "");
  const [bucket, setBucket] = useState<BucketId>("inbox");
  const [query, setQuery] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [runSummary, setRunSummary] = useState<{
    planStatus?: string;
    steps?: number;
    ok?: boolean;
    items: WorkItem[];
  } | null>(null);

  const { data: planDetail, isLoading: detailLoading } = useWorkPlan(selectedId || undefined);
  const createPlan = useCreateWorkPlan();
  const updatePlan = useUpdateWorkPlan();
  const deletePlan = useDeleteWorkPlan();
  const createItem = useCreateWorkItem();
  const updateItem = useUpdateWorkItem();
  const deleteItem = useDeleteWorkItem();
  const runNext = useRunNextWorkPlan();
  const runAll = useRunAllWorkPlan();
  const runItem = useRunWorkItem();
  const retryItem = useRetryWorkItem();
  const { data: agents = [] } = useAgents({ is_active: true });
  const { data: workflows = [] } = useWorkflows();
  const [mobileShowPlan, setMobileShowPlan] = useState(false);

  useEffect(() => {
    if (idFromUrl && idFromUrl !== selectedId) setSelectedId(idFromUrl);
  }, [idFromUrl, selectedId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (inspectorOpen) {
        setInspectorOpen(false);
        return;
      }
      navigate("/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, inspectorOpen]);

  const filtered = useMemo(() => {
    const meta = BUCKETS.find((b) => b.id === bucket);
    if (!meta) return plans;
    return plans.filter((p) => {
      if (!meta.match(p.status)) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      const name = (p.name || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [plans, bucket, query]);

  useEffect(() => {
    if (!selectedId && filtered[0]) {
      const id = filtered[0].id;
      setSelectedId(id);
      setSearchParams({ id }, { replace: true });
    }
  }, [filtered, selectedId, setSearchParams]);

  const items = useMemo(() => {
    const list = planDetail?.items ?? [];
    return [...list].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [planDetail?.items]);

  useEffect(() => {
    if (!items.length) {
      setSelectedItemId(null);
      return;
    }
    if (!selectedItemId || !items.some((i) => i.id === selectedItemId)) {
      setSelectedItemId(items[0].id);
    }
  }, [items, selectedItemId]);

  const selectedItem = items.find((i) => i.id === selectedItemId) ?? null;
  const agentName = (id?: string | number | null) =>
    agents.find((a) => String(a.id) === String(id))?.name ||
    (id != null ? String(id).slice(0, 8) : "—");

  const selectPlan = (id: string) => {
    setSelectedId(id);
    setSelectedItemId(null);
    setRunSummary(null);
    setSearchParams({ id }, { replace: true });
    setMobileShowPlan(true);
  };

  const selectItem = (id: string) => {
    setSelectedItemId(id);
    // Sheet solo en mobile: en md+ el inspector ya está a la derecha.
    // Abrirlo en desktop deja el overlay oscuro y el panel oculto (md:hidden).
    const isMobile =
      typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) setInspectorOpen(true);
    else setInspectorOpen(false);
  };

  const focusAfterRun = (plan: WorkPlan | undefined, envelope?: WorkPlanRunEnvelope) => {
    const status = (envelope?.plan_status || plan?.status || "") as WorkPlanStatus | string;
    if (status === "completed") setBucket("done");
    else if (status === "failed" || status === "cancelled") setBucket("failed");

    const nextItems = (plan?.items ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);
    const withOutcome =
      nextItems.find((i) => i.status === "done" || i.status === "failed") ||
      nextItems.find((i) => extractResultView(i).hasResult) ||
      nextItems[0];
    if (withOutcome) {
      setSelectedItemId(withOutcome.id);
      const isMobile =
        typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
      if (isMobile) setInspectorOpen(true);
    }
    setRunSummary({
      planStatus: status || undefined,
      steps: envelope?.steps,
      ok: envelope?.ok,
      items: nextItems,
    });
    const done = nextItems.filter((i) => i.status === "done").length;
    const failed = nextItems.filter((i) => i.status === "failed").length;
    const pending = nextItems.filter(
      (i) => i.status === "pending" || i.status === "queued" || i.status === "running",
    ).length;
    toast.success(
      `Corrida lista · ${done} ok${failed ? ` · ${failed} error` : ""}${pending ? ` · ${pending} pendientes` : ""}`,
    );
  };

  const reorderItem = (item: WorkItem, dir: -1 | 1) => {
    const idx = items.findIndex((i) => i.id === item.id);
    const swap = items[idx + dir];
    if (!swap) return;
    const aOrder = item.sort_order ?? idx;
    const bOrder = swap.sort_order ?? idx + dir;
    updateItem.mutate(
      { id: item.id, sort_order: bOrder },
      {
        onError: (e) => toast.error(apiErrorMessage(e, "No se pudo reordenar")),
      },
    );
    updateItem.mutate(
      { id: swap.id, sort_order: aOrder },
      {
        onSuccess: () => toast.success("Orden actualizado"),
        onError: (e) => toast.error(apiErrorMessage(e, "No se pudo reordenar")),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="h-dvh bg-background">
        <PageSkeleton variant="inbox" className="h-full max-w-none px-4 py-4" padded={false} />
      </div>
    );
  }

  if (error) {
    const status = apiErrorStatus(error);
    const detail = apiErrorDetail(error);
    const hint =
      status === 404
        ? "El API no tiene la ruta work-plans. Reiniciá el API y volvé a intentar."
        : status === 403
          ? "Sin permiso o suscripción activa para ai_agents en esta sucursal."
          : status === 401
            ? "Sesión inválida — volvé a iniciar sesión."
            : status == null
              ? "No hay respuesta del API. Revisá que el servidor y el proxy estén activos."
              : null;
    return (
      <div className="h-dvh flex flex-col items-center justify-center gap-3 px-6">
        <ErrorBanner
          className="max-w-md w-full"
          message={apiErrorMessage(error, "No se pudieron cargar los planes de trabajo")}
          status={status}
          detail={[detail, hint].filter(Boolean).join(" · ") || undefined}
          onRetry={() => void refetch()}
        />
        <Button variant="outline" size="sm" asChild>
          <Link to="/">Volver</Link>
        </Button>
      </div>
    );
  }

  const inspectorProps = selectedItem
    ? {
        item: selectedItem,
        planWorkflowId: planDetail?.workflow ?? null,
        agentLabel: agentName(selectedItem.assigned_agent || planDetail?.assigned_agent),
        busy:
          runItem.isPending || retryItem.isPending || updateItem.isPending || deleteItem.isPending,
        onRun: () => {
          runItem.mutate(selectedItem.id, {
            onSuccess: (data) => {
              if (data.item?.id) setSelectedItemId(String(data.item.id));
              const isMobile =
                typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
              if (isMobile) setInspectorOpen(true);
              toast.success("Ítem ejecutado — revisá el resultado a la derecha");
            },
            onError: (e) => toast.error(apiErrorMessage(e, "No se pudo ejecutar el ítem")),
          });
        },
        onRetry: () => {
          retryItem.mutate(selectedItem.id, {
            onSuccess: () => toast.success("Reintento lanzado — revisá el resultado"),
            onError: (e) => toast.error(apiErrorMessage(e, "No se pudo reintentar")),
          });
        },
        onSave: (patch: {
          title: string;
          kind: WorkItemKind;
          payload: Record<string, unknown>;
        }) => {
          updateItem.mutate(
            { id: selectedItem.id, ...patch },
            {
              onSuccess: () => toast.success("Ítem guardado"),
              onError: (e) => toast.error(apiErrorMessage(e, "No se pudo guardar el ítem")),
            },
          );
        },
        onDelete: () => {
          if (!window.confirm("¿Quitar este ítem del plan?")) return;
          deleteItem.mutate(
            { id: selectedItem.id, planId: selectedId },
            {
              onSuccess: () => {
                toast.success("Ítem eliminado");
                setInspectorOpen(false);
                setSelectedItemId(null);
              },
              onError: (e) => toast.error(apiErrorMessage(e, "No se pudo eliminar el ítem")),
            },
          );
        },
      }
    : null;

  return (
    <div className="h-dvh flex flex-col bg-background overflow-hidden">
      <div className="shrink-0 border-b border-border/60 bg-card/80 backdrop-blur px-3 py-2 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 shrink-0 gap-1.5 px-2 text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link to="/" title="Volver (Esc)">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xs font-medium">Volver</span>
          </Link>
        </Button>
        <ClipboardList className="h-4 w-4 text-primary shrink-0" />
        <div className="min-w-0 flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight truncate">Planes</span>
          <span className="text-[10px] text-muted-foreground hidden sm:inline truncate">
            OPS-agents · insumos → ejecutar → resultado
          </span>
        </div>
        <span className="ml-1 hidden md:inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
          Preview
        </span>
        <div className="ml-auto flex items-center gap-2">
          {showBranchFilter ? <StudioBranchFilter /> : null}
          <Button size="sm" variant="ghost" className="h-8 hidden md:inline-flex" asChild>
            <Link to="/workflows">Workflows</Link>
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1.5 shadow-sm shadow-primary/20"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Nuevo plan
          </Button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <aside
          className={cn(
            "w-full md:w-[300px] lg:w-[320px] border-r bg-card flex-col shrink-0",
            mobileShowPlan && selectedId ? "hidden md:flex" : "flex",
          )}
        >
          <div className="border-b px-3 pt-3 pb-2 space-y-2 shrink-0">
            <p className="text-[11px] text-muted-foreground px-0.5">
              Un plan es una cadena de pasos. Cada paso tiene insumos (entrada) y un resultado.
            </p>
            <div className="flex gap-1">
              {BUCKETS.map((b) => {
                const count = plans.filter((p) => b.match(p.status)).length;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBucket(b.id)}
                    className={cn(
                      "flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors",
                      bucket === b.id
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:bg-muted/60",
                    )}
                  >
                    {b.label}
                    <span className="ml-1 tabular-nums opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar plan…"
                className="h-8 pl-8 text-sm"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filtered.length === 0 ? (
                <div className="text-center py-10 px-4 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    No hay planes aquí. Usa una plantilla real de tu sucursal (Dentidesk o
                    SmartHydro).
                  </p>
                  <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)}>
                    Usar plantilla
                  </Button>
                </div>
              ) : (
                filtered.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectPlan(p.id)}
                    className={cn(
                      "w-full text-left rounded-lg border px-3 py-2.5 transition-colors",
                      selectedId === p.id
                        ? "border-primary/40 bg-primary/10"
                        : "border-transparent hover:bg-muted/50",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <StatusChip
                        label={planStatusLabel(p.status)}
                        tone={workPlanStatusTone(p.status)}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                      {p.description || "Sin descripción"}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <Bot className="h-3 w-3" />
                      <span className="truncate">{agentName(p.assigned_agent)}</span>
                      <span className="ml-auto tabular-nums">
                        {(p.items?.length ?? 0) || "—"} ítems
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </aside>

        <section
          className={cn(
            "flex-1 min-w-0 flex-col border-r",
            mobileShowPlan && selectedId ? "flex" : "hidden md:flex",
          )}
        >
          {!selectedId ? (
            <EmptyState
              className="flex-1 border-0 bg-transparent rounded-none"
              title="Selecciona un plan o crea uno con una plantilla de tu sucursal."
              action={
                <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)}>
                  Nuevo plan
                </Button>
              }
            />
          ) : detailLoading && !planDetail ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="md:hidden shrink-0 border-b px-3 py-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 gap-1"
                  onClick={() => setMobileShowPlan(false)}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Planes
                </Button>
              </div>
              <PlanHeader
                plan={planDetail}
                agentLabel={agentName(planDetail?.assigned_agent)}
                itemCount={items.length}
                busy={
                  runNext.isPending ||
                  runAll.isPending ||
                  updatePlan.isPending ||
                  deletePlan.isPending
                }
                onRunNext={() => {
                  if (!selectedId) return;
                  runNext.mutate(selectedId, {
                    onSuccess: (data) => {
                      focusAfterRun(data.plan, data.result);
                    },
                    onError: (e) =>
                      toast.error(apiErrorMessage(e, "No se pudo ejecutar el siguiente ítem")),
                  });
                }}
                onRunAll={() => {
                  if (!selectedId) return;
                  runAll.mutate(
                    { id: selectedId, stopOnError: false },
                    {
                      onSuccess: (data) => {
                        focusAfterRun(data.plan, data.result);
                      },
                      onError: (e) =>
                        toast.error(apiErrorMessage(e, "No se pudo ejecutar el plan completo")),
                    },
                  );
                }}
                onCancel={() => {
                  if (!selectedId) return;
                  updatePlan.mutate(
                    { id: selectedId, status: "cancelled" },
                    {
                      onSuccess: () => toast.success("Plan cancelado"),
                      onError: (e) => toast.error(apiErrorMessage(e, "No se pudo cancelar")),
                    },
                  );
                }}
                onDelete={() => {
                  if (!selectedId) return;
                  if (!window.confirm("¿Eliminar este plan?")) return;
                  deletePlan.mutate(selectedId, {
                    onSuccess: () => {
                      toast.success("Plan eliminado");
                      setSelectedId("");
                      setSearchParams({}, { replace: true });
                    },
                    onError: (e) => toast.error(apiErrorMessage(e, "No se pudo eliminar")),
                  });
                }}
                onSaveMeta={(patch) => {
                  if (!selectedId) return;
                  updatePlan.mutate(
                    { id: selectedId, ...patch },
                    {
                      onSuccess: () => toast.success("Plan actualizado"),
                      onError: (e) => toast.error(apiErrorMessage(e, "No se pudo guardar")),
                    },
                  );
                }}
              />
              {runSummary ? (
                <div className="shrink-0 mx-3 mt-2 rounded-xl border border-primary/25 bg-primary/5 px-3 py-2.5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground">
                        Resultados de la corrida
                        {runSummary.planStatus ? (
                          <span className="text-muted-foreground font-normal">
                            {" "}
                            · {planStatusLabel(runSummary.planStatus)}
                          </span>
                        ) : null}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {runSummary.steps != null ? `${runSummary.steps} paso(s) · ` : ""}
                        Tocá un ítem para ver el detalle a la derecha.
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-[11px] shrink-0"
                      onClick={() => setRunSummary(null)}
                    >
                      Cerrar
                    </Button>
                  </div>
                  <ul className="space-y-1 max-h-40 overflow-y-auto">
                    {runSummary.items.map((it, idx) => {
                      const preview =
                        itemPreview(it) || (it.status === "pending" ? "Sin ejecutar" : "—");
                      return (
                        <li key={it.id}>
                          <button
                            type="button"
                            className={cn(
                              "w-full text-left rounded-lg px-2 py-1.5 text-[11px] transition-colors",
                              selectedItemId === it.id
                                ? "bg-primary/15 text-foreground"
                                : "hover:bg-muted/60 text-muted-foreground",
                            )}
                            onClick={() => selectItem(it.id)}
                          >
                            <span className="font-medium text-foreground/90">
                              #{idx + 1} {it.title}
                            </span>
                            <StatusChip
                              label={itemStatusLabel(it.status)}
                              tone={workPlanStatusTone(it.status)}
                            />
                            <span className="block mt-0.5 line-clamp-2 opacity-80">{preview}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
              <div className="shrink-0 px-4 py-2 border-b flex items-center gap-2">
                <p className="text-[11px] text-muted-foreground flex-1">
                  Flujo del plan · insumo → ejecutar → resultado (detalle a la derecha)
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1"
                  onClick={() => setAddItemOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Añadir ítem
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-3 space-y-1.5 max-w-3xl mx-auto w-full">
                  {items.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Este plan aún no tiene ítems. Añade un turno, skill, workflow o nota.
                      </p>
                      <Button size="sm" onClick={() => setAddItemOpen(true)}>
                        Añadir ítem
                      </Button>
                    </div>
                  ) : (
                    items.map((item, idx) => {
                      const insumo = insumoPreview(item);
                      const preview = itemPreview(item);
                      return (
                        <div
                          key={item.id}
                          className={cn(
                            "rounded-xl border px-3 py-2.5 transition-colors",
                            selectedItemId === item.id
                              ? "border-primary/40 bg-primary/5"
                              : "border-border/60 hover:bg-muted/40",
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="flex items-center gap-2 min-w-0 flex-1 text-left"
                              onClick={() => selectItem(item.id)}
                            >
                              <ItemStatusIcon status={item.status} />
                              <span className="text-[10px] text-muted-foreground tabular-nums">
                                #{idx + 1}
                              </span>
                              <span className="text-sm font-medium truncate flex-1">
                                {item.title}
                              </span>
                              <span className="rounded-md bg-muted/80 px-1.5 py-0.5 text-[10px] text-muted-foreground shrink-0">
                                {ITEM_KIND_LABEL[item.kind] ?? item.kind}
                              </span>
                              <StatusChip
                                label={itemStatusLabel(item.status)}
                                tone={workPlanStatusTone(item.status)}
                              />
                            </button>
                            <div className="flex items-center gap-0.5 shrink-0">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                disabled={idx === 0 || updateItem.isPending}
                                onClick={() => reorderItem(item, -1)}
                                title="Subir"
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                disabled={idx === items.length - 1 || updateItem.isPending}
                                onClick={() => reorderItem(item, 1)}
                                title="Bajar"
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                          {insumo ? (
                            <p className="mt-1.5 text-[11px] text-foreground/75 line-clamp-1 pl-6">
                              <span className="text-muted-foreground">Insumo · </span>
                              {insumo}
                            </p>
                          ) : null}
                          {preview ? (
                            <p
                              className={cn(
                                "mt-0.5 text-[11px] line-clamp-2 pl-6",
                                item.status === "failed"
                                  ? "text-destructive"
                                  : "text-muted-foreground",
                              )}
                            >
                              <span className="opacity-80">Resultado · </span>
                              {preview}
                            </p>
                          ) : null}
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </section>

        <aside className="hidden md:flex w-[340px] lg:w-[380px] bg-card flex-col shrink-0 overflow-hidden border-l">
          {!inspectorProps ? (
            <EmptyState
              className="flex-1 border-0 bg-transparent rounded-none"
              title="Elige un ítem del flujo para ver insumos y lo que generó."
            />
          ) : (
            <ItemInspector {...inspectorProps} />
          )}
        </aside>
      </div>

      <Sheet
        open={inspectorOpen && !!inspectorProps}
        onOpenChange={(open) => {
          setInspectorOpen(open);
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col gap-0 h-dvh">
          <SheetHeader className="px-4 py-3 border-b text-left shrink-0 pr-12">
            <SheetTitle className="text-sm">Detalle del ítem</SheetTitle>
          </SheetHeader>
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {inspectorProps ? <ItemInspector {...inspectorProps} /> : null}
          </div>
        </SheetContent>
      </Sheet>

      <CreatePlanDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        agents={agents.map((a) => ({
          id: String(a.id),
          name: a.name,
          slug: a.slug || "",
        }))}
        workflows={workflows.map((w) => ({ id: w.id, name: w.name }))}
        pending={createPlan.isPending}
        onSubmit={(payload) => {
          createPlan.mutate(payload, {
            onSuccess: (plan) => {
              toast.success("Plan creado");
              setCreateOpen(false);
              selectPlan(plan.id);
              setBucket("inbox");
            },
            onError: (e) => toast.error(apiErrorMessage(e, "No se pudo crear el plan")),
          });
        }}
      />

      <AddItemDialog
        open={addItemOpen}
        onOpenChange={setAddItemOpen}
        workflows={workflows.map((w) => ({ id: w.id, name: w.name }))}
        pending={createItem.isPending}
        onSubmit={(draft) => {
          if (!selectedId) return;
          const payload = payloadFromDraft(draft);
          if (!payload) return;
          if (!draft.title.trim()) {
            toast.error("El ítem necesita un título");
            return;
          }
          createItem.mutate(
            {
              plan: selectedId,
              title: draft.title.trim(),
              kind: draft.kind,
              sort_order: items.length,
              payload,
            },
            {
              onSuccess: () => {
                toast.success("Ítem añadido");
                setAddItemOpen(false);
              },
              onError: (e) => toast.error(apiErrorMessage(e, "No se pudo añadir el ítem")),
            },
          );
        }}
      />
    </div>
  );
}

function PlanHeader({
  plan,
  agentLabel,
  busy,
  itemCount = 0,
  onRunNext,
  onRunAll,
  onCancel,
  onDelete,
  onSaveMeta,
}: {
  plan?: WorkPlan;
  agentLabel: string;
  busy: boolean;
  itemCount?: number;
  onRunNext: () => void;
  onRunAll: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onSaveMeta: (patch: { context?: Record<string, unknown>; scheduled_for?: string | null }) => void;
}) {
  const [contextJson, setContextJson] = useState("{}");
  const [scheduledFor, setScheduledFor] = useState("");
  const [metaOpen, setMetaOpen] = useState(
    () => itemCount === 0 && (plan?.status === "draft" || !plan?.status),
  );

  useEffect(() => {
    if (!plan) return;
    setContextJson(prettyJson(plan.context ?? {}) || "{}");
    setScheduledFor(toDatetimeLocal(plan.scheduled_for));
  }, [plan?.id, plan?.context, plan?.scheduled_for]);

  useEffect(() => {
    setMetaOpen(itemCount === 0 && (plan?.status === "draft" || !plan?.status));
  }, [plan?.id, plan?.status, itemCount]);

  if (!plan) return null;

  return (
    <div className="shrink-0 border-b bg-card/40">
      <div className="px-4 py-2.5 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-sm font-semibold truncate">{plan.name}</h2>
            <StatusChip
              label={planStatusLabel(plan.status)}
              tone={workPlanStatusTone(plan.status)}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {plan.description || "Sin descripción"} · Agente: {agentLabel}
            {plan.workflow ? (
              <>
                {" · "}
                <Link
                  to={`/workflows/${plan.workflow}`}
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  <Workflow className="h-3 w-3" />
                  Abrir workflow
                </Link>
              </>
            ) : null}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="sm"
            variant="outline"
            disabled={busy || plan.status === "cancelled"}
            onClick={onRunNext}
            className="h-8 gap-1"
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            <span className="hidden lg:inline">Siguiente</span>
          </Button>
          <Button size="sm" disabled={busy} onClick={onRunAll} className="h-8 gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ejecutar todo</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={busy || plan.status === "cancelled"}
            onClick={onCancel}
            className="h-8 px-2"
          >
            Cancelar
          </Button>
          <Button
            size="icon"
            variant="ghost"
            disabled={busy}
            onClick={onDelete}
            className="h-8 w-8 text-destructive hover:text-destructive"
            title="Eliminar plan"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="border-t border-border/50">
        <button
          type="button"
          className="w-full px-4 py-2 text-[11px] font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 text-left"
          onClick={() => setMetaOpen((v) => !v)}
        >
          <span
            className={cn(
              "text-primary/80 transition-transform inline-block",
              metaOpen && "rotate-90",
            )}
          >
            ▸
          </span>
          Contexto y programación
          <span className="font-normal opacity-70">
            {plan.scheduled_for
              ? `· ${new Date(plan.scheduled_for).toLocaleString("es-CL", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}`
              : "· sin horario"}
          </span>
        </button>
        {metaOpen ? (
          <div className="px-4 pb-3 grid gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-[11px]">Programar para</Label>
              <Input
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-[11px]">Contexto (JSON)</Label>
              <Textarea
                value={contextJson}
                onChange={(e) => setContextJson(e.target.value)}
                rows={2}
                className="text-[11px] font-mono min-h-[52px]"
                placeholder='{"demo": true}'
              />
            </div>
            <div className="sm:col-span-2">
              <Button
                size="sm"
                variant="secondary"
                className="h-7 gap-1"
                disabled={busy}
                onClick={() => {
                  const parsed = parseJsonObject(contextJson, "Contexto");
                  if (!parsed.ok) {
                    toast.error(parsed.error);
                    return;
                  }
                  onSaveMeta({
                    context: parsed.value,
                    scheduled_for: fromDatetimeLocal(scheduledFor),
                  });
                }}
              >
                <Save className="h-3.5 w-3.5" />
                Guardar contexto / programación
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ItemInspector({
  item,
  planWorkflowId,
  agentLabel,
  busy,
  onRun,
  onRetry,
  onSave,
  onDelete,
}: {
  item: WorkItem;
  planWorkflowId?: string | null;
  agentLabel: string;
  busy: boolean;
  onRun: () => void;
  onRetry: () => void;
  onSave: (patch: { title: string; kind: WorkItemKind; payload: Record<string, unknown> }) => void;
  onDelete: () => void;
}) {
  const safeKind = (k: unknown): WorkItemKind =>
    typeof k === "string" && k in ITEM_KIND_LABEL ? (k as WorkItemKind) : "note";
  const [title, setTitle] = useState(item.title || "");
  const [kind, setKind] = useState<WorkItemKind>(() => safeKind(item.kind));
  const [fields, setFields] = useState(() => draftFromPayload(safeKind(item.kind), item.payload));
  const [editingInsumos, setEditingInsumos] = useState(false);
  const defaultTab =
    item.status === "pending" || item.status === "queued" ? "insumos" : "resultado";
  const [tab, setTab] = useState(defaultTab);

  useEffect(() => {
    const nextKind = safeKind(item.kind);
    setTitle(item.title || "");
    setKind(nextKind);
    setFields(draftFromPayload(nextKind, item.payload));
    const next = item.status === "pending" || item.status === "queued" ? "insumos" : "resultado";
    setTab(next);
    setEditingInsumos(item.status === "pending" || item.status === "queued");
  }, [item.id, item.title, item.kind, item.payload, item.modified, item.status]);

  const view = extractResultView(item);
  const resultObj =
    item.result && typeof item.result === "object"
      ? (item.result as Record<string, unknown>)
      : null;
  const toolCalls = extractToolCalls(resultObj);
  const attempts = item.attempts ?? 0;
  const maxAttempts = item.max_attempts ?? 3;
  const ran = item.status === "done" || item.status === "failed" || !!item.result;

  const needsExecutionFetch =
    !!view.executionId && (view.nodes.length === 0 || !view.replyText.trim());
  const { data: executionDetail, isLoading: executionLoading } = useWorkflowExecution(
    needsExecutionFetch ? view.executionId : undefined,
  );

  const liveReply = useMemo(() => {
    if (view.replyText.trim()) return view.replyText;
    if (!executionDetail) return "";
    const ctx = executionDetail.context || {};
    for (const key of ["response", "response_text", "content", "summary", "digest", "message"]) {
      const v = ctx[key];
      if (typeof v === "string" && v.trim()) return v;
    }
    const fromLogs: string[] = [];
    for (const log of executionDetail.logs || []) {
      const out = log.output_data || {};
      for (const key of ["response", "response_text", "content", "message", "text"]) {
        const v = out[key];
        if (typeof v === "string" && v.trim()) {
          fromLogs.push(v.trim());
          break;
        }
      }
    }
    if (fromLogs.length) return fromLogs.join("\n\n");
    if (executionDetail.status) {
      return `${executionDetail.workflow_name || "Workflow"}: ${executionDetail.status} · ${executionDetail.completed_nodes ?? 0}/${executionDetail.total_nodes ?? 0} nodos`;
    }
    return "";
  }, [view.replyText, executionDetail]);

  const liveNodes = useMemo(() => {
    if (view.nodes.length) return view.nodes;
    return (executionDetail?.logs || []).map((log) => ({
      node: log.node_name || "Nodo",
      node_type: log.node_type,
      status: log.status,
      output: log.output_data,
      error: log.error_message,
    }));
  }, [view.nodes, executionDetail]);

  const wfId =
    (typeof item.payload?.workflow_id === "string" && item.payload.workflow_id) ||
    (typeof resultObj?.workflow_id === "string" && resultObj.workflow_id) ||
    planWorkflowId ||
    executionDetail?.workflow;

  const saveInsumos = () => {
    const draft: DraftItem = { key: item.id, title, kind, ...fields };
    const payload = payloadFromDraft(draft);
    if (!payload) return;
    if (!title.trim()) {
      toast.error("El ítem necesita un título");
      return;
    }
    onSave({ title: title.trim(), kind, payload });
    setEditingInsumos(false);
  };

  const readonlyInsumoRows = useMemo(() => {
    const rows: { label: string; value: string }[] = [
      { label: "Tipo", value: ITEM_KIND_LABEL[item.kind] ?? item.kind },
      { label: "Título", value: item.title },
    ];
    const p = item.payload && typeof item.payload === "object" ? item.payload : {};
    if (item.kind === "agent_turn") {
      rows.push({
        label: "Mensaje",
        value: typeof p.message === "string" ? p.message : "",
      });
    } else if (item.kind === "note") {
      rows.push({ label: "Texto", value: typeof p.text === "string" ? p.text : "" });
    } else if (item.kind === "function") {
      rows.push({
        label: "Slug",
        value: typeof p.function_slug === "string" ? p.function_slug : "",
      });
      rows.push({ label: "Parámetros", value: prettyJson(p.parameters ?? {}) });
    } else if (item.kind === "workflow") {
      if (typeof p.workflow_name === "string" && p.workflow_name) {
        rows.push({ label: "Workflow", value: p.workflow_name });
      }
      if (typeof p.workflow_id === "string" && p.workflow_id) {
        rows.push({ label: "ID", value: p.workflow_id });
      }
    }
    return rows.filter((r) => r.value.trim());
  }, [item]);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="shrink-0 border-b px-4 py-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-snug">{item.title}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {ITEM_KIND_LABEL[item.kind] ?? item.kind} · {agentLabel} · intentos {attempts}/
              {maxAttempts}
            </p>
          </div>
          <StatusChip label={itemStatusLabel(item.status)} tone={workPlanStatusTone(item.status)} />
        </div>
        <div className="flex gap-1.5">
          <Button size="sm" className="flex-1 h-8 gap-1.5" disabled={busy} onClick={onRun}>
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            Ejecutar
          </Button>
          {item.status === "failed" ? (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8 gap-1.5"
              disabled={busy}
              onClick={onRetry}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reintentar
            </Button>
          ) : null}
        </div>
      </div>

      <Tabs
        value={tab}
        onValueChange={setTab}
        className="flex-1 min-h-0 flex flex-col overflow-hidden"
      >
        <div className="shrink-0 px-3 pt-2">
          <TabsList className="w-full grid grid-cols-3 h-8">
            <TabsTrigger value="resultado" className="text-[11px] h-7">
              Resultado
            </TabsTrigger>
            <TabsTrigger value="insumos" className="text-[11px] h-7">
              Insumos
            </TabsTrigger>
            <TabsTrigger value="tecnico" className="text-[11px] h-7">
              Técnico
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="resultado"
          className="flex-1 min-h-0 m-0 overflow-hidden data-[state=inactive]:hidden"
        >
          <ScrollArea className="h-full">
            <div className="p-3 space-y-3">
              {executionLoading && !liveReply && !item.error_message ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground py-3">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Cargando detalle de la ejecución…
                </div>
              ) : (
                <WorkResultViewer
                  text={liveReply}
                  rawResult={item.result}
                  error={item.error_message}
                  filenameBase={item.title || "resultado-item"}
                  emptyHint={
                    view.hasResult
                      ? "La corrida terminó sin texto legible. Mira Técnico o los nodos abajo."
                      : "Este ítem aún no generó nada. Ejecútalo o revisa Insumos."
                  }
                />
              )}

              {toolCalls.length > 0 ? (
                <section className="space-y-1.5">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Tools
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {toolCalls.map((tc, i) => (
                      <details
                        key={`${tc.name}-${i}`}
                        className="rounded-lg border bg-muted/30 px-2.5 py-1.5 text-xs open:w-full"
                      >
                        <summary className="cursor-pointer font-medium text-primary list-none flex items-center gap-1">
                          <span className="truncate">{tc.name}</span>
                        </summary>
                        <pre className="mt-1.5 text-[11px] whitespace-pre-wrap break-words font-sans text-muted-foreground max-h-36 overflow-auto">
                          {tc.detail}
                        </pre>
                      </details>
                    ))}
                  </div>
                </section>
              ) : null}

              {liveNodes.length > 0 ? (
                <section className="space-y-1.5">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Nodos del flujo
                  </h3>
                  <ul className="space-y-1.5">
                    {liveNodes.map((n, i) => (
                      <li
                        key={`${n.node}-${i}`}
                        className="rounded-lg border bg-muted/25 px-2.5 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium flex-1 truncate">{n.node}</p>
                          {n.node_type ? (
                            <span className="text-[10px] text-muted-foreground">{n.node_type}</span>
                          ) : null}
                          {n.status ? (
                            <StatusChip
                              label={itemStatusLabel(n.status)}
                              tone={workPlanStatusTone(n.status)}
                            />
                          ) : null}
                        </div>
                        {n.error ? (
                          <p className="mt-1 text-[11px] text-destructive whitespace-pre-wrap">
                            {n.error}
                          </p>
                        ) : null}
                        {n.output && Object.keys(n.output as object).length > 0 ? (
                          <pre className="mt-1 text-[11px] whitespace-pre-wrap break-words font-sans text-muted-foreground max-h-28 overflow-auto">
                            {prettyJson(n.output)}
                          </pre>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {wfId ? (
                <Link
                  to={`/workflows/${String(wfId)}`}
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <Workflow className="h-3.5 w-3.5" />
                  Abrir canvas del workflow
                </Link>
              ) : null}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent
          value="insumos"
          className="flex-1 min-h-0 m-0 overflow-hidden data-[state=inactive]:hidden"
        >
          <ScrollArea className="h-full">
            <div className="p-3 space-y-3">
              <p className="text-[11px] text-muted-foreground">{ITEM_KIND_HINT[kind]}</p>

              {ran && !editingInsumos ? (
                <>
                  <div className="rounded-xl border bg-muted/20 divide-y divide-border/50">
                    {readonlyInsumoRows.map((row) => (
                      <div key={row.label} className="px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {row.label}
                        </p>
                        <pre className="mt-0.5 text-xs whitespace-pre-wrap break-words font-sans text-foreground/90">
                          {row.value}
                        </pre>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Así se ejecutó este paso. Puedes editar los insumos y volver a correrlo.
                  </p>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-full h-8"
                    onClick={() => setEditingInsumos(true)}
                  >
                    Editar insumos
                  </Button>
                </>
              ) : (
                <div className="space-y-2.5">
                  <div className="rounded-lg border bg-card/50 px-3 py-2 space-y-1.5">
                    <Label className="text-[11px]">Título</Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <div className="rounded-lg border bg-card/50 px-3 py-2 space-y-1.5">
                    <Label className="text-[11px]">Tipo de ítem</Label>
                    <Select value={kind} onValueChange={(v) => setKind(v as WorkItemKind)}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(ITEM_KIND_LABEL) as WorkItemKind[]).map((k) => (
                          <SelectItem key={k} value={k}>
                            {ITEM_KIND_LABEL[k]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-lg border border-primary/15 bg-primary/5 px-3 py-2 space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-primary/90">
                      Insumo
                    </p>
                    <KindFields
                      kind={kind}
                      fields={fields}
                      onChange={(patch) => setFields((f) => ({ ...f, ...patch }))}
                    />
                  </div>
                  <div className="flex gap-1.5">
                    {ran ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8"
                        onClick={() => setEditingInsumos(false)}
                      >
                        Cancelar
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1 h-8 gap-1"
                      disabled={busy}
                      onClick={saveInsumos}
                    >
                      <Save className="h-3.5 w-3.5" />
                      Guardar insumos
                    </Button>
                  </div>
                </div>
              )}

              <Button
                size="sm"
                variant="ghost"
                className="w-full h-8 text-destructive hover:text-destructive"
                disabled={busy}
                onClick={onDelete}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Quitar ítem
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent
          value="tecnico"
          className="flex-1 min-h-0 m-0 overflow-hidden data-[state=inactive]:hidden"
        >
          <ScrollArea className="h-full">
            <div className="p-3 space-y-3">
              <div className="rounded-lg border px-3 py-2 text-xs space-y-1">
                <p>
                  <span className="text-muted-foreground">Intentos · </span>
                  {attempts}/{maxAttempts}
                </p>
                <p>
                  <span className="text-muted-foreground">Estado · </span>
                  {itemStatusLabel(item.status)}
                </p>
                {view.executionId ? (
                  <p className="break-all">
                    <span className="text-muted-foreground">execution_id · </span>
                    {view.executionId}
                  </p>
                ) : null}
              </div>
              {view.metaJson && view.metaJson !== "{}" ? (
                <pre className="rounded-lg border bg-muted/30 px-3 py-2 text-[11px] whitespace-pre-wrap break-words font-mono text-muted-foreground max-h-64 overflow-auto">
                  {view.metaJson}
                </pre>
              ) : (
                <p className="text-xs text-muted-foreground">Sin metadata extra.</p>
              )}
              {wfId ? (
                <Link
                  to={`/workflows/${String(wfId)}`}
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <Workflow className="h-3.5 w-3.5" />
                  Abrir canvas del workflow
                </Link>
              ) : null}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KindFields({
  kind,
  fields,
  onChange,
}: {
  kind: WorkItemKind;
  fields: ReturnType<typeof draftFromPayload>;
  onChange: (patch: Partial<ReturnType<typeof draftFromPayload>>) => void;
}) {
  if (kind === "agent_turn") {
    return (
      <div className="space-y-1">
        <Label className="text-[11px]">Mensaje al agente</Label>
        <Textarea
          value={fields.message}
          onChange={(e) => onChange({ message: e.target.value })}
          rows={3}
          placeholder="Qué debe hacer el agente en este turno"
        />
      </div>
    );
  }
  if (kind === "note") {
    return (
      <div className="space-y-1">
        <Label className="text-[11px]">Texto de la nota</Label>
        <Textarea
          value={fields.noteText}
          onChange={(e) => onChange({ noteText: e.target.value })}
          rows={3}
          placeholder="Aviso o checklist para quien revise el plan"
        />
      </div>
    );
  }
  if (kind === "function") {
    return (
      <div className="space-y-2">
        <div className="space-y-1">
          <Label className="text-[11px]">function_slug</Label>
          <Input
            value={fields.functionSlug}
            onChange={(e) => onChange({ functionSlug: e.target.value })}
            placeholder="ej. dentidesk-horas-disponibles"
            className="h-8"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px]">parameters (JSON)</Label>
          <Textarea
            value={fields.parametersJson}
            onChange={(e) => onChange({ parametersJson: e.target.value })}
            rows={3}
            className="font-mono text-xs"
            placeholder="{}"
          />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label className="text-[11px]">workflow_id</Label>
        <Input
          value={fields.workflowId}
          onChange={(e) => onChange({ workflowId: e.target.value })}
          placeholder="UUID del workflow"
          className="h-8"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-[11px]">Nombre (alternativa)</Label>
        <Input
          value={fields.workflowName}
          onChange={(e) => onChange({ workflowName: e.target.value })}
          placeholder="[DEMO SH] Checklist…"
          className="h-8"
        />
      </div>
    </div>
  );
}

function CreatePlanDialog({
  open,
  onOpenChange,
  agents,
  workflows,
  pending,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  agents: { id: string; name: string; slug: string }[];
  workflows: { id: string; name: string }[];
  pending: boolean;
  onSubmit: (payload: CreateWorkPlanPayload) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [agentId, setAgentId] = useState("");
  const [workflowId, setWorkflowId] = useState<string>("none");
  const [scheduledFor, setScheduledFor] = useState("");
  const [contextJson, setContextJson] = useState("{}");
  const [templateId, setTemplateId] = useState<string>("blank");
  const [items, setItems] = useState<DraftItem[]>([
    newDraftItem({
      title: "Primera tarea",
      kind: "agent_turn",
      message: "Revisar pendientes del día",
    }),
  ]);

  const agentIdBySlug = useMemo(() => {
    const map: Record<string, string> = {};
    for (const a of agents) {
      if (a.slug) map[a.slug] = a.id;
    }
    return map;
  }, [agents]);

  const agentSlugs = useMemo(() => new Set(agents.map((a) => a.slug).filter(Boolean)), [agents]);
  const workflowNames = useMemo(() => workflows.map((w) => w.name), [workflows]);

  const workflowIdByName = (needle: string) => {
    const hit = workflows.find((w) => (w.name || "").toLowerCase().includes(needle.toLowerCase()));
    return hit?.id ?? null;
  };

  useEffect(() => {
    if (!open) return;
    setName("");
    setDescription("");
    setAgentId(agents[0]?.id ? String(agents[0].id) : "");
    setWorkflowId("none");
    setScheduledFor("");
    setContextJson("{}");
    setTemplateId("blank");
    setItems([
      newDraftItem({
        title: "Primera tarea",
        kind: "agent_turn",
        message: "Revisar pendientes del día",
      }),
    ]);
  }, [open, agents]);

  const applyTemplate = (id: WorkPlanTemplateId | "blank") => {
    setTemplateId(id);
    if (id === "blank") return;
    const tpl = WORK_PLAN_TEMPLATES.find((t) => t.id === id);
    if (!tpl) return;
    const built = tpl.build({
      agentIdBySlug,
      workflowIdByName,
    });
    if (!built) {
      toast.error(tpl.requiresHint);
      return;
    }
    setName(built.name);
    setDescription(built.description || "");
    setAgentId(built.assigned_agent != null ? String(built.assigned_agent) : "");
    setWorkflowId(built.workflow ? String(built.workflow) : "none");
    setContextJson(prettyJson(built.context ?? {}) || "{}");
    setScheduledFor(toDatetimeLocal(built.scheduled_for));
    setItems(
      (built.items || []).map((it) => {
        const base = draftFromPayload(it.kind || "agent_turn", it.payload);
        return newDraftItem({
          title: it.title,
          kind: (it.kind || "agent_turn") as WorkItemKind,
          ...base,
          message:
            base.message ||
            (typeof it.payload?.message === "string" ? it.payload.message : it.title),
        });
      }),
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo plan de trabajo</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label>Plantilla</Label>
            <Select
              value={templateId}
              onValueChange={(v) => applyTemplate(v as WorkPlanTemplateId | "blank")}
            >
              <SelectTrigger>
                <SelectValue placeholder="En blanco o ejemplo real" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blank">En blanco</SelectItem>
                {WORK_PLAN_TEMPLATES.map((t) => {
                  const avail = templateAvailability(t, agentSlugs, workflowNames);
                  return (
                    <SelectItem key={t.id} value={t.id} disabled={!avail.available}>
                      {t.label}
                      {!avail.available ? " (no disponible aquí)" : ""}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Ejemplos reales: Agenda Clínica WM (Dentidesk) o Ops SmartHydro. Si no ves el tuyo,
              cambia de sucursal.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-name">Nombre</Label>
            <Input
              id="plan-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Viernes ops"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="plan-desc">Descripción</Label>
            <Textarea
              id="plan-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Qué debe lograr este plan"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Agente asignado</Label>
              <Select value={agentId || undefined} onValueChange={setAgentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Elige un agente" />
                </SelectTrigger>
                <SelectContent>
                  {agents
                    .filter((a) => a.id)
                    .map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name || a.id}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Workflow (opcional)</Label>
              <Select value={workflowId || "none"} onValueChange={setWorkflowId}>
                <SelectTrigger>
                  <SelectValue placeholder="Ninguno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Ninguno</SelectItem>
                  {workflows
                    .filter((w) => w.id)
                    .map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name || w.id}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Programar para (opcional)</Label>
            <Input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Contexto (JSON)</Label>
            <Textarea
              value={contextJson}
              onChange={(e) => setContextJson(e.target.value)}
              rows={2}
              className="font-mono text-xs"
              placeholder='{"demo": true}'
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Ítems</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7"
                onClick={() =>
                  setItems((prev) => [
                    ...prev,
                    newDraftItem({ title: `Tarea ${prev.length + 1}`, kind: "agent_turn" }),
                  ])
                }
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Ítem
              </Button>
            </div>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={item.key} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      #{idx + 1}
                    </span>
                    <Input
                      value={item.title}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((it) =>
                            it.key === item.key ? { ...it, title: e.target.value } : it,
                          ),
                        )
                      }
                      placeholder="Título"
                      className="h-8"
                    />
                    <Select
                      value={item.kind}
                      onValueChange={(v) =>
                        setItems((prev) =>
                          prev.map((it) =>
                            it.key === item.key ? { ...it, kind: v as WorkItemKind } : it,
                          ),
                        )
                      }
                    >
                      <SelectTrigger className="h-8 w-[140px] shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(ITEM_KIND_LABEL) as WorkItemKind[]).map((k) => (
                          <SelectItem key={k} value={k}>
                            {ITEM_KIND_LABEL[k]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 shrink-0"
                      disabled={items.length <= 1}
                      onClick={() => setItems((prev) => prev.filter((it) => it.key !== item.key))}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{ITEM_KIND_HINT[item.kind]}</p>
                  <KindFields
                    kind={item.kind}
                    fields={item}
                    onChange={(patch) =>
                      setItems((prev) =>
                        prev.map((it) => (it.key === item.key ? { ...it, ...patch } : it)),
                      )
                    }
                  />
                  {item.kind === "workflow" && workflows.length > 0 ? (
                    <Select
                      value={item.workflowId || "none"}
                      onValueChange={(v) =>
                        setItems((prev) =>
                          prev.map((it) =>
                            it.key === item.key
                              ? {
                                  ...it,
                                  workflowId: v === "none" ? "" : v,
                                  workflowName:
                                    v === "none"
                                      ? ""
                                      : workflows.find((w) => w.id === v)?.name || "",
                                }
                              : it,
                          ),
                        )
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Elegir workflow" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Elegir…</SelectItem>
                        {workflows.map((w) => (
                          <SelectItem key={w.id} value={w.id}>
                            {w.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            disabled={pending || !name.trim() || !agentId}
            onClick={() => {
              const parsedCtx = parseJsonObject(contextJson, "Contexto");
              if (!parsedCtx.ok) {
                toast.error(parsedCtx.error);
                return;
              }
              const ctx = parsedCtx.value;
              const builtItems: NonNullable<CreateWorkPlanPayload["items"]> = [];
              for (let i = 0; i < items.length; i++) {
                const it = items[i];
                if (!it.title.trim()) {
                  toast.error(`El ítem #${i + 1} necesita título`);
                  return;
                }
                const payload = payloadFromDraft(it);
                if (!payload) return;
                builtItems.push({
                  title: it.title.trim(),
                  kind: it.kind,
                  sort_order: i,
                  payload,
                });
              }
              const agentPk = Number(agentId);
              onSubmit({
                name: name.trim(),
                description: description.trim() || undefined,
                assigned_agent: Number.isFinite(agentPk) ? agentPk : agentId,
                workflow: workflowId === "none" ? null : workflowId,
                scheduled_for: fromDatetimeLocal(scheduledFor),
                context: ctx,
                items: builtItems,
              });
            }}
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
            Crear plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddItemDialog({
  open,
  onOpenChange,
  workflows,
  pending,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  workflows: { id: string; name: string }[];
  pending: boolean;
  onSubmit: (draft: DraftItem) => void;
}) {
  const [draft, setDraft] = useState<DraftItem>(newDraftItem());

  useEffect(() => {
    if (!open) return;
    setDraft(newDraftItem({ title: "Nuevo ítem", kind: "agent_turn" }));
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Añadir ítem al plan</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Título</Label>
            <Input
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Tipo</Label>
            <Select
              value={draft.kind}
              onValueChange={(v) => setDraft((d) => ({ ...d, kind: v as WorkItemKind }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(ITEM_KIND_LABEL) as WorkItemKind[]).map((k) => (
                  <SelectItem key={k} value={k}>
                    {ITEM_KIND_LABEL[k]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">{ITEM_KIND_HINT[draft.kind]}</p>
          </div>
          <KindFields
            kind={draft.kind}
            fields={draft}
            onChange={(patch) => setDraft((d) => ({ ...d, ...patch }))}
          />
          {draft.kind === "workflow" && workflows.length > 0 ? (
            <Select
              value={draft.workflowId || "none"}
              onValueChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  workflowId: v === "none" ? "" : v,
                  workflowName: v === "none" ? "" : workflows.find((w) => w.id === v)?.name || "",
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Elegir workflow" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Elegir…</SelectItem>
                {workflows.map((w) => (
                  <SelectItem key={w.id} value={w.id}>
                    {w.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={pending} onClick={() => onSubmit(draft)}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
            Añadir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
