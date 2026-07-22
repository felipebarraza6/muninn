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
  capture?: string[];
};

export type FlowPolicy = {
  version?: number;
  slots?: Record<string, FlowPolicySlot>;
  skills?: Record<string, FlowPolicySkillRule>;
  [key: string]: unknown;
};

export type SlotDraft = {
  id: string;
  ask: string;
  defaultValue: string;
};

export type SkillRuleDraft = {
  slug: string;
  name: string;
  enabled: boolean;
  requires: string[];
  capture: string[];
  prerequisites: string[];
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
    ask: "¿Con qué profesional querés agendar?",
    defaultValue: "",
    blurb: "Nombre corto interno. La pregunta es lo que escucha el usuario.",
  },
  {
    id: "fecha",
    ask: "¿Para qué día necesitás la hora? (AAAA-MM-DD)",
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
    ask: "¿Confirmás que querés agendar esa hora?",
    defaultValue: "",
    blurb: "Ideal antes de skills que escriben (crear cita, borrar, etc.).",
  },
];

export function emptyFlowPolicy(): FlowPolicy {
  return { version: 1, slots: {}, skills: {} };
}

export function normalizeFlowPolicy(raw: unknown): FlowPolicy {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return emptyFlowPolicy();
  const obj = raw as FlowPolicy;
  return {
    version: typeof obj.version === "number" ? obj.version : 1,
    slots: obj.slots && typeof obj.slots === "object" && !Array.isArray(obj.slots) ? obj.slots : {},
    skills:
      obj.skills && typeof obj.skills === "object" && !Array.isArray(obj.skills) ? obj.skills : {},
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
  }));
}

export function policyToSkillDrafts(
  policy: FlowPolicy,
  assigned: { slug: string; name: string }[],
): SkillRuleDraft[] {
  const bySlug = new Map(assigned.map((a) => [a.slug, a]));
  const slugs = new Set([...assigned.map((a) => a.slug), ...Object.keys(policy.skills ?? {})]);
  return Array.from(slugs)
    .sort()
    .map((slug) => {
      const rule = policy.skills?.[slug];
      return {
        slug,
        name: bySlug.get(slug)?.name || slug,
        enabled: Boolean(rule),
        requires: [...(rule?.requires ?? [])],
        capture: [...(rule?.capture ?? [])],
        prerequisites: [...(rule?.prerequisites ?? [])],
      };
    });
}

export function draftsToPolicy(slots: SlotDraft[], skills: SkillRuleDraft[]): FlowPolicy {
  const slotMap: Record<string, FlowPolicySlot> = {};
  for (const s of slots) {
    const id = slugifySlotId(s.id);
    if (!id) continue;
    const slot: FlowPolicySlot = {
      aliases: [id, id.charAt(0).toUpperCase() + id.slice(1)],
      ask: s.ask.trim() || `¿Podés indicar ${id}?`,
    };
    if (s.defaultValue.trim()) slot.default = s.defaultValue.trim();
    slotMap[id] = slot;
  }

  const skillMap: Record<string, FlowPolicySkillRule> = {};
  for (const sk of skills) {
    if (!sk.enabled) continue;
    const rule: FlowPolicySkillRule = {};
    if (sk.requires.length) rule.requires = sk.requires;
    if (sk.capture.length) rule.capture = sk.capture;
    if (sk.prerequisites.length) rule.prerequisites = sk.prerequisites;
    skillMap[sk.slug] = rule;
  }

  return { version: 1, slots: slotMap, skills: skillMap };
}
