import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DELETE, GET, PATCH, POST, normalizeListResponse, type ApiRequestConfig, type PaginatedResponse } from "../client";
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
  cost_per_1k_input?: number | string | null;
  cost_per_1k_output?: number | string | null;
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

export interface LlmModelsListResult {
  results: LlmModel[];
  count: number;
}

export type UseLlmModelsOptions = {
  providerId?: string | number | null;
  /** Filtra por estado; omitir = todos (p. ej. selector de agente con activos). */
  isActive?: boolean;
  /** Modelos con costo 0 (entrada y salida). */
  isFree?: boolean;
  /** Capacidades requeridas, p. ej. ["vision","tools"]. */
  capabilities?: string[];
  search?: string;
  page?: number;
  pageSize?: number;
  enabled?: boolean;
};

export const LLM_CAPABILITY_LABELS: Record<string, string> = {
  vision: "Visión",
  tools: "Tools",
  embeddings: "Embeddings",
  json_mode: "JSON",
  streaming: "Streaming",
  images: "Imágenes",
  audio: "Audio",
};

export function capabilityLabel(key: string): string {
  return LLM_CAPABILITY_LABELS[key] || key;
}

export function useLlmModels(options?: UseLlmModelsOptions) {
  const {
    providerId = null,
    isActive,
    isFree,
    capabilities,
    search,
    page,
    pageSize = 20,
    enabled = true,
  } = options ?? {};
  const paginated = page != null && page > 0;
  const capsKey = (capabilities ?? []).slice().sort().join(",");

  return useQuery({
    queryKey: [
      ...MODELS_KEY,
      providerId ?? "all",
      isActive ?? "any",
      isFree ?? "any",
      capsKey,
      search?.trim() ?? "",
      paginated ? page : 0,
      paginated ? pageSize : 0,
    ],
    queryFn: async () => {
      const params: Record<string, string | number | boolean> = {};
      if (providerId) params.provider = providerId;
      if (isActive !== undefined) params.is_active = isActive;
      if (isFree === true) params.is_free = true;
      if (capabilities?.length) params.capabilities = capabilities.join(",");
      if (search?.trim()) params.search = search.trim();
      if (paginated) {
        params.page = page!;
        params.page_size = pageSize;
      }

      const data = await GET<LlmModel[] | PaginatedResponse<LlmModel>>(ENDPOINTS.llm.models, {
        params,
      });
      const results = normalizeListResponse(data);
      const count =
        data && typeof data === "object" && !Array.isArray(data) && typeof data.count === "number"
          ? data.count
          : results.length;
      return { results, count } satisfies LlmModelsListResult;
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/** Claves de capacidad presentes en el catálogo del proveedor. */
export function useProviderModelCapabilities(providerId?: string | number | null) {
  return useQuery({
    queryKey: [...PROVIDERS_KEY, providerId ?? "none", "capabilities"],
    queryFn: () => GET<string[]>(ENDPOINTS.llm.modelCapabilities(providerId!)),
    enabled: Boolean(providerId),
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
