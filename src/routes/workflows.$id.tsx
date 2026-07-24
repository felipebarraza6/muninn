import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Play, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import {
  useExecuteWorkflow,
  useUpdateWorkflowNode,
  useWorkflow,
  useWorkflowExecution,
  useWorkflowExecutions,
  type WorkflowNode,
} from "@/api/hooks/useWorkflows";
import { useAgents } from "@/api/hooks/useAgents";
import { apiErrorMessage } from "@/lib/apiError";
import { cn } from "@/lib/utils";

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
  const { data: agents = [] } = useAgents({ is_active: true });
  const updateNode = useUpdateWorkflowNode();
  const execute = useExecuteWorkflow();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draftConfig, setDraftConfig] = useState("");
  const [agentSlugDraft, setAgentSlugDraft] = useState("");
  const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(null);
  const { data: executionDetail, isLoading: executionDetailLoading } = useWorkflowExecution(
    selectedExecutionId || undefined,
  );
  const dragRef = useRef<{ id: string; ox: number; oy: number; sx: number; sy: number } | null>(
    null,
  );
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      navigate("/workflows");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const nodes = workflow?.nodes ?? [];
  const edges = workflow?.edges ?? [];

  useEffect(() => {
    const next: Record<string, { x: number; y: number }> = {};
    for (const n of nodes) {
      next[n.id] = { x: n.position_x ?? 40, y: n.position_y ?? 40 };
    }
    setPositions(next);
  }, [nodes]);

  const selected = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  useEffect(() => {
    if (!selected) {
      setDraftConfig("");
      setAgentSlugDraft("");
      return;
    }
    setDraftConfig(JSON.stringify(selected.config ?? {}, null, 2));
    const cfg = selected.config && typeof selected.config === "object" ? selected.config : {};
    const slug =
      typeof (cfg as Record<string, unknown>).agent_slug === "string"
        ? String((cfg as Record<string, unknown>).agent_slug)
        : "";
    const fallback =
      workflow?.name?.toLowerCase() === "test"
        ? agents.find((a) => a.slug === "agendamiento-clinica-wm")?.slug ||
          agents[0]?.slug ||
          ""
        : agents[0]?.slug || "";
    setAgentSlugDraft(slug || fallback);
  }, [selected, agents, workflow?.name]);

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
            <span className="text-xs font-medium">Workflows</span>
          </Link>
        </Button>
        <span className="text-sm font-medium truncate">{workflow.name}</span>
        <div className="ml-auto flex gap-1.5">
          <Button
            size="sm"
            className="h-8 gap-1"
            disabled={execute.isPending}
            onClick={() =>
              execute.mutate(
                { id: workflow.id },
                {
                  onSuccess: () => {
                    toast.success("Ejecución disparada");
                    void refetch();
                  },
                  onError: (e) =>
                    toast.error(apiErrorMessage(e, "No se pudo ejecutar")),
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

      <div className="flex flex-1 min-h-0">
        <div
          className="relative flex-1 min-w-0 overflow-hidden bg-[radial-gradient(circle_at_1px_1px,hsl(var(--border))_1px,transparent_0)] [background-size:24px_24px]"
          onMouseMove={(e) => {
            const d = dragRef.current;
            if (!d) return;
            const x = Math.max(0, d.sx + (e.clientX - d.ox));
            const y = Math.max(0, d.sy + (e.clientY - d.oy));
            setPositions((prev) => ({ ...prev, [d.id]: { x, y } }));
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
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {edges.map((e) => {
              const fromId = e.from_node || nodes.find((n) => n.node_key === e.from_node_key)?.id;
              const toId = e.to_node || nodes.find((n) => n.node_key === e.to_node_key)?.id;
              if (!fromId || !toId) return null;
              const a = positions[fromId];
              const b = positions[toId];
              if (!a || !b) return null;
              return (
                <line
                  key={e.id}
                  x1={a.x + 90}
                  y1={a.y + 36}
                  x2={b.x + 90}
                  y2={b.y + 36}
                  stroke="hsl(var(--primary) / 0.45)"
                  strokeWidth="2"
                />
              );
            })}
          </svg>

          {nodes.map((n) => {
            const pos = positions[n.id] ?? { x: 40, y: 40 };
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => setSelectedNodeId(n.id)}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  dragRef.current = {
                    id: n.id,
                    ox: e.clientX,
                    oy: e.clientY,
                    sx: pos.x,
                    sy: pos.y,
                  };
                }}
                className={cn(
                  "absolute w-[180px] rounded-xl border bg-card/95 backdrop-blur px-3 py-2.5 text-left shadow-sm cursor-grab active:cursor-grabbing",
                  selectedNodeId === n.id ? "border-primary ring-1 ring-primary/30" : "border-border",
                )}
                style={{ left: pos.x, top: pos.y }}
              >
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {n.node_type}
                </p>
                <p className="text-sm font-medium truncate">{n.name}</p>
              </button>
            );
          })}
        </div>

        <aside className="w-[320px] border-l bg-card flex flex-col shrink-0">
          <div className="border-b px-4 py-3">
            <p className="text-sm font-semibold">Inspector</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Config del nodo (JSON). En `agent`: agent_slug, message, max_iterations.
            </p>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3">
              {!selected ? (
                <p className="text-xs text-muted-foreground">Selecciona un nodo en el canvas.</p>
              ) : (
                <>
                  <div className="space-y-1">
                    <Label>Nombre</Label>
                    <Input value={selected.name} readOnly className="h-8" />
                  </div>
                  <div className="space-y-1">
                    <Label>Tipo</Label>
                    <Input value={selected.node_type} readOnly className="h-8" />
                  </div>
                  {selected.node_type === "agent" ? (
                    <div className="space-y-1.5 rounded-lg border border-dashed px-3 py-2">
                      <Label className="text-[11px]">agent_slug (sandbox)</Label>
                      <Input
                        value={agentSlugDraft}
                        onChange={(e) => setAgentSlugDraft(e.target.value)}
                        placeholder="ej. agendamiento-clinica-wm"
                        className="h-8"
                        list="wf-agent-slugs"
                      />
                      <datalist id="wf-agent-slugs">
                        {agents
                          .filter((a) => a.slug)
                          .map((a) => (
                            <option key={a.id} value={a.slug!} />
                          ))}
                      </datalist>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-full h-7"
                        type="button"
                        onClick={() => {
                          let config: Record<string, unknown> = {};
                          try {
                            config = JSON.parse(draftConfig || "{}");
                          } catch {
                            config = {};
                          }
                          if (!agentSlugDraft.trim()) {
                            toast.error("Indica un agent_slug");
                            return;
                          }
                          const next = {
                            ...config,
                            agent_slug: agentSlugDraft.trim(),
                            message:
                              typeof config.message === "string" && config.message
                                ? config.message
                                : "Ejecuta la tarea del workflow.",
                          };
                          setDraftConfig(JSON.stringify(next, null, 2));
                          toast.message("agent_slug listo — guarda la config");
                        }}
                      >
                        Fijar agent_slug en JSON
                      </Button>
                    </div>
                  ) : null}
                  <div className="space-y-1">
                    <Label>Config</Label>
                    <Textarea
                      value={draftConfig}
                      onChange={(e) => setDraftConfig(e.target.value)}
                      rows={12}
                      className="font-mono text-xs"
                    />
                  </div>
                  <Button
                    size="sm"
                    className="w-full gap-1.5"
                    disabled={updateNode.isPending}
                    onClick={() => {
                      let config: Record<string, unknown> = {};
                      try {
                        config = JSON.parse(draftConfig || "{}");
                      } catch {
                        toast.error("JSON inválido en config");
                        return;
                      }
                      updateNode.mutate(
                        { id: selected.id, config },
                        {
                          onSuccess: () => toast.success("Nodo guardado"),
                          onError: (e) =>
                            toast.error(apiErrorMessage(e, "No se pudo guardar el nodo")),
                        },
                      );
                    }}
                  >
                    <Save className="h-3.5 w-3.5" />
                    Guardar config
                  </Button>
                </>
              )}

              <div className="pt-4 border-t space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Últimas ejecuciones
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Toca una corrida para ver qué generó cada nodo.
                </p>
                {executions.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Sin corridas aún.</p>
                ) : (
                  executions.slice(0, 8).map((ex) => (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() =>
                        setSelectedExecutionId((cur) => (cur === ex.id ? null : ex.id))
                      }
                      className={cn(
                        "w-full text-left rounded-lg border px-2.5 py-2 text-xs transition-colors",
                        selectedExecutionId === ex.id
                          ? "border-primary/40 bg-primary/10"
                          : "hover:bg-muted/50",
                      )}
                    >
                      <p className="font-medium">{ex.status || "—"}</p>
                      <p className="text-muted-foreground truncate">
                        {ex.started_at || ex.created || ex.id}
                      </p>
                    </button>
                  ))
                )}

                {selectedExecutionId ? (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-2 space-y-2">
                    <p className="text-[11px] font-semibold">Detalle de la corrida</p>
                    {executionDetailLoading || !executionDetail ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Cargando…
                      </div>
                    ) : (
                      <>
                        <p className="text-[11px] text-muted-foreground">
                          {executionDetail.status} · {executionDetail.completed_nodes ?? 0}/
                          {executionDetail.total_nodes ?? 0} nodos
                          {executionDetail.duration_ms != null
                            ? ` · ${executionDetail.duration_ms} ms`
                            : ""}
                        </p>
                        {executionDetail.error_message ? (
                          <p className="text-[11px] text-destructive whitespace-pre-wrap">
                            {executionDetail.error_message}
                          </p>
                        ) : null}
                        {(executionDetail.logs || []).length === 0 ? (
                          <p className="text-[11px] text-muted-foreground">Sin logs de nodos.</p>
                        ) : (
                          <ul className="space-y-1.5 max-h-64 overflow-auto">
                            {(executionDetail.logs || []).map((log) => (
                              <li key={log.id} className="rounded border bg-background/60 px-2 py-1.5">
                                <p className="text-[11px] font-medium">
                                  {log.node_name || "Nodo"}{" "}
                                  <span className="text-muted-foreground font-normal">
                                    · {log.status}
                                  </span>
                                </p>
                                {log.error_message ? (
                                  <p className="text-[10px] text-destructive mt-0.5 whitespace-pre-wrap">
                                    {log.error_message}
                                  </p>
                                ) : null}
                                {log.output_data && Object.keys(log.output_data).length > 0 ? (
                                  <pre className="mt-0.5 text-[10px] whitespace-pre-wrap break-words font-sans text-muted-foreground">
                                    {pretty(log.output_data)}
                                  </pre>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                        )}
                        {executionDetail.context &&
                        Object.keys(executionDetail.context).length > 0 ? (
                          <details className="text-[11px]">
                            <summary className="cursor-pointer text-muted-foreground">
                              Contexto final
                            </summary>
                            <pre className="mt-1 whitespace-pre-wrap break-words font-sans text-muted-foreground max-h-32 overflow-auto">
                              {pretty(executionDetail.context)}
                            </pre>
                          </details>
                        ) : null}
                      </>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
}
