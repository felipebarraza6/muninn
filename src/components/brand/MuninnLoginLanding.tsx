import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HarnessPeek } from "@/components/brand/LoginLandingPanel";
import { LoginProductDemo } from "@/components/brand/LoginProductDemo";
import { PixelIcon, type PixelIconName } from "@/components/brand/pixel-icons";
import { PixelRaven } from "@/components/brand/PixelRaven";
import {
  LOGIN_ATOMS,
  LOGIN_AGENT_BEATS,
  LOGIN_HARNESS_REF,
  LOGIN_LANDING_CTA,
  LOGIN_LANDING_LEAD,
  LOGIN_LANDING_MODULES,
  LOGIN_LANDING_SEE_LIVE,
  LOGIN_OPERATE_STEPS,
  LOGIN_PLATFORM_BLURB,
  LOGIN_VALUE_BLOCKS,
  type LoginLandingModuleId,
} from "@/lib/loginLanding";
import { cn } from "@/lib/utils";

type SectionId = "hero" | "agente" | "tecnico" | "live" | "docs";

const SECTION_ORDER: SectionId[] = ["hero", "agente", "tecnico", "live", "docs"];

/** Mapping de sección → zona del background scene (LoginAtmosphere). */
const SECTION_ZONE: Record<SectionId, string> = {
  hero: "fjord",
  agente: "forest",
  tecnico: "mountains",
  live: "shore",
  docs: "moon",
};

const SECTION_LABEL: Record<SectionId, string> = {
  hero: "Muninn",
  agente: "Qué es",
  tecnico: "Agente",
  live: "Flujo",
  docs: "Docs",
};

const RAIL_ICON: Record<SectionId, PixelIconName> = {
  hero: "soul",
  agente: "hand",
  tecnico: "hammer",
  live: "play",
  docs: "book",
};

const ATOM_ICON: Record<LoginLandingModuleId, PixelIconName> = {
  soul: "soul",
  rules: "rules",
  helpers: "hammer",
  rag: "book",
  model: "bot",
  cron: "clock",
};

type Props = {
  className?: string;
  /** Ref externo para activar modo live (easter egg). */
  liveNonce?: number;
};

function SectionChrome({
  kicker,
  title,
  lead,
  id,
}: {
  kicker: string;
  title: string;
  lead?: string;
  id: string;
}) {
  return (
    <header className="space-y-2">
      <p className="pixel-font text-[10px] uppercase tracking-[0.14em] text-primary/80">{kicker}</p>
      <h2
        id={id}
        className="pixel-font text-[15px] uppercase leading-relaxed text-foreground sm:text-[16px]"
      >
        {title}
      </h2>
      {lead ? (
        <p className="pixel-display max-w-xl text-[14px] leading-relaxed text-muted-foreground">
          {lead}
        </p>
      ) : null}
    </header>
  );
}

