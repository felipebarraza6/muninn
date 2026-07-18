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
  /** Prefijo Authorization tras login: Bearer | Token (desde auth_config). */
  auth_header_prefix?: "Bearer" | "Token" | string;
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
  /** Credenciales dinámicas para el endpoint de login (placeholders). */
  credentials?: Record<string, string>;
  /** Si true, ignora el token cacheado y vuelve a loguear. Default en backend: true. */
  force_auth?: boolean;
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
  /** Request real enviada (url, method, query, headers, body). */
  request?: {
    method?: string;
    url?: string;
    query_params?: Record<string, unknown>;
    headers?: Record<string, unknown>;
    body?: unknown;
  };
  auth?: {
    success?: boolean;
    token_preview?: string;
    error?: string;
    available_keys?: string[];
    token_path_used?: string | null;
    raw_response?: unknown;
    from_cache?: boolean;
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

const CONNECTIONS_KEY = ["ai-agents", "application-connections"];

export interface ApplicationUserConnection {
  id: string;
  external_api: string;
  external_api_name?: string | null;
  external_api_auth_type?: string | null;
  label?: string;
  is_active?: boolean;
  is_connected?: boolean;
  last_verified_at?: string | null;
  last_error?: string;
  branch?: number | string | null;
  created?: string;
  modified?: string;
}

export interface CredentialField {
  name: string;
  type?: string;
  format?: string | null;
  required?: boolean;
}

export function useApplicationConnection(externalApiId: string | undefined) {
  const branchId = useActiveBranchId();
  return useQuery({
    queryKey: [...CONNECTIONS_KEY, branchId, externalApiId],
    queryFn: () =>
      GET<ApplicationUserConnection[] | { count: number; results: ApplicationUserConnection[] }>(
        ENDPOINTS.applicationConnections.list,
        { params: { external_api: externalApiId! } },
      ).then((data) => {
        const list = normalizeListResponse<ApplicationUserConnection>(data);
        return list[0] ?? null;
      }),
    enabled: !!externalApiId,
    staleTime: 30_000,
  });
}

export function useCredentialFields(externalApiId: string | undefined) {
  return useQuery({
    queryKey: [...CONNECTIONS_KEY, "fields", externalApiId],
    queryFn: () =>
      GET<{
        external_api: string;
        auth_endpoint_key?: string;
        fields: CredentialField[];
      }>(ENDPOINTS.applicationConnections.credentialFields(externalApiId!)),
    enabled: !!externalApiId,
    staleTime: 60_000,
  });
}

export function useConnectApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { external_api: string; credentials: Record<string, string> }) =>
      POST<{
        success: boolean;
        error?: string | null;
        token_preview?: string | null;
        connection: ApplicationUserConnection;
      }>(ENDPOINTS.applicationConnections.connect, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: CONNECTIONS_KEY }),
  });
}

export function useDisconnectApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => DELETE(ENDPOINTS.applicationConnections.detail(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: CONNECTIONS_KEY }),
  });
}
