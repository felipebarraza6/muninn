/** Normaliza hex a `#rrggbb` para `<input type="color">` (solo acepta 6 dígitos). */
export function toCssColorHex(value: string | null | undefined, fallback = "#2dd4bf"): string {
  const raw = (value ?? "").trim();
  if (/^#[0-9a-f]{6}$/i.test(raw)) return raw.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(raw)) {
    const body = raw.slice(1);
    return `#${body
      .split("")
      .map((c) => c + c)
      .join("")}`.toLowerCase();
  }
  return fallback.toLowerCase();
}

export function isCssColorHex(value: string | null | undefined): boolean {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test((value ?? "").trim());
}
