/** Re-export de tipos de bandeja (fuente canónica: conversation-types). */
export type {
  ConversationStatus,
  MessageSender,
  ChatMessage,
  ReviewFlag,
  Conversation,
  ConversationBucket,
} from "@/lib/conversation-types";
export {
  getConversationBucket,
  CONVERSATION_BUCKETS,
  CONVERSATION_SUBFILTERS,
  matchesSubFilter,
  STATUS_LABEL,
  STATUS_TONE,
  conversationFilters,
} from "@/lib/conversation-types";

import type { Conversation } from "@/lib/conversation-types";

/** Fixtures demo (no usar en el flujo real de bandeja). */
export interface Snippet {
  id: string;
  shortcut: string;
  label: string;
  text: string;
}

export const snippets: Snippet[] = [
  {
    id: "s1",
    shortcut: "/saludo",
    label: "Saludo recepción",
    text: "Hola, te habla Camila desde recepción. Vi tu conversación y te ayudo desde aquí 😊",
  },
  {
    id: "s2",
    shortcut: "/financiamiento",
    label: "Plan de financiamiento",
    text: "Ofrecemos plan en hasta 12 cuotas sin interés con tarjeta de crédito. ¿Quieres que te coordine una llamada con nuestra coordinadora financiera?",
  },
  {
    id: "s3",
    shortcut: "/derivar",
    label: "Derivar a profesional",
    text: "Voy a coordinar con el especialista tratante para que revise tu caso y te contactaremos hoy mismo. ¿Te parece?",
  },
  {
    id: "s4",
    shortcut: "/agradecer",
    label: "Agradecer",
    text: "¡Gracias por tu confianza! Cualquier duda escríbenos por aquí, estamos para ayudarte.",
  },
  {
    id: "s5",
    shortcut: "/agendar",
    label: "Cerrar agenda",
    text: "Perfecto, te dejo la hora reservada. Te enviaré recordatorio el día anterior. ¡Te esperamos!",
  },
  {
    id: "s6",
    shortcut: "/reagendar",
    label: "Ofrecer reagendar",
    text: "Sin problema, podemos reagendar. Tengo disponibilidad mañana o el viernes. ¿Cuál te acomoda?",
  },
];

