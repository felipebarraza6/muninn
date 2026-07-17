import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GET, POST, PATCH, DELETE, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { useActiveBranchId } from "@/hooks/useActiveBranchId";

const QUERY_KEY = ["ai-agents", "external-apis"];

export interface ExternalAPIEndpoint {
  method?: string;
  path?: string;
  query_params?: Record<string, unknown>;
  headers?: Record<string, unknown>;
  body?: Record<string, unknown>;
  response_mapping?: Record<string, unknown>;
}

export interface ExternalAPI {
  id: string;
  name: string;
  description?: string;
  base_url?: string;
  auth_type?: "none" | "api_key" | "bearer" | "oauth2" | "basic" | "endpoint_auth";
  auth_config?: Record<string, unknown>;
  default_headers?: Record<string, unknown>;
  retry_policy?: Record<string, unknown>;
  timeout_seconds?: number;
  endpoints?: Record<string, ExternalAPIEndpoint>;
  is_active: boolean;
  created?: string;
  modified?: string;
}

export function useExternalAPIs() {
  const branchId = useActiveBranchId();
  return useQuery({
    queryKey: [...QUERY_KEY, branchId],
    queryFn: () =>
      GET<ExternalAPI[] | { count: number; results: ExternalAPI[] }>(
        ENDPOINTS.integrations.list,
      ).then((data) => normalizeListResponse<ExternalAPI>(data)),
    staleTime: 2 * 60 * 1000,
  });
}

export function useExternalAPI(id: string | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => GET<ExternalAPI>(ENDPOINTS.integrations.detail(id!)),
    enabled: !!id,
  });
}

export function useCreateExternalAPI() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ExternalAPI>) =>
      POST<ExternalAPI>(ENDPOINTS.integrations.list, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateExternalAPI() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExternalAPI> }) =>
      PATCH<ExternalAPI>(ENDPOINTS.integrations.detail(id), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteExternalAPI() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => DELETE(ENDPOINTS.integrations.detail(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useTestExternalAPI() {
  return useMutation({
    mutationFn: (id: string) =>
      POST<{ ok?: boolean; status?: string; detail?: string }>(
        ENDPOINTS.integrations.testConnection(id),
      ),
  });
}

export function useExternalAPIStatus(id: string | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, id, "status"],
    queryFn: () => GET<Record<string, unknown>>(ENDPOINTS.integrations.status(id!)),
    enabled: !!id,
  });
}
