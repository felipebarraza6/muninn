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
      // Siempre path relativo para /media: el SPA (localhost o 172.x) proxea al API.
      // Evita logos rotos cuando el backend devuelve http://127.0.0.1:8000/media/...
      if (parsed.pathname.startsWith("/media/")) {
        return `${parsed.pathname}${parsed.search}`;
      }
      return raw;
    } catch {
      return raw;
    }
  }

  return raw;
}
