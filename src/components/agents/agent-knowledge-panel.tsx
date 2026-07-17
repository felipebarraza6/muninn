import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle, BookOpen, Search, Plus, Unlink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAgent, useUpdateAgent } from "@/api/hooks/useAgents";
import {
  useKnowledgeCatalog,
  isKnowledgeIndexed,
  type AgentKnowledge,
} from "@/api/hooks/useKnowledge";
import { KnowledgeContentViewer } from "./knowledge-content-viewer";
import { toast } from "sonner";
import { KNOWLEDGE_TYPE_ICON, KNOWLEDGE_TYPE_LABEL } from "@/lib/knowledge-types";
import { canAccessKnowledgeCatalog } from "@/lib/authGuards";

interface AgentKnowledgePanelProps {
  agentId: string;
}

function docId(doc: AgentKnowledge | string | number | { id?: string | number }): string {
  if (typeof doc === "string" || typeof doc === "number") return String(doc);
  return String(doc.id);
}

export function AgentKnowledgePanel({ agentId }: AgentKnowledgePanelProps) {
  const { data: agent, isLoading: isLoadingAgent, refetch: refetchAgent } = useAgent(agentId);
  const { data: catalog = [], isLoading: isLoadingKnowledge } = useKnowledgeCatalog();
  const updateAgent = useUpdateAgent();
  const [search, setSearch] = useState("");
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignSearch, setAssignSearch] = useState("");
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const canManageKnowledge = canAccessKnowledgeCatalog();

  const assignedIds = useMemo(() => {
    return new Set((agent?.knowledge_documents ?? []).map((d) => docId(d)));
  }, [agent?.knowledge_documents]);

  const assignedDocs = useMemo(() => {
    return catalog.filter((doc) => assignedIds.has(String(doc.id)));
  }, [catalog, assignedIds]);

  const availableDocs = useMemo(() => {
    return catalog.filter((doc) => !assignedIds.has(String(doc.id)));
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

  const setKnowledgeDocuments = (nextIds: string[], successMsg: string) => {
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

  const assignDoc = (id: string) => {
    setKnowledgeDocuments(
      Array.from(new Set([...Array.from(assignedIds), id])),
      "Conocimiento asignado al agente",
    );
  };

  const unassignDoc = (id: string) => {
    setKnowledgeDocuments(
      Array.from(assignedIds).filter((x) => x !== id),
      "Conocimiento desasignado",
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="text-base">Conocimiento del agente</CardTitle>
            <CardDescription>
              Solo lo asignado a este agente para RAG
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
              const isPending = pendingIds.has(String(doc.id));

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
                      {isKnowledgeIndexed(doc) ? (
                        <Badge variant="outline" className="text-[10px] gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Indexado
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[10px] gap-1 text-muted-foreground"
                        >
                          <XCircle className="h-3 w-3" /> Sin indexar
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {KNOWLEDGE_TYPE_LABEL[doc.knowledge_type]}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <KnowledgeContentViewer
                      knowledgeId={String(doc.id)}
                      title={doc.title}
                      knowledgeType={doc.knowledge_type}
                    />
                    {canManageKnowledge && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-destructive hover:text-destructive"
                        disabled={isPending}
                        onClick={() => unassignDoc(String(doc.id))}
                        title="Quitar del agente"
                      >
                        {isPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Unlink className="h-3.5 w-3.5" />
                        )}
                      </Button>
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
        <DialogContent className="w-[calc(100vw-1.5rem)] max-w-xl gap-4 p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Asignar conocimiento</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground -mt-2">
            Elige documentos del catálogo para que este agente los use en RAG.
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
                  <div
                    key={doc.id}
                    className="flex items-center justify-between gap-3 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{doc.title}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {KNOWLEDGE_TYPE_LABEL[doc.knowledge_type]}
                          {isKnowledgeIndexed(doc) ? " · Indexado" : " · Sin indexar"}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 h-8"
                      disabled={isPending}
                      onClick={() => assignDoc(String(doc.id))}
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
