import { PageSkeleton, type PageSkeletonVariant } from "@/components/ui/page-skeleton";
import { cn } from "@/lib/utils";

/** Carga de ruta admin: skeleton del layout real. */
export function AdminPageLoader({
  variant = "table",
  className,
}: {
  label?: string;
  variant?: PageSkeletonVariant;
  className?: string;
}) {
  return <PageSkeleton variant={variant} className={cn(className)} padded />;
}
