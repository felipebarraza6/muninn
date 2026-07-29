import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Boxes,
  Check,
  Clock,
  FileText,
  Loader2,
  Pencil,
  RefreshCw,
  Save,
  Users,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  useKnowledge,
  useUpdateKnowledge,
  isKnowledgeIndexed,
  type AgentKnowledge,
} from "@/api/hooks/useKnowledge";
import {
  ContentRenderer,
  DataEditor,
  DataViewer,
  FaqEditor,
  UsagePanel,
  VectorsPanel,
  parseDataContent,
  rowsToGrid,
  type GridRow,
  type QAPair,
} from "@/components/agents/knowledge-content-viewer";
import { KnowledgeCronJobTab } from "@/components/knowledge/knowledge-cronjob-tab";
import { KNOWLEDGE_TYPE_LABEL, parseFaqPairs, serializeFaqPairs } from "@/lib/knowledge-types";
import { AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { toast } from "sonner";
import { apiErrorMessage } from "@/lib/apiError";

type TabId = "documento" | "vectores" | "uso" | "cronjob";

/** Estado de validación del cron job para el indicador visual. */
function cronJobStatus(config: ReturnType<typeof useKnowledge>["data"]) {
  if (!config) return "none"; // sin cron
  if (config.tested_ok === true) return "validated"; // test exitoso
  if (!config.external_api_id || !config.endpoint || !config.cron) return "incomplete";
  return "configured"; // campos completos pero sin test
}

/** Panel de variables del CronJob validado (se muestra en la pestaña Documento). */
function CronJobVariablesPanel({
  doc,
  onGoToCronJob,
}: {
  doc: AgentKnowledge;
  onGoToCronJob: () => void;
}) {
  const cfg = doc.api_refresh_config;
  if (!cfg || !cfg.external_api_id || !cfg.endpoint || !cfg.cron) return null;

  const vars = cfg.payload_variables || {};
  const varEntries = Object.entries(vars).filter(([, v]) => v.trim() !== "");
  const tested = cfg.tested_ok === true;
  const mapping = cfg.content_mapping;

  return (
    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-3.5 w-3.5 text-emerald-600" />
          <span
            className={["text-xs font-medium", tested ? "text-emerald-600" : "text-amber-600"].join(
              " ",
            )}
          >
            {tested ? "CronJob Validado" : "CronJob Configurado"}
          </span>
          <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-600">
            {cfg.cron}
          </Badge>
          {!tested && (
            <span className="text-[9px] text-muted-foreground">ejecuta test para validar</span>
          )}
        </div>
        <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={onGoToCronJob}>
          Ver config
        </Button>
      </div>
      <dl className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
        <div className="flex gap-1.5">
          <dt className="text-muted-foreground">Endpoint:</dt>
          <dd className="font-mono truncate max-w-[200px]">{cfg.endpoint}</dd>
        </div>
        {mapping?.type && (
          <div className="flex gap-1.5">
            <dt className="text-muted-foreground">Mapping:</dt>
            <dd>{mapping.type}</dd>
          </div>
        )}
        {mapping?.path && (
          <div className="flex gap-1.5">
            <dt className="text-muted-foreground">Path:</dt>
            <dd className="font-mono truncate max-w-[160px]">{mapping.path}</dd>
          </div>
        )}
        {mapping?.columns?.length ? (
          <div className="flex gap-1.5">
            <dt className="text-muted-foreground">Columnas:</dt>
            <dd className="font-mono truncate max-w-[200px]">{mapping.columns.join(", ")}</dd>
          </div>
        ) : null}
      </dl>
      {varEntries.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {varEntries.map(([key, val]) => (
            <Badge
              key={key}
              variant="outline"
              className="text-[10px] font-mono gap-1 px-1.5 py-0.5"
            >
              <span className="text-emerald-600">{key}</span>
              <span className="text-muted-foreground">=</span>
              <span>{val}</span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Detalle de conocimiento a página completa (sin modal).
 * Ver: documento / vectores / uso. Editar: título, contenido y auto-refresh.
 */
export default function ConocimientoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: doc, isLoading, error, refetch } = useKnowledge(id, { branch: undefined });
  const update = useUpdateKnowledge();

  const [tab, setTab] = useState<TabId>("documento");
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [faqPairs, setFaqPairs] = useState<QAPair[]>([{ question: "", answer: "" }]);
  const [dataColumns, setDataColumns] = useState<string[]>([]);
  const [dataRows, setDataRows] = useState<GridRow[]>([]);

  const type = doc?.knowledge_type ?? "DOCUMENT";
  const isData = type === "DATA";
  const isFaq = type === "FAQ";
  const saving = update.isPending;
  const indexed = doc ? isKnowledgeIndexed(doc) : false;

  const loadEditStateFromDoc = useCallback((current: AgentKnowledge) => {
    const docType = current.knowledge_type ?? "DOCUMENT";
    setEditTitle(current.title || "");
    setEditContent(current.content || "");
    if (docType === "FAQ") {
      setFaqPairs(parseFaqPairs(current.content));
    }
    if (docType === "DATA") {
      const grid = rowsToGrid(parseDataContent(current.content));
      setDataColumns(grid.columns.length ? grid.columns : ["columna_1"]);
      setDataRows(grid.rows.length ? grid.rows : [{ columna_1: "" }]);
    }
  }, []);

  // Si el doc llega con ?edit=1 o se pide editar sin datos cargados aún.
  useEffect(() => {
    if (doc && editing) loadEditStateFromDoc(doc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc]);

  const startEdit = () => {
    if (!doc) return;
    if (doc.api_refresh_config?.external_api_id && doc.api_refresh_config?.endpoint && doc.api_refresh_config?.cron) {
      toast.warning("El contenido lo gestiona el CronJob. Ve a la pestaña CronJob para configurarlo.");
      setTab("cronjob");
      return;
    }
    loadEditStateFromDoc(doc);
    setEditing(true);
  };

  const buildContent = (): string | null => {
    if (isFaq) {
      const body = serializeFaqPairs(faqPairs);
      if (!body.trim()) {
        toast.error("Agrega al menos una pregunta y respuesta");
        return null;
      }
      return body;
    }
    if (isData) {
      const clean = dataRows.filter((row) => dataColumns.some((c) => (row[c] ?? "").trim()));
      if (clean.length === 0) {
        toast.error("La tabla no tiene filas con datos");
        return null;
      }
      return JSON.stringify(
        clean.map((row) => {
          const obj: Record<string, string> = {};
          for (const c of dataColumns) obj[c] = row[c] ?? "";
          return obj;
        }),
      );
    }
    if (!editContent.trim()) {
      toast.error("El contenido es obligatorio");
      return null;
    }
    return editContent;
  };

  const handleSave = () => {
    if (!doc) return;
    if (!editTitle.trim()) {
      toast.error("El título es obligatorio");
      return;
    }
    const content = buildContent();
    if (content == null) return;

    update.mutate(
      {
        id: String(doc.id),
        data: { title: editTitle.trim(), content },
        branch: doc.branch,
      },
      {
        onSuccess: () => {
          toast.success(
            indexed
              ? "Guardado. Reindexa desde el agente para actualizar los vectores."
              : "Guardado. Se indexará al asignarlo a un agente.",
          );
          setEditing(false);
          void refetch();
        },
        onError: (e) => toast.error(apiErrorMessage(e, "No se pudo guardar")),
      },
    );
  };

  if (isLoading) {
    return (
      <AdminPageMotion className="px-4 md:px-6 lg:px-8 py-4">
        <PageSkeleton variant="detail" padded={false} />
      </AdminPageMotion>
    );
  }

  if (error || !doc) {
    return (
      <AdminPageMotion className="px-4 md:px-6 lg:px-8 py-4">
        <EmptyState
          title="No se pudo cargar el conocimiento"
          description="Puede haberse eliminado o no tienes acceso desde esta sucursal."
          action={
            <Button size="sm" variant="outline" onClick={() => navigate("/app/conocimiento")}>
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver al catálogo
            </Button>
          }
        />
      </AdminPageMotion>
    );
  }

  return (
    <AdminPageMotion className="flex flex-col gap-4 px-4 md:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1.5">
          <Button variant="ghost" size="sm" className="h-7 -ml-2 text-muted-foreground" asChild>
            <Link to="/app/conocimiento">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Conocimiento
            </Link>
          </Button>
          {editing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-lg font-semibold h-10 max-w-xl"
              placeholder="Título del documento"
            />
          ) : (
            <h1 className="text-xl font-semibold leading-tight truncate">{doc.title}</h1>
          )}
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="outline" className="text-[10px]">
              {KNOWLEDGE_TYPE_LABEL[type]}
            </Badge>
            {doc.category?.trim() ? (
              <Badge variant="outline" className="text-[10px] font-normal">
                {doc.category.trim()}
              </Badge>
            ) : null}
            {indexed && (
              <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                Indexado{doc.chunks_count ? ` · ${doc.chunks_count} fragmentos` : ""}
              </Badge>
            )}
            {doc.api_refresh_config && !editing ? (
              <Badge variant="outline" className="text-[10px] gap-1 border-primary/40 text-primary">
                <RefreshCw className="h-3 w-3" />
                Auto-refresh
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {editing ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={saving}
                onClick={() => setEditing(false)}
              >
                <X className="h-3.5 w-3.5 mr-1" /> Cancelar
              </Button>
              <Button type="button" size="sm" disabled={saving} onClick={handleSave}>
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5 mr-1" />
                )}
                Guardar
              </Button>
            </>
          ) : (() => {
            const hasCronJob = doc.api_refresh_config?.external_api_id && doc.api_refresh_config?.endpoint && doc.api_refresh_config?.cron;
            return hasCronJob ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => { setTab("cronjob"); }}
                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" /> CronJob activo
              </Button>
            ) : (
              <Button type="button" variant="outline" size="sm" onClick={startEdit}>
                <Pencil className="h-3.5 w-3.5 mr-1" /> Editar
              </Button>
            );
          })()}
        </div>
      </div>

      {editing ? (
        <div className="grid flex-1 min-h-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
          {/* Editor de contenido */}
          <div className="flex min-h-[60vh] flex-col gap-2 rounded-xl border border-border/70 bg-card/60 p-4">
            <Label className="text-xs text-muted-foreground">Contenido</Label>
            {isFaq ? (
              <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                <FaqEditor pairs={faqPairs} onChange={setFaqPairs} />
              </div>
            ) : isData ? (
              <DataEditor
                columns={dataColumns}
                rows={dataRows}
                onColumnsChange={setDataColumns}
                onRowsChange={setDataRows}
              />
            ) : (
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="flex-1 min-h-[320px] font-mono text-sm resize-none"
                placeholder="Escribe o pega el contenido…"
              />
            )}
          </div>

          <div className="lg:w-[320px]">
            <p className="text-[11px] text-muted-foreground">
              Para configurar actualización automática, usa la pestaña CronJob.
            </p>
          </div>
        </div>
      ) : (
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as TabId)}
          className="flex-1 min-h-0 flex flex-col"
        >
          <TabsList className="w-full sm:w-auto shrink-0">
            <TabsTrigger value="documento" className="gap-1.5 flex-1 sm:flex-none">
              <FileText className="h-3.5 w-3.5" />
              Documento
            </TabsTrigger>
            <TabsTrigger value="vectores" className="gap-1.5 flex-1 sm:flex-none">
              <Boxes className="h-3.5 w-3.5" />
              Vectores
              {indexed && doc.chunks_count != null && doc.chunks_count > 0 && (
                <Badge variant="secondary" className="ml-0.5 h-5 px-1.5 text-[10px] tabular-nums">
                  {doc.chunks_count}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="cronjob" className="gap-1.5 flex-1 sm:flex-none">
              <Clock className="h-3.5 w-3.5" />
              CronJob
              {(() => {
                const status = cronJobStatus(doc.api_refresh_config);
                if (status === "validated")
                  return <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />;
                if (status === "configured")
                  return <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />;
                if (status === "incomplete")
                  return <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />;
                return null;
              })()}
            </TabsTrigger>
            <TabsTrigger value="uso" className="gap-1.5 flex-1 sm:flex-none">
              <Users className="h-3.5 w-3.5" />
              Uso
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documento" className="flex-1 min-h-0 mt-3">
            {isData ? (
              <div className="flex h-full min-h-[60vh] flex-col gap-3 rounded-xl border border-border/70 bg-card/60 p-4">
                <CronJobVariablesPanel doc={doc} onGoToCronJob={() => setTab("cronjob")} />
                <DataViewer content={doc.content} />
              </div>
            ) : (
              <div className="h-full min-h-[60vh] overflow-y-auto rounded-xl border border-border/70 bg-card/60 p-5">
                <div className="mx-auto max-w-3xl space-y-4">
                  <CronJobVariablesPanel doc={doc} onGoToCronJob={() => setTab("cronjob")} />
                  <ContentRenderer doc={doc} />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="vectores" className="flex-1 min-h-0 mt-3">
            <div className="h-full min-h-[60vh] overflow-y-auto rounded-xl border border-border/70 bg-card/60 p-4">
              <VectorsPanel
                knowledgeId={String(doc.id)}
                enabled={tab === "vectores"}
                branchId={doc.branch}
              />
            </div>
          </TabsContent>

          <TabsContent value="cronjob" className="flex-1 min-h-0 mt-3 data-[state=inactive]:hidden" forceMount>
            <div className="h-full min-h-[60vh] overflow-y-auto rounded-xl">
              <KnowledgeCronJobTab
                value={doc.api_refresh_config ?? null}
                onChange={(next) => {
                  if (!doc) return;
                  const wasNull = !doc.api_refresh_config;
                  const isNull = !next;

                  const data: Partial<typeof doc> = {
                    title: doc.title,
                    content: doc.content,
                  };
                  if (next) data.api_refresh_config = next;
                  else data.api_refresh_config = null;

                  const showToast = wasNull || isNull;

                  update.mutate(
                    {
                      id: String(doc.id),
                      data,
                      branch: doc.branch,
                    },
                    {
                      onSuccess: () => {
                        if (showToast) {
                          toast.success(
                            isNull
                              ? "CronJob desactivado."
                              : "CronJob activado — se actualizará automáticamente.",
                          );
                        }
                        void refetch();
                      },
                      onError: (e) => toast.error(apiErrorMessage(e, "Error al guardar CronJob")),
                    },
                  );
                }}
                disabled={update.isPending}
                branch={doc.branch}
                knowledgeId={String(doc.id)}
                knowledgeType={doc.knowledge_type}
              />
            </div>
          </TabsContent>
          <TabsContent value="uso" className="flex-1 min-h-0 mt-3">
            <div className="h-full min-h-[60vh] overflow-y-auto rounded-xl border border-border/70 bg-card/60 p-4">
              <UsagePanel
                knowledgeId={String(doc.id)}
                enabled={tab === "uso"}
                usageCount={doc.usage_count}
                lastUsedAt={doc.last_used_at}
              />
            </div>
          </TabsContent>
        </Tabs>
      )}
    </AdminPageMotion>
  );
}
