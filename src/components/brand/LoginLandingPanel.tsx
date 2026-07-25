import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LoginProductDemo } from "@/components/brand/LoginProductDemo";
import { PixelBoot } from "@/components/brand/LoginPixelBoot";
import { PixelIcon, type PixelIconName } from "@/components/brand/pixel-icons";
import { PixelRaven } from "@/components/brand/PixelRaven";
import {
  LOGIN_HARNESS_BLURB,
  LOGIN_HARNESS_REF,
  LOGIN_LANDING_CTA,
  LOGIN_LANDING_LEAD,
  LOGIN_LANDING_MODULES,
  LOGIN_LANDING_TAGLINE,
  type LoginLandingModuleId,
} from "@/lib/loginLanding";
import { cn } from "@/lib/utils";

/** Botón manito: “¿qué es un harness?” (después de “magia”). */
export function HarnessHintButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "pixel-harness-hand ml-1.5 inline-flex h-6 w-6 cursor-pointer items-center justify-center align-middle",
        "border-2 border-primary/55 bg-primary/15 text-primary",
        "hover:bg-primary/25 hover:border-primary",
        "active:translate-x-px active:translate-y-px",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className,
      )}
      aria-label="¿Qué es un harness?"
      title="¿Qué es un harness?"
    >
      <PixelIcon icon="hand" className="h-4 w-4" />
    </button>
  );
}

const MODULE_ICONS: Record<LoginLandingModuleId, PixelIconName> = {
  soul: "soul",
  rules: "rules",
  helpers: "hammer",
  rag: "book",
  model: "bot",
  cron: "clock",
};

/** Acento visual distinto por pieza del harness. */
const MODULE_TONE: Record<LoginLandingModuleId, string> = {
  soul: "text-primary border-primary/45",
  rules: "text-foreground border-border/70",
  helpers: "text-foreground border-border/70",
  rag: "text-primary border-primary/55",
  model: "text-primary border-primary/40",
  cron: "text-foreground border-border/70",
};

const BOOT_MS = 900;

type Props = {
  /** @deprecated Ya no se usa skeleton; se mantiene por compat. */
  loading?: boolean;
  compact?: boolean;
  className?: string;
};

function PixelEnter({
  children,
  delayMs = 0,
  pop = false,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delayMs?: number;
  pop?: boolean;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const reduceMotion = useReducedMotion();
  return (
    <Tag
      className={cn(reduceMotion ? undefined : pop ? "pixel-enter-pop" : "pixel-enter", className)}
      style={
        reduceMotion ? undefined : ({ "--pixel-delay": `${delayMs}ms` } as React.CSSProperties)
      }
    >
      {children}
    </Tag>
  );
}

/**
 * Pitch fijo en altura: tagline+lead O definición de harness (reemplazo, no apila).
 * Con `brand`, la marca (cuervo + MUNINN) vive dentro de la misma tarjeta —
 * un solo bloque compacto en vez de dos tarjetas apiladas.
 */
export function PitchSwap({ centered, brand }: { centered?: boolean; brand?: boolean }) {
  const reduceMotion = useReducedMotion();
  const [showHarness, setShowHarness] = useState(false);

  return (
    <div className={cn("w-full max-w-lg", centered && "mx-auto")}>
      <AnimatePresence mode="wait" initial={false}>
        {!showHarness ? (
          <motion.div
            key="pitch"
            className={cn("login-pixel-readout space-y-2.5", centered && "text-center")}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.15, ease: "linear" }}
          >
            {brand && (
              <div
                className={cn(
                  "flex items-end gap-2 border-b-2 border-border/40 pb-1.5",
                  centered && "justify-center",
                )}
              >
                <PixelRaven featured className="h-7 w-8 sm:h-8 sm:w-9" />
                <p className="pixel-font text-[0.95rem] leading-none text-foreground sm:text-[1.05rem]">
                  MUNINN
                </p>
              </div>
            )}
            <h1
              className={cn(
                "pixel-display text-[1.2rem] font-semibold leading-[1.25] text-foreground sm:text-[1.35rem]",
                centered && "px-1",
              )}
            >
              {LOGIN_LANDING_TAGLINE}
              <HarnessHintButton onClick={() => setShowHarness(true)} />
            </h1>
            <p
              className={cn(
                "pixel-display text-[13px] leading-relaxed text-muted-foreground",
                centered && "px-2",
              )}
            >
              {LOGIN_LANDING_LEAD}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="harness"
            className={cn(centered && "text-center")}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.15, ease: "linear" }}
          >
            <div className="pixel-harness-box space-y-2.5 text-left">
              <div className="flex items-start justify-between gap-2">
                <p className="pixel-font text-[9px] uppercase text-primary">¿Qué es un harness?</p>
                <button
                  type="button"
                  onClick={() => setShowHarness(false)}
                  className="pixel-font shrink-0 text-[8px] uppercase text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  ← Volver
                </button>
              </div>
              <p className="pixel-display text-[13px] leading-relaxed text-foreground">
                {LOGIN_HARNESS_BLURB}
              </p>
              <a
                href={LOGIN_HARNESS_REF.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-font inline-block text-[8px] uppercase text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Ref · {LOGIN_HARNESS_REF.label}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModuleGrid() {
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {LOGIN_LANDING_MODULES.map((m, i) => (
        <PixelEnter key={m.id} as="li" delayMs={40 * i} pop>
          <div
            className={cn(
              "flex items-start gap-2 border-2 bg-background/70 px-2.5 py-2",
              MODULE_TONE[m.id],
            )}
          >
            <PixelIcon icon={MODULE_ICONS[m.id]} className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0 space-y-0.5">
              <p className="pixel-display text-[12px] font-semibold leading-tight text-foreground">
                {m.title}
              </p>
              <p className="pixel-display text-[11px] leading-snug text-muted-foreground">
                {m.line}
              </p>
            </div>
          </div>
        </PixelEnter>
      ))}
    </ul>
  );
}

/**
 * Lista bajo el form — piezas del harness con explicación legible.
 */
export function LoginModuleList({ className }: { className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-2", className)}>
      {LOGIN_LANDING_MODULES.map((m, i) => (
        <PixelEnter key={m.id} as="li" delayMs={60 + 50 * i} pop>
          <div
            className={cn(
              "flex h-full min-h-[3rem] items-start gap-2 border-2 bg-card px-2.5 py-2",
              MODULE_TONE[m.id],
            )}
          >
            <PixelIcon icon={MODULE_ICONS[m.id]} className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0 space-y-0.5">
              <p className="pixel-display text-[12px] font-semibold leading-tight text-foreground">
                {m.title}
              </p>
              <p className="pixel-display text-[10px] leading-snug text-muted-foreground sm:text-[11px]">
                {m.line}
              </p>
            </div>
          </div>
        </PixelEnter>
      ))}
    </ul>
  );
}

/**
 * Tag compacto “Ver harness” → despliega Soul / Rules / Helpers / RAG…
 * Sin título largo ni grilla siempre visible.
 */
export function HarnessPeek({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("space-y-3", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "pixel-harness-tag pixel-font inline-flex items-center gap-2 border-2 px-2.5 py-1.5 text-[8px] uppercase",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          open
            ? "border-primary bg-primary/15 text-primary"
            : "border-border/70 bg-card text-muted-foreground hover:border-primary/55 hover:text-primary",
        )}
        aria-expanded={open}
      >
        <PixelIcon icon="hammer" className="h-3.5 w-3.5" />
        {open ? "Ocultar harness" : "Ver harness"}
        <span aria-hidden className="text-primary">
          {open ? "↑" : "→"}
        </span>
      </button>

      {open && (
        <div className="login-pixel-readout space-y-2 !p-2.5">
          <p className="pixel-font text-[7px] uppercase text-muted-foreground">Piezas del agente</p>
          <LoginModuleList />
        </div>
      )}
    </div>
  );
}

