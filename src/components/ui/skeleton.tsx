import { cn } from "@/lib/utils";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Retardo del shimmer (ms) para escalonar grupos. */
  delayMs?: number;
};

/**
 * Bone de carga: shimmer mint suave (respeta prefers-reduced-motion / data-motion=off).
 */
function Skeleton({ className, delayMs, style, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton-bone rounded-md", className)}
      style={delayMs != null ? { ...style, ["--skeleton-delay" as string]: `${delayMs}ms` } : style}
      {...props}
    />
  );
}

export { Skeleton };
