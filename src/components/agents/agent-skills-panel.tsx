import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Loader2,
  Sparkles,
  Search,
  Plus,
  Unlink,
  Eye,
  Settings2,
  Calculator,
  Code2,
  Plug,
  Check,
} from "lucide-react";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useAgent, useAgentSkillConfigs, useUpdateAgent } from "@/api/hooks/useAgents";
import {
  useAgentFunctions,
  type AgentFunction,
  type ImplementationType,
} from "@/api/hooks/useAgentFunctions";
import { useExternalAPIs } from "@/api/hooks/useExternalAPIs";
import { AgentSkillOverrideDialog } from "@/components/agents/agent-skill-override-dialog";
import { IMPLEMENTATION_TYPE_LABEL, normalizeSkillScope, SKILL_SCOPE_LABEL } from "@/lib/skills";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AgentSkillsPanelProps {
  agentId: string;
}

function skillId(fn: AgentFunction | string | number): string {
  if (typeof fn === "string" || typeof fn === "number") return String(fn);
  return String(fn.id);
}

function TypeIcon({ type }: { type?: ImplementationType }) {
  const cls = "h-4 w-4";
  if (type === "formula") return <Calculator className={cls} />;
  if (type === "python_code") return <Code2 className={cls} />;
  if (type === "api") return <Plug className={cls} />;
  return <Sparkles className={cls} />;
}

/** Skills visibles según apps del agente: globales, sin app, o de apps elegidas. */
function isSkillAssignable(fn: AgentFunction, selectedAppIds: Set<string>): boolean {
  const scope = normalizeSkillScope(fn.scope);
  if (scope === "global") return true;
  if (!fn.external_api) return true;
  return selectedAppIds.has(String(fn.external_api));
}

