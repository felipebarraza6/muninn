/**
 * Contrato del catálogo público de agentes (yggdra_infra PR #180).
 * Base Axios ya incluye `/api` → paths relativos a eso.
 *
 * GET  /public/agent-catalog/?category&ambito&q
 * GET  /public/agent-catalog/<slug>/
 * GET  /public/agent-catalog/categories/
 * POST /public/agent-catalog/<slug>/clone/   (auth + X-Branch-ID)
 * POST /public/agent-catalog/publish/       (auth → pending)
 * POST /public/agent-catalog/<slug>/approve|reject/  (superadmin)
 */

export const AGENT_CATALOG_PATHS = {
  list: "/public/agent-catalog/",
  categories: "/public/agent-catalog/categories/",
  detail: (slug: string) => `/public/agent-catalog/${encodeURIComponent(slug)}/`,
  clone: (slug: string) => `/public/agent-catalog/${encodeURIComponent(slug)}/clone/`,
  publish: "/public/agent-catalog/publish/",
  approve: (slug: string) => `/public/agent-catalog/${encodeURIComponent(slug)}/approve/`,
  reject: (slug: string) => `/public/agent-catalog/${encodeURIComponent(slug)}/reject/`,
} as const;

export type AgentCatalogAmbito = "trabajo" | "vida";

export type AgentCatalogVisibility = "public" | "private";

export type AgentCatalogReviewStatus = "pending" | "approved" | "rejected";

export type AgentCatalogAuthorType = "platform" | "organization" | string;

/** Alineado a AgentTemplateListSerializer. */
export type AgentCatalogListItem = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  category_label: string;
  ambito: AgentCatalogAmbito | string;
  icon: string;
  version: string;
  visibility: AgentCatalogVisibility | string;
  author: string;
  author_type: AgentCatalogAuthorType;
  clone_count: number;
  requires_professional_disclaimer: boolean;
  recommended_channels: string[];
  required_integrations: string[];
  suggested_skills: string[];
};

export type AgentCatalogConversationExample = {
  user?: string;
  agent?: string;
  [key: string]: unknown;
};

/** Alineado a AgentTemplateDetailSerializer. */
export type AgentCatalogDetail = AgentCatalogListItem & {
  system_instructions: string;
  conversation_examples: AgentCatalogConversationExample[];
  welcome_message: string;
  agent_type: string;
  target_app: string;
  professional_disclaimer: string | null;
  review_status: AgentCatalogReviewStatus | string;
  created: string;
  modified: string;
};

export type AgentCatalogCategory = {
  slug: string;
  name: string;
  ambito: AgentCatalogAmbito | string;
  requires_professional_disclaimer: boolean;
};

export type AgentCatalogListResponse = {
  count: number;
  results: AgentCatalogListItem[];
};

export type AgentCatalogCategoriesResponse = {
  results: AgentCatalogCategory[];
};

export type AgentCatalogListParams = {
  category?: string;
  ambito?: AgentCatalogAmbito | "";
  q?: string;
};

export type AgentCatalogClonePayload = {
  name?: string;
  branch?: number;
};

export type AgentCatalogCloneResult = {
  agent_id: string;
  slug: string;
  name: string;
  branch_id: string;
  template_slug: string;
  clone_count: number;
};

export type AgentCatalogPublishPayload = {
  agent_id: number;
  category: string;
  tagline?: string;
  visibility?: AgentCatalogVisibility;
  icon?: string;
  suggested_skills?: string[];
  recommended_channels?: string[];
  required_integrations?: string[];
  conversation_examples?: AgentCatalogConversationExample[];
};

export type AgentCatalogPublishResult = {
  id: string;
  slug: string;
  review_status: AgentCatalogReviewStatus | string;
  visibility: AgentCatalogVisibility | string;
  message: string;
};

export type AgentCatalogReviewPayload = {
  notes?: string;
};

export type AgentCatalogReviewResult = {
  slug: string;
  review_status: AgentCatalogReviewStatus | string;
};

