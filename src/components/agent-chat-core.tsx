import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Bot,
  History,
  Loader2,
  MessageSquarePlus,
  Send,
  Archive,
  User,
  MoreVertical,
  RefreshCw,
} from "lucide-react";
import { useAgent } from "@/api/hooks/useAgents";
import {
  useConversationMessages,
  useSendConversationMessage,
  useCreateConversation,
  useUpdateConversationStatus,
  type ChatMessageResponse,
} from "@/api/hooks/useConversations";
import {
  useUnifiedConversations,
  type UnifiedConversation,
} from "@/api/hooks/useUnifiedConversations";
import { toast } from "sonner";

interface ChatMessage {
  id: string | number;
  role: "user" | "agent" | "system";
  content: string;
  created?: string;
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeMessages(data?: ChatMessageResponse[]): ChatMessage[] {
  if (!Array.isArray(data)) return [];
  return data.map((m) => ({
    id: m.id ?? makeId("msg"),
    role: (m.role?.toLowerCase() === "user"
      ? "user"
      : m.role?.toLowerCase() === "system"
        ? "system"
        : "agent") as ChatMessage["role"],
    content: m.content ?? m.text ?? m.message ?? "",
    created: m.created_at ?? m.timestamp,
  }));
}

function formatTime(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
}

function getCurrentUserId(): number | undefined {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return parsed?.id;
  } catch {
    return undefined;
  }
}

interface AgentChatCoreProps {
  agentId: string;
  showBackLink?: boolean;
  backTo?: string;
}

