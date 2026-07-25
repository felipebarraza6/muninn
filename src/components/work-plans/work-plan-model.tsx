import type { WorkItem, WorkItemKind, WorkPlanStatus } from "@/api/hooks/useWorkPlans";
import {
  Bot,
  CheckCircle2,
  CircleDashed,
  Loader2,
  StickyNote,
  Workflow,
  XCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { parseJsonObject, prettyJson } from "@/lib/json";
import {
  extractResultArtifacts,
  humanFileKind,
  summarizeWorkResult,
} from "@/lib/workResultArtifacts";
import { cn } from "@/lib/utils";

export const ITEM_KIND_LABEL: Record<WorkItemKind, string> = {
  agent_turn: "Agente",
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

export type ItemKindMeta = {
  label: string;
  shortLabel: string;
  Icon: LucideIcon;
  /** Chip de kind */
  chip: string;
  /** Nodo del flujo (círculo) */
  node: string;
  /** Línea del eje cuando este paso está activo / done */
  rail: string;
  /** Panel del paso seleccionado */
  selectedBg: string;
  iconWrap: string;
};

/** Paleta por rol de paso (no “azul genérico de dashboard”). */
export const ITEM_KIND_META: Record<WorkItemKind, ItemKindMeta> = {
  function: {
    label: "Skill",
    shortLabel: "Skill",
    Icon: Zap,
    chip: "bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/35",
    node: "bg-[#f59e0b]/20 text-[#fbbf24] ring-1 ring-[#f59e0b]/45",
    rail: "bg-[#f59e0b]/55",
    selectedBg: "bg-[#f59e0b]/10 border-[#f59e0b]/40 shadow-[0_0_0_1px_rgba(245,158,11,0.12)]",
    iconWrap: "bg-[#f59e0b]/15 text-[#fbbf24]",
  },
  workflow: {
    label: "Workflow",
    shortLabel: "Flow",
    Icon: Workflow,
    chip: "bg-sky-500/15 text-sky-300 border-sky-400/35",
    node: "bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/45",
    rail: "bg-sky-400/55",
    selectedBg: "bg-sky-500/10 border-sky-400/40 shadow-[0_0_0_1px_rgba(56,189,248,0.12)]",
    iconWrap: "bg-sky-500/15 text-sky-300",
  },
  agent_turn: {
    label: "Agente",
    shortLabel: "Agente",
    Icon: Bot,
    chip: "bg-primary/15 text-primary border-primary/35",
    node: "bg-primary/20 text-primary ring-1 ring-primary/50",
    rail: "bg-primary/60",
    selectedBg: "bg-primary/10 border-primary/45 shadow-[0_0_24px_-12px_rgba(45,212,191,0.55)]",
    iconWrap: "bg-primary/15 text-primary",
  },
  note: {
    label: "Nota",
    shortLabel: "Nota",
    Icon: StickyNote,
    chip: "bg-stone-500/15 text-stone-300 border-stone-400/30",
    node: "bg-stone-500/20 text-stone-300 ring-1 ring-stone-400/35",
    rail: "bg-stone-400/40",
    selectedBg: "bg-stone-500/10 border-stone-400/35",
    iconWrap: "bg-stone-500/15 text-stone-300",
  },
};

export function kindMeta(kind: string | undefined): ItemKindMeta {
  if (kind && kind in ITEM_KIND_META) return ITEM_KIND_META[kind as WorkItemKind];
  return ITEM_KIND_META.note;
}

export function ItemKindChip({
  kind,
  className,
}: {
  kind: string | undefined;
  className?: string;
}) {
  const meta = kindMeta(kind);
  const Icon = meta.Icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium shrink-0",
        meta.chip,
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {meta.shortLabel}
    </span>
  );
}

export const BUCKETS = [
  {
    id: "inbox",
    label: "Pendientes",
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
  if (item.error_message) return item.error_message;
  const view = extractResultView(item);
  const summary = summarizeWorkResult(item.result, view.replyText);
  if (summary) return summary;
  if (view.workflowStatus) return `Workflow: ${view.workflowStatus}`;
  if (item.status === "done") return "Completado (sin texto de respuesta)";
  return "";
}

/** Chips cortos de archivos del resultado (Excel / PDF). */
export function itemArtifactChips(item: WorkItem): string[] {
  const view = extractResultView(item);
  const arts = extractResultArtifacts(item.result, view.replyText);
  const labels = arts
    .filter((a) => a.kind === "document" || a.kind === "url" || a.kind === "base64")
    .map((a) => humanFileKind(a.name, a.mime));
  return [...new Set(labels)].slice(0, 4);
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

