import { Skeleton } from "@/components/ui/skeleton";
import type { PageSkeletonVariant } from "@/lib/pageSkeletonVariant";
import { cn } from "@/lib/utils";

export type { PageSkeletonVariant };

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
      <Skeleton className="h-4 w-28" delayMs={0} />
      <div className="hidden gap-2 md:flex">
        <Skeleton className="h-8 w-24 rounded-md" delayMs={40} />
        <Skeleton className="h-8 w-20 rounded-md" delayMs={80} />
      </div>
    </div>
  );
}

function FiltersSkel() {
  return (
    <div className="mb-4 flex flex-wrap items-end gap-3">
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-9 w-[200px]" delayMs={40} />
      </div>
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-9 w-[180px]" delayMs={80} />
      </div>
      <div className="hidden space-y-1.5 sm:block">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-[180px]" delayMs={120} />
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
        <Skeleton className="hidden h-3 w-12 sm:block" delayMs={40} />
        <Skeleton className="hidden h-3 w-16 md:block" delayMs={80} />
        <Skeleton className="hidden h-3 w-14 lg:block" delayMs={120} />
        <Skeleton className="ml-auto h-3 w-10" delayMs={160} />
      </div>
      <div className="divide-y divide-border/40">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,0.9fr)_minmax(0,0.6fr)_4.5rem] items-center gap-3 px-4 py-3"
          >
            <div className="min-w-0 space-y-1.5">
              <Skeleton className="h-3.5 w-[70%]" delayMs={i * 35} />
              <Skeleton className="h-2.5 w-[45%] sm:hidden" delayMs={i * 35 + 20} />
            </div>
            <Skeleton className="hidden h-3 w-[80%] sm:block" delayMs={i * 35 + 40} />
            <Skeleton className="hidden h-3 w-[75%] md:block" delayMs={i * 35 + 60} />
            <Skeleton className="hidden h-5 w-14 rounded-full lg:block" delayMs={i * 35 + 80} />
            <Skeleton className="ml-auto h-7 w-7 rounded-md" delayMs={i * 35 + 100} />
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
          <Skeleton className="h-1 w-full rounded-none" delayMs={i * 40} />
          <div className="space-y-3 p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-12 w-12 shrink-0 rounded-xl" delayMs={i * 40 + 20} />
              <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                <Skeleton className="h-3.5 w-3/4" delayMs={i * 40 + 40} />
                <Skeleton className="h-3 w-1/2" delayMs={i * 40 + 60} />
              </div>
            </div>
            <Skeleton className="h-3 w-full" delayMs={i * 40 + 80} />
            <Skeleton className="h-3 w-4/5" delayMs={i * 40 + 100} />
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-14 rounded-full" delayMs={i * 40 + 120} />
                <Skeleton className="h-5 w-12 rounded-full" delayMs={i * 40 + 140} />
              </div>
              <Skeleton className="h-7 w-16 rounded-md" delayMs={i * 40 + 160} />
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
            <Skeleton className="h-9 w-9 shrink-0 rounded-lg" delayMs={i * 40} />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-[70%]" delayMs={i * 40 + 20} />
              <Skeleton className="h-2.5 w-[40%]" delayMs={i * 40 + 40} />
            </div>
            <Skeleton className="h-4 w-4 shrink-0 rounded" delayMs={i * 40 + 60} />
          </div>
        ))}
      </div>
      <div className="space-y-3 rounded-lg border border-border/60 p-4">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-8 w-24 rounded-md" delayMs={40} />
        </div>
        <Skeleton className="h-9 w-full max-w-xs rounded-md" delayMs={60} />
        <div className="divide-y divide-border/50 rounded-md border border-border/50">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-3">
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-1/2" delayMs={i * 45} />
                <Skeleton className="h-2.5 w-1/3" delayMs={i * 45 + 20} />
              </div>
              <Skeleton className="h-5 w-12 rounded-full" delayMs={i * 45 + 40} />
              <Skeleton className="h-7 w-7 rounded-md" delayMs={i * 45 + 60} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Burbujas del hilo de chat (reutilizable en PageSkeleton y AgentChatCore). */
