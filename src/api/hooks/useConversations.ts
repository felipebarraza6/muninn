import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GET, POST, PATCH, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { getActiveBranchIdInt } from "@/lib/branchStorage";

export interface Conversation {
  id: string | number;
  agent?: number;
  agent_name?: string;
  title?: string;
  status?: string;
  message_count?: number;
  modified?: string;
}

export function useConversations(filters?: { status?: string }) {
  return useQuery({
    queryKey: ["conversations", filters],
    queryFn: () =>
      GET<Conversation[] | { count: number; results: Conversation[] }>(
        ENDPOINTS.conversations.list,
        { params: filters },
      ).then((data) => normalizeListResponse<Conversation>(data)),
    refetchInterval: 10_000,
    staleTime: 5_000,
  });
}

export function useConversation(id: string | undefined) {
  return useQuery({
    queryKey: ["conversations", id],
    queryFn: () => GET(ENDPOINTS.conversations.detail(id!)),
    enabled: !!id,
    refetchInterval: 10_000,
  });
}

export interface ChatMessageResponse {
  id: string | number;
  sender?: string;
  role?: string;
  content?: string;
  text?: string;
  message?: string;
  created_at?: string;
  timestamp?: string;
}

export function useConversationMessages(
  id: string | undefined,
  options?: { refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: ["conversations", id, "messages"],
    queryFn: () => GET<ChatMessageResponse[]>(ENDPOINTS.conversations.messages(id!)),
    enabled: !!id,
    refetchInterval: options?.refetchInterval ?? 10_000,
  });
}

export function useSendConversationMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      POST<ChatMessageResponse>(ENDPOINTS.conversations.chat(id), { message }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", variables.id, "messages"],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { agent: string | number; title: string; user?: string | number }) =>
      POST<Conversation>(ENDPOINTS.conversations.list, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useTakeControl() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => POST(ENDPOINTS.conversations.takeControl(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["conversations"] }),
  });
}

export function useEscalateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      POST(ENDPOINTS.conversations.escalate(id), { reason }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["conversations"] }),
  });
}

export function useArchiveConversation() {
  const queryClient = useQueryClient();
  const branchId = getActiveBranchIdInt();
  return useMutation({
    mutationFn: ({ id, status }: { id: string | number; status: string }) =>
      POST(ENDPOINTS.unifiedConversations.setStatus(String(id)), {
        status,
        branch: branchId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["unified-conversations"] });
    },
  });
}

export function useUpdateConversationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string | number; status: string }) =>
      PATCH(ENDPOINTS.conversations.detail(String(id)), { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"], refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: ["unified-conversations"], refetchType: "all" });
    },
  });
}
