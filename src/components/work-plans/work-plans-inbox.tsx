import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Bot,
  ClipboardList,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import { useAgents } from "@/api/hooks/useAgents";
import { useWorkflows } from "@/api/hooks/useWorkflows";
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
import { itemStatusLabel, planStatusLabel, workPlanStatusTone } from "@/lib/workPlanStatus";
import { cn } from "@/lib/utils";
import { isOrganizationOwnerScope, isSuperAdmin } from "@/lib/authGuards";
import {
  BUCKETS,
  ITEM_KIND_LABEL,
  ItemStatusIcon,
  draftFromPayload,
  extractResultView,
  insumoPreview,
  itemPreview,
  newDraftItem,
  payloadFromDraft,
  type BucketId,
  type DraftItem,
} from "@/components/work-plans/work-plan-model";
import { PlanHeader } from "@/components/work-plans/plan-header";
import { ItemInspector } from "@/components/work-plans/item-inspector";
import { CreatePlanDialog } from "@/components/work-plans/create-plan-dialog";
import { AddItemDialog } from "@/components/work-plans/add-item-dialog";

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

