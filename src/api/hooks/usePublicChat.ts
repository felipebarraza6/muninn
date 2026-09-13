import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "../client";

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
    mutationFn: (message: string) => {
      if (!channelId) {
        return Promise.reject(new Error("Canal no definido"));
      }
      return apiClient
        .post<PublicChatMessageResponse>(
          `/ai-agents/public/channels/${channelId}/message/`,
          {
            user_id: getOrCreateEmbedUserId(channelId),
            message,
          },
          { params: { embed_origin: getEmbeddingOrigin() } },
        )
        .then((r) => r.data);
    },
  });
}
