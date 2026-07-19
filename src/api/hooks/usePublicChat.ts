import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "../client";

const QUERY_KEY = ["ai-agents", "public-chat"];

export interface PublicChannelConfig {
  id: string | number;
  name?: string;
  title?: string;
  agent_name?: string | null;
  agent_icon?: string | null;
  agent?: {
    id?: string | number;
    name?: string;
  };
  welcome_message?: string;
  primary_color?: string;
  logo_url?: string;
  launcher_text?: string;
  position?: string;
  require_email?: boolean;
  require_name?: boolean;
  api_base_url?: string;
  theme?: "light" | "dark";
}

function guestUserIdKey(channelId: string) {
  return `yggdra_embed_uid_${channelId}`;
}

/** ID persistente del visitante para hilar ChatbotSession. */
export function getOrCreateEmbedUserId(channelId: string): string {
  try {
    const key = guestUserIdKey(channelId);
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, id);
    return id;
  } catch {
    return `guest_${Date.now()}`;
  }
}

export function usePublicChannelConfig(channelId: string | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, "config", channelId],
    queryFn: () =>
      apiClient
        .get<PublicChannelConfig>(`/ai-agents/public/channels/${channelId}/config/`)
        .then((r) => r.data),
    enabled: !!channelId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useSendPublicMessage(channelId: string | undefined) {
  return useMutation({
    mutationFn: (payload: { message: string; user_name?: string; email?: string }) => {
      const userId = channelId ? getOrCreateEmbedUserId(channelId) : "anonymous";
      return apiClient
        .post<{
          reply?: string;
          message?: string;
          response?: string;
          session_id?: string;
          conversation_id?: string | number;
          success?: boolean;
        }>(`/ai-agents/public/channels/${channelId}/message/`, {
          user_id: userId,
          user_name: payload.user_name || "Visitante",
          message: payload.message,
          ...(payload.email ? { email: payload.email } : {}),
        })
        .then((r) => r.data);
    },
  });
}
