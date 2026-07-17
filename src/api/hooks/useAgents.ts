import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GET, POST, PATCH, DELETE, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { useActiveBranchId } from "@/hooks/useActiveBranchId";

const QUERY_KEY = ["ai-agents", "agents"];

export interface Agent {
  id: string | number;
  name: string;
  slug?: string;
  agent_type?: string;
  target_app?: string;
  description?: string;
  is_active?: boolean;
  is_default?: boolean;
  status?: string;
  system_prompt?: string;
  welcome_message?: string;
  llm_provider?: number | string | null;
  llm_provider_name?: string;
  llm_provider_type?: string;
  llm_model?: number | string | null;
  llm_model_name?: string;
  llm_model_id?: string;
  model_name?: string;
  temperature?: number;
  max_tokens?: number;
  requests_per_minute?: number;
  use_rag?: boolean;
  rag_top_k?: number;
  embedding_model?: string;
  semantic_weight?: number;
  use_semantic_search?: boolean;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  knowledge_documents?: (string | number)[];
  functions?: (string | number)[];
  prompt_template?: number | null;
}

export function useAgents(filters?: { is_active?: boolean; target_app?: string }) {
  const branchId = useActiveBranchId();
  return useQuery({
    queryKey: [...QUERY_KEY, branchId, filters],
    queryFn: () =>
      GET<Agent[] | { count: number; results: Agent[] }>(ENDPOINTS.agents.list, {
        params: filters,
      }).then((data) => normalizeListResponse<Agent>(data)),
    staleTime: 2 * 60 * 1000,
  });
}

export function useAgent(id: string | undefined) {
  const branchId = useActiveBranchId();
  return useQuery({
    queryKey: [...QUERY_KEY, branchId, id],
    queryFn: () => GET<Agent>(ENDPOINTS.agents.detail(id!)),
    enabled: !!id,
  });
}

export function useDefaultAgent() {
  const branchId = useActiveBranchId();
  return useQuery({
    queryKey: [...QUERY_KEY, branchId, "default"],
    queryFn: () => GET<Agent>(ENDPOINTS.agents.default),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Agent>) => POST<Agent>(ENDPOINTS.agents.list, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<Agent> }) =>
      PATCH<Agent>(ENDPOINTS.agents.detail(String(id)), data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => DELETE(ENDPOINTS.agents.detail(String(id))),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useTestAgentLLM() {
  return useMutation({
    mutationFn: ({ id, message }: { id: string | number; message?: string }) =>
      POST<{ response?: string; error?: string; rag_sources?: unknown[]; tool_calls?: unknown[] }>(
        ENDPOINTS.agents.testLLM(String(id)),
        { message },
      ),
  });
}
