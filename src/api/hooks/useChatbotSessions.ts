import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GET, POST, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { useActiveBranchId } from "@/hooks/useActiveBranchId";

export interface ChatbotSession {
  id: string;
  channel?: string | number;
  channel_name?: string;
  agent?: string | number;
  agent_name?: string;
  status?: string;
  user_identifier?: string;
  external_id?: string;
  created?: string;
  modified?: string;
}

export function useChatbotSessions(filters?: { status?: string }) {
  const branchId = useActiveBranchId();
  return useQuery({
    queryKey: ["chatbot-sessions", branchId, filters],
    queryFn: () =>
      GET<ChatbotSession[] | { count: number; results: ChatbotSession[] }>(
        ENDPOINTS.chatbotSessions.list,
        { params: { ...filters, branch: branchId ?? undefined } },
      ).then((data) => normalizeListResponse<ChatbotSession>(data)),
  });
}

export function useChatbotSession(id: string | undefined) {
  return useQuery({
    queryKey: ["chatbot-sessions", id],
    queryFn: () => GET<ChatbotSession>(ENDPOINTS.chatbotSessions.detail(id!)),
    enabled: !!id,
  });
}

export function useCloseChatbotSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => POST(ENDPOINTS.chatbotSessions.close(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["chatbot-sessions"] }),
  });
}