export function AgentSkillsPanel({ agentId }: AgentSkillsPanelProps) {
  const { data: agent, isLoading: isLoadingAgent, refetch: refetchAgent } = useAgent(agentId);
  const agentBranchId = agent?.branch ?? null;
  const { data: catalog = [], isLoading: isLoadingCatalog } = useAgentFunctions({
    branch: agentBranchId,
  });
  const { data: apps = [], isLoading: isLoadingApps } = useExternalAPIs({
    branch: agentBranchId,
  });
  const { data: skillConfigs = [] } = useAgentSkillConfigs(agentId);
  const updateAgent = useUpdateAgent();
  const [search, setSearch] = useState("");
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignSearch, setAssignSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "api" | "formula" | "python_code">("all");
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [pendingApps, setPendingApps] = useState(false);
  const [overrideSkill, setOverrideSkill] = useState<AgentFunction | null>(null);

  const customizedBySkill = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const cfg of skillConfigs) {
      map.set(String(cfg.agent_function), Boolean(cfg.is_customized));
    }
    return map;
  }, [skillConfigs]);

  const selectedAppIds = useMemo(() => {
    return new Set((agent?.external_apis ?? []).map((id) => String(id)));
  }, [agent?.external_apis]);

  const assignedIds = useMemo(() => {
    return new Set((agent?.functions ?? []).map((d) => skillId(d)));
  }, [agent?.functions]);

  const assignedSkills = useMemo(() => {
    return catalog.filter((fn) => assignedIds.has(String(fn.id)));
  }, [catalog, assignedIds]);

  const availableSkills = useMemo(() => {
    return catalog.filter(
      (fn) =>
        !assignedIds.has(String(fn.id)) &&
        fn.is_active !== false &&
        isSkillAssignable(fn, selectedAppIds),
    );
  }, [catalog, assignedIds, selectedAppIds]);

  const filteredAssigned = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return assignedSkills;
    return assignedSkills.filter(
      (fn) =>
        fn.name.toLowerCase().includes(term) ||
        (fn.slug ?? "").toLowerCase().includes(term) ||
        (fn.description ?? "").toLowerCase().includes(term) ||
        (fn.external_api_name ?? "").toLowerCase().includes(term),
    );
  }, [assignedSkills, search]);

  const filteredAvailable = useMemo(() => {
    const term = assignSearch.trim().toLowerCase();
    return availableSkills.filter((fn) => {
      if (typeFilter !== "all" && fn.implementation_type !== typeFilter) return false;
      if (!term) return true;
      return (
        fn.name.toLowerCase().includes(term) ||
        (fn.slug ?? "").toLowerCase().includes(term) ||
        (fn.description ?? "").toLowerCase().includes(term) ||
        (fn.external_api_name ?? "").toLowerCase().includes(term)
      );
    });
  }, [availableSkills, assignSearch, typeFilter]);

  if (isLoadingAgent || isLoadingCatalog || isLoadingApps) {
    return <PageSkeleton variant="list" padded={false} />;
  }

  const setSkills = (nextIds: string[], successMsg: string, onDone?: () => void) => {
    const tracking = nextIds.filter((id) => !assignedIds.has(id));
    const removed = Array.from(assignedIds).filter((id) => !nextIds.includes(id));
    const touched = [...tracking, ...removed];

    setPendingIds((prev) => {
      const next = new Set(prev);
      for (const id of touched) next.add(id);
      return next;
    });

    updateAgent.mutate(
      { id: agentId, data: { functions: nextIds } },
      {
        onSuccess: () => {
          toast.success(successMsg);
          void refetchAgent();
          onDone?.();
        },
        onError: () => toast.error("No se pudo actualizar las skills"),
        onSettled: () => {
          setPendingIds((prev) => {
            const next = new Set(prev);
            for (const id of touched) next.delete(id);
            return next;
          });
        },
      },
    );
  };

  const toggleApp = (appId: string) => {
    const selecting = !selectedAppIds.has(appId);
    const next = new Set(selectedAppIds);
    if (selecting) next.add(appId);
    else next.delete(appId);
    const nextIds = Array.from(next);

    // Al quitar una app, desasignar skills de esa app (conservar globales / sin app).
    const nextSkillIds = Array.from(assignedIds).filter((id) => {
      const fn = catalog.find((s) => String(s.id) === id);
      if (!fn) return true;
      return isSkillAssignable(fn, next);
    });

    setPendingApps(true);
    updateAgent.mutate(
      {
        id: agentId,
        data: {
          external_apis: nextIds,
          ...(nextSkillIds.length !== assignedIds.size ? { functions: nextSkillIds } : {}),
        },
      },
      {
        onSuccess: () => {
          toast.success(selecting ? "App agregada al agente" : "App quitada del agente");
          void refetchAgent();
        },
        onError: () => toast.error("No se pudo actualizar las apps del agente"),
        onSettled: () => setPendingApps(false),
      },
    );
  };

  const assignSkill = (fn: AgentFunction) => {
    const id = String(fn.id);
    setSkills(
      Array.from(new Set([...Array.from(assignedIds), id])),
      "Skill asignada al agente",
      () => {
        setAssignOpen(false);
        setOverrideSkill(fn);
      },
    );
  };

  const unassignSkill = (id: string) => {
    setSkills(
      Array.from(assignedIds).filter((x) => x !== id),
      "Skill desasignada",
    );
  };

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="border-b border-border/60 pb-3">
          <h2 className="text-base font-semibold tracking-tight">Aplicaciones del agente</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Elige qué apps / APIs externas usará este agente. Las skills del catálogo se filtran
            según esa selección (siempre incluyen skills globales y las de la sucursal sin app).
          </p>
        </div>

        {apps.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/70 px-4 py-6 text-center text-sm text-muted-foreground">
            No hay apps en esta sucursal.{" "}
            <Link to="/app/apis" className="text-primary underline-offset-2 hover:underline">
              Crear una en APIs
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {apps.map((app) => {
              const id = String(app.id);
              const selected = selectedAppIds.has(id);
              return (
                <button
                  key={id}
                  type="button"
                  disabled={pendingApps}
                  onClick={() => toggleApp(id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    selected
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border/70 bg-muted/40 text-muted-foreground hover:border-border hover:text-foreground",
                    pendingApps && "opacity-60",
                  )}
                >
                  {selected ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Plug className="h-3 w-3 opacity-70" />
                  )}
                  {app.name}
                </button>
              );
            })}
          </div>
        )}

        {selectedAppIds.size === 0 && apps.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Sin apps seleccionadas solo verás skills globales y skills sin app (fórmulas / Python de
            la sucursal).
          </p>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-border/60 pb-3">
          <div>
            <h2 className="text-base font-semibold tracking-tight">Skills del agente</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Asigna skills del catálogo filtrado por las apps de arriba y configura cómo este
              agente resuelve sus parámetros.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => {
                setAssignSearch("");
                setTypeFilter("all");
                setAssignOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1.5" /> Asignar skill
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link to="/app/skills">
                <Sparkles className="h-4 w-4 mr-1.5" /> Catálogo
              </Link>
            </Button>
          </div>
        </div>

        {assignedSkills.length > 0 && (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en skills asignadas…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        {filteredAssigned.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {search.trim() ? (
              "No hay skills que coincidan con la búsqueda."
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Sparkles className="h-8 w-8 opacity-40" />
                <span>Este agente aún no tiene skills asignadas.</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setAssignSearch("");
                    setAssignOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1.5" /> Asignar skill
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="divide-y divide-border/60">
          {filteredAssigned.map((fn) => {
            const id = String(fn.id);
            const isPending = pendingIds.has(id);
            return (
              <div
                key={fn.id}
                className="flex items-start sm:items-center gap-3 py-3 first:pt-0 last:pb-0 hover:bg-muted/30 -mx-1 px-1 rounded-md transition-colors"
              >
                <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                  <TypeIcon type={fn.implementation_type} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <div className="font-medium text-sm truncate">{fn.name}</div>
                    {customizedBySkill.get(id) && (
                      <Badge variant="outline" className="text-[10px] font-normal">
                        Personalizado
                      </Badge>
                    )}
                    {fn.implementation_type && (
                      <Badge variant="secondary" className="text-[10px] font-normal">
                        {IMPLEMENTATION_TYPE_LABEL[fn.implementation_type]}
                      </Badge>
                    )}
                    {fn.external_api_name && (
                      <Badge variant="outline" className="text-[10px] font-normal">
                        {fn.external_api_name}
                      </Badge>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {fn.description || fn.slug || fn.external_api_name || "Sin descripción"}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8"
                    title="Configurar uso en este agente"
                    onClick={() => setOverrideSkill(fn)}
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8" asChild title="Ver en catálogo">
                    <Link to={`/app/skills/${id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-destructive"
                    disabled={isPending}
                    onClick={() => unassignSkill(id)}
                    title="Desasignar"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Unlink className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <AgentSkillOverrideDialog
        open={!!overrideSkill}
        onOpenChange={(v) => {
          if (!v) setOverrideSkill(null);
        }}
        agentId={agentId}
        skill={overrideSkill}
      />

      <Sheet open={assignOpen} onOpenChange={setAssignOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg md:max-w-xl p-0 flex flex-col gap-0"
        >
          <SheetHeader className="px-5 py-4 border-b text-left space-y-1">
            <SheetTitle>Asignar skill</SheetTitle>
            <SheetDescription>
              Catálogo filtrado: globales, sin app, y skills de las apps seleccionadas del agente.
            </SheetDescription>
          </SheetHeader>
          <div className="px-5 py-3 space-y-3 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar en el catálogo…"
                value={assignSearch}
                onChange={(e) => setAssignSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["all", "Todos"],
                  ["api", "API"],
                  ["formula", "Matemática"],
                  ["python_code", "Python"],
                ] as const
              ).map(([value, label]) => (
                <Button
                  key={value}
                  type="button"
                  size="sm"
                  variant={typeFilter === value ? "default" : "outline"}
                  className="h-7 text-xs"
                  onClick={() => setTypeFilter(value)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
            {filteredAvailable.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground space-y-2">
                <p>
                  {assignSearch.trim() || typeFilter !== "all"
                    ? "No hay skills disponibles con ese filtro."
                    : selectedAppIds.size === 0
                      ? "Selecciona una app arriba para ver sus skills, o asigna skills globales / sin app."
                      : catalog.length === 0
                        ? "El catálogo está vacío."
                        : "Todas las skills disponibles ya están asignadas."}
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/app/skills">Ir al catálogo</Link>
                </Button>
              </div>
            ) : (
              filteredAvailable.map((fn) => {
                const id = String(fn.id);
                const isPending = pendingIds.has(id);
                const scope = normalizeSkillScope(fn.scope);
                return (
                  <div
                    key={fn.id}
                    className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0 hover:bg-muted/30 -mx-1 px-1 rounded-md transition-colors"
                  >
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <TypeIcon type={fn.implementation_type} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{fn.name}</div>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {fn.implementation_type && (
                          <Badge variant="outline" className="text-[9px]">
                            {IMPLEMENTATION_TYPE_LABEL[fn.implementation_type]}
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-[9px]">
                          {SKILL_SCOPE_LABEL[scope]}
                        </Badge>
                        {fn.external_api_name && (
                          <Badge variant="outline" className="text-[9px]">
                            {fn.external_api_name}
                          </Badge>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate mt-0.5">
                        {fn.description || fn.slug || "Sin descripción"}
                      </div>
                    </div>
                    <Button size="sm" disabled={isPending} onClick={() => assignSkill(fn)}>
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" /> Asignar
                        </>
                      )}
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/** @deprecated Usar AgentSkillsPanel */
export const AgentToolsPanel = AgentSkillsPanel;
