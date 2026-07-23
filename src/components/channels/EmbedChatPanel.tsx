import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePublicChannelConfig, useSendPublicMessage } from "@/api/hooks/usePublicChat";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ChatMarkdown } from "@/components/chat/chat-markdown";
import { ChatCopyButton } from "@/components/chat/chat-copy-button";
import { PageSkeleton } from "@/components/ui/page-skeleton";

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
  const {
    data: config,
    isLoading: configLoading,
    error: configError,
  } = usePublicChannelConfig(channelId);
  const sendMessage = useSendPublicMessage(channelId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [identityReady, setIdentityReady] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const requireName = Boolean(config?.require_name);
  const requireEmail = Boolean(config?.require_email);
  const primary = config?.primary_color || "#2dd4bf";
  const title = config?.title || config?.name || "Chat";
  const agentLabel = config?.agent_name || config?.agent?.name;

  useEffect(() => {
    if (!requireName && !requireEmail) {
      setIdentityReady(true);
    }
  }, [requireName, requireEmail]);

  useEffect(() => {
    if (config?.welcome_message && messages.length === 0 && identityReady) {
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
  }, [config?.welcome_message, identityReady]);

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
      const result = await sendMessage.mutateAsync({
        message: userMsg.content,
        user_name: guestName || undefined,
        email: guestEmail || undefined,
      });
      const reply = result.reply ?? result.response ?? result.message ?? "Sin respuesta";
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
        className={cn("bg-background p-4", compact ? "h-80" : "h-full min-h-[320px]", className)}
      >
        <PageSkeleton variant="chat" padded={false} className="h-full" />
      </div>
    );
  }

  if (configError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-background text-destructive p-6 text-sm text-center",
          compact ? "h-80" : "h-full min-h-[320px]",
          className,
        )}
      >
        No se pudo cargar el widget. Verifica que el canal esté activo y que tu dominio esté
        permitido.
      </div>
    );
  }

  if (!identityReady) {
    return (
      <div
        className={cn(
          "flex flex-col bg-background text-foreground overflow-hidden",
          compact ? "h-[28rem] rounded-lg border border-border" : "h-full",
          className,
        )}
      >
        <header
          className="border-b px-4 py-3 flex items-center gap-3 shrink-0"
          style={{ borderBottomColor: `${primary}33` }}
        >
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center"
            style={{ background: `${primary}22`, color: primary }}
          >
            <Bot className="h-4 w-4" />
          </div>
          <div className="font-medium text-sm truncate">{title}</div>
        </header>
        <form
          className="flex-1 p-4 space-y-3 flex flex-col justify-center"
          onSubmit={(e) => {
            e.preventDefault();
            if (requireName && !guestName.trim()) {
              toast.error("Ingresa tu nombre");
              return;
            }
            if (requireEmail && !guestEmail.trim()) {
              toast.error("Ingresa tu email");
              return;
            }
            setIdentityReady(true);
          }}
        >
          <p className="text-sm text-muted-foreground">Antes de chatear, cuéntanos quién eres.</p>
          {requireName && (
            <Input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Tu nombre"
              required
            />
          )}
          {requireEmail && (
            <Input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Tu email"
              required
            />
          )}
          <Button type="submit" style={{ background: primary, color: "#041016" }}>
            Empezar chat
          </Button>
        </form>
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
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden"
          style={{ background: `${primary}22`, color: primary }}
        >
          {config?.logo_url ? (
            <img src={config.logo_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{title}</div>
          <div className="text-xs text-muted-foreground">
            {agentLabel ? `Agente · ${agentLabel}` : "Asistente virtual"}
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
                msg.role === "user" ? "bg-muted" : ""
              }`}
              style={
                msg.role === "assistant"
                  ? { background: `${primary}22`, color: primary }
                  : undefined
              }
            >
              {msg.role === "user" ? (
                <User className="h-3.5 w-3.5" />
              ) : (
                <Bot className="h-3.5 w-3.5" />
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
                    ? "rounded-br-md text-primary-foreground"
                    : "bg-muted rounded-bl-md"
                }`}
                style={msg.role === "user" ? { background: primary } : undefined}
              >
                <ChatMarkdown content={msg.content} inverted={msg.role === "user"} />
              </div>
              <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <ChatCopyButton text={msg.content} />
              </div>
            </div>
          </div>
        ))}
        {sendMessage.isPending && (
          <div className="flex gap-2">
            <div
              className="h-7 w-7 rounded-full flex items-center justify-center"
              style={{ background: `${primary}22`, color: primary }}
            >
              <Bot className="h-3.5 w-3.5" />
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
        <Button
          type="submit"
          size="icon"
          disabled={sendMessage.isPending || !input.trim()}
          style={{ background: primary, color: "#041016" }}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
