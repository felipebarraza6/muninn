import { Search, Sparkles, Inbox, Archive, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
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
}

const BUCKET_ICONS: Record<ConversationBucket, typeof Inbox> = {
  mine: Inbox,
  ai: Sparkles,
  archived: Archive,
};

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
}: Props) {
  const counts = CONVERSATION_BUCKETS.reduce(
    (acc, b) => {
      acc[b.id] = conversations.filter((c) => getConversationBucket(c) === b.id).length;
      return acc;
    },
    {} as Record<ConversationBucket, number>,
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
                  "flex flex-col items-center gap-0.5 rounded-md px-1 py-1.5 text-[10px] leading-tight font-medium transition-colors",
                  active
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <div className="flex items-center gap-1">
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

      <ScrollArea className="flex-1">
        <ul>
          {filtered.map((c) => {
            const isSelected = c.id === selectedId;
            const statusLabel = STATUS_LABEL[c.status];
            const ChannelIcon = channelIcon(c.channelType);
            const isChannel = c.source === "channel";
            return (
              <li key={c.id}>
                <button
                  onClick={() => onSelect(c.id)}
                  className={cn(
                    "relative w-full text-left px-4 py-3 flex gap-3 transition-colors border-l-2 border-transparent",
                    isSelected ? "bg-primary-soft/40 border-l-primary" : "hover:bg-muted/40",
                  )}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback
                      className={cn("text-xs font-semibold", avatarColor(c.patientName))}
                    >
                      {initials(c.patientName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium truncate">{c.patientName}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {c.lastTime}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{c.lastMessage}</p>
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
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="p-4">
              <EmptyState
                className="py-8 border-0 bg-transparent"
                title={
                  bucket === "mine"
                    ? "Sin pendientes humanos"
                    : "Sin conversaciones para este filtro"
                }
                description={
                  bucket === "mine"
                    ? "La IA está gestionando el resto de la bandeja."
                    : "Probá otro bucket o limpiá la búsqueda."
                }
              />
            </li>
          )}
        </ul>
      </ScrollArea>
    </>
  );
}