export const conversations: Conversation[] = [
  {
    id: "c1",
    patientName: "María González",
    phone: "+56 9 8421 5567",
    branch: "Sucursal Providencia",
    doctor: "Dra. Soto",
    lastMessage: "Sí, me interesa retomar el tratamiento…",
    lastTime: "10:42",
    status: "requires_human",
    badges: ["high_intent", "requires_human"],
    estimatedValue: 680000,
    unread: 2,
    controlledBy: "ai",
    campaign: "Cotizaciónes pendientes marzo",
    opportunityType: "Cotización pendiente",
    nextAction: "Confirmar valor y agendar",
    lastContact: "Hoy, 10:42",
    aiSummary:
      "María respondió positivamente a una campaña de cotizaciónes pendientes. Tiene intención alta, preguntó por disponibilidad y quiere confirmar el valor antes de agendar.",
    humanReasons: [
      "Cotización mayor a $300.000",
      "Cliente pidió confirmar valor",
      "Alta probabilidad de cierre",
      "Requiere validación de recepción",
    ],
    suggestion:
      "Hola María, te confirmo que la cotización estimada sigue vigente. Podemos reservarte el viernes a las 11:30 para que el equipo lo revise contigo antes de iniciar. ¿Te gustaría que dejemos esa hora preagendada?",
    messages: [
      {
        id: "m1",
        sender: "patient",
        text: "Hola, me llegó un mensaje sobre mi cotización pendiente. ¿Todavía puedo tomarlo?",
        time: "10:21",
      },
      {
        id: "m2",
        sender: "ai",
        text: "Hola María, sí, tu cotización sigue disponible. Puedo ayudarte a revisar opciones de horario para retomar tu tratamiento.",
        time: "10:22",
      },
      {
        id: "m3",
        sender: "patient",
        text: "Sí, me interesa. ¿Tienen hora esta semana?",
        time: "10:35",
      },
      {
        id: "m4",
        sender: "ai",
        text: "Tenemos disponibilidad el jueves a las 16:00 y viernes a las 11:30. ¿Cuál te acomoda más?",
        time: "10:36",
      },
      {
        id: "m5",
        sender: "patient",
        text: "Prefiero el viernes, pero quiero confirmar antes el valor.",
        time: "10:42",
      },
      {
        id: "m6",
        sender: "system",
        text: "La IA recomienda intervención humana: cliente interesado con presupuesto sobre $300.000.",
        time: "10:42",
      },
    ],
    timeline: [
      { time: "Lun 10:00", label: "Campaña enviada" },
      { time: "Hoy 10:21", label: "Cliente respondió" },
      { time: "Hoy 10:36", label: "IA ofreció horarios" },
      { time: "Hoy 10:42", label: "Cliente pidió confirmar valor" },
      { time: "Hoy 10:42", label: "IA solicitó intervención humana" },
    ],
    reviewFlag: {
      kind: "missed_opportunity",
      note: "La IA no ofreció financiamiento al hablar de una cotización sobre $300.000.",
    },
  },
  {
    id: "c2",
    patientName: "Rodrigo Pérez",
    phone: "+56 9 7321 1180",
    branch: "Sucursal Las Condes",
    doctor: "Dr. Vargas",
    lastMessage: "No encontré hora disponible para esta semana.",
    lastTime: "09:58",
    status: "no_availability",
    badges: ["no_availability", "requires_human"],
    estimatedValue: 240000,
    unread: 1,
    controlledBy: "ai",
    campaign: "No asistieron — febrero",
    opportunityType: "No asistió",
    nextAction: "Ofrecer horarios extendidos",
    lastContact: "Hoy, 09:58",
    aiSummary:
      "Rodrigo intentó reagendar pero no encontró horarios disponibles esta semana. Sigue interesado en venir.",
    humanReasons: ["Sin disponibilidad en agenda", "Cliente espera respuesta de recepción"],
    suggestion:
      "Hola Rodrigo, revisé la agenda y podemos abrirte un cupo el sábado a las 10:00 o lunes a las 18:30. ¿Cuál te acomoda?",
    messages: [
      { id: "m1", sender: "patient", text: "Hola, quería reagendar mi hora.", time: "09:40" },
      {
        id: "m2",
        sender: "ai",
        text: "Hola Rodrigo, déjame revisar los horarios disponibles para esta semana.",
        time: "09:41",
      },
      {
        id: "m3",
        sender: "ai",
        text: "Esta semana no veo disponibilidad. ¿Podrías la próxima semana?",
        time: "09:43",
      },
      {
        id: "m4",
        sender: "patient",
        text: "No encontré hora disponible para esta semana.",
        time: "09:58",
      },
      {
        id: "m5",
        sender: "system",
        text: "Conversación marcada como 'sin disponibilidad'.",
        time: "09:58",
      },
    ],
    timeline: [
      { time: "Hoy 09:40", label: "Cliente inició conversación" },
      { time: "Hoy 09:43", label: "IA detectó falta de disponibilidad" },
      { time: "Hoy 09:58", label: "Conversación derivada" },
    ],
    reviewFlag: {
      kind: "off_script",
      note: "La IA cerró diciendo que no había hora, sin ofrecer alternativas de horario extendido.",
    },
  },
  {
    id: "c3",
    patientName: "Fernanda López",
    phone: "+56 9 6655 2210",
    branch: "Sucursal Ñuñoa",
    doctor: "Dra. Reyes",
    lastMessage: "¿Tienen disponibilidad el viernes?",
    lastTime: "11:15",
    status: "ai_responding",
    badges: ["ready_to_book", "ai_responding"],
    estimatedValue: 180000,
    unread: 0,
    controlledBy: "ai",
    campaign: "Controles pendientes",
    opportunityType: "Control pendiente",
    nextAction: "Confirmar agenda viernes",
    lastContact: "Hoy, 11:15",
    aiSummary: "Fernanda está lista para agendar su control. La IA está coordinando horarios.",
    humanReasons: [],
    suggestion: "Te confirmo cupo el viernes a las 17:00 con la Dra. Reyes. ¿Lo reservamos?",
    messages: [
      {
        id: "m1",
        sender: "ai",
        text: "Hola Fernanda, te recordamos que tu control anual está pendiente.",
        time: "11:00",
      },
      { id: "m2", sender: "patient", text: "¿Tienen disponibilidad el viernes?", time: "11:15" },
    ],
    timeline: [
      { time: "Hoy 11:00", label: "IA envió recordatorio" },
      { time: "Hoy 11:15", label: "Cliente preguntó por disponibilidad" },
    ],
  },
  {
    id: "c4",
    patientName: "Carlos Muñoz",
    phone: "+56 9 9912 4480",
    branch: "Sucursal Providencia",
    doctor: "Dr. Vargas",
    lastMessage: "Quiero hablar con alguien de recepción.",
    lastTime: "12:03",
    status: "angry_patient",
    badges: ["angry_patient", "requires_human"],
    estimatedValue: 350000,
    unread: 3,
    controlledBy: "ai",
    campaign: "Reactivación — enero",
    opportunityType: "Reclamo",
    nextAction: "Contactar urgente",
    lastContact: "Hoy, 12:03",
    aiSummary:
      "Carlos está molesto por una experiencia previa y exige hablar con recepción. Requiere atención humana inmediata.",
    humanReasons: ["Cliente molesto", "Solicitó hablar con recepción", "Posible reclamo formal"],
    suggestion:
      "Hola Carlos, soy Camila de recepción. Lamento mucho lo ocurrido. ¿Podemos coordinar una llamada hoy mismo para revisar tu caso?",
    messages: [
      {
        id: "m1",
        sender: "patient",
        text: "Llevo días esperando respuesta sobre mi tratamiento.",
        time: "11:30",
      },
      {
        id: "m2",
        sender: "ai",
        text: "Hola Carlos, lamento la demora. Cuéntame qué sucedió y te ayudo.",
        time: "11:31",
      },
      {
        id: "m3",
        sender: "patient",
        text: "Quiero hablar con alguien de recepción.",
        time: "12:03",
      },
      { id: "m4", sender: "system", text: "Conversación marcada como urgente.", time: "12:03" },
    ],
    timeline: [
      { time: "Hoy 11:30", label: "Cliente expresó molestia" },
      { time: "Hoy 12:03", label: "IA solicitó intervención humana" },
    ],
  },
  {
    id: "c5",
    patientName: "Valentina Rojas",
    phone: "+56 9 5544 8810",
    branch: "Sucursal Ñuñoa",
    lastMessage: "Me gustaría agendar mantenimiento preventivo.",
    lastTime: "Ayer",
    status: "ai_responding",
    badges: ["ai_responding", "high_intent"],
    estimatedValue: 90000,
    unread: 0,
    controlledBy: "ai",
    campaign: "Mantenimiento preventivo",
    opportunityType: "Mantenimiento preventivo",
    nextAction: "Cerrar agenda",
    lastContact: "Ayer, 18:20",
    aiSummary:
      "Valentina quiere agendar mantenimiento preventivo, conversación fluyendo bien con la IA.",
    humanReasons: [],
    suggestion:
      "Te ofrezco mantenimiento preventivo mañana a las 10:00 o pasado mañana a las 16:00. ¿Cuál prefieres?",
    messages: [
      {
        id: "m1",
        sender: "ai",
        text: "Hola Valentina, ¿quieres aprovechar nuestra promo de mantenimiento preventivo?",
        time: "18:00",
      },
      {
        id: "m2",
        sender: "patient",
        text: "Me gustaría agendar mantenimiento preventivo.",
        time: "18:20",
      },
    ],
    timeline: [
      { time: "Ayer 18:00", label: "Campaña enviada" },
      { time: "Ayer 18:20", label: "Cliente respondió interesado" },
    ],
  },
  {
    id: "c6",
    patientName: "Andrés Silva",
    phone: "+56 9 4422 7733",
    branch: "Sucursal Las Condes",
    lastMessage: "Sí, me acuerdo de ustedes. Cuéntenme más.",
    lastTime: "Ayer",
    status: "follow_up_pending",
    badges: ["follow_up_pending"],
    estimatedValue: 420000,
    unread: 0,
    controlledBy: "ai",
    campaign: "Leads antiguos",
    opportunityType: "Lead antiguo",
    nextAction: "Reenviar info de tratamiento",
    lastContact: "Ayer, 15:00",
    aiSummary: "Lead antiguo respondió interesado tras meses sin contacto.",
    humanReasons: [],
    suggestion: "Te envío más información sobre nuestro tratamiento especializado.",
    messages: [
      {
        id: "m1",
        sender: "ai",
        text: "Hola Andrés, ¿sigues interesado en evaluar tratamiento especializado?",
        time: "14:50",
      },
      {
        id: "m2",
        sender: "patient",
        text: "Sí, me acuerdo de ustedes. Cuéntenme más.",
        time: "15:00",
      },
    ],
    timeline: [
      { time: "Ayer 14:50", label: "IA reactivó conversación" },
      { time: "Ayer 15:00", label: "Cliente respondió" },
    ],
  },
  {
    id: "c7",
    patientName: "Camila Torres",
    phone: "+56 9 3311 9988",
    branch: "Sucursal Providencia",
    lastMessage: "Perfecto, confirmemos el martes.",
    lastTime: "Ayer",
    status: "ready_to_book",
    badges: ["ready_to_book"],
    estimatedValue: 160000,
    unread: 0,
    controlledBy: "ai",
    campaign: "Reagendamiento",
    opportunityType: "Reagendamiento",
    nextAction: "Confirmar reserva",
    lastContact: "Ayer, 16:40",
    aiSummary: "Camila confirmó disponibilidad para reagendar.",
    humanReasons: [],
    suggestion: "Confirmado martes 11:00, te enviaré recordatorio el día anterior.",
    messages: [
      {
        id: "m1",
        sender: "ai",
        text: "Camila, ¿podemos reagendar para martes 11:00?",
        time: "16:30",
      },
      { id: "m2", sender: "patient", text: "Perfecto, confirmemos el martes.", time: "16:40" },
    ],
    timeline: [
      { time: "Ayer 16:30", label: "IA propuso horario" },
      { time: "Ayer 16:40", label: "Cliente confirmó" },
    ],
  },
  {
    id: "c8",
    patientName: "Patricia Herrera",
    phone: "+56 9 2255 6677",
    branch: "Sucursal Las Condes",
    doctor: "Dr. Vargas",
    lastMessage: "¿Cómo es el plan de pago para el implante?",
    lastTime: "08:30",
    status: "requires_human",
    badges: ["high_intent", "requires_human"],
    estimatedValue: 1200000,
    unread: 1,
    controlledBy: "ai",
    campaign: "Cotizaciónes procedimiento mayor",
    opportunityType: "Cotización procedimiento mayor",
    nextAction: "Explicar planes de pago",
    lastContact: "Hoy, 08:30",
    aiSummary:
      "Patricia está evaluando un procedimiento mayor de alto valor. Pregunta por planes de pago y requiere atención de recepción.",
    humanReasons: [
      "Cotización sobre $1.000.000",
      "Consulta sobre financiamiento",
      "Alta probabilidad de cierre",
    ],
    suggestion:
      "Hola Patricia, ofrecemos plan en hasta 12 cuotas sin interés. ¿Te coordino llamada hoy con nuestra coordinadora financiera?",
    messages: [
      {
        id: "m1",
        sender: "ai",
        text: "Hola Patricia, te comparto el detalle de la cotización del procedimiento mayor.",
        time: "08:15",
      },
      {
        id: "m2",
        sender: "patient",
        text: "¿Cómo es el plan de pago para el procedimiento mayor?",
        time: "08:30",
      },
      { id: "m3", sender: "system", text: "IA derivó: cotización > $1.000.000.", time: "08:30" },
    ],
    timeline: [
      { time: "Hoy 08:15", label: "IA envió cotización" },
      { time: "Hoy 08:30", label: "Cliente preguntó por financiamiento" },
      { time: "Hoy 08:30", label: "IA solicitó intervención humana" },
    ],
    reviewFlag: {
      kind: "unclear",
      note: "Respuesta poco clara sobre cuotas: revisar guion de financiamiento.",
    },
  },
  {
    id: "c9",
    patientName: "Diego Salinas",
    phone: "+56 9 8877 1122",
    branch: "Sucursal Providencia",
    lastMessage: "Mmm no entendí bien lo del pago.",
    lastTime: "Ayer",
    status: "follow_up_pending",
    badges: ["follow_up_pending"],
    estimatedValue: 220000,
    unread: 0,
    controlledBy: "ai",
    campaign: "Reactivación — enero",
    opportunityType: "Lead inactivo",
    nextAction: "Aclarar opciones de pago",
    lastContact: "Ayer, 19:10",
    aiSummary:
      "Diego mostró interés pero la respuesta de la IA sobre pago lo dejó confundido y no respondió más.",
    humanReasons: [],
    suggestion:
      "Hola Diego, te explico mejor: puedes pagar al contado o en 3 cuotas sin interés. ¿Te coordino una hora?",
    messages: [
      {
        id: "m1",
        sender: "ai",
        text: "Hola Diego, ¿retomamos tu evaluación pendiente?",
        time: "19:00",
      },
      { id: "m2", sender: "patient", text: "Sí, ¿cómo es el pago?", time: "19:05" },
      {
        id: "m3",
        sender: "ai",
        text: "Tenemos varias modalidades disponibles según tratamiento.",
        time: "19:06",
      },
      { id: "m4", sender: "patient", text: "Mmm no entendí bien lo del pago.", time: "19:10" },
    ],
    timeline: [
      { time: "Ayer 19:00", label: "IA reactivó conversación" },
      { time: "Ayer 19:10", label: "Cliente quedó confundido" },
    ],
    reviewFlag: {
      kind: "unclear",
      note: "Respuesta vaga sobre pagos provocó pérdida de la conversación.",
    },
  },
  {
    id: "c10",
    patientName: "Andrea Vidal",
    phone: "+56 9 5566 7788",
    branch: "Sucursal Las Condes",
    lastMessage: "Listo, nos vemos el viernes 11:00.",
    lastTime: "2 abr",
    status: "closed",
    badges: ["ready_to_book"],
    estimatedValue: 320000,
    unread: 0,
    controlledBy: "ai",
    campaign: "Reagendamiento",
    opportunityType: "Reagendamiento",
    nextAction: "—",
    lastContact: "2 abr, 12:30",
    aiSummary:
      "Andrea confirmó hora para mantenimiento preventivo + evaluación. Cita agendada por la IA.",
    humanReasons: [],
    suggestion: "",
    appointment: {
      date: "Vie 12 abr",
      time: "11:00",
      treatment: "Mantenimiento preventivo + evaluación",
    },
    messages: [
      { id: "m1", sender: "ai", text: "Andrea, ¿reagendamos para esta semana?", time: "12:20" },
      { id: "m2", sender: "patient", text: "Sí, viernes 11 si es posible.", time: "12:28" },
      {
        id: "m3",
        sender: "ai",
        text: "Confirmado viernes 11:00. Te envío recordatorio.",
        time: "12:30",
      },
    ],
    timeline: [
      { time: "2 abr 12:20", label: "IA propuso reagendamiento" },
      { time: "2 abr 12:30", label: "Cita confirmada por IA" },
    ],
  },
  {
    id: "c11",
    patientName: "Luis Carrasco",
    phone: "+56 9 4422 8899",
    branch: "Sucursal Providencia",
    lastMessage: "Gracias, ya hice el tratamiento.",
    lastTime: "28 mar",
    status: "recovered",
    badges: [],
    estimatedValue: 540000,
    unread: 0,
    controlledBy: "human",
    campaign: "Cotizaciónes pendientes marzo",
    opportunityType: "Cotización pendiente",
    nextAction: "—",
    lastContact: "28 mar, 18:00",
    aiSummary: "Luis retomó el tratamiento tras seguimiento de recepción. Marcado como recuperado.",
    humanReasons: [],
    suggestion: "",
    messages: [
      { id: "m1", sender: "human", text: "Hola Luis, te llamamos para coordinar.", time: "17:50" },
      { id: "m2", sender: "patient", text: "Gracias, ya hice el tratamiento.", time: "18:00" },
    ],
    timeline: [
      { time: "27 mar", label: "Recepción tomó control" },
      { time: "28 mar", label: "Cliente confirmó tratamiento realizado" },
    ],
  },
];

