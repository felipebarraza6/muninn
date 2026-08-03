import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Database, Shield, Sparkles, Wrench, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motionTokens } from "@/lib/motion";
import { useMotionPrefs } from "@/hooks/useMotionPrefs";
import type { ToolCallDetail, ToolResultDetail } from "@/components/chat/chat-message-insights";
import { isToolResultFailed, toolLabel } from "@/components/chat/chat-message-insights";
import type { PolicyTrace } from "@/lib/policyTrace";

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

function StageIcon({ kind, className }: { kind: LiveStreamStep["icon"]; className?: string }) {
  const cls = cn("h-3.5 w-3.5 shrink-0", className);
  if (kind === "database") return <Database className={cls} />;
  if (kind === "wrench") return <Wrench className={cls} />;
  if (kind === "loader") return <Sparkles className={cls} />;
  return <Sparkles className={cls} />;
}

/** Indicador animado con eventos SSE reales; sin stages inventados. */
export function ChatProcessingIndicator({
  liveSteps,
  compact = false,
}: {
  /** Steps del stream SSE. */
  liveSteps?: LiveStreamStep[];
  /** Una sola línea (label activo) sin chips. */
  compact?: boolean;
}) {
  const reduceMotion = useMotionPrefs();
  const stages: LiveStreamStep[] =
    liveSteps && liveSteps.length > 0
      ? liveSteps
      : [
          {
            key: "wait",
            label: "El agente está respondiendo…",
            detail: undefined,
            icon: "loader",
            status: "active",
          },
        ];

  const current =
    stages.find((s) => s.status === "active") || stages[stages.length - 1] || stages[0];

  const activeSkill = stages.find((s) => s.icon === "wrench" && s.status === "active");

  const chipsToShow =
    !compact && stages.length > 1
      ? stages.filter((s) => s.key !== "connected" && s !== activeSkill)
      : [];

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: 2 }}
      transition={{ duration: motionTokens.slow, ease: motionTokens.ease }}
      className="flex gap-3"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center relative">
        {!reduceMotion && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full bg-primary/10"
              animate={{ opacity: [0.35, 0.12, 0.35], scale: [1, 1.08, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              className="absolute inset-0 rounded-full border border-primary/20"
              animate={{ opacity: [0.5, 0.15, 0.5], scale: [1, 1.15, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />
          </>
        )}
      </div>

      <div
        className={cn(
          "max-w-[85%] sm:max-w-[75%] min-w-[12rem] rounded-2xl rounded-bl-md border border-border/60 bg-muted/50 px-3.5 py-2.5",
          !compact && "space-y-2.5",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current?.key || "current"}
            initial={reduceMotion ? false : { opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -2 }}
            transition={{ duration: motionTokens.base, ease: motionTokens.ease }}
            className="flex items-start gap-2"
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground/90 leading-tight">
                {current?.label || "Procesando…"}
              </p>
              {current?.detail && (
                <p className="text-[11px] text-muted-foreground/80 truncate mt-0.5">
                  {current.detail}
                </p>
              )}
              {activeSkill && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] text-primary/80"
                >
                  <Wrench className="h-3 w-3" />
                  <span className="truncate max-w-[12rem]">{activeSkill.detail}</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
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
  const reduceMotion = useMotionPrefs();
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
      transition={{ duration: motionTokens.base, ease: motionTokens.ease }}
      className={cn("flex flex-wrap items-center gap-1 pt-0.5", className)}
    >
      {chips.map((chip, i) => (
        <motion.span
          key={chip.key}
          initial={reduceMotion ? false : { opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: motionTokens.fast,
            delay: reduceMotion ? 0 : i * motionTokens.stagger,
            ease: motionTokens.ease,
          }}
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
