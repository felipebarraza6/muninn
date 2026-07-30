/** Tipos, ejemplos y helpers para agent.flow_policy (v1). */

export type FlowPolicySlot = {
  aliases?: string[];
  ask?: string;
  default?: unknown;
  type?: string;
};

export type FlowPolicySkillRule = {
  requires?: string[];
  optional_defaults?: Record<string, unknown>;
  prerequisites?: string[];
  /** Al menos una de estas skills debe haberse completado. */
  prerequisites_any?: string[];
  capture?: string[];
};

export type FlowPolicy = {
  version?: number;
  slots?: Record<string, FlowPolicySlot>;
  skills?: Record<string, FlowPolicySkillRule>;
  /** Posiciones de nodos en la pizarra (`slot:id` / `skill:slug`). */
  layout?: Record<string, { x: number; y: number }>;
  [key: string]: unknown;
};

export type SlotDraft = {
  id: string;
  ask: string;
  defaultValue: string;
  /** Claves API / aliases (ej. `Professional`). Si falta, se derivan del id. */
  aliases?: string[];
  type?: string;
};

export type SkillRuleDraft = {
  slug: string;
  name: string;
  enabled: boolean;
  requires: string[];
  capture: string[];
  prerequisites: string[];
  prerequisitesAny: string[];
  optionalDefaults: Record<string, string>;
};

/** Plantillas listas para entender identificador / pregunta / default. */
export const SLOT_EXAMPLES: Array<{
  id: string;
  ask: string;
  defaultValue: string;
  blurb: string;
}> = [
  {
    id: "profesional",
    ask: "¿Con qué profesional quieres agendar?",
    defaultValue: "",
    blurb: "Nombre corto interno. La pregunta es lo que escucha el usuario.",
  },
  {
    id: "fecha",
    ask: "¿Para qué día necesitas la hora? (AAAA-MM-DD)",
    defaultValue: "",
    blurb: "Sin default: siempre se pregunta si falta.",
  },
  {
    id: "motivo",
    ask: "¿Cuál es el motivo de la consulta?",
    defaultValue: "Consulta general",
    blurb: "Con default: si el usuario no dice nada, se usa ese valor.",
  },
  {
    id: "consentimiento",
    ask: "¿Confirmas que quieres agendar esa hora?",
    defaultValue: "",
    blurb: "Ideal antes de skills que escriben (crear cita, borrar, etc.).",
  },
];

/**
 * Preset oficial Clínica WM / DentyDesk (mismo JSON que backend
 * `catalog/flow_policies.WM_RESERVAS_POLICY`).
 */
export const WM_RESERVAS_POLICY: FlowPolicy = {
  version: 1,
  slots: {
    professional: {
      aliases: ["Professional", "Professional_id", "professional"],
      ask: "¿Con qué profesional quieres agendar?",
    },
    date: {
      aliases: ["Date", "date"],
      ask: "¿Para qué día necesitas la hora? (AAAA-MM-DD)",
    },
    reason: {
      aliases: ["IdReason", "reason"],
      ask: "¿Cuál es el motivo de la consulta?",
      default: "Consulta general",
    },
    hour: {
      aliases: ["Hour", "hour"],
      ask: "¿Qué hora de las disponibles preferís?",
    },
    patient_name: {
      aliases: ["NamePatient", "name"],
      ask: "¿Cuál es tu nombre y apellido?",
    },
    patient_lastname: {
      aliases: ["LastnamePatient", "lastname"],
      ask: "¿Cuál es tu apellido? (solo si no lo diste con el nombre)",
    },
    patient_email: {
      aliases: ["EmailPatient", "email"],
      ask: "¿Cuál es tu email?",
    },
    patient_rut: {
      aliases: ["RutPatient", "rut"],
      ask: "¿Cuál es tu RUT?",
    },
    patient_phone: {
      aliases: ["PhonePatient", "phone", "telefono", "teléfono"],
      ask: "¿Cuál es tu teléfono de contacto?",
    },
    consent: {
      type: "bool",
      aliases: ["consent", "Consent"],
      ask: "¿Confirmas que quieres agendar esa hora? Responde sí / confirmo.",
    },
  },
  skills: {
    "dentidesk-horas-disponibles": {
      requires: ["professional", "date"],
      optional_defaults: { reason: "Consulta general" },
      capture: ["professional", "date", "reason"],
    },
    "dentidesk-buscar-proxima-hora": {
      requires: ["professional"],
      optional_defaults: { reason: "Consulta general" },
      capture: ["professional", "reason"],
    },
    "dentidesk-crear-cita": {
      requires: [
        "professional",
        "date",
        "hour",
        "reason",
        "patient_name",
        "patient_lastname",
        "patient_email",
        "patient_rut",
        "patient_phone",
        "consent",
      ],
      prerequisites_any: ["dentidesk-horas-disponibles", "dentidesk-buscar-proxima-hora"],
      capture: [
        "hour",
        "patient_name",
        "patient_lastname",
        "patient_email",
        "patient_rut",
        "patient_phone",
      ],
    },
    "dentidesk-estado-cita": {
      requires: [],
      capture: [],
    },
  },
};

