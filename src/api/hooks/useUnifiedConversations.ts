import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GET, POST, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { useActiveBranchId } from "@/hooks/useActiveBranchId";
import { isConversationLive, POLL } from "@/lib/pollInterval";

export interface UnifiedConversation {
  id: string | number;
  source?: "channel" | "internal";
  title?: string;
  channel_type?: string;
  channel_name?: string;
  external_user_id?: string;
  external_user_name?: string;
  external_user_phone?: string;
  agent?: number;
  agent_name?: string;
  agent_color?: string;
  is_waiting_human?: boolean;
  is_recently_active?: boolean;
  status?: string;
  display_status?: string;
  last_message?: string;
  message_count?: number;
  modified?: string;
  created?: string;
  branch?: number;
  branch_name?: string;
}

export interface UnifiedMessage {
  id: string | number;
  role?: "USER" | "AGENT" | "ASSISTANT" | "SYSTEM";
  content?: string;
  created?: string;
  tokens_used?: number;
  tool_calls?: unknown[];
  tool_results?: unknown[];
  rag_sources?: unknown[];
  response_time_ms?: number | null;
}

const QUERY_KEY = "unified-conversations";

function useBranchId(): number | undefined {
  const id = useActiveBranchId();
  if (id == null || id === "") return undefined;
  const n = Number(id);
  return Number.isFinite(n) ? n : undefined;
}

export function useUnifiedConversations(filters?: { status?: string }) {
  const branchId = useBranchId();
  const params = useMemo(() => ({ ...filters, branch: branchId }), [filters, branchId]);
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () =>
      GET<UnifiedConversation[] | { count: number; results: UnifiedConversation[] }>(
        ENDPOINTS.unifiedConversations.list,
        { params },
      ).then((data) => normalizeListResponse<UnifiedConversation>(data)),
    refetchInterval: (q) => {
      const list = q.state.data ?? [];
      const live = list.some((c) => isConversationLive(c));
      return live ? POLL.live : POLL.idle;
    },
    refetchIntervalInBackground: false,
    staleTime: 5_000,
  });
}

export function useUnifiedConversationMessages(id: string | undefined, source: string | undefined) {
  const branchId = useBranchId();
  const params = useMemo(() => ({ source, branch: branchId }), [source, branchId]);
  return useQuery({
    queryKey: [QUERY_KEY, id, "messages", params],
    queryFn: () => GET<UnifiedMessage[]>(ENDPOINTS.unifiedConversations.messages(id!), { params }),
    enabled: !!id && !!source,
    refetchInterval: POLL.messagesLive,
    refetchIntervalInBackground: false,
  });
}

export function useReplyUnifiedConversation() {
  const queryClient = useQueryClient();
  const branchId = useBranchId();
  return useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      POST<UnifiedMessage>(ENDPOINTS.unifiedConversations.reply(id), {
        message,
        branch: branchId,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id, "messages"] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

export function useTakeControlUnifiedConversation() {
  const queryClient = useQueryClient();
  const branchId = useBranchId();
  return useMutation({
    mutationFn: (id: string) =>
      POST(ENDPOINTS.unifiedConversations.takeControl(id), { branch: branchId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

/** Devuelve el control al agente IA después de intervención humana. */
export function useReleaseConversation() {
  const queryClient = useQueryClient();
  const branchId = useBranchId();
  return useMutation({
    mutationFn: (id: string) =>
      POST(ENDPOINTS.unifiedConversations.release(id), { branch: branchId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}

export function useSetUnifiedConversationStatus() {
  const queryClient = useQueryClient();
  const branchId = useBranchId();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      POST(ENDPOINTS.unifiedConversations.setStatus(id), { status, branch: branchId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  });
}