function Reveal({
  children,
  className,
  delayMs = 0,
  /** pop = hero; fade = capítulos (menos repetición). */
  tone = "fade",
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  tone?: "pop" | "fade" | "none";
}) {
  const reduceMotion = useReducedMotion();
  const animClass =
    !reduceMotion && tone !== "none"
      ? tone === "pop"
        ? "pixel-enter-pop"
        : "pixel-enter-fade"
      : undefined;

  return (
    <div
      className={cn(animClass, className)}
      style={
        !reduceMotion && tone !== "none"
          ? ({ "--pixel-delay": `${delayMs}ms` } as CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}

function NavigationRail({
  active,
  onSelect,
}: {
  active: SectionId;
  onSelect: (id: SectionId) => void;
}) {
  return (
    <nav
      aria-label="Secciones Muninn"
      className="fixed left-3 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-3"
    >
      {SECTION_ORDER.map((id) => {
        const on = active === id;
        return (
          <div key={id} className="group flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelect(id)}
              aria-label={SECTION_LABEL[id]}
              aria-pressed={on}
              title={SECTION_LABEL[id]}
              className={cn(
                "pixel-jules-sm flex h-10 w-10 shrink-0 items-center justify-center border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                on
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border/50 bg-card/80 text-muted-foreground hover:border-primary/50 hover:text-primary",
              )}
            >
              <PixelIcon icon={RAIL_ICON[id]} className="h-5 w-5" />
            </button>
            <span
              className={cn(
                "pixel-font whitespace-nowrap text-[10px] uppercase tracking-[0.12em] transition-all duration-200 max-sm:hidden",
                on
                  ? "translate-x-0 text-primary/90 opacity-100"
                  : "-translate-x-1 text-transparent opacity-0 group-hover:translate-x-0 group-hover:text-muted-foreground/60 group-hover:opacity-100",
              )}
            >
              {SECTION_LABEL[id]}
            </span>
          </div>
        );
      })}
    </nav>
  );
}

function AtomJumpStrip({
  active,
  onSelect,
}: {
  active: LoginLandingModuleId | null;
  onSelect: (id: LoginLandingModuleId) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {LOGIN_ATOMS.map((a) => {
        const on = a.id === active;
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onSelect(a.id)}
            className={cn(
              "pixel-font pixel-jules-sm inline-flex items-center gap-1.5 border-2 px-2.5 py-1.5 text-[10px] uppercase",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              on
                ? "border-primary bg-primary/20 text-primary"
                : "border-border/55 bg-background text-muted-foreground hover:border-primary/45 hover:text-foreground",
            )}
            aria-pressed={on}
          >
            <PixelIcon icon={ATOM_ICON[a.id]} className="h-3.5 w-3.5" />
            {a.title}
          </button>
        );
      })}
    </div>
  );
}

function AtomSections({
  focused,
  onFocus,
}: {
  focused: LoginLandingModuleId | null;
  onFocus: (id: LoginLandingModuleId) => void;
}) {
  const jump = (id: LoginLandingModuleId) => {
    onFocus(id);
    const url = `#atom-${id}`;
    if (window.location.hash !== url) {
      history.replaceState(null, "", url);
    }
  };

  return (
    <div className="space-y-5">
      <AtomJumpStrip active={focused} onSelect={jump} />

      <ol className="space-y-4">
        {LOGIN_ATOMS.map((atom, i) => {
          const on = focused === atom.id;
          const flip = i % 2 === 1;
          return (
            <li key={atom.id}>
              <Reveal delayMs={i * 40}>
                <article
                  id={`atom-${atom.id}`}
                  className={cn(
                    "login-pixel-atom border-2 p-4 sm:p-5 pixel-jules-sm",
                    on
                      ? "border-primary bg-primary/10 shadow-[4px_4px_0_0_color-mix(in_oklab,var(--primary)_30%,transparent)]"
                      : "border-border/55 bg-card/80",
                  )}
                  aria-current={on ? "true" : undefined}
                >
                  <div
                    className={cn(
                      "grid gap-3 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]",
                      flip && "sm:[&>*:first-child]:order-2",
                    )}
                  >
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="pixel-jules-badge border-primary/50 bg-primary/15 text-primary">
                          <PixelIcon icon={ATOM_ICON[atom.id]} className="h-3.5 w-3.5" />
                          {atom.role}
                        </span>
                        <span className="pixel-font text-[10px] uppercase text-muted-foreground">
                          0{i + 1} / 0{LOGIN_ATOMS.length}
                        </span>
                      </div>
                      <h3 className="pixel-display text-[1.3rem] font-semibold text-foreground">
                        {atom.title}
                      </h3>
                      <p className="pixel-display text-[14px] leading-relaxed text-muted-foreground">
                        {atom.line}
                      </p>
                      <p className="pixel-display text-[14px] leading-relaxed text-foreground/90">
                        {atom.why}
                      </p>
                    </div>

                    <div className="space-y-2.5 border-2 border-primary/30 bg-background/70 p-4">
                      <div>
                        <p className="pixel-font mb-1 text-[9px] uppercase text-primary/80">
                          Ejemplo
                        </p>
                        <p className="pixel-display text-[14px] leading-relaxed text-foreground">
                          {atom.example}
                        </p>
                      </div>
                      <div className="border-t-2 border-primary/20 pt-2">
                        <p className="pixel-font mb-1 text-[9px] uppercase text-primary/80">
                          Técnico
                        </p>
                        <p className="pixel-display text-[14px] leading-relaxed text-muted-foreground">
                          {atom.tech}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          );
        })}
      </ol>

      <ol className="flex flex-wrap items-center gap-1.5 border-t-2 border-border/40 pt-3">
        {LOGIN_LANDING_MODULES.map((m, i) => (
          <li key={m.id} className="inline-flex items-center gap-1.5">
            {i > 0 && (
              <span className="pixel-font text-[12px] text-primary/60" aria-hidden>
                →
              </span>
            )}
            <button
              type="button"
              onClick={() => jump(m.id)}
              className={cn(
                "pixel-font pixel-jules-sm border-2 px-2.5 py-1 text-[10px] uppercase",
                m.id === focused
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/50 text-muted-foreground hover:text-foreground",
              )}
            >
              {m.title}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

function FlowSteps() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const current = LOGIN_OPERATE_STEPS[step] ?? LOGIN_OPERATE_STEPS[0];

  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % LOGIN_OPERATE_STEPS.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [reduceMotion, paused]);

  return (
    <div
      className="space-y-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <ol className="grid gap-2 sm:grid-cols-2">
        {LOGIN_OPERATE_STEPS.map((s, i) => {
          const on = i === step;
          return (
            <li key={s.n}>
              <button
                type="button"
                onClick={() => setStep(i)}
                className={cn(
                  "pixel-jules-sm h-full w-full border-2 p-3 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  on
                    ? "border-primary bg-primary/15 shadow-[3px_3px_0_0_color-mix(in_oklab,var(--primary)_35%,transparent)]"
                    : "border-border/55 bg-card hover:border-primary/40",
                )}
              >
                <span className="pixel-jules-step bg-primary text-primary-foreground mb-1.5">
                  {s.n}
                </span>
                <p className="pixel-display text-[15px] font-semibold text-foreground">{s.title}</p>
                <p className="pixel-display mt-1 text-[13px] leading-snug text-muted-foreground">
                  {s.line}
                </p>
              </button>
            </li>
          );
        })}
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.n}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: "linear" }}
          className="login-pixel-readout !p-4 pixel-jules-sm"
        >
          <p className="pixel-font text-[10px] uppercase text-primary">Paso {current.n}</p>
          <p className="pixel-display mt-1 text-[15px] font-semibold text-foreground">
            {current.title}
          </p>
          <p className="pixel-display mt-1 text-[14px] leading-relaxed text-muted-foreground">
            {current.line}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-2" aria-hidden>
        {LOGIN_OPERATE_STEPS.map((s, i) => (
          <span
            key={s.n}
            className={cn(
              "h-2 flex-1 border-2",
              i <= step ? "border-primary bg-primary" : "border-border/50 bg-transparent",
            )}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Landing comercial Muninn: rail izquierdo + secciones por estado (sin scroll-snap).
 */
export function MuninnLoginLanding({ className, liveNonce = 0 }: Props) {
  const [liveFocus, setLiveFocus] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionId>(() => {
    const hash = window.location.hash.replace("#", "");
    if (
      hash === "hero" ||
      hash === "agente" ||
      hash === "tecnico" ||
      hash === "live" ||
      hash === "docs"
    )
      return hash as SectionId;
    return "hero";
  });
  const [focusedAtom, setFocusedAtom] = useState<LoginLandingModuleId | null>("soul");
  const [selectedAtom, setSelectedAtom] = useState<LoginLandingModuleId | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (liveNonce > 0) setLiveFocus(liveNonce);
  }, [liveNonce]);

  // Pasa la zona activa al background scene (LoginAtmosphere) vía evento desacoplado.
  // También actualiza la URL hash para navegación real y recarga directa.
  useEffect(() => {
    const zone = SECTION_ZONE[activeSection];
    window.dispatchEvent(
      new CustomEvent("muninn-zone-change", { detail: { zone, section: activeSection } }),
    );
    const hash = activeSection === "hero" ? "" : activeSection;
    history.replaceState(null, "", hash ? `/#${hash}` : "/");
    // Reset scroll al cambiar de sección
    contentRef.current?.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [activeSection]);

  return (
    <div ref={rootRef} className={cn("relative z-[2] flex h-dvh overflow-hidden", className)}>
      <NavigationRail active={activeSection} onSelect={setActiveSection} />

      <div
        ref={contentRef}
        className="ml-12 flex flex-1 flex-col overflow-y-auto px-4 pb-4 pt-16 sm:ml-16 sm:p-8"
      >
        <div className="flex min-h-0 flex-1 items-start justify-center">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, filter: "blur(8px)", y: 14 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(6px)", y: -14 }}
              transition={{ duration: 0.35, ease: [0.45, 0, 0.2, 1] }}
              className="flex w-full max-w-3xl flex-col"
            >
              {activeSection === "hero" && (
                <section
                  id="hero"
                  className="relative flex min-h-[70dvh] flex-col items-center justify-center gap-5 px-4 text-center sm:min-h-0"
                  aria-label="Muninn"
                >
                  <Reveal tone="pop">
                    <div className="flex flex-col items-center gap-4">
                      <PixelRaven featured className="h-20 w-20 sm:h-28 sm:w-28" />
                      <p className="pixel-font text-2xl uppercase tracking-[0.2em] text-foreground [text-shadow:0_2px_10px_var(--nordic-sky-0,#010204)] sm:text-3xl">
                        MUNINN
                      </p>
                    </div>
                  </Reveal>

                  <Reveal tone="fade" delayMs={60}>
                    <div className="mx-auto max-w-xl space-y-3 rounded-sm bg-background/25 px-4 py-3 backdrop-blur-md sm:bg-background/15 sm:px-6 sm:py-4 sm:backdrop-blur-sm">
                      <p className="pixel-display text-[16px] leading-relaxed text-foreground/95 [text-shadow:0_2px_12px_var(--nordic-sky-0,#010204)] sm:text-[18px]">
                        Crea, opera y supervisa tu agente de IA
                        <br />
                        con claridad total.{" "}
                        <span className="text-primary [text-shadow:0_1px_8px_color-mix(in_oklab,var(--primary)_30%,transparent)]">
                          Sin cajas negras.
                        </span>
                      </p>
                    </div>
                  </Reveal>
                </section>
              )}

              {activeSection === "agente" && (
                <section
                  id="agente"
                  className="flex flex-col items-center gap-6 text-center"
                  aria-labelledby="muninn-with-you"
                >
                  <Reveal tone="pop">
                    <div className="flex flex-col items-center gap-3">
                      <div className="space-y-1">
                        <p className="pixel-font text-[14px] uppercase tracking-[0.15em] text-primary sm:text-[15px]">
                          ¿Qué es Muninn?
                        </p>
                        <p className="pixel-display text-[18px] font-semibold leading-snug text-foreground sm:text-[22px]">
                          El agente que ves funcionar
                        </p>
                        <p className="pixel-display mx-auto max-w-lg text-[13px] text-muted-foreground sm:text-[14px]">
                          Una plataforma completa para crear, operar y supervisar agentes de IA con
                          total transparencia.
                        </p>
                      </div>
                    </div>
                  </Reveal>
                  <ul className="grid w-full max-w-2xl gap-2 sm:grid-cols-3">
                    {LOGIN_AGENT_BEATS.map((b, i) => (
                      <li key={b.id}>
                        <Reveal delayMs={i * 70}>
                          <div className="border border-primary/20 bg-card/60 pixel-jules-sm p-3 text-left sm:p-4">
                            <p className="pixel-font mb-1 text-[11px] uppercase text-primary/80">
                              0{i + 1}
                            </p>
                            <p className="pixel-display mb-1 text-[14px] font-semibold text-foreground">
                              {b.title}
                            </p>
                            <p className="pixel-display text-[12px] leading-relaxed text-muted-foreground">
                              {b.line}
                            </p>
                          </div>
                        </Reveal>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {activeSection === "tecnico" && (
                <>
                  {/* DESKTOP: diagrama orbital + columna texto */}
                  <section
                    id="tecnico"
                    className="hidden w-full max-w-3xl flex-row items-center justify-center gap-8 px-4 sm:flex"
                    aria-labelledby="muninn-flow"
                  >
                    <Reveal tone="pop" className="flex-1">
                      <div className="border border-primary/25 bg-card/80 pixel-jules-sm space-y-3 p-4">
                        <div>
                          <p className="pixel-font text-[14px] uppercase tracking-[0.15em] text-primary sm:text-[16px]">
                            Componentes del agente
                          </p>
                          <p className="pixel-display mt-1 text-[12px] leading-relaxed text-muted-foreground sm:text-[13px]">
                            Muninn no es magia: son piezas operables que trabajan juntas para darle
                            vida a tu agente.
                          </p>
                        </div>
                        <ul className="space-y-1.5">
                          {LOGIN_ATOMS.map((a) => (
                            <li key={a.id} className="flex items-start gap-2">
                              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-primary/40 bg-primary/10">
                                <PixelIcon
                                  icon={ATOM_ICON[a.id]}
                                  className="h-3 w-3 text-primary"
                                />
                              </span>
                              <div>
                                <span className="pixel-font text-[10px] uppercase text-foreground sm:text-[11px]">
                                  {a.title}
                                </span>
                                <p className="pixel-display text-[11px] leading-snug text-muted-foreground sm:text-[12px]">
                                  {a.line}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Reveal>
                    <Reveal delayMs={30} tone="none" className="flex items-center justify-center">
                      <div className="relative h-[360px] w-[380px]">
                        <svg
                          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
                          viewBox="0 0 380 360"
                          aria-hidden
                        >
                          <line
                            x1="114"
                            y1="52"
                            x2="190"
                            y2="180"
                            stroke="var(--primary)"
                            strokeOpacity="0.2"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                            className="pixel-energy-line"
                          />
                          <line
                            x1="266"
                            y1="52"
                            x2="190"
                            y2="180"
                            stroke="var(--primary)"
                            strokeOpacity="0.2"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                            className="pixel-energy-line"
                          />
                          <line
                            x1="78"
                            y1="170"
                            x2="190"
                            y2="180"
                            stroke="var(--primary)"
                            strokeOpacity="0.15"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                            className="pixel-energy-line pixel-energy-line--slow"
                          />
                          <line
                            x1="302"
                            y1="170"
                            x2="190"
                            y2="180"
                            stroke="var(--primary)"
                            strokeOpacity="0.15"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                            className="pixel-energy-line pixel-energy-line--slow"
                          />
                          <line
                            x1="114"
                            y1="308"
                            x2="190"
                            y2="180"
                            stroke="var(--primary)"
                            strokeOpacity="0.2"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                            className="pixel-energy-line"
                          />
                          <line
                            x1="266"
                            y1="308"
                            x2="190"
                            y2="180"
                            stroke="var(--primary)"
                            strokeOpacity="0.2"
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                            className="pixel-energy-line"
                          />
                        </svg>
                        {[
                          { pos: "left-[36px] top-[8px]", i: 0 },
                          { pos: "right-[36px] top-[8px]", i: 1 },
                          { pos: "left-0 top-[148px]", i: 2 },
                          { pos: "right-0 top-[148px]", i: 3 },
                          { pos: "bottom-[8px] left-[36px]", i: 4 },
                          { pos: "bottom-[8px] right-[36px]", i: 5 },
                        ].map(({ pos, i }) => (
                          <button
                            key={LOGIN_ATOMS[i].id}
                            type="button"
                            onClick={() => setSelectedAtom(LOGIN_ATOMS[i].id)}
                            className={`absolute ${pos} z-[2] flex w-[78px] cursor-pointer flex-col items-center gap-1 border border-primary/30 bg-card pixel-jules-sm px-1.5 py-2.5 transition-colors hover:border-primary/70 hover:bg-primary/10`}
                          >
                            <div
                              className="pixel-node-pulse"
                              style={{ animationDelay: `${i * 0.3}s` }}
                            >
                              <PixelIcon
                                icon={ATOM_ICON[LOGIN_ATOMS[i].id]}
                                className="h-5 w-5 text-primary/80"
                              />
                            </div>
                            <span className="pixel-font text-[8px] uppercase text-primary/70">
                              {LOGIN_ATOMS[i].title}
                            </span>
                          </button>
                        ))}
                        <div className="absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 border-2 border-primary/60 bg-card px-4 py-3 pixel-agent-core">
                          <svg
                            viewBox="0 0 52 28"
                            className="h-[32px] w-[60px]"
                            shapeRendering="crispEdges"
                            aria-hidden
                          >
                            <rect
                              x="20"
                              y="8"
                              width="12"
                              height="12"
                              fill="color-mix(in oklab,var(--primary) 40%,transparent)"
                            />
                            <rect x="22" y="10" width="8" height="8" fill="var(--primary)" />
                            <rect
                              x="10"
                              y="4"
                              width="6"
                              height="3"
                              fill="color-mix(in oklab,var(--primary) 25%,transparent)"
                            />
                            <rect
                              x="36"
                              y="4"
                              width="6"
                              height="3"
                              fill="color-mix(in oklab,var(--primary) 25%,transparent)"
                            />
                            <rect
                              x="2"
                              y="16"
                              width="6"
                              height="3"
                              fill="color-mix(in oklab,var(--primary) 20%,transparent)"
                            />
                            <rect
                              x="44"
                              y="16"
                              width="6"
                              height="3"
                              fill="color-mix(in oklab,var(--primary) 20%,transparent)"
                            />
                            <rect
                              x="10"
                              y="22"
                              width="6"
                              height="3"
                              fill="color-mix(in oklab,var(--primary) 25%,transparent)"
                            />
                            <rect
                              x="36"
                              y="22"
                              width="6"
                              height="3"
                              fill="color-mix(in oklab,var(--primary) 25%,transparent)"
                            />
                            <rect
                              x="16"
                              y="10"
                              width="4"
                              height="1"
                              fill="color-mix(in oklab,var(--primary) 15%,transparent)"
                            />
                            <rect
                              x="32"
                              y="10"
                              width="4"
                              height="1"
                              fill="color-mix(in oklab,var(--primary) 15%,transparent)"
                            />
                            <rect
                              x="12"
                              y="16"
                              width="8"
                              height="1"
                              fill="color-mix(in oklab,var(--primary) 12%,transparent)"
                            />
                            <rect
                              x="32"
                              y="16"
                              width="8"
                              height="1"
                              fill="color-mix(in oklab,var(--primary) 12%,transparent)"
                            />
                            <rect
                              x="16"
                              y="20"
                              width="4"
                              height="1"
                              fill="color-mix(in oklab,var(--primary) 15%,transparent)"
                            />
                            <rect
                              x="32"
                              y="20"
                              width="4"
                              height="1"
                              fill="color-mix(in oklab,var(--primary) 15%,transparent)"
                            />
                          </svg>
                          <span className="pixel-font text-[8px] uppercase text-foreground/80 leading-tight">
                            Agente
                            <br />
                            Muninn
                          </span>
                        </div>
                      </div>
                    </Reveal>
                  </section>

                  {/* MOBILE: galería vertical de componentes + agente al final */}
                  <section
                    id="tecnico-mobile"
                    className="flex w-full max-w-xs flex-col gap-3 px-4 sm:hidden"
                    aria-labelledby="muninn-flow-mobile"
                  >
                    <p className="pixel-font text-[13px] uppercase tracking-[0.15em] text-primary">
                      Componentes del agente
                    </p>
                    <p className="pixel-display text-[12px] leading-relaxed text-muted-foreground">
                      Muninn no es magia: son piezas operables que trabajan juntas.
                    </p>
                    <div className="flex flex-col gap-2">
                      {LOGIN_ATOMS.map((a, i) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => setSelectedAtom(a.id)}
                          className="flex w-full items-center gap-2.5 border border-primary/25 bg-card/80 pixel-jules-sm px-3 py-2.5 text-left transition-colors hover:border-primary/60 hover:bg-primary/5"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-primary/40 bg-primary/10">
                            <PixelIcon icon={ATOM_ICON[a.id]} className="h-4 w-4 text-primary" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <span className="pixel-font block text-[10px] uppercase text-foreground">
                              {a.title}
                            </span>
                            <span className="pixel-display block text-[11px] leading-snug text-muted-foreground">
                              {a.line}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {activeSection === "live" && (
                <section
                  id="live"
                  className="flex w-full flex-col justify-center px-1 pb-20 pt-2 max-sm:self-start"
                >
                  <Reveal tone="none" className="w-full">
                    <LoginProductDemo liveFocusToken={liveFocus} demoOnly />
                  </Reveal>
                </section>
              )}

              {activeSection === "docs" && (
                <section
                  id="docs"
                  className="flex w-full max-w-3xl flex-col gap-3 px-2 py-4 sm:items-center sm:justify-center sm:gap-4 sm:px-4 sm:py-6 max-sm:self-start"
                  aria-labelledby="muninn-docs"
                >
                  <Reveal tone="pop" className="w-full">
                    <div className="text-center">
                      <p className="pixel-font text-[14px] uppercase tracking-[0.15em] text-primary sm:text-[15px]">
                        MUNINN PLATFORM REST
                      </p>
                      <p className="pixel-display mt-1 text-[13px] leading-relaxed text-muted-foreground max-w-lg mx-auto">
                        {LOGIN_PLATFORM_BLURB}
                      </p>
                    </div>
                  </Reveal>

                  <Reveal delayMs={30} tone="fade" className="w-full">
                    <ul className="grid grid-cols-2 gap-2">
                      {LOGIN_VALUE_BLOCKS.map((b) => (
                        <li
                          key={b.id}
                          className="pixel-jules-sm border border-border/40 bg-card/80 p-3"
                        >
                          <p className="pixel-jules-badge border-primary bg-primary/15 text-primary w-fit">
                            {b.title}
                          </p>
                          <p className="pixel-display mt-1 text-[13px] leading-relaxed text-muted-foreground">
                            {b.line}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </Reveal>

                  <Reveal delayMs={50} tone="fade" className="w-full space-y-3">
                    <div className="space-y-1">
                      <p className="pixel-font text-[11px] uppercase text-muted-foreground sm:text-[12px]">
                        Harness
                      </p>
                      <p className="pixel-display text-[13px] leading-relaxed text-foreground/90">
                        El harness es el motor que orquesta alma, reglas, herramientas,
                        conocimiento, modelo y automatización. Todo lo que define a tu agente vive
                        aquí, versionado y visible.
                      </p>
                      <a
                        href={LOGIN_HARNESS_REF.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pixel-font inline-flex items-center gap-1 text-[9px] uppercase text-primary/70 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <PixelIcon icon="book" className="h-3 w-3" />
                        {LOGIN_HARNESS_REF.label}
                      </a>
                    </div>
                    <HarnessPeek />
                  </Reveal>
                </section>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Modal de detalle de elemento del agente */}
        <AnimatePresence>
          {selectedAtom &&
            (() => {
              const atom = LOGIN_ATOMS.find((a) => a.id === selectedAtom)!;
              return (
                <motion.div
                  key="atom-modal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm"
                  onClick={() => setSelectedAtom(null)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="relative w-full max-w-md border-2 border-primary/40 bg-card pixel-jules-sm p-5 shadow-[6px_6px_0_0_color-mix(in_oklab,var(--primary)_25%,transparent)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedAtom(null)}
                      className="pixel-font absolute right-2 top-2 flex h-7 w-7 items-center justify-center border border-border/50 text-[11px] uppercase text-muted-foreground hover:border-primary/50 hover:text-primary"
                      aria-label="Cerrar"
                    >
                      ✕
                    </button>

                    <div className="mb-3 flex items-center gap-2.5 border-b border-border/30 pb-3">
                      <div className="flex h-9 w-9 items-center justify-center border-2 border-primary/40 bg-primary/10">
                        <PixelIcon icon={ATOM_ICON[atom.id]} className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="pixel-jules-badge border-primary/40 bg-primary/15 text-primary text-[9px]">
                          {atom.role}
                        </p>
                        <p className="pixel-display text-[18px] font-semibold text-foreground">
                          {atom.title}
                        </p>
                      </div>
                    </div>

                    <p className="pixel-display mb-3 text-[14px] leading-relaxed text-foreground/90">
                      {atom.why}
                    </p>

                    <div className="mb-2 border-l-2 border-primary/30 bg-primary/5 px-3 py-2">
                      <p className="pixel-font mb-0.5 text-[9px] uppercase text-primary/70">
                        Ejemplo
                      </p>
                      <p className="pixel-display text-[13px] leading-relaxed text-foreground/85">
                        {atom.example}
                      </p>
                    </div>

                    <div className="border-t border-border/20 pt-2">
                      <p className="pixel-font text-[8px] uppercase text-muted-foreground">
                        {atom.tech}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })()}
        </AnimatePresence>
      </div>
    </div>
  );
}
