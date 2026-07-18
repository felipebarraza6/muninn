import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Loader2,
  Sparkles,
  Search,
  Plus,
  Unlink,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAgent, useUpdateAgent } from "@/api/hooks/useAgents";
import { useAgentFunctions, type AgentFunction } from "@/api/hooks/useAgentFunctions";
import { toast } from "sonner";

interface AgentSkillsPanelProps {
  agentId: string;
}

function skillId(fn: AgentFunction | string | number): string {
  if (typeof fn === "string" || typeof fn === "number") return String(fn);
  return String(fn.id);
}

export function AgentSkillsPanel({ agentId }: AgentSkillsPanelProps) {
  const { data: agent, isLoading: isLoadingAgent, refetch: refetchAgent } = useAgent(agentId);
  const { data: catalog = [], isLoading: isLoadingCatalog } = useAgentFunctions();
  const updateAgent = useUpdateAgent();
  const [search, setSearch] = useState("");
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignSearch, setAssignSearch] = useState("");
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  const assignedIds = useMemo(() => {
    return new Set((agent?.functions ?? []).map((d) => skillId(d)));
  }, [agent?.functions]);

  const assignedSkills = useMemo(() => {
    return catalog.filter((fn) => assignedIds.has(String(fn.id)));
  }, [catalog, assignedIds]);

  const availableSkills = useMemo(() => {
    return catalog.filter((fn) => !assignedIds.has(String(fn.id)) && fn.is_active !== false);
  }, [catalog, assignedIds]);

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
    if (!term) return availableSkills;
    return availableSkills.filter(
      (fn) =>
        fn.name.toLowerCase().includes(term) ||
        (fn.slug ?? "").toLowerCase().includes(term) ||
        (fn.description ?? "").toLowerCase().includes(term) ||
        (fn.external_api_name ?? "").toLowerCase().includes(term),
    );
  }, [availableSkills, assignSearch]);

  if (isLoadingAgent || isLoadingCatalog) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const setSkills = (nextIds: string[], successMsg: string) => {
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

  const assignSkill = (fn: AgentFunction) => {
    const id = String(fn.id);
    setSkills(
      Array.from(new Set([...Array.from(assignedIds), id])),
      "Skill asignada al agente",
    );
  };

  const unassignSkill = (id: string) => {
    setSkills(
      Array.from(assignedIds).filter((x) => x !== id),
      "Skill desasignada",
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="text-base">Skills del agente</CardTitle>
            <CardDescription>
              Skills que este agente puede ejecutar en el chat. Asígnalas desde el catálogo.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => {
                setAssignSearch("");
                setAssignOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1.5" /> Asignar skill
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link to="/skills">
                <Sparkles className="h-4 w-4 mr-1.5" /> Catálogo
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="space-y-2">
            {filteredAssigned.map((fn) => {
              const id = String(fn.id);
              const isPending = pendingIds.has(id);
              return (
                <div
                  key={fn.id}
                  className="flex items-start sm:items-center gap-3 rounded-lg border border-primary/20 bg-primary-soft/10 p-3"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate">{fn.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {fn.description || fn.slug || fn.external_api_name || "Sin descripción"}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button size="sm" variant="ghost" className="h-8" asChild title="Ver en catálogo">
                      <Link to={`/skills/${id}`}>
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
        </CardContent>
      </Card>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="w-full max-w-xl gap-4 p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Asignar skill</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en el catálogo…"
              value={assignSearch}
              onChange={(e) => setAssignSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="max-h-[min(52vh,420px)] overflow-y-auto rounded-md border border-border divide-y divide-border/60">
            {filteredAvailable.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground space-y-2">
                <p>
                  {assignSearch.trim()
                    ? "No hay skills disponibles con esa búsqueda."
                    : catalog.length === 0
                      ? "El catálogo está vacío."
                      : "Todas las skills activas ya están asignadas."}
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/skills">Ir al catálogo</Link>
                </Button>
              </div>
            ) : (
              filteredAvailable.map((fn) => {
                const id = String(fn.id);
                const isPending = pendingIds.has(id);
                return (
                  <div
                    key={fn.id}
                    className="flex items-center gap-3 p-3 hover:bg-muted/40 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{fn.name}</div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {fn.description || fn.slug || "Sin descripción"}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      disabled={isPending}
                      onClick={() => assignSkill(fn)}
                    >
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
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** @deprecated Usar AgentSkillsPanel */
export const AgentToolsPanel = AgentSkillsPanel;
