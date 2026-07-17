import type { BranchAssignment, User } from "@/api/hooks/useAuth";

const TOKEN_KEY = "token";
const USER_KEY = "user";
const BRANCHES_KEY = "branches";
const PERMISSIONS_KEY = "permissions";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
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
  token: string;
  user: User;
  branches?: BranchAssignment[];
  permissions?: Record<string, unknown>;
}): void {
  localStorage.setItem(TOKEN_KEY, payload.token);
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
  const branches = payload.branches ?? payload.user.branch_assignments ?? [];
  localStorage.setItem(BRANCHES_KEY, JSON.stringify(branches));
  if (payload.permissions) {
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(payload.permissions));
  }
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(BRANCHES_KEY);
  localStorage.removeItem(PERMISSIONS_KEY);
}
