import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "../client";
import { apiErrorStatus } from "@/lib/apiError";

const QUERY_KEY = ["ai-agents", "public-chat"];
const EMBED_USER_ID_PREFIX = "embed_user_id_";

function getEmbeddingOrigin(): string {
  if (typeof window === "undefined") return "";
  try {
    if (window.top !== window.self && document.referrer) {
      return new URL(document.referrer, window.location.href).origin;
    }
  } catch {
    // Acceso cross-origin o referrer inválido; no se puede determinar el origen.
  }
  return "";
}

function getOrCreateEmbedUserId(channelId: string): string {
  if (typeof window === "undefined") {
    return `embed-${channelId}`;
  }
  const storageKey = `${EMBED_USER_ID_PREFIX}${channelId}`;
  let userId = localStorage.getItem(storageKey);
  if (!userId) {
    userId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? `embed-${crypto.randomUUID()}`
        : `embed-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(storageKey, userId);
  }
  return userId;
}

export interface PublicChannelConfig {
  id: string | number;
  name?: string;
  channel_type?: string;
  agent?: {
    id?: string | number;
    name?: string;
  };
  agent_name?: string;
  title?: string;
  primary_color?: string;
  logo_url?: string;
  require_name?: boolean;
  require_email?: boolean;
  welcome_message?: string;
  theme?: "light" | "dark";
}

export interface PublicChatMessageResponse {
  success?: boolean;
  response?: string;
  reply?: string;
  message?: string;
  session_id?: string;
  conversation_id?: string | number;
}

export type PublicChatSendInput = {
  message: string;
  user_name?: string;
  email?: string;
};

/** Body de POST /public/channels/:id/message/. Incluye nombre y email solo si vienen. */
export function buildPublicChatPayload(
  userId: string,
  input: PublicChatSendInput,
): Record<string, string> {
  const body: Record<string, string> = {
    user_id: userId,
    message: input.message,
  };
  const name = input.user_name?.trim();
  const email = input.email?.trim();
  if (name) body.user_name = name;
  if (email) body.email = email;
  return body;
}

function errorText(error: unknown): string {
  if (!error || typeof error !== "object") return "";
  const data = (error as { response?: { data?: unknown } }).response?.data;
  if (!data || typeof data !== "object") return "";
  const bag = data as Record<string, unknown>;
  return [bag.error, bag.detail, bag.message, bag.code]
    .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
    .join(" ");
}

/**
 * Mensaje cuando el canal o el plan cortan el uso.
 * Null si el error es otro (dominio, validación, red).
 */
export function publicChatUsageLimitMessage(error: unknown): string | null {
  const status = apiErrorStatus(error);
  const data =
    error && typeof error === "object"
      ? (error as { response?: { data?: unknown } }).response?.data
      : undefined;
  const bag = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  const text = errorText(error);
  const limited =
    status === 429 ||
    Boolean(bag?.usage_limit) ||
    Boolean(bag?.plan_limit) ||
    bag?.code === "usage_limit" ||
    /l[ií]mite de uso|usage limit|quota|rate limit|demasiadas solicitudes/i.test(text);
  if (!limited) return null;
  if (bag && typeof bag.message === "string" && bag.message.trim()) return bag.message.trim();
  if (bag && typeof bag.detail === "string" && bag.detail.trim() && status !== 429) {
    return bag.detail.trim();
  }
  if (text && !/^request failed/i.test(text)) return text;
  return "Este chat alcanzó el límite de uso. Intenta de nuevo más tarde.";
}

export function usePublicChannelConfig(channelId: string | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, "config", channelId],
    queryFn: () =>
      apiClient
        .get<PublicChannelConfig>(`/ai-agents/public/channels/${channelId}/config/`, {
          params: { embed_origin: getEmbeddingOrigin() },
        })
        .then((r) => r.data),
    enabled: !!channelId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSendPublicMessage(channelId: string | undefined) {
  return useMutation({
    mutationFn: (input: PublicChatSendInput) => {
      if (!channelId) {
        return Promise.reject(new Error("Canal no definido"));
      }
      const userId = getOrCreateEmbedUserId(channelId);
      return apiClient
        .post<PublicChatMessageResponse>(
          `/ai-agents/public/channels/${channelId}/message/`,
          buildPublicChatPayload(userId, input),
          { params: { embed_origin: getEmbeddingOrigin() } },
        )
        .then((r) => r.data);
    },
  });
}
