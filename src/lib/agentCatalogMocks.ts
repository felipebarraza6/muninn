/**
 * Mocks solo con VITE_AGENT_CATALOG_MOCK=1 en desarrollo.
 * Nunca se usan en staging/producción.
 */
import type {
  AgentCatalogCategory,
  AgentCatalogDetail,
  AgentCatalogListItem,
} from "@/lib/agentCatalog";

const NOW = "2026-03-20T12:00:00Z";

export const MOCK_AGENT_CATALOG_CATEGORIES: AgentCatalogCategory[] = [
  {
    slug: "ventas",
    name: "Ventas",
    ambito: "trabajo",
    requires_professional_disclaimer: false,
  },
  {
    slug: "atencion_cliente",
    name: "Atención al cliente",
    ambito: "trabajo",
    requires_professional_disclaimer: false,
  },
  {
    slug: "finanzas_personales",
    name: "Finanzas personales",
    ambito: "vida",
    requires_professional_disclaimer: true,
  },
  {
    slug: "bienestar_habitos",
    name: "Bienestar y hábitos",
    ambito: "vida",
    requires_professional_disclaimer: true,
  },
];

export const MOCK_AGENT_CATALOG_ITEMS: AgentCatalogListItem[] = [
  {
    id: "mock-1",
    slug: "huginn",
    name: "Huginn",
    tagline: "Huginn: B2B outbound con criterio y calidez.",
    description:
      "Agente de ventas listo para clonar. Califica leads, arma pitches y da seguimiento sin presión agresiva.",
    category: "ventas",
    category_label: "Ventas",
    ambito: "trabajo",
    icon: "🤝",
    version: "1.0.0",
    visibility: "public",
    author: "Muninn",
    author_type: "platform",
    clone_count: 42,
    requires_professional_disclaimer: false,
    recommended_channels: ["web_embed", "whatsapp"],
    required_integrations: [],
    suggested_skills: ["native-create-document"],
  },
  {
    id: "mock-2",
    slug: "muna",
    name: "Muna",
    tagline: "Atención al cliente con memoria de tu operación.",
    description: "Responde con tus documentos, escala a humanos y deja rastro en la bandeja.",
    category: "atencion_cliente",
    category_label: "Atención al cliente",
    ambito: "trabajo",
    icon: "🎧",
    version: "1.0.0",
    visibility: "public",
    author: "Muninn",
    author_type: "platform",
    clone_count: 28,
    requires_professional_disclaimer: false,
    recommended_channels: ["whatsapp", "telegram", "web_embed"],
    required_integrations: [],
    suggested_skills: [],
  },
  {
    id: "mock-3",
    slug: "korp",
    name: "Korp",
    tagline: "Ordena tus finanzas personales con calma.",
    description: "Presupuesto, metas y hábitos de ahorro. Orientativo; no reemplaza a un asesor.",
    category: "finanzas_personales",
    category_label: "Finanzas personales",
    ambito: "vida",
    icon: "🪙",
    version: "1.0.0",
    visibility: "public",
    author: "Muninn",
    author_type: "platform",
    clone_count: 15,
    requires_professional_disclaimer: true,
    recommended_channels: ["web_embed"],
    required_integrations: [],
    suggested_skills: [],
  },
];

export function mockAgentCatalogDetail(slug: string): AgentCatalogDetail | null {
  const base = MOCK_AGENT_CATALOG_ITEMS.find((item) => item.slug === slug);
  if (!base) return null;
  return {
    ...base,
    system_instructions: `Eres ${base.name}, agente del catálogo de ejemplo.`,
    conversation_examples: [
      {
        user: "¿Qué puedes hacer por mí?",
        agent: `Puedo ayudarte con ${base.tagline.toLowerCase()} Te guío paso a paso.`,
      },
      {
        user: "Esto es urgente",
        agent: "Priorizo claridad: te doy el siguiente paso único ahora.",
      },
    ],
    welcome_message: `Hola, soy ${base.name}. ¿En qué te ayudo?`,
    agent_type: "ASSISTANT",
    target_app: "general",
    professional_disclaimer: base.requires_professional_disclaimer
      ? "Aviso: este agente es orientativo y no reemplaza el criterio de un profesional."
      : null,
    review_status: "approved",
    created: NOW,
    modified: NOW,
  };
}

export function filterMockCatalog(params: {
  category?: string;
  ambito?: string;
  q?: string;
}): AgentCatalogListItem[] {
  const category = (params.category || "").trim();
  const ambito = (params.ambito || "").trim();
  const q = (params.q || "").trim().toLowerCase();
  return MOCK_AGENT_CATALOG_ITEMS.filter((item) => {
    if (category && item.category !== category) return false;
    if (ambito && item.ambito !== ambito) return false;
    if (!q) return true;
    const hay = `${item.name} ${item.tagline} ${item.description} ${item.slug}`.toLowerCase();
    return hay.includes(q);
  });
}
