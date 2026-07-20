import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Database,
  FlaskConical,
  Sparkles,
  TriangleAlert,
  Wrench,
  XCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChatMarkdown } from "@/components/chat/chat-markdown";
import {
  normalizeRagScore,
  type RagSourceDetail,
  type ToolCallDetail,
  type ToolResultDetail,
} from "@/components/chat/chat-message-insights";

function prettyJson(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value.trim()), null, 2);
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

type Verdict = {
  level: "good" | "ok" | "weak" | "none" | "tools";
  title: string;
  detail: string;
};

function computeVerdict(ragSources: RagSourceDetail[], toolCalls: ToolCallDetail[]): Verdict {
  const scores = ragSources.map(normalizeRagScore).filter((s): s is number => s != null);
  const top = scores.length ? Math.max(...scores) : undefined;
  const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : undefined;

  if (ragSources.length === 0 && toolCalls.length === 0) {
    return {
      level: "none",
      title: "Sin señales técnicas",
      detail: "Esta respuesta no usó RAG ni skills.",
    };
  }
  if (ragSources.length === 0 && toolCalls.length > 0) {
    return {
      level: "tools",
      title: "Respondió con skills",
      detail: `${toolCalls.length} skill${toolCalls.length === 1 ? "" : "s"} ejecutada${toolCalls.length === 1 ? "" : "s"}. Sin chunks RAG.`,
    };
  }
  if (top != null && top >= 0.72) {
    return {
      level: "good",
      title: "Buena coincidencia",
      detail: `Mejor chunk ${(top * 100).toFixed(0)}%${avg != null ? ` · promedio ${(avg * 100).toFixed(0)}%` : ""}.`,
    };
  }
  if (top != null && top >= 0.45) {
    return {
      level: "ok",
      title: "Coincidencia aceptable",
      detail: `Top ${(top * 100).toFixed(0)}%${avg != null ? ` · promedio ${(avg * 100).toFixed(0)}%` : ""}. Conviene validar el documento.`,
    };
  }
  return {
    level: "weak",
    title: "Coincidencia débil",
    detail:
      top != null
        ? `Top ${(top * 100).toFixed(0)}%. Puede estar improvisando o usando contexto poco relevante.`
        : "Hay chunks pero sin score legible.",
  };
}

const VERDICT_STYLES: Record<
  Verdict["level"],
  { icon: typeof CheckCircle2; box: string; badge: string }
> = {
  good: {
    icon: CheckCircle2,
    box: "border-success/30 bg-success-soft/40",
    badge: "bg-success-soft text-success border-success/20",
  },
  ok: {
    icon: CircleHelp,
    box: "border-warning/30 bg-warning-soft/40",
    badge: "bg-warning-soft text-warning border-warning/20",
  },
  weak: {
    icon: TriangleAlert,
    box: "border-destructive/30 bg-destructive-soft/40",
    badge: "bg-destructive-soft text-destructive border-destructive/20",
  },
  none: {
    icon: XCircle,
    box: "border-border bg-muted/40",
    badge: "bg-muted text-muted-foreground",
  },
  tools: {
    icon: Wrench,
    box: "border-info/30 bg-info-soft/40",
    badge: "bg-info-soft text-info border-info/20",
  },
};

function DocumentationSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-xl border border-border/60 bg-muted/15 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-muted/40 transition-colors"
        aria-expanded={open}
      >
        <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="flex-1 text-sm font-medium">Documentación</span>
        <span className="text-[11px] text-muted-foreground mr-1">
          {open ? "Ocultar" : "Cómo leer este panel"}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-border/50 pt-3">
          <ul className="space-y-2.5 text-sm text-muted-foreground leading-relaxed">
            <li>
              <span className="font-medium text-foreground">RAG:</span> busca trozos (chunks) de tus
              documentos con embeddings y los usa como contexto antes de responder.
            </li>
            <li>
              <span className="font-medium text-foreground">Chunk:</span> fragmento indexado. Ver
              varios es normal; importa que sean relevantes.
            </li>
            <li>
              <span className="font-medium text-foreground">Similitud:</span> qué tan parecido es el
              chunk a la pregunta.
              <span className="mt-1.5 flex flex-col gap-0.5 pl-3 border-l-2 border-border text-xs">
                <span className="text-success">≥ 70% → bueno</span>
                <span className="text-warning">45–70% → revisá el documento</span>
                <span className="text-destructive">&lt; 45% → débil</span>
              </span>
            </li>
            <li>
              <span className="font-medium text-foreground">Skills:</span> llamadas a herramientas
              (APIs, acciones). Si aparecen, el agente ejecutó algo además de responder.
            </li>
            <li>
              <span className="font-medium text-foreground">Proceso:</span> pregunta → embedding →
              retrieve (chunks) → respuesta (LLM ± skills).
            </li>
          </ul>
        </div>
      )}
    </section>
  );
}

