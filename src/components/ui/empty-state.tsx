import type { ReactNode } from "react";
import { AlertCircle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  className,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/15 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon ?? <Inbox className="h-5 w-5" aria-hidden />}
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorBanner({
  message,
  onRetry,
  className,
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      role="alert"
    >
      <div className="flex items-start gap-2 text-sm text-destructive">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <span>{message}</span>
      </div>
      {onRetry ? (
        <Button type="button" size="sm" variant="outline" onClick={onRetry}>
          Reintentar
        </Button>
      ) : null}
    </div>
  );
}