export function ChatThreadSkeleton({ className }: { className?: string }) {
  const rows: Array<{ side: "in" | "out"; w: string; h: string }> = [
    { side: "in", w: "w-[72%]", h: "h-14" },
    { side: "out", w: "w-[48%]", h: "h-11" },
    { side: "in", w: "w-[64%]", h: "h-16" },
    { side: "out", w: "w-[40%]", h: "h-10" },
    { side: "in", w: "w-[58%]", h: "h-12" },
  ];
  return (
    <div className={cn("flex flex-1 flex-col justify-end gap-4 py-4", className)} aria-hidden>
      {rows.map((r, i) => (
        <div key={i} className={cn("flex", r.side === "out" ? "justify-end" : "justify-start")}>
          <div
            className={cn(
              "flex max-w-[85%] gap-2",
              r.side === "out" ? "flex-row-reverse" : "flex-row",
            )}
          >
            {r.side === "in" ? (
              <Skeleton className="mt-1 h-7 w-7 shrink-0 rounded-full" delayMs={i * 50} />
            ) : null}
            <Skeleton
              className={cn(r.h, r.w, "rounded-2xl", r.side === "out" && "rounded-br-md")}
              delayMs={i * 50 + 20}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Studio chat: header + hilo + composer a pantalla completa. */
function ChatSkel() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-2 border-b border-border/50 px-3 py-2 sm:gap-3 sm:px-4">
        <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
        <Skeleton className="h-8 w-8 shrink-0 rounded-full" delayMs={30} />
        <div className="min-w-0 flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-36 max-w-full" delayMs={50} />
          <Skeleton className="h-2.5 w-24 max-w-[60%]" delayMs={70} />
        </div>
        <Skeleton className="h-8 w-8 rounded-md" delayMs={90} />
        <Skeleton className="hidden h-8 w-24 rounded-md sm:block" delayMs={110} />
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-3 sm:px-4">
        <ChatThreadSkeleton />
      </div>
      <div className="shrink-0 space-y-2 border-t border-border/50 p-3">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" delayMs={40} />
          <Skeleton className="h-6 w-20 rounded-full" delayMs={80} />
        </div>
        <Skeleton className="h-12 w-full rounded-xl" delayMs={100} />
      </div>
    </div>
  );
}

/** Conversaciones: lista | chat | details — llena el viewport. */
function InboxSkel() {
  return (
    <div className="flex h-full min-h-0 overflow-hidden rounded-lg border border-border/70">
      <div className="flex w-full min-h-0 flex-col border-r border-border/60 md:w-[340px] md:shrink-0">
        <div className="space-y-2 border-b border-border/50 p-3">
          <Skeleton className="h-9 w-full rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-16 rounded-full" delayMs={40} />
            <Skeleton className="h-7 w-16 rounded-full" delayMs={80} />
            <Skeleton className="h-7 w-16 rounded-full" delayMs={120} />
          </div>
        </div>
        <div className="min-h-0 flex-1 space-y-0 overflow-hidden p-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-2.5 px-2.5 py-2.5">
              <Skeleton className="h-9 w-9 shrink-0 rounded-full" delayMs={i * 40} />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex justify-between gap-2">
                  <Skeleton className="h-3 w-24" delayMs={i * 40 + 20} />
                  <Skeleton className="h-2.5 w-10" delayMs={i * 40 + 40} />
                </div>
                <Skeleton className="h-2.5 w-full" delayMs={i * 40 + 60} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden min-h-0 min-w-0 flex-1 flex-col md:flex">
        <div className="flex shrink-0 items-center gap-3 border-b border-border/50 px-4 py-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-32" delayMs={40} />
            <Skeleton className="h-2.5 w-20" delayMs={60} />
          </div>
        </div>
        <div className="min-h-0 flex-1 px-4">
          <ChatThreadSkeleton className="py-3" />
        </div>
        <div className="shrink-0 border-t border-border/50 p-3">
          <Skeleton className="h-10 w-full rounded-lg" delayMs={80} />
        </div>
      </div>
      <div className="hidden w-[300px] shrink-0 flex-col gap-3 border-l border-border/60 p-4 xl:flex">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-20 w-full rounded-lg" delayMs={40} />
        <Skeleton className="h-3 w-full" delayMs={60} />
        <Skeleton className="h-3 w-4/5" delayMs={80} />
        <Skeleton className="h-3 w-3/5" delayMs={100} />
      </div>
    </div>
  );
}

/** Planes: bandeja | lienzo de flujo | inspector. */
function WorkspaceSkel() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-2 border-b border-border/40 px-3 py-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-4 w-4 rounded" delayMs={30} />
        <div className="min-w-0 flex-1 space-y-1">
          <Skeleton className="h-3.5 w-20" delayMs={50} />
          <Skeleton className="hidden h-2.5 w-40 sm:block" delayMs={70} />
        </div>
        <Skeleton className="h-8 w-24 rounded-md" delayMs={90} />
        <Skeleton className="h-8 w-28 rounded-md" delayMs={110} />
      </div>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="flex w-full min-h-0 flex-col border-r border-border/40 bg-muted/10 md:w-[340px] md:shrink-0">
          <div className="space-y-2.5 border-b border-border/40 p-3">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-10" delayMs={40} />
            </div>
            <div className="flex gap-1 rounded-lg bg-muted/30 p-0.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-7 flex-1 rounded-md" delayMs={i * 40} />
              ))}
            </div>
            <Skeleton className="h-8 w-full rounded-md" delayMs={80} />
          </div>
          <div className="min-h-0 flex-1 divide-y divide-border/40 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-2.5 px-3 py-3">
                <Skeleton className="h-9 w-9 shrink-0 rounded-full" delayMs={i * 45} />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex justify-between gap-2">
                    <Skeleton className="h-3.5 w-[55%]" delayMs={i * 45 + 20} />
                    <Skeleton className="h-2.5 w-10" delayMs={i * 45 + 40} />
                  </div>
                  <Skeleton className="h-2.5 w-[70%]" delayMs={i * 45 + 60} />
                  <Skeleton className="h-2.5 w-full" delayMs={i * 45 + 80} />
                </div>
              </div>
            ))}
          </div>
        </aside>
        <section className="relative hidden min-h-0 min-w-0 flex-1 flex-col md:flex">
          <div className="flex shrink-0 items-center gap-3 border-b border-border/40 px-4 py-3">
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-4 w-48 max-w-full" />
              <Skeleton className="h-2.5 w-32" delayMs={40} />
            </div>
            <Skeleton className="h-8 w-24 rounded-md" delayMs={60} />
            <Skeleton className="h-8 w-20 rounded-md" delayMs={80} />
          </div>
          <div className="relative flex min-h-0 flex-1 flex-col items-center gap-0 overflow-hidden px-6 py-8">
            <div className="absolute left-1/2 top-6 bottom-6 w-px -translate-x-1/2 bg-border/50" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="relative z-[1] mb-6 flex w-full max-w-md items-stretch gap-3">
                <Skeleton className="mt-3 h-2.5 w-2.5 shrink-0 rounded-full" delayMs={i * 70} />
                <div className="min-w-0 flex-1 space-y-2 rounded-xl border border-border/50 bg-card/40 p-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-14 rounded-full" delayMs={i * 70 + 20} />
                    <Skeleton className="h-3.5 w-[45%]" delayMs={i * 70 + 40} />
                  </div>
                  <Skeleton className="h-2.5 w-[80%]" delayMs={i * 70 + 60} />
                </div>
              </div>
            ))}
          </div>
        </section>
        <aside className="hidden w-[300px] shrink-0 flex-col gap-3 border-l border-border/40 p-4 xl:flex">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full rounded-md" delayMs={40} />
          <Skeleton className="h-9 w-full rounded-md" delayMs={60} />
          <Skeleton className="h-28 w-full rounded-lg" delayMs={80} />
          <Skeleton className="h-3 w-full" delayMs={100} />
          <Skeleton className="h-3 w-4/5" delayMs={120} />
        </aside>
      </div>
    </div>
  );
}