// Dashboard
export const kpis = {
  recoveredRevenue: 8450000,
  openOpportunities: 12380000,
  appointmentsCreated: 126,
  reactivatedPatients: 42,
  conversationsRequireHuman: 24,
  roi: 4.7,
  responseRate: 38,
};

/** Mini-series para sparklines en KPI cards (8 puntos cada una). */
export const kpiSparklines: Record<string, { v: number }[]> = {
  recoveredRevenue: [3.2, 4.1, 3.8, 5.2, 5.6, 6.4, 7.1, 8.4].map((v) => ({ v })),
  openOpportunities: [7.8, 8.4, 9.1, 9.6, 10.2, 11.0, 11.7, 12.4].map((v) => ({ v })),
  appointmentsCreated: [62, 78, 71, 88, 95, 104, 118, 126].map((v) => ({ v })),
  reactivatedPatients: [12, 18, 22, 25, 30, 34, 38, 42].map((v) => ({ v })),
  conversationsRequireHuman: [8, 12, 15, 18, 22, 19, 24, 24].map((v) => ({ v })),
  roi: [2.8, 3.1, 3.4, 3.8, 4.0, 4.3, 4.5, 4.7].map((v) => ({ v })),
  responseRate: [22, 26, 28, 30, 32, 34, 36, 38].map((v) => ({ v })),
  // Reportes extras
  appointmentsRate: [14, 18, 20, 22, 24, 26, 27, 29].map((v) => ({ v })),
};

