import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isExecutionLive } from "@/lib/workflowGraph";
import { DELETE, GET, PATCH, POST, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";

export type WorkflowNodeType =
  | "trigger"
  | "action"
  | "condition"
  | "delay"
  | "llm"
  | "agent"
  | "api_call"
  | "external_api"
  | "function"
  | "webhook"
  | "message"
  | "database";

export interface WorkflowNode {
  id: string;
  workflow?: string;
  node_type: WorkflowNodeType;
  node_key: string;
  name: string;
  description?: string;
  config?: Record<string, unknown>;
  position_x?: number;
  position_y?: number;
  is_active?: boolean;
}

export interface WorkflowEdge {
  id: string;
  workflow?: string;
  from_node?: string;
  to_node?: string;
  from_node_key?: string;
  to_node_key?: string;
  condition_label?: string;
  is_active?: boolean;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  trigger_type?: string;
  trigger_config?: Record<string, unknown>;
  status?: string;
  is_active?: boolean;
  version?: number;
  last_executed_at?: string | null;
  execution_count?: number;
  success_count?: number;
  failure_count?: number;
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
  branch?: number;
  created?: string;
  modified?: string;
}

export interface WorkflowExecutionLog {
  id: string;
  execution?: string;
  node?: string;
  node_name?: string;
  node_type?: string;
  status?: string;
  input_data?: Record<string, unknown>;
  output_data?: Record<string, unknown>;
  error_message?: string;
  duration_ms?: number | null;
  started_at?: string | null;
  completed_at?: string | null;
}

export interface WorkflowExecution {
  id: string;
  workflow?: string;
  workflow_name?: string;
  status?: string;
  trigger_type?: string;
  context?: Record<string, unknown>;
  started_at?: string | null;
  completed_at?: string | null;
  error_message?: string;
  total_nodes?: number;
  completed_nodes?: number;
  failed_nodes?: number;
  duration_ms?: number | null;
  logs?: WorkflowExecutionLog[];
  created?: string;
}

const KEY = "workflows";

export function useWorkflows() {
  return useQuery({
    queryKey: [KEY],
    queryFn: () =>
      GET<Workflow[] | { count: number; results: Workflow[] }>(ENDPOINTS.workflows.list).then(
        (data) => normalizeListResponse<Workflow>(data),
      ),
  });
}

export function useWorkflow(id: string | undefined) {
  return useQuery({
    queryKey: [KEY, id],
    queryFn: () => GET<Workflow>(ENDPOINTS.workflows.detail(id!)),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useCreateWorkflow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Workflow>) => POST<Workflow>(ENDPOINTS.workflows.list, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateWorkflow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...patch }: Partial<Workflow> & { id: string }) =>
      PATCH<Workflow>(ENDPOINTS.workflows.detail(id), patch),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: [KEY, data.id] });
      qc.invalidateQueries({ queryKey: [KEY] });
    },
  });
}

/** DELETE REST del detalle; el backend puede responder 405 si aún no expone destroy. */
export function useDeleteWorkflow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => DELETE(ENDPOINTS.workflows.detail(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export type WorkflowTriggerTypeOption = {
  value: string;
  label: string;
  supported?: boolean;
  production_ready?: boolean;
  notes?: string | null;
};

export function useWorkflowTriggerTypes() {
  return useQuery({
    queryKey: [KEY, "trigger-types"],
    queryFn: () =>
      GET<WorkflowTriggerTypeOption[] | { count: number; results: WorkflowTriggerTypeOption[] }>(
        ENDPOINTS.workflows.triggerTypes,
      ).then((data) => normalizeListResponse<WorkflowTriggerTypeOption>(data)),
    staleTime: 10 * 60 * 1000,
  });
}

export function useExecuteWorkflow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, context }: { id: string; context?: Record<string, unknown> }) =>
      POST(ENDPOINTS.workflows.execute(id), { context: context ?? {} }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [KEY] });
      qc.invalidateQueries({ queryKey: ["workflow-executions"] });
    },
  });
}

export function useActivateWorkflow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => POST(ENDPOINTS.workflows.activate(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeactivateWorkflow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => POST(ENDPOINTS.workflows.deactivate(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useCreateWorkflowNode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<WorkflowNode> & { workflow: string }) =>
      POST<WorkflowNode>(ENDPOINTS.workflowNodes.list, payload),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: [KEY, vars.workflow] });
      qc.invalidateQueries({ queryKey: [KEY] });
    },
  });
}

export function useUpdateWorkflowNode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...patch }: Partial<WorkflowNode> & { id: string }) =>
      PATCH<WorkflowNode>(ENDPOINTS.workflowNodes.detail(id), patch),
    onSuccess: (data) => {
      if (data.workflow) {
        qc.invalidateQueries({ queryKey: [KEY, data.workflow] });
      }
      qc.invalidateQueries({ queryKey: [KEY] });
    },
  });
}

export function useDeleteWorkflowNode() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; workflow: string }) =>
      DELETE(ENDPOINTS.workflowNodes.detail(id)),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: [KEY, vars.workflow] });
      qc.invalidateQueries({ queryKey: [KEY] });
    },
    onError: (_err, vars) => {
      // Si ya estaba soft-deleted / ausente, igual refrescamos el grafo
      qc.invalidateQueries({ queryKey: [KEY, vars.workflow] });
      qc.invalidateQueries({ queryKey: [KEY] });
    },
  });
}

export function useCreateWorkflowEdge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      workflow: string;
      from_node: string;
      to_node: string;
      condition_label?: string;
    }) => POST<WorkflowEdge>(ENDPOINTS.workflowEdges.list, payload),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: [KEY, vars.workflow] });
      qc.invalidateQueries({ queryKey: [KEY] });
    },
  });
}

export function useDeleteWorkflowEdge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; workflow: string }) =>
      DELETE(ENDPOINTS.workflowEdges.detail(id)),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: [KEY, vars.workflow] });
      qc.invalidateQueries({ queryKey: [KEY] });
    },
  });
}

export function useWorkflowExecutions(workflowId?: string) {
  return useQuery({
    queryKey: ["workflow-executions", workflowId],
    queryFn: () =>
      GET<WorkflowExecution[] | { count: number; results: WorkflowExecution[] }>(
        ENDPOINTS.workflowExecutions.list,
        { params: workflowId ? { workflow: workflowId } : undefined },
      ).then((data) => normalizeListResponse<WorkflowExecution>(data)),
    enabled: !!workflowId,
    // Sin polling: el detalle (`useWorkflowExecution`) es la fuente viva.
  });
}

export function useWorkflowExecution(id: string | undefined) {
  return useQuery({
    queryKey: ["workflow-executions", "detail", id],
    queryFn: () => GET<WorkflowExecution>(ENDPOINTS.workflowExecutions.detail(id!)),
    enabled: !!id,
    refetchInterval: (q) => (isExecutionLive(q.state.data?.status) ? 2500 : false),
    refetchIntervalInBackground: false,
  });
}
