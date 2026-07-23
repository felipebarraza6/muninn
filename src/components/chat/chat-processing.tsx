import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Database, Loader2, Shield, Sparkles, Wrench, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ToolCallDetail, ToolResultDetail } from "@/components/chat/chat-message-insights";
import { isToolResultFailed } from "@/components/chat/chat-message-insights";
import type { PolicyTrace } from "@/lib/policyTrace";

function toolLabel(call: ToolCallDetail): string {
  const raw = call.function?.name || call.name || "skill";
  return raw.replace(/[_-]+/g, " ").trim();
}

export function extractToolLabels(toolCalls?: unknown[]): string[] {
  if (!Array.isArray(toolCalls)) return [];
  const labels: string[] = [];
  for (const raw of toolCalls) {
    if (!raw || typeof raw !== "object") continue;
    labels.push(toolLabel(raw as ToolCallDetail));
  }
  return labels;
}

export type LiveStreamStep = {
  key: string;
  label: string;
  detail?: string;
  icon: "sparkles" | "database" | "wrench" | "loader";
  status: "pending" | "active" | "done" | "error";
};

const softEase = [0.25, 0.1, 0.25, 1] as const;

function StageIcon({ kind, className }: { kind: LiveStreamStep["icon"]; className?: string }) {
  const cls = cn("h-3.5 w-3.5 shrink-0", className);
  if (kind === "database") return <Database className={cls} />;
  if (kind === "wrench") return <Wrench className={cls} />;
  if (kind === "loader") return <Loader2 className={cn(cls, "animate-spin")} />;
  return <Sparkles className={cls} />;
}

