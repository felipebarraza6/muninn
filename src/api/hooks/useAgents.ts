import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GET, POST, PATCH, DELETE, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";

const QUERY_KEY = ["ai-agents", "agents"];

export interface Agent {
  id: string | number;
  name: string;
  slug?: string;
  agent_type?: string;
  target_app?: string;
  is_active?: boolean;
  is_default?: boolean;
  system_prompt?: string;
  llm_provider?: number | null;
  llm_provider_name?: string;
  llm_model?: number | null;
  llm_model_name?: string;
  temperature?: number;
  max_tokens?: number;
  use_rag?: boolean;
  rag_top_k?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  knowledge_documents?: string[];
  welcome_message?: string;
}

export function useAgents(filters?: { is_active?: boolean; target_app?: string }) {
  return useQuery({
    queryKey: [...QUERY_KEY, filters],
    queryFn: () =>
      GET<Agent[] | { count: number; results: Agent[] }>(ENDPOINTS.agents.list, {
        params: filters,
      }).then((data) => normalizeListResponse<Agent>(data)),
    staleTime: 2 * 60 * 1000,
  });
}

export function useAgent(id: string | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => GET<Agent>(ENDPOINTS.agents.detail(id!)),
    enabled: !!id,
  });
}

export function useDefaultAgent() {
  return useQuery({
    queryKey: [...QUERY_KEY, "default"],
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
      POST<{ response?: string; error?: string }>(ENDPOINTS.agents.testLLM(String(id)), {
        message,
      }),
  });
}
