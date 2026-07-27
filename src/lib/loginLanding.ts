/**
 * Copy de la landing Muninn (solo login base / isAppDefault).
 * Español de Chile (tuteo).
 * Narrativa: compañero primero → harness/plataforma después.
 */

/** Subtítulo bajo el wordmark. */
export const LOGIN_BRAND_SUBTITLE = "Tu agente de IA, operable y transparente";

export const LOGIN_LANDING_TAGLINE = "Diseña, opera y supervisa tu agente — con claridad total";

export const LOGIN_LANDING_LEAD =
  "Muninn es la plataforma donde creas y controlas tu agente de IA. Sin cajas negras: ves su alma, sus reglas, sus herramientas y cada decisión que toma.";

/**
 * Qué es un harness — alineado con la definición de industria
 * (runtime que rodea al modelo: tools, memoria, guardrails).
 * Ref: Databricks — What is an AI Agent Harness?
 */
export const LOGIN_HARNESS_BLURB =
  "Un harness es la infraestructura alrededor del modelo: tools, memoria, políticas y ejecución. El LLM decide; el harness hace que eso ocurra de forma operable.";

/** Plataforma Muninn (app Django) — aterrizaje técnico. */
export const LOGIN_PLATFORM_BLURB =
  "La plataforma donde diseñas tu agente: su personalidad, reglas, herramientas, conocimiento y automatizaciones. Todo versionado, todo visible.";

export const LOGIN_HARNESS_REF = {
  label: "Databricks · What is an AI Agent Harness?",
  href: "https://www.databricks.com/blog/ai-harness",
} as const;

export const LOGIN_LANDING_CTA = "Cotizar";

export const LOGIN_LANDING_DEMO_LABEL = "Cómo se prepara un agente";

/** Qué es Muninn — propuesta de valor central. */
export const LOGIN_AGENT_BEATS = [
  {
    id: "what",
    title: "Una plataforma, no un chatbot",
    line: "Muninn no es un chat más. Es un entorno donde diseñas, operas y supervisas un agente de IA con personalidad, reglas, herramientas y memoria propias.",
  },
  {
    id: "problem",
    title: "El problema que resuelve",
    line: "Hoy los agentes son cajas negras: no sabes por qué responden lo que responden. Muninn te da visibilidad total de cada decisión, cada fuente y cada acción.",
  },
  {
    id: "resolve",
    title: "Lo que puedes hacer hoy",
    line: "Crea un agente que entienda tu negocio, actúe con criterio y deje traza de todo lo que hace. Todo desde una interfaz operable, sin misterios.",
  },
] as const;

export type LoginLandingModuleId = "soul" | "rules" | "helpers" | "rag" | "model" | "cron";

export type LoginLandingModule = {
  id: LoginLandingModuleId;
  title: string;
  /** Explicación corta en lenguaje de usuario (Chile). */
  line: string;
};

/** Piezas del harness — títulos + qué es cada una, para cualquiera. */
export const LOGIN_LANDING_MODULES: LoginLandingModule[] = [
  {
    id: "soul",
    title: "Soul",
    line: "Quién es tu agente: tono, personalidad y límites.",
  },
  {
    id: "rules",
    title: "Reglas",
    line: "Qué puede hacer, qué te pide antes y en qué orden.",
  },
  {
    id: "helpers",
    title: "Helpers",
    line: "Sus herramientas: buscar, crear tickets, llamar APIs…",
  },
  {
    id: "rag",
    title: "RAG",
    line: "Lee tus documentos y responde con lo que encuentre ahí.",
  },
  {
    id: "model",
    title: "Modelo",
    line: "El cerebro de IA que razona y escribe las respuestas.",
  },
  {
    id: "cron",
    title: "Cron",
    line: "Lo programa para que corra solo, sin que nadie chatee.",
  },
];

/**
 * Átomos del harness — explicación comercial + técnica por pieza.
 * Usado en la sección #atomos de la landing (una sección por átomo).
 */
export type LoginAtomDetail = LoginLandingModule & {
  role: string;
  /** Por qué importa en la operación diaria. */
  why: string;
  example: string;
  tech: string;
};

