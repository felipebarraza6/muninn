import type { BranchAssignment, User } from "@/api/hooks/useAuth";
import { getAuthMode } from "@/lib/authMode";

const TOKEN_KEY = "token";
const USER_KEY = "user";
const BRANCHES_KEY = "branches";
const PERMISSIONS_KEY = "permissions";

/**
 * En modo token el DRF token se guarda en localStorage (como antes) para que
 * recargar o abrir otra pestaña no deje al usuario en localStorage sin credencial.
 *
 * TODO: cuando VITE_AUTH_MODE=cookie sea el default en staging/prod (cookie HttpOnly
 * del backend desplegada), eliminar por completo la persistencia de TOKEN_KEY y
 * dejar solo user/branches/permissions en disco.
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  if (getAuthMode() !== "token") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  if (getAuthMode() === "cookie") return Boolean(getStoredUser());
  return Boolean(getToken());
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

/** Actualiza parcialmente el usuario persistido sin perder datos ricos del login. */
export function updateStoredUser(patch: Partial<User>): User | null {
  const current = getStoredUser();
  if (!current) return null;
  const next = { ...current, ...patch };
  localStorage.setItem(USER_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("authUserChanged", { detail: next }));
  return next;
}

export function getStoredBranches(): BranchAssignment[] {
  try {
    const raw = localStorage.getItem(BRANCHES_KEY);
    if (raw) return JSON.parse(raw) as BranchAssignment[];
    const user = getStoredUser();
    return user?.branch_assignments ?? [];
  } catch {
    return [];
  }
}

export function getStoredPermissions(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(PERMISSIONS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function persistSession(payload: {
  token?: string | null;
  user: User;
  branches?: BranchAssignment[];
  permissions?: Record<string, unknown>;
}): void {
  const token = typeof payload.token === "string" ? payload.token.trim() : "";
  try {
    // TODO: al pasar a cookie-only, no escribir TOKEN_KEY (solo clear).
    if (getAuthMode() === "token" && token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    /* storage bloqueado */
  }
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
  const branches = payload.branches ?? payload.user.branch_assignments ?? [];
  localStorage.setItem(BRANCHES_KEY, JSON.stringify(branches));
  if (payload.permissions) {
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(payload.permissions));
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(BRANCHES_KEY);
    localStorage.removeItem(PERMISSIONS_KEY);
  } catch {
    /* storage bloqueado */
  }
}

/** Solo tests: no hay estado en memoria que resetear; se mantiene por compat. */
export function resetAuthSessionStateForTests(): void {
  /* token mode: fuente de verdad es localStorage (limpiar en beforeEach). */
}
