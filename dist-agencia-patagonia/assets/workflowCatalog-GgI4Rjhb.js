const n = [
    { value: "manual", label: "Manual", supported: !0 },
    { value: "cron", label: "Programado (Cron)", supported: !0 },
    { value: "webhook", label: "Webhook HTTP", supported: !0 },
    { value: "event", label: "Evento de Sistema", supported: !0 },
    { value: "campaign_recovery", label: "Campaña: Recuperación de pacientes", supported: !1 },
    { value: "campaign_reminder", label: "Campaña: Recordatorio de citas", supported: !1 },
    { value: "campaign_followup", label: "Campaña: Seguimiento post-tratamiento", supported: !1 },
    { value: "campaign_promotion", label: "Campaña: Promoción de tratamientos", supported: !1 },
    { value: "campaign_reactivation", label: "Campaña: Reactivación de pacientes", supported: !1 },
  ],
  r = [
    { value: "draft", label: "Borrador" },
    { value: "active", label: "Activo" },
    { value: "paused", label: "Pausado" },
    { value: "archived", label: "Archivado" },
  ];
function u(e) {
  return e ? r.find((a) => a.value === e)?.label || e : "—";
}
function d(e) {
  const a = (e || []).map((t) => ({ value: t.value, label: t.label || t.value, supported: !0 }));
  if (!a.length) return [...n];
  const l = new Set(a.map((t) => t.value)),
    o = n
      .filter((t) => !l.has(t.value))
      .map((t) => ({ value: t.value, label: t.label, supported: t.supported }));
  return [...a, ...o];
}
const i = [
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
function c(e) {
  return i.find((a) => a.type === e);
}
function s(e) {
  return c(e)?.label || e;
}
function p(e) {
  return e ? n.find((a) => a.value === e)?.label || e : "—";
}
function g(e, a) {
  const l = e
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `${a}-${l || "node"}-${Math.random().toString(36).slice(2, 6)}`;
}
export { r as W, p as a, u as b, i as c, s as d, d as r, g as s, c as w };
