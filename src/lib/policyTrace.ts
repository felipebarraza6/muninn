import type { FlowPolicy } from "@/lib/flowPolicy";
import type { ToolCallDetail } from "@/components/chat/chat-message-insights";

/** Traza de flow_policy en respuesta de chat (runtime o metadata). */
export type PolicyTrace = {
  slots_filled?: Record<string, unknown>;
  slots_missing?: string[];
  skills_allowed?: string[];
  skills_blocked?: Array<{ skill: string; reason?: string }>;
  rules_applied?: Array<{ skill?: string; requires?: string[]; note?: string }>;
  raw?: unknown;
  /** true si se armó desde agent.flow_policy + tool_calls (no viene del runtime). */
  inferred?: boolean;
};

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function toolSlug(call: ToolCallDetail): string {
  return (call.function?.name || call.name || "").trim();
}

/** Extrae policy_trace desde metadata / campos top-level del mensaje. */
export function extractPolicyTrace(source?: {
  policy_trace?: unknown;
  flow_policy_trace?: unknown;
  policies?: unknown;
  metadata?: Record<string, unknown> | null;
}): PolicyTrace | null {
  if (!source) return null;
  const meta = source.metadata && typeof source.metadata === "object" ? source.metadata : null;
  const raw =
    source.policy_trace ??
    source.flow_policy_trace ??
    source.policies ??
    meta?.policy_trace ??
    meta?.flow_policy_trace ??
    meta?.policies;
  if (!raw) return null;
  const obj = asRecord(raw);
  if (!obj) return { raw, inferred: false };

  const blockedRaw = obj.skills_blocked;
  const skills_blocked = Array.isArray(blockedRaw)
    ? blockedRaw
        .map((b) => {
          if (typeof b === "string") return { skill: b };
          const r = asRecord(b);
          return {
            skill: String(r?.skill ?? r?.name ?? ""),
            reason: r?.reason != null ? String(r.reason) : undefined,
          };
        })
        .filter((b) => b.skill)
    : undefined;

  const rulesRaw = obj.rules_applied;
  const rules_applied = Array.isArray(rulesRaw)
    ? rulesRaw.map((r) => {
        const row = asRecord(r) ?? {};
        return {
          skill: row.skill != null ? String(row.skill) : undefined,
          requires: Array.isArray(row.requires) ? row.requires.map(String) : undefined,
          note: row.note != null ? String(row.note) : undefined,
        };
      })
    : undefined;

  return {
    slots_filled: asRecord(obj.slots_filled) ?? undefined,
    slots_missing: Array.isArray(obj.slots_missing) ? obj.slots_missing.map(String) : undefined,
    skills_allowed: Array.isArray(obj.skills_allowed) ? obj.skills_allowed.map(String) : undefined,
    skills_blocked,
    rules_applied,
    raw: obj,
    inferred: false,
  };
}

/**
 * Fallback: cruza tool_calls del mensaje con agent.flow_policy.skills
 * (etiqueta inferred — no es traza runtime).
 */
export function inferPolicyTraceFromConfig(
  flowPolicy: FlowPolicy | Record<string, unknown> | null | undefined,
  toolCalls?: unknown[],
): PolicyTrace | null {
  if (!flowPolicy || typeof flowPolicy !== "object") return null;
  const skillsMap = asRecord((flowPolicy as FlowPolicy).skills);
  if (!skillsMap) return null;

  const calls = Array.isArray(toolCalls) ? (toolCalls as ToolCallDetail[]) : [];
  if (!calls.length) {
    const skillKeys = Object.keys(skillsMap);
    if (!skillKeys.length) return null;
    return {
      inferred: true,
      rules_applied: skillKeys.slice(0, 8).map((slug) => {
        const rule = asRecord(skillsMap[slug]) ?? {};
        return {
          skill: slug,
          requires: Array.isArray(rule.requires) ? rule.requires.map(String) : undefined,
          note: "Regla de config (sin skills en este mensaje)",
        };
      }),
    };
  }

  const rules_applied: NonNullable<PolicyTrace["rules_applied"]> = [];
  for (const call of calls) {
    const slug = toolSlug(call);
    if (!slug) continue;
    const rule =
      asRecord(skillsMap[slug]) ||
      asRecord(skillsMap[slug.replace(/-/g, "_")]) ||
      Object.entries(skillsMap).find(([k]) => k.toLowerCase() === slug.toLowerCase())?.[1];
    const row = asRecord(rule);
    if (!row) continue;
    rules_applied.push({
      skill: slug,
      requires: Array.isArray(row.requires) ? row.requires.map(String) : undefined,
      note:
        Array.isArray(row.prerequisites) && row.prerequisites.length
          ? `prereq: ${row.prerequisites.map(String).join(", ")}`
          : undefined,
    });
  }

  if (!rules_applied.length) return null;
  return { inferred: true, rules_applied };
}

export function policyTraceSignalCount(trace: PolicyTrace | null | undefined): number {
  if (!trace) return 0;
  let n = 0;
  if (trace.slots_missing?.length) n += trace.slots_missing.length;
  if (trace.skills_blocked?.length) n += trace.skills_blocked.length;
  if (trace.rules_applied?.length) n += trace.rules_applied.length;
  if (trace.skills_allowed?.length) n += 1;
  if (trace.slots_filled && Object.keys(trace.slots_filled).length) n += 1;
  return n;
}
