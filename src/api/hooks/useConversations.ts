import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GET, POST, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { getActiveBranchIdInt } from "@/lib/branchStorage";
import { POLL } from "@/lib/pollInterval";
import { useActiveBranchId } from "@/hooks/useActiveBranchId";
import type { UnifiedConversation } from "@/api/hooks/useUnifiedConversations";

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
    refetchInterval: POLL.idle,
    refetchIntervalInBackground: false,
    staleTime: 5_000,
  });
}

export function useConversation(id: string | undefined) {
  return useQuery({
    queryKey: ["conversations", id],
    queryFn: () => GET(ENDPOINTS.conversations.detail(id!)),
    enabled: !!id,
    refetchInterval: POLL.idle,
    refetchIntervalInBackground: false,
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
    refetchInterval: options?.refetchInterval ?? false,
    refetchIntervalInBackground: false,
  });
}

export function useSendConversationMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      message,
      replyToId,
      branchId,
    }: {
      id: string;
      message: string;
      replyToId?: string | number | null;
      /** Sucursal del agente (mismo criterio que el stream SSE). */
      branchId?: string | null;
    }) => {
      const body: Record<string, unknown> = { message };
      if (replyToId != null && replyToId !== "") {
        const n = Number(replyToId);
        if (Number.isFinite(n)) body.reply_to_id = n;
      }
      const headers: Record<string, string> = {};
      if (branchId != null && String(branchId).trim() !== "") {
        headers["x-branch-id"] = String(branchId);
      }
      return POST<ChatMessageResponse>(ENDPOINTS.conversations.chat(id), body, {
        ...(Object.keys(headers).length ? { headers } : {}),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", variables.id, "messages"],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["unified-conversations"] });
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
  const activeBranchId = useActiveBranchId();
  const branchId =
    activeBranchId == null || activeBranchId === ""
      ? undefined
      : Number.isFinite(Number(activeBranchId))
        ? Number(activeBranchId)
        : undefined;
  return useMutation({
    mutationFn: ({ id, status }: { id: string | number; status: string }) =>
      POST(ENDPOINTS.unifiedConversations.setStatus(String(id)), {
        status,
        branch: branchId,
      }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["unified-conversations"] });
      const previous = queryClient.getQueriesData<UnifiedConversation[]>({
        queryKey: ["unified-conversations"],
      });
      queryClient.setQueriesData<UnifiedConversation[]>(
        { queryKey: ["unified-conversations"] },
        (old) =>
          old?.map((conversation) =>
            String(conversation.id) === String(id)
              ? { ...conversation, status: status.toLowerCase() }
              : conversation,
          ),
      );
      return { previous };
    },
    onError: (_err, _variables, context) => {
      context?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"], refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: ["unified-conversations"], refetchType: "all" });
    },
  });
}
