import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  BookOpen,
  Search,
  Plus,
  Unlink,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAgent, useUpdateAgent } from "@/api/hooks/useAgents";
import {
  useKnowledgeCatalog,
  useIndexKnowledge,
  useReindexKnowledge,
  fetchKnowledgeIndexingStatus,
  hasKnowledgeVectors,
  isKnowledgeIndexed,
  type AgentKnowledge,
} from "@/api/hooks/useKnowledge";
import { useQueryClient } from "@tanstack/react-query";
import { KnowledgeContentViewer } from "./knowledge-content-viewer";
import { toast } from "sonner";
import { KNOWLEDGE_TYPE_ICON, KNOWLEDGE_TYPE_LABEL } from "@/lib/knowledge-types";
import { canAccessKnowledgeCatalog, canViewInactiveStudioResources } from "@/lib/authGuards";

interface AgentKnowledgePanelProps {
  agentId: string;
}

function docId(doc: AgentKnowledge | string | number | { id?: string | number }): string {
  if (typeof doc === "string" || typeof doc === "number") return String(doc);
  return String(doc.id);
}

export function AgentKnowledgePanel({ agentId }: AgentKnowledgePanelProps) {
  const { data: agent, isLoading: isLoadingAgent, refetch: refetchAgent } = useAgent(agentId);
  const agentBranchId = agent?.branch ?? null;
  // includeInactive: para poder ver/desasignar docs ya inactivos del agente.
  // En el diálogo «Asignar» solo se ofrecen activos (availableDocs).
  const {
    data: catalogRaw = [],
    isLoading: isLoadingKnowledge,
    refetch: refetchCatalog,
  } = useKnowledgeCatalog({
    branch: agentBranchId,
    includeInactive: canViewInactiveStudioResources(),
  });
  const catalog = useMemo(() => {
    if (agentBranchId == null) return catalogRaw;
    const branchKey = String(agentBranchId);
    return catalogRaw.filter((doc) => doc.branch == null || String(doc.branch) === branchKey);
  }, [catalogRaw, agentBranchId]);
  const updateAgent = useUpdateAgent();
  const indexKnowledge = useIndexKnowledge();
  const reindexKnowledge = useReindexKnowledge();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignSearch, setAssignSearch] = useState("");
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [indexingIds, setIndexingIds] = useState<Set<string>>(new Set());
  const indexingStartedAt = useRef<Map<string, number>>(new Map());
  const indexingTaskIds = useRef<Map<string, string>>(new Map());
  const canManageKnowledge = canAccessKnowledgeCatalog();

  /** Mientras indexa, consulta el estado hasta que termine y avisa al usuario. */
  useEffect(() => {
    if (indexingIds.size === 0) return;
    let cancelled = false;

    const finish = (id: string) => {
      indexingStartedAt.current.delete(id);
      indexingTaskIds.current.delete(id);
      setIndexingIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    };

    const tick = async () => {
      const ids = Array.from(indexingIds);
      for (const id of ids) {
        if (cancelled) return;
        const taskId = indexingTaskIds.current.get(id);
        const started = indexingStartedAt.current.get(id) ?? Date.now();
        try {
          const status = await fetchKnowledgeIndexingStatus(id, taskId, agentBranchId);
          if (cancelled) return;

          // Actualizar contadores en cache mientras corre.
          queryClient.setQueriesData<AgentKnowledge[]>(
            { queryKey: ["ai-agents", "knowledge", "list"] },
            (old) => {
              if (!Array.isArray(old)) return old;
              return old.map((doc) =>
                String(doc.id) === id
                  ? {
                      ...doc,
                      is_indexed: status.is_indexed,
                      chunks_count: status.chunks_count,
                      embeddings_count: status.embeddings_count,
                      indexed_at: status.indexed_at ?? undefined,
                    }
                  : doc,
              );
            },
          );

          const title = status.title || "Documento";
          const taskReady = status.task_ready === true;
          const timedOut = Date.now() - started > 180_000;

          if (taskReady && status.task_successful === false) {
            toast.error(
              `No se pudo generar los vectores de «${title}». Intenta reindexar de nuevo.`,
            );
            finish(id);
            continue;
          }

          if (taskReady && status.task_successful) {
            void queryClient.invalidateQueries({
              queryKey: ["ai-agents", "knowledge", id, "chunks"],
            });
            if (status.has_vectors) {
              toast.success(`«${title}» listo: ${status.embeddings_count} vectores generados`);
            } else if (status.chunks_count > 0) {
              toast.warning(
                `«${title}» se dividió en fragmentos, pero no se pudieron crear los vectores. Revisa el modelo de embedding en la configuración de la sucursal.`,
              );
            } else {
              toast.warning(
                `No se pudo preparar «${title}» para búsqueda. Intenta reindexar de nuevo.`,
              );
            }
            finish(id);
            void refetchCatalog();
            continue;
          }

          // Sin task_id (fallback): esperar vectores o indexado estable.
          if (!taskId && status.has_vectors) {
            toast.success(`«${title}» listo con vectores`);
            finish(id);
            void refetchCatalog();
            continue;
          }

          if (timedOut) {
            if (status.has_vectors) {
              toast.success(`«${title}» listo con vectores`);
            } else if (status.is_indexed && status.chunks_count > 0) {
              toast.warning(
                `«${title}» aún no tiene vectores. Revisa el modelo de embedding de la sucursal o vuelve a reindexar.`,
              );
            } else {
              toast.message(
                `Todavía estamos preparando «${title}». Espera un momento y revisa de nuevo.`,
              );
            }
            finish(id);
            void refetchCatalog();
          }
        } catch {
          if (Date.now() - started > 180_000) {
            toast.message(
              "No pudimos confirmar el estado. Espera un momento y vuelve a abrir el documento.",
            );
            finish(id);
          }
        }
      }
    };

    void tick();
    const interval = window.setInterval(() => {
      void tick();
    }, 2500);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [indexingIds, queryClient, refetchCatalog, agentBranchId]);

  const assignedIds = useMemo(() => {
    return new Set((agent?.knowledge_documents ?? []).map((d) => docId(d)));
  }, [agent?.knowledge_documents]);

  const assignedDocs = useMemo(() => {
    return catalog.filter((doc) => assignedIds.has(String(doc.id)));
  }, [catalog, assignedIds]);

  /** Solo conocimiento activo se puede asignar (inactivos van a borrarse / no usan RAG). */
  const availableDocs = useMemo(() => {
    return catalog.filter((doc) => !assignedIds.has(String(doc.id)) && doc.is_active !== false);
  }, [catalog, assignedIds]);

  const filteredAssigned = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return assignedDocs;
    return assignedDocs.filter(
      (doc) =>
        doc.title.toLowerCase().includes(term) ||
        (doc.source_app ?? "").toLowerCase().includes(term) ||
        KNOWLEDGE_TYPE_LABEL[doc.knowledge_type].toLowerCase().includes(term),
    );
  }, [assignedDocs, search]);

  const filteredAvailable = useMemo(() => {
    const term = assignSearch.trim().toLowerCase();
    if (!term) return availableDocs;
    return availableDocs.filter(
      (doc) =>
        doc.title.toLowerCase().includes(term) ||
        (doc.source_app ?? "").toLowerCase().includes(term) ||
        KNOWLEDGE_TYPE_LABEL[doc.knowledge_type].toLowerCase().includes(term),
    );
  }, [availableDocs, assignSearch]);

  const vectorStats = useMemo(() => {
    const total = assignedDocs.length;
    let indexed = 0;
    let chunks = 0;
    for (const doc of assignedDocs) {
      if (hasKnowledgeVectors(doc)) indexed += 1;
      chunks += doc.chunks_count ?? 0;
    }
    const indexing = assignedDocs.filter((d) => indexingIds.has(String(d.id))).length;
    return {
      total,
      indexed,
      pending: Math.max(0, total - indexed - indexing),
      chunks,
      indexing,
    };
  }, [assignedDocs, indexingIds]);

  if (isLoadingAgent || isLoadingKnowledge) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!agent?.use_rag) {
    return (
      <Card>
        <CardContent className="p-6 space-y-3">
          <div className="text-sm text-muted-foreground">
            El RAG está desactivado para este agente. Actívalo para asignar documentos y tablas.
          </div>
          <Button
            size="sm"
            disabled={updateAgent.isPending}
            onClick={() =>
              updateAgent.mutate(
                { id: agentId, data: { use_rag: true, rag_top_k: agent?.rag_top_k ?? 5 } },
                {
                  onSuccess: () => {
                    toast.success("RAG activado");
                    refetchAgent();
                  },
                  onError: () => toast.error("No se pudo activar RAG"),
                },
              )
            }
          >
            {updateAgent.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Activar conocimiento (RAG)
          </Button>
        </CardContent>
      </Card>
    );
  }

  const markIndexing = (id: string, on: boolean) => {
    setIndexingIds((prev) => {
      const next = new Set(prev);
      if (on) {
        next.add(id);
        indexingStartedAt.current.set(id, Date.now());
      } else {
        next.delete(id);
        indexingStartedAt.current.delete(id);
      }
      return next;
    });
  };

  const ensureIndexed = (doc: AgentKnowledge) => {
    const id = String(doc.id);
    if (hasKnowledgeVectors(doc)) return;
    markIndexing(id, true);
    toast.message("Generando vectores… esto puede tardar unos segundos");
    indexKnowledge.mutate(
      { id, branch: agentBranchId },
      {
        onSuccess: (data) => {
          if (data.indexing_task_id) {
            indexingTaskIds.current.set(id, data.indexing_task_id);
          }
          toast.message(`Preparando «${doc.title}»… te avisamos al terminar`);
        },
        onError: () => {
          toast.error("No se pudo indexar el documento");
          markIndexing(id, false);
        },
      },
    );
  };

  const setKnowledgeDocuments = (
    nextIds: string[],
    successMsg: string,
    docToIndex?: AgentKnowledge,
  ) => {
    const tracking = nextIds.filter((id) => !assignedIds.has(id));
    const removed = Array.from(assignedIds).filter((id) => !nextIds.includes(id));
    const touched = [...tracking, ...removed];

    setPendingIds((prev) => {
      const next = new Set(prev);
      for (const id of touched) next.add(id);
      return next;
    });

    updateAgent.mutate(
      { id: agentId, data: { knowledge_documents: nextIds } },
      {
        onSuccess: () => {
          toast.success(successMsg);
          refetchAgent();
          if (docToIndex) ensureIndexed(docToIndex);
        },
        onError: () => toast.error("No se pudo actualizar la asignación"),
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

  const assignDoc = (doc: AgentKnowledge) => {
    const id = String(doc.id);
    setKnowledgeDocuments(
      Array.from(new Set([...Array.from(assignedIds), id])),
      "Conocimiento asignado al agente",
      doc,
    );
  };

  const unassignDoc = (id: string) => {
    setKnowledgeDocuments(
      Array.from(assignedIds).filter((x) => x !== id),
      "Conocimiento desasignado",
    );
  };

  const reindexDoc = (id: string, title?: string) => {
    markIndexing(id, true);
    reindexKnowledge.mutate(
      { id, branch: agentBranchId },
      {
        onSuccess: (data) => {
          if (data.indexing_task_id) {
            indexingTaskIds.current.set(id, data.indexing_task_id);
          }
          toast.message(`Reindexando${title ? ` «${title}»` : ""}… te avisamos cuando esté listo`);
        },
        onError: () => {
          toast.error("No se pudo reindexar");
          markIndexing(id, false);
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="text-base">Conocimiento del agente</CardTitle>
            <CardDescription>
              Asigna documentos del catálogo. Al asignar se generan vectores con el embedding de la
              sucursal (el del agente se usa al consultar).
              {assignedDocs.length > 0 ? ` · ${assignedDocs.length}` : ""}.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            {canManageKnowledge && (
              <>
                <Button
                  size="sm"
                  onClick={() => {
                    setAssignSearch("");
                    setAssignOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1.5" /> Asignar conocimiento
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/conocimiento">
                    <BookOpen className="h-4 w-4 mr-1.5" /> Catálogo
                  </Link>
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {assignedDocs.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="rounded-md border border-border/70 bg-muted/20 px-3 py-2">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Asignados
                </div>
                <div className="text-sm font-medium mt-0.5 tabular-nums">{vectorStats.total}</div>
              </div>
              <div className="rounded-md border border-border/70 bg-muted/20 px-3 py-2">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Con vectores
                </div>
                <div className="text-sm font-medium mt-0.5 tabular-nums text-primary">
                  {vectorStats.indexed}
                </div>
              </div>
              <div className="rounded-md border border-border/70 bg-muted/20 px-3 py-2">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {vectorStats.indexing > 0 ? "Generando" : "Sin vectores"}
                </div>
                <div className="text-sm font-medium mt-0.5 tabular-nums">
                  {vectorStats.indexing > 0 ? vectorStats.indexing : vectorStats.pending}
                </div>
              </div>
              <div className="rounded-md border border-border/70 bg-muted/20 px-3 py-2">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Fragmentos
                </div>
                <div className="text-sm font-medium mt-0.5 tabular-nums">{vectorStats.chunks}</div>
              </div>
            </div>
          )}

          {assignedDocs.length > 0 && (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar en asignados…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          )}

          {filteredAssigned.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {search.trim() ? (
                "No hay documentos que coincidan con la búsqueda."
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <BookOpen className="h-8 w-8 opacity-40" />
                  <span>Este agente aún no tiene conocimiento asignado.</span>
                  {canManageKnowledge && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setAssignSearch("");
                        setAssignOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1.5" /> Asignar conocimiento
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            {filteredAssigned.map((doc) => {
              const Icon = KNOWLEDGE_TYPE_ICON[doc.knowledge_type] ?? BookOpen;
              const id = String(doc.id);
              const isPending = pendingIds.has(id);
              const isIndexing = indexingIds.has(id);
              const withVectors = hasKnowledgeVectors(doc);
              const withChunksOnly =
                !withVectors && isKnowledgeIndexed(doc) && (doc.chunks_count ?? 0) > 0;

              return (
                <div
                  key={doc.id}
                  className="flex items-start sm:items-center gap-3 rounded-lg border border-primary/20 bg-primary-soft/10 p-3"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm truncate">{doc.title}</span>
                      {isIndexing ? (
                        <Badge variant="outline" className="text-[10px] gap-1 text-primary">
                          <Loader2 className="h-3 w-3 animate-spin" /> Generando vectores…
                        </Badge>
                      ) : withVectors ? (
                        <Badge variant="outline" className="text-[10px] gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Con vectores
                          {doc.embeddings_count != null ? ` · ${doc.embeddings_count}` : ""}
                        </Badge>
                      ) : withChunksOnly ? (
                        <Badge variant="outline" className="text-[10px] gap-1 text-warning">
                          <XCircle className="h-3 w-3" /> Sin vectores
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[10px] gap-1 text-muted-foreground"
                        >
                          <XCircle className="h-3 w-3" /> Sin vectores
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {KNOWLEDGE_TYPE_LABEL[doc.knowledge_type]}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <KnowledgeContentViewer
                      knowledgeId={id}
                      title={doc.title}
                      knowledgeType={doc.knowledge_type}
                      context="agent"
                      branchId={agentBranchId}
                    />
                    {canManageKnowledge && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8"
                          disabled={isIndexing}
                          onClick={() => reindexDoc(id, doc.title)}
                          title="Reindexar"
                        >
                          {isIndexing ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 mr-1" />
                              Reindexar
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-destructive hover:text-destructive"
                          disabled={isPending}
                          onClick={() => unassignDoc(id)}
                          title="Quitar del agente"
                        >
                          {isPending ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Unlink className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={assignOpen}
        onOpenChange={(open) => {
          setAssignOpen(open);
          if (!open) setAssignSearch("");
        }}
      >
        <DialogContent className="w-full max-w-xl gap-4 p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Asignar conocimiento</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground -mt-2">
            Elige documentos del catálogo. Si aún no tienen vectores, se indexan al asignar.
          </p>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en el catálogo…"
              value={assignSearch}
              onChange={(e) => setAssignSearch(e.target.value)}
              className="pl-9 h-8 text-xs"
            />
          </div>
          <div className="max-h-[min(52vh,420px)] overflow-y-auto rounded-md border border-border divide-y divide-border/60">
            {filteredAvailable.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground space-y-2 px-4">
                <p>
                  {assignSearch.trim()
                    ? "Sin resultados para esa búsqueda."
                    : availableDocs.length === 0 && catalog.length > 0
                      ? "Todo el catálogo ya está asignado a este agente."
                      : "No hay documentos en el catálogo."}
                </p>
                {catalog.length === 0 && (
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/conocimiento">Ir a Conocimiento</Link>
                  </Button>
                )}
              </div>
            ) : (
              filteredAvailable.map((doc) => {
                const Icon = KNOWLEDGE_TYPE_ICON[doc.knowledge_type] ?? BookOpen;
                const isPending = pendingIds.has(String(doc.id));
                return (
                  <div key={doc.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{doc.title}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {KNOWLEDGE_TYPE_LABEL[doc.knowledge_type]}
                          {hasKnowledgeVectors(doc) ? " · Con vectores" : " · Sin vectores"}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 h-8"
                      disabled={isPending}
                      onClick={() => assignDoc(doc)}
                    >
                      {isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5 mr-1" /> Asignar
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
