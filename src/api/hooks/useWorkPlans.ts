import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DELETE, GET, PATCH, POST, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { isWorkPlanLiveStatus, POLL } from "@/lib/pollInterval";

export type WorkPlanStatus =
  | "draft"
  | "scheduled"
  | "running"
  | "completed"
  | "cancelled"
  | "failed";

export type WorkItemKind = "agent_turn" | "workflow" | "function" | "note";

export type WorkItemStatus =
  | "pending"
  | "queued"
  | "running"
  | "done"
  | "failed"
  | "skipped"
  | "cancelled";

export interface WorkItem {
  id: string;
  plan: string;
  title: string;
  kind: WorkItemKind;
  status: WorkItemStatus;
  sort_order: number;
  due_at?: string | null;
  assigned_agent?: number | string | null;
  payload?: Record<string, unknown>;
  result?: Record<string, unknown> | null;
  error_message?: string;
  attempts?: number;
  max_attempts?: number;
  started_at?: string | null;
  completed_at?: string | null;
  workflow_execution?: string | null;
  is_active?: boolean;
  created?: string;
  modified?: string;
}

export interface WorkPlan {
  id: string;
  name: string;
  description?: string;
  status: WorkPlanStatus;
  assigned_agent?: number | string | null;
  workflow?: string | null;
  scheduled_for?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  context?: Record<string, unknown>;
  created_by?: number | null;
  items?: WorkItem[];
  is_active?: boolean;
  created?: string;
  modified?: string;
}

export type CreateWorkPlanPayload = {
  name: string;
  description?: string;
  assigned_agent?: number | string | null;
  workflow?: string | null;
  scheduled_for?: string | null;
  context?: Record<string, unknown>;
  items?: Array<{
    title: string;
    kind?: WorkItemKind;
    payload?: Record<string, unknown>;
    sort_order?: number;
    assigned_agent?: number | string | null;
    max_attempts?: number;
  }>;
};

export type UpdateWorkPlanPayload = Partial<{
  name: string;
  description: string;
  status: WorkPlanStatus;
  assigned_agent: number | string | null;
  workflow: string | null;
  scheduled_for: string | null;
  context: Record<string, unknown>;
  is_active: boolean;
}>;

export type UpdateWorkItemPayload = Partial<{
  title: string;
  kind: WorkItemKind;
  status: WorkItemStatus;
  sort_order: number;
  due_at: string | null;
  assigned_agent: number | string | null;
  payload: Record<string, unknown>;
  max_attempts: number;
  error_message: string;
  is_active: boolean;
}>;

export type CreateWorkItemPayload = {
  plan: string;
  title: string;
  kind?: WorkItemKind;
  sort_order?: number;
  payload?: Record<string, unknown>;
  assigned_agent?: number | string | null;
  max_attempts?: number;
};

const KEY = "work-plans";

export type WorkPlanRunEnvelope = {
  ok?: boolean;
  steps?: number;
  results?: Array<{
    ok?: boolean;
    done?: boolean;
    item_id?: string;
    status?: string;
    error?: string;
    result?: unknown;
  }>;
  plan_status?: string;
  stop_on_error?: boolean;
};

function invalidatePlans(qc: ReturnType<typeof useQueryClient>, planId?: string) {
  qc.invalidateQueries({ queryKey: [KEY] });
  if (planId) qc.invalidateQueries({ queryKey: [KEY, planId] });
}

async function syncPlanAfterRun(
  qc: ReturnType<typeof useQueryClient>,
  data: { result?: WorkPlanRunEnvelope; plan?: WorkPlan } | undefined,
) {
  const planId = data?.plan?.id ? String(data.plan.id) : undefined;
  invalidatePlans(qc, planId);
  if (!planId) return;
  // Confiar en el GET fresco; no pisar con plan_status del POST (carrera con polling).
  await qc.refetchQueries({ queryKey: [KEY, planId] });
}

