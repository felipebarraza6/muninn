import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Loader2,
  FileText,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
  Boxes,
  Sparkles,
  Users,
  Bot,
} from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  useKnowledge,
  useKnowledgeChunks,
  useUpdateKnowledge,
  isKnowledgeIndexed,
  type ApiRefreshConfig,
  type KnowledgeType,
  type AgentKnowledge,
  type KnowledgeChunk,
} from "@/api/hooks/useKnowledge";
import { useAgents, type Agent } from "@/api/hooks/useAgents";
import { KNOWLEDGE_TYPE_LABEL, parseFaqPairs, serializeFaqPairs } from "@/lib/knowledge-types";
import {
  KnowledgeApiRefreshSection,
  cronLabel,
  mappingLabel,
} from "@/components/knowledge/knowledge-api-refresh-section";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { InlineSkeleton } from "@/components/ui/page-skeleton";

export type KnowledgeViewerContext = "catalog" | "agent";

interface KnowledgeContentViewerProps {
  knowledgeId: string;
  title: string;
  knowledgeType: KnowledgeType;
  /** `agent`: tab Vectores. `catalog` (default): tab Uso entre agentes. */
  context?: KnowledgeViewerContext;
  /** Sucursal del documento/agente (evita 404 por desajuste con x-branch-id). */
  branchId?: string | number | null;
}

