import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useKnowledgeCatalog } from "@/api/hooks/useKnowledge";
import type { JsonSchema, ParameterSource } from "@/api/hooks/useAgentFunctions";
import {
  formatSchemaType,
  guessSearchColumn,
  guessValueColumn,
  isRequiredParam,
  PARAMETER_SOURCE_HINT,
  PARAMETER_SOURCE_LABEL,
  schemaPropertyEntries,
} from "@/lib/skills";

interface Props {
  parametersSchema?: JsonSchema | null;
  sources: Record<string, ParameterSource>;
  onChange: (next: Record<string, ParameterSource>) => void;
  /** Sucursal para filtrar documentos DATA (skill o agente). */
  branch?: number | string | null;
  /**
   * Si se pasa, solo se listan documentos DATA cuyo id está en este conjunto
   * (conocimientos ya asignados al agente).
   */
  allowedKnowledgeIds?: (string | number)[] | null;
  /** Para enlace al agente cuando no hay conocimiento asignado. */
  agentId?: string;
  /** Texto cuando la skill no tiene parámetros. */
  emptyLabel?: string;
}

/**
 * Editor por-parámetro de `parameter_sources` (free / static / data_document).
 * Controlado: recibe `sources` y notifica cambios con `onChange`.
 * Se usa tanto en el default global de la skill como en el override por-agente.
 */