export const weeklyRevenue = [
  { week: "Sem 1", value: 640000 },
  { week: "Sem 2", value: 720000 },
  { week: "Sem 3", value: 880000 },
  { week: "Sem 4", value: 760000 },
  { week: "Sem 5", value: 820000 },
  { week: "Sem 6", value: 1100000 },
  { week: "Sem 7", value: 980000 },
  { week: "Sem 8", value: 1450000 },
  { week: "Sem 9", value: 1320000 },
  { week: "Sem 10", value: 1610000 },
  { week: "Sem 11", value: 1170000 },
  { week: "Sem 12", value: 1850000 },
];

export const funnel = [
  { stage: "Contactados", value: 420 },
  { stage: "Respondieron", value: 196 },
  { stage: "Interesados", value: 142 },
  { stage: "Agendados", value: 96 },
  { stage: "Atendidos", value: 78 },
  { stage: "Recuperados", value: 64 },
];

// Opportunities
export type OpportunityStatus =
  | "new"
  | "contacted"
  | "responded"
  | "interested"
  | "ready_to_book"
  | "booked"
  | "attended"
  | "recovered"
  | "requires_human"
  | "lost";

export const OPP_STATUS_LABEL: Record<OpportunityStatus, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  responded: "Respondió",
  interested: "Interesado",
  ready_to_book: "Listo para agendar",
  booked: "Agendado",
  attended: "Atendido",
  recovered: "Recuperado",
  requires_human: "Requiere humano",
  lost: "Perdido",
};

export interface Opportunity {
  id: string;
  patient: string;
  reason: string;
  estimatedValue: number;
  status: OpportunityStatus;
  lastContact: string;
  /** Hace cuántas horas fue el último contacto. Usado para priorización. */
  hoursSinceContact: number;
  nextAction: string;
  responsible: string;
  /** Si está vinculada a una conversación. */
  conversationId?: string;
  /** Motivo cuando status = lost. */
  lostReason?: string;
  /** Hace cuántos días se generó la oportunidad (semilla relativa a "hoy"). */
  ageDays: number;
}

