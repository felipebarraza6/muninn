/**
 * Base URL del API para Axios / fetch (stream).
 * Dev: proxy Vite `/api`. Prod: exige `VITE_API_URL` (sin fallback a un tenant).
 */
export function resolveApiBaseUrl(): string {
  if (import.meta.env.DEV) return "/api";

  const url = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (!url) {
    throw new Error(
      "VITE_API_URL no está definida. Configúrala en el build de producción/preview (por tenant).",
    );
  }
  return url.replace(/\/+$/, "");
}
