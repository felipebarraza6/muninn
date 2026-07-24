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