export const opportunities: Opportunity[] = [
  {
    id: "o1",
    patient: "María González",
    reason: "Cotización pendiente",
    estimatedValue: 680000,
    status: "requires_human",
    lastContact: "Hoy",
    hoursSinceContact: 2,
    nextAction: "Confirmar valor",
    responsible: "Camila R.",
    conversationId: "c1",
    ageDays: 9,
  },
  {
    id: "o2",
    patient: "Patricia Herrera",
    reason: "Cotización procedimiento mayor",
    estimatedValue: 1200000,
    status: "interested",
    lastContact: "Hoy",
    hoursSinceContact: 4,
    nextAction: "Explicar financiamiento",
    responsible: "Camila R.",
    conversationId: "c8",
    ageDays: 14,
  },
  {
    id: "o3",
    patient: "Fernanda López",
    reason: "Control pendiente",
    estimatedValue: 180000,
    status: "ready_to_book",
    lastContact: "Hoy",
    hoursSinceContact: 1,
    nextAction: "Confirmar viernes",
    responsible: "IA",
    conversationId: "c3",
    ageDays: 0,
  },
  {
    id: "o4",
    patient: "Camila Torres",
    reason: "Reagendamiento",
    estimatedValue: 160000,
    status: "booked",
    lastContact: "Ayer",
    hoursSinceContact: 18,
    nextAction: "Recordatorio martes",
    responsible: "IA",
    conversationId: "c7",
    ageDays: 3,
  },
  {
    id: "o5",
    patient: "Andrés Silva",
    reason: "Lead antiguo",
    estimatedValue: 420000,
    status: "responded",
    lastContact: "Ayer",
    hoursSinceContact: 20,
    nextAction: "Enviar info",
    responsible: "IA",
    conversationId: "c6",
    ageDays: 42,
  },
  {
    id: "o6",
    patient: "Valentina Rojas",
    reason: "Mantenimiento preventivo",
    estimatedValue: 90000,
    status: "interested",
    lastContact: "Ayer",
    hoursSinceContact: 22,
    nextAction: "Cerrar agenda",
    responsible: "IA",
    conversationId: "c5",
    ageDays: 1,
  },
  {
    id: "o7",
    patient: "Rodrigo Pérez",
    reason: "No asistió",
    estimatedValue: 240000,
    status: "requires_human",
    lastContact: "Hoy",
    hoursSinceContact: 3,
    nextAction: "Ofrecer horario",
    responsible: "Camila R.",
    conversationId: "c2",
    ageDays: 5,
  },
  {
    id: "o8",
    patient: "Carlos Muñoz",
    reason: "Reclamo",
    estimatedValue: 350000,
    status: "requires_human",
    lastContact: "Hoy",
    hoursSinceContact: 1,
    nextAction: "Llamada urgente",
    responsible: "Recepción",
    conversationId: "c4",
    ageDays: 0,
  },
  {
    id: "o9",
    patient: "Diego Salinas",
    reason: "Inactivo 8 meses",
    estimatedValue: 220000,
    status: "contacted",
    lastContact: "Hace 2 días",
    hoursSinceContact: 48,
    nextAction: "Reintentar",
    responsible: "IA",
    conversationId: "c9",
    ageDays: 60,
  },
  {
    id: "o10",
    patient: "Javiera Núñez",
    reason: "Tratamiento especializado evaluación",
    estimatedValue: 850000,
    status: "new",
    lastContact: "—",
    hoursSinceContact: 0,
    nextAction: "Primer contacto",
    responsible: "IA",
    ageDays: 0,
  },
  {
    id: "o11",
    patient: "Tomás Ríos",
    reason: "Limpieza vencida",
    estimatedValue: 90000,
    status: "recovered",
    lastContact: "Hace 3 días",
    hoursSinceContact: 72,
    nextAction: "—",
    responsible: "IA",
    ageDays: 11,
  },
  {
    id: "o12",
    patient: "Sofía Castro",
    reason: "Cotización estetica",
    estimatedValue: 320000,
    status: "interested",
    lastContact: "Hoy",
    hoursSinceContact: 6,
    nextAction: "Enviar agenda",
    responsible: "IA",
    ageDays: 4,
  },
  // Ampliación para llegar a ~$12M en oportunidades abiertas
  {
    id: "o13",
    patient: "Esteban Ovalle",
    reason: "Cotización tratamiento especializado",
    estimatedValue: 1450000,
    status: "interested",
    lastContact: "Hoy",
    hoursSinceContact: 5,
    nextAction: "Coordinar evaluación",
    responsible: "IA",
    ageDays: 21,
  },
  {
    id: "o14",
    patient: "Daniela Pinto",
    reason: "Procedimiento mayor unitario",
    estimatedValue: 980000,
    status: "ready_to_book",
    lastContact: "Hoy",
    hoursSinceContact: 2,
    nextAction: "Confirmar jueves 16:00",
    responsible: "Camila R.",
    ageDays: 6,
  },
  {
    id: "o15",
    patient: "Ignacio Vidal",
    reason: "Presupuesto endodoncia",
    estimatedValue: 540000,
    status: "responded",
    lastContact: "Hoy",
    hoursSinceContact: 7,
    nextAction: "Enviar opciones de pago",
    responsible: "IA",
    ageDays: 12,
  },
  {
    id: "o16",
    patient: "Constanza Mella",
    reason: "Inactiva 14 meses",
    estimatedValue: 380000,
    status: "interested",
    lastContact: "Ayer",
    hoursSinceContact: 26,
    nextAction: "Re-enganchar",
    responsible: "IA",
    ageDays: 38,
  },
  {
    id: "o17",
    patient: "Felipe Aravena",
    reason: "Carillas",
    estimatedValue: 1850000,
    status: "requires_human",
    lastContact: "Hoy",
    hoursSinceContact: 3,
    nextAction: "Llamada coordinadora",
    responsible: "Camila R.",
    ageDays: 2,
  },
  {
    id: "o18",
    patient: "Renata Soto",
    reason: "Reactivación control",
    estimatedValue: 110000,
    status: "contacted",
    lastContact: "Hoy",
    hoursSinceContact: 8,
    nextAction: "Esperar respuesta",
    responsible: "IA",
    ageDays: 7,
  },
  {
    id: "o19",
    patient: "Matías Bravo",
    reason: "Presupuesto prótesis",
    estimatedValue: 720000,
    status: "interested",
    lastContact: "Hoy",
    hoursSinceContact: 4,
    nextAction: "Aclarar materiales",
    responsible: "IA",
    ageDays: 18,
  },
  {
    id: "o20",
    patient: "Antonia Fuentes",
    reason: "Mantenimiento + estetica",
    estimatedValue: 240000,
    status: "ready_to_book",
    lastContact: "Hoy",
    hoursSinceContact: 1,
    nextAction: "Confirmar sábado",
    responsible: "IA",
    ageDays: 1,
  },
  {
    id: "o21",
    patient: "Vicente Salas",
    reason: "No asistio tratamiento especializado",
    estimatedValue: 460000,
    status: "responded",
    lastContact: "Ayer",
    hoursSinceContact: 30,
    nextAction: "Reagendar",
    responsible: "IA",
    ageDays: 33,
  },
  {
    id: "o22",
    patient: "Macarena Díaz",
    reason: "Cotización perno + restauracion",
    estimatedValue: 890000,
    status: "new",
    lastContact: "—",
    hoursSinceContact: 0,
    nextAction: "Primer contacto",
    responsible: "IA",
    ageDays: 0,
  },
];

