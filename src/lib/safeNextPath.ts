/**
 * Destino post-login/registro seguro (solo paths relativos de la app).
 */
export function resolveSafeNextPath(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const value = String(raw).trim();
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  if (value.includes("://")) return null;
  if (value.includes("\\")) return null;
  // Evitar bucles obvios a auth.
  if (
    value === "/entrar" ||
    value.startsWith("/entrar?") ||
    value === "/registro" ||
    value.startsWith("/registro?") ||
    value.startsWith("/login")
  ) {
    return null;
  }
  return value;
}

export function withNextParam(path: string, next: string | null | undefined): string {
  const safe = resolveSafeNextPath(next);
  if (!safe) return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}next=${encodeURIComponent(safe)}`;
}
