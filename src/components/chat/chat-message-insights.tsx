import { useCallback, useMemo, useState } from "react";
import {
  ArrowRight,
  Boxes,
  ChevronDown,
  ChevronRight,
  Database,
  Sparkles,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface RagSourceDetail {
  id?: string;
  name?: string;
  title?: string;
  content?: string;
  summary?: string;
  source?: string;
  source_app?: string;
  knowledge_type?: string;
  score?: number;
  similarity?: number;
  distance?: number;
  chunk_id?: string | number;
  chunk_index?: number;
  order?: number;
  metadata?: Record<string, unknown>;
}

export interface ToolCallDetail {
  id?: string;
  name?: string;
  arguments?: string | Record<string, unknown>;
  function?: { name?: string; arguments?: string };
}

export interface ToolResultDetail {
  tool_call_id?: string;
  name?: string;
  content?: string;
}

function prettyJson(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") {
    const trimmed = value.trim();
    try {
      return JSON.stringify(JSON.parse(trimmed), null, 2);
    } catch {
      return value;
    }
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function sourceTitle(src: RagSourceDetail): string {
  return src.title || src.name || "Documento sin título";
}

function toolName(call: ToolCallDetail): string {
  return call.function?.name || call.name || "función";
}

function toolArguments(call: ToolCallDetail): string {
  return prettyJson(call.function?.arguments ?? call.arguments ?? "");
}

/** Normaliza score a 0–1 para barras (soporta similarity, score o distance invertida). */
export function normalizeRagScore(src: RagSourceDetail): number | undefined {
  if (typeof src.similarity === "number" && Number.isFinite(src.similarity)) {
    return Math.max(0, Math.min(1, src.similarity));
  }
  if (typeof src.score === "number" && Number.isFinite(src.score)) {
    const s = src.score;
    if (s >= 0 && s <= 1) return s;
    if (s > 1 && s <= 100) return s / 100;
    return Math.max(0, Math.min(1, s));
  }
  if (typeof src.distance === "number" && Number.isFinite(src.distance)) {
    return Math.max(0, Math.min(1, 1 / (1 + Math.max(0, src.distance))));
  }
  return undefined;
}

function scoreLabel(src: RagSourceDetail): string {
  if (typeof src.similarity === "number") return src.similarity.toFixed(3);
  if (typeof src.score === "number") return src.score.toFixed(3);
  if (typeof src.distance === "number") return `d=${src.distance.toFixed(3)}`;
  return "—";
}

function chunkLabel(src: RagSourceDetail, index: number): string {
  if (src.chunk_index != null) return `Chunk #${Number(src.chunk_index) + 1}`;
  if (src.order != null) return `Chunk #${Number(src.order) + 1}`;
  if (src.chunk_id != null) return `Chunk ${src.chunk_id}`;
  return `Fuente #${index + 1}`;
}

function ScoreBar({ value, rank }: { value?: number; rank: number }) {
  const pct = value != null ? Math.round(value * 100) : 0;
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500"
          style={{
            width: `${pct}%`,
            opacity: Math.max(0.35, 1 - rank * 0.12),
          }}
        />
      </div>
      <span className="text-[10px] font-mono tabular-nums text-muted-foreground w-8 text-right">
        {value != null ? `${pct}%` : "—"}
      </span>
    </div>
  );
}

function RagPipeline({ chunkCount }: { chunkCount: number }) {
  const steps = [
    { key: "q", label: "Consulta", hint: "Mensaje del usuario" },
    { key: "e", label: "Embedding", hint: "Vector de búsqueda" },
    { key: "r", label: "Retrieve", hint: `${chunkCount} chunk${chunkCount === 1 ? "" : "s"}` },
    { key: "g", label: "Respuesta", hint: "LLM + contexto" },
  ];

  return (
    <div className="flex items-stretch gap-1 sm:gap-1.5 mb-2">
      {steps.map((step, i) => (
        <div key={step.key} className="contents">
          <div className="flex-1 min-w-0 rounded-md border border-primary/20 bg-background/70 px-1.5 py-1.5 text-center">
            <div className="text-[10px] font-semibold text-primary leading-tight">{step.label}</div>
            <div className="text-[9px] text-muted-foreground truncate leading-tight mt-0.5">
              {step.hint}
            </div>
          </div>
          {i < steps.length - 1 && (
            <ArrowRight className="h-3 w-3 shrink-0 self-center text-primary/50" />
          )}
        </div>
      ))}
    </div>
  );
}

function SimilarityChart({ sources }: { sources: RagSourceDetail[] }) {
  const rows = useMemo(
    () =>
      sources.map((src, i) => ({
        src,
        score: normalizeRagScore(src),
        rank: i,
      })),
    [sources],
  );
  const max = Math.max(...rows.map((r) => r.score ?? 0), 0.001);

  return (
    <div className="rounded-md border border-border/60 bg-muted/30 p-2 space-y-1.5 mb-2">
      <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
        <Sparkles className="h-3 w-3 text-primary" />
        Similitud por chunk (embedding)
      </div>
      <div className="flex items-end gap-1 h-16 px-0.5">
        {rows.map(({ src, score, rank }) => {
          const h = score != null ? Math.max(8, Math.round((score / max) * 100)) : 8;
          return (
            <div
              key={src.id ?? rank}
              className="flex-1 min-w-0 flex flex-col items-center justify-end gap-0.5 h-full"
              title={`${sourceTitle(src)} · ${scoreLabel(src)}`}
            >
              <span className="text-[8px] font-mono text-muted-foreground tabular-nums">
                {score != null ? score.toFixed(2) : "—"}
              </span>
              <div
                className="w-full max-w-[28px] rounded-t-sm bg-primary/80"
                style={{ height: `${h}%`, opacity: Math.max(0.4, 1 - rank * 0.1) }}
              />
              <span className="text-[8px] text-muted-foreground tabular-nums">#{rank + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MessageInsights({
  ragSources,
  toolCalls,
  toolResults,
  defaultOpen = false,
}: {
  ragSources: RagSourceDetail[];
  toolCalls: ToolCallDetail[];
  toolResults: ToolResultDetail[];
  defaultOpen?: boolean;
}) {
  const [openRag, setOpenRag] = useState(defaultOpen);
  const [openTools, setOpenTools] = useState(false);

  const resultFor = useCallback(
    (call: ToolCallDetail, index: number): ToolResultDetail | undefined => {
      if (call.id) {
        const byId = toolResults.find((r) => r.tool_call_id === call.id);
        if (byId) return byId;
      }
      const name = toolName(call);
      const byName = toolResults.filter((r) => r.name === name);
      if (byName.length === 1) return byName[0];
      return toolResults[index];
    },
    [toolResults],
  );

  const hasRag = ragSources.length > 0;
  const hasTools = toolCalls.length > 0;
  if (!hasRag && !hasTools) return null;

  return (
    <div className="space-y-1.5">
      {hasRag && (
        <div className="rounded-lg border border-primary/25 bg-primary-soft/30 overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenRag((v) => !v)}
            className="w-full flex items-center gap-1.5 px-2.5 py-2 text-[11px] font-medium text-primary hover:bg-primary-soft/50 transition-colors"
          >
            {openRag ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            <Database className="h-3.5 w-3.5" />
            <span className="flex-1 text-left">
              RAG · {ragSources.length} chunk{ragSources.length === 1 ? "" : "s"} recuperado
              {ragSources.length === 1 ? "" : "s"}
            </span>
            <Boxes className="h-3.5 w-3.5 opacity-70" />
          </button>
          {openRag && (
            <div className="px-2.5 pb-2.5 space-y-2">
              <RagPipeline chunkCount={ragSources.length} />
              <SimilarityChart sources={ragSources} />
              <div className="space-y-1.5">
                {ragSources.map((src, i) => {
                  const snippet = (src.content || src.summary || "").trim();
                  const score = normalizeRagScore(src);
                  const kind = src.knowledge_type || src.source || src.source_app;
                  return (
                    <div
                      key={src.id ?? i}
                      className="rounded-md border border-primary/15 bg-background/70 p-2 space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded bg-primary/15 px-1 text-[10px] font-semibold text-primary tabular-nums">
                              #{i + 1}
                            </span>
                            <span className="text-[11px] font-medium truncate">
                              {sourceTitle(src)}
                            </span>
                          </div>
                          <div className="text-[9px] text-muted-foreground mt-0.5 flex flex-wrap gap-x-2">
                            <span>{chunkLabel(src, i)}</span>
                            {kind && <span className="uppercase tracking-wide">{kind}</span>}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-primary shrink-0">
                          {scoreLabel(src)}
                        </span>
                      </div>
                      <ScoreBar value={score} rank={i} />
                      {snippet && (
                        <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-3 whitespace-pre-wrap border-l-2 border-primary/25 pl-2">
                          {snippet.slice(0, 320)}
                          {snippet.length > 320 ? "…" : ""}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {hasTools && (
        <div className="rounded-lg border border-info/25 bg-info-soft/30 overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenTools((v) => !v)}
            className="w-full flex items-center gap-1.5 px-2.5 py-2 text-[11px] font-medium text-info hover:bg-info-soft/50 transition-colors"
          >
            {openTools ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
            <Wrench className="h-3.5 w-3.5" />
            {toolCalls.length} función{toolCalls.length === 1 ? "" : "es"} ejecutada
            {toolCalls.length === 1 ? "" : "s"}
          </button>
          {openTools && (
            <div className="px-2.5 pb-2.5 space-y-2">
              {toolCalls.map((call, i) => {
                const result = resultFor(call, i);
                return (
                  <div
                    key={call.id ?? i}
                    className="rounded-md border border-info/15 bg-background/70 p-2 space-y-1"
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-info">
                      <Wrench className="h-3 w-3" />
                      {toolName(call)}
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wide text-muted-foreground mb-0.5">
                        Argumentos
                      </div>
                      <pre className="text-[10px] font-mono bg-muted/60 rounded p-1.5 overflow-x-auto whitespace-pre-wrap">
                        {toolArguments(call) || "{}"}
                      </pre>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[9px] uppercase tracking-wide text-muted-foreground mb-0.5">
                        <ArrowRight className="h-2.5 w-2.5" />
                        Resultado
                      </div>
                      <pre className="text-[10px] font-mono bg-muted/60 rounded p-1.5 overflow-x-auto whitespace-pre-wrap max-h-48">
                        {result ? prettyJson(result.content) : "Sin resultado registrado"}
                      </pre>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Resumen de uso RAG en toda la conversación (panel de prueba). */
export function ConversationRagSummary({
  messages,
  embeddingModel,
  topK,
}: {
  messages: { role: string; rag_sources?: unknown[] }[];
  embeddingModel?: string | number | null;
  topK?: number | null;
}) {
  const stats = useMemo(() => {
    let repliesWithRag = 0;
    let totalChunks = 0;
    const titles = new Map<string, number>();
    for (const m of messages) {
      if (m.role !== "agent") continue;
      const sources = Array.isArray(m.rag_sources) ? (m.rag_sources as RagSourceDetail[]) : [];
      if (sources.length === 0) continue;
      repliesWithRag += 1;
      totalChunks += sources.length;
      for (const s of sources) {
        const t = sourceTitle(s);
        titles.set(t, (titles.get(t) ?? 0) + 1);
      }
    }
    const topDocs = [...titles.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
    return { repliesWithRag, totalChunks, topDocs };
  }, [messages]);

  if (stats.repliesWithRag === 0) return null;

  return (
    <div className="rounded-lg border border-border/60 bg-card/80 px-3 py-2.5 space-y-2">
      <div className="flex items-center gap-2 text-xs font-medium">
        <Boxes className="h-3.5 w-3.5 text-primary" />
        Uso de embeddings en esta conversación
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-md bg-muted/40 px-2 py-1.5">
          <div className="text-[9px] uppercase tracking-wide text-muted-foreground">Respuestas</div>
          <div className="text-sm font-semibold tabular-nums">{stats.repliesWithRag}</div>
        </div>
        <div className="rounded-md bg-muted/40 px-2 py-1.5">
          <div className="text-[9px] uppercase tracking-wide text-muted-foreground">Chunks</div>
          <div className="text-sm font-semibold tabular-nums">{stats.totalChunks}</div>
        </div>
        <div className="rounded-md bg-muted/40 px-2 py-1.5">
          <div className="text-[9px] uppercase tracking-wide text-muted-foreground">Top K</div>
          <div className="text-sm font-semibold tabular-nums">{topK ?? "—"}</div>
        </div>
      </div>
      {embeddingModel != null && String(embeddingModel) && (
        <p className="text-[10px] text-muted-foreground truncate">
          Modelo embedding: <span className="text-foreground/80">{String(embeddingModel)}</span>
        </p>
      )}
      {stats.topDocs.length > 0 && (
        <div className="space-y-1">
          {stats.topDocs.map(([title, count]) => (
            <div key={title} className="flex items-center gap-2 text-[10px]">
              <div className="flex-1 min-w-0 truncate text-muted-foreground">{title}</div>
              <div className="w-16 h-1 rounded-full bg-muted overflow-hidden shrink-0">
                <div
                  className={cn("h-full bg-primary/70 rounded-full")}
                  style={{
                    width: `${Math.min(100, (count / Math.max(stats.repliesWithRag, 1)) * 100)}%`,
                  }}
                />
              </div>
              <span className="tabular-nums text-muted-foreground w-4 text-right">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
