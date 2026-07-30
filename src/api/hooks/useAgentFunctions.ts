import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GET, POST, PATCH, DELETE, GET_ALL_PAGES, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { useActiveBranchId } from "@/hooks/useActiveBranchId";

const QUERY_KEY = ["ai-agents", "agent-functions"];
const LOGS_KEY = ["ai-agents", "function-execution-logs"];

export type ImplementationType = "api" | "db_query" | "python_code" | "webhook" | "formula";
/** Ámbito de uso transversal (independiente del tipo y de la app). */
export type SkillScope = "global" | "branch" | "agent";

/** Fuente de un parámetro (cómo se resuelve antes de ejecutar). */
export type ParameterSource =
  | { source: "free" }
  | { source: "static"; value: unknown }
  | {
      source: "data_document";
      document_title: string;
      value_column: string;
      user_input_column?: string;
    };

export interface AgentFunctionConfig {
  endpoint_type?: string;
  parameter_sources?: Record<string, ParameterSource>;
  /** Expresión segura para skills tipo formula (simpleeval). */
  expression?: string;
  method?: string;
  path?: string;
  body_template?: Record<string, unknown>;
  function_name?: string;
  url?: string;
  headers?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface JsonSchema {
  type?: string;
  properties?: Record<string, JsonSchemaProperty>;
  required?: string[];
  [key: string]: unknown;
}

export interface JsonSchemaProperty {
  type?: string;
  format?: string;
  description?: string;
  enum?: unknown[];
  [key: string]: unknown;
}

export interface AgentFunction {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  is_active: boolean;
  implementation_type?: ImplementationType;
  /** Ámbito de uso: global | branch | agent. */
  scope?: SkillScope;
  external_api?: string | null;
  external_api_name?: string | null;
  /** True si la app usa endpoint_auth: la skill usa la cuenta del owner. */
  uses_personal_connection?: boolean;
  /** Autor (user id). Organizador solo edita las suyas. */
  created_by?: number | string | null;
  /** Backend: si el usuario actual puede editar/desactivar esta skill. */
  can_edit?: boolean;
  config?: AgentFunctionConfig;
  parameters_schema?: JsonSchema;
  return_schema?: Record<string, unknown>;
  response_instructions?: string;
  branch?: number | string | null;
  created?: string;
  modified?: string;
}

export interface FunctionExecutionLog {
  id: string;
  agent_function?: string | null;
  agent_function_name?: string | null;
  agent_function_slug?: string | null;
  external_api?: string | null;
  external_api_name?: string | null;
  endpoint_type?: string;
  implementation_type?: string;
  parameters?: Record<string, unknown>;
  request_payload?: Record<string, unknown>;
  response_payload?: Record<string, unknown>;
  status_code?: number | null;
  success?: boolean;
  error?: string;
  latency_ms?: number;
  source?: string;
  conversation?: string | null;
  conversation_title?: string | null;
  agent?: string | null;
  agent_name?: string | null;
  created?: string;
  modified?: string;
}

export interface SkillStats {
  skill_id: string;
  total: number;
  success_count: number;
  error_count: number;
  success_rate: number;
  avg_latency_ms: number;
  last_used_at?: string | null;
  by_agent: Array<{
    agent: string | null;
    agent_name?: string | null;
    total: number;
    success_count: number;
    error_count: number;
    avg_latency_ms: number;
    last_used_at?: string | null;
  }>;
  by_source: Array<{
    source: string;
    total: number;
    success_count: number;
    avg_latency_ms: number;
  }>;
}

export interface ExecuteResult {
  success?: boolean;
  result?: unknown;
  error?: string | null;
  [key: string]: unknown;
}

export function useAgentFunctions(options?: {
  includeInactive?: boolean;
  externalApiId?: string;
  /**
   * Sucursal a filtrar. Si se omite y hay `externalApiId`, no se envía `branch`
   * (las skills de la app viven en su sucursal home, no en el header del store).
   * `null` también omite el filtro. Si no hay externalApiId, usa la sucursal activa.
   */
  branch?: string | number | null;
}) {
  const activeBranchId = useActiveBranchId();
  const includeInactive = options?.includeInactive ?? false;
  const externalApiId = options?.externalApiId;
  const hasExplicitBranch = options != null && Object.hasOwn(options, "branch");
  const branchId = hasExplicitBranch
    ? (options.branch ?? null)
    : externalApiId
      ? null
      : activeBranchId;
  return useQuery({
    queryKey: [...QUERY_KEY, branchId ?? "all", { includeInactive, externalApiId }],
    queryFn: () => {
      const params: Record<string, string> = {};
      if (includeInactive) params.include_inactive = "true";
      if (externalApiId) params.external_api = externalApiId;
      if (branchId) params.branch = String(branchId);
      // PAGE_SIZE backend = 10; hay que paginar o solo se ven ~10 skills
      // (p. ej. «Listar tickets» quedaba fuera de la primera página).
      return GET_ALL_PAGES<AgentFunction>(ENDPOINTS.functions.list, { params });
    },
    staleTime: 2 * 60 * 1000,
    enabled: options?.externalApiId === undefined || !!externalApiId,
  });
}

export function useAgentFunction(id: string | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => GET<AgentFunction>(ENDPOINTS.functions.detail(id!)),
    enabled: !!id,
  });
}

