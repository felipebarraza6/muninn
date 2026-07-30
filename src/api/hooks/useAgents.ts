import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { GET, POST, PUT, PATCH, DELETE, GET_ALL_PAGES } from "../client";
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
  /** Iteraciones máximas del tool loop (1–8). */
  max_tool_iterations?: number;
  /** Icono del agente (emoji o path corto). */
  icon?: string | null;
  /** Color de acento (hex o token). */
  color?: string | null;
  /**
   * Roles de sucursal que pueden ver/usar el agente.
   * Lista vacía = visible para todos con acceso al módulo.
   */
  allowed_roles?: string[] | null;
  /** Metadatos de runtime (solo lectura en la mayoría de casos). */
  metadata?: Record<string, unknown> | null;
  knowledge_documents?: (string | number)[];
  functions?: (string | number)[];
  /** Apps/APIs externas que el agente puede usar (filtra skills asignables). */
  external_apis?: (string | number)[];
  /**
   * Política de flujo conversacional (slots + requires por skill).
   * Vacía o sin `skills` = inactiva.
   */
  flow_policy?: Record<string, unknown> | null;
  prompt_template?: number | null;
}

export function useAgents(filters?: {
  is_active?: boolean;
  target_app?: string;
  /** Superadmin / organizador: incluir agentes con is_active=false */
  includeInactive?: boolean;
  /**
   * Mantener la lista anterior mientras refetch (default true).
   * En chat conviene false: si no, al filtrar sucursal se ven agentes viejos.
   */
  keepPrevious?: boolean;
}) {
  const branchId = useActiveBranchId();
  const { includeInactive, keepPrevious = true, ...rest } = filters ?? {};
  const params: Record<string, string | number | boolean> = { ...rest };
  // Backend compara contra el string "true".
  if (includeInactive) params.include_inactive = "true";
  // Superadmin ignora solo el header: hay que mandar ?branch= para filtrar.
  if (branchId) params.branch = branchId;

  return useQuery({
    queryKey: [...QUERY_KEY, branchId ?? "all", { ...rest, includeInactive: !!includeInactive }],
    // page_size default del API = 10 y ordena por -created: agentes viejos
    // (ej. agendamiento WM) desaparecían de la grilla. Traer todas las páginas.
    queryFn: () => GET_ALL_PAGES<Agent>(ENDPOINTS.agents.list, { params }),
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPrevious ? keepPreviousData : undefined,
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

export interface AgentOpsOnboarding {
  ready_to_chat?: boolean;
  has_api_key?: boolean;
  has_agents?: boolean;
  has_provider?: boolean;
  missing?: Record<string, unknown>;
  next_steps?: Array<{ code?: string; message?: string; path?: string }>;
}

export interface AgentOpsHealth {
  generated_at?: string;
  branch_id?: number | string;
  onboarding?: AgentOpsOnboarding;
  ready_for_production?: boolean;
  checklist?: {
    ready_to_chat?: boolean;
    has_bidirectional_channel?: boolean;
    tool_failures_24h?: number;
    workflow_failures_24h?: number;
  };
  last_24h?: {
    tool_calls_ok?: number;
    tool_calls_failed?: number;
    workflow_completed?: number;
    workflow_failed?: number;
    workflow_running?: number;
  };
  channels?: Array<{
    id: string;
    name?: string;
    channel_type?: string;
    supports_inbound?: boolean;
    production_ready?: boolean;
    deprecated?: boolean;
  }>;
}

export interface AgentOnboardingStatus {
  ready_to_chat?: boolean;
  has_provider?: boolean;
  has_agent?: boolean;
  has_api_key?: boolean;
  missing?: string[];
  next_steps?: Array<{ code?: string; message?: string; path?: string }>;
}

export function useAgentOnboardingStatus(options?: { enabled?: boolean }) {
  const branchId = useActiveBranchId();
  return useQuery({
    queryKey: [...QUERY_KEY, "onboarding-status", branchId],
    queryFn: () =>
      GET<AgentOnboardingStatus>(ENDPOINTS.agents.onboardingStatus, {
        params: branchId ? { branch: branchId } : undefined,
      }),
    enabled: options?.enabled !== false && !!branchId,
    staleTime: 60_000,
  });
}

export function useOpsHealth(options?: { enabled?: boolean }) {
  const branchId = useActiveBranchId();
  return useQuery({
    queryKey: [...QUERY_KEY, "ops-health", branchId],
    queryFn: () =>
      GET<AgentOpsHealth>(ENDPOINTS.agents.opsHealth, {
        params: branchId ? { branch: branchId } : undefined,
      }),
    enabled: options?.enabled !== false && !!branchId,
    staleTime: 60_000,
  });
}
