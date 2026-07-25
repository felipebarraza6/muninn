/** Pretty-print JSON con fallback seguro. */
export function prettyJson(value: unknown, fallback = "{}"): string {
  if (value == null) return fallback;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    try {
      return JSON.stringify(JSON.parse(trimmed), null, 2);
    } catch {
      return value;
    }
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return fallback;
  }
}

export type ParseJsonResult<T> = { ok: true; value: T } | { ok: false; error: string };

/** Parsea un objeto JSON `{…}` (vacío → `{}`). */
export function parseJsonObject(
  raw: string,
  label = "JSON",
): ParseJsonResult<Record<string, unknown>> {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: true, value: {} };
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false, error: `${label} debe ser un objeto { … }` };
    }
    return { ok: true, value: parsed as Record<string, unknown> };
  } catch {
    return { ok: false, error: `${label} inválido` };
  }
}

/** Body de endpoint: objeto `{…}` o array `[…]`. */
export function parseJsonObjectOrArray(
  raw: string,
  label = "JSON",
): ParseJsonResult<Record<string, unknown> | unknown[]> {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: true, value: {} };
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (Array.isArray(parsed)) return { ok: true, value: parsed };
    if (parsed && typeof parsed === "object") {
      return { ok: true, value: parsed as Record<string, unknown> };
    }
    return { ok: false, error: `${label} debe ser un objeto { … } o un array [ … ]` };
  } catch {
    return { ok: false, error: `${label} inválido` };
  }
}
