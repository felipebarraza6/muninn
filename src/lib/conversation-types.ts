/**
 * Tipos y helpers de conversaciones de la bandeja (flujo real).
 * Separados de mock-data para no acoplar la UI de inbox a fixtures.
 */

export type ConversationStatus =
  | "ai_responding"
  | "requires_human"
  | "human_in_control"
  | "ready_to_book"
  | "high_intent"
  | "no_availability"
  | "angry_patient"
  | "follow_up_pending"
  | "closed"
  | "recovered";

export type MessageSender = "patient" | "ai" | "human" | "system";

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  time: string; // HH:mm
  /** Metadatos de análisis (RAG / skills) cuando el API los expone. */
  created?: string;
  tokens_used?: number;
  rag_sources?: unknown[];
  tool_calls?: unknown[];
  tool_results?: unknown[];
  response_time_ms?: number | null;
}

export interface ReviewFlag {
  kind: "missed_opportunity" | "unclear" | "off_script";
  note: string;
}

export interface Conversation {
  id: string;
  patientName: string;
  phone: string;
  branch: string;
  doctor?: string;
  lastMessage: string;
  lastTime: string;
  status: ConversationStatus;
  badges: ConversationStatus[];
  /** Solo si el API lo provee; no inventar 0. */
  estimatedValue?: number;
  unread: number;
  controlledBy: "ai" | "human";
  campaign: string;
  opportunityType: string;
  nextAction: string;
  aiSummary?: string;
  humanReasons: string[];
  suggestion?: string;
  messages: ChatMessage[];
  timeline?: { time: string; label: string }[];
  lastContact: string;
  /** ISO de cuando entró a waiting_human (aprox. modified). */
  waitingSince?: string;
  /** Si la IA tuvo un momento dudoso o perdió oportunidad. */
  reviewFlag?: ReviewFlag;
  /** Cita confirmada — si está presente, la conversación va a Archivadas. */
  appointment?: { date: string; time: string; treatment: string };
  /** Horas desde el último mensaje del cliente (para sub-filtros). */
  hoursSinceLastPatientMsg?: number;
  /** Campos provenientes de unified-conversations (canales). */
  source?: "channel" | "internal";
  channelType?: string;
  channelName?: string;
  externalUserId?: string;
  externalUserName?: string;
  agentName?: string;
  isWaitingHuman?: boolean;
  isRecentlyActive?: boolean;
  messageCount?: number;
  displayStatus?: string;
  raw?: Record<string, unknown>;
}

export type ConversationBucket = "mine" | "ai" | "archived";

export function getConversationBucket(c: Conversation): ConversationBucket {
  if (c.source === "internal" || c.status === "closed" || c.status === "recovered")
    return "archived";
  if (
    c.status === "requires_human" ||
    c.status === "angry_patient" ||
    c.status === "human_in_control" ||
    c.isWaitingHuman ||
    !!c.reviewFlag
  )
    return "mine";
  return "ai";
}

export const CONVERSATION_BUCKETS: {
  id: ConversationBucket;
  label: string;
  description: string;
}[] = [
  { id: "mine", label: "Para mí", description: "Necesitan ojos humanos ahora" },
  { id: "ai", label: "IA al mando", description: "La IA está respondiendo, monitoreo opcional" },
  { id: "archived", label: "Archivadas", description: "Agendadas, cerradas o recuperadas" },
];

export const CONVERSATION_SUBFILTERS: Record<ConversationBucket, { id: string; label: string }[]> =
  {
    mine: [
      { id: "all", label: "Todas" },
      { id: "waiting_human", label: "Esperando humano" },
      { id: "whatsapp", label: "WhatsApp" },
      { id: "web", label: "Web" },
    ],
    ai: [
      { id: "all", label: "Todas" },
      { id: "whatsapp", label: "WhatsApp" },
      { id: "web", label: "Web" },
      { id: "other", label: "Otros" },
    ],
    archived: [
      { id: "all", label: "Todas" },
      { id: "closed", label: "Cerradas" },
      { id: "inactive", label: "Inactivas" },
    ],
  };

export function matchesSubFilter(
  c: Conversation,
  bucket: ConversationBucket,
  sub: string,
): boolean {
  if (sub === "all") return true;
  const channelType = (c.channelType || "").toLowerCase();
  if (bucket === "mine") {
    if (sub === "waiting_human") return c.isWaitingHuman === true;
    if (sub === "whatsapp") return channelType.includes("whatsapp");
    if (sub === "web") return channelType.includes("web");
  }
  if (bucket === "ai") {
    if (sub === "whatsapp") return channelType.includes("whatsapp");
    if (sub === "web") return channelType.includes("web");
    if (sub === "other") return !channelType.includes("whatsapp") && !channelType.includes("web");
  }
  if (bucket === "archived") {
    if (sub === "closed") return c.status === "closed";
    if (sub === "inactive")
      return c.status === "closed" && c.displayStatus?.toLowerCase() === "inactive";
  }
  return true;
}

export const STATUS_LABEL: Record<ConversationStatus, string> = {
  ai_responding: "IA respondiendo",
  requires_human: "Requiere humano",
  human_in_control: "Humano en control",
  ready_to_book: "Listo para agendar",
  high_intent: "Alta intención",
  no_availability: "Sin disponibilidad",
  angry_patient: "Cliente molesto",
  follow_up_pending: "Seguimiento pendiente",
  closed: "Cerrado",
  recovered: "Recuperado",
};

export const STATUS_TONE: Record<
  ConversationStatus,
  "success" | "warning" | "destructive" | "info" | "muted" | "primary"
> = {
  ai_responding: "info",
  requires_human: "destructive",
  human_in_control: "primary",
  ready_to_book: "success",
  high_intent: "success",
  no_availability: "warning",
  angry_patient: "destructive",
  follow_up_pending: "warning",
  closed: "muted",
  recovered: "success",
};

export const conversationFilters: { id: string; label: string; statuses?: ConversationStatus[] }[] =
  [
    { id: "all", label: "Todas" },
    {
      id: "requires_human",
      label: "Requiere humano",
      statuses: ["requires_human", "angry_patient"],
    },
    { id: "high_intent", label: "Alta intención", statuses: ["high_intent"] },
    { id: "ready_to_book", label: "Listo para agendar", statuses: ["ready_to_book"] },
    { id: "no_availability", label: "Sin disponibilidad", statuses: ["no_availability"] },
    { id: "angry_patient", label: "Cliente molesto", statuses: ["angry_patient"] },
    { id: "budget_pending", label: "Cotización pendiente" },
    { id: "no_response", label: "Sin respuesta", statuses: ["follow_up_pending"] },
    { id: "review_ai", label: "Revisar IA" },
    { id: "closed", label: "Cerradas", statuses: ["closed", "recovered"] },
  ];
