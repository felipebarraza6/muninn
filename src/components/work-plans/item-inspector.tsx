import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  Bot,
  CheckCircle2,
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
import { ScrollArea } from "@/components/ui/scroll-area";
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
  draftFromPayload,
  extractResultView,
  extractToolCalls,
  insumoPreview,
  payloadFromDraft,
  type DraftItem,
} from "@/components/work-plans/work-plan-model";

export function ItemInspector({
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

