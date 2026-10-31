export type AuthMode = "cookie" | "token";

/**
 * `cookie`: sesión HttpOnly + CSRF (cuando el backend ya está desplegado).
 * `token`: Authorization Token en localStorage. Default hasta que el backend
 * de cookie esté en staging/prod (entonces se deja de persistir el token).
 */
export function resolveAuthMode(raw: string | undefined | null): AuthMode {
  return String(raw ?? "")
    .trim()
    .toLowerCase() === "cookie"
    ? "cookie"
    : "token";
}

export function getAuthMode(): AuthMode {
  return resolveAuthMode(import.meta.env.VITE_AUTH_MODE);
}

export function isCookieAuthMode(): boolean {
  return getAuthMode() === "cookie";
}
