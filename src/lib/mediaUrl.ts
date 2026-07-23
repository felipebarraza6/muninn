/**
 * Normaliza URLs de media (logo/favicon/banner) para el SPA.
 *
 * - Dev: Vite proxea `/media` → API; reescribimos hosts locales a path relativo.
 * - Prod: FE y API están en dominios distintos; hay que servir `/media` desde el origen del API.
 */

function apiMediaOrigin(): string {
  const api = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (!api) return "";
  try {
    return new URL(api).origin;
  } catch {
    return "";
  }
}

function isLocalDevHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname.endsWith(".local") ||
    /^192\.168\./.test(hostname) ||
    /^10\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
  );
}

export function resolveMediaUrl(url: string | null | undefined): string {
  const raw = (url ?? "").trim();
  if (!raw || raw === "null" || raw === "undefined") return "";

  if (raw.startsWith("data:") || raw.startsWith("blob:")) return raw;

  if (raw.startsWith("/")) {
    // Path relativo /media: en prod el static host no sirve media → prefijar API.
    if (raw.startsWith("/media/") && import.meta.env.PROD) {
      const origin = apiMediaOrigin();
      if (origin) return `${origin}${raw}`;
    }
    return raw;
  }

  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      if (parsed.pathname.startsWith("/media/")) {
        // Solo en dev: pasar por el proxy de Vite (evita 127.0.0.1 cruzado con 172.x).
        if (import.meta.env.DEV && isLocalDevHost(parsed.hostname)) {
          return `${parsed.pathname}${parsed.search}`;
        }
        // Prod / URL pública del API: dejar absoluta.
        return raw;
      }
      return raw;
    } catch {
      return raw;
    }
  }

  return raw;
}