export function SkillParameterSourcesEditor({
  parametersSchema,
  sources,
  onChange,
  branch,
  allowedKnowledgeIds,
  agentId,
  emptyLabel = "Esta skill no tiene parámetros.",
}: Props) {
  const { data: knowledgeDocs = [], isLoading: knowledgeLoading } = useKnowledgeCatalog({
    page_size: 200,
  });

  const paramEntries = useMemo(() => schemaPropertyEntries(parametersSchema), [parametersSchema]);

  const allowedSet = useMemo(() => {
    if (allowedKnowledgeIds == null) return null;
    return new Set(allowedKnowledgeIds.map((id) => String(id)));
  }, [allowedKnowledgeIds]);

  const dataDocuments = useMemo(() => {
    const scopeBranch = branch != null ? String(branch) : null;
    return knowledgeDocs.filter((d) => {
      if (d.knowledge_type !== "DATA" || d.is_active === false) return false;
      if (allowedSet) {
        return allowedSet.has(String(d.id));
      }
      if (!scopeBranch || d.branch == null) return true;
      return String(d.branch) === scopeBranch;
    });
  }, [knowledgeDocs, branch, allowedSet]);

  const dataDocByTitle = useMemo(() => {
    const map = new Map<string, (typeof dataDocuments)[number]>();
    for (const d of dataDocuments) map.set(d.title, d);
    return map;
  }, [dataDocuments]);

  const patch = (key: string, value: ParameterSource | null) => {
    const next = { ...sources };
    if (value == null) delete next[key];
    else next[key] = value;
    onChange(next);
  };

  const setSourceType = (key: string, source: ParameterSource["source"]) => {
    if (source === "free") {
      patch(key, null);
      return;
    }
    if (source === "static") {
      patch(key, { source: "static", value: "" });
      return;
    }
    const only = dataDocuments.length === 1 ? dataDocuments[0] : null;
    if (only) {
      const columns = only.columns ?? [];
      const valueCol = guessValueColumn(columns);
      patch(key, {
        source: "data_document",
        document_title: only.title,
        value_column: valueCol,
        user_input_column: guessSearchColumn(columns, valueCol) || undefined,
      });
      return;
    }
    patch(key, { source: "data_document", document_title: "", value_column: "" });
  };

  const applyDataDocument = (key: string, title: string) => {
    const doc = dataDocByTitle.get(title);
    const columns = doc?.columns ?? [];
    const valueCol = guessValueColumn(columns);
    const searchCol = guessSearchColumn(columns, valueCol);
    patch(key, {
      source: "data_document",
      document_title: title,
      value_column: valueCol,
      user_input_column: searchCol || undefined,
    });
  };

  if (paramEntries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed px-4 py-6 text-center">
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {paramEntries.map(([key, prop]) => {
        const src = sources[key]?.source ?? "free";
        const srcCfg = sources[key];
        return (
          <div key={key} className="rounded-lg border p-3 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm font-mono">{key}</span>
              <Badge variant="outline" className="text-[10px]">
                {formatSchemaType(prop.type, prop.format, prop)}
              </Badge>
              {isRequiredParam(parametersSchema, key) && (
                <Badge variant="default" className="text-[10px]">
                  Requerido
                </Badge>
              )}
            </div>
            {prop.description && (
              <p className="text-xs text-muted-foreground">{prop.description}</p>
            )}
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-[11px]">Fuente</Label>
                <Select
                  value={src}
                  onValueChange={(v) => setSourceType(key, v as ParameterSource["source"])}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">{PARAMETER_SOURCE_LABEL.free}</SelectItem>
                    <SelectItem value="static">{PARAMETER_SOURCE_LABEL.static}</SelectItem>
                    <SelectItem value="data_document">
                      {PARAMETER_SOURCE_LABEL.data_document}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground">{PARAMETER_SOURCE_HINT[src]}</p>
              </div>
              {src === "static" && srcCfg?.source === "static" && (
                <div className="space-y-1">
                  <Label className="text-[11px]">Valor</Label>
                  <Input
                    className="h-8"
                    value={String(srcCfg.value ?? "")}
                    onChange={(e) => patch(key, { source: "static", value: e.target.value })}
                  />
                </div>
              )}
              {src === "data_document" && srcCfg?.source === "data_document" && (
                <>
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[11px]">Documento DATA</Label>
                    <Select
                      value={srcCfg.document_title || "__none__"}
                      onValueChange={(v) => {
                        if (v === "__none__") {
                          patch(key, {
                            source: "data_document",
                            document_title: "",
                            value_column: "",
                          });
                          return;
                        }
                        applyDataDocument(key, v);
                      }}
                      disabled={knowledgeLoading}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue
                          placeholder={
                            knowledgeLoading ? "Cargando documentos…" : "Selecciona un documento"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">—</SelectItem>
                        {srcCfg.document_title && !dataDocByTitle.has(srcCfg.document_title) && (
                          <SelectItem value={srcCfg.document_title}>
                            {srcCfg.document_title} (guardado)
                          </SelectItem>
                        )}
                        {dataDocuments.map((d) => (
                          <SelectItem key={d.id} value={d.title}>
                            {d.title}
                            {(d.columns?.length ?? 0) > 0 ? ` (${d.columns!.length} cols)` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {dataDocuments.length === 0 && !knowledgeLoading && (
                      <p className="text-[10px] text-muted-foreground">
                        {allowedSet ? (
                          <>
                            Este agente no tiene documentos DATA asignados.{" "}
                            {agentId ? (
                              <Link
                                to={`/app/agentes/${agentId}`}
                                className="text-primary underline-offset-2 hover:underline"
                              >
                                Asigna conocimiento al agente
                              </Link>
                            ) : (
                              "Asigna conocimiento al agente primero."
                            )}
                          </>
                        ) : (
                          <>
                            No hay documentos tipo DATA en esta sucursal.{" "}
                            <Link
                              to="/app/conocimiento"
                              className="text-primary underline-offset-2 hover:underline"
                            >
                              Crea uno en Conocimiento
                            </Link>
                            .
                          </>
                        )}
                      </p>
                    )}
                  </div>
                  {(() => {
                    const cols = dataDocByTitle.get(srcCfg.document_title)?.columns ?? [];
                    const hasCols = cols.length > 0;
                    return (
                      <>
                        <div className="space-y-1">
                          <Label className="text-[11px]">Columna valor (ID)</Label>
                          {hasCols ? (
                            <Select
                              value={srcCfg.value_column || "__none__"}
                              onValueChange={(v) =>
                                patch(key, {
                                  ...srcCfg,
                                  value_column: v === "__none__" ? "" : v,
                                })
                              }
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Columna ID" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__none__">—</SelectItem>
                                {cols.map((c) => (
                                  <SelectItem key={c} value={c}>
                                    {c}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              className="h-8"
                              value={srcCfg.value_column}
                              onChange={(e) =>
                                patch(key, { ...srcCfg, value_column: e.target.value })
                              }
                              placeholder="id"
                              disabled={!srcCfg.document_title}
                            />
                          )}
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[11px]">Columna de búsqueda (nombre)</Label>
                          {hasCols ? (
                            <Select
                              value={srcCfg.user_input_column || "__none__"}
                              onValueChange={(v) =>
                                patch(key, {
                                  ...srcCfg,
                                  user_input_column: v === "__none__" ? undefined : v,
                                })
                              }
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Columna nombre" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__none__">—</SelectItem>
                                {cols.map((c) => (
                                  <SelectItem key={c} value={c}>
                                    {c}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              className="h-8"
                              value={srcCfg.user_input_column ?? ""}
                              onChange={(e) =>
                                patch(key, {
                                  ...srcCfg,
                                  user_input_column: e.target.value || undefined,
                                })
                              }
                              placeholder="nombre"
                              disabled={!srcCfg.document_title}
                            />
                          )}
                        </div>
                        {hasCols && (
                          <p className="text-[10px] text-muted-foreground sm:col-span-2">
                            Columnas detectadas:{" "}
                            <code className="text-[10px]">{cols.join(", ")}</code>
                          </p>
                        )}
                      </>
                    );
                  })()}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
