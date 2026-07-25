import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, GitBranch, Loader2, Play, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBanner } from "@/components/ui/error-banner";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import { WorkflowFlowStrip } from "@/components/workflows/workflow-flow-strip";
import { WorkflowTriggerConfigFields } from "@/components/workflows/workflow-trigger-config-fields";
import {
  useActivateWorkflow,
  useCreateWorkflow,
  useCreateWorkflowEdge,
  useCreateWorkflowNode,
  useDeactivateWorkflow,
  useDeleteWorkflow,
  useExecuteWorkflow,
  useUpdateWorkflow,
  useWorkflow,
  useWorkflowTriggerTypes,
  useWorkflows,
} from "@/api/hooks/useWorkflows";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import { apiErrorMessage } from "@/lib/apiError";
import { motionTokens } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { isOrganizationOwnerScope, isSuperAdmin } from "@/lib/authGuards";
import {
  WORKFLOW_STATUS_OPTIONS,
  resolveTriggerOptions,
  workflowStatusLabel,
  workflowTriggerLabel,
} from "@/lib/workflowCatalog";
import {
  draftFromTriggerConfig,
  emptyTriggerConfigDraft,
  triggerConfigPayload,
  type TriggerConfigDraft,
} from "@/lib/workflowTriggerConfig";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function WorkflowsPage() {
  const navigate = useNavigate();
  const reduceMotion = useMotionPrefs();
  const [searchParams, setSearchParams] = useSearchParams();
  const idFromUrl = searchParams.get("id");
  const { data: workflows = [], isLoading, error } = useWorkflows();
  const [selectedId, setSelectedId] = useState(idFromUrl ?? "");
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [triggerType, setTriggerType] = useState("manual");
  const [status, setStatus] = useState("draft");
  const createWf = useCreateWorkflow();
  const createNode = useCreateWorkflowNode();
  const createEdge = useCreateWorkflowEdge();
  const execute = useExecuteWorkflow();
  const { data: triggerTypesApi = [] } = useWorkflowTriggerTypes();
  const showBranchFilter = isSuperAdmin() || isOrganizationOwnerScope();

  const triggerOptions = useMemo(() => resolveTriggerOptions(triggerTypesApi), [triggerTypesApi]);

  useEffect(() => {
    if (idFromUrl) setSelectedId(idFromUrl);
  }, [idFromUrl]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      navigate("/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const filtered = useMemo(() => {
    if (!query.trim()) return workflows;
    const q = query.toLowerCase();
    return workflows.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        (w.description || "").toLowerCase().includes(q) ||
        (w.trigger_type || "").toLowerCase().includes(q),
    );
  }, [workflows, query]);

  const selected = workflows.find((w) => w.id === selectedId) ?? filtered[0];

  useEffect(() => {
    if (!selectedId && filtered[0]) {
      setSelectedId(filtered[0].id);
      setSearchParams({ id: filtered[0].id }, { replace: true });
    }
  }, [filtered, selectedId, setSearchParams]);

  if (isLoading) {
    return (
      <div className="h-dvh bg-background">
        <PageSkeleton variant="inbox" className="h-full max-w-none px-4 py-4" padded={false} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center gap-3 px-6">
        <ErrorBanner
          className="max-w-md w-full"
          message={apiErrorMessage(error, "No se pudieron cargar los workflows")}
        />
        <Button variant="outline" asChild>
          <Link to="/">Volver</Link>
        </Button>
      </div>
    );
  }

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
        <GitBranch className="h-4 w-4 text-primary shrink-0" />
        <div className="min-w-0 flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight truncate">Workflows</span>
          <span className="text-[10px] text-muted-foreground hidden sm:inline truncate">
            OPS-agents · orquestación
          </span>
        </div>
        <span className="ml-1 hidden md:inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
          Preview
        </span>
        <div className="ml-auto flex items-center gap-2">
          {showBranchFilter ? <StudioBranchFilter /> : null}
          <Button size="sm" variant="ghost" className="h-8 hidden md:inline-flex" asChild>
            <Link to="/planes">Planes</Link>
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1.5 shadow-sm shadow-primary/20"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Nuevo
          </Button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <aside className="w-full md:w-[320px] border-r bg-card flex flex-col shrink-0">
          <div className="border-b px-3 py-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar workflow…"
                className="h-8 pl-8 text-sm"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filtered.length === 0 ? (
                <EmptyState
                  className="border-0 bg-transparent py-10 px-4"
                  title="No hay workflows"
                  description="Creá uno para orquestar nodos."
                />
              ) : (
                <AnimatePresence initial={false}>
                  {filtered.map((w, i) => {
                    const active = selected?.id === w.id;
                    const st = String(w.status || "").toLowerCase();
                    return (
                      <motion.button
                        key={w.id}
                        type="button"
                        initial={reduceMotion ? false : { opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: motionTokens.fast,
                          delay: reduceMotion ? 0 : Math.min(i, 8) * 0.015,
                          ease: motionTokens.ease,
                        }}
                        onClick={() => {
                          setSelectedId(w.id);
                          setSearchParams({ id: w.id }, { replace: true });
                        }}
                        className={cn(
                          "w-full text-left rounded-xl border px-3 py-2.5 transition-colors",
                          active
                            ? "border-primary/40 bg-primary/10 shadow-[0_0_20px_-12px_color-mix(in_oklab,var(--primary)_50%,transparent)]"
                            : "border-transparent hover:bg-muted/50 hover:border-border/50",
                        )}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className={cn(
                              "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                              st === "active"
                                ? "bg-success shadow-[0_0_8px_color-mix(in_oklab,var(--success)_70%,transparent)]"
                                : st === "paused"
                                  ? "bg-warning"
                                  : "bg-muted-foreground/40",
                            )}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">{w.name}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                              {workflowTriggerLabel(w.trigger_type)} ·{" "}
                              {workflowStatusLabel(w.status)} · {w.execution_count ?? 0} runs
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </ScrollArea>
        </aside>

        <section className="flex-1 min-w-0 flex flex-col">
          {!selected ? (
            <EmptyState
              className="flex-1 border-0 bg-transparent rounded-none"
              title="Selecciona un workflow"
              description="Elegí uno de la lista o creá uno nuevo."
            />
          ) : (
            <>
              <div className="shrink-0 border-b px-4 py-3 flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-semibold truncate">{selected.name}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {selected.description || "Sin descripción"} · trigger{" "}
                    {selected.trigger_type || "manual"}
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <Button size="sm" variant="outline" className="h-8" asChild>
                    <Link to={`/workflows/${selected.id}`}>Abrir canvas</Link>
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 gap-1"
                    disabled={execute.isPending}
                    onClick={() =>
                      execute.mutate(
                        { id: selected.id },
                        {
                          onSuccess: () => toast.success("Workflow ejecutado"),
                          onError: (e) =>
                            toast.error(apiErrorMessage(e, "No se pudo ejecutar el workflow")),
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
              <WorkflowPreview
                workflowId={selected.id}
                onExecute={() => {
                  execute.mutate(
                    { id: selected.id },
                    {
                      onSuccess: () => toast.success("Workflow ejecutado"),
                      onError: (e) =>
                        toast.error(apiErrorMessage(e, "No se pudo ejecutar el workflow")),
                    },
                  );
                }}
                executePending={execute.isPending}
              />
            </>
          )}
        </section>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nuevo workflow</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-1">
            <div className="space-y-1.5">
              <Label htmlFor="wf-name">Nombre</Label>
              <Input
                id="wf-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Orquestación agente ops"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="wf-desc">Descripción</Label>
              <Textarea
                id="wf-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Qué hace este flujo (opcional)"
                className="text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Trigger</Label>
                <Select value={triggerType} onValueChange={setTriggerType}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerOptions.map((t) => (
                      <SelectItem key={t.value} value={t.value} disabled={!t.supported}>
                        {t.label}
                        {!t.supported ? " (próx.)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Estado</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WORKFLOW_STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Se crea con nodos Inicio → Agente. En el canvas podés sumar LLM, función, condición,
              delay, API, etc.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={
                !name.trim() || createWf.isPending || createNode.isPending || createEdge.isPending
              }
              onClick={() => {
                createWf.mutate(
                  {
                    name: name.trim(),
                    description: description.trim() || undefined,
                    trigger_type: triggerType,
                    status,
                    is_active: status === "active",
                  },
                  {
                    onSuccess: (wf) => {
                      createNode.mutate(
                        {
                          workflow: wf.id,
                          node_type: "trigger",
                          node_key: "start",
                          name: "Inicio",
                          position_x: 80,
                          position_y: 120,
                          config: {},
                        },
                        {
                          onSuccess: (triggerNode) => {
                            createNode.mutate(
                              {
                                workflow: wf.id,
                                node_type: "agent",
                                node_key: "agent-1",
                                name: "Agente",
                                position_x: 400,
                                position_y: 120,
                                config: {
                                  message: "Ejecuta la tarea del contexto del workflow",
                                  max_iterations: 4,
                                },
                              },
                              {
                                onSuccess: (agentNode) => {
                                  createEdge.mutate(
                                    {
                                      workflow: wf.id,
                                      from_node: triggerNode.id,
                                      to_node: agentNode.id,
                                    },
                                    {
                                      onSettled: () => {
                                        toast.success("Workflow creado");
                                        setCreateOpen(false);
                                        setName("");
                                        setDescription("");
                                        setTriggerType("manual");
                                        setStatus("draft");
                                        setSelectedId(wf.id);
                                        setSearchParams({ id: wf.id }, { replace: true });
                                        navigate(`/workflows/${wf.id}`);
                                      },
                                    },
                                  );
                                },
                                onError: (e) =>
                                  toast.error(
                                    apiErrorMessage(e, "No se pudo crear el nodo agente"),
                                  ),
                              },
                            );
                          },
                          onError: (e) =>
                            toast.error(apiErrorMessage(e, "No se pudo crear el nodo trigger")),
                        },
                      );
                    },
                    onError: (e) => toast.error(apiErrorMessage(e, "No se pudo crear el workflow")),
                  },
                );
              }}
            >
              Crear y abrir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WorkflowPreview({
  workflowId,
  onExecute,
  executePending,
}: {
  workflowId: string;
  onExecute: () => void;
  executePending: boolean;
}) {
  const reduceMotion = useMotionPrefs();
  const { data: detail, isLoading } = useWorkflow(workflowId);
  const updateWf = useUpdateWorkflow();
  const activate = useActivateWorkflow();
  const deactivate = useDeactivateWorkflow();
  const deleteWf = useDeleteWorkflow();
  const { data: triggerTypesApi = [] } = useWorkflowTriggerTypes();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [triggerType, setTriggerType] = useState("manual");
  const [triggerConfig, setTriggerConfig] = useState<TriggerConfigDraft>(emptyTriggerConfigDraft);
  const [status, setStatus] = useState("draft");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  const triggerOptions = useMemo(() => resolveTriggerOptions(triggerTypesApi), [triggerTypesApi]);

  useEffect(() => {
    if (!detail) return;
    setName(detail.name || "");
    setDescription(detail.description || "");
    setTriggerType(detail.trigger_type || "manual");
    setTriggerConfig(draftFromTriggerConfig(detail.trigger_type || "manual", detail.trigger_config));
    setStatus(detail.status || "draft");
  }, [detail]);

  const nodes = useMemo(
    () => (detail?.nodes ?? []).filter((n) => n.is_active !== false),
    [detail?.nodes],
  );
  const edges = useMemo(
    () => (detail?.edges ?? []).filter((e) => e.is_active !== false),
    [detail?.edges],
  );

  const savedTriggerPayload = useMemo(
    () =>
      detail
        ? triggerConfigPayload(
            detail.trigger_type || "manual",
            draftFromTriggerConfig(detail.trigger_type || "manual", detail.trigger_config),
          )
        : null,
    [detail],
  );
  const nextTriggerPayload = triggerConfigPayload(triggerType, triggerConfig);
  const triggerConfigDirty =
    JSON.stringify(nextTriggerPayload ?? {}) !== JSON.stringify(savedTriggerPayload ?? {});

  const dirty =
    !!detail &&
    (name !== (detail.name || "") ||
      description !== (detail.description || "") ||
      triggerType !== (detail.trigger_type || "manual") ||
      status !== (detail.status || "draft") ||
      triggerConfigDirty);

  const saveMeta = () => {
    if (!detail) return;
    updateWf.mutate(
      {
        id: detail.id,
        name: name.trim() || detail.name,
        description: description.trim(),
        trigger_type: triggerType,
        trigger_config: nextTriggerPayload ?? {},
        status,
        is_active: status === "active",
      },
      {
        onSuccess: () => toast.success("Workflow actualizado"),
        onError: (e) => toast.error(apiErrorMessage(e, "No se pudo guardar")),
      },
    );
  };

  const handleDelete = () => {
    if (!detail) return;
    deleteWf.mutate(detail.id, {
      onSuccess: () => {
        toast.success("Workflow eliminado");
        setConfirmDelete(false);
        navigate("/workflows", { replace: true });
      },
      onError: (e) =>
        toast.error(
          apiErrorMessage(
            e,
            "No se pudo eliminar. Si el API aún no lo soporta, archivá el workflow.",
          ),
        ),
    });
  };

  return (
    <ScrollArea className="flex-1">
      <motion.div
        key={workflowId}
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: motionTokens.base, ease: motionTokens.easeOut }}
        className="p-4 md:p-6 space-y-5 max-w-6xl mx-auto w-full"
      >
        <WorkflowFlowStrip
          workflowId={workflowId}
          nodes={nodes}
          edges={edges}
          isLoading={isLoading}
        />

        <section className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 px-4 py-2.5 bg-muted/20">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Configuración
            </p>
            <div className="flex flex-wrap gap-1.5">
              {detail?.status === "active" ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-[11px]"
                  disabled={deactivate.isPending}
                  onClick={() =>
                    deactivate.mutate(detail.id, {
                      onSuccess: () => toast.success("Workflow desactivado"),
                      onError: (e) => toast.error(apiErrorMessage(e, "No se pudo desactivar")),
                    })
                  }
                >
                  Pausar
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-[11px]"
                  disabled={activate.isPending || !detail}
                  onClick={() =>
                    detail &&
                    activate.mutate(detail.id, {
                      onSuccess: () => toast.success("Workflow activado"),
                      onError: (e) => toast.error(apiErrorMessage(e, "No se pudo activar")),
                    })
                  }
                >
                  Activar
                </Button>
              )}
              <Button
                size="sm"
                className="h-7 text-[11px] gap-1"
                disabled={executePending}
                onClick={onExecute}
              >
                {executePending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
                Ejecutar
              </Button>
            </div>
          </div>

          <div className="p-4">
            {isLoading || !detail ? (
              <p className="text-xs text-muted-foreground">Cargando…</p>
            ) : (
              <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
                <div className="space-y-3 min-w-0">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Nombre</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Descripción</Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="text-sm resize-none"
                    />
                  </div>
                  <WorkflowTriggerConfigFields
                    triggerType={triggerType}
                    value={triggerConfig}
                    onChange={setTriggerConfig}
                  />
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Trigger</Label>
                    <Select
                      value={triggerType}
                      onValueChange={(v) => {
                        setTriggerType(v);
                        setTriggerConfig(draftFromTriggerConfig(v, detail.trigger_config));
                      }}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {triggerOptions.map((t) => (
                          <SelectItem key={t.value} value={t.value} disabled={!t.supported}>
                            {t.label}
                            {!t.supported ? " (próx.)" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Estado</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {WORKFLOW_STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    size="sm"
                    className="w-full h-9"
                    disabled={!dirty || updateWf.isPending}
                    onClick={saveMeta}
                  >
                    {updateWf.isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    ) : null}
                    Guardar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={deleteWf.isPending}
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Eliminar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar este workflow?</AlertDialogTitle>
              <AlertDialogDescription>
                Se borrará «{detail?.name}» y su grafo. Si el API aún no soporta DELETE, usá
                Archivar en estado.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteWf.isPending}
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
              >
                {deleteWf.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Eliminar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </ScrollArea>
  );
}
