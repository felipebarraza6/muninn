import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateKnowledge,
  useIndexKnowledge,
  type KnowledgeType,
} from "@/api/hooks/useKnowledge";
import {
  CREATE_KNOWLEDGE_TYPES,
  KNOWLEDGE_TYPE_DESCRIPTION,
  KNOWLEDGE_TYPE_LABEL,
  KNOWLEDGE_TYPE_PLACEHOLDER,
  serializeFaqPairs,
} from "@/lib/knowledge-types";
import { toast } from "sonner";

interface KnowledgeCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

export function KnowledgeCreateDialog({
  open,
  onOpenChange,
  onCreated,
}: KnowledgeCreateDialogProps) {
  const create = useCreateKnowledge();
  const index = useIndexKnowledge();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [knowledgeType, setKnowledgeType] = useState<KnowledgeType>("DOCUMENT");
  const [faqPairs, setFaqPairs] = useState([{ question: "", answer: "" }]);

  const reset = () => {
    setTitle("");
    setContent("");
    setKnowledgeType("DOCUMENT");
    setFaqPairs([{ question: "", answer: "" }]);
  };

  const handleTypeChange = (next: KnowledgeType) => {
    if (knowledgeType === "FAQ" && next !== "FAQ") {
      const serialized = serializeFaqPairs(faqPairs);
      if (serialized) setContent(serialized);
    }
    if (next === "FAQ" && knowledgeType !== "FAQ") {
      setFaqPairs([{ question: "", answer: "" }]);
    }
    setKnowledgeType(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = knowledgeType === "FAQ" ? serializeFaqPairs(faqPairs) : content.trim();

    if (!title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }
    if (!body.trim()) {
      toast.error(
        knowledgeType === "FAQ"
          ? "Agrega al menos una pregunta y respuesta"
          : "El contenido es obligatorio",
      );
      return;
    }

    create.mutate(
      {
        title: title.trim(),
        content: body,
        knowledge_type: knowledgeType,
        is_active: true,
      },
      {
        onSuccess: (doc) => {
          toast.success("Documento creado");
          reset();
          onOpenChange(false);
          onCreated?.();
          if (doc.id) {
            index.mutate(String(doc.id), {
              onSuccess: () => toast.success("Indexación iniciada"),
              onError: () => toast.error("No se pudo iniciar la indexación"),
            });
          }
        },
        onError: () => toast.error("No se pudo crear el documento"),
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo conocimiento</DialogTitle>
          <DialogDescription>
            Elige el tipo: el formulario se adapta. Las tablas de datos se cargan desde{" "}
            <span className="font-medium text-foreground">Datos</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="knowledge-title">Título</Label>
            <Input
              id="knowledge-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Política de devoluciones"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={knowledgeType}
              onValueChange={(v) => handleTypeChange(v as KnowledgeType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CREATE_KNOWLEDGE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {KNOWLEDGE_TYPE_LABEL[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {KNOWLEDGE_TYPE_DESCRIPTION[knowledgeType]}
            </p>
          </div>

          {knowledgeType === "FAQ" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Preguntas y respuestas</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFaqPairs((prev) => [...prev, { question: "", answer: "" }])}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Añadir par
                </Button>
              </div>
              {faqPairs.map((pair, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border p-3 space-y-2 bg-muted/20"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Par {idx + 1}</span>
                    {faqPairs.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => setFaqPairs((prev) => prev.filter((_, i) => i !== idx))}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Pregunta</Label>
                    <Input
                      value={pair.question}
                      onChange={(e) =>
                        setFaqPairs((prev) =>
                          prev.map((p, i) => (i === idx ? { ...p, question: e.target.value } : p)),
                        )
                      }
                      placeholder="¿Cuál es el horario de atención?"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Respuesta</Label>
                    <Textarea
                      rows={3}
                      value={pair.answer}
                      onChange={(e) =>
                        setFaqPairs((prev) =>
                          prev.map((p, i) => (i === idx ? { ...p, answer: e.target.value } : p)),
                        )
                      }
                      placeholder="Atendemos de lunes a viernes de 9:00 a 18:00…"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="knowledge-content">Contenido</Label>
              <Textarea
                id="knowledge-content"
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder={
                  KNOWLEDGE_TYPE_PLACEHOLDER[knowledgeType] || "Escribe o pega el contenido…"
                }
                className="font-mono text-sm min-h-[200px]"
              />
              <p className="text-[11px] text-muted-foreground">
                Puedes pegar texto largo desde Word o el navegador. Se indexará al crear.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
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
  );
}
