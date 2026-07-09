import { useQuery } from "@tanstack/react-query";
import { GET, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";

const QUERY_KEY = ["ai-agents", "agent-functions"];

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