/** Workflows OPS: lista | preview (sin burbujas de chat). */
function CatalogSkel() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-2 border-b border-border/60 px-3 py-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-4 w-4 rounded" delayMs={30} />
        <div className="min-w-0 flex-1 space-y-1">
          <Skeleton className="h-3.5 w-24" delayMs={50} />
          <Skeleton className="hidden h-2.5 w-36 sm:block" delayMs={70} />
        </div>
        <Skeleton className="h-8 w-20 rounded-md" delayMs={90} />
        <Skeleton className="h-8 w-24 rounded-md" delayMs={110} />
      </div>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="flex w-full min-h-0 flex-col border-r border-border/60 md:w-[320px] md:shrink-0">
          <div className="border-b border-border/50 p-3">
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
          <div className="min-h-0 flex-1 space-y-1 overflow-hidden p-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2.5">
                <Skeleton className="h-9 w-9 shrink-0 rounded-lg" delayMs={i * 40} />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-[65%]" delayMs={i * 40 + 20} />
                  <Skeleton className="h-2.5 w-[40%]" delayMs={i * 40 + 40} />
                </div>
                <Skeleton className="h-5 w-12 rounded-full" delayMs={i * 40 + 60} />
              </div>
            ))}
          </div>
        </aside>
        <section className="hidden min-h-0 min-w-0 flex-1 flex-col md:flex">
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border/50 px-4 py-3">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-64 max-w-full" delayMs={40} />
            </div>
            <Skeleton className="h-8 w-28 rounded-md" delayMs={60} />
          </div>
          <div className="relative min-h-0 flex-1 overflow-hidden p-6">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--foreground) 12%, transparent) 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="relative flex flex-wrap content-start gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-20 w-40 rounded-xl"
                  delayMs={i * 70}
                  style={{ marginLeft: i % 2 === 0 ? 0 : 24 }}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/** Editor de workflow: toolbar + palette + canvas. */
