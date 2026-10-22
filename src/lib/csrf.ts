import { isCookieAuthMode } from "@/lib/authMode";

/** Nombres que Django y el PR de cookie pueden usar. */
const CSRF_COOKIE_NAMES = ["csrftoken", "csrf_token"];

let memoryCsrf: string | null = null;

export function rememberCsrfToken(token: string | null | undefined): void {
  const value = typeof token === "string" ? token.trim() : "";
  if (value) memoryCsrf = value;
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  for (const part of document.cookie.split(";")) {
    const item = part.trim();
    if (!item.startsWith(prefix)) continue;
    try {
      return decodeURIComponent(item.slice(prefix.length));
    } catch {
      return item.slice(prefix.length);
    }
  }
  return null;
}

/** Token CSRF legible (cookie no-HttpOnly o valor recordado de un header/login). */
export function readCsrfToken(): string | null {
  if (memoryCsrf) return memoryCsrf;
  for (const name of CSRF_COOKIE_NAMES) {
    const value = readCookie(name);
    if (value) {
      memoryCsrf = value;
      return value;
    }
  }
  return null;
}

const SAFE_METHODS = new Set(["get", "head", "options", "trace"]);

/** Header para mutaciones cuando la sesión va por cookie. */
export function csrfHeaderRecord(method?: string): Record<string, string> {
  if (!isCookieAuthMode()) return {};
  const verb = String(method ?? "get").toLowerCase();
  if (SAFE_METHODS.has(verb)) return {};
  const token = readCsrfToken();
  return token ? { "X-CSRFToken": token } : {};
}

export function rememberCsrfFromHeaders(headers: unknown): void {
  if (!headers || typeof headers !== "object") return;
  const bag = headers as { get?: (name: string) => unknown } & Record<string, unknown>;
  const fromGet =
    typeof bag.get === "function"
      ? bag.get("x-csrftoken") || bag.get("x-csrf-token") || bag.get("X-CSRFToken")
      : undefined;
  const direct = bag["x-csrftoken"] ?? bag["x-csrf-token"] ?? bag["X-CSRFToken"];
  const value = fromGet ?? direct;
  if (typeof value === "string") rememberCsrfToken(value);
}

export function resetCsrfForTests(): void {
  memoryCsrf = null;
}