/** Categorías estables del seed (labels en español). */
export const AGENT_CATALOG_CATEGORY_DEFS: ReadonlyArray<{
  slug: string;
  name: string;
  ambito: AgentCatalogAmbito;
}> = [
  { slug: "ventas", name: "Ventas", ambito: "trabajo" },
  { slug: "atencion_cliente", name: "Atención al cliente", ambito: "trabajo" },
  { slug: "marketing", name: "Marketing", ambito: "trabajo" },
  { slug: "contabilidad_impuestos", name: "Contabilidad e impuestos", ambito: "trabajo" },
  { slug: "rrhh", name: "Recursos humanos", ambito: "trabajo" },
  { slug: "legal", name: "Legal", ambito: "trabajo" },
  { slug: "salud_clinicas", name: "Salud y clínicas", ambito: "trabajo" },
  { slug: "inmobiliaria", name: "Inmobiliaria", ambito: "trabajo" },
  { slug: "ecommerce", name: "E-commerce", ambito: "trabajo" },
  { slug: "ops_it", name: "Ops e IT", ambito: "trabajo" },
  { slug: "agro_agua", name: "Agro y agua", ambito: "trabajo" },
  { slug: "finanzas_personales", name: "Finanzas personales", ambito: "vida" },
  { slug: "salud_fitness", name: "Salud y fitness", ambito: "vida" },
  { slug: "nutricion_recetas", name: "Nutrición y recetas", ambito: "vida" },
  { slug: "viajes", name: "Viajes", ambito: "vida" },
  { slug: "aprendizaje_idiomas", name: "Aprendizaje e idiomas", ambito: "vida" },
  { slug: "estudio_tareas", name: "Estudio y tareas", ambito: "vida" },
  { slug: "crianza_familia", name: "Crianza y familia", ambito: "vida" },
  { slug: "hogar_mascotas", name: "Hogar y mascotas", ambito: "vida" },
  { slug: "bienestar_habitos", name: "Bienestar y hábitos", ambito: "vida" },
  { slug: "hobbies_creatividad", name: "Hobbies y creatividad", ambito: "vida" },
  { slug: "compras_tramites", name: "Compras y trámites Chile", ambito: "vida" },
];

export function isAgentCatalogMockEnabled(
  env: { DEV?: boolean; VITE_AGENT_CATALOG_MOCK?: string } = import.meta.env,
): boolean {
  if (!env.DEV) return false;
  const raw = String(env.VITE_AGENT_CATALOG_MOCK ?? "")
    .trim()
    .toLowerCase();
  return raw === "1" || raw === "true" || raw === "mock";
}

export function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function asConversationExamples(value: unknown): AgentCatalogConversationExample[] {
  if (!Array.isArray(value)) return [];
  const out: AgentCatalogConversationExample[] = [];
  for (const row of value) {
    if (!row || typeof row !== "object") continue;
    out.push(row as AgentCatalogConversationExample);
  }
  return out;
}

export function parseAgentCatalogListItem(row: unknown): AgentCatalogListItem | null {
  if (!row || typeof row !== "object") return null;
  const item = row as Record<string, unknown>;
  const id = item.id != null ? String(item.id) : "";
  const slug = typeof item.slug === "string" ? item.slug.trim() : "";
  const name = typeof item.name === "string" ? item.name.trim() : "";
  if (!id || !slug || !name) return null;

  return {
    id,
    slug,
    name,
    tagline: typeof item.tagline === "string" ? item.tagline : "",
    description: typeof item.description === "string" ? item.description : "",
    category: typeof item.category === "string" ? item.category : "",
    category_label:
      typeof item.category_label === "string"
        ? item.category_label
        : typeof item.category === "string"
          ? item.category
          : "",
    ambito: typeof item.ambito === "string" ? item.ambito : "",
    icon: typeof item.icon === "string" ? item.icon : "",
    version: typeof item.version === "string" ? item.version : "",
    visibility: typeof item.visibility === "string" ? item.visibility : "public",
    author: typeof item.author === "string" ? item.author : "",
    author_type: typeof item.author_type === "string" ? item.author_type : "",
    clone_count:
      typeof item.clone_count === "number" ? item.clone_count : Number(item.clone_count) || 0,
    requires_professional_disclaimer: Boolean(item.requires_professional_disclaimer),
    recommended_channels: asStringArray(item.recommended_channels),
    required_integrations: asStringArray(item.required_integrations),
    suggested_skills: asStringArray(item.suggested_skills),
  };
}

