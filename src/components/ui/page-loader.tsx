import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type PageLoaderProps = {
  className?: string;
  /** Altura mínima del área (default: contenido de ruta). */
  fullScreen?: boolean;
  label?: string;
};

/**
 * Loader neutro para Suspense / fetches.
 * No muestra logo Muninn ni colores de marca ajenos: evita parpadeo crow→org.
 */
export function PageLoader({
  className,
  fullScreen = false,
  label = "Cargando",
}: PageLoaderProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-muted-foreground",
        fullScreen ? "min-h-[100dvh] w-full" : "min-h-[40vh] w-full py-12",
        className,
      )}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.28, ease: "easeOut", delay: reduce ? 0 : 0.06 }}
    >
      <span className="relative flex h-9 w-9 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-border/70 bg-muted/40" />
        <span
          className={cn(
            "absolute inset-1 rounded-full border-2 border-transparent border-t-primary/80",
            !reduce && "animate-spin",
          )}
        />
      </span>
      <span className="text-xs tracking-wide text-muted-foreground/80">{label}…</span>
    </motion.div>
  );
}

/** Placeholder del mark de marca (sidebar / login) mientras llega el logo real. */
export function BrandMarkSkeleton({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dim =
    size === "lg" ? "h-16 w-16 rounded-2xl" : size === "sm" ? "h-8 w-8 rounded-lg" : "h-9 w-9 rounded-lg";
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex shrink-0 overflow-hidden border border-border/60 bg-muted/50",
        dim,
        className,
      )}
    >
      <span className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted via-muted/40 to-muted" />
    </span>
  );
}
