import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GET, POST, PUT, PATCH, DELETE, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { useActiveBranchId } from "@/hooks/useActiveBranchId";
import type { ParameterSource } from "./useAgentFunctions";

const QUERY_KEY = ["ai-agents", "agents"];
const SKILL_CONFIG_KEY = ["ai-agents", "agent-skill-configs"];

export interface AgentSkillConfig {
  id?: string | null;
  agent: string;
  agent_function: string;
  agent_function_name?: string | null;
  agent_function_slug?: string | null;
  enabled?: boolean;
  description?: string | null;
  response_instructions?: string | null;
  parameter_sources?: Record<string, ParameterSource> | null;
  is_customized?: boolean;
  effective_description?: string;
  effective_response_instructions?: string;
  effective_parameter_sources?: Record<string, ParameterSource>;
  branch?: number | string | null;
}

export interface Agent {
  id: string | number;
  name: string;
  slug?: string;
  /** Sucursal dueña del agente (necesario al crear conversaciones). */
  branch?: number | string | null;
  branch_name?: string | null;
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
  embedding_model?: string | number | null;
  semantic_weight?: number;
  use_semantic_search?: boolean;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  knowledge_documents?: (string | number)[];
  functions?: (string | number)[];
  /** Apps/APIs externas que el agente puede usar (filtra skills asignables). */
  external_apis?: (string | number)[];
  prompt_template?: number | null;
}

export function useAgents(filters?: {
  is_active?: boolean;
  target_app?: string;
  /** Superadmin / organizador: incluir agentes con is_active=false */
  includeInactive?: boolean;
}) {
  const branchId = useActiveBranchId();
  const { includeInactive, ...rest } = filters ?? {};
  const params: Record<string, string | number | boolean> = { ...rest };
  // Backend compara contra el string "true".
  if (includeInactive) params.include_inactive = "true";

  return useQuery({
    queryKey: [...QUERY_KEY, branchId, { ...rest, includeInactive: !!includeInactive }],
    queryFn: () =>
      GET<Agent[] | { count: number; results: Agent[] }>(ENDPOINTS.agents.list, {
        params,
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
    mutationFn: (arg: string | number | { id: string | number; hard?: boolean }) => {
      const id = typeof arg === "object" ? arg.id : arg;
      const hard = typeof arg === "object" ? Boolean(arg.hard) : false;
      return DELETE(ENDPOINTS.agents.detail(String(id)), {
        params: hard ? { hard: "true" } : undefined,
      });
    },
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

export function useAgentSkillConfigs(agentId: string | undefined) {
  const branchId = useActiveBranchId();
  return useQuery({
    queryKey: [...SKILL_CONFIG_KEY, branchId, agentId],
    queryFn: () =>
      GET<AgentSkillConfig[]>(ENDPOINTS.agents.skillConfigs(agentId!)).then((data) =>
        Array.isArray(data) ? data : [],
      ),
    enabled: !!agentId,
    staleTime: 30_000,
  });
}

export function useAgentSkillConfig(agentId: string | undefined, skillId: string | undefined) {
  const branchId = useActiveBranchId();
  return useQuery({
    queryKey: [...SKILL_CONFIG_KEY, branchId, agentId, skillId],
    queryFn: () => GET<AgentSkillConfig>(ENDPOINTS.agents.skillConfig(agentId!, skillId!)),
    enabled: !!agentId && !!skillId,
    staleTime: 30_000,
  });
}

export function useUpsertAgentSkillConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      agentId,
      skillId,
      data,
    }: {
      agentId: string;
      skillId: string;
      data: Partial<AgentSkillConfig>;
    }) => PUT<AgentSkillConfig>(ENDPOINTS.agents.skillConfig(agentId, skillId), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: SKILL_CONFIG_KEY }),
  });
}

export function useResetAgentSkillConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ agentId, skillId }: { agentId: string; skillId: string }) =>
      DELETE(ENDPOINTS.agents.skillConfig(agentId, skillId)),
    onSuccess: () => qc.invalidateQueries({ queryKey: SKILL_CONFIG_KEY }),
  });
}
