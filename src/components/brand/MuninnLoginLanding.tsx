import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HarnessPeek, PitchSwap } from "@/components/brand/LoginLandingPanel";
import { LoginProductDemo } from "@/components/brand/LoginProductDemo";
import { PixelBoot } from "@/components/brand/LoginPixelBoot";
import { PixelIcon, type PixelIconName } from "@/components/brand/pixel-icons";
import {
  LOGIN_ATOMS,
  LOGIN_COMPANION_BEATS,
  LOGIN_HARNESS_REF,
  LOGIN_LANDING_CTA,
  LOGIN_LANDING_MODULES,
  LOGIN_LANDING_NAV,
  LOGIN_LANDING_SEE_LIVE,
  LOGIN_OPERATE_STEPS,
  LOGIN_PLATFORM_BLURB,
  LOGIN_VALUE_BLOCKS,
  type LoginLandingModuleId,
} from "@/lib/loginLanding";
import { dispatchMuninnLiveDemo } from "@/lib/muninnLiveDemo";
import { cn } from "@/lib/utils";

const SECTION_NAV = LOGIN_LANDING_NAV.filter((n) => n.href.startsWith("#"));

const BOOT_MS = 900;

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

function parseAtomHash(raw: string): LoginLandingModuleId | null {
  const cleaned = raw.replace(/^#/, "");
  const m =
    cleaned.match(/^atomos[=-](\w+)$/) ||
    cleaned.match(/^atom-(\w+)$/) ||
    cleaned.match(/^atomos\/(\w+)$/);
  if (!m) return null;
  const id = m[1] as LoginLandingModuleId;
  return LOGIN_ATOMS.some((a) => a.id === id) ? id : null;
}

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
      <p className="pixel-font text-[8px] uppercase tracking-[0.14em] text-primary/80">{kicker}</p>
      <h2
        id={id}
        className="pixel-font text-[12px] uppercase leading-relaxed text-foreground sm:text-[13px]"
      >
        {title}
      </h2>
      {lead ? (
        <p className="pixel-display max-w-xl text-[13px] leading-relaxed text-muted-foreground">
          {lead}
        </p>
      ) : null}
    </header>
  );
}

