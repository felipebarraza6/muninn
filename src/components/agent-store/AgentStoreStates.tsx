import { Loader2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBanner } from "@/components/ui/error-banner";

export function AgentStoreLoading({ label = "Cargando el catálogo…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-border/70 bg-card/50 px-5 py-16 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      {label}
    </div>
  );
}

export function AgentStoreEmpty({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      action={action}
      className="rounded-2xl border-dashed bg-muted/20 py-14"
    />
  );
}

export function AgentStoreError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <ErrorBanner message={message} onRetry={onRetry} />;
}