export function useWorkPlans(filters?: { status?: string }) {
  return useQuery({
    queryKey: [KEY, filters],
    queryFn: () =>
      GET<WorkPlan[] | { count: number; results: WorkPlan[] }>(ENDPOINTS.workPlans.list, {
        params: filters,
      }).then((data) => normalizeListResponse<WorkPlan>(data)),
    refetchInterval: (q) => {
      const list = q.state.data ?? [];
      const live = list.some((p) => isWorkPlanLiveStatus(p.status));
      return live ? POLL.live : POLL.idle;
    },
    refetchIntervalInBackground: false,
  });
}

export function useWorkPlan(id: string | undefined) {
  return useQuery({
    queryKey: [KEY, id],
    queryFn: () => GET<WorkPlan>(ENDPOINTS.workPlans.detail(id!)),
    enabled: !!id,
    refetchInterval: (q) =>
      isWorkPlanLiveStatus(q.state.data?.status) ? POLL.detailLive : POLL.detailIdle,
    refetchIntervalInBackground: false,
  });
}

export function useCreateWorkPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateWorkPlanPayload) =>
      POST<WorkPlan>(ENDPOINTS.workPlans.createWithItems, payload),
    onSuccess: () => invalidatePlans(qc),
  });
}

export function useUpdateWorkPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...patch }: UpdateWorkPlanPayload & { id: string }) =>
      PATCH<WorkPlan>(ENDPOINTS.workPlans.detail(id), patch),
    onSuccess: (data) => {
      invalidatePlans(qc, data.id);
      if (data?.id) qc.setQueryData([KEY, data.id], data);
    },
  });
}

export function useCreateWorkItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateWorkItemPayload) =>
      POST<WorkItem>(ENDPOINTS.workItems.list, payload),
    onSuccess: (data) => invalidatePlans(qc, data.plan),
  });
}

export function useUpdateWorkItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...patch }: UpdateWorkItemPayload & { id: string }) =>
      PATCH<WorkItem>(ENDPOINTS.workItems.detail(id), patch),
    onSuccess: (data) => invalidatePlans(qc, data.plan),
  });
}

export function useDeleteWorkItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; planId?: string }) => DELETE(ENDPOINTS.workItems.detail(id)),
    onSuccess: (_d, vars) => invalidatePlans(qc, vars.planId),
  });
}

export function useRunNextWorkPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      POST<{ result: WorkPlanRunEnvelope; plan: WorkPlan }>(ENDPOINTS.workPlans.runNext(id)),
    onSuccess: async (data) => {
      await syncPlanAfterRun(qc, data);
    },
  });
}

export function useRunAllWorkPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, stopOnError }: { id: string; stopOnError?: boolean }) =>
      POST<{ result: WorkPlanRunEnvelope; plan: WorkPlan }>(ENDPOINTS.workPlans.runAll(id), {
        max_steps: 50,
        stop_on_error: stopOnError ?? false,
      }),
    onSuccess: async (data) => {
      await syncPlanAfterRun(qc, data);
    },
  });
}

export function useDeleteWorkPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => DELETE(ENDPOINTS.workPlans.detail(id)),
    onSuccess: () => invalidatePlans(qc),
  });
}

export function useRunWorkItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      POST<{ result: unknown; item: WorkItem }>(ENDPOINTS.workItems.run(id)),
    onSuccess: async (data) => {
      const planId = data.item?.plan ? String(data.item.plan) : undefined;
      invalidatePlans(qc, planId);
      if (planId) await qc.refetchQueries({ queryKey: [KEY, planId] });
    },
  });
}

/** Reset a pending + ejecutar (action retry del back, con fallback PATCH+run). */
export function useRetryWorkItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await POST<{ result: unknown; item: WorkItem }>(ENDPOINTS.workItems.retry(id));
      } catch {
        await PATCH(ENDPOINTS.workItems.detail(id), {
          status: "pending",
          error_message: "",
        });
        return POST<{ result: unknown; item: WorkItem }>(ENDPOINTS.workItems.run(id));
      }
    },
    onSuccess: async (data) => {
      const planId = data.item?.plan ? String(data.item.plan) : undefined;
      invalidatePlans(qc, planId);
      if (planId) await qc.refetchQueries({ queryKey: [KEY, planId] });
    },
  });
}
