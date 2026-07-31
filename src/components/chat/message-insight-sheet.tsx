import { useCallback, useEffect, useMemo, useState } from "react";
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
  Shield,
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
import { motionTokens } from "@/lib/motion";
import { prettyJson } from "@/lib/json";
import { ChatMarkdown } from "@/components/chat/chat-markdown";
import {
  isToolResultFailed,
  normalizeRagScore,
  scoreLabel,
  sourceTitle,
  toolName,
  type RagSourceDetail,
  type ToolCallDetail,
  type ToolResultDetail,
} from "@/components/chat/chat-message-insights";
import type { FlowPolicy } from "@/lib/flowPolicy";
import {
  extractPolicyTrace,
  inferPolicyTraceFromConfig,
  policyTraceSignalCount,
  type PolicyTrace,
} from "@/lib/policyTrace";

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

function computeVerdict(
  ragSources: RagSourceDetail[],
  toolCalls: ToolCallDetail[],
  policyTrace?: PolicyTrace | null,
): Verdict {
  const blocked = policyTrace?.skills_blocked?.length ?? 0;
  const missing = policyTrace?.slots_missing?.length ?? 0;
  if (blocked > 0) {
    return {
      level: "weak",
      title: "Skills bloqueadas por policy",
      detail: `${blocked} skill${blocked === 1 ? "" : "s"} no pudieron ejecutarse según la traza de policies.`,
    };
  }
  if (missing > 0) {
    return {
      level: "ok",
      title: "Slots incompletos",
      detail: `Faltan ${missing} slot${missing === 1 ? "" : "s"} de flow_policy para completar el flujo.`,
    };
  }

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
                <span className="text-warning">45–70% → revisa el documento</span>
                <span className="text-destructive">&lt; 45% → débil</span>
              </span>
            </li>
            <li>
              <span className="font-medium text-foreground">Skills:</span> llamadas a herramientas
              (APIs, acciones). Si aparecen, el agente ejecutó algo además de responder.
            </li>
            <li>
              <span className="font-medium text-foreground">Policies:</span> reglas de{" "}
              <span className="font-mono text-[11px]">flow_policy</span> (slots, allow/block). Si
              dice “inferido”, se cruzó la config del agente con las skills del mensaje.
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

type InsightTab = "chunks" | "skills" | "policies";

function QuickStats({
  chunkCount,
  toolCount,
  policyCount,
  active,
  onChange,
}: {
  chunkCount: number;
  toolCount: number;
  policyCount: number;
  active: InsightTab;
  onChange: (tab: InsightTab) => void;
}) {
  const items: Array<{
    id: InsightTab;
    label: string;
    value: string;
    hint: string;
    disabled: boolean;
  }> = [
    {
      id: "chunks",
      label: "Chunks",
      value: String(chunkCount),
      hint: chunkCount > 0 ? "RAG usado" : "Sin RAG",
      disabled: chunkCount === 0,
    },
    {
      id: "skills",
      label: "Skills",
      value: String(toolCount),
      hint: toolCount > 0 ? "Ejecutadas" : "Ninguna",
      disabled: toolCount === 0,
    },
    {
      id: "policies",
      label: "Policies",
      value: String(policyCount),
      hint: policyCount > 0 ? "Señales" : "Ninguna",
      disabled: policyCount === 0,
    },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((s) => {
        const selected = active === s.id;
        return (
          <button
            key={s.id}
            type="button"
            disabled={s.disabled}
            onClick={() => onChange(s.id)}
            className={cn(
              "rounded-lg border px-2.5 py-2 text-center transition-colors",
              s.disabled && "opacity-45 cursor-not-allowed",
              !s.disabled && "cursor-pointer hover:border-primary/40",
              selected
                ? "border-primary/50 bg-primary/10 ring-1 ring-primary/25"
                : "border-border/60 bg-background",
            )}
          >
            <div className="text-lg font-semibold tabular-nums tracking-tight">{s.value}</div>
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              {s.label}
            </div>
            <div className="text-[10px] text-muted-foreground/80 mt-0.5 truncate">{s.hint}</div>
          </button>
        );
      })}
    </div>
  );
}

