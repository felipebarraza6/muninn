import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateKnowledge,
  type ApiRefreshConfig,
  type KnowledgeType,
} from "@/api/hooks/useKnowledge";
import {
  CREATE_KNOWLEDGE_TYPES,
  KNOWLEDGE_TYPE_DESCRIPTION,
  KNOWLEDGE_TYPE_LABEL,
  KNOWLEDGE_TYPE_PLACEHOLDER,
  serializeFaqPairs,
} from "@/lib/knowledge-types";
import { KnowledgeApiRefreshSection } from "@/components/knowledge/knowledge-api-refresh-section";
import { AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { toast } from "sonner";
import { apiErrorMessage } from "@/lib/apiError";
import { useActiveBranchId } from "@/hooks/useActiveBranchId";
import { getStoredBranches } from "@/lib/authSession";
import { isMultiBranchUser } from "@/lib/authGuards";

/** Nuevo conocimiento a página completa (sin modal). */
export default function ConocimientoNuevo() {
  const navigate = useNavigate();
  const create = useCreateKnowledge();
  const activeBranchId = useActiveBranchId();

  const branchLabel = (() => {
    if (!activeBranchId) return null;
    const b = getStoredBranches().find((x) => String(x.branch_id) === String(activeBranchId));
    return b?.branch_name || b?.business_name || `Sucursal ${activeBranchId}`;
  })();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [knowledgeType, setKnowledgeType] = useState<KnowledgeType>("DOCUMENT");
  const [faqPairs, setFaqPairs] = useState([{ question: "", answer: "" }]);
  const [apiRefresh, setApiRefresh] = useState<ApiRefreshConfig | null>(null);

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
    // Con auto-refresh el contenido lo genera la API: puede partir vacío.
    if (!body.trim() && !apiRefresh) {
      toast.error(
        knowledgeType === "FAQ"
          ? "Agrega al menos una pregunta y respuesta"
          : "El contenido es obligatorio",
      );
      return;
    }
    if (apiRefresh) {
      if (!apiRefresh.external_api_id) {
        toast.error("Selecciona la External API para el auto-refresh");
        return;
      }
      if (!apiRefresh.endpoint) {
        toast.error("Selecciona el endpoint para el auto-refresh");
        return;
      }
    }
    if (!activeBranchId) {
      toast.error("Selecciona una sucursal antes de crear conocimiento");
      return;
    }

    create.mutate(
      {
        title: title.trim(),
        content: body,
        knowledge_type: knowledgeType,
        category: category.trim() || null,
        is_active: true,
        ...(apiRefresh ? { api_refresh_config: apiRefresh } : {}),
      },
      {
        onSuccess: (doc) => {
          toast.success(
            apiRefresh
              ? "Documento creado con auto-refresh. El primer refresco llega en el próximo ciclo (cada 1 h)."
              : "Documento creado. Se indexará al asignarlo a un agente.",
          );
          navigate(doc?.id ? `/conocimiento/${doc.id}` : "/conocimiento");
        },
        onError: (e) => toast.error(apiErrorMessage(e, "No se pudo crear el documento")),
      },
    );
  };

  return (
    <AdminPageMotion className="px-4 md:px-6 lg:px-8 py-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1.5">
            <Button variant="ghost" size="sm" className="h-7 -ml-2 text-muted-foreground" asChild>
              <Link to="/conocimiento">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Conocimiento
              </Link>
            </Button>
            <h1 className="text-xl font-semibold leading-tight">Nuevo conocimiento</h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Elige el tipo: el formulario se adapta. Las tablas de datos también se cargan desde{" "}
              <Link to="/conocimiento/datos" className="font-medium text-primary hover:underline">
                Datos
              </Link>
              .
              {isMultiBranchUser() && branchLabel ? (
                <>
                  {" "}
                  Se guarda en la sucursal activa:{" "}
                  <span className="font-medium text-foreground">{branchLabel}</span>.
                </>
              ) : null}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Button type="button" variant="outline" size="sm" asChild>
              <Link to="/conocimiento">Cancelar</Link>
            </Button>
            <Button type="submit" size="sm" disabled={create.isPending}>
              {create.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Crear conocimiento
            </Button>
          </div>
        </div>

        <div className="grid flex-1 min-h-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
          {/* Columna principal */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
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
                  <Label htmlFor="knowledge-category">Categoría (opcional)</Label>
                  <Input
                    id="knowledge-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value.slice(0, 80))}
                    placeholder="Ej: Políticas, FAQ clínica…"
                    maxLength={80}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={knowledgeType}
                  onValueChange={(v) => handleTypeChange(v as KnowledgeType)}
                >
                  <SelectTrigger className="sm:max-w-xs">
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
            </div>

            <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-3">
              <Label className="text-xs text-muted-foreground">Contenido</Label>
              {knowledgeType === "FAQ" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Preguntas y respuestas</p>
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
                        <span className="text-xs font-medium text-muted-foreground">
                          Par {idx + 1}
                        </span>
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
                              prev.map((p, i) =>
                                i === idx ? { ...p, question: e.target.value } : p,
                              ),
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
                              prev.map((p, i) =>
                                i === idx ? { ...p, answer: e.target.value } : p,
                              ),
                            )
                          }
                          placeholder="Atendemos de lunes a viernes de 9:00 a 18:00…"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <Textarea
                    id="knowledge-content"
                    rows={16}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required={!apiRefresh}
                    placeholder={
                      KNOWLEDGE_TYPE_PLACEHOLDER[knowledgeType] || "Escribe o pega el contenido…"
                    }
                    className="font-mono text-sm min-h-[320px]"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    {apiRefresh
                      ? "Con auto-refresh puedes dejarlo vacío: la API lo llenará en el primer ciclo."
                      : "Puedes pegar texto largo desde Word o el navegador. Se indexará al crear."}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Columna lateral: auto-refresh */}
          <div className="space-y-3">
            <KnowledgeApiRefreshSection
              value={apiRefresh}
              onChange={setApiRefresh}
              disabled={create.isPending}
              branch={activeBranchId}
            />
          </div>
        </div>
      </form>
    </AdminPageMotion>
  );
}
