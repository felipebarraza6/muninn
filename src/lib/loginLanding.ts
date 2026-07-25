/**
 * Copy de la landing Muninn (solo login base / isAppDefault).
 * Español de Chile (tuteo).
 * Narrativa: compañero primero → harness/plataforma después.
 */

/** Subtítulo bajo el wordmark. */
export const LOGIN_BRAND_SUBTITLE = "Tu agente compañero";

export const LOGIN_LANDING_TAGLINE = "Muninn va contigo: opera agentes con claridad";

export const LOGIN_LANDING_LEAD =
  "Muninn es el agente que te acompaña todo el rato — y la app donde lo diseñas, orquestas y supervisas. Presencia primero; detrás, un harness operable.";

/**
 * Qué es un harness — alineado con la definición de industria
 * (runtime que rodea al modelo: tools, memoria, guardrails).
 * Ref: Databricks — What is an AI Agent Harness?
 */
export const LOGIN_HARNESS_BLURB =
  "Un harness es la infraestructura alrededor del modelo: tools, memoria, políticas y ejecución. El LLM decide; el harness hace que eso ocurra de forma operable.";

/** Plataforma Muninn (app Django) — aterrizaje técnico. */
export const LOGIN_PLATFORM_BLURB =
  "Muninn es la plataforma donde operas agentes de IA: soul, rules, skills, RAG sobre tu conocimiento, cronjobs y flujos — todo visible, versionable y con traza.";

export const LOGIN_HARNESS_REF = {
  label: "Databricks · What is an AI Agent Harness?",
  href: "https://www.databricks.com/blog/ai-harness",
} as const;

export const LOGIN_LANDING_CTA = "Entra a tu cuenta";

export const LOGIN_LANDING_DEMO_LABEL = "Cómo se prepara un agente";

/** Qué hace Muninn contigo en el día a día (antes de átomos). */
export const LOGIN_COMPANION_BEATS = [
  {
    id: "listen",
    title: "Te escucha",
    line: "Entiende tu contexto, tus docs y tu tono. No inventa políticas: pregunta o busca.",
  },
  {
    id: "act",
    title: "Actúa con permiso",
    line: "Propone skills reales (tickets, APIs, búsqueda) y pide confirmación cuando toca.",
  },
  {
    id: "trace",
    title: "Deja traza",
    line: "Ves qué hizo, con qué regla y qué fuente. El compañero no es caja negra.",
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
  { id: "contigo", label: "Contigo", href: "#contigo" },
  { id: "flujo", label: "Flujo", href: "#flujo" },
  { id: "atomos", label: "Átomos", href: "#atomos" },
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
    title: "Claridad operativa",
    line: "Ves soul, rules, skills y resultados. Nada de caja negra: cada paso del agente es legible.",
  },
  {
    id: "control",
    title: "Control real",
    line: "Políticas, confirmaciones y límites. El modelo propone; el harness decide qué puede ejecutar.",
  },
  {
    id: "knowledge",
    title: "Tu conocimiento + automatización",
    line: "RAG sobre tus docs y cronjobs que corren solos. El agente trabaja con fundamento, no con inventos.",
  },
] as const;

