import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Bot, Plug, RefreshCw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MuninnBrand } from "@/components/brand/MuninnBrand";
import { BrandMarkSkeleton } from "@/components/ui/page-loader";
import {
  LOGIN_LANDING_FLOW_STEPS,
  LOGIN_LANDING_LEAD,
  LOGIN_LANDING_MODULES,
  LOGIN_LANDING_TAGLINE,
  type LoginLandingModuleId,
} from "@/lib/loginLanding";
import { cn } from "@/lib/utils";

const MODULE_ICONS: Record<LoginLandingModuleId, LucideIcon> = {
  swarm: Bot,
  knowledge: BookOpen,
  learning: RefreshCw,
  apis: Plug,
};

/** Más nodos, ritmos distintos (no sincronizados con los iconos). */
const SWARM_NODES: Array<{ className: string; size: string; float: string }> = [
  { className: "left-[8%] top-[14%]", size: "h-2.5 w-2.5", float: "login-float-a" },
  { className: "left-[22%] top-[28%]", size: "h-1.5 w-1.5", float: "login-float-c" },
  { className: "left-[14%] top-[48%]", size: "h-2 w-2", float: "login-float-b" },
  { className: "left-[30%] top-[62%]", size: "h-1 w-1", float: "login-float-e" },
  { className: "left-[10%] top-[78%]", size: "h-2 w-2", float: "login-float-d" },
  { className: "left-[42%] top-[18%]", size: "h-1.5 w-1.5", float: "login-float-b" },
  { className: "left-[52%] top-[36%]", size: "h-2.5 w-2.5", float: "login-float-a" },
  { className: "right-[18%] top-[16%]", size: "h-2 w-2", float: "login-float-e" },
  { className: "right-[10%] top-[32%]", size: "h-3 w-3", float: "login-float-c" },
  { className: "right-[24%] top-[48%]", size: "h-1.5 w-1.5", float: "login-float-d" },
  { className: "right-[12%] top-[64%]", size: "h-2 w-2", float: "login-float-b" },
  { className: "right-[28%] top-[78%]", size: "h-1 w-1", float: "login-float-a" },
  { className: "right-[40%] top-[22%]", size: "h-1.5 w-1.5", float: "login-float-d" },
  { className: "left-[60%] top-[70%]", size: "h-2 w-2", float: "login-float-c" },
];

type Props = {
  loading?: boolean;
  compact?: boolean;
  className?: string;
};

export function LoginLandingPanel({ loading = false, compact = false, className }: Props) {
  const reduceMotion = useReducedMotion();

  if (compact) {
    return (
      <div className={cn("w-full space-y-4 px-1", className)}>
        <div className="flex justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <BrandMarkSkeleton size="md" />
              <span className="h-3 w-24 animate-pulse rounded bg-muted" />
            </div>
          ) : (
            <MuninnBrand tagline={LOGIN_LANDING_TAGLINE} className="justify-center" />
          )}
        </div>
        <p className="text-center text-sm text-muted-foreground leading-relaxed">
          {LOGIN_LANDING_TAGLINE}
        </p>
        <ul className="flex flex-wrap justify-center gap-2">
          {LOGIN_LANDING_MODULES.map((m) => {
            const Icon = MODULE_ICONS[m.id];
            return (
              <li
                key={m.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-foreground"
              >
                <Icon className="h-3 w-3 text-primary" aria-hidden />
                {m.title}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[28rem] flex-col justify-between overflow-hidden px-8 py-10 lg:px-12 lg:py-14",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/25 via-background to-primary-soft/50"
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl",
          !reduceMotion && "login-drift",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-16 bottom-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl",
          !reduceMotion && "login-drift-slow",
        )}
      />

      {!reduceMotion && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[62%] top-[40%] h-32 w-32 -translate-x-1/2 -translate-y-1/2">
            <span className="absolute inset-0 rounded-full border border-primary/30 login-pulse-ring" />
            <span
              className="absolute inset-3 rounded-full border border-primary/20 login-pulse-ring"
              style={{ animationDelay: "1.15s" }}
            />
            <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_22px_color-mix(in_oklab,var(--primary)_55%,transparent)] animate-pulse" />
          </div>
          {SWARM_NODES.map((node, i) => (
            <span
              key={i}
              className={cn(
                "absolute rounded-full bg-primary/65 shadow-[0_0_10px_color-mix(in_oklab,var(--primary)_50%,transparent)]",
                node.className,
                node.size,
                node.float,
              )}
            />
          ))}
        </div>
      )}

      <div className="relative z-[1] space-y-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5"
        >
          {loading ? (
            <MuninnBrand pending className="scale-110 origin-left" />
          ) : (
            <MuninnBrand className="scale-110 origin-left" />
          )}
          <div className="max-w-md space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground lg:text-[2.1rem] leading-[1.12]">
              {LOGIN_LANDING_TAGLINE}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">{LOGIN_LANDING_LEAD}</p>
          </div>
        </motion.div>

        <ul className="relative z-[1] max-w-md space-y-0.5">
          {LOGIN_LANDING_MODULES.map((m, i) => {
            const Icon = MODULE_ICONS[m.id];
            return (
              <motion.li
                key={m.id}
                initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : 0.12 + i * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group flex gap-3.5 rounded-xl px-2 py-2.5 transition-colors duration-300 hover:bg-primary/8"
              >
                {/* Iconos quietos: no usan login-float (las bolitas sí, con ritmos distintos). */}
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/15 text-primary transition-transform duration-300 group-hover:scale-105">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm font-semibold tracking-tight text-foreground">{m.title}</p>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">{m.description}</p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.45 }}
        className="relative z-[1] mt-10 max-w-md space-y-3"
      >
        <div className="login-flow-track" aria-hidden>
          {!reduceMotion && <span className="login-flow-sweep" />}
        </div>
        <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] uppercase tracking-[0.14em] text-primary/90">
          {LOGIN_LANDING_FLOW_STEPS.map((step, i) => (
            <span key={step} className="inline-flex items-center gap-1.5">
              {i > 0 && <span className="text-primary/40">→</span>}
              <span>{step}</span>
            </span>
          ))}
        </p>
      </motion.div>
    </div>
  );
}
