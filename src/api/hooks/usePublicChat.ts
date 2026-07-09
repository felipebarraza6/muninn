import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "../client";

const QUERY_KEY = ["ai-agents", "public-chat"];

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

export function usePublicChannelConfig(channelId: string | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, "config", channelId],
    queryFn: () =>
      apiClient
        .get<PublicChannelConfig>(`/ai-agents/public/channels/${channelId}/config/`)
        .then((r) => r.data),
    enabled: !!channelId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSendPublicMessage(channelId: string | undefined) {
  return useMutation({
    mutationFn: (message: string) =>
      apiClient
        .post<{
          reply?: string;
          message?: string;
          conversation_id?: string | number;
        }>(`/ai-agents/public/channels/${channelId}/message/`, { message })
        .then((r) => r.data),
  });
}