export const LOGIN_ATOMS: LoginAtomDetail[] = [
  {
    id: "soul",
    title: "Soul",
    line: "Quién es tu agente: tono, personalidad y límites.",
    role: "Identidad",
    why: "Sin soul, el agente suena genérico. Con soul, habla como tu marca y respeta fronteras.",
    example: "«Eres claro, breve y en español de Chile. No inventes políticas.»",
    tech: "System prompt versionado (SOUL.md). Define voz y frontera ética.",
  },
  {
    id: "rules",
    title: "Reglas",
    line: "Qué puede hacer, qué te pide antes y en qué orden.",
    role: "Gobierno",
    why: "Las reglas evitan sorpresas: confirman antes de actuar y ordenan el flujo.",
    example: "Antes de crear un ticket → pedir confirmación. Si falta el tema → preguntar.",
    tech: "Flow policy / guardrails. Orden de skills y puntos de intervención humana.",
  },
  {
    id: "helpers",
    title: "Helpers",
    line: "Sus herramientas: buscar, crear tickets, llamar APIs…",
    role: "Acción",
    why: "El modelo propone; los helpers ejecutan en sistemas reales (tickets, APIs, búsqueda).",
    example: "rag.buscar · ticket.crear · calendario.consultar",
    tech: "Skills conectadas a APIs reales. El modelo elige; el harness ejecuta.",
  },
  {
    id: "rag",
    title: "RAG",
    line: "Lee tus documentos y responde con lo que encuentre ahí.",
    role: "Fundamento",
    why: "Respuestas con tu conocimiento, no con inventos. Cita fuente cuando importa.",
    example: "«Según Políticas RR.HH.: 15 días hábiles al año.»",
    tech: "Chunks indexados + recuperación por similitud. Cita fuente, no inventa.",
  },
  {
    id: "model",
    title: "Modelo",
    line: "El cerebro de IA que razona y escribe las respuestas.",
    role: "Razonamiento",
    why: "Eliges costo, latencia y proveedor; el harness lo rodea con contexto operable.",
    example: "Elige LLM por costo/latencia; el harness lo rodea con contexto.",
    tech: "Proveedor intercambiable. Observabilidad de tokens y traza.",
  },
  {
    id: "cron",
    title: "Cron",
    line: "Lo programa para que corra solo, sin que nadie chatee.",
    role: "Automatización",
    why: "El mismo agente trabaja de noche: resúmenes, chequeos y tareas recurrentes.",
    example: "lun–vie 09:00 → resumen diario RR.HH.",
    tech: "Triggers programados. Mismo harness, sin mensaje de usuario.",
  },
];

/** Nav de secciones de la landing Muninn. `route` = página aparte (auth). */
export const LOGIN_LANDING_NAV = [
  { id: "hero", label: "Inicio", href: "#hero" },
  { id: "agente", label: "Agente", href: "#agente" },
  { id: "tecnico", label: "Técnico", href: "#tecnico" },
  { id: "live", label: "En vivo", href: "#live" },
  { id: "docs", label: "Docs", href: "#docs" },
  { id: "entrar", label: "Entrar", href: "/entrar" },
] as const;

/** Título de la grilla bajo el form de login. */
export const LOGIN_HARNESS_PARTS_LABEL = "Piezas del harness";

export const LOGIN_LANDING_SEE_LIVE = "Ver cómo opera";
export const LOGIN_LANDING_TRY_LIVE = "Probar en vivo";

/** Bloques de valor comercial (docs / cierre). */
export const LOGIN_VALUE_BLOCKS = [
  {
    id: "clarity",
    title: "Claridad total",
    line: "Ves el alma, las reglas, las herramientas y cada decisión del agente. Cero caja negra.",
  },
  {
    id: "control",
    title: "Control real",
    line: "El agente propone; tú apruebas. Políticas, confirmaciones y límites a tu medida.",
  },
  {
    id: "knowledge",
    title: "Tu conocimiento, automatizado",
    line: "Conecta tus documentos y activa tareas recurrentes. El agente trabaja con tu información, no con inventos.",
  },
  {
    id: "api",
    title: "API — Próximamente",
    line: "Pronto podrás gestionar tu agente vía API: crear, configurar y monitorear el servicio desde tu propio código.",
  },
] as const;

/** Pasos “cómo se opera” (docs). */
export const LOGIN_OPERATE_STEPS = [
  {
    n: "01",
    title: "Diseña el agente",
    line: "Define su personalidad y reglas: quién es y qué puede hacer.",
  },
  {
    n: "02",
    title: "Conecta conocimiento y herramientas",
    line: "Sube documentos (RAG) y vincula APIs, tickets o búsqueda.",
  },
  {
    n: "03",
    title: "Define las políticas",
    line: "Configura confirmaciones, orden de acciones y límites.",
  },
  {
    n: "04",
    title: "Opéralo",
    line: "Chat humano o tareas programadas. Cada acción queda registrada.",
  },
] as const;

/**
 * Journey del demo: preparación del agente → RAG → cron → impacto.
 * Intervalo sugerido entre pasos (ms).
 */
export const LOGIN_DEMO_STEP_MS = 9000;

export const LOGIN_DEMO_STAGES = ["Soul", "Rules", "Helpers", "RAG", "Cron", "Impacto"] as const;