function QuickStats({
  chunkCount,
  toolCount,
  topScore,
}: {
  chunkCount: number;
  toolCount: number;
  topScore?: number;
}) {
  const items = [
    {
      label: "Chunks",
      value: String(chunkCount),
      hint: chunkCount > 0 ? "RAG usado" : "Sin RAG",
    },
    {
      label: "Skills",
      value: String(toolCount),
      hint: toolCount > 0 ? "Ejecutadas" : "Ninguna",
    },
    {
      label: "Mejor score",
      value: topScore != null ? `${Math.round(topScore * 100)}%` : "—",
      hint: topScore != null ? "Similitud top" : "N/A",
    },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((s) => (
        <div
          key={s.label}
          className="rounded-lg border border-border/60 bg-background px-2.5 py-2 text-center"
        >
          <div className="text-lg font-semibold tabular-nums tracking-tight">{s.value}</div>
          <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            {s.label}
          </div>
          <div className="text-[10px] text-muted-foreground/80 mt-0.5 truncate">{s.hint}</div>
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

  if (rows.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-background p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Sparkles className="h-4 w-4 text-primary" />
        Similitud por chunk
      </div>
      <div className="flex items-end gap-2 sm:gap-3 h-28 sm:h-32">
        {rows.map(({ src, score, rank }) => {
          const h = score != null ? Math.max(12, Math.round((score / max) * 100)) : 12;
          const tone =
            score == null
              ? "bg-muted-foreground/40"
              : score >= 0.72
                ? "bg-success"
                : score >= 0.45
                  ? "bg-warning"
                  : "bg-destructive/80";
          return (
            <div
              key={src.id ?? rank}
              className="flex-1 min-w-0 flex flex-col items-center justify-end gap-1.5 h-full"
              title={`${sourceTitle(src)} · ${scoreLabel(src)}`}
            >
              <span className="text-[11px] font-mono tabular-nums text-muted-foreground">
                {score != null ? `${Math.round(score * 100)}%` : "—"}
              </span>
              <div
                className={cn("w-full max-w-[2.75rem] rounded-t-md", tone)}
                style={{ height: `${h}%` }}
              />
              <span className="text-[11px] text-muted-foreground">#{rank + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export type InsightMessage = {
  id: string | number;
  content: string;
  created?: string;
  rag_sources?: unknown[];
  tool_calls?: unknown[];
  tool_results?: unknown[];
};

export function MessageInsightSheet({
  open,
  onOpenChange,
  message,
  embeddingModel,
  topK,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: InsightMessage | null;
  embeddingModel?: string | number | null;
  topK?: number | null;
}) {
  const ragSources = useMemo(
    () => (Array.isArray(message?.rag_sources) ? (message!.rag_sources as RagSourceDetail[]) : []),
    [message],
  );
  const toolCalls = useMemo(
    () => (Array.isArray(message?.tool_calls) ? (message!.tool_calls as ToolCallDetail[]) : []),
    [message],
  );
  const toolResults = useMemo(
    () =>
      Array.isArray(message?.tool_results) ? (message!.tool_results as ToolResultDetail[]) : [],
    [message],
  );

  const scores = useMemo(
    () => ragSources.map(normalizeRagScore).filter((s): s is number => s != null),
    [ragSources],
  );
  const topScore = scores.length ? Math.max(...scores) : undefined;

  const verdict = useMemo(() => computeVerdict(ragSources, toolCalls), [ragSources, toolCalls]);
  const style = VERDICT_STYLES[verdict.level];
  const VerdictIcon = style.icon;
  const reduceMotion = useReducedMotion();
  const panelKey = message ? String(message.id) : "closed";

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0 flex flex-col gap-0 bg-background overflow-hidden",
          "data-[state=open]:duration-500 data-[state=closed]:duration-300",
          "data-[state=open]:slide-in-from-right-10 data-[state=closed]:slide-out-to-right-10",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        )}
      >
        <SheetHeader className="px-5 sm:px-6 py-4 border-b border-border/60 shrink-0 space-y-1 text-left">
          <SheetTitle className="text-lg flex items-center gap-2.5">
            <FlaskConical className="h-5 w-5 text-primary" />
            Análisis del mensaje
          </SheetTitle>
          <SheetDescription className="text-sm">
            Datos de esta respuesta: scores, chunks y skills.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0">
          <AnimatePresence mode="wait">
            {open && message && (
              <motion.div
                key={panelKey}
                className="p-5 sm:p-6 space-y-5"
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {/* 1. Veredicto + métricas dinámicas */}
                <div className={cn("rounded-xl border p-4 space-y-3", style.box)}>
                  <div className="flex items-start gap-3">
                    <VerdictIcon className="h-5 w-5 shrink-0 mt-0.5" />
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-semibold">{verdict.title}</span>
                        <Badge variant="outline" className={cn("text-[11px]", style.badge)}>
                          {ragSources.length} chunk{ragSources.length === 1 ? "" : "s"}
                          {toolCalls.length > 0
                            ? ` · ${toolCalls.length} skill${toolCalls.length === 1 ? "" : "s"}`
                            : ""}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{verdict.detail}</p>
                    </div>
                  </div>
                  <QuickStats
                    chunkCount={ragSources.length}
                    toolCount={toolCalls.length}
                    topScore={topScore}
                  />
                  {(embeddingModel != null || topK != null) && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground border-t border-border/40 pt-2.5">
                      {topK != null && (
                        <span>
                          Top K: <span className="text-foreground/80 tabular-nums">{topK}</span>
                        </span>
                      )}
                      {embeddingModel != null && String(embeddingModel) && (
                        <span className="truncate">
                          Embedding:{" "}
                          <span className="text-foreground/80">{String(embeddingModel)}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Skills (alta prioridad si hubo ejecución) */}
                {toolCalls.length > 0 && (
                  <section className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Wrench className="h-4 w-4 text-info" />
                      Skills ejecutadas
                    </div>
                    <div className="space-y-3">
                      {toolCalls.map((call, i) => {
                        const result = resultFor(call, i);
                        return (
                          <article
                            key={call.id ?? i}
                            className="rounded-xl border border-info/25 bg-info-soft/20 p-4 space-y-3"
                          >
                            <div className="flex items-center gap-2 text-sm font-mono font-medium text-info">
                              <Wrench className="h-4 w-4" />
                              {toolName(call)}
                            </div>
                            <div>
                              <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">
                                Argumentos
                              </div>
                              <pre className="text-xs font-mono bg-background/70 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
                                {prettyJson(call.function?.arguments ?? call.arguments) || "{}"}
                              </pre>
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">
                                <ArrowRight className="h-3.5 w-3.5" />
                                Resultado
                              </div>
                              <pre className="text-xs font-mono bg-background/70 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap max-h-64">
                                {result ? prettyJson(result.content) : "Sin resultado registrado"}
                              </pre>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* 3. Chunks RAG */}
                {ragSources.length > 0 && (
                  <section className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Boxes className="h-4 w-4 text-primary" />
                      Chunks recuperados
                    </div>
                    <SimilarityChart sources={ragSources} />
                    <div className="space-y-3">
                      {ragSources.map((src, i) => {
                        const score = normalizeRagScore(src);
                        const snippet = (src.content || src.summary || "").trim();
                        const kind = src.knowledge_type || src.source || src.source_app;
                        const tone =
                          score == null
                            ? "text-muted-foreground"
                            : score >= 0.72
                              ? "text-success"
                              : score >= 0.45
                                ? "text-warning"
                                : "text-destructive";
                        return (
                          <article
                            key={src.id ?? i}
                            className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-primary/15 px-1.5 text-xs font-semibold text-primary">
                                    #{i + 1}
                                  </span>
                                  <span className="text-sm font-medium truncate">
                                    {sourceTitle(src)}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-x-3">
                                  <span>{chunkLabel(src, i)}</span>
                                  {kind && <span className="uppercase tracking-wide">{kind}</span>}
                                </div>
                              </div>
                              <span
                                className={cn("text-sm font-mono font-semibold shrink-0", tone)}
                              >
                                {score != null ? `${Math.round(score * 100)}%` : scoreLabel(src)}
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  score == null
                                    ? "bg-muted-foreground/40"
                                    : score >= 0.72
                                      ? "bg-success"
                                      : score >= 0.45
                                        ? "bg-warning"
                                        : "bg-destructive",
                                )}
                                style={{
                                  width: `${score != null ? Math.round(score * 100) : 0}%`,
                                }}
                              />
                            </div>
                            {snippet && (
                              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap border-l-2 border-primary/25 pl-3">
                                {snippet.slice(0, 520)}
                                {snippet.length > 520 ? "…" : ""}
                              </p>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* 4. Texto de la respuesta */}
                {message?.content && (
                  <section className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      Texto de la respuesta
                    </div>
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                      <ChatMarkdown content={message.content} />
                    </div>
                  </section>
                )}

                {/* 5. Documentación estática (opcional, cerrada) */}
                <DocumentationSection />
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export function MessageInspectButton({
  chunkCount,
  toolCount,
  onClick,
  variant = "chip",
}: {
  chunkCount: number;
  toolCount: number;
  onClick: () => void;
  /** icon = compacto al lado de la hora; chip = botón con texto */
  variant?: "icon" | "chip";
}) {
  const hasData = chunkCount > 0 || toolCount > 0;
  const title = hasData
    ? `Análisis · ${chunkCount > 0 ? `${chunkCount} fuentes` : ""}${
        chunkCount > 0 && toolCount > 0 ? " · " : ""
      }${toolCount > 0 ? `${toolCount} skills` : ""}`
    : "Ver análisis técnico del mensaje";

  if (variant === "icon") {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.08 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className={cn(
          "inline-flex h-5 w-5 items-center justify-center rounded-full transition-colors cursor-pointer",
          hasData
            ? "text-primary bg-primary/15 hover:bg-primary/25"
            : "text-muted-foreground/80 hover:text-foreground hover:bg-muted/80",
        )}
        title={title}
        aria-label={title}
      >
        <FlaskConical className="h-3 w-3" />
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={cn(
        "inline-flex items-center gap-1.5 h-7 rounded-md border px-2 text-[11px] font-medium transition-colors cursor-pointer",
        hasData
          ? "border-primary/30 bg-primary-soft/40 text-primary hover:bg-primary-soft"
          : "border-border bg-muted/40 text-muted-foreground hover:bg-muted",
      )}
      title={title}
    >
      <FlaskConical className="h-3.5 w-3.5" />
      Análisis
      {hasData && (
        <span className="tabular-nums opacity-80">
          {chunkCount > 0 ? `${chunkCount}c` : ""}
          {chunkCount > 0 && toolCount > 0 ? " · " : ""}
          {toolCount > 0 ? `${toolCount}fn` : ""}
        </span>
      )}
    </motion.button>
  );
}
