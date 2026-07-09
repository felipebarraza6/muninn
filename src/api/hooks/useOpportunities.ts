import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GET, POST, PATCH, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";

export interface Opportunity {
  id: string | number;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  stage?: string;
  status?: string;
  value?: number;
  currency?: string;
  notes?: string;
  assigned_to?: number;
  branch?: number;
  created?: string;
  modified?: string;
}

export function useOpportunities(filters?: { status?: string; stage?: string }) {
  return useQuery({
    queryKey: ["opportunities", filters],
    queryFn: () =>
      GET<Opportunity[] | { count: number; results: Opportunity[] }>(ENDPOINTS.opportunities.list, {
        params: filters,
      }).then((data) => normalizeListResponse<Opportunity>(data)),
    staleTime: 30_000,
  });
}

export function useOpportunity(id: string | undefined) {
  return useQuery({
    queryKey: ["opportunities", id],
    queryFn: () => GET(ENDPOINTS.opportunities.detail(id!)),
    enabled: !!id,
  });
}

export function useChangeOpportunityStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) =>
      POST(ENDPOINTS.opportunities.changeStage(id), { stage }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["opportunities"] }),
  });
}

export function useMarkOpportunityRecovered() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => POST(ENDPOINTS.opportunities.markRecovered(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["opportunities"] }),
  });
}

export function useMarkOpportunityLost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      POST(ENDPOINTS.opportunities.markLost(id), { reason }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["opportunities"] }),
  });
}

export function useOpportunityFollowUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      POST(ENDPOINTS.opportunities.followUp(id), { notes }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["opportunities"] }),
  });
}

export function useAssignOpportunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: number }) =>
      POST(ENDPOINTS.opportunities.assign(id), { user_id: userId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["opportunities"] }),
  });
}