// Campaigns
export type CampaignKind =
  | "budgets"
  | "inactive"
  | "missed"
  | "controls"
  | "cleaning"
  | "evaluation"
  | "leads"
  | "confirm"
  | "reschedule"
  | "post";

export const CAMPAIGN_KIND_LABEL: Record<CampaignKind, string> = {
  budgets: "Cotizaciónes pendientes",
  inactive: "Clientes inactivos",
  missed: "No asistieron",
  controls: "Controles pendientes",
  cleaning: "Mantenimiento preventivo",
  evaluation: "Evaluación gratuita",
  leads: "Leads antiguos",
  confirm: "Confirmación de citas",
  reschedule: "Reagendamiento",
  post: "Reactivación post tratamiento",
};

export interface CampaignTemplate {
  /** Primer mensaje de la campaña. {nombre} y {tratamiento} se reemplazan en runtime. */
  first: string;
  /** Follow-ups automáticos en orden. */
  followUps: { afterHours: number; text: string }[];
}

export interface CampaignSchedule {
  /** Días permitidos: 1=lun ... 7=dom. */
  days: number[];
  /** Hora inicio HH:mm. */
  from: string;
  /** Hora fin HH:mm. */
  to: string;
  /** Cuántos clientes contacta por hora (anti-spam). */
  perHour: number;
}

export interface CampaignAudienceCriterion {
  label: string;
  value: string;
}

/** Estado de un cliente dentro de una campaña. */
export type CampaignPatientStage =
  | "queued"
  | "contacted"
  | "responded"
  | "booked"
  | "closed"
  | "discarded";

export const CAMPAIGN_STAGE_LABEL: Record<CampaignPatientStage, string> = {
  queued: "En cola",
  contacted: "Contactado",
  responded: "Respondió",
  booked: "Agendó",
  closed: "Cerrado",
  discarded: "Descartado",
};

export interface CampaignAudienceMember {
  /** Identificador interno del contacto en la campaña. */
  id?: string;
  patient: string;
  stage: CampaignPatientStage;
  /** Conversación asociada si ya respondió. */
  conversationId?: string;
  /** Valor potencial de esa fila. */
  value: number;
  /** Teléfono normalizado +56 9 XXXX XXXX (cuando viene de CSV). */
  phone?: string;
  /** Tratamiento sugerido para reemplazar {tratamiento}. */
  treatment?: string;
  /** Nota libre del operador (opcional, p.ej. "no llamar tarde"). */
  note?: string;
}

/** Origen de la audiencia de una campaña. */
export type CampaignSource = "hint" | "csv";

export interface Campaign {
  id: string;
  name: string;
  kind: CampaignKind;
  segment: string;
  status: "active" | "paused" | "draft" | "completed";
  contacted: number;
  responded: number;
  appointments: number;
  revenue: number;
  roi: number;
  pending: number;
  startDate: string;
  /** Costo estimado de la campaña (mensajería + configuración). Para ROI con desglose. */
  cost: number;
  template: CampaignTemplate;
  schedule: CampaignSchedule;
  audienceCriteria: CampaignAudienceCriterion[];
  /** Muestra de clientes (no tiene que ser exhaustivo). */
  audienceSample: CampaignAudienceMember[];
  /** De dónde salió la audiencia: pista IA o CSV cargado por el usuario. */
  source?: CampaignSource;
  /** Nombre del archivo CSV original si source === "csv". */
  csvFileName?: string;
  /** Tamaño total de la audiencia (incluidos sin contar exclusiones). */
  audienceTotal?: number;
  /** IDs de contactos que el usuario destacó como excluidos al lanzar. */
  excludedPatientIds?: string[];
  /** Clientes excluidos al lanzar (para pestaña Audiencia → Excluidos). */
  excludedSample?: CampaignAudienceMember[];
}

const DEFAULT_SCHEDULE: CampaignSchedule = {
  days: [1, 2, 3, 4, 5, 6],
  from: "10:00",
  to: "19:00",
  perHour: 30,
};