/**
 * Landing comercial Muninn — pitch + demo pixel.
 * Boot corto (barra pixel) → cascade de elementos, sin skeleton.
 */
export function LoginLandingPanel({ compact = false, className }: Props) {
  const reduceMotion = useReducedMotion();
  const [expanded, setExpanded] = useState(false);
  const [booted, setBooted] = useState(() => Boolean(reduceMotion));

  useEffect(() => {
    if (reduceMotion) {
      setBooted(true);
      return;
    }
    const t = window.setTimeout(() => setBooted(true), BOOT_MS);
    return () => window.clearTimeout(t);
  }, [reduceMotion]);

  if (compact) {
    return (
      <div className={cn("w-full space-y-4 px-1", className)}>
        {!booted ? (
          <PixelBoot centered />
        ) : (
          <>
            <PixelEnter delayMs={0} pop>
              <PitchSwap brand centered />
            </PixelEnter>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {LOGIN_LANDING_MODULES.slice(0, 4).map((m, i) => (
                <PixelEnter key={m.id} delayMs={140 + i * 55} pop>
                  <div
                    className={cn(
                      "flex items-start gap-2 border-2 bg-background/80 px-2.5 py-2",
                      MODULE_TONE[m.id],
                    )}
                  >
                    <PixelIcon icon={MODULE_ICONS[m.id]} className="mt-0.5 h-4 w-4 shrink-0" />
                    <div className="min-w-0 space-y-0.5">
                      <p className="pixel-display text-[12px] font-medium leading-tight text-foreground">
                        {m.title}
                      </p>
                      <p className="pixel-display text-[11px] leading-snug text-muted-foreground">
                        {m.line}
                      </p>
                    </div>
                  </div>
                </PixelEnter>
              ))}
            </div>

            <PixelEnter delayMs={380}>
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="pixel-font mx-auto flex items-center gap-1.5 text-[8px] uppercase text-primary hover:text-primary/80"
              >
                Ver qué incluye
                <PixelIcon
                  icon={expanded ? "chevronLeft" : "chevronRight"}
                  className={cn("h-3 w-3", expanded && "rotate-[-90deg]")}
                />
              </button>
            </PixelEnter>

            {expanded && (
              <div className="space-y-4 pt-1">
                <ModuleGrid />
                <LoginProductDemo className="mx-auto" />
              </div>
            )}

            <PixelEnter delayMs={440}>
              <Link
                to="/entrar"
                className="pixel-font mx-auto flex w-fit items-center gap-1.5 text-[9px] uppercase text-foreground"
              >
                {LOGIN_LANDING_CTA}
                <span aria-hidden className="text-primary">
                  →
                </span>
              </Link>
            </PixelEnter>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative z-[2] flex h-full min-h-0 flex-col justify-center gap-5 px-8 py-10 lg:px-10 lg:py-12 xl:px-12",
        className,
      )}
    >
      {!booted ? (
        <PixelBoot />
      ) : (
        <>
          <PixelEnter delayMs={0} pop>
            <PitchSwap brand />
          </PixelEnter>

          <PixelEnter delayMs={140} className="max-w-2xl">
            <LoginProductDemo />
          </PixelEnter>
        </>
      )}
    </div>
  );
}
