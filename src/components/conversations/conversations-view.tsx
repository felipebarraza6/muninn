import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ConversationList } from "./conversation-list";
import { ChatPane } from "./chat-pane";
import { ConversationDetailsPanel } from "./details-panel";
import {
  type ChatMessage,
  type Conversation,
  type ConversationBucket,
  type ConversationStatus,
  getConversationBucket,
} from "@/lib/conversation-types";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, Info } from "lucide-react";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "sonner";
import { apiErrorMessage } from "@/lib/apiError";
import {
  useUnifiedConversations,
  useUnifiedConversationMessages,
  useReplyUnifiedConversation,
  useTakeControlUnifiedConversation,
  useReleaseConversation,
  useSetUnifiedConversationStatus,
  type UnifiedConversation,
  type UnifiedMessage,
} from "@/api/hooks/useUnifiedConversations";
import { useSendConversationMessage } from "@/api/hooks/useConversations";
import { canInterveneInConversations, isSuperAdmin } from "@/lib/authGuards";

function apiStatusToLocal(status?: string): ConversationStatus {
  const s = (status || "").toLowerCase();
  switch (s) {
    case "waiting_human":
      return "requires_human";
    case "active":
      return "ai_responding";
    case "archived":
    case "inactive":
    case "closed":
    case "spam":
      return "closed";
    default:
      return "ai_responding";
  }
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
    // Historial de canal (BE):
    //   USER      → cliente externo
    //   AGENT     → reply manual del operador humano
    //   ASSISTANT → respuesta del agente IA
    if (r === "USER") return "patient";
    if (r === "AGENT" || r === "HUMAN" || r === "OPERATOR") return "human";
    if (r === "SYSTEM") return "system";
    return "ai";
  }
  if (r === "USER") return "human";
  if (r === "AGENT" || r === "ASSISTANT") return "ai";
  if (r === "SYSTEM" || r === "TOOL") return "system";
  return "ai";
}

function parseMsgClock(time: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!m) return 0;
  return Number(m[1]) * 60 + Number(m[2]);
}