export const campaigns: Campaign[] = [
  {
    id: "ca1",
    name: "Cotizaciónes pendientes marzo",
    kind: "budgets",
    segment: "Clientes con cotización > $200.000",
    status: "active",
    contacted: 184,
    responded: 76,
    appointments: 38,
    revenue: 4200000,
    roi: 6.1,
    pending: 12,
    startDate: "01 Mar",
    cost: 690000,
    template: {
      first:
        "Hola {nombre}, te escribimos de Clínica por tu cotización de {tratamiento}. ¿Te gustaría que coordinemos tu hora esta semana?",
      followUps: [
        {
          afterHours: 48,
          text: "Hola {nombre}, queríamos saber si todavía te interesa avanzar con tu {tratamiento}. Tenemos opciones de financiamiento.",
        },
        {
          afterHours: 120,
          text: "{nombre}, dejamos abierta tu hora preferente esta semana. Si quieres, te llamamos para resolver dudas.",
        },
      ],
    },
    schedule: DEFAULT_SCHEDULE,
    audienceCriteria: [
      { label: "Estado", value: "Cotización enviada, sin agenda" },
      { label: "Monto", value: "> $200.000" },
      { label: "Antigüedad", value: "Últimos 90 días" },
      { label: "Sucursal", value: "Todas" },
    ],
    audienceSample: [
      {
        id: "ca1-1",
        patient: "María González",
        stage: "responded",
        conversationId: "c1",
        value: 680000,
        phone: "+56 9 8421 5567",
        treatment: "Procedimiento mayor",
      },
      {
        id: "ca1-2",
        patient: "Patricia Herrera",
        stage: "responded",
        conversationId: "c8",
        value: 1200000,
        phone: "+56 9 2255 6677",
        treatment: "Procedimiento mayor",
      },
      {
        id: "ca1-3",
        patient: "Esteban Ovalle",
        stage: "responded",
        value: 1450000,
        phone: "+56 9 8810 4422",
        treatment: "Tratamiento especializado",
      },
      {
        id: "ca1-4",
        patient: "Ignacio Vidal",
        stage: "contacted",
        value: 540000,
        phone: "+56 9 6677 1122",
        treatment: "Procedimiento",
      },
      {
        id: "ca1-5",
        patient: "Macarena Díaz",
        stage: "queued",
        value: 890000,
        phone: "+56 9 3344 9988",
        treatment: "Procedimiento mayor",
      },
    ],
    audienceTotal: 187,
    excludedSample: [
      {
        id: "ca1-x1",
        patient: "Jorge Méndez",
        stage: "discarded",
        value: 0,
        phone: "+56 9 1122 3344",
        note: "Pidió no ser contactado",
      },
      {
        id: "ca1-x2",
        patient: "Laura Cifuentes",
        stage: "discarded",
        value: 0,
        phone: "+56 9 5566 7788",
        note: "Reclamo abierto",
      },
      {
        id: "ca1-x3",
        patient: "Roberto Pinto",
        stage: "discarded",
        value: 0,
        phone: "+56 9 9988 0011",
        note: "Excluido manualmente",
      },
    ],
    source: "hint",
  },
  {
    id: "ca2",
    name: "Reactivación clientes inactivos",
    kind: "inactive",
    segment: "Sin contacto > 6 meses",
    status: "active",
    contacted: 240,
    responded: 58,
    appointments: 22,
    revenue: 1850000,
    roi: 3.4,
    pending: 8,
    startDate: "15 Feb",
    cost: 545000,
    template: {
      first:
        "Hola {nombre}, ha pasado un tiempo desde tu última visita. ¿Te gustaría agendar un control rápido sin costo?",
      followUps: [
        {
          afterHours: 72,
          text: "Hola {nombre}, te dejamos cupo preferente esta semana si quieres pasar a un control.",
        },
      ],
    },
    schedule: DEFAULT_SCHEDULE,
    audienceCriteria: [
      { label: "Última visita", value: "> 6 meses" },
      { label: "Tratamiento previo", value: "Cualquiera" },
    ],
    audienceSample: [
      { patient: "Diego Salinas", stage: "contacted", conversationId: "c9", value: 220000 },
      { patient: "Constanza Mella", stage: "responded", value: 380000 },
      { patient: "Renata Soto", stage: "queued", value: 110000 },
    ],
  },
  {
    id: "ca3",
    name: "No asistieron — febrero",
    kind: "missed",
    segment: "Clientes que faltaron a su cita",
    status: "active",
    contacted: 92,
    responded: 41,
    appointments: 24,
    revenue: 1100000,
    roi: 4.8,
    pending: 5,
    startDate: "20 Feb",
    cost: 230000,
    template: {
      first:
        "Hola {nombre}, lamentamos que no hayas podido venir a tu cita. ¿Reagendamos esta semana?",
      followUps: [
        { afterHours: 48, text: "{nombre}, dejamos tu cupo abierto. Avísanos qué día te acomoda." },
      ],
    },
    schedule: DEFAULT_SCHEDULE,
    audienceCriteria: [
      { label: "Estado de cita", value: "No asistió" },
      { label: "Mes", value: "Febrero" },
    ],
    audienceSample: [
      { patient: "Rodrigo Pérez", stage: "responded", conversationId: "c2", value: 240000 },
      { patient: "Vicente Salas", stage: "responded", value: 460000 },
    ],
  },
  {
    id: "ca4",
    name: "Controles pendientes",
    kind: "controls",
    segment: "Control anual vencido",
    status: "active",
    contacted: 156,
    responded: 62,
    appointments: 31,
    revenue: 920000,
    roi: 3.9,
    pending: 4,
    startDate: "10 Mar",
    cost: 235000,
    template: {
      first:
        "Hola {nombre}, tu control anual está pendiente. Es rápido y nos permite anticipar cualquier tema. ¿Lo agendamos?",
      followUps: [],
    },
    schedule: DEFAULT_SCHEDULE,
    audienceCriteria: [{ label: "Control anual", value: "Vencido > 30 días" }],
    audienceSample: [
      { patient: "Fernanda López", stage: "responded", conversationId: "c3", value: 180000 },
      { patient: "Tomás Ríos", stage: "closed", value: 90000 },
    ],
  },
  {
    id: "ca5",
    name: "Mantenimiento preventivo",
    kind: "cleaning",
    segment: "Mantenimiento preventivo vencido > 6 meses",
    status: "paused",
    contacted: 78,
    responded: 22,
    appointments: 11,
    revenue: 320000,
    roi: 2.1,
    pending: 2,
    startDate: "05 Feb",
    cost: 152000,
    template: {
      first:
        "Hola {nombre}, ya pasó tiempo desde tu último mantenimiento preventivo. Te ofrecemos un cupo esta semana.",
      followUps: [],
    },
    schedule: DEFAULT_SCHEDULE,
    audienceCriteria: [{ label: "Último mantenimiento", value: "> 6 meses" }],
    audienceSample: [
      { patient: "Valentina Rojas", stage: "responded", conversationId: "c5", value: 90000 },
      { patient: "Antonia Fuentes", stage: "responded", value: 240000 },
    ],
  },
  {
    id: "ca6",
    name: "Leads antiguos",
    kind: "leads",
    segment: "Leads sin convertir > 1 año",
    status: "active",
    contacted: 320,
    responded: 48,
    appointments: 12,
    revenue: 580000,
    roi: 2.4,
    pending: 9,
    startDate: "22 Feb",
    cost: 240000,
    template: {
      first:
        "Hola {nombre}, ¿sigues interesado en una evaluación? Tenemos cupos sin costo esta semana.",
      followUps: [],
    },
    schedule: DEFAULT_SCHEDULE,
    audienceCriteria: [{ label: "Origen", value: "Lead web > 12 meses" }],
    audienceSample: [
      { patient: "Andrés Silva", stage: "contacted", conversationId: "c6", value: 420000 },
      { patient: "Javiera Núñez", stage: "queued", value: 850000 },
    ],
  },
];

/** Sugerencias de pistas (para wizard y estado vacío). */
export interface CampaignHint {
  kind: CampaignKind;
  title: string;
  description: string;
  audienceSize: number;
  estimatedValue: number;
}