function formatUsageDate(value?: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function agentsUsingKnowledge(agents: Agent[], knowledgeId: string): Agent[] {
  const id = String(knowledgeId);
  return agents.filter((a) =>
    (a.knowledge_documents ?? []).some((doc) => {
      if (doc == null) return false;
      if (typeof doc === "object" && doc !== null && "id" in (doc as object)) {
        return String((doc as { id: string | number }).id) === id;
      }
      return String(doc) === id;
    }),
  );
}

interface QAPair {
  question: string;
  answer: string;
}

export type { QAPair };

type GridRow = Record<string, string>;

export type { GridRow };

function parseQAContent(content?: string): QAPair[] {
  return parseFaqPairs(content).filter((p) => p.question || p.answer);
}

export function parseDataContent(content?: string): Record<string, unknown>[] {
  if (!content) return [];
  try {
    let parsed = JSON.parse(content.trim() || "[]");
    if (!Array.isArray(parsed)) parsed = [parsed];
    return parsed.filter(
      (row: unknown): row is Record<string, unknown> => Boolean(row) && typeof row === "object",
    );
  } catch {
    return [];
  }
}

function collectHeaders(rows: Record<string, unknown>[]): string[] {
  if (rows.length === 0) return [];
  const headers = Object.keys(rows[0]);
  const seen = new Set(headers);
  for (let i = 1; i < rows.length; i++) {
    for (const key of Object.keys(rows[i])) {
      if (!seen.has(key)) {
        seen.add(key);
        headers.push(key);
      }
    }
  }
  return headers;
}

function rowsToGrid(raw: Record<string, unknown>[]): { columns: string[]; rows: GridRow[] } {
  const columns = collectHeaders(raw);
  const rows = raw.map((r) => {
    const row: GridRow = {};
    for (const c of columns) row[c] = r[c] == null ? "" : String(r[c]);
    return row;
  });
  return { columns, rows };
}

export { rowsToGrid };

interface FunctionContent {
  function_id?: string;
  function_slug?: string;
  slug?: string;
  function_name?: string;
  name?: string;
  when_to_use?: string;
  examples?: string[];
}

function parseFunctionContent(content?: string): FunctionContent | null {
  if (!content) return null;
  try {
    return JSON.parse(content) as FunctionContent;
  } catch {
    return null;
  }
}

function ParagraphViewer({ content }: { content?: string }) {
  return (
    <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
      {content || "Sin contenido."}
    </div>
  );
}

function FAQViewer({ content }: { content?: string }) {
  const pairs = parseQAContent(content);

  if (pairs.length === 0) {
    return <ParagraphViewer content={content} />;
  }

  return (
    <div className="space-y-6">
      {pairs.map((pair, idx) => (
        <div key={idx} className="space-y-2">
          <div className="font-medium text-sm text-foreground">{pair.question}</div>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed pl-3 border-l-2 border-primary/30">
            {pair.answer}
          </div>
        </div>
      ))}
    </div>
  );
}

export function DataViewer({ content }: { content?: string }) {
  const rows = useMemo(() => parseDataContent(content), [content]);
  const headers = useMemo(() => collectHeaders(rows), [rows]);

  if (rows.length === 0) {
    return <ParagraphViewer content={content} />;
  }

  return (
    <div className="flex flex-col gap-2 min-h-0 flex-1">
      <p className="shrink-0 text-[11px] text-muted-foreground px-1">
        {rows.length} fila{rows.length === 1 ? "" : "s"} · {headers.length} columna
        {headers.length === 1 ? "" : "s"} · desplázate en cualquier dirección
      </p>
      <div className="flex-1 min-h-0 overflow-auto rounded-md border border-border bg-background shadow-inner">
        <table className="border-collapse text-xs w-max min-w-full">
          <thead className="sticky top-0 z-20">
            <tr>
              <th className="sticky left-0 z-30 w-10 min-w-10 bg-muted border-b border-r border-border px-1 py-1.5 font-medium text-muted-foreground text-center">
                #
              </th>
              {headers.map((header) => (
                <th
                  key={header}
                  className="bg-muted border-b border-r border-border px-3 py-1.5 text-left font-semibold whitespace-nowrap min-w-[120px] max-w-[280px]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-muted/30">
                <td className="sticky left-0 z-10 w-10 min-w-10 bg-muted/80 border-b border-r border-border px-1 py-1.5 text-center text-[10px] text-muted-foreground tabular-nums">
                  {idx + 1}
                </td>
                {headers.map((header) => (
                  <td
                    key={header}
                    className="border-b border-r border-border px-3 py-1.5 whitespace-nowrap max-w-[280px] truncate"
                    title={String(row[header] ?? "")}
                  >
                    {row[header] == null || row[header] === "" ? "—" : String(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FunctionViewer({ content }: { content?: string }) {
  const data = parseFunctionContent(content);

  if (!data) {
    return <ParagraphViewer content={content} />;
  }

  const name = data.function_name || data.name || "Función";
  const slug = data.function_slug || data.slug || "—";
  const examples = (data.examples || []).filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="font-medium">{name}</div>
        <div className="text-xs text-muted-foreground font-mono">{slug}</div>
      </div>
      {data.when_to_use && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Cuándo usar
          </div>
          <div className="text-sm whitespace-pre-wrap leading-relaxed">{data.when_to_use}</div>
        </div>
      )}
      {examples.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Ejemplos de activación
          </div>
          <ul className="space-y-1.5">
            {examples.map((example, idx) => (
              <li key={idx} className="text-sm pl-3 border-l-2 border-primary/30">
                {example}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function EmbeddingSparkline({ values }: { values: number[] }) {
  if (values.length === 0) return null;
  const max = Math.max(...values.map((v) => Math.abs(v)), 0.0001);
  return (
    <div className="flex items-end gap-px h-8 w-full max-w-md">
      {values.map((v, i) => {
        const h = Math.max(4, Math.round((Math.abs(v) / max) * 100));
        return (
          <span
            key={i}
            title={String(v)}
            className={cn(
              "flex-1 min-w-[2px] rounded-sm",
              v >= 0 ? "bg-primary/70" : "bg-amber-400/70",
            )}
            style={{ height: `${h}%` }}
          />
        );
      })}
    </div>
  );
}

function ChunkCard({ chunk, total }: { chunk: KnowledgeChunk; total: number }) {
  return (
    <article className="rounded-lg border border-border bg-card/50 overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/30 px-3 py-2">
        <span className="flex h-6 min-w-6 items-center justify-center rounded-md bg-primary/15 px-1.5 text-[11px] font-semibold text-primary tabular-nums">
          #{chunk.order + 1}
        </span>
        <span className="text-[11px] text-muted-foreground">
          Fragmento {chunk.order + 1} de {total}
        </span>
        <span className="text-[11px] text-muted-foreground tabular-nums">
          · {chunk.char_count} caracteres
        </span>
        <div className="ml-auto">
          {chunk.has_embedding ? (
            <Badge
              variant="outline"
              className="gap-1 border-emerald-500/40 bg-emerald-500/10 text-[10px] text-emerald-500"
            >
              <Sparkles className="h-3 w-3" />
              Vector {chunk.dimensions}d
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] text-muted-foreground">
              Sin vector
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-3 p-3 lg:grid-cols-2">
        <div className="space-y-1.5 min-w-0">
          <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Texto del fragmento
          </div>
          <div className="rounded-md border border-border/60 bg-background/70 p-2.5 whitespace-pre-wrap text-xs leading-relaxed text-foreground/90 max-h-48 overflow-auto">
            {chunk.content || "—"}
          </div>
        </div>

        <div className="space-y-1.5 min-w-0">
          <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Embedding generado
          </div>
          {chunk.has_embedding ? (
            <div className="rounded-md border border-border/60 bg-background/70 p-2.5 space-y-2.5">
              <p className="text-[11px] text-muted-foreground leading-snug">
                Este texto se pasó por el modelo de embeddings y quedó como un vector de{" "}
                <span className="text-foreground/80 tabular-nums font-medium">
                  {chunk.dimensions}
                </span>{" "}
                números. Así el agente puede comparar semánticamente tu pregunta con este fragmento.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
                <span>
                  Dimensiones:{" "}
                  <span className="text-foreground/80 tabular-nums">{chunk.dimensions}</span>
                </span>
                {chunk.norm != null && (
                  <span>
                    Norma (magnitud):{" "}
                    <span className="text-foreground/80 tabular-nums">{chunk.norm}</span>
                  </span>
                )}
              </div>
              {chunk.preview.length > 0 && (
                <>
                  <div className="space-y-1">
                    <div className="text-[10px] text-muted-foreground">
                      Vista del vector (primeros {chunk.preview.length} valores)
                    </div>
                    <EmbeddingSparkline values={chunk.preview} />
                  </div>
                  <div className="font-mono text-[10px] leading-relaxed text-muted-foreground break-all">
                    [{chunk.preview.join(", ")}
                    {chunk.dimensions > chunk.preview.length ? ", …" : ""}]
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-border/60 bg-muted/20 p-2.5 text-[11px] text-muted-foreground leading-snug">
              Este fragmento se creó, pero no tiene vector. Reindexa el documento o revisa el modelo
              de embedding de la sucursal.
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function UsagePanel({
  knowledgeId,
  enabled,
  usageCount,
  lastUsedAt,
}: {
  knowledgeId: string;
  enabled: boolean;
  usageCount?: number;
  lastUsedAt?: string;
}) {
  const { data: agents = [], isLoading } = useAgents();
  const assigned = useMemo(
    () => (enabled ? agentsUsingKnowledge(agents, knowledgeId) : []),
    [agents, enabled, knowledgeId],
  );
  const lastUsedLabel = formatUsageDate(lastUsedAt);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Cargando uso…</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-md border border-border/70 bg-muted/20 px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Usos en RAG
          </div>
          <div className="text-sm font-medium mt-0.5 tabular-nums">
            {usageCount != null ? usageCount : "—"}
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
            Veces que el documento aportó contexto en consultas.
          </p>
        </div>
        <div className="rounded-md border border-border/70 bg-muted/20 px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Último uso
          </div>
          <div className="text-sm font-medium mt-0.5">{lastUsedLabel ?? "—"}</div>
          <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
            Última vez que se recuperó en una conversación.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium">Agentes que lo usan</p>
          <Badge variant="secondary" className="h-5 px-1.5 text-[10px] tabular-nums">
            {assigned.length}
          </Badge>
        </div>

        {assigned.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-10 text-center text-muted-foreground px-4">
            <Bot className="h-8 w-8 opacity-40" />
            <p className="text-sm">Aún no está asignado a ningún agente.</p>
            <p className="text-xs max-w-sm">
              Los vectores se generan al asignarlo en el panel RAG de un agente.
            </p>
          </div>
        ) : (
          <ul className="space-y-1.5">
            {assigned.map((agent) => (
              <li key={String(agent.id)}>
                <Link
                  to={`/agentes/${agent.id}`}
                  className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-background/60 px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-primary-soft/10"
                >
                  <div className="h-8 w-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{agent.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {[agent.embedding_model, agent.llm_model_name]
                        .filter(Boolean)
                        .map(String)
                        .join(" · ") || "Sin modelo de embedding indicado"}
                    </div>
                  </div>
                  {agent.use_rag === false && (
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      RAG off
                    </Badge>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function VectorsPanel({
  knowledgeId,
  enabled,
  branchId,
}: {
  knowledgeId: string;
  enabled: boolean;
  indexed?: boolean;
  branchId?: string | number | null;
}) {
  // Siempre pedir chunks al abrir: is_indexed puede decir "ok" sin embeddings reales.
  const { data, isLoading } = useKnowledgeChunks(knowledgeId, enabled, {
    branch: branchId,
  });

  const chunks = data?.chunks ?? [];
  const count = data?.count ?? 0;
  const dimensions = data?.dimensions ?? 0;
  const withEmbedding = chunks.filter((c) => c.has_embedding).length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Cargando vectores…</span>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground px-4">
        <Boxes className="h-8 w-8 opacity-40" />
        <p className="text-sm">No hay fragmentos ni vectores generados.</p>
        <p className="text-xs max-w-sm">
          Usa Reindexar en el panel RAG. Verás «Generando vectores…» en la lista y te avisamos
          cuando termine.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {withEmbedding === 0 && (
        <div className="rounded-lg border border-warning/40 bg-warning-soft/40 px-3 py-2.5 text-[12px] text-muted-foreground">
          Hay {count} fragmento{count === 1 ? "" : "s"}, pero <strong>aún no hay vectores</strong>.
          Reindexa de nuevo o revisa el modelo de embedding de la sucursal.
        </div>
      )}
      <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-3">
        <div className="flex items-start gap-2.5">
          <Sparkles className="h-4 w-4 shrink-0 text-primary mt-0.5" />
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium">Cómo se generaron estos vectores</p>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Al indexar, el sistema cortó el documento en fragmentos (~512 tokens con solape) y
              convirtió cada uno en un embedding. Abajo ves <strong>todos</strong> los fragments
              creados y el vector asociado a cada uno.
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-md border border-border/70 bg-background/60 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              1. Dividir
            </div>
            <div className="text-xs font-medium mt-0.5">
              {count} fragmento{count === 1 ? "" : "s"}
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
              El texto largo se parte en trozos manejables.
            </p>
          </div>
          <div className="rounded-md border border-border/70 bg-background/60 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              2. Embeddings
            </div>
            <div className="text-xs font-medium mt-0.5">
              {withEmbedding}/{count} con vector
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
              Cada trozo se transforma en números.
            </p>
          </div>
          <div className="rounded-md border border-border/70 bg-background/60 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              3. Dimensiones
            </div>
            <div className="text-xs font-medium mt-0.5 tabular-nums">{dimensions || "—"}d</div>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
              Tamaño de cada vector (p. ej. 1536).
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="text-xs font-medium text-foreground/90 px-0.5">
          Todos los vectores generados
        </h4>
        <p className="text-[11px] text-muted-foreground px-0.5 leading-snug">
          Izquierda: el texto que quedó en el índice. Derecha: cómo quedó convertido a vector.
        </p>
      </div>

      <div className="space-y-2.5">
        {chunks.map((chunk) => (
          <ChunkCard key={chunk.id} chunk={chunk} total={count} />
        ))}
      </div>
    </div>
  );
}

export function ContentRenderer({ doc }: { doc: AgentKnowledge }) {
  switch (doc.knowledge_type) {
    case "FAQ":
      return <FAQViewer content={doc.content} />;
    case "DATA":
      return <DataViewer content={doc.content} />;
    case "FUNCTION":
      return <FunctionViewer content={doc.content} />;
    default:
      return <ParagraphViewer content={doc.content} />;
  }
}

/** Panel solo-lectura con la config de auto-refresh (cron → API → reindex). */
export function AutoRefreshInfoPanel({ doc }: { doc: AgentKnowledge }) {
  const cfg = doc.api_refresh_config;
  if (!cfg) return null;
  const mapping = cfg.content_mapping;
  return (
    <section className="rounded-lg border border-primary/25 bg-primary/5 p-3 space-y-2">
      <div className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4 text-primary shrink-0" />
        <p className="text-sm font-medium">Auto-refresh desde API</p>
        <Badge variant="outline" className="text-[10px] border-primary/40 text-primary">
          {cronLabel(cfg.cron) || cfg.cron}
        </Badge>
      </div>
      <dl className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2 text-[12px]">
        <div className="flex gap-1.5">
          <dt className="text-muted-foreground shrink-0">Endpoint:</dt>
          <dd className="font-mono truncate">{cfg.endpoint || "—"}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="text-muted-foreground shrink-0">Mapping:</dt>
          <dd>{mappingLabel(mapping?.type) || "—"}</dd>
        </div>
        {mapping?.path ? (
          <div className="flex gap-1.5">
            <dt className="text-muted-foreground shrink-0">Path:</dt>
            <dd className="font-mono truncate">{mapping.path}</dd>
          </div>
        ) : null}
        {mapping?.columns?.length ? (
          <div className="flex gap-1.5 sm:col-span-2">
            <dt className="text-muted-foreground shrink-0">Columnas:</dt>
            <dd className="font-mono truncate">{mapping.columns.join(", ")}</dd>
          </div>
        ) : null}
      </dl>
      <p className="text-[11px] text-muted-foreground leading-snug">
        El contenido se regenera solo desde la API (ciclo de 1 h). Si no hay cambios, no se
        re-indexa. Evita editar el contenido a mano.
      </p>
    </section>
  );
}

/** Editor de tabla DATA (celdas + columnas renombrables + filas). */
export function DataEditor({
  columns,
  rows,
  onColumnsChange,
  onRowsChange,
}: {
  columns: string[];
  rows: GridRow[];
  onColumnsChange: (cols: string[]) => void;
  onRowsChange: (rows: GridRow[]) => void;
}) {
  const renameColumn = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName) return;
    let final = trimmed;
    if (columns.includes(final) && final !== oldName) {
      let i = 2;
      while (columns.includes(`${trimmed}_${i}`)) i += 1;
      final = `${trimmed}_${i}`;
    }
    onColumnsChange(columns.map((c) => (c === oldName ? final : c)));
    onRowsChange(
      rows.map((row) => {
        const next = { ...row };
        next[final] = next[oldName] ?? "";
        delete next[oldName];
        return next;
      }),
    );
  };

  const addColumn = () => {
    let name = "nueva_columna";
    let i = 2;
    while (columns.includes(name)) {
      name = `nueva_columna_${i}`;
      i += 1;
    }
    onColumnsChange([...columns, name]);
    onRowsChange(rows.map((r) => ({ ...r, [name]: "" })));
  };

  const removeColumn = (name: string) => {
    if (columns.length <= 1) {
      toast.error("Debe quedar al menos una columna");
      return;
    }
    onColumnsChange(columns.filter((c) => c !== name));
    onRowsChange(
      rows.map((row) => {
        const next = { ...row };
        delete next[name];
        return next;
      }),
    );
  };

  const addRow = () => {
    const empty: GridRow = {};
    for (const c of columns) empty[c] = "";
    onRowsChange([...rows, empty]);
  };

  const removeRow = (idx: number) => {
    if (rows.length <= 1) {
      toast.error("Debe quedar al menos una fila");
      return;
    }
    onRowsChange(rows.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-2 min-h-0 flex-1">
      <div className="shrink-0 flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={addColumn}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Columna
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Fila
        </Button>
      </div>
      <div className="flex-1 min-h-0 overflow-auto rounded-md border border-border bg-background shadow-inner">
        <table className="border-collapse text-xs w-max min-w-full">
          <thead className="sticky top-0 z-20">
            <tr>
              <th className="sticky left-0 z-30 w-10 min-w-10 bg-muted border-b border-r border-border" />
              {columns.map((col) => (
                <th
                  key={col}
                  className="bg-muted border-b border-r border-border p-1 min-w-[140px]"
                >
                  <div className="flex items-center gap-0.5">
                    <Input
                      defaultValue={col}
                      key={`edit-hdr-${col}`}
                      className="h-7 text-xs font-semibold border-0 bg-transparent shadow-none focus-visible:ring-1"
                      onBlur={(e) => renameColumn(col, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => removeColumn(col)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </th>
              ))}
              <th className="bg-muted border-b border-border w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx}>
                <td className="sticky left-0 z-10 bg-muted/80 border-b border-r border-border text-center text-[10px] text-muted-foreground tabular-nums px-1">
                  {rIdx + 1}
                </td>
                {columns.map((col) => (
                  <td key={col} className="border-b border-r border-border p-0">
                    <input
                      value={row[col] ?? ""}
                      onChange={(e) => {
                        const next = rows.map((r, i) =>
                          i === rIdx ? { ...r, [col]: e.target.value } : r,
                        );
                        onRowsChange(next);
                      }}
                      className="w-full h-8 bg-transparent px-2 text-xs outline-none focus:bg-primary/5"
                    />
                  </td>
                ))}
                <td className="border-b border-border p-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removeRow(rIdx)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function FaqEditor({
  pairs,
  onChange,
}: {
  pairs: QAPair[];
  onChange: (pairs: QAPair[]) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...pairs, { question: "", answer: "" }])}
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> Añadir par
        </Button>
      </div>
      {pairs.map((pair, idx) => (
        <div key={idx} className="rounded-lg border p-3 space-y-2 bg-muted/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Par {idx + 1}</span>
            {pairs.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => onChange(pairs.filter((_, i) => i !== idx))}
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
                onChange(pairs.map((p, i) => (i === idx ? { ...p, question: e.target.value } : p)))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Respuesta</Label>
            <Textarea
              rows={3}
              value={pair.answer}
              onChange={(e) =>
                onChange(pairs.map((p, i) => (i === idx ? { ...p, answer: e.target.value } : p)))
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function KnowledgeContentViewer({
  knowledgeId,
  title,
  knowledgeType,
  context = "catalog",
  branchId,
}: KnowledgeContentViewerProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [viewTab, setViewTab] = useState<"documento" | "vectores" | "uso">("documento");
  const showVectors = context === "agent";
  const secondaryTab = showVectors ? "vectores" : "uso";
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [faqPairs, setFaqPairs] = useState<QAPair[]>([{ question: "", answer: "" }]);
  const [dataColumns, setDataColumns] = useState<string[]>([]);
  const [dataRows, setDataRows] = useState<GridRow[]>([]);
  const [editApiRefresh, setEditApiRefresh] = useState<ApiRefreshConfig | null>(null);

  const {
    data: doc,
    isLoading,
    error,
    refetch,
  } = useKnowledge(open ? knowledgeId : undefined, { branch: branchId ?? undefined });
  const update = useUpdateKnowledge();

  const type = doc?.knowledge_type ?? knowledgeType;
  const isData = type === "DATA";
  const isFaq = type === "FAQ";
  const saving = update.isPending;
  const indexed = doc ? isKnowledgeIndexed(doc) : false;

  const loadEditStateFromDoc = useCallback(
    (current: AgentKnowledge) => {
      const docType = current.knowledge_type ?? knowledgeType;
      setEditTitle(current.title || "");
      setEditContent(current.content || "");
      setEditApiRefresh(current.api_refresh_config ?? null);
      if (docType === "FAQ") {
        setFaqPairs(parseFaqPairs(current.content));
      }
      if (docType === "DATA") {
        const grid = rowsToGrid(parseDataContent(current.content));
        setDataColumns(grid.columns.length ? grid.columns : ["columna_1"]);
        setDataRows(grid.rows.length ? grid.rows : [{ columna_1: "" }]);
      }
    },
    [knowledgeType],
  );

  useEffect(() => {
    if (!doc || editing) return;
    if ((doc.knowledge_type ?? knowledgeType) === "FAQ") {
      setFaqPairs(parseFaqPairs(doc.content));
    }
  }, [doc, editing, knowledgeType]);

  useEffect(() => {
    if (!open) setViewTab("documento");
  }, [open]);

  const startEdit = () => {
    if (!doc) return;
    loadEditStateFromDoc(doc);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
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
        // Con auto-refresh la tabla la genera la API en el próximo ciclo.
        if (editApiRefresh) return doc?.content ?? "";
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
      if (editApiRefresh) return doc?.content ?? "";
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
    if (editApiRefresh) {
      if (!editApiRefresh.external_api_id) {
        toast.error("Selecciona la External API para el auto-refresh");
        return;
      }
      if (!editApiRefresh.endpoint) {
        toast.error("Selecciona el endpoint para el auto-refresh");
        return;
      }
    }
    const content = buildContent();
    if (content == null) return;

    update.mutate(
      {
        id: String(doc.id),
        data: {
          title: editTitle.trim(),
          content,
          api_refresh_config: editApiRefresh,
        },
        branch: branchId ?? doc.branch,
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
        onError: () => toast.error("No se pudo guardar"),
      },
    );
  };

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) {
      setEditing(false);
      setViewTab("documento");
      setFaqPairs([{ question: "", answer: "" }]);
      setEditTitle("");
      setEditContent("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5">
          <Eye className="h-3.5 w-3.5" />
          Ver
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "p-0 gap-0 rounded-lg flex flex-col overflow-hidden",
          isData || editing || !isLoading
            ? "w-full max-w-full h-[100dvh] max-h-[100dvh] sm:w-[min(96vw,1400px)] sm:max-w-[min(96vw,1400px)] sm:h-[85vh] sm:max-h-[85vh] sm:rounded-lg"
            : "w-full max-w-3xl max-h-[100dvh] sm:max-h-[85vh]",
        )}
      >
        <DialogHeader className="p-5 pb-3 shrink-0 border-b">
          <div className="flex items-start justify-between gap-3 pr-8">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle className="text-base truncate">
                  {editing ? "Editar conocimiento" : title}
                </DialogTitle>
                <Badge variant="outline" className="text-[10px]">
                  {KNOWLEDGE_TYPE_LABEL[type]}
                </Badge>
                {doc?.api_refresh_config && !editing ? (
                  <Badge
                    variant="outline"
                    className="text-[10px] gap-1 border-primary/40 text-primary"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Auto-refresh
                  </Badge>
                ) : null}
              </div>
              <DialogDescription>
                {editing
                  ? indexed
                    ? "Al guardar, reindexa desde el agente para actualizar el RAG."
                    : "Se indexará al asignarlo a un agente."
                  : viewTab === "vectores"
                    ? "Fragmentos y embeddings generados al indexar."
                    : isData
                      ? "Tabla de datos · desplázate en horizontal y vertical."
                      : "Contenido del documento en la biblioteca."}
              </DialogDescription>
            </div>
            {!isLoading && doc && !error && (
              <div className="flex items-center gap-1.5 shrink-0">
                {editing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={saving}
                      onClick={cancelEdit}
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Cancelar
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
                ) : (
                  <Button type="button" variant="outline" size="sm" onClick={startEdit}>
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Editar
                  </Button>
                )}
              </div>
            )}
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-1 flex-col gap-3 p-4 py-8">
            <InlineSkeleton lines={6} className="py-0" />
          </div>
        ) : error || !doc ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-destructive flex-1">
            <FileText className="h-8 w-8 opacity-50" />
            <span className="text-sm">No se pudo cargar el contenido.</span>
          </div>
        ) : editing ? (
          <div className="flex-1 min-h-0 flex flex-col gap-3 p-4 overflow-hidden">
            <div className="shrink-0 space-y-1.5">
              <Label className="text-xs">Título</Label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            {isFaq ? (
              <ScrollArea className="flex-1 min-h-0">
                <FaqEditor pairs={faqPairs} onChange={setFaqPairs} />
              </ScrollArea>
            ) : isData ? (
              <DataEditor
                columns={dataColumns}
                rows={dataRows}
                onColumnsChange={setDataColumns}
                onRowsChange={setDataRows}
              />
            ) : (
              <div className="flex-1 min-h-0 flex flex-col gap-1.5">
                <Label className="text-xs">Contenido</Label>
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 min-h-[280px] font-mono text-sm resize-none"
                />
              </div>
            )}
            <div className="shrink-0 max-h-[46vh] overflow-y-auto pr-1">
              <KnowledgeApiRefreshSection
                value={editApiRefresh}
                onChange={setEditApiRefresh}
                disabled={saving}
                branch={branchId ?? doc.branch}
              />
            </div>
          </div>
        ) : (
          <Tabs
            value={viewTab === "documento" ? "documento" : secondaryTab}
            onValueChange={(v) => setViewTab(v as "documento" | "vectores" | "uso")}
            className="flex-1 min-h-0 flex flex-col overflow-hidden"
          >
            <div className="shrink-0 px-4 pt-3">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="documento" className="gap-1.5 flex-1 sm:flex-none">
                  <FileText className="h-3.5 w-3.5" />
                  Documento
                </TabsTrigger>
                {showVectors ? (
                  <TabsTrigger value="vectores" className="gap-1.5 flex-1 sm:flex-none">
                    <Boxes className="h-3.5 w-3.5" />
                    Vectores
                    {indexed && doc.chunks_count != null && doc.chunks_count > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-0.5 h-5 px-1.5 text-[10px] tabular-nums"
                      >
                        {doc.chunks_count}
                      </Badge>
                    )}
                  </TabsTrigger>
                ) : (
                  <TabsTrigger value="uso" className="gap-1.5 flex-1 sm:flex-none">
                    <Users className="h-3.5 w-3.5" />
                    Uso
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            <TabsContent
              value="documento"
              className="flex-1 min-h-0 mt-0 overflow-hidden data-[state=inactive]:hidden"
            >
              {isData ? (
                <div className="h-full flex flex-col gap-3 p-4 pt-3">
                  {doc.api_refresh_config ? <AutoRefreshInfoPanel doc={doc} /> : null}
                  <DataViewer content={doc.content} />
                </div>
              ) : (
                <ScrollArea className="h-full px-6 pb-6">
                  <div className="pr-4 pt-3 space-y-4">
                    {doc.api_refresh_config ? <AutoRefreshInfoPanel doc={doc} /> : null}
                    <ContentRenderer doc={doc} />
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            {showVectors ? (
              <TabsContent
                value="vectores"
                className="flex-1 min-h-0 mt-0 overflow-hidden data-[state=inactive]:hidden"
              >
                <ScrollArea className="h-full px-4 pb-4">
                  <div className="pt-3">
                    <VectorsPanel
                      knowledgeId={String(doc.id)}
                      enabled={open && viewTab === "vectores"}
                      branchId={branchId ?? doc.branch}
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
            ) : (
              <TabsContent
                value="uso"
                className="flex-1 min-h-0 mt-0 overflow-hidden data-[state=inactive]:hidden"
              >
                <ScrollArea className="h-full px-4 pb-4">
                  <div className="pt-3">
                    <UsagePanel
                      knowledgeId={String(doc.id)}
                      enabled={open && viewTab === "uso"}
                      usageCount={doc.usage_count}
                      lastUsedAt={doc.last_used_at}
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
            )}
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
