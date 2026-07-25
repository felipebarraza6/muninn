import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MUNINN_LIVE_DEMO_EVENT } from "@/lib/muninnLiveDemo";
import { PixelIcon, type PixelIconName } from "@/components/brand/pixel-icons";
import {
  LOGIN_DEMO_STAGES,
  LOGIN_DEMO_STEP_MS,
  LOGIN_DEMO_STEPS,
  LOGIN_LANDING_TRY_LIVE,
  resolveLiveSandboxReply,
  type LoginDemoMessage,
  type LoginDemoNodeKind,
  type LoginDemoStageId,
} from "@/lib/loginLanding";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Incrementar para forzar modo live (easter egg / CTA). */
  liveFocusToken?: number;
};

const NODE_ICON: Record<LoginDemoNodeKind, PixelIconName> = {
  agent: "bot",
  soul: "soul",
  rules: "rules",
  skill: "hammer",
  knowledge: "book",
  cron: "clock",
  result: "spark",
};

const NODE_STYLE: Record<LoginDemoNodeKind, string> = {
  agent: "border-primary/50 bg-primary/15 text-foreground",
  soul: "border-border/60 bg-secondary/80 text-foreground",
  rules: "border-border/60 bg-background text-muted-foreground",
  skill: "border-border/60 bg-secondary/70 text-foreground",
  knowledge: "border-primary/40 bg-primary/10 text-foreground",
  cron: "border-primary/45 bg-primary/12 text-primary",
  result: "border-primary/50 bg-primary/18 text-primary",
};

const STEP_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.28, ease: "linear" as const },
};

type ChatLine = LoginDemoMessage & { id: string };

/**
 * Preview mock pixel + sandbox scripted “en vivo”.
 * Badge SIMULACIÓN — honestidad comercial (sin API).
 */