function CanvasSkel() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-2 border-b border-border/60 px-3 py-2">
        <Skeleton className="h-8 w-16 rounded-md" />
        <Skeleton className="h-4 w-40 max-w-[40%]" delayMs={40} />
        <div className="ml-auto flex gap-2">
          <Skeleton className="h-8 w-8 rounded-md" delayMs={60} />
          <Skeleton className="h-8 w-20 rounded-md" delayMs={80} />
          <Skeleton className="h-8 w-24 rounded-md" delayMs={100} />
        </div>
      </div>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="hidden w-14 shrink-0 flex-col items-center gap-2 border-r border-border/50 py-3 sm:flex">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-9 rounded-lg" delayMs={i * 45} />
          ))}
        </aside>
        <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--foreground) 10%, transparent) 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="relative flex h-full items-center justify-center gap-8 p-8">
            <Skeleton className="h-24 w-44 rounded-xl" delayMs={40} />
            <Skeleton className="hidden h-1 w-16 rounded-full md:block" delayMs={80} />
            <Skeleton className="h-24 w-44 rounded-xl" delayMs={120} />
            <Skeleton className="hidden h-1 w-16 rounded-full lg:block" delayMs={160} />
            <Skeleton className="hidden h-24 w-44 rounded-xl lg:block" delayMs={200} />
          </div>
        </div>
        <aside className="hidden w-[280px] shrink-0 flex-col gap-3 border-l border-border/50 p-4 xl:flex">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-full rounded-md" delayMs={40} />
          <Skeleton className="h-9 w-full rounded-md" delayMs={60} />
          <Skeleton className="h-24 w-full rounded-lg" delayMs={80} />
        </aside>
      </div>
    </div>
  );
}