export type LoginDemoStageId = (typeof LOGIN_DEMO_STAGES)[number];

/** Respuestas del sandbox en vivo (scripted, sin backend). */
export type LiveSandboxReply = {
  match: RegExp;
  stageHint?: LoginDemoStageId;
  think: string;
  agent: string;
  system?: string;
};

export const LOGIN_LIVE_REPLIES: LiveSandboxReply[] = [
  {
    match: /pol[ií]tica|vacacion|rr\.?\s*hh|permiso/i,
    stageHint: "RAG",
    think: "Pregunta de política interna → RAG sobre documentos, no inventar.",
    system: "RAG · 2 chunks · Políticas RR.HH.",
    agent: "Según la política indexada: 15 días hábiles al año. Si quieres, abro un ticket formal.",
  },
  {
    match: /ticket|abrir|crear\s*caso|incidente/i,
    stageHint: "Helpers",
    think: "Skill de escritura → pedir confirmación (rules).",
    system: "ticket.crear · pendiente de confirmación",
    agent: "Puedo crear el ticket ahora. ¿Confirmas? (En producción pediría un sí explícito.)",
  },
  {
    match: /cron|program|agenda|diario|automati/i,
    stageHint: "Cron",
    think: "Quiere automatización → cronjobs / workflows programados.",
    system: "Cron · lun–vie 09:00",
    agent:
      "Puedo dejar un resumen diario a las 09:00. El harness dispara el flujo sin que nadie chatee.",
  },
  {
    match: /soul|personalidad|tono|qui[eé]n eres/i,
    stageHint: "Soul",
    think: "Pregunta de identidad → SOUL.md.",
    agent:
      "Soy el asistente interno: claro, breve, en español de Chile. No invento políticas; busco o pregunto.",
  },
  {
    match: /regla|rule|l[ií]mite|confirm/i,
    stageHint: "Rules",
    think: "Flow policy / guardrails.",
    agent:
      "Antes de skills de escritura pido confirmación. Si falta contexto, pregunto. Eso son las rules.",
  },
];

export const LOGIN_LIVE_DEFAULT_REPLY: Omit<LiveSandboxReply, "match"> = {
  think: "Intención general → explicar el harness con claridad.",
  agent:
    "En Muninn diseñas el agente (soul + rules), le das helpers y RAG, y lo operas en chat o por cron. Prueba preguntar por “vacaciones”, “ticket” o “cron”.",
};

export function resolveLiveSandboxReply(input: string): Omit<LiveSandboxReply, "match"> {
  const hit = LOGIN_LIVE_REPLIES.find((r) => r.match.test(input));
  if (!hit) return LOGIN_LIVE_DEFAULT_REPLY;
  return { think: hit.think, agent: hit.agent, system: hit.system, stageHint: hit.stageHint };
}

export type LoginDemoMessage = {
  role: "user" | "agent" | "system" | "think";
  text: string;
};

export type LoginDemoNodeKind =
  | "soul"
  | "rules"
  | "skill"
  | "knowledge"
  | "cron"
  | "agent"
  | "result";

export type LoginDemoStep = {
  stage: LoginDemoStageId;
  title: string;
  detail: string;
  nodes: Array<{ id: string; label: string; kind: LoginDemoNodeKind }>;
  messages: LoginDemoMessage[];
};

/**
 * Ejemplo real: «Revisar mis pendientes de hoy».
 * Cada etapa muestra qué componente del agente participa y cómo.
 */
