import { useEffect, useRef, useState } from "react";
import {
  Send,
  Sparkles,
  MoreHorizontal,
  ShieldAlert,
  ThumbsUp,
  ThumbsDown,
  Info,
  CheckCircle2,
} from "lucide-react";
import { formatCLP } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/status-badge";
import type { ChatMessage, Conversation } from "@/lib/conversation-types";
import { channelIcon, channelLabel } from "@/lib/channels";
import { initials, avatarColor } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ChatMarkdown } from "@/components/chat/chat-markdown";
import { ChatCopyButton } from "@/components/chat/chat-copy-button";
import {
  MessageInsightSheet,
  MessageInspectButton,
  type InsightMessage,
} from "@/components/chat/message-insight-sheet";

interface Props {
  conversation: Conversation;
  onTakeControl: () => void;
  onRelease?: () => void;
  onSend: (text: string) => void;
  onOpenDetails: () => void;
  onResolve?: () => void;
  /** Superadmin: solo lectura + insights; sin tomar control ni responder. */
  analysisOnly?: boolean;
}

function toInsightMessage(m: ChatMessage): InsightMessage {
  return {
    id: m.id,
    content: m.text,
    created: m.created,
    rag_sources: m.rag_sources,
    tool_calls: m.tool_calls,
    tool_results: m.tool_results,
  };
}

