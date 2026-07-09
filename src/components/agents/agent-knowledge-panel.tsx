import { useState } from "react";
import {
  Loader2,
  FileText,
  Database,
  MessageCircleQuestion,
  FunctionSquare,
  CheckCircle2,
  XCircle,
  BookOpen,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAgent, useUpdateAgent } from "@/api/hooks/useAgents";
import { useKnowledgeList, type KnowledgeType } from "@/api/hooks/useKnowledge";
import { KnowledgeContentViewer } from "./knowledge-content-viewer";
import { toast } from "sonner";

interface AgentKnowledgePanelProps {
  agentId: string;
}

const KNOWLEDGE_TYPE_LABEL: Record<KnowledgeType, string> = {
  DOCUMENT: "Documento",
  FAQ: "Preguntas frecuentes",
  DATA: "Tabla de datos",
  FUNCTION: "Función",
  PROCEDURE: "Procedimiento",
  POLICY: "Política",
  API_DOC: "Documento API",
  CODE: "Código",
  CUSTOM: "Personalizado",
};

const KNOWLEDGE_TYPE_ICON: Record<KnowledgeType, typeof FileText> = {
  DOCUMENT: FileText,
  FAQ: MessageCircleQuestion,
  DATA: Database,
  FUNCTION: FunctionSquare,
  PROCEDURE: FileText,
  POLICY: FileText,
  API_DOC: FileText,
  CODE: FileText,
  CUSTOM: FileText,
};

export function AgentKnowledgePanel({ agentId }: AgentKnowledgePanelProps) {
  const { data: agent, isLoading: isLoadingAgent } = useAgent(agentId);
  const { data: searchData, isLoading: isLoadingKnowledge } = useKnowledgeList({ top_k: 100 });
  const updateAgent = useUpdateAgent();
  const [search, setSearch] = useState("");
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

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
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">
            El RAG está desactivado para este agente, por lo que no consulta documentos de
            conocimiento.
          </div>
        </CardContent>
      </Card>
    );
  }

  const assignedIds = new Set(
    (agent.knowledge_documents ?? []).map((d) =>
      typeof d === "string" ? d : String((d as { id?: string | number }).id),
    ),
  );

  const allDocs = searchData?.results ?? [];
  const filteredDocs = allDocs.filter((doc) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      doc.title.toLowerCase().includes(term) ||
      (doc.source_app ?? "").toLowerCase().includes(term) ||
      KNOWLEDGE_TYPE_LABEL[doc.knowledge_type].toLowerCase().includes(term)
    );
  });

  const toggleAssignment = async (docId: string, assigned: boolean) => {
    setPendingIds((prev) => {
      const next = new Set(prev);
      next.add(docId);
      return next;
    });

    const nextIds = assigned
      ? Array.from(assignedIds).filter((id) => id !== docId)
      : Array.from(new Set([...Array.from(assignedIds), docId]));

    updateAgent.mutate(
      { id: agentId, data: { knowledge_documents: nextIds } },
      {
        onSuccess: () => {
          toast.success(assigned ? "Documento desasignado" : "Documento asignado al agente");
        },
        onError: () => {
          toast.error("No se pudo actualizar la asignación");
        },
        onSettled: () => {
          setPendingIds((prev) => {
            const next = new Set(prev);
            next.delete(docId);
            return next;
          });
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Base de conocimiento</CardTitle>
          <CardDescription>
            Documentos disponibles para entrenar este agente. Marca los que quieres que use en sus
            respuestas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, tipo o app fuente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {filteredDocs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {search.trim() ? (
                "No hay documentos que coincidan con la búsqueda."
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <BookOpen className="h-8 w-8 opacity-40" />
                  <span>No hay documentos de conocimiento en esta sucursal.</span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            {filteredDocs.map((doc) => {
              const Icon = KNOWLEDGE_TYPE_ICON[doc.knowledge_type] ?? FileText;
              const assigned = assignedIds.has(String(doc.id));
              const isPending = pendingIds.has(String(doc.id));

              return (
                <div
                  key={doc.id}
                  className={
                    "flex items-start sm:items-center gap-3 rounded-lg border p-3 transition-colors " +
                    (assigned
                      ? "border-primary/20 bg-primary-soft/10"
                      : "border-border bg-background hover:bg-muted/40")
                  }
                >
                  <Checkbox
                    id={`doc-${doc.id}`}
                    checked={assigned}
                    disabled={isPending}
                    onCheckedChange={() => toggleAssignment(String(doc.id), assigned)}
                    className="mt-0.5 sm:mt-0"
                  />
                  <label
                    htmlFor={`doc-${doc.id}`}
                    className="flex flex-1 items-start sm:items-center gap-3 min-w-0 cursor-pointer"
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-sm truncate">{doc.title}</span>
                        {assigned && (
                          <Badge variant="default" className="text-[10px]">
                            Asignado
                          </Badge>
                        )}
                        {doc.is_indexed ? (
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
                        {KNOWLEDGE_TYPE_LABEL[doc.knowledge_type]} · {doc.source_app ?? "general"}
                      </div>
                    </div>
                  </label>
                  <div className="shrink-0">
                    <KnowledgeContentViewer
                      knowledgeId={doc.id}
                      title={doc.title}
                      knowledgeType={doc.knowledge_type}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
