/**
 * Normaliza URLs de media (logo/favicon/banner) para el SPA.
 * En dev, Vite proxea `/media` → backend; reescribimos absolutas a path relativo.
 */
export function resolveMediaUrl(url: string | null | undefined): string {
  const raw = (url ?? "").trim();
  if (!raw || raw === "null" || raw === "undefined") return "";

  if (raw.startsWith("data:") || raw.startsWith("blob:")) return raw;

  if (raw.startsWith("/")) return raw;

  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      if (parsed.pathname.startsWith("/media/")) {
        if (import.meta.env.DEV) {
          return `${parsed.pathname}${parsed.search}`;
        }
      }
      return raw;
    } catch {
      return raw;
    }
  }

  return raw;
}
