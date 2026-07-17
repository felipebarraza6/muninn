import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GET, POST, PATCH, DELETE, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { useActiveBranchId } from "@/hooks/useActiveBranchId";

const QUERY_KEY = ["ai-agents", "channels"];

export interface Channel {
  id: string | number;
  name: string;
  channel_type: string;
  provider?: string;
  is_active?: boolean;
  config?: Record<string, unknown>;
  webhook_secret?: string;
  webhook_url?: string;
  assigned_agent?: string | number | null;
  assigned_agent_name?: string;
  branch?: number | null;
  created?: string;
  modified?: string;
}

export function useChannels(filters?: { is_active?: boolean; channel_type?: string }) {
  const branchId = useActiveBranchId();
  return useQuery({
    queryKey: [...QUERY_KEY, branchId, filters],
    queryFn: () =>
      GET<Channel[] | { count: number; results: Channel[] }>(ENDPOINTS.channels.list, {
        params: filters,
      }).then((data) => normalizeListResponse<Channel>(data)),
    staleTime: 2 * 60 * 1000,
  });
}

export function useChannel(id: string | undefined) {
  const branchId = useActiveBranchId();
  return useQuery({
    queryKey: [...QUERY_KEY, branchId, id],
    queryFn: () => GET<Channel>(ENDPOINTS.channels.detail(id!)),
    enabled: !!id,
  });
}

export function useCreateChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Channel>) => POST<Channel>(ENDPOINTS.channels.list, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<Channel> }) =>
      PATCH<Channel>(ENDPOINTS.channels.detail(String(id)), data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => DELETE(ENDPOINTS.channels.detail(String(id))),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useRegenerateChannelSecret() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) =>
      POST<{ secret?: string }>(ENDPOINTS.channels.regenerateSecret(String(id))),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
