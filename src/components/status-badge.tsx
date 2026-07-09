import type { ConversationStatus } from "@/lib/mock-data";
import { STATUS_LABEL, STATUS_TONE } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const TONE_CLASSES: Record<string, string> = {
  success: "bg-success-soft text-success border-transparent",
  warning: "bg-warning-soft text-warning-foreground border-transparent",
  destructive: "bg-destructive-soft text-destructive border-transparent",
  info: "bg-info-soft text-info border-transparent",
  primary: "bg-primary-soft text-primary border-transparent",
  muted: "bg-muted text-muted-foreground border-transparent",
};

export function StatusBadge({
  status,
  className,
  size = "sm",
}: {
  status: ConversationStatus;
  className?: string;
  size?: "sm" | "xs";
}) {
  const tone = STATUS_TONE[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium whitespace-nowrap max-w-full truncate",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-1.5 py-0.5 text-[10px]",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
