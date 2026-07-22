import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ConversationList } from "./conversation-list";
import { ChatPane } from "./chat-pane";
import { ConversationDetailsPanel } from "./details-panel";
import {
  type ChatMessage,
  type Conversation,
  type ConversationBucket,
  type ConversationStatus,
} from "@/lib/conversation-types";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useUnifiedConversations,
  useUnifiedConversationMessages,
  useReplyUnifiedConversation,
  useTakeControlUnifiedConversation,
  useSetUnifiedConversationStatus,
  type UnifiedConversation,
  type UnifiedMessage,
} from "@/api/hooks/useUnifiedConversations";
import { useSendConversationMessage } from "@/api/hooks/useConversations";

function apiStatusToLocal(status?: string): ConversationStatus {
  const s = (status || "").toLowerCase();
  switch (s) {
    case "waiting_human":
      return "requires_human";
    case "active":
      return "ai_responding";
    case "inactive":
    case "closed":
    case "spam":
      return "closed";
    default:
      return "ai_responding";
  }
}

function getBucket(c: Conversation): ConversationBucket {
  const status = (c.status || "").toLowerCase();
  if (status === "closed" || c.source === "internal") return "archived";
  if (c.isWaitingHuman || status === "requires_human") return "mine";
  return "ai";
}

function formatHHmm(iso?: string): string {
  if (!iso) return nowHHmm();
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return nowHHmm();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function mapRoleToSender(role?: string, source?: "channel" | "internal"): ChatMessage["sender"] {
  const r = (role || "").toUpperCase();
  if (source === "channel") {
    if (r === "USER") return "patient";
    if (r === "SYSTEM") return "system";
    return "ai";
  }
  if (r === "USER") return "human";
  if (r === "AGENT" || r === "ASSISTANT") return "ai";
  if (r === "SYSTEM" || r === "TOOL") return "system";
  return "ai";
}

function mapApiMessage(api: UnifiedMessage, source?: "channel" | "internal"): ChatMessage {
  return {
    id: String(api.id ?? `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`),
    sender: mapRoleToSender(api.role, source),
    text: api.content ?? "",
    time: formatHHmm(api.created),
    created: api.created,
    tokens_used: api.tokens_used,
    rag_sources: api.rag_sources,
    tool_calls: api.tool_calls,
    tool_results: api.tool_results,
    response_time_ms: api.response_time_ms,
  };
}

function mapApiConversation(api: UnifiedConversation): Conversation {
  const status = apiStatusToLocal(api.status);
  const lastMsgText = api.last_message ?? "";
  const lastMsgTime = formatHHmm(api.modified ?? api.created);
  const isChannel = api.source === "channel";
  const patientName = isChannel
    ? api.external_user_name || api.external_user_id || api.channel_name || "Visitante"
    : api.title || "Chat interno";
  const controlledBy = status === "closed" || api.is_waiting_human ? "human" : "ai";

  return {
    id: String(api.id),
    patientName,
    phone: api.external_user_phone ?? "",
    branch: api.branch_name ?? String(api.branch ?? ""),
    doctor: undefined,
    lastMessage: lastMsgText,
    lastTime: lastMsgTime,
    status,
    badges: [status],
    estimatedValue: 0,
    unread: api.is_waiting_human ? 1 : 0,
    controlledBy,
    campaign: api.channel_name ?? api.channel_type ?? "",
    opportunityType: api.channel_type ?? "",
    nextAction: api.display_status ?? "",
    aiSummary: "",
    humanReasons: api.is_waiting_human ? ["Esperando atención humana"] : [],
    suggestion: "",
    messages: [],
    timeline: [],
    lastContact: lastMsgTime,
    reviewFlag: undefined,
    appointment: undefined,
    source: api.source ?? "channel",
    channelType: api.channel_type,
    channelName: api.channel_name,
    externalUserId: api.external_user_id,
    externalUserName: api.external_user_name,
    agentName: api.agent_name,
    isWaitingHuman: api.is_waiting_human,
    isRecentlyActive: api.is_recently_active,
    messageCount: api.message_count,
    displayStatus: api.display_status,
    raw: api as unknown as Record<string, unknown>,
  };
}

export function ConversationsView() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: apiConvos = [], isLoading, error } = useUnifiedConversations();
  const takeControlMutation = useTakeControlUnifiedConversation();
  const setStatusMutation = useSetUnifiedConversationStatus();
  const replyMutation = useReplyUnifiedConversation();
  const internalSendMutation = useSendConversationMessage();

  const convos = useMemo(() => {
    if (!Array.isArray(apiConvos)) return [];
    return apiConvos.filter((c) => c.source === "channel").map(mapApiConversation);
  }, [apiConvos]);

  const idFromUrl = searchParams.get("id");
  const [selectedId, setSelectedId] = useState<string>(idFromUrl ?? "");
  const [bucket, setBucket] = useState<ConversationBucket>("mine");
  const [subFilter, setSubFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Mensajes locales enviados optimistamente mientras llega el refetch.
  const [localMessages, setLocalMessages] = useState<Record<string, ChatMessage[]>>({});
  const hasSetInitialRef = useRef(false);
  const lastUrlIdRef = useRef<string | null>(idFromUrl);

  useEffect(() => {
    if (idFromUrl && idFromUrl !== lastUrlIdRef.current) {
      lastUrlIdRef.current = idFromUrl;
      setSelectedId(idFromUrl);
    }
  }, [idFromUrl]);

  useEffect(() => {
    if (convos.length > 0 && !selectedId && !hasSetInitialRef.current) {
      hasSetInitialRef.current = true;
      const first = convos[0];
      setSelectedId(first.id);
      setBucket(getBucket(first));
      setSubFilter("all");
    }
  }, [convos, selectedId]);

  const selected = useMemo(
    () => convos.find((c) => c.id === selectedId) ?? convos[0],
    [convos, selectedId],
  );

  const selectedSource = useMemo<"channel" | "internal">(
    () => (selected?.source as "channel" | "internal") ?? "channel",
    [selected?.source],
  );

  const { data: apiMessages = [] } = useUnifiedConversationMessages(selected?.id, selectedSource);

  const messages = useMemo<ChatMessage[]>(() => {
    const remote = Array.isArray(apiMessages)
      ? apiMessages.map((m) => mapApiMessage(m, selectedSource))
      : [];
    const local = localMessages[selected?.id ?? ""] ?? [];
    // Filtrar locales que ya aparecen en remoto (mismo texto y tiempo cercano).
    const filteredLocal = local.filter((lm) => {
      if (lm.sender !== "human") return false;
      return !remote.some(
        (rm) =>
          rm.sender === "human" &&
          rm.text.trim() === lm.text.trim() &&
          Math.abs(
            new Date(`1970-01-01T${rm.time}:00`).getTime() -
              new Date(`1970-01-01T${lm.time}:00`).getTime(),
          ) < 120_000,
      );
    });
    return [...remote, ...filteredLocal];
  }, [apiMessages, localMessages, selected?.id, selectedSource]);

  const selectedWithMessages = useMemo<Conversation | undefined>(() => {
    if (!selected) return undefined;
    return { ...selected, messages };
  }, [selected, messages]);

  const handleSelect = (id: string) => {
    const conv = convos.find((c) => c.id === id);
    if (conv) {
      const b = getBucket(conv);
      if (b !== bucket) {
        setBucket(b);
        setSubFilter("all");
      }
    }
    setSelectedId(id);
    setMobileView("chat");
    setSearchParams({ id }, { replace: true });
  };

  const appendLocalMessage = (msg: ChatMessage) => {
    setLocalMessages((prev) => {
      const existing = prev[selectedId] ?? [];
      return { ...prev, [selectedId]: [...existing, msg] };
    });
  };

  const updateLocalConversation = (patch: Partial<Conversation>) => {
    // Los cambios locales son efímeros; el siguiente refetch de la lista los normaliza.
    // Solo actualizamos mensajes y dejamos que el hook refetch la lista.
    void patch;
  };

  const handleTakeControl = () => {
    if (!selectedId || selectedSource !== "channel") return;
    takeControlMutation.mutate(selectedId, {
      onSuccess: () => {
        appendLocalMessage({
          id: `sys-${Date.now()}`,
          sender: "system",
          text: "Tomaste control de la conversación.",
          time: nowHHmm(),
        });
        toast.success("Tomaste control de la conversación");
      },
      onError: () => toast.error("Error al tomar control de la conversación"),
    });
  };

  const handleSend = (text: string) => {
    if (!text.trim() || !selectedId) return;
    const trimmed = text.trim();

    appendLocalMessage({
      id: `h-${Date.now()}`,
      sender: "human",
      text: trimmed,
      time: nowHHmm(),
    });

    if (selectedSource === "channel") {
      replyMutation.mutate(
        { id: selectedId, message: trimmed },
        {
          onSuccess: () => {
            // El refetch de mensajes traerá la respuesta real.
          },
          onError: () => toast.error("Error al enviar el mensaje"),
        },
      );
      return;
    }

    internalSendMutation.mutate(
      { id: selectedId, message: trimmed },
      {
        onSuccess: (data) => {
          if (data?.message) {
            appendLocalMessage({
              id: `ai-${Date.now()}`,
              sender: "ai",
              text: data.message,
              time: nowHHmm(),
            });
          }
        },
        onError: () => toast.error("Error al enviar el mensaje"),
      },
    );
  };

  const handleResolve = () => {
    if (selectedSource === "channel" && selectedId) {
      setStatusMutation.mutate(
        { id: selectedId, status: "closed" },
        {
          onSuccess: () => toast.success("Conversación cerrada"),
          onError: () => toast.error("Error al cerrar la conversación"),
        },
      );
      return;
    }
    updateLocalConversation({ status: "closed" });
    toast.success("Conversación marcada como resuelta");
  };

  const handleSetInactive = () => {
    if (selectedSource === "channel" && selectedId) {
      setStatusMutation.mutate(
        { id: selectedId, status: "inactive" },
        {
          onSuccess: () => toast.success("Conversación marcada como inactiva"),
          onError: () => toast.error("Error al cambiar el estado"),
        },
      );
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100dvh-3.5rem)] flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100dvh-3.5rem)] flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-destructive">Error al cargar las conversaciones</p>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-3.5rem)] flex bg-background overflow-hidden">
      <aside
        className={`${mobileView === "list" ? "flex" : "hidden"} md:flex w-full md:w-[340px] lg:w-[360px] border-r bg-card flex-col shrink-0`}
      >
        <ConversationList
          conversations={convos}
          selectedId={selectedId}
          onSelect={handleSelect}
          bucket={bucket}
          onBucketChange={setBucket}
          subFilter={subFilter}
          onSubFilterChange={setSubFilter}
          query={query}
          onQueryChange={setQuery}
        />
      </aside>

      <section
        className={`${mobileView === "chat" ? "flex" : "hidden"} md:flex flex-1 flex-col min-w-0`}
      >
        <div className="md:hidden flex items-center gap-2 border-b px-3 h-12 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setMobileView("list")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium text-sm truncate flex-1">
            {selectedWithMessages?.patientName || "Selecciona una conversación"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setDetailsOpen(true)}
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
        {selectedWithMessages ? (
          <ChatPane
            conversation={selectedWithMessages}
            onTakeControl={handleTakeControl}
            onSend={handleSend}
            onOpenDetails={() => setDetailsOpen(true)}
            onResolve={handleResolve}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Selecciona una conversación
          </div>
        )}
      </section>

      <aside className="hidden xl:flex w-[340px] border-l bg-card flex-col shrink-0 overflow-y-auto">
        {selectedWithMessages && (
          <ConversationDetailsPanel
            conversation={selectedWithMessages}
            onTakeControl={handleTakeControl}
            onResolve={handleResolve}
          />
        )}
      </aside>

      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 overflow-y-auto xl:hidden">
          {selectedWithMessages && (
            <ConversationDetailsPanel
              conversation={selectedWithMessages}
              onTakeControl={handleTakeControl}
              onResolve={handleResolve}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function nowHHmm() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
