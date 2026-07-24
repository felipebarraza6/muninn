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

export type ChatMessageMetadata = {
  reply_to_id?: number | string;
  reply_to_role?: string;
  reply_to_preview?: string;
  policy_trace?: unknown;
  flow_policy_trace?: unknown;
  policies?: unknown;
  [key: string]: unknown;
};

export interface ChatMessageResponse {
  id: string | number;
  sender?: string;
  role?: string;
  content?: string;
  text?: string;
  message?: string;
  created?: string;
  created_at?: string;
  timestamp?: string;
  modified?: string;
  rag_sources?: unknown[];
  sources?: unknown[];
  tool_calls?: unknown[];
  tool_results?: unknown[];
  policy_trace?: unknown;
  flow_policy_trace?: unknown;
  policies?: unknown;
  metadata?: ChatMessageMetadata | null;
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
    mutationFn: ({
      id,
      message,
      replyToId,
    }: {
      id: string;
      message: string;
      replyToId?: string | number | null;
    }) => {
      const body: Record<string, unknown> = { message };
      if (replyToId != null && replyToId !== "") {
        const n = Number(replyToId);
        if (Number.isFinite(n)) body.reply_to_id = n;
      }
      return POST<ChatMessageResponse>(ENDPOINTS.conversations.chat(id), body);
    },
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
    mutationFn: (data: {
      agent: string | number;
      title: string;
      user?: string | number;
      /** Sucursal del agente; evita rechazo si x-branch-id apunta a otra. */
      branch?: string | number;
    }) =>
      POST<Conversation>(ENDPOINTS.conversations.list, data, {
        headers:
          data.branch != null && String(data.branch).trim() !== ""
            ? { "x-branch-id": String(data.branch) }
            : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["unified-conversations"] });
    },
  });
}

/** Cierra conversación del chat interno Studio (endpoint canónico). */
export function useCloseConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => POST(ENDPOINTS.conversations.closeConversation(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["conversations"] }),
  });
}

/** @deprecated Preferir useCloseConversation. */
export function useTakeControl() {
  return useCloseConversation();
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
