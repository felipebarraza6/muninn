import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Bot, ClipboardList, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FlowCanvasSkeleton, PageSkeleton } from "@/components/ui/page-skeleton";
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
import { formatRelative } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import { isOrganizationOwnerScope, isSuperAdmin } from "@/lib/authGuards";
import {
  BUCKETS,
  draftFromPayload,
  extractResultView,
  itemPreview,
  newDraftItem,
  payloadFromDraft,
  type BucketId,
  type DraftItem,
} from "@/components/work-plans/work-plan-model";
import { PlanHeader } from "@/components/work-plans/plan-header";
import { PlanFlowList } from "@/components/work-plans/plan-flow-list";
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
  const [confirmDeletePlan, setConfirmDeletePlan] = useState(false);
  const [confirmDeleteItem, setConfirmDeleteItem] = useState(false);

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
      navigate("/app");
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

  const reorderByIds = (orderedIds: string[]) => {
    const updates = orderedIds
      .map((id, sort_order) => {
        const cur = items.find((i) => i.id === id);
        if (!cur || (cur.sort_order ?? 0) === sort_order) return null;
        return { id, sort_order };
      })
      .filter((u): u is { id: string; sort_order: number } => !!u);
    if (!updates.length) return;
    Promise.all(
      updates.map(
        (u) =>
          new Promise<void>((resolve, reject) => {
            updateItem.mutate(u, {
              onSuccess: () => resolve(),
              onError: (e) => reject(e),
            });
          }),
      ),
    )
      .then(() => toast.success("Orden actualizado"))
      .catch((e) => toast.error(apiErrorMessage(e, "No se pudo reordenar")));
  };

  if (isLoading) {
    return (
      <div className="h-dvh bg-background">
        <PageSkeleton variant="workspace" className="h-full max-w-none" padded={false} />
      </div>
    );
  }

  if (error) {
    const status = apiErrorStatus(error);
    const detail = apiErrorDetail(error);
    const hint =
      status === 404
        ? "El API no tiene la ruta work-plans. Reinicia el API y vuelve a intentar."
        : status === 403
          ? "Sin permiso o suscripción activa para ai_agents en esta sucursal."
          : status === 401
            ? "Sesión inválida — vuelve a iniciar sesión."
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
          <Link to="/app">Volver</Link>
        </Button>
      </div>
    );
  }

  const inspectorProps = selectedItem
    ? {
        item: selectedItem,
        planWorkflowId: planDetail?.workflow ?? null,
        planAgentId: planDetail?.assigned_agent != null ? String(planDetail.assigned_agent) : null,
        agentLabel: agentName(selectedItem.assigned_agent || planDetail?.assigned_agent),
        agents: agents.map((a) => ({
          id: String(a.id),
          name: a.name || a.slug || String(a.id),
        })),
        busy:
          runItem.isPending || retryItem.isPending || updateItem.isPending || deleteItem.isPending,
        onRun: () => {
          runItem.mutate(selectedItem.id, {
            onSuccess: (data) => {
              if (data.item?.id) setSelectedItemId(String(data.item.id));
              const isMobile =
                typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
              if (isMobile) setInspectorOpen(true);
              toast.success("Ítem ejecutado — revisa el resultado a la derecha");
            },
            onError: (e) => toast.error(apiErrorMessage(e, "No se pudo ejecutar el ítem")),
          });
        },
        onRetry: () => {
          retryItem.mutate(selectedItem.id, {
            onSuccess: () => toast.success("Reintento lanzado — revisa el resultado"),
            onError: (e) => toast.error(apiErrorMessage(e, "No se pudo reintentar")),
          });
        },
        onSave: (patch: {
          title: string;
          kind: WorkItemKind;
          payload: Record<string, unknown>;
          assigned_agent?: string | number | null;
        }) => {
          updateItem.mutate(
            { id: selectedItem.id, ...patch },
            {
              onSuccess: () => toast.success("Ítem guardado"),
              onError: (e) => toast.error(apiErrorMessage(e, "No se pudo guardar el ítem")),
            },
          );
        },
        onDelete: () => setConfirmDeleteItem(true),
      }
    : null;

  return (
    <div className="h-dvh flex flex-col bg-background overflow-hidden">
      <div className="shrink-0 border-b border-border/40 bg-background/80 backdrop-blur-md px-3 py-2 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 shrink-0 gap-1.5 px-2 text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link to="/app" title="Volver (Esc)">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xs font-medium">Volver</span>
          </Link>
        </Button>
        <ClipboardList className="h-4 w-4 text-primary shrink-0" />
        <div className="min-w-0 flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight truncate">Planes</span>
          <span className="text-[10px] text-muted-foreground hidden sm:inline truncate">
            Planifica pasos y ejecútalos con tus agentes
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
            "w-full md:w-[320px] lg:w-[360px] border-r border-border/40 bg-muted/15 flex-col shrink-0 min-h-0",
            mobileShowPlan && selectedId ? "hidden md:flex" : "flex",
          )}
        >
          <div className="border-b border-border/40 px-3 pt-3 pb-2.5 space-y-2.5 shrink-0">
            <div className="flex items-baseline justify-between gap-2 px-0.5">
              <p className="text-xs font-semibold tracking-tight text-foreground">Bandeja</p>
              <p className="text-[10px] text-muted-foreground tabular-nums">
                {filtered.length} plan{filtered.length === 1 ? "" : "es"}
              </p>
            </div>
            <div className="flex gap-0.5 rounded-lg bg-muted/30 p-0.5">
              {BUCKETS.map((b) => {
                const count = plans.filter((p) => b.match(p.status)).length;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBucket(b.id)}
                    className={cn(
                      "flex-1 rounded-md px-1.5 py-1.5 text-[10px] font-medium transition-colors",
                      bucket === b.id
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {b.label}
                    <span className="ml-0.5 tabular-nums opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar en la bandeja…"
                className="h-8 pl-8 text-sm bg-background/50"
              />
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
            <div className="divide-y divide-border/40">
              {filtered.length === 0 ? (
                <div className="text-center py-10 px-4 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Bandeja vacía. Usa una plantilla de tu sucursal o crea un plan nuevo.
                  </p>
                  <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)}>
                    Usar plantilla
                  </Button>
                </div>
              ) : (
                filtered.map((p) => {
                  const selected = selectedId === p.id;
                  const agent = agentName(p.assigned_agent);
                  const tone = workPlanStatusTone(p.status);
                  const steps = p.items?.length ?? 0;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectPlan(p.id)}
                      className={cn(
                        "w-full text-left px-3 py-3 transition-colors relative cursor-pointer",
                        selected ? "bg-primary/10" : "hover:bg-muted/35",
                      )}
                    >
                      {selected ? (
                        <span
                          aria-hidden
                          className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary"
                        />
                      ) : null}
                      <div className="flex gap-2.5 min-w-0">
                        <div className="relative shrink-0 mt-0.5">
                          <span
                            className={cn(
                              "inline-flex h-9 w-9 items-center justify-center rounded-full ring-1",
                              p.assigned_agent
                                ? "bg-primary/15 text-primary ring-primary/30"
                                : "bg-muted/80 text-muted-foreground ring-border/50",
                            )}
                            title={p.assigned_agent ? `Agente: ${agent}` : "Sin agente asignado"}
                          >
                            <Bot className="h-4 w-4" />
                          </span>
                          <span
                            aria-hidden
                            className={cn(
                              "absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-background",
                              tone === "success" && "bg-success",
                              tone === "failed" && "bg-destructive",
                              tone === "running" && "bg-info",
                              tone === "pending" && "bg-warning",
                              (tone === "idle" || tone === "skipped" || !tone) &&
                                "bg-muted-foreground/50",
                            )}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <p
                              className={cn(
                                "text-[13px] truncate flex-1 leading-snug",
                                selected ? "font-semibold text-foreground" : "font-medium",
                              )}
                            >
                              {p.name}
                            </p>
                            <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                              {formatRelative(p.modified || p.created)}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[11px] text-muted-foreground truncate">
                            <span className="text-foreground/70">{agent}</span>
                            <span className="mx-1 opacity-40">·</span>
                            <span>{planStatusLabel(p.status)}</span>
                            <span className="mx-1 opacity-40">·</span>
                            <span className="tabular-nums">
                              {steps} paso{steps === 1 ? "" : "s"}
                            </span>
                          </p>
                          <p className="mt-1 text-[11px] text-muted-foreground/90 line-clamp-2 leading-snug">
                            {p.description?.trim() || "Plan de agentes y flujos · sin descripción"}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </aside>

        <section
          className={cn(
            "flex-1 min-h-0 min-w-0 flex-col border-r border-border/40 relative overflow-hidden",
            "bg-[radial-gradient(ellipse_80%_50%_at_20%_0%,rgba(45,212,191,0.08),transparent_55%),linear-gradient(to_bottom,transparent,var(--background))]",
            mobileShowPlan && selectedId ? "flex" : "hidden md:flex",
          )}
        >
          {!selectedId ? (
            <EmptyState
              className="flex-1 border-0 bg-transparent rounded-none"
              title="Elige un plan a la izquierda o crea uno para abrir el lienzo de trabajo."
              action={
                <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)}>
                  Nuevo plan
                </Button>
              }
            />
          ) : detailLoading && !planDetail ? (
            <FlowCanvasSkeleton />
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
                doneCount={items.filter((i) => i.status === "done").length}
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
                onDelete={() => setConfirmDeletePlan(true)}
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
                        Toca un ítem para ver el detalle a la derecha.
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
                              "w-full text-left rounded-lg px-2 py-1.5 text-[11px] transition-colors cursor-pointer",
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
              <div className="shrink-0 px-4 py-2.5 border-b border-border/40 flex items-center gap-2 bg-background/40 backdrop-blur-sm">
                <p className="text-[11px] text-muted-foreground flex-1">
                  Flujo · arrastra el asa ⋮⋮ para reordenar · clic para ver detalle
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1"
                  onClick={() => setAddItemOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Añadir paso
                </Button>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
                <div className="p-5 max-w-2xl mx-auto w-full">
                  {items.length === 0 ? (
                    <div className="text-center py-14 space-y-3 rounded-2xl border border-dashed border-border/50 bg-background/40">
                      <p className="text-sm text-muted-foreground">
                        Este plan aún no tiene pasos. Añade un agente, skill, workflow o nota.
                      </p>
                      <Button size="sm" onClick={() => setAddItemOpen(true)}>
                        Añadir paso
                      </Button>
                    </div>
                  ) : (
                    <PlanFlowList
                      items={items}
                      selectedItemId={selectedItemId}
                      disabled={updateItem.isPending}
                      onSelect={selectItem}
                      onReorder={reorderByIds}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </section>

        <aside className="hidden md:flex w-[400px] lg:w-[440px] bg-muted/10 flex-col shrink-0 min-h-0 overflow-hidden border-l border-border/40">
          {!inspectorProps ? (
            <EmptyState
              className="flex-1 border-0 bg-transparent rounded-none"
              title="Elige un paso del flujo para ver archivos, métricas e insumos."
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
            <SheetTitle className="text-sm">Paso del flujo</SheetTitle>
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

      <ConfirmDialog
        open={confirmDeletePlan}
        onOpenChange={setConfirmDeletePlan}
        title="¿Eliminar este plan?"
        description={
          planDetail?.name
            ? `Se eliminará «${planDetail.name}» con todos sus pasos y resultados. Esta acción no se puede deshacer.`
            : "Se eliminará el plan con todos sus pasos y resultados. Esta acción no se puede deshacer."
        }
        confirmLabel="Eliminar plan"
        destructive
        busy={deletePlan.isPending}
        onConfirm={() => {
          if (!selectedId) return;
          deletePlan.mutate(selectedId, {
            onSuccess: () => {
              toast.success("Plan eliminado");
              setConfirmDeletePlan(false);
              setSelectedId("");
              setSearchParams({}, { replace: true });
            },
            onError: (e) => toast.error(apiErrorMessage(e, "No se pudo eliminar")),
          });
        }}
      />

      <ConfirmDialog
        open={confirmDeleteItem}
        onOpenChange={setConfirmDeleteItem}
        title="¿Quitar este paso del plan?"
        description={
          selectedItem?.title
            ? `Se quitará «${selectedItem.title}» del flujo. Esta acción no se puede deshacer.`
            : "Se quitará el paso del flujo. Esta acción no se puede deshacer."
        }
        confirmLabel="Quitar paso"
        destructive
        busy={deleteItem.isPending}
        onConfirm={() => {
          if (!selectedItem) return;
          deleteItem.mutate(
            { id: selectedItem.id, planId: selectedId },
            {
              onSuccess: () => {
                toast.success("Ítem eliminado");
                setConfirmDeleteItem(false);
                setInspectorOpen(false);
                setSelectedItemId(null);
              },
              onError: (e) => toast.error(apiErrorMessage(e, "No se pudo eliminar el ítem")),
            },
          );
        }}
      />
    </div>
  );
}
