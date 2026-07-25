import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ErrorBanner({
  message,
  onRetry,
  className,
  detail,
  status,
  variant = "panel",
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
  /** Detalle técnico opcional (stack / body API). */
  detail?: string;
  /** HTTP status si aplica. */
  status?: number | string | null;
  /** panel = caja; bar = franja inferior; inline = compacto en listas. */
  variant?: "panel" | "bar" | "inline";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border border-destructive/40 bg-destructive/10 text-destructive",
        variant === "panel" &&
          "rounded-lg px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        variant === "bar" &&
          "border-x-0 border-b-0 rounded-none px-4 py-2.5 text-center sm:flex-row sm:items-center sm:justify-between",
        variant === "inline" && "rounded-xl px-3 py-2.5",
        className,
      )}
      role="alert"
    >
      <div
        className={cn(
          "flex items-start gap-2 text-sm",
          variant === "bar" && "justify-center text-xs flex-1",
        )}
      >
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <div className="min-w-0 text-left">
          <span>{message}</span>
          {status != null && String(status) !== "" ? (
            <span className="ml-1.5 text-destructive/70">({status})</span>
          ) : null}
          {detail ? (
            <p className="mt-1 text-[11px] text-destructive/80 whitespace-pre-wrap break-words max-h-24 overflow-auto">
              {detail}
            </p>
          ) : null}
        </div>
      </div>
      {onRetry ? (
        <Button type="button" size="sm" variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      ) : null}
    </div>
  );
}