/** Indicador animado con eventos SSE reales (o fallback simulado). */
export function ChatProcessingIndicator({
  useRag,
  skillNames = [],
  liveSteps,
}: {
  useRag?: boolean;
  skillNames?: string[];
  /** Si hay steps del stream, se usan en lugar del ciclo simulado. */
  liveSteps?: LiveStreamStep[];
}) {
  const reduceMotion = useReducedMotion();
  const usingLive = Boolean(liveSteps && liveSteps.length > 0);

  const fallbackStages = useMemo<LiveStreamStep[]>(() => {
    const list: LiveStreamStep[] = [
      {
        key: "read",
        label: "Leyendo tu mensaje",
        detail: "Preparando el contexto",
        icon: "sparkles",
        status: "pending",
      },
    ];
    if (useRag) {
      list.push({
        key: "rag",
        label: "Buscando en conocimiento",
        detail: "RAG / documentos",
        icon: "database",
        status: "pending",
      });
    }
    const skills = skillNames.filter(Boolean).slice(0, 6);
    if (skills.length) {
      for (const name of skills) {
        list.push({
          key: `skill-${name}`,
          label: "Ejecutando skill",
          detail: name,
          icon: "wrench",
          status: "pending",
        });
      }
    } else {
      list.push({
        key: "tools",
        label: "Evaluando herramientas",
        detail: "Skills del agente",
        icon: "wrench",
        status: "pending",
      });
    }
    list.push({
      key: "write",
      label: "Redactando respuesta",
      detail: "Modelo en curso",
      icon: "loader",
      status: "pending",
    });
    return list;
  }, [useRag, skillNames]);

  const [simIndex, setSimIndex] = useState(0);

  useEffect(() => {
    if (usingLive) return;
    setSimIndex(0);
    if (reduceMotion || fallbackStages.length <= 1) return;
    const id = window.setInterval(() => {
      setSimIndex((i) => (i + 1) % fallbackStages.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, [fallbackStages, reduceMotion, usingLive]);

  const stages: LiveStreamStep[] = usingLive
    ? liveSteps!
    : fallbackStages.map((s, i) => ({
        ...s,
        status: i < simIndex ? "done" : i === simIndex ? "active" : "pending",
      }));

  const current =
    stages.find((s) => s.status === "active") || stages[stages.length - 1] || stages[0];

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: 2 }}
      transition={{ duration: 0.35, ease: softEase }}
      className="flex gap-3"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center relative">
        {!reduceMotion && (
          <motion.span
            className="absolute inset-0 rounded-full bg-primary/10"
            animate={{ opacity: [0.35, 0.12, 0.35], scale: [1, 1.06, 1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <Loader2 className="relative h-3.5 w-3.5 text-primary/80 animate-spin [animation-duration:1.4s]" />
      </div>

      <div className="max-w-[85%] sm:max-w-[75%] min-w-[12rem] rounded-2xl rounded-bl-md border border-border/60 bg-muted/50 px-3.5 py-2.5 space-y-2.5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current?.key || "current"}
            initial={reduceMotion ? false : { opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -2 }}
            transition={{ duration: 0.28, ease: softEase }}
            className="flex items-start gap-2"
          >
            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary/80">
              <StageIcon kind={current?.icon || "loader"} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground/90 leading-tight">
                {current?.label || "Procesando…"}
              </p>
              {current?.detail && (
                <p className="text-[11px] text-muted-foreground/80 truncate mt-0.5">
                  {current.detail}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-wrap gap-1">
          {stages.map((stage) => {
            const done = stage.status === "done";
            const active = stage.status === "active";
            const err = stage.status === "error";
            return (
              <motion.span
                key={stage.key}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{
                  opacity: active ? 1 : done || err ? 0.9 : 0.55,
                }}
                transition={{ duration: 0.4, ease: softEase }}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-medium border transition-colors duration-500",
                  done && "border-primary/20 bg-primary/8 text-primary/90",
                  active && "border-primary/30 bg-primary/12 text-primary",
                  err && "border-destructive/30 bg-destructive/8 text-destructive",
                  !done &&
                    !active &&
                    !err &&
                    "border-border/50 bg-background/30 text-muted-foreground",
                )}
                title={stage.detail ? `${stage.label}: ${stage.detail}` : stage.label}
              >
                {done ? (
                  <Check className="h-2.5 w-2.5 opacity-80" />
                ) : err ? (
                  <X className="h-2.5 w-2.5" />
                ) : active ? (
                  <Loader2 className="h-2.5 w-2.5 animate-spin [animation-duration:1.6s] opacity-80" />
                ) : (
                  <StageIcon kind={stage.icon} className="h-2.5 w-2.5 opacity-50" />
                )}
                <span className="max-w-[7rem] truncate">
                  {stage.detail && stage.icon === "wrench" ? stage.detail : stage.label}
                </span>
              </motion.span>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

/** Chips compactos bajo el mensaje: skills ejecutadas + señales de policy. */
export function MessageActivityTrail({
  toolCalls,
  toolResults,
  policyTrace,
  className,
}: {
  toolCalls?: unknown[];
  toolResults?: unknown[];
  policyTrace?: PolicyTrace | null;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const labels = useMemo(() => extractToolLabels(toolCalls), [toolCalls]);
  const results = Array.isArray(toolResults) ? (toolResults as ToolResultDetail[]) : [];
  const blocked = policyTrace?.skills_blocked ?? [];
  const missing = policyTrace?.slots_missing ?? [];

  if (!labels.length && !blocked.length && !missing.length) return null;

  const chips: Array<{ key: string; label: string; tone: "ok" | "fail" | "warn" }> = [
    ...labels.map((label, i) => {
      const result = results[i];
      const failed = isToolResultFailed(result?.content);
      return {
        key: `skill-${label}-${i}`,
        label: failed ? `Falló: ${label}` : `Ejecutada: ${label}`,
        tone: (failed ? "fail" : "ok") as "ok" | "fail",
      };
    }),
    ...blocked.map((b, i) => ({
      key: `block-${b.skill}-${i}`,
      label: b.reason ? `${b.skill}: ${b.reason}` : `Bloqueada: ${b.skill}`,
      tone: "fail" as const,
    })),
    ...missing.slice(0, 3).map((s, i) => ({
      key: `slot-${s}-${i}`,
      label: `Slot: ${s}`,
      tone: "warn" as const,
    })),
  ];

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: softEase }}
      className={cn("flex flex-wrap items-center gap-1 pt-0.5", className)}
    >
      {chips.map((chip, i) => (
        <motion.span
          key={chip.key}
          initial={reduceMotion ? false : { opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, delay: reduceMotion ? 0 : i * 0.04, ease: softEase }}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium max-w-[16rem]",
            chip.tone === "fail"
              ? "border-destructive/25 bg-destructive/8 text-destructive"
              : chip.tone === "warn"
                ? "border-warning/25 bg-warning/10 text-warning"
                : "border-primary/25 bg-primary/10 text-primary",
          )}
          title={chip.label}
        >
          {chip.tone === "fail" ? (
            chip.key.startsWith("block-") ? (
              <Shield className="h-3 w-3 shrink-0 opacity-80" />
            ) : (
              <X className="h-3 w-3 shrink-0 opacity-80" />
            )
          ) : chip.tone === "warn" ? (
            <Shield className="h-3 w-3 shrink-0 opacity-80" />
          ) : (
            <Wrench className="h-3 w-3 shrink-0 opacity-80" />
          )}
          <span className="truncate">{chip.label}</span>
        </motion.span>
      ))}
    </motion.div>
  );
}