function ChapterRule({ label }: { label: string }) {
  return (
    <div className="login-pixel-chapter-rule" aria-hidden>
      <span className="pixel-font text-[7px] uppercase tracking-[0.16em] text-primary/70">
        {label}
      </span>
      <span className="login-pixel-chapter-rule__line" />
    </div>
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
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(() => Boolean(reduceMotion) || tone === "none");

  useEffect(() => {
    if (reduceMotion || tone === "none") {
      setOn(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setOn(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduceMotion, tone]);

  const animClass =
    on && !reduceMotion && tone !== "none"
      ? tone === "pop"
        ? "pixel-enter-pop"
        : "pixel-enter-fade"
      : undefined;

  return (
    <div
      ref={ref}
      className={cn(animClass, className)}
      style={
        on && !reduceMotion && tone !== "none"
          ? ({ "--pixel-delay": `${delayMs}ms` } as CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}

function NavLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  if (href.startsWith("/")) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

function LandingNav({ active, progress }: { active: string; progress: number }) {
  const sectionItems = LOGIN_LANDING_NAV.filter((n) => !n.href.startsWith("/"));
  const authItem = LOGIN_LANDING_NAV.find((n) => n.href.startsWith("/"));
  const activeIdx = Math.max(
    0,
    sectionItems.findIndex((n) => n.id === active),
  );

  return (
    <nav
      aria-label="Secciones Muninn"
      className="login-pixel-nav sticky top-3 z-20 mb-8 hidden lg:block"
    >
      <div className="login-pixel-nav__rail border-2 border-border/60 bg-card p-1.5 shadow-[3px_3px_0_0_color-mix(in_oklab,var(--foreground)_14%,transparent)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ul className="relative flex flex-wrap gap-1.5">
            {sectionItems.map((item) => {
              const on = active === item.id;
              return (
                <li key={item.id}>
                  <NavLink
                    href={item.href}
                    className={cn(
                      "pixel-font relative inline-flex min-h-8 items-center px-2.5 text-[8px] uppercase transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      on
                        ? "border-2 border-primary/70 bg-primary/15 text-primary"
                        : "border-2 border-transparent text-muted-foreground hover:border-primary/40 hover:text-primary",
                    )}
                  >
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
            <li
              className="login-pixel-nav__thumb pointer-events-none absolute bottom-0 left-0 h-0.5 bg-primary transition-transform duration-300 ease-out"
              style={{
                width: `${100 / Math.max(sectionItems.length, 1)}%`,
                transform: `translateX(${activeIdx * 100}%)`,
              }}
              aria-hidden
            />
          </ul>
          {authItem ? (
            <NavLink
              href={authItem.href}
              className="pixel-font inline-flex min-h-8 items-center border-2 border-primary bg-primary px-3 text-[8px] uppercase text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {authItem.label}
            </NavLink>
          ) : null}
        </div>
        <div
          className="login-pixel-nav__progress mt-1.5 h-1.5 border-2 border-border/40 bg-background"
          role="presentation"
        >
          <span
            className="block h-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    </nav>
  );
}

function MobileSectionJump({ active, progress }: { active: string; progress: number }) {
  return (
    <div className="mb-5 lg:hidden">
      <div className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {LOGIN_LANDING_NAV.filter((n) => n.id !== "hero").map((item) => {
          const on = active === item.id;
          const isAuth = item.href.startsWith("/");
          return (
            <NavLink
              key={item.id}
              href={item.href}
              className={cn(
                "pixel-font shrink-0 border-2 px-2.5 py-1.5 text-[8px] uppercase",
                isAuth
                  ? "border-primary bg-primary text-primary-foreground"
                  : on
                    ? "border-primary/70 bg-primary/15 text-primary"
                    : "border-border/60 bg-card text-muted-foreground",
              )}
            >
              {item.label}
            </NavLink>
          );
        })}
      </div>
      <div className="mt-1.5 h-1 border-2 border-border/40 bg-background" role="presentation">
        <span
          className="block h-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </div>
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
              "pixel-font inline-flex items-center gap-1.5 border-2 px-2.5 py-1.5 text-[8px] uppercase",
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
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const applyHash = () => {
      const id = parseAtomHash(window.location.hash);
      if (!id) return;
      onFocus(id);
      window.requestAnimationFrame(() => {
        document.getElementById(`atom-${id}`)?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [onFocus, reduceMotion]);

  useEffect(() => {
    const nodes = LOGIN_ATOMS.map((a) => document.getElementById(`atom-${a.id}`)).filter(
      (n): n is HTMLElement => Boolean(n),
    );
    if (!nodes.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0]?.target.id?.replace(/^atom-/, "") as
          | LoginLandingModuleId
          | undefined;
        if (top && LOGIN_ATOMS.some((a) => a.id === top)) onFocus(top);
      },
      { rootMargin: "-25% 0px -50% 0px", threshold: [0.2, 0.45] },
    );
    for (const n of nodes) obs.observe(n);
    return () => obs.disconnect();
  }, [onFocus]);

  const jump = (id: LoginLandingModuleId) => {
    onFocus(id);
    const url = `#atom-${id}`;
    if (window.location.hash !== url) {
      history.replaceState(null, "", url);
    }
    document.getElementById(`atom-${id}`)?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
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
                    "login-pixel-atom scroll-mt-28 border-2 p-3 sm:p-4",
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
                        <span className="pixel-font inline-flex items-center gap-1.5 border-2 border-primary/50 bg-primary/15 px-2 py-1 text-[8px] uppercase text-primary">
                          <PixelIcon icon={ATOM_ICON[atom.id]} className="h-3.5 w-3.5" />
                          {atom.role}
                        </span>
                        <span className="pixel-font text-[8px] uppercase text-muted-foreground">
                          0{i + 1} / 0{LOGIN_ATOMS.length}
                        </span>
                      </div>
                      <h3 className="pixel-display text-[1.2rem] font-semibold text-foreground">
                        {atom.title}
                      </h3>
                      <p className="pixel-display text-[13px] leading-relaxed text-muted-foreground">
                        {atom.line}
                      </p>
                      <p className="pixel-display text-[13px] leading-relaxed text-foreground/90">
                        {atom.why}
                      </p>
                    </div>

                    <div className="space-y-2.5 border-2 border-primary/30 bg-background/70 p-3">
                      <div>
                        <p className="pixel-font mb-1 text-[7px] uppercase text-primary/80">
                          Ejemplo
                        </p>
                        <p className="pixel-display text-[12px] leading-relaxed text-foreground">
                          {atom.example}
                        </p>
                      </div>
                      <div className="border-t-2 border-primary/20 pt-2">
                        <p className="pixel-font mb-1 text-[7px] uppercase text-primary/80">
                          Técnico
                        </p>
                        <p className="pixel-display text-[12px] leading-relaxed text-muted-foreground">
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
              <span className="pixel-font text-[10px] text-primary/60" aria-hidden>
                →
              </span>
            )}
            <button
              type="button"
              onClick={() => jump(m.id)}
              className={cn(
                "pixel-font border-2 px-2 py-1 text-[8px] uppercase",
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
                  "h-full w-full border-2 px-3 py-2.5 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  on
                    ? "border-primary bg-primary/15 shadow-[3px_3px_0_0_color-mix(in_oklab,var(--primary)_35%,transparent)]"
                    : "border-border/55 bg-card hover:border-primary/40",
                )}
              >
                <p className="pixel-font text-[8px] text-primary">{s.n}</p>
                <p className="pixel-display text-[14px] font-semibold text-foreground">{s.title}</p>
                <p className="pixel-display mt-1 text-[12px] leading-snug text-muted-foreground">
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
          className="login-pixel-readout !p-3"
        >
          <p className="pixel-font text-[8px] uppercase text-primary">Paso {current.n}</p>
          <p className="pixel-display mt-1 text-[14px] font-semibold text-foreground">
            {current.title}
          </p>
          <p className="pixel-display mt-1 text-[12px] leading-relaxed text-muted-foreground">
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
 * Landing comercial Muninn: nav + átomos + flujo + live + valor + docs.
 */
export function MuninnLoginLanding({ className, liveNonce = 0 }: Props) {
  const reduceMotion = useReducedMotion();
  const [booted, setBooted] = useState(() => Boolean(reduceMotion));
  const [liveFocus, setLiveFocus] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [focusedAtom, setFocusedAtom] = useState<LoginLandingModuleId | null>("soul");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion) {
      setBooted(true);
      return;
    }
    const t = window.setTimeout(() => setBooted(true), BOOT_MS);
    return () => window.clearTimeout(t);
  }, [reduceMotion]);

  useEffect(() => {
    if (liveNonce > 0) setLiveFocus(liveNonce);
  }, [liveNonce]);

  useEffect(() => {
    if (!booted) return;
    const ids = SECTION_NAV.map((n) => n.id);
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (!nodes.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0]?.target.id;
        if (top) setActiveSection(top);
      },
      { rootMargin: "-18% 0px -52% 0px", threshold: [0.12, 0.3, 0.5] },
    );

    for (const n of nodes) obs.observe(n);
    return () => obs.disconnect();
  }, [booted]);

  useEffect(() => {
    if (!booted) return;
    const onScroll = () => {
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = Math.max(el.scrollHeight - window.innerHeight, 1);
      const traveled = Math.min(Math.max(-rect.top, 0), total);
      setScrollProgress(traveled / total);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [booted]);

  if (!booted) {
    return (
      <div className={cn("flex min-h-[50vh] items-center px-8 py-10", className)}>
        <PixelBoot />
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative z-[2] flex flex-col px-6 py-10 sm:px-8 lg:px-10 lg:py-12 xl:px-12",
        className,
      )}
    >
      <LandingNav active={activeSection} progress={scrollProgress} />
      <MobileSectionJump active={activeSection} progress={scrollProgress} />

      <div className="flex flex-col gap-20 lg:gap-28">
        {/* Hero — compañero primero */}
        <section
          id="hero"
          className="scroll-mt-24 flex min-h-[88vh] flex-col items-center justify-end space-y-6 pb-8 pt-12 text-center sm:min-h-[92vh] lg:min-h-[100vh] lg:scroll-mt-28 lg:justify-center lg:pb-14"
          aria-label="Muninn"
        >
          <Reveal tone="pop">
            <div className="mx-auto max-w-2xl space-y-4">
              <PitchSwap brand centered />
            </div>
          </Reveal>
          <Reveal tone="pop" delayMs={80}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/entrar"
                className="pixel-font inline-flex items-center gap-1.5 border-2 border-primary bg-primary px-4 py-2.5 text-[9px] uppercase text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {LOGIN_LANDING_CTA}
                <span aria-hidden>→</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  dispatchMuninnLiveDemo();
                  document.getElementById("live")?.scrollIntoView({
                    behavior: reduceMotion ? "auto" : "smooth",
                    block: "start",
                  });
                }}
                className="pixel-font inline-flex items-center gap-1.5 border-2 border-border/70 bg-card/90 px-3 py-2.5 text-[9px] uppercase text-foreground hover:border-primary/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {LOGIN_LANDING_SEE_LIVE}
              </button>
              <a
                href="#contigo"
                className="pixel-font inline-flex items-center gap-1.5 text-[9px] uppercase text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Qué hace contigo
              </a>
            </div>
          </Reveal>
        </section>

        {/* Contigo — presencia diaria */}
        <section
          id="contigo"
          className="scroll-mt-24 space-y-5 lg:scroll-mt-28"
          aria-labelledby="muninn-with-you"
        >
          <ChapterRule label="Cap. 01" />
          <Reveal>
            <SectionChrome
              kicker="Capítulo 01"
              title="Qué hace contigo"
              id="muninn-with-you"
              lead="Muninn no es un chatbot suelto: es un compañero operable que te acompaña en el trabajo diario."
            />
          </Reveal>
          <ul className="grid gap-3 sm:grid-cols-3">
            {LOGIN_COMPANION_BEATS.map((b, i) => (
              <li key={b.id}>
                <Reveal delayMs={i * 60}>
                  <div className="login-pixel-readout space-y-1.5 !p-3">
                    <p className="pixel-font text-[8px] uppercase text-primary">0{i + 1}</p>
                    <p className="pixel-display text-[14px] font-semibold text-foreground">
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

        {/* Flujo */}
        <section
          id="flujo"
          className="scroll-mt-24 space-y-5 lg:scroll-mt-28"
          aria-labelledby="muninn-flow"
        >
          <ChapterRule label="Cap. 02" />
          <Reveal>
            <SectionChrome
              kicker="Capítulo 02"
              title="Cómo se opera"
              id="muninn-flow"
              lead="De diseñar a programar: el mismo compañero sirve en chat o por cron."
            />
          </Reveal>
          <Reveal delayMs={40} tone="none">
            <FlowSteps />
          </Reveal>
        </section>

        {/* Átomos — harness técnico */}
        <section
          id="atomos"
          className="scroll-mt-24 space-y-5 lg:scroll-mt-28"
          aria-labelledby="muninn-atoms"
        >
          <ChapterRule label="Cap. 03" />
          <Reveal>
            <SectionChrome
              kicker="Capítulo 03"
              title="Átomos del harness"
              id="muninn-atoms"
              lead="Detrás del compañero hay piezas operables: soul, rules, helpers, RAG, modelo y cron."
            />
          </Reveal>
          <AtomSections focused={focusedAtom} onFocus={setFocusedAtom} />
        </section>

        {/* Live */}
        <section
          id="live"
          className="scroll-mt-24 space-y-5 lg:scroll-mt-28"
          aria-labelledby="muninn-live"
        >
          <ChapterRule label="Cap. 04" />
          <Reveal>
            <SectionChrome
              kicker="Capítulo 04"
              title="En vivo"
              id="muninn-live"
              lead="Tour guiado o sandbox scripted. Badge Simulación: no hay API detrás."
            />
          </Reveal>
          <Reveal delayMs={40} tone="none">
            <LoginProductDemo liveFocusToken={liveFocus} />
          </Reveal>
        </section>

        {/* Docs + plataforma */}
        <section
          id="docs"
          className="scroll-mt-24 space-y-5 lg:scroll-mt-28"
          aria-labelledby="muninn-docs"
        >
          <ChapterRule label="Cap. 05" />
          <Reveal>
            <div className="login-pixel-readout space-y-4 !p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <SectionChrome
                  kicker="Capítulo 05"
                  title="La plataforma Muninn"
                  id="muninn-docs"
                  lead={LOGIN_PLATFORM_BLURB}
                />
                <a
                  href={LOGIN_HARNESS_REF.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pixel-font shrink-0 text-[8px] uppercase text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Ref · harness
                </a>
              </div>

              <ul className="grid gap-2 sm:grid-cols-3">
                {LOGIN_VALUE_BLOCKS.map((b) => (
                  <li key={b.id} className="border-2 border-border/45 bg-background/70 p-2.5">
                    <p className="pixel-font text-[8px] uppercase text-primary">{b.title}</p>
                    <p className="pixel-display mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {b.line}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="overflow-x-auto border-2 border-border/50 bg-background/80 p-3">
                <p className="pixel-font mb-2 text-[8px] uppercase text-muted-foreground">
                  Mapa del harness
                </p>
                <ol className="flex min-w-[28rem] flex-wrap items-center gap-1.5 sm:min-w-0">
                  {LOGIN_LANDING_MODULES.map((m, i) => (
                    <li key={m.id} className="inline-flex items-center gap-1.5">
                      {i > 0 && (
                        <span className="pixel-font text-[10px] text-primary/70" aria-hidden>
                          →
                        </span>
                      )}
                      <a
                        href={`#atom-${m.id}`}
                        className="pixel-font border-2 border-primary/40 bg-primary/10 px-2 py-1 text-[8px] uppercase text-primary hover:bg-primary/20"
                      >
                        {m.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="border-t-2 border-border/40 pt-3">
                <p className="pixel-font mb-2 text-[8px] uppercase text-muted-foreground">
                  Piezas rápidas
                </p>
                <HarnessPeek />
              </div>
            </div>
          </Reveal>
        </section>

        <Reveal tone="pop">
          <div className="pb-10">
            <Link
              to="/entrar"
              className="pixel-font inline-flex items-center gap-1.5 border-2 border-primary bg-primary px-4 py-2.5 text-[9px] uppercase text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {LOGIN_LANDING_CTA}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
