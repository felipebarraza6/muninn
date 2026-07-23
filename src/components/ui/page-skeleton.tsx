import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type PageSkeletonVariant =
  | "table"
  | "tableFilters"
  | "cards"
  | "split"
  | "inbox"
  | "detail"
  | "studio"
  | "profile"
  | "chat"
  | "dashboard"
  | "list"
  | "neutral";

type PageSkeletonProps = {
  variant?: PageSkeletonVariant;
  className?: string;
  rows?: number;
  /** Padding de ruta (default según variant). */
  padded?: boolean;
  /** Toolbar interno (default: true solo en table/split/list full-page). */
  showToolbar?: boolean;
};

const pad = "px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto";

function ToolbarSkel() {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <Skeleton className="h-4 w-28" />
      <div className="hidden gap-2 md:flex">
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  );
}

function FiltersSkel() {
  return (
    <div className="mb-4 flex flex-wrap items-end gap-3">
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-9 w-[200px]" />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-9 w-[180px]" />
      </div>
      <div className="hidden space-y-1.5 sm:block">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-[180px]" />
      </div>
    </div>
  );
}

/** Tabla admin: celdas en fila (como TableRow real). */
function TableSkel({ rows = 7 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border/70">
      <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,0.9fr)_minmax(0,0.6fr)_4.5rem] gap-3 border-b border-border/50 px-4 py-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="hidden h-3 w-12 sm:block" />
        <Skeleton className="hidden h-3 w-16 md:block" />
        <Skeleton className="hidden h-3 w-14 lg:block" />
        <Skeleton className="ml-auto h-3 w-10" />
      </div>
      <div className="divide-y divide-border/40">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,0.9fr)_minmax(0,0.6fr)_4.5rem] items-center gap-3 px-4 py-3"
          >
            <div className="min-w-0 space-y-1.5">
              <Skeleton className="h-3.5 w-[70%]" />
              <Skeleton className="h-2.5 w-[45%] sm:hidden" />
            </div>
            <Skeleton className="hidden h-3 w-[80%] sm:block" />
            <Skeleton className="hidden h-3 w-[75%] md:block" />
            <Skeleton className="hidden h-5 w-14 rounded-full lg:block" />
            <Skeleton className="ml-auto h-7 w-7 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Cards de studio (agentes / skills / apps / canales). */
function CardsSkel({ rows = 6 }: { rows?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-border/70 bg-card/40">
          <Skeleton className="h-1 w-full rounded-none" />
          <div className="space-y-3 p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
              <Skeleton className="h-7 w-16 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** LLM: lista providers | panel modelos. */
function SplitSkel() {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(16rem,21rem)_minmax(0,1fr)]">
      <div className="space-y-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2.5">
            <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-[70%]" />
              <Skeleton className="h-2.5 w-[40%]" />
            </div>
            <Skeleton className="h-4 w-4 shrink-0 rounded" />
          </div>
        ))}
      </div>
      <div className="space-y-3 rounded-lg border border-border/60 p-4">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
        <Skeleton className="h-9 w-full max-w-xs rounded-md" />
        <div className="divide-y divide-border/50 rounded-md border border-border/50">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-3">
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-1/2" />
                <Skeleton className="h-2.5 w-1/3" />
              </div>
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-7 w-7 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Conversaciones: lista | chat | details. */
function InboxSkel() {
  return (
    <div className="flex h-[min(70vh,720px)] min-h-[420px] overflow-hidden rounded-lg border border-border/70">
      <div className="flex w-full flex-col border-r border-border/60 md:w-[340px] md:shrink-0">
        <div className="space-y-2 border-b border-border/50 p-3">
          <Skeleton className="h-9 w-full rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-16 rounded-full" />
            <Skeleton className="h-7 w-16 rounded-full" />
          </div>
        </div>
        <div className="flex-1 space-y-0 overflow-hidden p-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex gap-2.5 px-2.5 py-2.5">
              <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex justify-between gap-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2.5 w-10" />
                </div>
                <Skeleton className="h-2.5 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden min-w-0 flex-1 flex-col md:flex">
        <div className="flex items-center gap-3 border-b border-border/50 px-4 py-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <Skeleton className="h-12 w-[65%] rounded-2xl" />
          <Skeleton className="ml-auto h-10 w-[50%] rounded-2xl" />
          <Skeleton className="h-14 w-[60%] rounded-2xl" />
        </div>
        <div className="border-t border-border/50 p-3">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
      <div className="hidden w-[300px] shrink-0 flex-col gap-3 border-l border-border/60 p-4 xl:flex">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  );
}

function DetailSkel() {
  return (
    <div className="mx-auto max-w-[900px] space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-8 w-16 rounded-md" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-5 w-14 rounded-full" />
        <div className="ml-auto flex gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
      <div className="space-y-4 rounded-xl border border-border/60 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}

/** Agente studio: header + tabs + contenido. */
function StudioSkel() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start gap-3">
        <Skeleton className="h-8 w-8 rounded-md" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-6 w-56 max-w-full" />
          <Skeleton className="h-3 w-40" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 border-b border-border/50 pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-md" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-border/60 p-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
        <div className="space-y-3 rounded-xl border border-border/60 p-4">
          <Skeleton className="h-4 w-28" />
          <ListSkel rows={4} compact />
        </div>
      </div>
    </div>
  );
}

