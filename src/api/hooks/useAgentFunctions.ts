import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GET, POST, PATCH, DELETE, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { useActiveBranchId } from "@/hooks/useActiveBranchId";

const QUERY_KEY = ["ai-agents", "agent-functions"];
const LOGS_KEY = ["ai-agents", "function-execution-logs"];

export type ImplementationType = "api" | "db_query" | "python_code" | "webhook" | "formula";

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
  external_api?: string | null;
  external_api_name?: string | null;
  /** True si la app usa endpoint_auth: la skill usa la cuenta del owner. */
  uses_personal_connection?: boolean;
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
  created?: string;
  modified?: string;
}

export interface ExecuteResult {
  success?: boolean;
  result?: unknown;
  error?: string | null;
  [key: string]: unknown;
}

export function useAgentFunctions(options?: { includeInactive?: boolean }) {
  const branchId = useActiveBranchId();
  const includeInactive = options?.includeInactive ?? false;
  return useQuery({
    queryKey: [...QUERY_KEY, branchId, { includeInactive }],
    queryFn: () =>
      GET<AgentFunction[] | { count: number; results: AgentFunction[] }>(
        ENDPOINTS.functions.list,
        includeInactive ? { params: { include_inactive: "true" } } : undefined,
      ).then((data) => normalizeListResponse<AgentFunction>(data)),
    staleTime: 2 * 60 * 1000,
  });
}

export function useAgentFunction(id: string | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => GET<AgentFunction>(ENDPOINTS.functions.detail(id!)),
    enabled: !!id,
  });
}

export function useCreateAgentFunction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AgentFunction>) =>
      POST<AgentFunction>(ENDPOINTS.functions.list, data),
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

export function useDeleteAgentFunction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => DELETE(ENDPOINTS.functions.detail(id)),
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
