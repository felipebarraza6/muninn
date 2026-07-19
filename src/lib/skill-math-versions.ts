import type { FormulaParamDraft } from "@/lib/skills";

export type MathVersionSnapshot = {
  id: string;
  note: string;
  createdAt: string;
  expression: string;
  formulaParams: FormulaParamDraft[];
  testValues: Record<string, string>;
  lastResult?: unknown;
};

const VERSIONS_PREFIX = "muninn:skill-versions:math:";

function storageKey(draftKey: string) {
  return `${VERSIONS_PREFIX}${draftKey || "new"}`;
}

export function loadMathVersions(draftKey: string): MathVersionSnapshot[] {
  try {
    const raw = localStorage.getItem(storageKey(draftKey));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MathVersionSnapshot[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveMathVersions(draftKey: string, versions: MathVersionSnapshot[]) {
  try {
    localStorage.setItem(storageKey(draftKey), JSON.stringify(versions.slice(0, 40)));
  } catch {
    /* ignore */
  }
}

export function pushMathVersion(
  draftKey: string,
  snapshot: Omit<MathVersionSnapshot, "id" | "createdAt"> & { id?: string; createdAt?: string },
): MathVersionSnapshot[] {
  const next: MathVersionSnapshot = {
    id: snapshot.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: snapshot.createdAt || new Date().toISOString(),
    note: snapshot.note || "",
    expression: snapshot.expression,
    formulaParams: snapshot.formulaParams,
    testValues: snapshot.testValues,
    lastResult: snapshot.lastResult,
  };
  const list = [next, ...loadMathVersions(draftKey)];
  saveMathVersions(draftKey, list);
  return list;
}
