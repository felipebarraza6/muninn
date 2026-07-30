import type { ChatMessageResponse } from "@/api/hooks/useConversations";
import type { ChatDeliveryStatus } from "@/lib/chatPhase";

export type AgentChatMessage = {
  id: string | number;
  role: "user" | "agent" | "system";
  content: string;
  created?: string;
  rag_sources?: unknown[];
  tool_calls?: unknown[];
  tool_results?: unknown[];
  policy_trace?: unknown;
  flow_policy_trace?: unknown;
  policies?: unknown;
  metadata?: Record<string, unknown> | null;
  replyToId?: string | number;
  replyToRole?: string;
  replyToPreview?: string;
  deliveryStatus?: ChatDeliveryStatus;
};

export type AgentChatReplyTarget = {
  id: string | number;
  role: AgentChatMessage["role"];
  preview: string;
};

export function previewText(text: string, max = 120) {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export function roleLabel(role: string | undefined) {
  const r = (role || "").toLowerCase();
  if (r === "user") return "Tú";
  if (r === "agent" || r === "assistant") return "Agente";
  if (r === "system") return "Sistema";
  return "Mensaje";
}

export function makeChatId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function normalizeAgentChatMessages(data?: ChatMessageResponse[]): AgentChatMessage[] {
  if (!Array.isArray(data)) return [];
  return data.map((m) => {
    const meta = m.metadata && typeof m.metadata === "object" ? m.metadata : null;
    const replyRoleRaw = String(meta?.reply_to_role || "").toLowerCase();
    return {
      id: m.id ?? makeChatId("msg"),
      role: (m.role?.toLowerCase() === "user"
        ? "user"
        : m.role?.toLowerCase() === "system"
          ? "system"
          : "agent") as AgentChatMessage["role"],
      content: m.content ?? m.text ?? m.message ?? "",
      created: m.created_at ?? m.created ?? m.timestamp ?? m.modified,
      rag_sources: m.rag_sources ?? m.sources,
      tool_calls: m.tool_calls,
      tool_results: m.tool_results,
      policy_trace: m.policy_trace ?? meta?.policy_trace,
      flow_policy_trace: m.flow_policy_trace ?? meta?.flow_policy_trace,
      policies: m.policies ?? meta?.policies,
      metadata: meta as Record<string, unknown> | null,
      replyToId: meta?.reply_to_id,
      replyToRole:
        replyRoleRaw === "user"
          ? "user"
          : replyRoleRaw === "system"
            ? "system"
            : meta?.reply_to_id
              ? "agent"
              : undefined,
      replyToPreview:
        typeof meta?.reply_to_preview === "string" ? meta.reply_to_preview : undefined,
    };
  });
}

export function getCurrentUserId(): number | undefined {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return parsed?.id;
  } catch {
    return undefined;
  }
}