/** True si el remoto ya incluye este mensaje optimista (mismo texto, ventana corta). */
function remoteHasLocalOutgoing(remote: ChatMessage[], local: ChatMessage): boolean {
  const localText = local.text.trim();
  if (!localText) return false;
  return remote.some((rm) => {
    if (rm.sender !== "human" && rm.sender !== "ai") return false;
    if (rm.text.trim() !== localText) return false;
    if (local.created && rm.created) {
      const a = new Date(local.created).getTime();
      const b = new Date(rm.created).getTime();
      if (Number.isFinite(a) && Number.isFinite(b)) {
        return Math.abs(a - b) < 120_000;
      }
    }
    return Math.abs(parseMsgClock(rm.time) - parseMsgClock(local.time)) < 3;
  });
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
    lastMessage: lastMsgText,
    lastTime: lastMsgTime,
    status,
    badges: [status],
    unread: api.is_waiting_human ? 1 : 0,
    controlledBy,
    campaign: api.channel_name ?? api.channel_type ?? "",
    opportunityType: api.channel_type ?? "",
    nextAction: api.display_status ?? "",
    humanReasons: api.is_waiting_human ? ["Esperando atención humana"] : [],
    messages: [],
    lastContact: lastMsgTime,
    waitingSince: api.is_waiting_human ? (api.modified ?? api.created) : undefined,
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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const analysisOnly = !canInterveneInConversations();
  const isPlatformAnalysis = isSuperAdmin();

  const { data: apiConvos = [], isLoading, error, refetch, isFetching } = useUnifiedConversations();
  const takeControlMutation = useTakeControlUnifiedConversation();
  const releaseMutation = useReleaseConversation();
  const setStatusMutation = useSetUnifiedConversationStatus();
  const replyMutation = useReplyUnifiedConversation();
  const internalSendMutation = useSendConversationMessage();

  const convos = useMemo(() => {
    if (!Array.isArray(apiConvos)) return [];
    return apiConvos.map(mapApiConversation);
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
      setBucket(getConversationBucket(first));
      setSubFilter("all");
    }
  }, [convos, selectedId]);

  const selected = useMemo(
    () => convos.find((c) => c.id === selectedId) ?? null,
    [convos, selectedId],
  );

  const selectedSource = useMemo<"channel" | "internal" | undefined>(
    () => (selected?.source as "channel" | "internal") ?? undefined,
    [selected?.source],
  );

  const { data: apiMessages = [] } = useUnifiedConversationMessages(selected?.id, selectedSource);

  const messages = useMemo<ChatMessage[]>(() => {
    const remote = Array.isArray(apiMessages)
      ? apiMessages.map((m) => mapApiMessage(m, selectedSource))
      : [];
    const local = localMessages[selected?.id ?? ""] ?? [];
    // Quitar optimistas ya presentes en el refetch (evita duplicado azul + teal).
    const filteredLocal = local.filter((lm) => {
      if (lm.sender === "system") {
        // Mantener avisos locales de sistema (p. ej. "Tomaste control").
        return true;
      }
      if (lm.sender !== "human") return false;
      return !remoteHasLocalOutgoing(remote, lm);
    });
    return [...remote, ...filteredLocal];
  }, [apiMessages, localMessages, selected?.id, selectedSource]);

  const selectedWithMessages = useMemo<Conversation | undefined>(() => {
    if (!selected) return undefined;
    return { ...selected, messages };
  }, [selected, messages]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setMobileView("chat");
    setSearchParams({ id }, { replace: true });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
        return;
      }
      if (e.key === "Escape") {
        if (mobileView === "chat") {
          setMobileView("list");
          return;
        }
        navigate("/app");
        return;
      }
      if (e.key !== "j" && e.key !== "k" && e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      const inBucket = convos.filter((c) => getConversationBucket(c) === bucket);
      if (!inBucket.length) return;
      e.preventDefault();
      const idx = inBucket.findIndex((c) => c.id === selectedId);
      const delta = e.key === "j" || e.key === "ArrowDown" ? 1 : -1;
      const nextIdx = Math.max(0, Math.min(inBucket.length - 1, (idx < 0 ? 0 : idx) + delta));
      const next = inBucket[nextIdx];
      if (next) handleSelect(next.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, mobileView, convos, bucket, selectedId]);

  const appendLocalMessage = (msg: ChatMessage) => {
    setLocalMessages((prev) => {
      const existing = prev[selectedId] ?? [];
      return { ...prev, [selectedId]: [...existing, msg] };
    });
  };

  const handleTakeControl = () => {
    if (analysisOnly || !selectedId || selectedSource !== "channel") return;
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
      onError: (e) => toast.error(apiErrorMessage(e, "Error al tomar control de la conversación")),
    });
  };

  const handleRelease = () => {
    if (analysisOnly || !selectedId || selectedSource !== "channel") return;
    if (selected?.status === "closed" || !selected?.isWaitingHuman) return;
    releaseMutation.mutate(selectedId, {
      onSuccess: () => {
        appendLocalMessage({
          id: `sys-${Date.now()}`,
          sender: "system",
          text: "Devolviste el control al agente IA.",
          time: nowHHmm(),
        });
        toast.success("Control devuelto al agente IA");
      },
      onError: (e) => toast.error(apiErrorMessage(e, "Error al devolver el control al agente")),
    });
  };

  const clearLocalOutgoing = (conversationId: string, text: string) => {
    const trimmed = text.trim();
    setLocalMessages((prev) => {
      const existing = prev[conversationId] ?? [];
      const next = existing.filter((m) => !(m.sender === "human" && m.text.trim() === trimmed));
      if (next.length === existing.length) return prev;
      return { ...prev, [conversationId]: next };
    });
  };

  const handleSend = (text: string) => {
    if (analysisOnly || !text.trim() || !selectedId) return;
    const trimmed = text.trim();
    const optimisticId = `h-${Date.now()}`;

    appendLocalMessage({
      id: optimisticId,
      sender: "human",
      text: trimmed,
      time: nowHHmm(),
      created: new Date().toISOString(),
    });

    if (selectedSource === "channel") {
      replyMutation.mutate(
        { id: selectedId, message: trimmed },
        {
          onError: (e) => {
            clearLocalOutgoing(selectedId, trimmed);
            toast.error(apiErrorMessage(e, "Error al enviar el mensaje"));
          },
        },
      );
      return;
    }

    internalSendMutation.mutate(
      { id: selectedId, message: trimmed },
      {
        onSuccess: (data) => {
          clearLocalOutgoing(selectedId, trimmed);
          if (data?.message) {
            appendLocalMessage({
              id: `ai-${Date.now()}`,
              sender: "ai",
              text: data.message,
              time: nowHHmm(),
            });
          }
        },
        onError: (e) => {
          clearLocalOutgoing(selectedId, trimmed);
          toast.error(apiErrorMessage(e, "Error al enviar el mensaje"));
        },
      },
    );
  };

  const handleResolve = () => {
    if (analysisOnly) return;
    if (selectedSource === "channel" && selectedId) {
      setStatusMutation.mutate(
        { id: selectedId, status: "closed" },
        {
          onSuccess: () => toast.success("Conversación cerrada"),
          onError: (e) => toast.error(apiErrorMessage(e, "Error al cerrar la conversación")),
        },
      );
      return;
    }
    toast.error("Solo se pueden cerrar conversaciones de canal");
  };

  const handleSetInactive = () => {
    if (selectedSource === "channel" && selectedId) {
      setStatusMutation.mutate(
        { id: selectedId, status: "inactive" },
        {
          onSuccess: () => toast.success("Conversación marcada como inactiva"),
          onError: (e) => toast.error(apiErrorMessage(e, "Error al cambiar el estado")),
        },
      );
    }
  };

  if (isLoading) {
    return (
      <div className="h-dvh bg-background">
        <PageSkeleton variant="inbox" className="h-full max-w-none" padded={false} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center bg-background gap-4 px-6">
        <p className="text-destructive text-center">
          {apiErrorMessage(error, "Error al cargar las conversaciones")}
        </p>
        <Button onClick={() => void refetch()} disabled={isFetching}>
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col bg-background overflow-hidden">
      <div className="shrink-0 border-b border-border/60 bg-card/80 backdrop-blur px-3 py-2 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 shrink-0 gap-1.5 px-2 text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link to="/app" title="Volver (Esc)">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xs font-medium">Volver</span>
          </Link>
        </Button>
        <span className="text-sm font-medium truncate">Conversaciones</span>
        {isPlatformAnalysis ? (
          <span className="ml-auto text-[11px] text-muted-foreground truncate hidden sm:inline">
            Análisis · solo lectura
          </span>
        ) : null}
      </div>
      {isPlatformAnalysis ? (
        <div className="shrink-0 border-b border-border/60 bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
          Filtra por sucursal en la bandeja (con búsqueda). Usa el inspector de mensajes para
          revisar el hilo.
        </div>
      ) : null}
      <div className="flex flex-1 min-h-0 overflow-hidden">
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
              onRelease={handleRelease}
              onSend={handleSend}
              onOpenDetails={() => setDetailsOpen(true)}
              onResolve={handleResolve}
              analysisOnly={analysisOnly}
              sending={replyMutation.isPending || internalSendMutation.isPending}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <EmptyState
                title="Selecciona una conversación"
                description="Elige un hilo en la bandeja o usa j/k para navegar."
              />
            </div>
          )}
        </section>

        <aside className="hidden xl:flex w-[340px] border-l bg-card flex-col shrink-0 overflow-y-auto">
          {selectedWithMessages && (
            <ConversationDetailsPanel
              conversation={selectedWithMessages}
              onTakeControl={handleTakeControl}
              onResolve={handleResolve}
              analysisOnly={analysisOnly}
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
                analysisOnly={analysisOnly}
              />
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

function nowHHmm() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
