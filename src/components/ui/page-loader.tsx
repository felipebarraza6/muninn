import { PageSkeleton } from "@/components/ui/page-skeleton";
import { resolvePageSkeletonVariant, type PageSkeletonVariant } from "@/lib/pageSkeletonVariant";
import { cn } from "@/lib/utils";

type PageLoaderProps = {
  className?: string;
  fullScreen?: boolean;
  label?: string;
  /** Si no se pasa, usa `neutral` (fallback genérico). Preferir `pathname` en Suspense. */
  variant?: PageSkeletonVariant;
  pathname?: string;
};

/**
 * Fallback Suspense / carga de ruta.
 * Con `pathname` elige el skeleton del layout real (chat, inbox, canvas…).
 */
export function PageLoader({ className, fullScreen = false, variant, pathname }: PageLoaderProps) {
  const resolved = variant ?? (pathname ? resolvePageSkeletonVariant(pathname) : "neutral");
  const bleed =
    resolved === "chat" ||
    resolved === "inbox" ||
    resolved === "workspace" ||
    resolved === "catalog" ||
    resolved === "canvas";

  return (
    <PageSkeleton
      variant={resolved}
      padded={!fullScreen && !bleed}
      className={cn(bleed && "h-full max-w-none", fullScreen && "min-h-[100dvh]", className)}
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
        "skeleton-bone relative flex shrink-0 overflow-hidden border border-border/60",
        dim,
        className,
      )}
    />
  );
}
