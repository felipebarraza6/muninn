import { useQuery } from "@tanstack/react-query";
import { GET, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";

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
  return useQuery({
    queryKey: QUERY_KEY,
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
