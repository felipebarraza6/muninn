import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePublicChannelConfig, useSendPublicMessage } from "@/api/hooks/usePublicChat";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ChatMarkdown } from "@/components/chat/chat-markdown";
import { ChatCopyButton } from "@/components/chat/chat-copy-button";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

type EmbedChatPanelProps = {
  channelId: string | undefined;
  /** Altura del área de mensajes (preview embebido en admin). */
  className?: string;
  compact?: boolean;
};

/**
 * Chat público del canal (web_embed / web_socket).
 * Usado en /embed/chat/:id y como preview en detalle de canales.
 */
export function EmbedChatPanel({ channelId, className, compact = false }: EmbedChatPanelProps) {
  const { data: config, isLoading: configLoading } = usePublicChannelConfig(channelId);
  const sendMessage = useSendPublicMessage(channelId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (config?.welcome_message && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: config.welcome_message,
          timestamp: new Date(),
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.welcome_message]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || sendMessage.isPending || !channelId) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const result = await sendMessage.mutateAsync(userMsg.content);
      const reply = result.reply ?? result.message ?? "Sin respuesta";
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: reply,
          timestamp: new Date(),
        },
      ]);
    } catch {
      toast.error("Error al enviar el mensaje");
    }
  };

  if (configLoading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-background text-muted-foreground",
          compact ? "h-80" : "h-full min-h-[320px]",
          className,
        )}
      >
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-background text-foreground overflow-hidden",
        compact ? "h-[28rem] rounded-lg border border-border" : "h-full",
        className,
      )}
    >
      <header className="border-b px-4 py-3 flex items-center gap-3 bg-card shrink-0">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{config?.name ?? "Chat"}</div>
          <div className="text-xs text-muted-foreground">
            {config?.agent?.name ? `Agente · ${config.agent.name}` : "Asistente virtual"}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`h-7 w-7 rounded-full shrink-0 flex items-center justify-center ${
                msg.role === "user" ? "bg-muted" : "bg-primary/10"
              }`}
            >
              {msg.role === "user" ? (
                <User className="h-3.5 w-3.5" />
              ) : (
                <Bot className="h-3.5 w-3.5 text-primary" />
              )}
            </div>
            <div
              className={`group max-w-[80%] space-y-1 ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`rounded-2xl px-3 py-2 text-sm break-words ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted rounded-bl-md"
                }`}
              >
                <ChatMarkdown content={msg.content} inverted={msg.role === "user"} />
              </div>
              <div
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <ChatCopyButton text={msg.content} />
              </div>
            </div>
          </div>
        ))}
        {sendMessage.isPending && (
          <div className="flex gap-2">
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl rounded-bl-md px-3 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="border-t p-3 flex gap-2 bg-card shrink-0">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={sendMessage.isPending || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
