/** Fase visual única del Studio chat — una señal por estado. */
export type ChatPhase =
  | "boot"
  | "resolving_thread"
  | "loading_history"
  | "idle"
  | "creating_thread"
  | "awaiting_model"
  | "streaming"
  | "error";

export type ChatDeliveryStatus = "pending" | "sent" | "failed";

export function deriveChatPhase(input: {
  agentLoading: boolean;
  conversationsLoading: boolean;
  initialized: boolean;
  messagesLoading: boolean;
  hasMessages: boolean;
  conversationId: string | null;
  isDraftNew: boolean;
  isCreating: boolean;
  isStreaming: boolean;
  sendPending: boolean;
  error: string | null;
}): ChatPhase {
  if (input.agentLoading) return "boot";
  if (input.error) return "error";
  if (input.isCreating) return "creating_thread";
  if (input.isStreaming) return "streaming";
  if (input.sendPending) return "awaiting_model";
  if (!input.initialized && input.conversationsLoading) return "resolving_thread";
  if (input.conversationId && !input.isDraftNew && input.messagesLoading && !input.hasMessages) {
    return "loading_history";
  }
  return "idle";
}
