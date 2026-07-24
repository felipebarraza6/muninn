import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  GitBranch,
  Loader2,
  Play,
  Plus,
  Search,
  Workflow as WorkflowIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import {
  useCreateWorkflow,
  useCreateWorkflowNode,
  useExecuteWorkflow,
  useWorkflows,
  type Workflow,
} from "@/api/hooks/useWorkflows";
import { apiErrorMessage } from "@/lib/apiError";
import { cn } from "@/lib/utils";
import { isOrganizationOwnerScope, isSuperAdmin } from "@/lib/authGuards";

export default function WorkflowsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const idFromUrl = searchParams.get("id");
  const { data: workflows = [], isLoading, error } = useWorkflows();
  const [selectedId, setSelectedId] = useState(idFromUrl ?? "");
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const createWf = useCreateWorkflow();
  const createNode = useCreateWorkflowNode();
  const execute = useExecuteWorkflow();
  const showBranchFilter = isSuperAdmin() || isOrganizationOwnerScope();

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
        <p className="text-destructive text-center">
          {apiErrorMessage(error, "No se pudieron cargar los workflows")}
        </p>
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
            Orquesta nodos · puente a Ops
          </span>
        </div>
        <span className="ml-1 hidden md:inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
          Preview
        </span>
        <div className="ml-auto flex items-center gap-2">
          {showBranchFilter ? <StudioBranchFilter /> : null}
          {(() => {
            const digest = workflows.find((w) =>
              w.name.toLowerCase().includes("digest telemetría"),
            );
            if (!digest) return null;
            return (
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1 hidden sm:inline-flex"
                disabled={execute.isPending}
                onClick={() =>
                  execute.mutate(
                    { id: digest.id },
                    {
                      onSuccess: () => toast.success("Digest telemetría lanzado"),
                      onError: (e) =>
                        toast.error(apiErrorMessage(e, "No se pudo ejecutar el digest")),
                    },
                  )
                }
              >
                <Play className="h-3.5 w-3.5" />
                Digest SH
              </Button>
            );
          })()}
          <Button size="sm" variant="ghost" className="h-8 hidden md:inline-flex" asChild>
            <Link to="/planes">Ops</Link>
          </Button>
          <Button size="sm" className="h-8 gap-1.5 shadow-sm shadow-primary/20" onClick={() => setCreateOpen(true)}>
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
                <p className="text-xs text-muted-foreground text-center py-10 px-4">
                  No hay workflows. Crea uno con un nodo agente para orquestar trabajo.
                </p>
              ) : (
                filtered.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(w.id);
                      setSearchParams({ id: w.id }, { replace: true });
                    }}
                    className={cn(
                      "w-full text-left rounded-lg border px-3 py-2.5 transition-colors",
                      selected?.id === w.id
                        ? "border-primary/40 bg-primary/10"
                        : "border-transparent hover:bg-muted/50",
                    )}
                  >
                    <p className="text-sm font-medium truncate">{w.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                      {w.trigger_type || "manual"} · {w.status || "—"} ·{" "}
                      {w.execution_count ?? 0} runs
                    </p>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </aside>

        <section className="flex-1 min-w-0 flex flex-col">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
              Selecciona un workflow
            </div>
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
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8"
                    asChild
                  >
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
              <WorkflowPreview workflow={selected} />
            </>
          )}
        </section>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo workflow</DialogTitle>
          </DialogHeader>
          <div className="space-y-1.5 py-1">
            <Label htmlFor="wf-name">Nombre</Label>
            <Input
              id="wf-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Orquestación agente ops"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!name.trim() || createWf.isPending || createNode.isPending}
              onClick={() => {
                createWf.mutate(
                  {
                    name: name.trim(),
                    trigger_type: "manual",
                    status: "draft",
                    is_active: true,
                  },
                  {
                    onSuccess: (wf) => {
                      // Seed: trigger + nodo agent
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
                          onSettled: () => {
                            createNode.mutate(
                              {
                                workflow: wf.id,
                                node_type: "agent",
                                node_key: "agent-1",
                                name: "Agente",
                                position_x: 320,
                                position_y: 120,
                                config: {
                                  message: "Ejecuta la tarea del contexto del workflow",
                                  max_iterations: 4,
                                },
                              },
                              {
                                onSettled: () => {
                                  toast.success("Workflow creado");
                                  setCreateOpen(false);
                                  setName("");
                                  setSelectedId(wf.id);
                                  setSearchParams({ id: wf.id }, { replace: true });
                                  navigate(`/workflows/${wf.id}`);
                                },
                              },
                            );
                          },
                        },
                      );
                    },
                    onError: (e) =>
                      toast.error(apiErrorMessage(e, "No se pudo crear el workflow")),
                  },
                );
              }}
            >
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WorkflowPreview({ workflow }: { workflow: Workflow }) {
  const nodes = workflow.nodes ?? [];
  return (
    <ScrollArea className="flex-1">
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <WorkflowIcon className="h-4 w-4 text-primary" />
          {nodes.length} nodos · {(workflow.edges ?? []).length} conexiones
        </div>
        {nodes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Sin nodos aún. Ábrelo en el canvas para armar el grafo.
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {nodes.map((n) => (
              <div key={n.id} className="rounded-xl border bg-card px-3 py-2.5">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {n.node_type}
                </p>
                <p className="text-sm font-medium mt-0.5">{n.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{n.node_key}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