export function LoginProductDemo({ className, liveFocusToken = 0 }: Props) {
  const reduceMotion = useReducedMotion();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [manualPaused, setManualPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [liveChat, setLiveChat] = useState<ChatLine[]>([
    {
      id: "welcome",
      role: "system",
      text: "Sandbox local · escribe vacaciones, ticket o cron",
    },
  ]);

  const paused = manualPaused || hoverPaused || liveMode;
  const step = LOGIN_DEMO_STEPS[stepIndex] ?? LOGIN_DEMO_STEPS[0];
  const stageIdx = LOGIN_DEMO_STAGES.indexOf(step.stage);
  const last = LOGIN_DEMO_STEPS.length - 1;

  useEffect(() => {
    if (reduceMotion) {
      setStepIndex(last);
      setManualPaused(true);
      return;
    }
    if (paused) return;
    const id = window.setInterval(() => {
      setStepIndex((i) => (i + 1) % LOGIN_DEMO_STEPS.length);
    }, LOGIN_DEMO_STEP_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, paused, last]);

  const enterLive = () => {
    setLiveMode(true);
    setManualPaused(true);
    window.setTimeout(() => inputRef.current?.focus(), 80);
    document.getElementById("live")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (liveFocusToken > 0) enterLive();
  }, [liveFocusToken]);

  useEffect(() => {
    const onEgg = () => enterLive();
    window.addEventListener(MUNINN_LIVE_DEMO_EVENT, onEgg);
    return () => window.removeEventListener(MUNINN_LIVE_DEMO_EVENT, onEgg);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ block: "nearest" });
  }, [liveChat, busy]);

  const goPrev = () => {
    setLiveMode(false);
    setManualPaused(true);
    setStepIndex((i) => (i <= 0 ? last : i - 1));
  };

  const goNext = () => {
    setLiveMode(false);
    setManualPaused(true);
    setStepIndex((i) => (i >= last ? 0 : i + 1));
  };

  const goStage = (i: number) => {
    setLiveMode(false);
    setManualPaused(true);
    setStepIndex(i);
  };

  const jumpStage = (hint?: LoginDemoStageId) => {
    if (!hint) return;
    const idx = LOGIN_DEMO_STAGES.indexOf(hint);
    if (idx >= 0) setStepIndex(idx);
  };

  const sendLive = () => {
    const text = draft.trim();
    if (!text || busy) return;
    setDraft("");
    const userId = `u-${Date.now()}`;
    setLiveChat((prev) => [...prev, { id: userId, role: "user", text }]);
    setBusy(true);

    const reply = resolveLiveSandboxReply(text);
    jumpStage(reply.stageHint);

    const pushRest = () => {
      const lines: ChatLine[] = [];
      if (reply.think) {
        lines.push({ id: `t-${Date.now()}`, role: "think", text: reply.think });
      }
      if (reply.system) {
        lines.push({ id: `s-${Date.now()}`, role: "system", text: reply.system });
      }
      lines.push({ id: `a-${Date.now()}`, role: "agent", text: reply.agent });
      setLiveChat((prev) => [...prev, ...lines]);
      setBusy(false);
    };

    if (reduceMotion) {
      pushRest();
    } else {
      window.setTimeout(pushRest, 480);
    }
  };

  const chatMessages: ChatLine[] = liveMode
    ? liveChat
    : step.messages.map((m, i) => ({ ...m, id: `demo-${stepIndex}-${i}` }));

  return (
    <div
      className={cn("w-full", className)}
      onMouseEnter={() => {
        if (!reduceMotion && !liveMode) setHoverPaused(true);
      }}
      onMouseLeave={() => setHoverPaused(false)}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="pixel-font border-2 border-primary/50 bg-primary/15 px-2 py-0.5 text-[8px] uppercase text-primary">
            Simulación
          </span>
          {!liveMode && (
            <button
              type="button"
              onClick={enterLive}
              className="pixel-font inline-flex items-center gap-1.5 border-2 border-border/60 bg-card px-2 py-1 text-[8px] uppercase text-foreground hover:border-primary/55 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <PixelIcon icon="play" className="h-3 w-3" />
              {LOGIN_LANDING_TRY_LIVE}
            </button>
          )}
          {liveMode && (
            <button
              type="button"
              onClick={() => setLiveMode(false)}
              className="pixel-font text-[8px] uppercase text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              ← Tour guiado
            </button>
          )}
        </div>
        {!reduceMotion && !liveMode && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={goPrev}
              className="inline-flex h-9 w-9 items-center justify-center border-2 border-border/55 bg-background text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:h-7 sm:w-7"
              aria-label="Paso anterior"
            >
              <PixelIcon icon="chevronLeft" className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setManualPaused((p) => !p)}
              className="pixel-font inline-flex h-9 items-center gap-1.5 border-2 border-border/55 bg-background px-2.5 text-[8px] uppercase text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:h-7 sm:px-2"
              aria-label={manualPaused ? "Reanudar demo" : "Pausar demo"}
            >
              <PixelIcon icon={manualPaused ? "play" : "pause"} className="h-3 w-3" />
              {manualPaused ? "Play" : "Pausa"}
            </button>
            <button
              type="button"
              onClick={goNext}
              className="inline-flex h-9 w-9 items-center justify-center border-2 border-border/55 bg-background text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:h-7 sm:w-7"
              aria-label="Paso siguiente"
            >
              <PixelIcon icon="chevronRight" className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="pixel-panel overflow-hidden border-2 border-border/55 bg-card">
        <div className="space-y-2.5 border-b-2 border-border/60 px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-muted-foreground/40" />
            <span className="h-2 w-2 bg-muted-foreground/30" />
            <span className="h-2 w-2 bg-muted-foreground/30" />
            {liveMode ? (
              <span className="pixel-font ml-auto text-[8px] uppercase text-primary">En vivo</span>
            ) : (
              paused &&
              !reduceMotion && (
                <span className="pixel-font ml-auto text-[7px] uppercase text-primary/80">
                  Pausado
                </span>
              )
            )}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {LOGIN_DEMO_STAGES.map((label, i) => {
              const done = i < stageIdx;
              const current = i === stageIdx;
              return (
                <span key={label} className="inline-flex items-center gap-1">
                  {i > 0 && (
                    <span
                      className={cn(
                        "mx-0.5 text-[9px]",
                        i <= stageIdx ? "text-primary/70" : "text-muted-foreground/35",
                      )}
                    >
                      →
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => goStage(i)}
                    className={cn(
                      "pixel-font border-2 px-1.5 py-0.5 text-[8px] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      done &&
                        !current &&
                        "border-primary/30 bg-primary/10 text-primary hover:bg-primary/15",
                      current && "border-primary/55 bg-primary/20 text-primary",
                      !done &&
                        !current &&
                        "border-transparent text-muted-foreground/45 hover:text-muted-foreground",
                    )}
                  >
                    {label}
                  </button>
                </span>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-0 sm:h-[22rem] sm:grid-cols-[1.05fr_0.95fr]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`left-${stepIndex}-${liveMode ? "live" : "tour"}`}
              className="flex min-h-[10rem] flex-col gap-3 overflow-hidden border-b-2 border-border/60 p-3.5 sm:border-b-0 sm:border-r-2"
              {...(reduceMotion ? {} : STEP_MOTION)}
            >
              <div className="space-y-1.5">
                <p className="pixel-display text-[15px] font-semibold text-foreground">
                  {liveMode ? "Sandbox · pregunta al agente" : step.title}
                </p>
                <p className="pixel-display text-[13px] leading-relaxed text-muted-foreground">
                  {liveMode
                    ? "Respuestas preescritas según la intención. Muestra cómo el harness elige RAG, helpers o cron."
                    : step.detail}
                </p>
              </div>

              {!liveMode && (
                <ul className="mt-1 flex flex-wrap gap-1.5">
                  {step.nodes.map((node) => (
                    <li
                      key={node.id}
                      className={cn(
                        "pixel-display inline-flex items-center gap-1.5 border-2 px-2 py-1 text-[12px]",
                        NODE_STYLE[node.kind],
                      )}
                    >
                      <PixelIcon
                        icon={NODE_ICON[node.kind]}
                        className="h-3.5 w-3.5 shrink-0 opacity-90"
                      />
                      <span>{node.label}</span>
                    </li>
                  ))}
                </ul>
              )}

              {liveMode && (
                <form
                  className="mt-auto flex gap-2 pt-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendLive();
                  }}
                >
                  <label htmlFor={inputId} className="sr-only">
                    Mensaje al agente (simulación)
                  </label>
                  <input
                    ref={inputRef}
                    id={inputId}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Ej: ¿cuántos días de vacaciones?"
                    disabled={busy}
                    className="pixel-display min-w-0 flex-1 border-2 border-border/60 bg-background px-2.5 py-2 text-[13px] text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={busy || !draft.trim()}
                    className="pixel-font shrink-0 border-2 border-primary bg-primary px-3 py-2 text-[9px] uppercase text-primary-foreground disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Enviar
                  </button>
                </form>
              )}

              {!liveMode && (
                <p className="pixel-font mt-auto pt-2 text-[8px] uppercase text-muted-foreground">
                  Paso {stepIndex + 1}/{LOGIN_DEMO_STEPS.length}
                  {!paused && !reduceMotion && (
                    <span className="ml-1.5 inline-block animate-pulse text-primary">■</span>
                  )}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex min-h-[12rem] flex-col gap-2 overflow-hidden p-3.5">
            <p className="pixel-font text-[8px] uppercase text-muted-foreground">Conversación</p>
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
              <AnimatePresence mode="popLayout" initial={false}>
                {chatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    layout={!reduceMotion}
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "pixel-display max-w-[98%] border-2 px-2.5 py-1.5 text-[13px] leading-snug",
                      msg.role === "user" &&
                        "self-end border-border/50 bg-secondary/80 text-foreground",
                      msg.role === "agent" &&
                        "self-start border-primary/35 bg-primary/15 text-foreground",
                      msg.role === "system" &&
                        "self-start border-border/50 bg-transparent text-[12px] text-muted-foreground",
                      msg.role === "think" &&
                        "self-start border-dashed border-primary/40 bg-primary/5 text-[12px] text-muted-foreground",
                    )}
                  >
                    {msg.role === "think" && (
                      <span className="pixel-font mb-0.5 block text-[7px] uppercase text-primary/80">
                        Razona
                      </span>
                    )}
                    {msg.text}
                  </motion.div>
                ))}
              </AnimatePresence>
              {busy && <p className="pixel-font text-[8px] uppercase text-primary">Pensando…</p>}
              <div ref={chatEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