export const LOGIN_DEMO_STEPS: LoginDemoStep[] = [
  {
    stage: "Soul",
    title: "① Soul — entiende el contexto",
    detail:
      "El agente lee su SOUL.md para saber quién es, cómo tratar al usuario y qué límites tiene.",
    nodes: [
      { id: "a1", label: "Agente Muninn", kind: "agent" },
      { id: "soul", label: "SOUL.md", kind: "soul" },
    ],
    messages: [
      { role: "system", text: "SOUL.md cargado · «asistente amable, eficiente, español de Chile»" },
      { role: "user", text: "Revisa mis pendientes de hoy" },
      {
        role: "think",
        text: "Soul: usuario pide pendientes → tono cordial pero directo. No inventar tareas si no hay datos.",
      },
      {
        role: "agent",
        text: "¡Hola! Voy a revisar tus pendientes del día. Dame un momento mientras consulto tus sistemas.",
      },
    ],
  },
  {
    stage: "Rules",
    title: "② Rules — ordena el flujo",
    detail:
      "Las reglas definen qué skills puede usar, en qué orden, y cuándo pedir confirmación al usuario.",
    nodes: [
      { id: "a1", label: "Agente Muninn", kind: "agent" },
      { id: "soul", label: "SOUL.md", kind: "soul" },
      { id: "rules", label: "Rules", kind: "rules" },
    ],
    messages: [
      {
        role: "system",
        text: "Rules · flow policy: consultar tickets → agrupar por vencimiento → presentar sin ejecutar cambios",
      },
      { role: "user", text: "Revisa mis pendientes de hoy" },
      {
        role: "think",
        text: "Rules: no puede cerrar tickets sin confirmación. Flujo aprobado: solo lectura y resumen.",
      },
      {
        role: "agent",
        text: "Voy a revisar tus tickets activos. Solo lectura, sin hacer cambios.",
      },
    ],
  },
  {
    stage: "Helpers",
    title: "③ Helpers — ejecuta las herramientas",
    detail:
      "Helpers son habilidades conectadas a APIs reales: consultar tickets, buscar documentos, etc.",
    nodes: [
      { id: "a1", label: "Agente Muninn", kind: "agent" },
      { id: "soul", label: "SOUL.md", kind: "soul" },
      { id: "rules", label: "Rules", kind: "rules" },
      { id: "skill", label: "ticket.listar", kind: "skill" },
    ],
    messages: [
      { role: "system", text: "Helper · ticket.listar · consultando API de tickets…" },
      {
        role: "think",
        text: "Helpers: llamando a ticket.listar con filtro «hoy». El modelo espera la respuesta de la API.",
      },
      {
        role: "agent",
        text: "Encontré tus tickets abiertos. Ahora los reviso uno por uno para darte un resumen.",
      },
    ],
  },
  {
    stage: "RAG",
    title: "④ RAG — responde con conocimiento",
    detail:
      "RAG busca en documentos indexados para responder con datos reales, no con inventos del modelo.",
    nodes: [
      { id: "a1", label: "Agente Muninn", kind: "agent" },
      { id: "soul", label: "SOUL.md", kind: "soul" },
      { id: "rules", label: "Rules", kind: "rules" },
      { id: "skill", label: "ticket.listar", kind: "skill" },
      { id: "knowledge", label: "RAG", kind: "knowledge" },
    ],
    messages: [
      { role: "system", text: "RAG · 2 tickets vencen hoy · fuente: API tickets" },
      {
        role: "think",
        text: "RAG: datos recuperados del sistema de tickets. 4 pendientes total, 2 urgentes.",
      },
      {
        role: "agent",
        text: "Tienes 4 pendientes. 2 vencen hoy: ticket #1342 (soporte RR.HH.) y #1345 (revisión contrato). ¿Quieres que priorice alguno?",
      },
    ],
  },
  {
    stage: "Cron",
    title: "⑤ Cron — opera sin ti",
    detail:
      "El mismo agente se programa para ejecutarse en cron: resúmenes diarios, chequeos automáticos, sin esperar a que alguien chatee.",
    nodes: [
      { id: "a1", label: "Agente Muninn", kind: "agent" },
      { id: "soul", label: "SOUL.md", kind: "soul" },
      { id: "rules", label: "Rules", kind: "rules" },
      { id: "cron", label: "Cron 09:00", kind: "cron" },
      { id: "result", label: "Resumen diario", kind: "result" },
    ],
    messages: [
      { role: "system", text: "Cron · disparo lun–vie 09:00 · mismo harness, sin chat" },
      {
        role: "think",
        text: "Cron: al llegar las 09:00 el agente ejecuta el mismo flujo sin intervención humana.",
      },
      {
        role: "agent",
        text: "Resumen diario: 4 tickets pendientes, 2 vencen hoy. Sin acción urgente. Puedo dejar esto programado para cada mañana.",
      },
    ],
  },
  {
    stage: "Impacto",
    title: "⑥ Flujo completo — todos los componentes",
    detail:
      "Soul da identidad, rules ordenan, helpers ejecutan, RAG fundamenta, cron automatiza. Juntos resuelven sin que tú hagas nada.",
    nodes: [
      { id: "a1", label: "Agente Muninn", kind: "agent" },
      { id: "soul", label: "SOUL.md", kind: "soul" },
      { id: "rules", label: "Rules", kind: "rules" },
      { id: "skill", label: "Helpers", kind: "skill" },
      { id: "knowledge", label: "RAG", kind: "knowledge" },
      { id: "cron", label: "Cron", kind: "cron" },
      { id: "result", label: "Resuelto", kind: "result" },
    ],
    messages: [
      {
        role: "system",
        text: "Muninn opera igual en chat que por cron — mismo harness, mismo agente.",
      },
      {
        role: "agent",
        text: "Todo esto pasó por detrás: el alma definió mi tono, las reglas ordenaron el flujo, los helpers consultaron la API de tickets, RAG trajo los datos y cron lo programa para cada mañana. Ves cada paso, sin cajas negras.",
      },
    ],
  },
];
