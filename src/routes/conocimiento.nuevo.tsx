import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
  BranchFilterSelect,
  type BranchFilterOption,
} from "@/components/branch/BranchFilterSelect";
import { useCreateKnowledge, type KnowledgeType } from "@/api/hooks/useKnowledge";
import { useAdminBranches, useMyBranchesSelect } from "@/api/hooks/useBranches";
import {
  CREATE_KNOWLEDGE_TYPES,
  KNOWLEDGE_TYPE_DESCRIPTION,
  KNOWLEDGE_TYPE_ICON,
  KNOWLEDGE_TYPE_LABEL,
  KNOWLEDGE_TYPE_PLACEHOLDER,
  serializeFaqPairs,
} from "@/lib/knowledge-types";
import { AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { toast } from "sonner";
import { apiErrorMessage } from "@/lib/apiError";
import { isSuperAdmin, isOrganizationOwner } from "@/lib/authGuards";

/** Nuevo conocimiento a página completa (sin modal). */
export default function ConocimientoNuevo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const create = useCreateKnowledge();

  const isGlobalAdmin = isSuperAdmin();
  const isOrgOwner = isOrganizationOwner();
  const showSelector = isGlobalAdmin || isOrgOwner;

  const { data: adminBranches = [], isLoading: adminLoading } = useAdminBranches({
    enabled: showSelector,
  });
  const { data: myBranches = [], isLoading: myLoading } = useMyBranchesSelect();

  const branchOptions = useMemo(() => {
    const fromMy = myBranches.map((b) => ({
      id: String(b.value),
      label: b.label,
    }));

    if (showSelector) {
      const fromAdmin = adminBranches.map((b) => ({
        id: String(b.id),
        label: b.fantasy_name?.trim() || b.business_name?.trim() || `Sucursal ${b.id}`,
      }));
      return Array.from(new Map([...fromAdmin, ...fromMy].map((o) => [o.id, o])).values()).sort(
        (a, b) => a.label.localeCompare(b.label, "es", { sensitivity: "base" }),
      );
    }

    return fromMy;
  }, [adminBranches, myBranches, showSelector]);

  const [selectedBranchId, setSelectedBranchId] = useState<string>(() => {
    if (branchOptions.length === 1) return branchOptions[0].id;
    return "";
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [knowledgeType, setKnowledgeType] = useState<KnowledgeType>(() => {
    const t = searchParams.get("type");
    return t && (CREATE_KNOWLEDGE_TYPES as readonly string[]).includes(t)
      ? (t as KnowledgeType)
      : "DOCUMENT";
  });
  const [faqPairs, setFaqPairs] = useState([{ question: "", answer: "" }]);

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
    const targetBranch = selectedBranchId || branchOptions[0]?.id || "";
    const canPickAll = isSuperAdmin() || isOrganizationOwner();
    if (!targetBranch && !canPickAll) {
      toast.error("Selecciona una sucursal");
      return;
    }

    create.mutate(
      {
        title: title.trim(),
        content: body,
        knowledge_type: knowledgeType,
        category: category.trim() || null,
        ...(targetBranch ? { branch: Number(targetBranch) } : {}),
        is_active: true,
      },
      {
        onSuccess: (doc) => {
          toast.success("Documento creado. Se indexará al asignarlo a un agente.");
          navigate(doc?.id ? `/app/conocimiento/${doc.id}` : "/app/conocimiento");
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
              <Link to="/app/conocimiento">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Conocimiento
              </Link>
            </Button>
            <h1 className="text-xl font-semibold leading-tight">Nuevo conocimiento</h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Elige el tipo: el formulario se adapta. Las tablas de datos también se cargan desde{" "}
              <Link
                to="/app/conocimiento/datos"
                className="font-medium text-primary hover:underline"
              >
                Datos
              </Link>
              .
              {branchOptions.length === 1 ? (
                <>
                  {" "}
                  Se guarda en{" "}
                  <span className="font-medium text-foreground">{branchOptions[0].label}</span>.
                </>
              ) : null}
            </p>
            {branchOptions.length > 1 && (
              <div className="flex items-center gap-2">
                <Label className="text-xs shrink-0">Sucursal</Label>
                <BranchFilterSelect
                  value={selectedBranchId}
                  onValueChange={setSelectedBranchId}
                  options={branchOptions}
                  includeAll
                  allValue=""
                  allLabel="Todas (organización)"
                  label={null}
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Button type="button" variant="outline" size="sm" asChild>
              <Link to="/app/conocimiento">Cancelar</Link>
            </Button>
            <Button type="submit" size="sm" disabled={create.isPending}>
              {create.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Crear conocimiento
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="space-y-4">
            {/* Título + Categoría + Tipo — en fila */}
            <div className="rounded-xl border border-border/70 bg-card/60 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              </div>
            </div>

            {/* Contenido — se adapta según el tipo */}
            <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-3">
              {(() => {
                const TypeIcon = KNOWLEDGE_TYPE_ICON[knowledgeType];
                return (
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground/90 border-b border-border/60 pb-3 mb-1">
                    {TypeIcon && <TypeIcon className="h-4 w-4 text-primary" />}
                    <span>{KNOWLEDGE_TYPE_LABEL[knowledgeType]}</span>
                  </div>
                );
              })()}

              {knowledgeType === "FAQ" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Agrega pares de pregunta y respuesta
                    </p>
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
              ) : knowledgeType === "POLICY" ? (
                <div className="space-y-2">
                  <Textarea
                    id="knowledge-content"
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    placeholder="Describe la política: alcance, excepciones, vigencia…"
                    className="font-mono text-sm min-h-[240px]"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Incluye el alcance, las excepciones y la vigencia. Se indexará al crear.
                  </p>
                </div>
              ) : knowledgeType === "PROCEDURE" ? (
                <div className="space-y-2">
                  <Textarea
                    id="knowledge-content"
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    placeholder="Paso 1: …&#10;Paso 2: …&#10;Paso 3: …"
                    className="font-mono text-sm min-h-[240px]"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Escribe los pasos en orden numerado. Se indexará al crear.
                  </p>
                </div>
              ) : knowledgeType === "API_DOC" ? (
                <div className="space-y-2">
                  <Textarea
                    id="knowledge-content"
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    placeholder="Endpoint, método, parámetros y ejemplos de respuesta…"
                    className="font-mono text-sm min-h-[240px]"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Describe los endpoints, métodos y contratos de integración.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Textarea
                    id="knowledge-content"
                    rows={16}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    placeholder={
                      KNOWLEDGE_TYPE_PLACEHOLDER[knowledgeType] || "Escribe o pega el contenido…"
                    }
                    className="font-mono text-sm min-h-[320px]"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Puedes pegar texto largo desde Word o el navegador. Se indexará al crear.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </AdminPageMotion>
  );
}
