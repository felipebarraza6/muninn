/** Base de Vite (`/` o `/muninn/` en staging Pages), sin slash final salvo root. */
export function normalizeAppBase(base: string | undefined | null): string {
  const raw = String(base ?? "/").trim() || "/";
  if (raw === "/") return "/";
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

/** Quita el base path del pathname del browser para comparar rutas de la app. */
export function stripAppBasePath(pathname: string, base: string | undefined | null): string {
  const normalized = normalizeAppBase(base);
  if (normalized === "/" || !normalized) return pathname || "/";
  if (pathname === normalized) return "/";
  if (pathname.startsWith(`${normalized}/`)) {
    return pathname.slice(normalized.length) || "/";
  }
  return pathname || "/";
}

/** Páginas del frontend donde un 401 no debe forzar redirect a /entrar. */
export function isPublicAppPath(
  pathname: string,
  base: string | undefined | null = import.meta.env.BASE_URL,
): boolean {
  const p = stripAppBasePath(pathname, base);
  if (p === "/login" || p.startsWith("/login/")) return true;
  if (p === "/entrar") return true;
  if (p.startsWith("/forgot-password")) return true;
  if (p === "/registro" || p.startsWith("/registro/")) return true;
  if (p === "/" || p === "/terminos" || p === "/privacidad") return true;
  if (p === "/agentes" || p.startsWith("/agentes/")) return true;
  if (p.startsWith("/reset-password")) return true;
  if (p.startsWith("/embed/")) return true;
  return false;
}

/** Href absoluto de /entrar respetando VITE_BASE_PATH (p.ej. /muninn/entrar). */
export function resolveEntrarHref(
  base: string | undefined | null = import.meta.env.BASE_URL,
): string {
  const normalized = normalizeAppBase(base);
  if (normalized === "/" || !normalized) return "/entrar";
  return `${normalized}/entrar`;
}
