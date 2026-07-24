import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  MoreHorizontal,
  ShieldAlert,
  Info,
  CheckCircle2,
} from "lucide-react";
import { formatCLP } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { ChatMarkdown } from "@/components/chat/chat-markdown";
import { ChatCopyButton } from "@/components/chat/chat-copy-button";
import { ChatComposer } from "@/components/chat/chat-composer";
import { ChatThread } from "@/components/chat/chat-thread";
import {
  MessageInsightSheet,
  MessageInspectButton,
  type InsightMessage,
} from "@/components/chat/message-insight-sheet";
import { chatDraftKey, clearChatDraft, loadChatDraft, saveChatDraft } from "@/lib/chatDrafts";
import { useStickyChatScroll } from "@/hooks/useStickyChatScroll";

interface Props {
  conversation: Conversation;
  onTakeControl: () => void;
  onRelease?: () => void;
  onSend: (text: string) => void;
  onOpenDetails: () => void;
  onResolve?: () => void;
  /** Superadmin: solo lectura + insights; sin tomar control ni responder. */
  analysisOnly?: boolean;
  sending?: boolean;
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

const MACROS = [
  {
    id: "hola",
    label: "Saludo",
    text: "Hola, soy del equipo de atención. ¿En qué te puedo ayudar?",
  },
  { id: "espera", label: "Un momento", text: "Dame un momento mientras reviso tu caso." },
  {
    id: "gracias",
    label: "Cierre",
    text: "Gracias por contactarnos. Quedo atento si necesitas algo más.",
  },
] as const;

export function ChatPane({
  conversation,
  onTakeControl,
  onRelease,
  onSend,
  onOpenDetails,
  onResolve,
  analysisOnly = false,
  sending = false,
}: Props) {
  const draftKey = chatDraftKey("inbox", conversation.id);
  const [draft, setDraft] = useState(() => loadChatDraft(draftKey));
  const [inspectMessage, setInspectMessage] = useState<InsightMessage | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { endRef, bindViewport, showJump, scrollToBottom } = useStickyChatScroll([
    conversation.messages.length,
    conversation.id,
  ]);

  useEffect(() => {
    setDraft(loadChatDraft(draftKey));
    setInspectMessage(null);
  }, [conversation.id, draftKey]);

  useEffect(() => {
    saveChatDraft(draftKey, draft);
  }, [draft, draftKey]);

  const send = () => {
    if (!draft.trim() || sending) return;
    onSend(draft);
    setDraft("");
    clearChatDraft(draftKey);
  };

  const isChannel = conversation.source === "channel";
  const isAiControlled = conversation.controlledBy === "ai";
  const isOpen = conversation.status !== "closed";
  const canReply = !isChannel || conversation.isWaitingHuman === true;
  const showTakeControl = !analysisOnly && isOpen && isAiControlled;
  const showRelease =
    !analysisOnly && isOpen && conversation.isWaitingHuman === true && Boolean(onRelease);
  const ChannelIcon = channelIcon(conversation.channelType);
  const aiWorking = isOpen && isAiControlled && !conversation.isWaitingHuman;

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-muted/20">
      <div className="hidden md:flex items-center gap-3 border-b bg-card px-4 h-14 shrink-0">
        <Avatar className="h-9 w-9">
          <AvatarFallback
            className={cn("text-xs font-semibold", avatarColor(conversation.patientName))}
          >
            {initials(conversation.patientName)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-medium truncate">{conversation.patientName}</span>
            <StatusBadge status={conversation.status} size="xs" />
            {typeof conversation.estimatedValue === "number" && conversation.estimatedValue > 0 && (
              <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">
                Oportunidad · {formatCLP(conversation.estimatedValue)}
              </span>
            )}
          </div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 truncate">
            <ChannelIcon className="h-3 w-3 shrink-0" />
            {channelLabel(conversation.channelType, conversation.channelName)}
            {conversation.agentName ? ` · ${conversation.agentName}` : null}
            {aiWorking ? <span className="text-info font-medium"> · IA respondiendo</span> : null}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {showTakeControl && (
            <Button size="sm" variant="outline" className="h-8" onClick={onTakeControl}>
              Tomar control
            </Button>
          )}
          {showRelease && (
            <Button size="sm" variant="outline" className="h-8" onClick={onRelease}>
              Devolver a IA
            </Button>
          )}
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onOpenDetails}>
            <Info className="h-4 w-4" />
          </Button>
          {!analysisOnly && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onResolve && (
                  <DropdownMenuItem onClick={onResolve}>
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Cerrar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {conversation.appointment && (
        <div className="shrink-0 border-b bg-success-soft/40 px-4 py-2 text-xs text-success">
          Cita · {conversation.appointment.date} {conversation.appointment.time} —{" "}
          {conversation.appointment.treatment}
        </div>
      )}

      {conversation.reviewFlag && (
        <div className="shrink-0 border-b bg-warning-soft/30 px-4 py-2 text-xs flex gap-2 items-start">
          <ShieldAlert className="h-3.5 w-3.5 mt-0.5 text-warning shrink-0" />
          <span>{conversation.reviewFlag.note}</span>
        </div>
      )}

      <div className="relative flex-1 min-h-0">
        <ChatThread
          viewportRef={bindViewport}
          endRef={endRef}
          showJump={showJump}
          onJump={scrollToBottom}
        >
          {conversation.messages.map((m) => {
            if (m.sender === "system") {
              return (
                <div key={m.id} className="flex justify-center">
                  <span className="text-[11px] text-muted-foreground bg-muted/60 rounded-full px-3 py-1">
                    {m.text}
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
                  </div>
                </div>
              </div>
            );
          })}
        </ChatThread>
      </div>
      <MessageInsightSheet
        open={Boolean(inspectMessage)}
        onOpenChange={(open) => {
          if (!open) setInspectMessage(null);
        }}
        message={inspectMessage}
      />

      <div className="border-t bg-card px-4 py-3 shrink-0">
        <div className="max-w-3xl mx-auto space-y-2">
          {analysisOnly ? (
            <div className="rounded-lg border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Modo análisis</p>
              <p className="text-xs mt-0.5 leading-relaxed">
                Solo lectura: podés inspeccionar mensajes, no intervenir.
              </p>
            </div>
          ) : !canReply ? (
            <div className="rounded-lg border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <span>
                {aiWorking
                  ? "La IA está al mando. Tomá el control para responder."
                  : "No podés responder en este estado."}
              </span>
              {showTakeControl ? (
                <Button size="sm" className="ml-auto shrink-0" onClick={onTakeControl}>
                  Tomar control
                </Button>
              ) : null}
            </div>
          ) : (
            <>
              {conversation.suggestion ? (
                <button
                  type="button"
                  className="w-full text-left rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-xs hover:bg-primary/10 transition-colors"
                  onClick={() => setDraft(conversation.suggestion!)}
                >
                  <span className="font-medium text-primary">Sugerencia</span>
                  <span className="block text-muted-foreground mt-0.5 line-clamp-2">
                    {conversation.suggestion}
                  </span>
                </button>
              ) : null}
              <div className="flex flex-wrap gap-1.5">
                {MACROS.map((m) => (
                  <Button
                    key={m.id}
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px]"
                    onClick={() => setDraft(m.text)}
                  >
                    {m.label}
                  </Button>
                ))}
              </div>
              <ChatComposer
                ref={textareaRef}
                value={draft}
                onChange={setDraft}
                onSubmit={send}
                busy={sending}
                disabled={sending}
                placeholder="Escribe una respuesta… (Enter envía, Shift+Enter salto)"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
