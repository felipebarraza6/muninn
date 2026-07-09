import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GET, POST, PATCH, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";

export interface Campaign {
  id: string | number;
  name: string;
  status: string;
  kind?: string;
  contacted?: number;
  responded?: number;
  appointments?: number;
  revenue?: number;
  audience_size?: number;
  progress?: number;
  start_date?: string;
  end_date?: string;
}

export function useCampaigns(filters?: { status?: string; type?: string }) {
  return useQuery({
    queryKey: ["campaigns", filters],
    queryFn: () =>
      GET<Campaign[] | { count: number; results: Campaign[] }>(ENDPOINTS.campaigns.list, {
        params: filters,
      }).then((data) => normalizeListResponse<Campaign>(data)),
    staleTime: 30_000,
  });
}

export function useCampaign(id: string | undefined) {
  return useQuery({
    queryKey: ["campaigns", id],
    queryFn: () => GET(ENDPOINTS.campaigns.detail(id!)),
    enabled: !!id,
  });
}

export function useCampaignAggregates() {
  return useQuery({
    queryKey: ["campaigns", "aggregates"],
    queryFn: () => GET(ENDPOINTS.campaigns.aggregates),
  });
}

export function useCampaignHints() {
  return useQuery({
    queryKey: ["campaigns", "hints"],
    queryFn: () => GET(ENDPOINTS.campaigns.hints),
  });
}

export function useChangeCampaignStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      POST(ENDPOINTS.campaigns.changeStatus(id), { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}

export function useDuplicateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => POST(ENDPOINTS.campaigns.duplicate(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}
