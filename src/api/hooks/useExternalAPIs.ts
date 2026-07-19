import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GET, POST, PATCH, DELETE, GET_ALL_PAGES, normalizeListResponse } from "../client";
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
  /** Endpoint del store «Probar» para validar que el servicio está activo. */
  health_endpoint_key?: string;
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
  /** Categoría principal del store (ej. Salud, ERP). */
  category?: string | null;
  /** Tags libres para filtrar en el store. */
  tags?: string[];
  /** Ancla técnica BranchModelApi. */
  branch?: number | string | null;
  /** Sucursales con instalación activa. */
  branches?: (number | string)[];
  branch_names?: string[];
  created?: string;
  modified?: string;
}

export interface ExternalAPIInstallation {
  id: string;
  external_api: string;
  external_api_name?: string | null;
  branch: number | string;
  branch_name?: string | null;
  label?: string;
  has_credentials?: boolean;
  is_active?: boolean;
  last_verified_at?: string | null;
  last_error?: string;
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
  tested?: {
    mode?: "login" | "base_url" | string;
    endpoint?: string;
    method?: string;
    path?: string;
    base_url?: string;
    installation_label?: string | null;
  };
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

export function useExternalAPIs(options?: {
  includeInactive?: boolean;
  branch?: string | number | null;
  /**
   * store = catálogo completo (todas las apps accesibles).
   * branch = solo apps habilitadas en esa sucursal (default: activa).
   */
  scope?: "store" | "branch";
}) {
  const activeBranchId = useActiveBranchId();
  const includeInactive = options?.includeInactive ?? false;
  const scope = options?.scope ?? "branch";
  const branchId = options?.branch ?? activeBranchId;
  return useQuery({
    queryKey: [...QUERY_KEY, scope, scope === "store" ? "all" : branchId, { includeInactive }],
    queryFn: () => {
      const params: Record<string, string> = {};
      if (includeInactive) params.include_inactive = "true";
      if (scope === "store") {
        params.scope = "store";
      } else if (branchId) {
        params.branch = String(branchId);
      }
      return GET_ALL_PAGES<ExternalAPI>(ENDPOINTS.integrations.list, { params });
    },
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
    mutationFn: (arg: string | { id: string; hard?: boolean }) => {
      const id = typeof arg === "string" ? arg : arg.id;
      const hard = typeof arg === "object" ? Boolean(arg.hard) : false;
      return DELETE(ENDPOINTS.integrations.detail(id), {
        params: hard ? { hard: "true" } : undefined,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useTestExternalAPI() {
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body?: ExternalAPITestRequest }) =>
      POST<ExternalAPITestResult>(ENDPOINTS.integrations.testConnection(id), body ?? {}),
  });
}

export interface SyncSkillsResult {
  external_api: string;
  created: number;
  updated: number;
  skipped: number;
  results: Array<{
    endpoint_key: string;
    slug?: string;
    name?: string;
    id?: string;
    created?: boolean;
    updated?: boolean;
    skipped?: boolean;
    reason?: string;
  }>;
}

export function useSyncExternalAPISkills() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body?: {
        update_existing?: boolean;
        skip_auth_endpoint?: boolean;
        endpoint_keys?: string[];
      };
    }) => POST<SyncSkillsResult>(ENDPOINTS.integrations.syncSkills(id), body ?? {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      qc.invalidateQueries({ queryKey: ["ai-agents", "agent-functions"] });
    },
  });
}

export function useExternalAPIStatus(id: string | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, id, "status"],
    queryFn: () => GET<Record<string, unknown>>(ENDPOINTS.integrations.status(id!)),
    enabled: !!id,
  });
}

const INSTALLATIONS_KEY = ["ai-agents", "external-api-installations"];
const CONNECTIONS_KEY = ["ai-agents", "application-connections"];

export function useExternalAPIInstallations(externalApiId: string | undefined) {
  return useQuery({
    queryKey: [...INSTALLATIONS_KEY, externalApiId],
    queryFn: () =>
      GET_ALL_PAGES<ExternalAPIInstallation>(ENDPOINTS.externalApiInstallations.list, {
        params: { external_api: externalApiId! },
      }),
    enabled: !!externalApiId,
    staleTime: 30_000,
  });
}

export function useConnectInstallation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, credentials }: { id: string; credentials: Record<string, string> }) =>
      POST<{
        success: boolean;
        error?: string | null;
        token_preview?: string | null;
        installation: ExternalAPIInstallation;
      }>(ENDPOINTS.externalApiInstallations.connect(id), { credentials }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INSTALLATIONS_KEY });
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useDisconnectInstallationAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      POST<{ success: boolean; installation: ExternalAPIInstallation }>(
        ENDPOINTS.externalApiInstallations.disconnect(id),
        {},
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: INSTALLATIONS_KEY });
      qc.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

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

/** Cuenta del usuario en la sucursal activa (una instalación). */
export function useApplicationConnection(externalApiId: string | undefined) {
  const branchId = useActiveBranchId();
  return useQuery({
    queryKey: [...CONNECTIONS_KEY, branchId, externalApiId],
    queryFn: () =>
      GET<ApplicationUserConnection[] | { count: number; results: ApplicationUserConnection[] }>(
        ENDPOINTS.applicationConnections.list,
        {
          params: {
            external_api: externalApiId!,
            ...(branchId ? { branch: String(branchId) } : {}),
          },
        },
      ).then((data) => {
        const list = normalizeListResponse<ApplicationUserConnection>(data);
        return list[0] ?? null;
      }),
    enabled: !!externalApiId,
    staleTime: 30_000,
  });
}

/** Todas las cuentas del usuario para una app (una por sucursal instalada). */
export function useApplicationConnectionsForApi(externalApiId: string | undefined) {
  return useQuery({
    queryKey: [...CONNECTIONS_KEY, "installations", externalApiId],
    queryFn: () =>
      GET_ALL_PAGES<ApplicationUserConnection>(ENDPOINTS.applicationConnections.list, {
        params: { external_api: externalApiId!, scope: "installations" },
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
    mutationFn: (body: {
      external_api: string;
      credentials: Record<string, string>;
      /** Sucursal de la instalación donde guardar la cuenta. */
      branch?: string | number;
    }) =>
      POST<{
        success: boolean;
        error?: string | null;
        token_preview?: string | null;
        connection: ApplicationUserConnection;
      }>(ENDPOINTS.applicationConnections.connect, {
        ...body,
        ...(body.branch != null
          ? {
              branch: Number.isNaN(Number(body.branch)) ? body.branch : Number(body.branch),
            }
          : {}),
      }),
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
