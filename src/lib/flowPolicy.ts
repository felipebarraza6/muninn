/** Tipos y helpers para agent.flow_policy (v1). */

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

export function summarizeFlowPolicy(policy: FlowPolicy): {
  slotCount: number;
  skillCount: number;
  slotIds: string[];
  skillIds: string[];
} {
  const slotIds = Object.keys(policy.slots ?? {});
  const skillIds = Object.keys(policy.skills ?? {});
  return {
    slotCount: slotIds.length,
    skillCount: skillIds.length,
    slotIds,
    skillIds,
  };
}