function SkillResultCard({
  call,
  result,
  defaultOpen,
}: {
  call: ToolCallDetail;
  result?: ToolResultDetail;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  const failed = isToolResultFailed(result?.content);
  const name = toolName(call);

  return (
    <article
      className={cn(
        "rounded-xl border overflow-hidden",
        failed ? "border-destructive/30 bg-destructive-soft/15" : "border-primary/25 bg-primary/5",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 px-3.5 py-3 text-left hover:bg-background/40 transition-colors"
      >
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            failed ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary",
          )}
        >
          <Wrench className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-mono font-medium truncate">{name}</p>
          <p className="text-[11px] text-muted-foreground">
            {failed ? "Falló la ejecución" : "Skill ejecutada"}
          </p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] shrink-0",
            failed
              ? "border-destructive/30 text-destructive"
              : "border-primary/30 text-primary bg-primary/5",
          )}
        >
          {failed ? "Error" : "OK"}
        </Badge>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform shrink-0",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="border-t border-border/50 bg-background/50 p-3.5 space-y-3">
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/40 text-[10px] uppercase tracking-wide text-muted-foreground">
              Argumentos
            </div>
            <pre className="text-xs font-mono p-3 overflow-x-auto whitespace-pre-wrap max-h-40">
              {prettyJson(call.function?.arguments ?? call.arguments) || "{}"}
            </pre>
          </div>
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/40 text-[10px] uppercase tracking-wide text-muted-foreground">
              <ArrowRight className="h-3 w-3" />
              Resultado
            </div>
            <pre className="text-xs font-mono p-3 overflow-x-auto whitespace-pre-wrap max-h-56">
              {result ? prettyJson(result.content) : "Sin resultado registrado"}
            </pre>
          </div>
        </div>
      )}
    </article>
  );
}

