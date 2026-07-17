import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GET, POST, PATCH, DELETE, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { useActiveBranchId } from "@/hooks/useActiveBranchId";

const QUERY_KEY = ["ai-agents", "external-apis"];

export type ExternalAPIAuthType =
  | "none"
  | "api_key"
  | "bearer"
  | "oauth2"
  | "basic"
  | "endpoint_auth";

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
  auth_type?: ExternalAPIAuthType;
  /** Write-only en API; no vuelve en GET. */
  auth_config?: Record<string, unknown>;
  /** Write-only. */
  api_key?: string;
  api_key_masked?: string | null;
  auth_endpoint_key?: string;
  auth_token_path?: string;
  auth_token_ttl_seconds?: number;
  default_headers?: Record<string, unknown>;
  retry_policy?: Record<string, unknown>;
  timeout_seconds?: number;
  endpoints?: Record<string, ExternalAPIEndpoint>;
  endpoints_payload_templates?: Record<string, unknown>;
  endpoints_response_mapping?: Record<string, unknown>;
  is_active: boolean;
  branch?: number | string | null;
  created?: string;
  modified?: string;
}

export interface ExternalAPITestRequest {
  endpoint_type?: string;
  body?: Record<string, unknown>;
  authenticate_first?: boolean;
  method?: string;
  path?: string;
  headers?: Record<string, unknown>;
  params?: Record<string, unknown>;
}

export interface ExternalAPITestResult {
  success?: boolean;
  status_code?: number;
  data?: unknown;
  raw_response?: unknown;
  mapped_data?: unknown;
  payload_sent?: unknown;
  latency_ms?: number;
  error?: string | null;
  detail?: string;
  auth?: {
    success?: boolean;
    token_preview?: string;
    error?: string;
  };
}

export function useExternalAPIs(options?: { includeInactive?: boolean }) {
  const branchId = useActiveBranchId();
  const includeInactive = options?.includeInactive ?? false;
  return useQuery({
    queryKey: [...QUERY_KEY, branchId, { includeInactive }],
    queryFn: () =>
      GET<ExternalAPI[] | { count: number; results: ExternalAPI[] }>(
        ENDPOINTS.integrations.list,
        includeInactive ? { params: { include_inactive: "true" } } : undefined,
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
    mutationFn: ({ id, body }: { id: string; body?: ExternalAPITestRequest }) =>
      POST<ExternalAPITestResult>(ENDPOINTS.integrations.testConnection(id), body ?? {}),
  });
}

export function useExternalAPIStatus(id: string | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, id, "status"],
    queryFn: () => GET<Record<string, unknown>>(ENDPOINTS.integrations.status(id!)),
    enabled: !!id,
  });
}
