import * as React from "react";
import { Search, Sparkles, User, Archive, Bot, UserCircle, Loader2 } from "lucide-react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CONVERSATION_BUCKETS,
  CONVERSATION_SUBFILTERS,
  STATUS_LABEL,
  getConversationBucket,
  matchesSubFilter,
  type Conversation,
  type ConversationBucket,
} from "@/lib/conversation-types";
import { channelIcon, channelLabel } from "@/lib/channels";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import { isOrganizationOwnerScope, isSuperAdmin } from "@/lib/authGuards";
import { initials, avatarColor } from "@/lib/format";
import { cn } from "@/lib/utils";

function formatWaitingSince(iso?: string): string | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return null;
  const mins = Math.max(0, Math.floor((Date.now() - t) / 60_000));
  if (mins < 1) return "ahora";
  if (mins < 60) return `${mins}m en cola`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h en cola`;
  return `${Math.floor(hrs / 24)}d en cola`;
}
interface Props {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
  bucket: ConversationBucket;
  onBucketChange: (b: ConversationBucket) => void;
  subFilter: string;
  onSubFilterChange: (id: string) => void;
  query: string;
  onQueryChange: (q: string) => void;
  onArchive: (id: string) => void;
  onAssignToHuman: (id: string) => void;
  onAssignToAi: (id: string) => void;
  isLoading?: boolean;
  isFetching?: boolean;
}

const BUCKET_ICONS: Record<ConversationBucket, typeof User> = {
  mine: User,
  ai: Sparkles,
  archived: Archive,
};

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-context-menu-content-transform-origin)",
        className,
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 cursor-pointer",
      className,
    )}
    {...props}
  />
));
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
));
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  bucket,
  onBucketChange,
  subFilter,
  onSubFilterChange,
  query,
  onQueryChange,
  onArchive,
  onAssignToHuman,
  onAssignToAi,
  isLoading,
  isFetching,
}: Props) {
  const counts = React.useMemo(
    () =>
      CONVERSATION_BUCKETS.reduce(
        (acc, b) => {
          acc[b.id] = conversations.filter((c) => getConversationBucket(c) === b.id).length;
          return acc;
        },
        {} as Record<ConversationBucket, number>,
      ),
    [conversations],
  );

  const inBucket = conversations.filter((c) => getConversationBucket(c) === bucket);
  const filtered = inBucket.filter((c) => {
    const matchesQuery =
      !query ||
      c.patientName.toLowerCase().includes(query.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && matchesSubFilter(c, bucket, subFilter);
  });

  const subFilters = CONVERSATION_SUBFILTERS[bucket];
  const bucketMeta = CONVERSATION_BUCKETS.find((b) => b.id === bucket)!;
  // Superadmin / organizador: mismo filtro Studio. OWNER multi-sucursal usa el switcher del header.
  const showOrgBranchFilter = isSuperAdmin() || isOrganizationOwnerScope();

  return (
    <>
      <div className="border-b px-4 pt-4 pb-3 space-y-3 shrink-0">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-baseline gap-2 min-w-0">
            <h2 className="font-display text-base font-semibold shrink-0">Bandeja</h2>
            <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">
              {filtered.length}/{inBucket.length}
            </span>
          </div>
          {showOrgBranchFilter ? (
            <StudioBranchFilter
              className="shrink-0"
              triggerClassName="h-8 w-[10.5rem] sm:w-[11rem] text-xs"
            />
          ) : null}
        </div>

        {/* Segmento de bandejas */}
        <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted/50 p-1">
          {CONVERSATION_BUCKETS.map((b) => {
            const Icon = BUCKET_ICONS[b.id];
            const active = bucket === b.id;
            const isMine = b.id === "mine";
            return (
              <button
                key={b.id}
                onClick={() => {
                  onBucketChange(b.id);
                  onSubFilterChange("all");
                }}
                title={b.description}
                className={cn(
                  "group flex flex-col items-center gap-0.5 rounded-md px-1 py-1.5 text-[10px] leading-tight font-medium transition-colors cursor-pointer",
                  active
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                <div className="flex items-center gap-1 transition-transform group-hover:scale-105">
                  <Icon className="h-3.5 w-3.5" />
                  <span>{b.label}</span>
                </div>
                <span
                  className={cn(
                    "text-[10px] tabular-nums",
                    isMine && counts[b.id] > 0
                      ? "text-destructive font-semibold"
                      : "text-muted-foreground",
                  )}
                >
                  {counts[b.id]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar conversación…"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="pl-8 h-9 bg-muted/40 border-transparent focus-visible:bg-card focus-visible:border-border"
          />
        </div>

        {/* Sub-filtros contextuales */}
        <div className="flex gap-1.5 overflow-x-auto -mx-1 px-1 scrollbar-thin">
          {subFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => onSubFilterChange(f.id)}
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                subFilter === f.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Banner contextual cuando estás monitoreando IA */}
      {bucket === "ai" && (
        <div className="mx-3 mt-3 rounded-md border border-info/30 bg-info-soft px-3 py-2 text-[11px] text-info leading-snug">
          La IA está manejando estas conversaciones. Solo intervén si lo crees necesario.
        </div>
      )}

      <div className="relative flex-1 min-h-0">
        {isFetching && !isLoading && (
          <div className="absolute top-0 inset-x-0 z-10 flex justify-center pt-2 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 border px-2 py-1 text-[10px] text-muted-foreground shadow-sm">
              <Loader2 className="h-3 w-3 animate-spin" />
              Actualizando…
            </span>
          </div>
        )}
        <ScrollArea className="absolute inset-0 min-h-0">
          <ul className="pb-2">
            {isLoading && (
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <li key={`sk-${i}`} className="px-4 py-3 flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <Skeleton className="h-4 w-3/5" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </li>
                ))}
              </>
            )}
            {!isLoading &&
              filtered.map((c, index) => {
                const isSelected = c.id === selectedId;
                const statusLabel = STATUS_LABEL[c.status];
                const ChannelIcon = channelIcon(c.channelType);
                const isChannel = c.source === "channel";
                const isArchived = getConversationBucket(c) === "archived";
                const isMine = getConversationBucket(c) === "mine";
                return (
                  <motion.li
                    key={c.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.3) }}
                    layout
                  >
                    <ContextMenuPrimitive.Root>
                      <ContextMenuPrimitive.Trigger asChild>
                        <button
                          onClick={() => onSelect(c.id)}
                          className={cn(
                            "group relative w-full text-left px-4 py-3 flex gap-3 transition-all duration-200 border-l-2 border-transparent cursor-pointer",
                            isSelected
                              ? "bg-primary-soft/40 border-l-primary"
                              : "hover:bg-muted/40 hover:translate-x-0.5",
                          )}
                        >
                          <Avatar className="h-10 w-10 shrink-0 transition-transform group-hover:scale-105">
                            <AvatarFallback
                              className={cn("text-xs font-semibold", avatarColor(c.patientName))}
                            >
                              {initials(c.patientName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium truncate transition-transform group-hover:translate-x-0.5">
                                {c.patientName}
                              </span>
                              <span className="text-[10px] text-muted-foreground shrink-0">
                                {c.lastTime}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                              {c.lastMessage}
                            </p>
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
                              {isChannel ? (
                                <span className="inline-flex items-center gap-1 text-info">
                                  <ChannelIcon className="h-3 w-3" />
                                  {channelLabel(c.channelType, c.channelName)}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-muted-foreground">
                                  <Bot className="h-3 w-3" /> Interno
                                </span>
                              )}
                              <span className="text-muted-foreground/60">·</span>
                              {c.isWaitingHuman ? (
                                <span className="text-destructive font-medium">
                                  {formatWaitingSince(c.waitingSince) ?? "Esperando humano"}
                                </span>
                              ) : c.controlledBy === "ai" ? (
                                <span className="inline-flex items-center gap-1 text-info">
                                  <Bot className="h-3 w-3" /> IA
                                </span>
                              ) : (
                                <span className="text-success font-medium">Humano</span>
                              )}
                              <span className="text-muted-foreground/60">·</span>
                              <span className="text-muted-foreground truncate">{statusLabel}</span>
                              {c.unread > 0 && (
                                <span
                                  className="ml-auto min-w-4 h-4 px-1 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center tabular-nums shrink-0"
                                  title="Pendiente de humano"
                                >
                                  {c.unread > 9 ? "9+" : c.unread}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      </ContextMenuPrimitive.Trigger>
                      {!isArchived && (
                        <ContextMenuContent className="w-56">
                          <ContextMenuLabel className="text-xs font-normal text-muted-foreground">
                            {c.patientName}
                          </ContextMenuLabel>
                          <ContextMenuSeparator />
                          <ContextMenuItem
                            onSelect={() => {
                              onArchive(c.id);
                            }}
                          >
                            <Archive className="h-4 w-4 mr-2" />
                            Archivar
                          </ContextMenuItem>
                          {isMine ? (
                            <ContextMenuItem
                              onSelect={() => {
                                onAssignToAi(c.id);
                              }}
                            >
                              <Bot className="h-4 w-4 mr-2" />
                              Liberar a IA
                            </ContextMenuItem>
                          ) : (
                            <ContextMenuItem
                              onSelect={() => {
                                onAssignToHuman(c.id);
                              }}
                            >
                              <UserCircle className="h-4 w-4 mr-2" />
                              Mover a Atención
                            </ContextMenuItem>
                          )}
                        </ContextMenuContent>
                      )}
                    </ContextMenuPrimitive.Root>
                  </motion.li>
                );
              })}
            {!isLoading && filtered.length === 0 && (
              <motion.li
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="p-4"
              >
                <EmptyState
                  className="py-8 border-0 bg-transparent"
                  icon={
                    bucket === "mine" ? (
                      <User className="h-5 w-5" />
                    ) : bucket === "ai" ? (
                      <Sparkles className="h-5 w-5" />
                    ) : (
                      <Archive className="h-5 w-5" />
                    )
                  }
                  title={
                    bucket === "mine"
                      ? "Sin pendientes humanos"
                      : bucket === "ai"
                        ? "IA al mando"
                        : "Sin conversaciones archivadas"
                  }
                  description={
                    bucket === "mine"
                      ? "La IA está gestionando el resto de la bandeja."
                      : bucket === "ai"
                        ? "Todas las conversaciones están siendo manejadas por la IA."
                        : "No hay conversaciones cerradas o inactivas."
                  }
                />
              </motion.li>
            )}
          </ul>
        </ScrollArea>
      </div>
    </>
  );
}