export type AgentFunctionWrite = Partial<AgentFunction> & {
  /** Write-only: asigna la skill al M2M del agente cuando scope=agent. */
  agent_id?: string;
};

export function useCreateAgentFunction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AgentFunctionWrite) => POST<AgentFunction>(ENDPOINTS.functions.list, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateAgentFunction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AgentFunction> }) =>
      PATCH<AgentFunction>(ENDPOINTS.functions.detail(id), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export type SkillDeleteResult = {
  success?: boolean;
  action?: "deactivated" | "deleted" | "confirm_permanent";
  id?: string;
  name?: string;
  is_active?: boolean;
  message?: string;
  error?: string;
};

export function useDeleteAgentFunction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, permanent }: { id: string; permanent?: boolean }) =>
      DELETE<SkillDeleteResult>(ENDPOINTS.functions.detail(id), {
        params: permanent ? { permanent: "true" } : undefined,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useRestoreAgentFunction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      POST<{
        success?: boolean;
        action?: string;
        id?: string;
        name?: string;
        is_active?: boolean;
        message?: string;
      }>(ENDPOINTS.functions.restore(id), {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useExecuteAgentFunction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, parameters }: { id: string; parameters?: Record<string, unknown> }) =>
      POST<ExecuteResult>(ENDPOINTS.functions.execute(id), { parameters: parameters ?? {} }),
    onSuccess: () => qc.invalidateQueries({ queryKey: LOGS_KEY }),
  });
}

/** Evalúa una fórmula sin guardar la skill (workspace de creación). */
export function usePreviewFormula() {
  return useMutation({
    mutationFn: (data: {
      expression: string;
      parameters?: Record<string, unknown>;
      parameters_schema?: JsonSchema;
    }) =>
      POST<ExecuteResult>(ENDPOINTS.functions.previewFormula, {
        expression: data.expression,
        parameters: data.parameters ?? {},
        parameters_schema: data.parameters_schema ?? {},
      }),
  });
}

/** Evalúa un snippet Python o función registrada sin guardar. */
export function usePreviewPython() {
  return useMutation({
    mutationFn: (data: {
      code?: string;
      function_name?: string;
      entry?: string;
      parameters?: Record<string, unknown>;
      parameters_schema?: JsonSchema;
    }) =>
      POST<ExecuteResult>(ENDPOINTS.functions.previewPython, {
        code: data.code ?? "",
        function_name: data.function_name ?? "",
        entry: data.entry ?? "main",
        parameters: data.parameters ?? {},
        parameters_schema: data.parameters_schema ?? {},
      }),
  });
}

/** Previsualiza normalización + resolución de nombres→IDs sin ejecutar la skill. */
export function useResolveIds() {
  return useMutation({
    mutationFn: ({ id, parameters }: { id: string; parameters?: Record<string, unknown> }) =>
      POST<{ parameters: Record<string, unknown>; resolved: boolean; error: string | null }>(
        ENDPOINTS.functions.resolveIds(id),
        { parameters: parameters ?? {} },
      ),
  });
}

export function useFunctionExecutionLogs(options?: {
  agentFunctionId?: string;
  enabled?: boolean;
}) {
  const branchId = useActiveBranchId();
  const agentFunctionId = options?.agentFunctionId;
  return useQuery({
    queryKey: [...LOGS_KEY, branchId, agentFunctionId ?? "all"],
    queryFn: () =>
      GET<FunctionExecutionLog[] | { count: number; results: FunctionExecutionLog[] }>(
        ENDPOINTS.functions.logs,
        agentFunctionId ? { params: { agent_function: agentFunctionId } } : undefined,
      ).then((data) => normalizeListResponse<FunctionExecutionLog>(data)),
    enabled: options?.enabled ?? true,
    staleTime: 30_000,
  });
}

export function useSkillStats(skillId: string | undefined) {
  const branchId = useActiveBranchId();
  return useQuery({
    queryKey: [...QUERY_KEY, "stats", branchId, skillId],
    queryFn: () => GET<SkillStats>(ENDPOINTS.functions.stats(skillId!)),
    enabled: !!skillId,
    staleTime: 30_000,
  });
}
