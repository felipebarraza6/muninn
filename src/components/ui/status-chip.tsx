import { cva, type VariantProps } from "class-variance-authority";
import type { StatusTone } from "@/lib/statusTone";
import { cn } from "@/lib/utils";

export type { StatusTone };

const statusChipVariants = cva(
  "inline-flex items-center rounded-full border font-medium whitespace-nowrap max-w-full truncate",
  {
    variants: {
      tone: {
        running: "bg-info-soft text-info border-transparent",
        pending: "bg-warning-soft text-warning border-transparent",
        success: "bg-success-soft text-success border-transparent",
        failed: "bg-destructive-soft text-destructive border-transparent",
        idle: "bg-muted text-muted-foreground border-transparent",
        skipped: "bg-muted text-muted-foreground border-transparent",
      },
      size: {
        xs: "px-1.5 py-0.5 text-[10px]",
        sm: "px-2 py-0.5 text-[11px]",
      },
    },
    defaultVariants: {
      tone: "idle",
      size: "xs",
    },
  },
);

export type StatusChipProps = {
  label: string;
  tone?: StatusTone;
  className?: string;
} & VariantProps<typeof statusChipVariants>;

export function StatusChip({ label, tone = "idle", size = "xs", className }: StatusChipProps) {
  return (
    <span className={cn(statusChipVariants({ tone, size }), className)} title={label}>
      {label}
    </span>
  );
}

export { statusChipVariants };