export const FLOW_POLICY_PRESETS: Record<string, FlowPolicy> = {
  "agendamiento-clinica-wm": WM_RESERVAS_POLICY,
  "asistente-reservas-wm": WM_RESERVAS_POLICY,
};

export function emptyFlowPolicy(): FlowPolicy {
  return { version: 1, slots: {}, skills: {} };
}

export function normalizeFlowPolicy(raw: unknown): FlowPolicy {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return emptyFlowPolicy();
  const obj = raw as FlowPolicy;
  const layoutRaw = obj.layout;
  const layout: Record<string, { x: number; y: number }> = {};
  if (layoutRaw && typeof layoutRaw === "object" && !Array.isArray(layoutRaw)) {
    for (const [k, v] of Object.entries(layoutRaw)) {
      if (!v || typeof v !== "object") continue;
      const x = Number((v as { x?: unknown }).x);
      const y = Number((v as { y?: unknown }).y);
      if (Number.isFinite(x) && Number.isFinite(y)) layout[k] = { x, y };
    }
  }
  return {
    version: typeof obj.version === "number" ? obj.version : 1,
    slots: obj.slots && typeof obj.slots === "object" && !Array.isArray(obj.slots) ? obj.slots : {},
    skills:
      obj.skills && typeof obj.skills === "object" && !Array.isArray(obj.skills) ? obj.skills : {},
    ...(Object.keys(layout).length > 0 ? { layout } : {}),
  };
}

export function flowPolicyIsActive(policy: FlowPolicy | null | undefined): boolean {
  if (!policy) return false;
  return Object.keys(policy.skills ?? {}).length > 0;
}

export function slugifySlotId(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
}

export function policyToSlotDrafts(policy: FlowPolicy): SlotDraft[] {
  return Object.entries(policy.slots ?? {}).map(([id, slot]) => ({
    id,
    ask: String(slot?.ask ?? ""),
    defaultValue: slot?.default != null ? String(slot.default) : "",
    aliases: Array.isArray(slot?.aliases) ? slot.aliases.map(String) : undefined,
    type: slot?.type ? String(slot.type) : undefined,
  }));
}

export function policyToSkillDrafts(
  policy: FlowPolicy,
  assigned: { slug: string; name: string }[],
): SkillRuleDraft[] {
  // Solo skills asignadas al agente (no huérfanas del policy viejo).
  return assigned
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "es"))
    .map((a) => {
      const rule = policy.skills?.[a.slug];
      const optionalDefaults: Record<string, string> = {};
      const rawDefaults = rule?.optional_defaults;
      if (rawDefaults && typeof rawDefaults === "object") {
        for (const [k, v] of Object.entries(rawDefaults)) {
          if (v != null) optionalDefaults[k] = String(v);
        }
      }
      return {
        slug: a.slug,
        name: a.name || a.slug,
        enabled: Boolean(rule),
        requires: [...(rule?.requires ?? [])],
        capture: [...(rule?.capture ?? [])],
        prerequisites: [...(rule?.prerequisites ?? [])],
        prerequisitesAny: [...(rule?.prerequisites_any ?? [])],
        optionalDefaults,
      };
    });
}

function defaultAliasesForSlot(id: string, extra: string[] = []): string[] {
  const base = [id, id.charAt(0).toUpperCase() + id.slice(1), ...extra];
  return Array.from(new Set(base.filter(Boolean)));
}

function askFromParamKey(key: string, description?: string): string {
  const desc = description?.trim();
  if (desc) {
    if (desc.includes("?")) return desc;
    return `¿${desc.charAt(0).toUpperCase()}${desc.slice(1)}?`;
  }
  const nice = key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase();
  return `¿Puedes indicar ${nice || key}?`;
}