export function AgentChatCore({
  agentId,
  showBackLink = true,
  backTo = "/agentes",
}: AgentChatCoreProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const conversationIdFromUrl = searchParams.get("conversation");

  const { data: agent, isLoading: agentLoading, error: agentError } = useAgent(agentId);
  const { data: allConversations = [], isLoading: conversationsLoading } =
    useUnifiedConversations();
  const createConversation = useCreateConversation();
  const sendMessage = useSendConversationMessage();
  const updateStatus = useUpdateConversationStatus();

  const [conversationId, setConversationId] = useState<string | null>(conversationIdFromUrl);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyTab, setHistoryTab] = useState<"active" | "archived">("active");
  const initializedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastRemoteMessagesRef = useRef<string>("");

  const agentConversations = useMemo(
    () =>
      allConversations
        .filter((c: UnifiedConversation) => {
          if (String(c.agent) !== agentId || c.source !== "internal") return false;
          const status = (c.status || "").toLowerCase().trim();
          if (historyTab === "active") return status === "active";
          return status === "archived" || status === "closed" || status === "inactive";
        })
        .sort((a, b) => {
          const da = new Date(b.modified ?? 0).getTime();
          const db = new Date(a.modified ?? 0).getTime();
          return da - db;
        })
        .slice(0, 50),
    [allConversations, agentId, historyTab],
  );

  const activeAgentConversations = useMemo(
    () =>
      allConversations
        .filter((c: UnifiedConversation) => {
          if (String(c.agent) !== agentId || c.source !== "internal") return false;
          return (c.status || "").toLowerCase().trim() === "active";
        })
        .sort((a, b) => {
          const da = new Date(b.modified ?? 0).getTime();
          const db = new Date(a.modified ?? 0).getTime();
          return da - db;
        }),
    [allConversations, agentId],
  );

  const { data: remoteMessages, isLoading: messagesLoading } = useConversationMessages(
    conversationId ?? undefined,
    { refetchInterval: false },
  );

  useEffect(() => {
    initializedRef.current = false;
    setConversationId(conversationIdFromUrl);
    setMessages([]);
    setCreateError(null);
  }, [agentId, conversationIdFromUrl]);

  useEffect(() => {
    if (!remoteMessages) return;
    const next = normalizeMessages(remoteMessages);
    const key = JSON.stringify(next.map((m) => ({ id: m.id, content: m.content })));
    if (key === lastRemoteMessagesRef.current) return;
    lastRemoteMessagesRef.current = key;
    setMessages(next);
  }, [remoteMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendMessage.isPending]);

  const doCreateConversation = useCallback(() => {
    if (!agent || !agentId) return;
    setIsCreating(true);
    setCreateError(null);
    createConversation.mutate(
      {
        agent: agentId,
        title: `Chat con ${agent.name}`,
        user: getCurrentUserId(),
      },
      {
        onSuccess: (data) => {
          setConversationId(String(data.id));
          setSearchParams({ conversation: String(data.id) }, { replace: true });
          if (agent.welcome_message) {
            setMessages((prev) => [
              ...prev,
              {
                id: makeId("welcome"),
                role: "agent",
                content: agent.welcome_message,
                created: new Date().toISOString(),
              },
            ]);
          }
          setIsCreating(false);
        },
        onError: (err) => {
          const detail = (err as { friendlyMessage?: string })?.friendlyMessage;
          setCreateError(detail || "No se pudo iniciar la conversación");
          setIsCreating(false);
        },
      },
    );
  }, [agent, createConversation, agentId, setSearchParams]);

  useEffect(() => {
    if (agentLoading || !agent || initializedRef.current || conversationsLoading) return;
    initializedRef.current = true;

    if (conversationIdFromUrl) {
      setConversationId(conversationIdFromUrl);
      return;
    }

    const lastActive = activeAgentConversations[0];
    if (lastActive) {
      setConversationId(String(lastActive.id));
      setSearchParams({ conversation: String(lastActive.id) }, { replace: true });
    }
  }, [
    agentLoading,
    agent,
    conversationsLoading,
    conversationIdFromUrl,
    activeAgentConversations,
    setSearchParams,
  ]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || sendMessage.isPending || !conversationId) return;

    const text = input.trim();
    const userMsg: ChatMessage = {
      id: makeId("user"),
      role: "user",
      content: text,
      created: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    sendMessage.mutate(
      { id: conversationId, message: text },
      {
        onSuccess: (data) => {
          if (data?.message || data?.content || data?.text) {
            setMessages((prev) => [
              ...prev,
              {
                id: data.id ?? makeId("agent"),
                role: data.sender?.toLowerCase() === "user" ? "user" : "agent",
                content: data.message ?? data.content ?? data.text ?? "",
                created: data.created_at ?? data.timestamp ?? new Date().toISOString(),
              },
            ]);
          }
        },
        onError: () => {
          toast.error("Error al enviar el mensaje");
          setInput(text);
        },
      },
    );
  };

  const handleNewConversation = () => {
    if (!agent) return;
    initializedRef.current = false;
    setConversationId(null);
    setMessages([]);
    setCreateError(null);
    setSearchParams({}, { replace: true });
    doCreateConversation();
  };

  const handleSelectConversation = (convId: string) => {
    setConversationId(convId);
    setSearchParams({ conversation: convId }, { replace: true });
    setSidebarOpen(false);
  };

  const changeConversationStatus = (convId: string | number, nextStatus: "ARCHIVED" | "ACTIVE") => {
    const isArchiving = nextStatus === "ARCHIVED";
    updateStatus.mutate(
      { id: convId, status: nextStatus },
      {
        onSuccess: () => {
          toast.success(isArchiving ? "Conversación archivada" : "Conversación restaurada");
          if (String(convId) === conversationId && isArchiving) {
            setConversationId(null);
            setMessages([]);
            setSearchParams({}, { replace: true });
            doCreateConversation();
          }
        },
        onError: (err) => {
          const detail = (err as { friendlyMessage?: string })?.friendlyMessage;
          toast.error(
            detail ||
              (isArchiving
                ? "No se pudo archivar la conversación"
                : "No se pudo restaurar la conversación"),
          );
        },
      },
    );
  };

  const handleArchiveConversation = (convId: string | number) => {
    changeConversationStatus(convId, "ARCHIVED");
  };

  const handleRestoreConversation = (convId: string | number) => {
    changeConversationStatus(convId, "ACTIVE");
  };

  const handleCloseCurrentConversation = () => {
    if (!conversationId) return;
    changeConversationStatus(conversationId, "ARCHIVED");
  };

  const isReady = Boolean(agent?.is_active);

  if (agentLoading) {
    return (
      <div className="h-[calc(100dvh-3.5rem)] w-full bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (agentError || !agent) {
    return (
      <div className="h-[calc(100dvh-3.5rem)] w-full bg-background flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-destructive text-center">No se pudo cargar el agente.</p>
        <Button asChild variant="outline">
          <Link to={backTo}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-3.5rem)] w-full bg-background text-foreground flex flex-col overflow-hidden">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur px-4 py-3 flex items-center gap-3 shrink-0">
        {showBackLink && (
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" asChild>
            <Link to={backTo}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        )}

        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Bot className="h-4 w-4 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{agent.name}</div>
          <div className="text-xs text-muted-foreground truncate">
            {isReady ? "Listo para conversar" : "Sin modelo de lenguaje configurado"}
          </div>
        </div>

        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" title="Historial">
              <History className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full sm:max-w-sm p-0 bg-background flex flex-col h-full"
          >
            <SheetHeader className="px-4 py-4 border-b border-border/50 shrink-0">
              <SheetTitle className="text-sm font-medium">Historial</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col flex-1 min-h-0 p-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 mb-3 shrink-0"
                onClick={handleNewConversation}
              >
                <MessageSquarePlus className="h-4 w-4" /> Nueva conversación
              </Button>

              <div className="flex rounded-lg border border-border/50 p-0.5 mb-3 shrink-0">
                <button
                  onClick={() => setHistoryTab("active")}
                  className={`flex-1 text-xs font-medium py-1 rounded-md transition-colors ${
                    historyTab === "active"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Activas
                </button>
                <button
                  onClick={() => setHistoryTab("archived")}
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
                ) : agentConversations.length === 0 ? (
                  <div className="text-sm text-muted-foreground py-6 text-center">
                    No hay conversaciones previas
                  </div>
                ) : (
                  <div className="space-y-1 pb-2">
                    {agentConversations.map((conv) => {
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
                            onClick={() => handleSelectConversation(String(conv.id))}
                            className="flex-1 text-left px-3 py-2.5 min-w-0"
                          >
                            <div className="font-medium truncate">{conv.title || "Sin título"}</div>
                            <div className="text-xs text-muted-foreground">
                              {conv.message_count ?? 0} mensajes
                            </div>
                          </button>
                          {isArchived ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRestoreConversation(conv.id);
                              }}
                              disabled={updateStatus.isPending}
                              className="px-2 py-2 text-muted-foreground hover:text-destructive transition-colors"
                              title="Restaurar conversación"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                          ) : String(conv.id) !== conversationId ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArchiveConversation(conv.id);
                              }}
                              disabled={updateStatus.isPending}
                              className="px-2 py-2 text-muted-foreground hover:text-destructive transition-colors"
                              title="Archivar conversación"
                            >
                              <Archive className="h-4 w-4" />
                            </button>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>

        {conversationId && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" title="Opciones">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseCurrentConversation();
                }}
              >
                <Archive className="h-4 w-4 mr-2" /> Archivar conversación
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </header>

      <ScrollArea className="flex-1 px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-5">
          {messagesLoading && messages.length === 0 ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-12 w-2/3 ml-auto" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">¿Qué necesitas?</h2>
              <p className="text-muted-foreground max-w-md">
                Escribe tu consulta y {agent.name} te ayudará con lo que necesites.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center ${
                    msg.role === "user" ? "bg-muted" : "bg-primary/10"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="max-w-[85%] sm:max-w-[75%] space-y-1">
                  <div
                    className={`px-4 py-2.5 text-sm leading-relaxed rounded-2xl ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : msg.role === "system"
                          ? "bg-destructive/10 text-destructive rounded-bl-md border border-destructive/20"
                          : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div
                    className={`text-[10px] text-muted-foreground ${
                      msg.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {formatTime(msg.created)}
                  </div>
                </div>
              </div>
            ))
          )}

          {sendMessage.isPending && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2.5 flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {createError && (
        <div className="border-t border-border/50 bg-destructive/10 px-4 py-2 text-xs text-destructive text-center">
          {createError}{" "}
          <button
            type="button"
            onClick={doCreateConversation}
            className="underline font-medium ml-1"
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="border-t border-border/50 bg-card/50 backdrop-blur p-3 sm:p-4">
        <form
          onSubmit={handleSend}
          className="max-w-3xl mx-auto flex items-end gap-2 rounded-full bg-muted/60 border border-border/50 px-2 py-2 transition-colors focus-within:border-primary/40 focus-within:bg-muted"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              !conversationId
                ? "Iniciando conversación..."
                : sendMessage.isPending
                  ? "El agente está respondiendo..."
                  : "Escribe tu mensaje..."
            }
            disabled={sendMessage.isPending || !conversationId}
            className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-2 text-sm"
          />
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9 rounded-full shrink-0"
            disabled={!input.trim() || sendMessage.isPending || !conversationId}
          >
            {sendMessage.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