function DetailSkel() {
  return (
    <div className="mx-auto max-w-[900px] space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-8 w-16 rounded-md" />
        <Skeleton className="h-6 w-48" delayMs={40} />
        <Skeleton className="h-5 w-14 rounded-full" delayMs={60} />
        <div className="ml-auto flex gap-2">
          <Skeleton className="h-8 w-24 rounded-md" delayMs={80} />
          <Skeleton className="h-8 w-24 rounded-md" delayMs={100} />
        </div>
      </div>
      <div className="space-y-4 rounded-xl border border-border/60 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-9 w-full" delayMs={40} />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-full" delayMs={60} />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-9 w-full" delayMs={80} />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-24 w-full" delayMs={100} />
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
          <Skeleton className="h-6 w-56 max-w-full" delayMs={40} />
          <Skeleton className="h-3 w-40" delayMs={60} />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-md" delayMs={80} />
          <Skeleton className="h-8 w-28 rounded-md" delayMs={100} />
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 border-b border-border/50 pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-md" delayMs={i * 40} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-border/60 p-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-full" delayMs={40} />
          <Skeleton className="h-3 w-4/5" delayMs={60} />
          <Skeleton className="h-24 w-full rounded-lg" delayMs={80} />
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
          <Skeleton className="h-6 w-48" delayMs={40} />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20 rounded-full" delayMs={60} />
            <Skeleton className="h-5 w-24 rounded-full" delayMs={80} />
          </div>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-4 rounded-xl border border-border/60 p-5">
          <Skeleton className="h-4 w-36" />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-9 w-full" delayMs={40} />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-9 w-full" delayMs={60} />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-9 w-full" delayMs={80} />
          </div>
          <Skeleton className="h-9 w-28 rounded-md" delayMs={100} />
        </div>
        <div className="space-y-4">
          <div className="space-y-3 rounded-xl border border-border/60 p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-full" delayMs={40} />
            <Skeleton className="h-9 w-full" delayMs={60} />
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

function DashboardSkel() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-4 w-72 max-w-full" delayMs={40} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl border border-border/70 p-4">
            <Skeleton className="h-3 w-20" delayMs={i * 50} />
            <Skeleton className="h-7 w-16" delayMs={i * 50 + 20} />
            <Skeleton className="h-2.5 w-24" delayMs={i * 50 + 40} />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-28 rounded-md" delayMs={i * 40} />
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
          <Skeleton
            className={cn("shrink-0 rounded-md", compact ? "h-7 w-7" : "h-9 w-9")}
            delayMs={i * 40}
          />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className={cn("w-2/5", compact ? "h-3" : "h-3.5")} delayMs={i * 40 + 20} />
            <Skeleton className="h-2.5 w-1/4" delayMs={i * 40 + 40} />
          </div>
          {!compact && <Skeleton className="h-5 w-14 rounded-full" delayMs={i * 40 + 60} />}
        </div>
      ))}
    </div>
  );
}

/** Suspense genérico: mínimo, sin fingir otra pantalla. */
function NeutralSkel() {
  return (
    <div className="space-y-4 py-2">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-3 w-64 max-w-full" delayMs={40} />
      <div className="space-y-2 pt-4">
        <Skeleton className="h-10 w-full rounded-lg" delayMs={60} />
        <Skeleton className="h-10 w-full rounded-lg" delayMs={100} />
        <Skeleton className="h-10 w-[85%] rounded-lg" delayMs={140} />
      </div>
    </div>
  );
}

const DEFAULT_PADDED: Record<PageSkeletonVariant, boolean> = {
  table: true,
  tableFilters: true,
  cards: true,
  split: true,
  inbox: false,
  workspace: false,
  catalog: false,
  canvas: false,
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

const FULL_BLEED: Partial<Record<PageSkeletonVariant, boolean>> = {
  chat: true,
  inbox: true,
  workspace: true,
  catalog: true,
  canvas: true,
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
  const fullBleed = FULL_BLEED[variant] ?? false;

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
      case "workspace":
        return <WorkspaceSkel />;
      case "catalog":
        return <CatalogSkel />;
      case "canvas":
        return <CanvasSkel />;
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
      className={cn(
        withPad && pad,
        fullBleed ? "flex h-full min-h-0 flex-col" : "space-y-4",
        className,
      )}
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
        <Skeleton
          key={i}
          className={cn("h-3", i === lines - 1 ? "w-2/3" : "w-full")}
          delayMs={i * 45}
        />
      ))}
    </div>
  );
}

/** Lienzo de flujo (detalle de plan) mientras llega el detail. */
export function FlowCanvasSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={cn("relative flex flex-1 flex-col items-center px-6 py-8", className)}
    >
      <div className="absolute left-1/2 top-6 bottom-6 w-px -translate-x-1/2 bg-border/50" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="relative z-[1] mb-6 w-full max-w-md space-y-2 rounded-xl border border-border/50 bg-card/40 p-3"
        >
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-14 rounded-full" delayMs={i * 70} />
            <Skeleton className="h-3.5 w-[50%]" delayMs={i * 70 + 20} />
          </div>
          <Skeleton className="h-2.5 w-[75%]" delayMs={i * 70 + 40} />
        </div>
      ))}
    </div>
  );
}