export const campaignHints: CampaignHint[] = [
  {
    kind: "budgets",
    title: "Cotizaciónes pendientes",
    description: "Clientes con cotización > $200.000 sin cerrar",
    audienceSize: 23,
    estimatedValue: 5800000,
  },
  {
    kind: "inactive",
    title: "Clientes inactivos",
    description: "Sin contacto en los últimos 6 meses",
    audienceSize: 184,
    estimatedValue: 3200000,
  },
  {
    kind: "missed",
    title: "No asistieron",
    description: "Faltaron a su cita en los últimos 30 días",
    audienceSize: 41,
    estimatedValue: 1450000,
  },
  {
    kind: "controls",
    title: "Controles pendientes",
    description: "Control anual vencido > 30 días",
    audienceSize: 96,
    estimatedValue: 1100000,
  },
  {
    kind: "cleaning",
    title: "Mantenimiento preventivo",
    description: "Mantenimiento preventivo vencido > 6 meses",
    audienceSize: 132,
    estimatedValue: 920000,
  },
  {
    kind: "evaluation",
    title: "Evaluación gratuita",
    description: "Generar primera visita con campaña gancho",
    audienceSize: 0,
    estimatedValue: 0,
  },
  {
    kind: "leads",
    title: "Leads antiguos",
    description: "Leads sin convertir hace > 1 año",
    audienceSize: 312,
    estimatedValue: 4200000,
  },
  {
    kind: "confirm",
    title: "Confirmación de citas",
    description: "Reduce no-shows confirmando 24h antes",
    audienceSize: 28,
    estimatedValue: 0,
  },
  {
    kind: "reschedule",
    title: "Reagendamiento",
    description: "Recupera citas canceladas en las últimas 48h",
    audienceSize: 14,
    estimatedValue: 720000,
  },
  {
    kind: "post",
    title: "Reactivación post tratamiento",
    description: "Cross-sell tras tratamiento exitoso",
    audienceSize: 56,
    estimatedValue: 1900000,
  },
];

// Reports — extras
export const monthlyRevenue = [
  { month: "Oct", value: 4200000 },
  { month: "Nov", value: 5100000 },
  { month: "Dic", value: 4800000 },
  { month: "Ene", value: 6200000 },
  { month: "Feb", value: 7400000 },
  { month: "Mar", value: 8450000 },
];

export const appointmentsByWeek = [
  { week: "Sem 1", value: 12 },
  { week: "Sem 2", value: 18 },
  { week: "Sem 3", value: 16 },
  { week: "Sem 4", value: 22 },
  { week: "Sem 5", value: 19 },
  { week: "Sem 6", value: 24 },
  { week: "Sem 7", value: 17 },
  { week: "Sem 8", value: 26 },
];

/** Serie del período anterior, mismos meses, para comparativa. */
export const monthlyRevenuePrevious = [
  { month: "Oct", value: 3100000 },
  { month: "Nov", value: 3800000 },
  { month: "Dic", value: 3600000 },
  { month: "Ene", value: 4500000 },
  { month: "Feb", value: 5200000 },
  { month: "Mar", value: 6100000 },
];

/** Mix de oportunidades agrupadas por motivo (con $ estimado). */
export const oppsMix = [
  { name: "Cotización pendiente", value: 4, revenue: 2400000, color: "var(--color-primary)" },
  { name: "Reactivación", value: 3, revenue: 990000, color: "var(--color-info)" },
  { name: "Control / Mantenimiento", value: 3, revenue: 360000, color: "var(--color-success)" },
  { name: "No asistió", value: 1, revenue: 240000, color: "var(--color-warning)" },
  { name: "Reclamo", value: 1, revenue: 350000, color: "var(--color-destructive)" },
];

/** Top motivos por los que la IA deriva al humano. */
export const derivationReasons = [
  { reason: "Cotización > $300.000", count: 38 },
  { reason: "Consulta sobre financiamiento", count: 27 },
  { reason: "Cliente molesto / reclamo", count: 19 },
  { reason: "Sin disponibilidad en agenda", count: 16 },
  { reason: "Pide hablar con recepción", count: 12 },
];

/** Heatmap 7 días x 12 bloques de 2h (00-02 ... 22-24). Valores 0-100. */
export const activityHeatmap: number[][] = [
  // L
  [2, 0, 0, 0, 5, 18, 42, 65, 78, 70, 55, 22],
  // Ma
  [3, 0, 0, 0, 6, 22, 48, 72, 82, 74, 60, 28],
  // Mi
  [4, 0, 0, 0, 8, 25, 52, 78, 88, 80, 64, 30],
  // J
  [3, 0, 0, 0, 7, 20, 50, 75, 85, 76, 58, 26],
  // V
  [5, 1, 0, 0, 6, 24, 55, 82, 95, 70, 45, 18],
  // S
  [8, 2, 0, 0, 4, 12, 28, 40, 35, 22, 14, 8],
  // D
  [10, 3, 0, 0, 2, 6, 14, 22, 30, 38, 32, 18],
];
export const heatmapDays = ["L", "Ma", "Mi", "J", "V", "S", "D"];
export const heatmapBlocks = ["0", "2", "4", "6", "8", "10", "12", "14", "16", "18", "20", "22"];

// Settings
export const integrations = [
  {
    id: "wa",
    name: "WhatsApp Business",
    connected: true,
    lastSync: "hace 3 min",
    count: "1.284 conversaciones",
  },
  {
    id: "dl",
    name: "Sistema de gestión",
    connected: true,
    lastSync: "hace 8 min",
    count: "3.420 clientes sincronizados · 612 citas",
  },
  {
    id: "dt",
    name: "Sistema de gestión alternativo",
    connected: false,
    lastSync: "—",
    count: "Disponible como integración alternativa",
  },
];

export const users = [
  { id: "u1", name: "Camila Reyes", email: "camila@clinica.cl", role: "Recepción" },
  { id: "u2", name: "Andrés Pizarro", email: "andres@clinica.cl", role: "Dueño de clínica" },
  { id: "u3", name: "Marcela Soto", email: "marcela@clinica.cl", role: "Marketing" },
  {
    id: "u4",
    name: "Equipo Patagon.IA",
    email: "contacto@agenciapatagonia.com",
    role: "Administrador Patagon.IA",
  },
];

export const humanRules = [
  { id: "r1", label: "Dolor fuerte o urgencia", enabled: true },
  { id: "r2", label: "Reclamo o cliente molesto", enabled: true },
  { id: "r3", label: "Solicitud de reembolso", enabled: true },
  { id: "r4", label: "Duda clínica compleja", enabled: true },
  { id: "r5", label: "Problema de pago", enabled: true },
  { id: "r6", label: "Sin disponibilidad en agenda", enabled: true },
  { id: "r7", label: "Cotización personalizada", enabled: false },
  { id: "r8", label: "Cliente pide hablar con recepción", enabled: true },
  { id: "r9", label: "Cotización superior a $300.000", enabled: true },
  { id: "r10", label: "Cliente de alta intención listo para cerrar", enabled: true },
];
