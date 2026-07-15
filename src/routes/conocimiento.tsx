import { useMemo, useState } from "react";
import { BookOpen, FileSpreadsheet, Loader2, Plus, RefreshCw, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useKnowledgeCatalog,
  useCreateKnowledge,
  useDeleteKnowledge,
  useIndexKnowledge,
  useReindexKnowledge,
  useUnindexKnowledge,
  useBulkIndexKnowledge,
  type KnowledgeType,
} from "@/api/hooks/useKnowledge";
import { KnowledgeContentViewer } from "@/components/agents/knowledge-content-viewer";
import { SpreadsheetImportDialog } from "@/components/knowledge/SpreadsheetImportDialog";
import { toast } from "sonner";

const TYPES: { value: KnowledgeType; label: string }[] = [
  { value: "DOCUMENT", label: "Documento" },
  { value: "FAQ", label: "FAQ" },
  { value: "DATA", label: "Datos" },
  { value: "POLICY", label: "Política" },
  { value: "PROCEDURE", label: "Procedimiento" },
  { value: "API_DOC", label: "API doc" },
  { value: "CUSTOM", label: "Custom" },
];

export default function Conocimiento() {
  const { data: docs = [], isLoading, refetch } = useKnowledgeCatalog();
  const create = useCreateKnowledge();
  const remove = useDeleteKnowledge();
  const index = useIndexKnowledge();
  const reindex = useReindexKnowledge();
  const unindex = useUnindexKnowledge();
  const bulkIndex = useBulkIndexKnowledge();

  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [knowledgeType, setKnowledgeType] = useState<KnowledgeType>("DOCUMENT");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return docs;
    return docs.filter(
      (d) =>
        d.title.toLowerCase().includes(term) ||
        (d.summary || "").toLowerCase().includes(term) ||
        d.knowledge_type.toLowerCase().includes(term),
    );
  }, [docs, q]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate(
      { title, content, knowledge_type: knowledgeType, is_active: true },
      {
        onSuccess: (doc) => {
          toast.success("Documento creado");
          setCreating(false);
          setTitle("");
          setContent("");
          if (doc.id) {
            index.mutate(String(doc.id), {
              onSuccess: () => toast.success("Indexación iniciada"),
            });
          }
        },
        onError: () => toast.error("No se pudo crear el documento"),
      },
    );
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-5 w-5 text-primary" />
              Biblioteca de conocimiento
            </CardTitle>
            <CardDescription>
              Crea, indexa y gestiona documentos RAG para asignarlos a agentes.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={bulkIndex.isPending || filtered.length === 0}
              onClick={() => {
                const ids = filtered.filter((d) => !d.is_indexed).map((d) => String(d.id));
                if (ids.length === 0) {
                  toast.message("Todo ya está indexado en la vista actual");
                  return;
                }
                bulkIndex.mutate(ids, {
                  onSuccess: () => toast.success(`Indexando ${ids.length} docs`),
                  onError: () => toast.error("Bulk index falló"),
                });
              }}
            >
              <Upload className="h-4 w-4 mr-1.5" /> Indexar pendientes
            </Button>
            <Button variant="outline" size="sm" onClick={() => setImportOpen(true)}>
              <FileSpreadsheet className="h-4 w-4 mr-1.5" /> Excel / CSV
            </Button>
            <Button size="sm" onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Nuevo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Buscar por título, tipo…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-md"
          />

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">
              No hay documentos. Crea el primero para entrenar agentes.
            </p>
          ) : (
            <div className="space-y-2">
              {filtered.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border p-3"
                >
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm truncate">{doc.title}</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {doc.knowledge_type}
                      </Badge>
                      <Badge
                        variant={doc.is_indexed ? "default" : "outline"}
                        className="text-[10px]"
                      >
                        {doc.is_indexed ? "Indexado" : "Sin indexar"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {doc.summary || doc.content?.slice(0, 120) || "Sin resumen"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <KnowledgeContentViewer
                      knowledgeId={String(doc.id)}
                      title={doc.title}
                      knowledgeType={doc.knowledge_type}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={index.isPending || reindex.isPending}
                      onClick={() => {
                        const fn = doc.is_indexed ? reindex : index;
                        fn.mutate(String(doc.id), {
                          onSuccess: () => {
                            toast.success(doc.is_indexed ? "Reindexado" : "Indexado");
                            refetch();
                          },
                          onError: () => toast.error("Error de indexación"),
                        });
                      }}
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1" />
                      {doc.is_indexed ? "Reindex" : "Index"}
                    </Button>
                    {doc.is_indexed && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          unindex.mutate(String(doc.id), {
                            onSuccess: () => toast.success("Desindexado"),
                            onError: () => toast.error("Error al desindexar"),
                          })
                        }
                      >
                        Unindex
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() =>
                        remove.mutate(String(doc.id), {
                          onSuccess: () => toast.success("Eliminado"),
                          onError: () => toast.error("No se pudo eliminar"),
                        })
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nuevo documento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={knowledgeType}
                onValueChange={(v) => setKnowledgeType(v as KnowledgeType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Contenido</Label>
              <Textarea
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="font-mono text-sm"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setCreating(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear e indexar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <SpreadsheetImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImported={() => refetch()}
      />
    </div>
  );
}
