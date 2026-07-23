import { PageSkeleton } from "@/components/ui/page-skeleton";
import { cn } from "@/lib/utils";

type PageLoaderProps = {
  className?: string;
  fullScreen?: boolean;
  label?: string;
};

/**
 * Fallback Suspense de ruta: skeleton neutro (no finge otra pantalla).
 */
export function PageLoader({ className, fullScreen = false }: PageLoaderProps) {
  return (
    <PageSkeleton
      variant="neutral"
      padded={!fullScreen}
      className={cn(fullScreen && "min-h-[100dvh] py-10", className)}
    />
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
    size === "lg"
      ? "h-16 w-16 rounded-2xl"
      : size === "sm"
        ? "h-8 w-8 rounded-lg"
        : "h-9 w-9 rounded-lg";
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