export function parseAgentCatalogListResponse(data: unknown): AgentCatalogListResponse {
  const rows = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray((data as { results?: unknown }).results)
      ? ((data as { results: unknown[] }).results ?? [])
      : [];

  const results = rows
    .map(parseAgentCatalogListItem)
    .filter((item): item is AgentCatalogListItem => item != null);

  const count =
    data && typeof data === "object" && typeof (data as { count?: unknown }).count === "number"
      ? (data as { count: number }).count
      : results.length;

  return { count, results };
}

export function parseAgentCatalogDetail(data: unknown): AgentCatalogDetail | null {
  const base = parseAgentCatalogListItem(data);
  if (!base || !data || typeof data !== "object") return null;
  const item = data as Record<string, unknown>;
  return {
    ...base,
    system_instructions:
      typeof item.system_instructions === "string" ? item.system_instructions : "",
    conversation_examples: asConversationExamples(item.conversation_examples),
    welcome_message: typeof item.welcome_message === "string" ? item.welcome_message : "",
    agent_type: typeof item.agent_type === "string" ? item.agent_type : "",
    target_app: typeof item.target_app === "string" ? item.target_app : "",
    professional_disclaimer:
      typeof item.professional_disclaimer === "string" ? item.professional_disclaimer : null,
    review_status: typeof item.review_status === "string" ? item.review_status : "",
    created: typeof item.created === "string" ? item.created : "",
    modified: typeof item.modified === "string" ? item.modified : "",
  };
}

export function parseAgentCatalogCategories(data: unknown): AgentCatalogCategory[] {
  const rows = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray((data as { results?: unknown }).results)
      ? ((data as { results: unknown[] }).results ?? [])
      : [];

  const out: AgentCatalogCategory[] = [];
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const item = row as Record<string, unknown>;
    const slug = typeof item.slug === "string" ? item.slug.trim() : "";
    const name = typeof item.name === "string" ? item.name.trim() : "";
    if (!slug || !name) continue;
    out.push({
      slug,
      name,
      ambito: typeof item.ambito === "string" ? item.ambito : "",
      requires_professional_disclaimer: Boolean(item.requires_professional_disclaimer),
    });
  }
  return out;
}

export function parseAgentCatalogCloneResult(data: unknown): AgentCatalogCloneResult | null {
  if (!data || typeof data !== "object") return null;
  const item = data as Record<string, unknown>;
  const agent_id = item.agent_id != null ? String(item.agent_id) : "";
  if (!agent_id) return null;
  return {
    agent_id,
    slug: typeof item.slug === "string" ? item.slug : "",
    name: typeof item.name === "string" ? item.name : "",
    branch_id: item.branch_id != null ? String(item.branch_id) : "",
    template_slug: typeof item.template_slug === "string" ? item.template_slug : "",
    clone_count:
      typeof item.clone_count === "number" ? item.clone_count : Number(item.clone_count) || 0,
  };
}

export function parseAgentCatalogPublishResult(data: unknown): AgentCatalogPublishResult | null {
  if (!data || typeof data !== "object") return null;
  const item = data as Record<string, unknown>;
  const id = item.id != null ? String(item.id) : "";
  const slug = typeof item.slug === "string" ? item.slug.trim() : "";
  if (!id || !slug) return null;
  return {
    id,
    slug,
    review_status: typeof item.review_status === "string" ? item.review_status : "pending",
    visibility: typeof item.visibility === "string" ? item.visibility : "public",
    message: typeof item.message === "string" ? item.message : "",
  };
}

/** Destacados para la landing: más clonados primero, tope `limit`. */
export function pickFeaturedCatalogAgents(
  agents: AgentCatalogListItem[],
  limit = 6,
): AgentCatalogListItem[] {
  return [...agents]
    .sort((a, b) => b.clone_count - a.clone_count || a.name.localeCompare(b.name, "es"))
    .slice(0, limit);
}

export function formatCloneCount(count: number): string {
  if (count <= 0) return "Sin clones aún";
  if (count === 1) return "1 clon";
  return `${count.toLocaleString("es-CL")} clones`;
}

export function catalogAmbitoLabel(ambito: string): string {
  if (ambito === "trabajo") return "Trabajo";
  if (ambito === "vida") return "Vida";
  return ambito || "—";
}
