import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, FileSpreadsheet, Loader2, Plus, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  useKnowledgeCatalog,
  useDeleteKnowledge,
  isKnowledgeIndexed,
  type AgentKnowledge,
} from "@/api/hooks/useKnowledge";
import { KnowledgeContentViewer } from "@/components/agents/knowledge-content-viewer";
import { KnowledgeCreateDialog } from "@/components/knowledge/knowledge-create-dialog";
import { knowledgeTypeLabel, knowledgeTypeMeta } from "@/lib/knowledge-types";
import { toast } from "sonner";
import { AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import { cn } from "@/lib/utils";

function KnowledgeCard({
  doc,
  indexed,
  onDelete,
}: {
  doc: AgentKnowledge;
  indexed: boolean;
  onDelete: () => void;
}) {
  const { label, Icon, style } = knowledgeTypeMeta(doc.knowledge_type);
  const preview = doc.summary || doc.content?.slice(0, 140) || "Sin resumen";

  return (
    <article
      className={cn(
        "group flex flex-col rounded-xl border bg-card/60 p-4 transition-colors",
        style.border,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
            style.soft,
          )}
        >
          <Icon className={cn("h-5 w-5", style.icon)} />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <h3 className="font-medium text-sm leading-snug line-clamp-2">{doc.title}</h3>
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
                style.chip,
              )}
            >
              {label}
            </span>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] gap-1 font-normal",
                indexed ? "border-primary/30 text-primary" : "text-muted-foreground",
              )}
            >
              {indexed ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {indexed ? "Con vectores" : "Sin vectores"}
            </Badge>
          </div>
        </div>
      </div>

      <p className="mt-3 text-[12px] text-muted-foreground line-clamp-3 leading-relaxed flex-1">
        {preview}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-1 border-t border-border/60 pt-3">
        <KnowledgeContentViewer
          knowledgeId={String(doc.id)}
          title={doc.title}
          knowledgeType={doc.knowledge_type}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive ml-auto"
          onClick={onDelete}
          title="Eliminar"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}

export default function Conocimiento() {
  const { data: docs = [], isLoading, refetch } = useKnowledgeCatalog();
  const remove = useDeleteKnowledge();

  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return docs;
    return docs.filter(
      (d) =>
        d.title.toLowerCase().includes(term) ||
        (d.summary || "").toLowerCase().includes(term) ||
        knowledgeTypeLabel(d.knowledge_type).toLowerCase().includes(term) ||
        d.knowledge_type.toLowerCase().includes(term),
    );
  }, [docs, q]);

  return (
    <AdminPageMotion className="space-y-4 px-4 md:px-6 lg:px-8 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground max-w-xl">
          Biblioteca de documentos. Se preparan para RAG al asignarlos a un agente.
        </p>
        <div className="flex gap-2 items-center flex-wrap justify-end shrink-0">
          <Button variant="outline" size="sm" asChild>
            <Link to="/conocimiento/datos">
              <FileSpreadsheet className="h-4 w-4 mr-1.5" /> Datos
            </Link>
          </Button>
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Nuevo
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:max-w-xl">
        <Input
          placeholder="Buscar por título, tipo…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-9 flex-1 min-w-0"
        />
        <StudioBranchFilter />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No hay documentos. Crea el primero para usarlo en agentes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((doc) => (
            <KnowledgeCard
              key={doc.id}
              doc={doc}
              indexed={isKnowledgeIndexed(doc)}
              onDelete={() =>
                remove.mutate(String(doc.id), {
                  onSuccess: () => toast.success("Eliminado"),
                  onError: () => toast.error("No se pudo eliminar"),
                })
              }
            />
          ))}
        </div>
      )}

      <KnowledgeCreateDialog
        open={creating}
        onOpenChange={setCreating}
        onCreated={() => refetch()}
      />
    </AdminPageMotion>
  );
}
