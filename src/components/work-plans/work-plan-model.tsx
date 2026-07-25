import type { WorkItem, WorkItemKind, WorkPlanStatus } from "@/api/hooks/useWorkPlans";
import { CheckCircle2, CircleDashed, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { parseJsonObject, prettyJson } from "@/lib/json";

export const ITEM_KIND_LABEL: Record<WorkItemKind, string> = {
  agent_turn: "Turno de agente",
  workflow: "Workflow",
  function: "Skill",
  note: "Nota",
};

export const ITEM_KIND_HINT: Record<WorkItemKind, string> = {
  agent_turn: "El agente recibe un mensaje y puede usar sus skills.",
  workflow: "Dispara un workflow de la sucursal (por id o nombre).",
  function: "Ejecuta una skill/función por slug con parámetros JSON.",
  note: "Solo deja una nota en el plan; no llama al modelo.",
};

export const BUCKETS = [
  {
    id: "inbox",
    label: "Bandeja",
    match: (s: WorkPlanStatus) => s === "draft" || s === "scheduled" || s === "running",
  },
  { id: "done", label: "Hechos", match: (s: WorkPlanStatus) => s === "completed" },
  {
    id: "failed",
    label: "Con error",
    match: (s: WorkPlanStatus) => s === "failed" || s === "cancelled",
  },
] as const;

export type BucketId = (typeof BUCKETS)[number]["id"];

export type DraftItem = {
  key: string;
  title: string;
  kind: WorkItemKind;
  message: string;
  functionSlug: string;
  parametersJson: string;
  workflowId: string;
  workflowName: string;
  noteText: string;
};

export function ItemStatusIcon({ status }: { status?: string }) {
  if (status === "running") return <Loader2 className="h-3.5 w-3.5 animate-spin text-info" />;
  if (status === "done" || status === "completed")
    return <CheckCircle2 className="h-3.5 w-3.5 text-success" />;
  if (status === "failed") return <XCircle className="h-3.5 w-3.5 text-destructive" />;
  return <CircleDashed className="h-3.5 w-3.5 text-muted-foreground" />;
}

export function payloadFromDraft(item: DraftItem): Record<string, unknown> | null {
  if (item.kind === "agent_turn") {
    return { message: item.message.trim() || item.title };
  }
  if (item.kind === "note") {
    return { text: item.noteText.trim() || item.title };
  }
  if (item.kind === "function") {
    if (!item.functionSlug.trim()) {
      toast.error("La skill necesita un function_slug");
      return null;
    }
    const parsed = parseJsonObject(item.parametersJson || "{}", "Parámetros");
    if (!parsed.ok) {
      toast.error(parsed.error);
      return null;
    }
    return { function_slug: item.functionSlug.trim(), parameters: parsed.value };
  }
  if (item.kind === "workflow") {
    if (!item.workflowId.trim() && !item.workflowName.trim()) {
      toast.error("El ítem workflow necesita workflow_id o nombre");
      return null;
    }
    const payload: Record<string, unknown> = {};
    if (item.workflowId.trim()) payload.workflow_id = item.workflowId.trim();
    if (item.workflowName.trim()) payload.workflow_name = item.workflowName.trim();
    return payload;
  }
  return {};
}

export function draftFromPayload(
  kind: WorkItemKind,
  payload?: Record<string, unknown> | null,
): Omit<DraftItem, "key" | "title" | "kind"> {
  const p = payload && typeof payload === "object" ? payload : {};
  return {
    message: typeof p.message === "string" ? p.message : "",
    functionSlug: typeof p.function_slug === "string" ? p.function_slug : "",
    parametersJson: prettyJson(p.parameters ?? {}) || "{}",
    workflowId: typeof p.workflow_id === "string" ? p.workflow_id : "",
    workflowName: typeof p.workflow_name === "string" ? p.workflow_name : "",
    noteText: typeof p.text === "string" ? p.text : "",
  };
}

export function extractToolCalls(result: Record<string, unknown> | null): Array<{
  name: string;
  detail: string;
}> {
  if (!result) return [];
  const raw = result.tool_calls;
  if (!Array.isArray(raw)) return [];
  return raw.map((tc, i) => {
    if (tc && typeof tc === "object") {
      const o = tc as Record<string, unknown>;
      const fn =
        o.function && typeof o.function === "object"
          ? (o.function as Record<string, unknown>)
          : null;
      const name =
        (typeof o.name === "string" && o.name) ||
        (typeof o.tool === "string" && o.tool) ||
        (typeof fn?.name === "string" && fn.name) ||
        (typeof o.function === "string" && o.function) ||
        `tool_${i + 1}`;
      let args: unknown = o.arguments ?? o.args ?? o.input ?? o.result ?? o.output;
      if (args == null && fn) args = fn.arguments ?? fn.args ?? fn;
      if (typeof args === "string") {
        try {
          args = JSON.parse(args);
        } catch {
          /* keep string */
        }
      }
      return { name, detail: prettyJson(args ?? o) };
    }
    return { name: `tool_${i + 1}`, detail: prettyJson(tc) };
  });
}

export type ResultView = {
  replyText: string;
  hasResult: boolean;
  nodes: Array<{
    node: string;
    node_type?: string;
    status?: string;
    output?: unknown;
    error?: string;
  }>;
  metaJson: string;
  executionId?: string;
  workflowStatus?: string;
};

export function extractResultView(item: WorkItem): ResultView {
  const resultObj =
    item.result && typeof item.result === "object"
      ? (item.result as Record<string, unknown>)
      : null;

  let replyText = "";
  if (resultObj) {
    for (const key of [
      "content",
      "response_text",
      "response",
      "note",
      "summary",
      "message",
      "text",
    ]) {
      const v = resultObj[key];
      if (typeof v === "string" && v.trim()) {
        replyText = v;
        break;
      }
    }
    if (!replyText && resultObj.result != null) {
      replyText =
        typeof resultObj.result === "string" ? resultObj.result : prettyJson(resultObj.result);
    }
    if (!replyText && resultObj.value != null) {
      replyText =
        typeof resultObj.value === "string" ? resultObj.value : prettyJson(resultObj.value);
    }
  }

  const nodesRaw = Array.isArray(resultObj?.nodes) ? resultObj!.nodes : [];
  const nodes = nodesRaw
    .filter((n): n is Record<string, unknown> => !!n && typeof n === "object")
    .map((n) => ({
      node: typeof n.node === "string" ? n.node : "Nodo",
      node_type: typeof n.node_type === "string" ? n.node_type : undefined,
      status: typeof n.status === "string" ? n.status : undefined,
      output: n.output,
      error: typeof n.error === "string" ? n.error : undefined,
    }));

  const skipKeys = new Set([
    "content",
    "note",
    "response",
    "response_text",
    "summary",
    "message",
    "text",
    "tool_calls",
    "nodes",
    "ok",
  ]);
  const meta =
    resultObj && Object.fromEntries(Object.entries(resultObj).filter(([k]) => !skipKeys.has(k)));
  const metaJson = meta && Object.keys(meta).length ? prettyJson(meta) : "";

  const executionId =
    (typeof resultObj?.execution_id === "string" && resultObj.execution_id) ||
    (typeof item.workflow_execution === "string" ? item.workflow_execution : undefined);

  return {
    replyText,
    hasResult:
      item.status === "done" ||
      item.status === "failed" ||
      Boolean(item.error_message?.trim()) ||
      Boolean(item.workflow_execution) ||
      (resultObj != null && Object.keys(resultObj).length > 0),
    nodes,
    metaJson,
    executionId,
    workflowStatus: typeof resultObj?.status === "string" ? resultObj.status : undefined,
  };
}

export function itemPreview(item: WorkItem): string {
  const view = extractResultView(item);
  if (item.error_message) return item.error_message;
  if (view.replyText) return view.replyText;
  if (view.workflowStatus) return `Workflow: ${view.workflowStatus}`;
  if (item.status === "done") return "Completado (sin texto de respuesta)";
  return "";
}

export function insumoPreview(item: WorkItem): string {
  const p = item.payload && typeof item.payload === "object" ? item.payload : {};
  if (item.kind === "agent_turn") {
    const msg = typeof p.message === "string" ? p.message : item.title;
    return msg.trim();
  }
  if (item.kind === "note") {
    const text = typeof p.text === "string" ? p.text : item.title;
    return text.trim();
  }
  if (item.kind === "function") {
    const slug = typeof p.function_slug === "string" ? p.function_slug : "";
    return slug ? `skill · ${slug}` : "Skill sin slug";
  }
  if (item.kind === "workflow") {
    const name =
      (typeof p.workflow_name === "string" && p.workflow_name) ||
      (typeof p.workflow_id === "string" && p.workflow_id.slice(0, 8)) ||
      "";
    return name ? `workflow · ${name}` : "Workflow";
  }
  return "";
}

export function newDraftItem(partial?: Partial<DraftItem>): DraftItem {
  return {
    key: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: "",
    kind: "agent_turn",
    message: "",
    functionSlug: "",
    parametersJson: "{}",
    workflowId: "",
    workflowName: "",
    noteText: "",
    ...partial,
  };
}