export function ChatPane({
  conversation,
  onTakeControl,
  onRelease,
  onSend,
  onOpenDetails,
  onResolve,
  analysisOnly = false,
}: Props) {
  const [draft, setDraft] = useState("");
  const [feedback, setFeedback] = useState<Record<string, "up" | "down">>({});
  const [showSuggestion, setShowSuggestion] = useState(true);
  const [inspectMessage, setInspectMessage] = useState<InsightMessage | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft("");
    setFeedback({});
    setShowSuggestion(true);
    setInspectMessage(null);
  }, [conversation.id]);

  useEffect(() => {
    const el = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    ) as HTMLElement | null;
    if (el) el.scrollTop = el.scrollHeight;
  }, [conversation.messages.length, conversation.id]);

  const send = () => {
    if (!draft.trim()) return;
    onSend(draft);
    setDraft("");
    toast.success("Respuesta enviada");
  };

  const handleFeedback = (msgId: string, kind: "up" | "down") => {
    setFeedback((prev) => ({ ...prev, [msgId]: kind }));
    toast.success(kind === "up" ? "Buena respuesta marcada" : "Marcada para revisar");
  };

  const isChannel = conversation.source === "channel";
  const isAiControlled = conversation.controlledBy === "ai";
  const isOpen = conversation.status !== "closed";
  const canReply = !isChannel || conversation.isWaitingHuman === true;
  const showTakeControl = !analysisOnly && isOpen && isAiControlled;
  const showRelease =
    !analysisOnly && isOpen && conversation.isWaitingHuman === true && Boolean(onRelease);
  const ChannelIcon = channelIcon(conversation.channelType);

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-muted/20">
      {/* Header — limpio, una sola fila */}
      <div className="hidden md:flex items-center gap-3 border-b bg-card px-4 h-14 shrink-0">
        <Avatar className="h-9 w-9">
          <AvatarFallback
            className={cn("text-xs font-semibold", avatarColor(conversation.patientName))}
          >
            {initials(conversation.patientName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm truncate">{conversation.patientName}</span>
            <StatusBadge status={conversation.status} size="xs" />
            {isChannel && (
              <span className="hidden lg:inline-flex items-center gap-1 rounded-full bg-info-soft text-info px-2 py-0.5 text-[10px] font-medium">
                <ChannelIcon className="h-3 w-3" />
                {channelLabel(conversation.channelType, conversation.channelName)}
              </span>
            )}
            {conversation.estimatedValue > 0 && (
              <span
                title="Oportunidad vinculada"
                className="hidden lg:inline-flex items-center gap-1 rounded-full bg-success-soft text-success px-2 py-0.5 text-[10px] font-medium"
              >
                Oportunidad · {formatCLP(conversation.estimatedValue)}
              </span>
            )}
            {conversation.campaign ? (
              <span
                title={`Campaña: ${conversation.campaign}`}
                className="hidden lg:inline-flex items-center gap-1 rounded-full bg-primary-soft text-primary px-2 py-0.5 text-[10px] font-medium"
              >
                {conversation.campaign}
              </span>
            ) : null}
          </div>
          <div className="text-[11px] text-muted-foreground truncate">
            {conversation.phone} · {conversation.branch}
            {conversation.appointment && (
              <span className="ml-2 text-success font-medium">
                · Agendada {conversation.appointment.date} {conversation.appointment.time}
              </span>
            )}
          </div>
        </div>
        {showTakeControl && (
          <Button size="sm" onClick={onTakeControl}>
            Tomar control
          </Button>
        )}
        {showRelease && (
          <Button size="sm" variant="outline" onClick={onRelease}>
            Devolver al agente
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={onOpenDetails}>
              <Info className="h-3.5 w-3.5 mr-2" /> Detalles
            </DropdownMenuItem>
            {!analysisOnly && onResolve && conversation.status !== "closed" && (
              <DropdownMenuItem onClick={onResolve}>
                <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Cerrar conversación
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1">
        <div className="px-4 py-4 space-y-3 max-w-3xl mx-auto">
          {conversation.messages.map((m) => {
            if (m.sender === "system") {
              return (
                <div key={m.id} className="flex justify-center">
                  <span className="text-[11px] text-muted-foreground bg-muted rounded-full px-3 py-1 inline-flex items-center gap-1.5">
                    <ShieldAlert className="h-3 w-3" /> {m.text}
                  </span>
                </div>
              );
            }
            const isPatient = m.sender === "patient";
            const tone =
              m.sender === "ai"
                ? "bg-bubble-ai text-bubble-ai-foreground"
                : m.sender === "human"
                  ? "bg-bubble-human text-bubble-human-foreground"
                  : "bg-bubble-patient text-bubble-patient-foreground";
            const isAi = m.sender === "ai";
            const fb = feedback[m.id];
            const ragCount = Array.isArray(m.rag_sources) ? m.rag_sources.length : 0;
            const toolCount = Array.isArray(m.tool_calls) ? m.tool_calls.length : 0;
            const canInspect = isAi || ragCount > 0 || toolCount > 0;
            return (
              <div
                key={m.id}
                className={cn("flex gap-2 w-full", isPatient ? "justify-start" : "justify-end")}
              >
                {isPatient && (
                  <Avatar className="h-7 w-7 shrink-0 self-end">
                    <AvatarFallback
                      className={cn(
                        "text-[10px] font-semibold",
                        avatarColor(conversation.patientName),
                      )}
                    >
                      {initials(conversation.patientName)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "flex flex-col group min-w-0 max-w-[min(78%,32rem)]",
                    isPatient ? "items-start" : "items-end",
                  )}
                >
                  <div
                    className={cn(
                      "w-fit max-w-full rounded-2xl px-3.5 py-2 text-sm shadow-sm",
                      tone,
                      isPatient ? "rounded-bl-sm" : "rounded-br-sm",
                    )}
                  >
                    <ChatMarkdown content={m.text} />
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      {typeof m.response_time_ms === "number" && m.response_time_ms > 0 ? (
                        <span
                          className="text-[10px] opacity-60 tabular-nums"
                          title="Latencia de respuesta"
                        >
                          {m.response_time_ms} ms
                        </span>
                      ) : null}
                      <span className="text-[10px] opacity-50 font-medium">{m.time}</span>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-0.5 mt-1",
                      isPatient ? "ml-0.5" : "mr-0.5",
                    )}
                  >
                    <ChatCopyButton text={m.text} />
                    {canInspect && (
                      <MessageInspectButton
                        chunkCount={ragCount}
                        toolCount={toolCount}
                        variant="icon"
                        onClick={() => setInspectMessage(toInsightMessage(m))}
                      />
                    )}
                    {isAi && (
                      <>
                        <button
                          onClick={() => handleFeedback(m.id, "up")}
                          className={cn(
                            "h-6 w-6 rounded-md flex items-center justify-center transition-colors opacity-60 sm:opacity-0 sm:group-hover:opacity-100",
                            fb === "up"
                              ? "opacity-100 bg-success-soft text-success"
                              : "text-muted-foreground hover:bg-muted",
                          )}
                          title="Buena respuesta"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleFeedback(m.id, "down")}
                          className={cn(
                            "h-6 w-6 rounded-md flex items-center justify-center transition-colors opacity-60 sm:opacity-0 sm:group-hover:opacity-100",
                            fb === "down"
                              ? "opacity-100 bg-destructive-soft text-destructive"
                              : "text-muted-foreground hover:bg-muted",
                          )}
                          title="Marcar para revisar"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <MessageInsightSheet
        open={Boolean(inspectMessage)}
        onOpenChange={(open) => {
          if (!open) setInspectMessage(null);
        }}
        message={inspectMessage}
      />

      {/* Composer / modo análisis */}
      <div className="border-t bg-card px-4 py-3 shrink-0">
        <div className="max-w-3xl mx-auto space-y-2">
          {analysisOnly ? (
            <div className="rounded-lg border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Modo análisis</p>
              <p className="text-xs mt-0.5 leading-relaxed">
                Solo lectura. Revisa el hilo y usa el inspector de mensajes (insights) para
                analizar. Filtra por sucursal en la bandeja. La intervención operativa queda en el
                negocio.
              </p>
            </div>
          ) : (
            <>
          {conversation.suggestion && showSuggestion && (
            <div className="flex items-start gap-2 rounded-md bg-primary-soft/50 px-3 py-2 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
              <p className="flex-1 text-foreground/80 leading-relaxed line-clamp-2">
                {conversation.suggestion}
              </p>
              <button
                onClick={() => {
                  setDraft(conversation.suggestion);
                  setShowSuggestion(false);
                }}
                className="text-primary font-medium hover:underline shrink-0"
              >
                Usar
              </button>
              <button
                onClick={() => setShowSuggestion(false)}
                className="text-muted-foreground hover:text-foreground shrink-0"
                aria-label="Descartar"
              >
                ×
              </button>
            </div>
          )}

          {isChannel && !canReply && showTakeControl ? (
            <div className="rounded-lg border border-info/30 bg-info-soft px-4 py-3 flex items-center justify-between gap-3">
              <div className="text-sm text-info">
                <p className="font-medium">La IA está respondiendo</p>
                <p className="text-xs opacity-90">
                  Para responder manualmente, primero debes tomar el control de esta conversación.
                </p>
              </div>
              <Button size="sm" onClick={onTakeControl}>
                Tomar control
              </Button>
            </div>
          ) : (
            <div className="relative space-y-2">
              {showRelease && (
                <div className="flex justify-end md:hidden">
                  <Button size="sm" variant="outline" onClick={onRelease}>
                    Devolver al agente
                  </Button>
                </div>
              )}
              <div className="flex items-end gap-2 rounded-lg border bg-background focus-within:border-primary/60 transition-colors">
                <Textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={
                    isAiControlled ? "Toma control para responder…" : "Escribe una respuesta…"
                  }
                  rows={1}
                  className="resize-none border-0 bg-transparent focus-visible:ring-0 min-h-[40px] max-h-32 py-2.5"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                />
                <Button
                  size="icon"
                  onClick={send}
                  disabled={!draft.trim()}
                  className="h-8 w-8 m-1.5 shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