export type SkillParamHint = {
  /** Nombre del parámetro en el schema (ej. Professional). */
  key: string;
  description?: string;
  /** free | static | data_document — los static no van a Datos. */
  source?: string;
};

/**
 * Candidatos a slots desde params de skills.
 * Omite `static` (ya los resuelve la config de skill) y dedupe por id slugificado.
 */
export function suggestSlotsFromSkillParams(params: SkillParamHint[]): SlotDraft[] {
  const byId = new Map<string, SlotDraft>();
  for (const p of params) {
    const key = String(p.key || "").trim();
    if (!key) continue;
    if (p.source === "static") continue;
    const id = slugifySlotId(key);
    if (!id) continue;
    const prev = byId.get(id);
    if (prev) {
      prev.aliases = defaultAliasesForSlot(id, [...(prev.aliases ?? []), key]);
      if (!prev.ask && p.description) prev.ask = askFromParamKey(key, p.description);
      continue;
    }
    byId.set(id, {
      id,
      ask: askFromParamKey(key, p.description),
      defaultValue: "",
      aliases: defaultAliasesForSlot(id, [key]),
    });
  }
  return Array.from(byId.values()).sort((a, b) => a.id.localeCompare(b.id, "es"));
}

/**
 * Claves normalizadas con las que un slot “cubre” un param de skill
 * (id + aliases), para no duplicar p.ej. patient_name vs NamePatient.
 */
export function slotCoverageKeys(slot: SlotDraft): Set<string> {
  const keys = new Set<string>();
  const push = (raw: string) => {
    const s = String(raw || "").trim();
    if (!s) return;
    keys.add(s.toLowerCase());
    const slug = slugifySlotId(s);
    if (slug) keys.add(slug);
  };
  push(slot.id);
  for (const a of slot.aliases ?? []) push(a);
  return keys;
}

function slotAlreadyCovered(existing: SlotDraft[], candidate: SlotDraft): boolean {
  const cand = slotCoverageKeys(candidate);
  for (const slot of existing) {
    const have = slotCoverageKeys(slot);
    for (const k of cand) {
      if (have.has(k)) return true;
    }
  }
  return false;
}

/** Une sugerencias sin pisar ni duplicar datos ya creados (por id o alias). */
export function mergeSlotSuggestions(existing: SlotDraft[], suggested: SlotDraft[]): SlotDraft[] {
  const added = suggested.filter((s) => !slotAlreadyCovered(existing, s));
  return [...existing, ...added];
}

/** Cuántas sugerencias aún no están cubiertas por los slots actuales. */
export function countMissingSlotSuggestions(existing: SlotDraft[], suggested: SlotDraft[]): number {
  return suggested.filter((s) => !slotAlreadyCovered(existing, s)).length;
}

export function draftsToPolicy(
  slots: SlotDraft[],
  skills: SkillRuleDraft[],
  layout?: Record<string, { x: number; y: number }> | null,
): FlowPolicy {
  const slotMap: Record<string, FlowPolicySlot> = {};
  for (const s of slots) {
    const id = slugifySlotId(s.id);
    if (!id) continue;
    const slot: FlowPolicySlot = {
      aliases: defaultAliasesForSlot(id, s.aliases ?? []),
      ask: s.ask.trim() || `¿Puedes indicar ${id}?`,
    };
    if (s.defaultValue.trim()) slot.default = s.defaultValue.trim();
    if (s.type) slot.type = s.type;
    slotMap[id] = slot;
  }

  const skillMap: Record<string, FlowPolicySkillRule> = {};
  for (const sk of skills) {
    if (!sk.enabled) continue;
    const rule: FlowPolicySkillRule = {};
    if (sk.requires.length) rule.requires = sk.requires;
    if (sk.capture.length) rule.capture = sk.capture;
    if (sk.prerequisitesAny.length) rule.prerequisites_any = sk.prerequisitesAny;
    else if (sk.prerequisites.length) rule.prerequisites = sk.prerequisites;
    if (Object.keys(sk.optionalDefaults).length) {
      rule.optional_defaults = { ...sk.optionalDefaults };
    }
    skillMap[sk.slug] = rule;
  }

  const next: FlowPolicy = { version: 1, slots: slotMap, skills: skillMap };
  if (layout && Object.keys(layout).length > 0) next.layout = layout;
  return next;
}
