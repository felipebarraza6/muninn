import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DELETE, GET, PATCH, POST, normalizeListResponse, type ApiRequestConfig } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { useActiveBranchId } from "@/hooks/useActiveBranchId";
import { isOrganizationOwner, isSuperAdmin } from "@/lib/authGuards";

const PROVIDERS_KEY = ["ai-agents", "llm-providers"];
const MODELS_KEY = ["ai-agents", "llm-models"];

export type LlmProviderScope = "all" | string;

export const PROVIDER_TYPES = [
  { value: "openrouter", label: "OpenRouter" },
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "google", label: "Google Gemini" },
  { value: "cohere", label: "Cohere" },
  { value: "ollama", label: "Ollama" },
  { value: "custom", label: "Custom / OpenAI-compatible" },
] as const;

export interface LlmProvider {
  id: number | string;
  name: string;
  provider_type?: string;
  description?: string | null;
  base_url?: string | null;
  auth_type?: string;
  api_key?: string;
  api_key_masked?: string;
  api_key_configured?: boolean;
  is_active?: boolean;
  branches?: (number | string)[];
  branch_names?: string[];
  models?: LlmModel[];
}

export interface LlmModel {
  id: number | string;
  name: string;
  model_id?: string;
  provider?: number | string;
  provider_name?: string;
  is_active?: boolean;
  is_free?: boolean;
  is_recommended?: boolean;
  capabilities?: string[] | Record<string, unknown>;
  description?: string | null;
  max_tokens?: number | null;
  context_window?: number | null;
}

export function useLlmProviders(options?: { scope?: LlmProviderScope | null }) {
  const activeBranchId = useActiveBranchId();
  const scope = options?.scope;
  const fetchAll = scope === "all";
  const explicitBranch = scope && scope !== "all" ? scope : null;
  const skipBranchHeader = fetchAll && (isSuperAdmin() || isOrganizationOwner());
  const queryScopeKey =
    fetchAll && skipBranchHeader ? "all" : (explicitBranch ?? activeBranchId ?? "none");

  return useQuery({
    queryKey: [...PROVIDERS_KEY, queryScopeKey],
    queryFn: () => {
      const config: ApiRequestConfig = {};
      if (skipBranchHeader) {
        config.skipBranchHeader = true;
      } else if (explicitBranch) {
        config.headers = { "x-branch-id": explicitBranch };
      }
      return GET<LlmProvider[] | { results: LlmProvider[] }>(ENDPOINTS.llm.providers, config).then(
        (data) => normalizeListResponse<LlmProvider>(data),
      );
    },
    enabled: fetchAll
      ? skipBranchHeader || Boolean(activeBranchId)
      : Boolean(explicitBranch || activeBranchId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLlmModels(providerId?: string | number | null) {
  return useQuery({
    queryKey: [...MODELS_KEY, providerId ?? "all"],
    queryFn: () =>
      GET<LlmModel[] | { results: LlmModel[] }>(ENDPOINTS.llm.models, {
        params: providerId ? { provider: providerId } : undefined,
      }).then((data) => normalizeListResponse<LlmModel>(data)),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateLlmProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<LlmProvider>) => POST<LlmProvider>(ENDPOINTS.llm.providers, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROVIDERS_KEY }),
  });
}

export function useUpdateLlmProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<LlmProvider> }) =>
      PATCH<LlmProvider>(ENDPOINTS.llm.providerDetail(id), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROVIDERS_KEY }),
  });
}

export function useDeleteLlmProvider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => DELETE(ENDPOINTS.llm.providerDetail(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROVIDERS_KEY });
      qc.invalidateQueries({ queryKey: MODELS_KEY });
    },
  });
}

export interface LlmTestConnectionResult {
  success: boolean;
  provider?: string;
  provider_name?: string;
  url_tested?: string;
  method?: string;
  status_code?: number;
  latency_ms?: number;
  headers_sent?: Record<string, string>;
  response_preview?: string;
  error?: string;
  message?: string;
  timestamp?: string;
}

export function useTestLlmProvider() {
  return useMutation({
    mutationFn: (id: string | number) =>
      POST<LlmTestConnectionResult>(ENDPOINTS.llm.testConnection(id), {}),
  });
}

export function useSyncLlmModels() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => POST(ENDPOINTS.llm.syncModels(id), {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: MODELS_KEY }),
  });
}

export function useCreateLlmModel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<LlmModel>) => POST<LlmModel>(ENDPOINTS.llm.models, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: MODELS_KEY }),
  });
}

export function useUpdateLlmModel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<LlmModel> }) =>
      PATCH<LlmModel>(ENDPOINTS.llm.modelDetail(id), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: MODELS_KEY }),
  });
}

export function useDeleteLlmModel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => DELETE(ENDPOINTS.llm.modelDetail(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: MODELS_KEY }),
  });
}
