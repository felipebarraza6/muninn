import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GET, POST, PATCH, DELETE, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";

const QUERY_KEY = ["ai-agents", "agent-functions"];
const LOGS_KEY = ["ai-agents", "function-execution-logs"];

export interface AgentFunctionConfig {
  endpoint_type?: string;
}

export interface AgentFunction {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  is_active: boolean;
  implementation_type?: "api" | "native" | "workflow";
  external_api?: string;
  external_api_name?: string;
  config?: AgentFunctionConfig;
  parameters_schema?: Record<string, unknown>;
  return_schema?: Record<string, unknown>;
  response_instructions?: string;
  created?: string;
  modified?: string;
}

export function useAgentFunctions() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () =>
      GET<AgentFunction[] | { count: number; results: AgentFunction[] }>(
        ENDPOINTS.functions.list,
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
    mutationFn: ({ id, args }: { id: string; args?: Record<string, unknown> }) =>
      POST<Record<string, unknown>>(ENDPOINTS.functions.execute(id), args ?? {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: LOGS_KEY }),
  });
}

export function useFunctionExecutionLogs() {
  return useQuery({
    queryKey: LOGS_KEY,
    queryFn: () =>
      GET<unknown[] | { results: unknown[] }>(ENDPOINTS.functions.logs).then((data) =>
        normalizeListResponse(data),
      ),
    staleTime: 30_000,
  });
}
