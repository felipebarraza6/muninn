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
  FileSpreadsheet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAgent, useUpdateAgent } from "@/api/hooks/useAgents";
import { useKnowledgeCatalog, type KnowledgeType } from "@/api/hooks/useKnowledge";
import { KnowledgeContentViewer } from "./knowledge-content-viewer";
import { SpreadsheetImportDialog } from "@/components/knowledge/SpreadsheetImportDialog";
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
  const { data: agent, isLoading: isLoadingAgent, refetch: refetchAgent } = useAgent(agentId);
  const {
    data: catalog = [],
    isLoading: isLoadingKnowledge,
    refetch: refetchCatalog,
  } = useKnowledgeCatalog();
  const updateAgent = useUpdateAgent();
  const [search, setSearch] = useState("");
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [importOpen, setImportOpen] = useState(false);

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

  const assignedIds = new Set(
    (agent.knowledge_documents ?? []).map((d) =>
      typeof d === "string" || typeof d === "number"
        ? String(d)
        : String((d as { id?: string | number }).id),
    ),
  );

  const filteredDocs = catalog.filter((doc) => {
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
          refetchAgent();
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
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="text-base">Base de conocimiento</CardTitle>
            <CardDescription>
              Asigna documentos o tablas. Importa Excel/CSV para cargar datos tabulares.
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={() => setImportOpen(true)}>
            <FileSpreadsheet className="h-4 w-4 mr-1.5" /> Excel / CSV
          </Button>
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
                  <span>No hay documentos. Importa un Excel o créalos en Conocimiento.</span>
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
                      knowledgeId={String(doc.id)}
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

      <SpreadsheetImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        assignToAgentId={agentId}
        onImported={() => {
          refetchCatalog();
          refetchAgent();
        }}
      />
    </div>
  );
}
