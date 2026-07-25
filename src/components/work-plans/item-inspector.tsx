import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  Bot,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Play,
  RotateCcw,
  Save,
  Trash2,
  Workflow,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusChip } from "@/components/ui/status-chip";
import { WorkResultViewer } from "@/components/work-plans/work-result-viewer";
import type { WorkItem, WorkItemKind, WorkPlan } from "@/api/hooks/useWorkPlans";
import { useWorkflowExecution } from "@/api/hooks/useWorkflows";
import { itemStatusLabel, workPlanStatusTone } from "@/lib/workPlanStatus";
import { prettyJson } from "@/lib/json";
import { cn } from "@/lib/utils";
import {
  ITEM_KIND_HINT,
  ITEM_KIND_LABEL,
  ItemKindChip,
  draftFromPayload,
  extractResultView,
  extractToolCalls,
  insumoPreview,
  kindMeta,
  payloadFromDraft,
  type DraftItem,
} from "@/components/work-plans/work-plan-model";

export function ItemInspector({
  item,
  planWorkflowId,
  planAgentId,
  agentLabel,
  agents = [],
  busy,
  onRun,
  onRetry,
  onSave,
  onDelete,
}: {
  item: WorkItem;
  planWorkflowId?: string | null;
  planAgentId?: string | null;
  agentLabel: string;
  agents?: Array<{ id: string; name: string }>;
  busy: boolean;
  onRun: () => void;
  onRetry: () => void;
  onSave: (patch: {
    title: string;
    kind: WorkItemKind;
    payload: Record<string, unknown>;
    assigned_agent?: string | number | null;
  }) => void;
  onDelete: () => void;
}) {
  const safeKind = (k: unknown): WorkItemKind =>
    typeof k === "string" && k in ITEM_KIND_LABEL ? (k as WorkItemKind) : "note";
  const [title, setTitle] = useState(item.title || "");
  const [kind, setKind] = useState<WorkItemKind>(() => safeKind(item.kind));
  const [fields, setFields] = useState(() => draftFromPayload(safeKind(item.kind), item.payload));
  const [agentId, setAgentId] = useState(
    () => (item.assigned_agent != null ? String(item.assigned_agent) : "") || "",
  );
  const [editingInsumos, setEditingInsumos] = useState(false);
  const defaultTab =
    item.status === "pending" || item.status === "queued" ? "insumos" : "resultado";
  const [tab, setTab] = useState(defaultTab);

  useEffect(() => {
    const nextKind = safeKind(item.kind);
    setTitle(item.title || "");
    setKind(nextKind);
    setFields(draftFromPayload(nextKind, item.payload));
    setAgentId(item.assigned_agent != null ? String(item.assigned_agent) : "");
    const next = item.status === "pending" || item.status === "queued" ? "insumos" : "resultado";
    setTab(next);
    setEditingInsumos(item.status === "pending" || item.status === "queued");
  }, [item.id, item.title, item.kind, item.payload, item.modified, item.status, item.assigned_agent]);

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
    onSave({
      title: title.trim(),
      kind,
      payload,
      assigned_agent: agentId.trim() ? agentId.trim() : null,
    });
    setEditingInsumos(false);
  };

  const readonlyInsumoRows = useMemo(() => {
    const stepAgent =
      item.assigned_agent != null
        ? agents.find((a) => a.id === String(item.assigned_agent))?.name ||
          String(item.assigned_agent)
        : null;
    const rows: { label: string; value: string }[] = [
      { label: "Tipo", value: ITEM_KIND_LABEL[item.kind] ?? item.kind },
      { label: "Título", value: item.title },
      {
        label: "Agente",
        value: stepAgent
          ? `${stepAgent} (este paso)`
          : planAgentId
            ? `${agentLabel} (plan)`
            : "Sin agente",
      },
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
  }, [item, agents, agentLabel, planAgentId]);

  const meta = kindMeta(item.kind);
  const KindIcon = meta.Icon;

  return (
    <div className="flex flex-col h-full min-h-0 bg-transparent">
      <div className="shrink-0 border-b border-border/40 px-4 py-3 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5 min-w-0">
            <span
              className={cn(
                "mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg shrink-0",
                meta.iconWrap,
              )}
            >
              <KindIcon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-snug">{item.title}</p>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <ItemKindChip kind={item.kind} />
                <span className="text-[11px] text-muted-foreground truncate">
                  {agentLabel} · {attempts}/{maxAttempts}
                </span>
              </div>
            </div>
          </div>
          <StatusChip label={itemStatusLabel(item.status)} tone={workPlanStatusTone(item.status)} />
        </div>
        <div className="flex gap-1.5">
          <Button
            size="sm"
            className="flex-1 h-9 gap-1.5 shadow-sm shadow-primary/15"
            disabled={busy}
            onClick={onRun}
          >
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
              className="flex-1 h-9 gap-1.5"
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
          <div className="h-full min-h-0 overflow-y-auto overscroll-contain">
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
                  <details className="group rounded-xl border border-border/50 bg-background/50">
                    <summary className="cursor-pointer list-none flex items-center gap-1.5 px-2.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:bg-muted/30 rounded-xl">
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-open:rotate-90" />
                      Tools ({toolCalls.length})
                    </summary>
                    <div className="px-2.5 pb-2.5 flex flex-wrap gap-1.5">
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
                  </details>
                </section>
              ) : null}

              {liveNodes.length > 0 ? (
                <section className="space-y-1.5">
                  <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-0.5">
                    Nodos del flujo
                  </h3>
                  <ul className="space-y-1.5">
                    {liveNodes.map((n, i) => {
                      const hasOutput =
                        !!n.output &&
                        typeof n.output === "object" &&
                        Object.keys(n.output as object).length > 0;
                      return (
                        <li key={`${n.node}-${i}`}>
                          <details className="group rounded-lg border border-border/50 bg-background/50 open:bg-muted/20">
                            <summary className="cursor-pointer list-none flex items-center gap-2 px-2.5 py-2 hover:bg-muted/25 rounded-lg">
                              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                              <p className="text-xs font-medium flex-1 truncate">{n.node}</p>
                              {n.node_type ? (
                                <span className="text-[10px] text-muted-foreground shrink-0">
                                  {n.node_type}
                                </span>
                              ) : null}
                              {n.status ? (
                                <StatusChip
                                  label={itemStatusLabel(n.status)}
                                  tone={workPlanStatusTone(n.status)}
                                />
                              ) : null}
                            </summary>
                            <div className="px-2.5 pb-2.5 space-y-1.5">
                              {n.error ? (
                                <p className="text-[11px] text-destructive whitespace-pre-wrap">
                                  {n.error}
                                </p>
                              ) : null}
                              {hasOutput ? (
                                <pre className="text-[11px] whitespace-pre-wrap break-words font-sans text-muted-foreground max-h-36 overflow-auto rounded-md border border-border/40 bg-muted/20 px-2 py-1.5">
                                  {prettyJson(n.output)}
                                </pre>
                              ) : !n.error ? (
                                <p className="text-[11px] text-muted-foreground">Sin output</p>
                              ) : null}
                            </div>
                          </details>
                        </li>
                      );
                    })}
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
          </div>
        </TabsContent>

        <TabsContent
          value="insumos"
          className="flex-1 min-h-0 m-0 overflow-hidden data-[state=inactive]:hidden"
        >
          <div className="h-full min-h-0 overflow-y-auto overscroll-contain">
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
                  <div className="rounded-lg border bg-card/50 px-3 py-2 space-y-1.5">
                    <Label className="text-[11px]">Agente de este paso</Label>
                    <Select
                      value={agentId || "__plan__"}
                      onValueChange={(v) => setAgentId(v === "__plan__" ? "" : v)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Usar agente del plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__plan__">
                          Usar agente del plan
                          {planAgentId ? ` (${agentLabel})` : ""}
                        </SelectItem>
                        {agents.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-muted-foreground">
                      Solo afecta turnos de agente; skills/workflows no lo usan.
                    </p>
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
          </div>
        </TabsContent>

        <TabsContent
          value="tecnico"
          className="flex-1 min-h-0 m-0 overflow-hidden data-[state=inactive]:hidden"
        >
          <div className="h-full min-h-0 overflow-y-auto overscroll-contain">
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function KindFields({
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