/** Perfil: hero + 2 columnas. */
function ProfileSkel() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-4 rounded-xl border border-border/60 p-5">
          <Skeleton className="h-4 w-36" />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-9 w-full" />
          </div>
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
        <div className="space-y-4">
          <div className="space-y-3 rounded-xl border border-border/60 p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-3 rounded-xl border border-border/60 p-4">
            <Skeleton className="h-4 w-28" />
            <ListSkel rows={3} compact />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatSkel() {
  return (
    <div className="flex min-h-[50vh] flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-3">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-2.5 w-20" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 py-4">
        <Skeleton className="h-14 w-[68%] rounded-2xl" />
        <Skeleton className="ml-auto h-12 w-[52%] rounded-2xl" />
        <Skeleton className="h-16 w-[62%] rounded-2xl" />
        <Skeleton className="ml-auto h-10 w-[40%] rounded-2xl" />
      </div>
      <Skeleton className="h-11 w-full rounded-lg" />
    </div>
  );
}

function DashboardSkel() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl border border-border/70 p-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-2.5 w-24" />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-28 rounded-md" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-border/60 p-4">
          <Skeleton className="h-4 w-36" />
          <ListSkel rows={4} compact />
        </div>
        <div className="space-y-3 rounded-xl border border-border/60 p-4">
          <Skeleton className="h-4 w-28" />
          <ListSkel rows={3} compact />
        </div>
      </div>
    </div>
  );
}

function ListSkel({ rows = 5, compact }: { rows?: number; compact?: boolean }) {
  return (
    <div className={cn("space-y-2", compact && "space-y-1.5")}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center gap-3 rounded-lg border border-border/60 px-3",
            compact ? "py-2" : "py-3",
          )}
        >
          <Skeleton className={cn("shrink-0 rounded-md", compact ? "h-7 w-7" : "h-9 w-9")} />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className={cn("w-2/5", compact ? "h-3" : "h-3.5")} />
            <Skeleton className="h-2.5 w-1/4" />
          </div>
          {!compact && <Skeleton className="h-5 w-14 rounded-full" />}
        </div>
      ))}
    </div>
  );
}

/** Suspense / transición de ruta: mínimo, sin fingir otra pantalla. */
function NeutralSkel() {
  return (
    <div className="space-y-4 py-2">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-3 w-64 max-w-full" />
      <div className="space-y-2 pt-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-[85%] rounded-lg" />
      </div>
    </div>
  );
}

const DEFAULT_PADDED: Record<PageSkeletonVariant, boolean> = {
  table: true,
  tableFilters: true,
  cards: true,
  split: true,
  inbox: true,
  detail: true,
  studio: true,
  profile: true,
  chat: false,
  dashboard: true,
  list: true,
  neutral: true,
};

const DEFAULT_TOOLBAR: Partial<Record<PageSkeletonVariant, boolean>> = {
  table: true,
  tableFilters: true,
  split: true,
  list: true,
  cards: false,
};

/** Placeholder alineado al layout que verá el usuario. */
export function PageSkeleton({
  variant = "table",
  className,
  rows,
  padded,
  showToolbar,
}: PageSkeletonProps) {
  const withPad = padded ?? DEFAULT_PADDED[variant];
  const toolbar = showToolbar ?? DEFAULT_TOOLBAR[variant] ?? false;

  const body = (() => {
    switch (variant) {
      case "tableFilters":
        return (
          <>
            <FiltersSkel />
            {toolbar ? <ToolbarSkel /> : null}
            <TableSkel rows={rows ?? 7} />
          </>
        );
      case "cards":
        return (
          <>
            {toolbar ? <ToolbarSkel /> : null}
            <CardsSkel rows={rows ?? 6} />
          </>
        );
      case "split":
        return (
          <>
            {toolbar ? <ToolbarSkel /> : null}
            <div className="mb-3">
              <Skeleton className="h-9 w-[200px] rounded-md" />
            </div>
            <SplitSkel />
          </>
        );
      case "inbox":
        return <InboxSkel />;
      case "detail":
        return <DetailSkel />;
      case "studio":
        return <StudioSkel />;
      case "profile":
        return <ProfileSkel />;
      case "chat":
        return <ChatSkel />;
      case "dashboard":
        return <DashboardSkel />;
      case "list":
        return (
          <>
            {toolbar ? <ToolbarSkel /> : null}
            <ListSkel rows={rows ?? 5} />
          </>
        );
      case "neutral":
        return <NeutralSkel />;
      case "table":
      default:
        return (
          <>
            {toolbar ? <ToolbarSkel /> : null}
            <TableSkel rows={rows ?? 7} />
          </>
        );
    }
  })();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Cargando"
      className={cn(withPad && pad, "space-y-4", className)}
    >
      {body}
    </div>
  );
}

/** Bloque inline (panel / tab) — no pantalla completa. */
export function InlineSkeleton({ className, lines = 3 }: { className?: string; lines?: number }) {
  return (
    <div role="status" aria-busy="true" className={cn("space-y-2 py-4", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-3", i === lines - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}
