import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Bot, Database, Loader2, Shield, User, Wrench } from "lucide-react";
import { TypewriterText } from "@/components/chat/typewriter-text";
import { ChatMarkdown } from "@/components/chat/chat-markdown";
import { ChatMessageActions } from "@/components/chat/chat-message-actions";
import {
  MessageInspectButton,
  type InsightMessage,
} from "@/components/chat/message-insight-sheet";
import type { LiveStreamStep } from "@/components/chat/chat-processing";
import {
  extractPolicyTrace,
  inferPolicyTraceFromConfig,
  policyTraceSignalCount,
} from "@/lib/policyTrace";
import { formatDateTime, formatMessageStamp } from "@/lib/datetime";
import { roleLabel, type AgentChatMessage as ChatMessage } from "@/lib/agentChatMessages";
import type { Agent } from "@/api/hooks/useAgents";

export type AgentChatMessageProps = {
  msg: ChatMessage;
  isLastAgent: boolean;
  isStreamingBubble: boolean;
  reduceMotion: boolean;
  isBusy: boolean;
  agent: Agent | undefined;
  liveSteps: LiveStreamStep[];
  skipEntrance: boolean;
  onReply: (msg: ChatMessage) => void;
  onResend: (msg: ChatMessage) => void;
  onInspect: (msg: InsightMessage) => void;
};

export const AgentChatMessage = memo(function AgentChatMessage({
  msg,
  isLastAgent,
  isStreamingBubble,
  reduceMotion,
  isBusy,
  agent,
  liveSteps,
  skipEntrance,
  onReply,
  onResend,
  onInspect,
}: AgentChatMessageProps) {
  const ragCount = Array.isArray(msg.rag_sources) ? msg.rag_sources.length : 0;
  const toolCount = Array.isArray(msg.tool_calls) ? msg.tool_calls.length : 0;
  const msgPolicy =
    extractPolicyTrace(msg) ??
    (msg.role === "agent" ? inferPolicyTraceFromConfig(agent?.flow_policy, msg.tool_calls) : null);
  const policyCount = policyTraceSignalCount(msgPolicy);
  const liveIndicator = isStreamingBubble
    ? (liveSteps.find((s) => s.status === "active") ?? liveSteps[liveSteps.length - 1])
    : undefined;

  return (
    <motion.div
      key={msg.id}
      initial={reduceMotion || skipEntrance ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
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
      <div
        className={`group max-w-[85%] sm:max-w-[75%] space-y-1 ${
          msg.role === "user" ? "items-end" : "items-start"
        }`}
      >
        <motion.div
          className={cn(
            "relative px-4 py-2.5 text-sm leading-relaxed rounded-2xl transition-all break-words",
            msg.role === "user"
              ? "bg-primary text-primary-foreground rounded-br-md"
              : msg.role === "system"
                ? "bg-destructive/10 text-destructive rounded-bl-md border border-destructive/20"
                : "bg-muted text-foreground rounded-bl-md",
            isStreamingBubble && !reduceMotion && "chat-bubble-streaming",
          )}
          transition={{ duration: 0.2 }}
        >
          {msg.role === "agent" && (
            <div
              className={cn(
                "absolute -top-2.5 -right-2.5 z-10 transition-opacity",
                isStreamingBubble ? "opacity-50 pointer-events-none" : "opacity-100",
              )}
            >
              <MessageInspectButton
                variant="icon"
                chunkCount={ragCount}
                toolCount={toolCount}
                policyCount={policyCount}
                onClick={() =>
                  onInspect({
                    id: msg.id,
                    content: msg.content,
                    created: msg.created,
                    rag_sources: msg.rag_sources,
                    tool_calls: msg.tool_calls,
                    tool_results: msg.tool_results,
                    policy_trace: msg.policy_trace,
                    flow_policy_trace: msg.flow_policy_trace,
                    policies: msg.policies,
                    metadata: msg.metadata,
                  })
                }
              />
            </div>
          )}
          {msg.replyToPreview && (
            <div
              className={`mb-2 rounded-md border-l-2 px-2 py-1 text-[11px] leading-snug ${
                msg.role === "user"
                  ? "border-primary-foreground/50 bg-primary-foreground/10 text-primary-foreground/85"
                  : "border-primary/50 bg-background/60 text-muted-foreground"
              }`}
            >
              <p className="font-semibold opacity-90">
                Respondiendo a {roleLabel(msg.replyToRole)}
              </p>
              <p className="line-clamp-2 opacity-80">{msg.replyToPreview}</p>
            </div>
          )}
          {msg.role === "agent" ? (
            isStreamingBubble && msg.content.length === 0 ? (
              <span className="inline-flex items-center gap-1 py-1" aria-label="Escribiendo">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </span>
            ) : (
              <TypewriterText id={String(msg.id)} text={msg.content} streaming={isStreamingBubble}>
                <ChatMarkdown content={msg.content} inverted={false} />
              </TypewriterText>
            )
          ) : (
            <ChatMarkdown content={msg.content} inverted={msg.role === "user"} />
          )}
          <div
            className={`mt-1.5 flex items-center gap-1.5 text-[10px] tabular-nums font-medium ${
              msg.role === "user"
                ? "justify-end text-primary-foreground/70"
                : "justify-end text-muted-foreground"
            }`}
          >
            {msg.role === "agent" && isStreamingBubble && liveIndicator && (
              <span className="mr-auto inline-flex items-center gap-1.5 font-normal text-muted-foreground/75">
                {liveIndicator.icon === "wrench" && liveIndicator.status === "active" ? (
                  <Wrench className="h-3 w-3 shrink-0" />
                ) : liveIndicator.icon === "database" && liveIndicator.status === "active" ? (
                  <Database className="h-3 w-3 shrink-0" />
                ) : (
                  <Loader2 className="h-3 w-3 shrink-0 animate-spin" />
                )}
                <span className="truncate max-w-[14rem]">
                  {liveIndicator.detail || liveIndicator.label}
                </span>
                {liveIndicator.status === "active" && (
                  <span className="animate-pulse tracking-wider">…</span>
                )}
              </span>
            )}
            {msg.role === "agent" && policyCount > 0 && (
              <span title={`${policyCount} policy aplicada${policyCount > 1 ? "s" : ""}`}>
                <Shield className="h-3 w-3 text-primary/60" />
              </span>
            )}
            <span title={formatDateTime(msg.created) ?? undefined}>
              {formatMessageStamp(msg.created) || "Sin fecha"}
            </span>
          </div>
        </motion.div>
        {!isStreamingBubble && (
          <ChatMessageActions
            text={msg.content}
            align={msg.role === "user" ? "end" : "start"}
            onReply={msg.role !== "system" && !isBusy ? () => onReply(msg) : undefined}
            onResend={msg.role === "user" && !isBusy ? () => onResend(msg) : undefined}
          />
        )}
        {msg.role === "user" && msg.deliveryStatus === "failed" && (
          <button
            type="button"
            onClick={() => onResend(msg)}
            className="text-[11px] text-destructive underline self-end font-medium"
          >
            Reintentar
          </button>
        )}
      </div>
    </motion.div>
  );
});