/** Pasos “cómo se opera” (docs). */
export const LOGIN_OPERATE_STEPS = [
  {
    n: "01",
    title: "Diseñar",
    line: "Define soul y rules: quién es el agente y qué puede hacer.",
  },
  {
    n: "02",
    title: "Conectar conocimiento",
    line: "Indexa documentos (RAG) y helpers (APIs, tickets, búsqueda).",
  },
  {
    n: "03",
    title: "Políticas",
    line: "Ajusta flow policy: confirmaciones, orden de skills, límites.",
  },
  {
    n: "04",
    title: "Programar",
    line: "Chat humano o cron: el harness ejecuta con traza visible.",
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
 * Ejemplo conversacional general (soporte interno).
 * Explica soul → rules → helpers → RAG → cron → impacto.
 */
export const LOGIN_DEMO_STEPS: LoginDemoStep[] = [
  {
    stage: "Soul",
    title: "SOUL.md — quién es el agente",
    detail: "Personalidad, tono y límites. Es el system prompt: cómo piensa y cómo responde.",
    nodes: [
      { id: "a1", label: "Asistente interno", kind: "agent" },
      { id: "soul", label: "SOUL.md", kind: "soul" },
    ],
    messages: [
      { role: "system", text: "SOUL.md cargado" },
      {
        role: "think",
        text: "«Eres claro, breve y en español de Chile. No inventes políticas: si no sabes, pregunta o busca con RAG.»",
      },
      {
        role: "agent",
        text: "Hola, soy el asistente interno. ¿En qué te ayudo?",
      },
    ],
  },
  {
    stage: "Rules",
    title: "Rules — cuándo puede actuar",
    detail: "Reglas del flujo (flow policy): qué datos pide, qué skills puede usar y en qué orden.",
    nodes: [
      { id: "a1", label: "Asistente interno", kind: "agent" },
      { id: "soul", label: "SOUL.md", kind: "soul" },
      { id: "rules", label: "Rules / flow policy", kind: "rules" },
    ],
    messages: [
      { role: "system", text: "Rules activas" },
      {
        role: "think",
        text: "Antes de una skill de escritura → pedir confirmación. Si falta el tema → preguntar.",
      },
      {
        role: "agent",
        text: "Si me pides cambiar algo sensible, te voy a pedir confirmación primero.",
      },
    ],
  },
  {
    stage: "Helpers",
    title: "Helpers — skills disponibles",
    detail: "Las skills son las herramientas reales: buscar, consultar APIs, crear tickets, etc.",
    nodes: [
      { id: "a1", label: "Asistente interno", kind: "agent" },
      { id: "s1", label: "rag.buscar", kind: "skill" },
      { id: "s2", label: "ticket.crear", kind: "skill" },
      { id: "s3", label: "calendario.consultar", kind: "skill" },
    ],
    messages: [
      { role: "system", text: "3 helpers conectados" },
      {
        role: "think",
        text: "Puedo: RAG sobre documentos · crear ticket · ver calendario. Elijo según la intención.",
      },
      {
        role: "agent",
        text: "Tengo RAG sobre la base de conocimiento y puedo crear tickets si hace falta.",
      },
    ],
  },
  {
    stage: "RAG",
    title: "RAG — conocimiento con fundamento",
    detail:
      "Tus documentos se indexan en chunks. El agente recupera los más relevantes y responde citando — no inventa.",
    nodes: [
      { id: "a1", label: "Asistente interno", kind: "agent" },
      { id: "k1", label: "Políticas RR.HH.", kind: "knowledge" },
      { id: "k2", label: "Guía onboarding", kind: "knowledge" },
      { id: "s1", label: "rag.buscar", kind: "skill" },
    ],
    messages: [
      { role: "user", text: "¿Cuántos días de vacaciones tengo al año?" },
      {
        role: "think",
        text: "Pregunta de política interna → RAG (recuperar chunks), no ticket ni calendario.",
      },
      { role: "system", text: "RAG · 2 chunks · similitud alta · Políticas RR.HH." },
      {
        role: "agent",
        text: "Según la política vigente: 15 días hábiles al año, más 1 día extra desde el 5.º año.",
      },
    ],
  },
  {
    stage: "Cron",
    title: "Cronjobs — corre sin que nadie chatee",
    detail:
      "Workflows programados: resumen diario, sync, alertas. El harness dispara el flujo a la hora que defines.",
    nodes: [
      { id: "c1", label: "0 9 * * 1-5", kind: "cron" },
      { id: "f1", label: "Resumen diario RR.HH.", kind: "skill" },
      { id: "a1", label: "Asistente interno", kind: "agent" },
    ],
    messages: [
      { role: "system", text: "Cron · lun–vie 09:00 · workflow «Resumen diario»" },
      {
        role: "think",
        text: "Sin mensaje de usuario. El trigger cron arma el contexto y ejecuta el flujo.",
      },
      {
        role: "agent",
        text: "Resumen listo: 3 tickets abiertos, 1 política actualizada esta semana.",
      },
      { role: "system", text: "Job ok · siguiente run mañana 09:00" },
    ],
  },
  {
    stage: "Impacto",
    title: "Impacto operable",
    detail:
      "En chat o por cron: confirma, ejecuta la skill correcta y deja traza. El humano siempre puede intervenir.",
    nodes: [
      { id: "a1", label: "Asistente interno", kind: "agent" },
      { id: "s2", label: "ticket.crear", kind: "skill" },
      { id: "r1", label: "Ticket #4821", kind: "result" },
    ],
    messages: [
      {
        role: "user",
        text: "Ok, ábreme un ticket formal para pedir las vacaciones.",
      },
      {
        role: "think",
        text: "Trámite de escritura → ticket.crear. Rule: pedir confirmación.",
      },
      {
        role: "agent",
        text: "Puedo abrir un ticket a RR.HH. con tu solicitud. ¿Lo creo?",
      },
      { role: "user", text: "Sí, por favor." },
      { role: "system", text: "ticket.crear → Ticket #4821 · listo, te avisan al revisarlo" },
    ],
  },
];
