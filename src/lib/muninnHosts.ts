/**
 * Hosts donde Muninn es la marca, no el portal de un cliente.
 * by-host devuelve una org (Frig) para cualquier host que no reconoce,
 * así que estos dominios no deben consultar ese endpoint.
 *
 * `VITE_MUNINN_HOSTS` suma hosts (coma). No reemplaza la lista de abajo.
 */

const BUILTIN_MUNINN_HOSTS = [
  "muninn.yggdra.cl",
  "felipebarraza6.github.io",
  "localhost",
  "127.0.0.1",
  "::1",
] as const;

/** Hostname sin puerto, esquema ni path. `localhost:3001` → `localhost`. */
export function normalizeHostname(value: string): string {
  let host = value.trim().toLowerCase();
  host = host.replace(/^[a-z][a-z0-9+.-]*:\/\//, "");
  host = host.split("/")[0] ?? "";
  if (host.startsWith("[")) {
    const end = host.indexOf("]");
    host = end >= 0 ? host.slice(1, end) : host;
  } else {
    host = host.replace(/:\d+$/, "");
  }
  return host.replace(/\.$/, "");
}

export function muninnOwnHostnames(): string[] {
  const raw = import.meta.env.VITE_MUNINN_HOSTS;
  const extras =
    typeof raw === "string"
      ? raw
          .split(",")
          .map((item) => normalizeHostname(item))
          .filter(Boolean)
      : [];
  return [...new Set<string>([...BUILTIN_MUNINN_HOSTS, ...extras])];
}

export function isMuninnOwnHost(host: string | null | undefined): boolean {
  if (!host) return false;
  const name = normalizeHostname(host);
  if (!name) return false;
  return muninnOwnHostnames().includes(name);
}
