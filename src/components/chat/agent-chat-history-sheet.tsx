import { Archive, History, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatDateTime, formatRelative } from "@/lib/datetime";
import type { UnifiedConversation } from "@/api/hooks/useUnifiedConversations";

type HistoryTab = "active" | "archived";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  historyTab: HistoryTab;
  onHistoryTabChange: (tab: HistoryTab) => void;
  conversations: UnifiedConversation[];
  conversationsLoading: boolean;
  conversationId: string | null;
  updatePending: boolean;
  onSelect: (id: string) => void;
  onArchive: (id: string | number) => void;
  onRestore: (id: string | number) => void;
};

export function AgentChatHistorySheet({
  open,
  onOpenChange,
  historyTab,
  onHistoryTabChange,
  conversations,
  conversationsLoading,
  conversationId,
  updatePending,
  onSelect,
  onArchive,
  onRestore,
}: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 cursor-pointer"
          title="Historial"
        >
          <History className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-sm p-0 bg-background flex flex-col h-full"
      >
        <SheetHeader className="px-4 py-4 border-b border-border/50 shrink-0 space-y-1">
          <SheetTitle className="text-sm font-medium">Historial de prueba</SheetTitle>
          <p className="text-[11px] text-muted-foreground font-normal">
            Las conversaciones solo se archivan cuando tú lo indiques.
          </p>
        </SheetHeader>
        <div className="flex flex-col flex-1 min-h-0 p-3">
          <div className="flex rounded-lg border border-border/50 p-0.5 mb-3 shrink-0">
            <button
              type="button"
              onClick={() => onHistoryTabChange("active")}
              className={`flex-1 text-xs font-medium py-1 rounded-md transition-colors ${
                historyTab === "active"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Activas
            </button>
            <button
              type="button"
              onClick={() => onHistoryTabChange("archived")}
              className={`flex-1 text-xs font-medium py-1 rounded-md transition-colors ${
                historyTab === "archived"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Archivadas
            </button>
          </div>

          <ScrollArea className="flex-1 -mx-3 px-3">
            {conversationsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-sm text-muted-foreground py-6 text-center">
                No hay conversaciones previas
              </div>
            ) : (
              <div className="space-y-1 pb-2">
                {conversations.map((conv) => {
                  const isArchived =
                    historyTab === "archived" ||
                    (conv.status || "").toLowerCase().trim() === "archived" ||
                    (conv.status || "").toLowerCase().trim() === "closed" ||
                    (conv.status || "").toLowerCase().trim() === "inactive";
                  return (
                    <div
                      key={conv.id}
                      className={`group flex items-center gap-1 rounded-md text-sm transition-colors ${
                        String(conv.id) === conversationId
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted/50 text-foreground"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onSelect(String(conv.id))}
                        className="flex-1 text-left px-3 py-2.5 min-w-0"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-medium truncate">
                            {conv.title || "Sin título"}
                          </span>
                          <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                            #{conv.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 space-y-0.5">
                          <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                            <span>{conv.message_count ?? 0} msgs</span>
                            {conv.created && (
                              <span title={formatDateTime(conv.created) ?? undefined}>
                                Inicio {formatRelative(conv.created)}
                              </span>
                            )}
                            {conv.modified && (
                              <span title={formatDateTime(conv.modified) ?? undefined}>
                                Act. {formatRelative(conv.modified)}
                              </span>
                            )}
                          </div>
                          {conv.last_message && (
                            <p className="truncate text-[10px] opacity-80">{conv.last_message}</p>
                          )}
                        </div>
                      </button>
                      {isArchived ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRestore(conv.id);
                          }}
                          disabled={updatePending}
                          className="shrink-0 inline-flex items-center gap-1 px-2 py-2 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
                          title="Restaurar"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Restaurar</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onArchive(conv.id);
                          }}
                          disabled={updatePending}
                          className="shrink-0 inline-flex items-center gap-1 px-2 py-2 text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer disabled:opacity-50"
                          title="Archivar"
                        >
                          <Archive className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Archivar</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