function PoliciesSection({ trace }: { trace: PolicyTrace }) {
  const filled = trace.slots_filled ? Object.entries(trace.slots_filled) : [];
  const hasBody =
    filled.length > 0 ||
    (trace.slots_missing?.length ?? 0) > 0 ||
    (trace.skills_allowed?.length ?? 0) > 0 ||
    (trace.skills_blocked?.length ?? 0) > 0 ||
    (trace.rules_applied?.length ?? 0) > 0;

  if (!hasBody) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Shield className="h-4 w-4 text-primary" />
        Policies consideradas
        {trace.inferred && (
          <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
            Inferido de la config
          </Badge>
        )}
      </div>
      <div className="rounded-xl border border-border/60 bg-muted/15 p-4 space-y-4">
        {filled.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Slots llenos
            </p>
            <div className="flex flex-wrap gap-1.5">
              {filled.map(([k, v]) => (
                <Badge key={k} variant="outline" className="text-[11px] font-normal max-w-full">
                  <span className="font-medium">{k}</span>
                  <span className="text-muted-foreground ml-1 truncate">
                    {typeof v === "string" || typeof v === "number" ? String(v) : "…"}
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        )}
        {(trace.slots_missing?.length ?? 0) > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Slots faltantes
            </p>
            <div className="flex flex-wrap gap-1.5">
              {trace.slots_missing!.map((s) => (
                <Badge
                  key={s}
                  variant="outline"
                  className="text-[11px] border-warning/30 text-warning bg-warning-soft/30"
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {(trace.skills_allowed?.length ?? 0) > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Skills permitidas
            </p>
            <div className="flex flex-wrap gap-1.5">
              {trace.skills_allowed!.map((s) => (
                <Badge
                  key={s}
                  variant="outline"
                  className="text-[11px] border-success/30 text-success bg-success-soft/30"
                >
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {(trace.skills_blocked?.length ?? 0) > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Skills bloqueadas
            </p>
            <div className="space-y-1.5">
              {trace.skills_blocked!.map((b) => (
                <div
                  key={b.skill}
                  className="rounded-lg border border-destructive/25 bg-destructive-soft/20 px-3 py-2 text-sm"
                >
                  <span className="font-mono text-destructive">{b.skill}</span>
                  {b.reason && <p className="text-xs text-muted-foreground mt-0.5">{b.reason}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        {(trace.rules_applied?.length ?? 0) > 0 && (
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Reglas aplicadas
            </p>
            <div className="space-y-2">
              {trace.rules_applied!.map((r, i) => (
                <div
                  key={`${r.skill ?? "rule"}-${i}`}
                  className="rounded-lg border border-border/50 bg-background/70 px-3 py-2 text-sm space-y-1"
                >
                  {r.skill && <p className="font-mono text-foreground/90">{r.skill}</p>}
                  {(r.requires?.length ?? 0) > 0 && (
                    <p className="text-xs text-muted-foreground">
                      requires: {r.requires!.join(", ")}
                    </p>
                  )}
                  {r.note && <p className="text-xs text-muted-foreground">{r.note}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
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
  policy_trace?: unknown;
  flow_policy_trace?: unknown;
  policies?: unknown;
  metadata?: Record<string, unknown> | null;
};

export function MessageInsightSheet({
  open,
  onOpenChange,
  message,
  embeddingModel,
  topK,
  flowPolicy,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: InsightMessage | null;
  embeddingModel?: string | number | null;
  topK?: number | null;
  /** Fallback: reglas inferidas desde agent.flow_policy. */
  flowPolicy?: FlowPolicy | Record<string, unknown> | null;
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

  const policyTrace = useMemo(() => {
    const fromMsg = extractPolicyTrace(message ?? undefined);
    if (fromMsg) return fromMsg;
    return inferPolicyTraceFromConfig(flowPolicy, message?.tool_calls);
  }, [message, flowPolicy]);

  const policyCount = policyTraceSignalCount(policyTrace);

  const scores = useMemo(
    () => ragSources.map(normalizeRagScore).filter((s): s is number => s != null),
    [ragSources],
  );
  const topScore = scores.length ? Math.max(...scores) : undefined;

  const verdict = useMemo(
    () => computeVerdict(ragSources, toolCalls, policyTrace),
    [ragSources, toolCalls, policyTrace],
  );
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

  const defaultTab = useMemo((): InsightTab => {
    if (ragSources.length > 0) return "chunks";
    if (toolCalls.length > 0) return "skills";
    if (policyCount > 0) return "policies";
    return "chunks";
  }, [ragSources.length, toolCalls.length, policyCount]);

  const [activeTab, setActiveTab] = useState<InsightTab>(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab, panelKey]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl p-0 flex flex-col gap-0 bg-background overflow-hidden",
          "data-[state=open]:duration-500 data-[state=closed]:duration-300",
          "data-[state=open]:slide-in-from-right-10 data-[state=closed]:slide-out-to-right-10",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        )}
        style={{ maxWidth: "min(96vw, 52rem)" }}
      >
        <SheetHeader className="px-5 sm:px-6 py-4 border-b border-border/60 shrink-0 space-y-1 text-left">
          <SheetTitle className="text-lg flex items-center gap-2.5">
            <FlaskConical className="h-5 w-5 text-primary" />
            Análisis del mensaje
          </SheetTitle>
          <SheetDescription className="text-sm">
            Usa las tarjetas de arriba para ver chunks, skills o policies.
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
                transition={{ duration: motionTokens.card, ease: motionTokens.ease }}
              >
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
                          {policyCount > 0
                            ? ` · ${policyCount} polic${policyCount === 1 ? "y" : "ies"}`
                            : ""}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{verdict.detail}</p>
                    </div>
                  </div>
                  <QuickStats
                    chunkCount={ragSources.length}
                    toolCount={toolCalls.length}
                    policyCount={policyCount}
                    active={activeTab}
                    onChange={setActiveTab}
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

                {activeTab === "skills" && (
                  <section className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Wrench className="h-4 w-4 text-primary" />
                      Skills ejecutadas
                    </div>
                    {toolCalls.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-6 text-center">
                        Esta respuesta no ejecutó skills.
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {toolCalls.map((call, i) => (
                          <SkillResultCard
                            key={call.id ?? i}
                            call={call}
                            result={resultFor(call, i)}
                          />
                        ))}
                      </div>
                    )}
                  </section>
                )}

                {activeTab === "policies" &&
                  (policyTrace ? (
                    <PoliciesSection trace={policyTrace} />
                  ) : (
                    <p className="text-sm text-muted-foreground py-6 text-center">
                      Sin señales de policy en este mensaje.
                    </p>
                  ))}

                {activeTab === "chunks" && (
                  <section className="space-y-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Boxes className="h-4 w-4 text-primary" />
                        Chunks recuperados
                      </div>
                      {topScore != null && (
                        <Badge
                          variant="outline"
                          className="text-[11px] font-medium border-primary/30 bg-primary/5 text-primary"
                        >
                          Mejor similitud {Math.round(topScore * 100)}%
                        </Badge>
                      )}
                    </div>
                    {ragSources.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-6 text-center">
                        Sin chunks RAG en esta respuesta.
                      </p>
                    ) : (
                      <>
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
                                      {kind && (
                                        <span className="uppercase tracking-wide">{kind}</span>
                                      )}
                                    </div>
                                  </div>
                                  <span
                                    className={cn("text-sm font-mono font-semibold shrink-0", tone)}
                                  >
                                    {score != null
                                      ? `${Math.round(score * 100)}%`
                                      : scoreLabel(src)}
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
                      </>
                    )}
                  </section>
                )}

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
  policyCount = 0,
  onClick,
  variant = "chip",
}: {
  chunkCount: number;
  toolCount: number;
  policyCount?: number;
  onClick: () => void;
  /** icon = compacto al lado de la hora; chip = botón con texto */
  variant?: "icon" | "chip";
}) {
  const hasData = chunkCount > 0 || toolCount > 0 || policyCount > 0;
  const parts: string[] = [];
  if (chunkCount > 0) parts.push(`${chunkCount} fuentes`);
  if (toolCount > 0) parts.push(`${toolCount} skills`);
  if (policyCount > 0) parts.push(`${policyCount} policies`);
  const title = hasData ? `Análisis · ${parts.join(" · ")}` : "Ver análisis técnico del mensaje";

  if (variant === "icon") {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
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
          {[
            chunkCount > 0 ? `${chunkCount}c` : null,
            toolCount > 0 ? `${toolCount}fn` : null,
            policyCount > 0 ? `${policyCount}p` : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </span>
      )}
    </motion.button>
  );
}
