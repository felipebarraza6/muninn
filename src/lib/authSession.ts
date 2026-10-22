import type { BranchAssignment, User } from "@/api/hooks/useAuth";
import { getAuthMode } from "@/lib/authMode";

const TOKEN_KEY = "token";
const USER_KEY = "user";
const BRANCHES_KEY = "branches";
const PERMISSIONS_KEY = "permissions";

/** El token de DRF no se persiste. En modo token vive solo en esta pestaña. */
let memoryToken: string | null = null;
let legacyChecked = false;

function consumeLegacyToken(): void {
  if (legacyChecked || typeof window === "undefined") return;
  legacyChecked = true;
  try {
    const legacy = localStorage.getItem(TOKEN_KEY);
    // Una sola vez: si había un token viejo, sigue esta pestaña y se borra del disco.
    if (getAuthMode() === "token" && legacy && !memoryToken) {
      memoryToken = legacy;
    }
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    memoryToken = getAuthMode() === "token" ? memoryToken : null;
  }
}

export function getToken(): string | null {
  consumeLegacyToken();
  if (getAuthMode() !== "token") return null;
  return memoryToken;
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
  consumeLegacyToken();
  const token = typeof payload.token === "string" ? payload.token.trim() : "";
  memoryToken = getAuthMode() === "token" && token ? token : null;
  try {
    localStorage.removeItem(TOKEN_KEY);
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
  memoryToken = null;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(BRANCHES_KEY);
    localStorage.removeItem(PERMISSIONS_KEY);
  } catch {
    /* storage bloqueado */
  }
}

/** Solo tests: vuelve a leer un token legado. */
export function resetAuthSessionStateForTests(): void {
  memoryToken = null;
  legacyChecked = false;
}
