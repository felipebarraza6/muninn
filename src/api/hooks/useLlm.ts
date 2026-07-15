import { useQuery } from "@tanstack/react-query";
import { GET, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";

const PROVIDERS_KEY = ["ai-agents", "llm-providers"];
const MODELS_KEY = ["ai-agents", "llm-models"];

export interface LlmProvider {
  id: number | string;
  name: string;
  provider_type?: string;
  is_active?: boolean;
}

export interface LlmModel {
  id: number | string;
  name: string;
  model_id?: string;
  provider?: number | string;
  is_active?: boolean;
  is_free?: boolean;
  capabilities?: string[];
}

export function useLlmProviders() {
  return useQuery({
    queryKey: PROVIDERS_KEY,
    queryFn: () =>
      GET<LlmProvider[] | { results: LlmProvider[] }>(ENDPOINTS.llm.providers).then((data) =>
        normalizeListResponse<LlmProvider>(data),
      ),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLlmModels(providerId?: string | number | null) {
  return useQuery({
    queryKey: [...MODELS_KEY, providerId],
    queryFn: () =>
      GET<LlmModel[] | { results: LlmModel[] }>(ENDPOINTS.llm.models, {
        params: providerId ? { provider: providerId } : undefined,
      }).then((data) => normalizeListResponse<LlmModel>(data)),
    staleTime: 5 * 60 * 1000,
  });
}
