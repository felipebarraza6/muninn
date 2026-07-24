import type { WorkflowNodeType } from "@/api/hooks/useWorkflows";

/** Catálogo UI alineado al backend (Workflow.TRIGGER_TYPE_CHOICES + trigger service). */
export const WORKFLOW_TRIGGER_OPTIONS = [
  { value: "manual", label: "Manual", supported: true },
  { value: "cron", label: "Programado (Cron)", supported: true },
  { value: "webhook", label: "Webhook HTTP", supported: true },
  { value: "event", label: "Evento de Sistema", supported: true },
  {
    value: "campaign_recovery",
    label: "Campaña: Recuperación de pacientes",
    supported: false,
  },
  {
    value: "campaign_reminder",
    label: "Campaña: Recordatorio de citas",
    supported: false,
  },
  {
    value: "campaign_followup",
    label: "Campaña: Seguimiento post-tratamiento",
    supported: false,
  },
  {
    value: "campaign_promotion",
    label: "Campaña: Promoción de tratamientos",
    supported: false,
  },
  {
    value: "campaign_reactivation",
    label: "Campaña: Reactivación de pacientes",
    supported: false,
  },
] as const;

export const WORKFLOW_STATUS_OPTIONS = [
  { value: "draft", label: "Borrador" },
  { value: "active", label: "Activo" },
  { value: "paused", label: "Pausado" },
  { value: "archived", label: "Archivado" },
] as const;

export function workflowStatusLabel(value: string | undefined): string {
  if (!value) return "—";
  return WORKFLOW_STATUS_OPTIONS.find((s) => s.value === value)?.label || value;
}

/** Une opciones del catálogo con valores que lleguen del API. */
export function resolveTriggerOptions(
  apiTriggers?: Array<{ value: string; label?: string }> | null,
): Array<{ value: string; label: string; supported?: boolean }> {
  const fromApi = (apiTriggers || []).map((t) => ({
    value: t.value,
    label: t.label || t.value,
    supported: true as boolean | undefined,
  }));
  if (!fromApi.length) return [...WORKFLOW_TRIGGER_OPTIONS];
  const seen = new Set(fromApi.map((t) => t.value));
  const extras = WORKFLOW_TRIGGER_OPTIONS.filter((t) => !seen.has(t.value)).map((t) => ({
    value: t.value,
    label: t.label,
    supported: t.supported,
  }));
  return [...fromApi, ...extras];
}

export type WorkflowNodeCatalogItem = {
  type: WorkflowNodeType;
  label: string;
  hint: string;
  defaultName: string;
  defaultConfig: Record<string, unknown>;
  /** Clase Tailwind para acento del nodo (borde / glow). */
  accent: string;
  accentBg: string;
};

/** Tipos de nodo del sistema (WorkflowNode.NODE_TYPE_CHOICES). */
export const WORKFLOW_NODE_CATALOG: WorkflowNodeCatalogItem[] = [
  {
    type: "trigger",
    label: "Trigger",
    hint: "Punto de entrada del flujo",
    defaultName: "Inicio",
    defaultConfig: {},
    accent: "text-emerald-400",
    accentBg: "bg-emerald-500/15 border-emerald-500/35",
  },
  {
    type: "agent",
    label: "Agente",
    hint: "Studio tool-loop + RAG",
    defaultName: "Agente",
    defaultConfig: {
      message: "Ejecuta la tarea del contexto del workflow",
      max_iterations: 4,
      agent_slug: "",
    },
    accent: "text-teal-300",
    accentBg: "bg-teal-500/15 border-teal-500/35",
  },
  {
    type: "llm",
    label: "LLM",
    hint: "Chat / interpretación con modelo",
    defaultName: "Interpretar con IA",
    defaultConfig: { user_message: "", system_prompt: "", model_id: null, temperature: 0.7 },
    accent: "text-violet-300",
    accentBg: "bg-violet-500/15 border-violet-500/35",
  },
  {
    type: "function",
    label: "Función",
    hint: "Skill / tool del catálogo",
    defaultName: "Ejecutar función",
    defaultConfig: { function_id: "", parameters: {} },
    accent: "text-sky-300",
    accentBg: "bg-sky-500/15 border-sky-500/35",
  },
  {
    type: "action",
    label: "Acción",
    hint: "set_context / log / noop / fail",
    defaultName: "Acción",
    defaultConfig: { action_name: "noop" },
    accent: "text-amber-300",
    accentBg: "bg-amber-500/15 border-amber-500/35",
  },
  {
    type: "condition",
    label: "Condición",
    hint: "If / Else sobre el contexto",
    defaultName: "Condición",
    defaultConfig: { expression: "True" },
    accent: "text-orange-300",
    accentBg: "bg-orange-500/15 border-orange-500/35",
  },
  {
    type: "delay",
    label: "Retraso",
    hint: "Espera antes del siguiente paso",
    defaultName: "Esperar",
    defaultConfig: { delay_seconds: 60 },
    accent: "text-slate-300",
    accentBg: "bg-slate-500/15 border-slate-500/35",
  },
  {
    type: "api_call",
    label: "API call",
    hint: "HTTP libre",
    defaultName: "Llamada API",
    defaultConfig: { method: "GET", url: "" },
    accent: "text-cyan-300",
    accentBg: "bg-cyan-500/15 border-cyan-500/35",
  },
  {
    type: "external_api",
    label: "App externa",
    hint: "API del store configurada",
    defaultName: "App externa",
    defaultConfig: { external_api_id: "", endpoint_key: "", method: "GET" },
    accent: "text-indigo-300",
    accentBg: "bg-indigo-500/15 border-indigo-500/35",
  },
  {
    type: "webhook",
    label: "Webhook saliente",
    hint: "POST a URL externa",
    defaultName: "Webhook",
    defaultConfig: { url: "", method: "POST", payload: {} },
    accent: "text-fuchsia-300",
    accentBg: "bg-fuchsia-500/15 border-fuchsia-500/35",
  },
  {
    type: "message",
    label: "Mensaje",
    hint: "Enviar mensaje a canal/usuario",
    defaultName: "Enviar mensaje",
    defaultConfig: { message: "" },
    accent: "text-lime-300",
    accentBg: "bg-lime-500/15 border-lime-500/35",
  },
  {
    type: "database",
    label: "Base de datos",
    hint: "Consulta / escritura",
    defaultName: "Consulta DB",
    defaultConfig: { query_type: "orm", model: "", limit: 100 },
    accent: "text-rose-300",
    accentBg: "bg-rose-500/15 border-rose-500/35",
  },
];

export function workflowNodeMeta(type: string): WorkflowNodeCatalogItem | undefined {
  return WORKFLOW_NODE_CATALOG.find((n) => n.type === type);
}

export function workflowNodeLabel(type: string): string {
  return workflowNodeMeta(type)?.label || type;
}

export function workflowTriggerLabel(value: string | undefined): string {
  if (!value) return "—";
  return WORKFLOW_TRIGGER_OPTIONS.find((t) => t.value === value)?.label || value;
}

export function slugifyNodeKey(name: string, type: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `${type}-${base || "node"}-${Math.random().toString(36).slice(2, 6)}`;
}
