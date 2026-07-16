import { getStoredBranches, getStoredUser } from "@/lib/authSession";
import type { BranchAssignment } from "@/api/hooks/useAuth";

export const ROLE_OWNER = "OWNER";
export const ROLE_ADMIN_LOCAL = "ADMIN_LOCAL";

/** Superadmin de Muninn (gestión LLM / orgs / sucursales / usuarios globales). */
export function isSuperAdmin(): boolean {
  const user = getStoredUser();
  if (!user) return false;
  return Boolean(user.is_superuser || user.is_admin);
}

export function getAssignmentRoleCode(a: BranchAssignment): string {
  const anyA = a as BranchAssignment & { role_code?: string };
  return String(anyA.role_code || a.role || "")
    .trim()
    .toUpperCase();
}

/** Sucursales donde el usuario tiene un rol de gestión de personas. */
export function getManagedBranchIds(): string[] {
  if (isSuperAdmin()) return [];
  const branches = getStoredBranches().filter((b) => b.is_active !== false);
  const ids = new Set<string>();
  for (const b of branches) {
    const code = getAssignmentRoleCode(b);
    if (code === ROLE_OWNER || code === ROLE_ADMIN_LOCAL) {
      ids.add(String(b.branch_id));
    }
  }
  return Array.from(ids);
}

export function getOwnerBranchIds(): string[] {
  if (isSuperAdmin()) return [];
  const branches = getStoredBranches().filter((b) => b.is_active !== false);
  return branches
    .filter((b) => getAssignmentRoleCode(b) === ROLE_OWNER)
    .map((b) => String(b.branch_id));
}

export function isBranchOwner(): boolean {
  if (isSuperAdmin()) return false;
  return getOwnerBranchIds().length > 0;
}

export function isBranchAdminLocal(): boolean {
  if (isSuperAdmin()) return false;
  const branches = getStoredBranches().filter((b) => b.is_active !== false);
  return branches.some((b) => getAssignmentRoleCode(b) === ROLE_ADMIN_LOCAL);
}

/** Puede entrar a /admin/usuarios. */
export function canAccessUsersAdmin(): boolean {
  if (isSuperAdmin()) return true;
  return getManagedBranchIds().length > 0;
}

/**
 * Puede crear/editar/asignar usuarios.
 * - Superadmin: sí
 * - OWNER en al menos una sucursal: sí (solo esas)
 * - ADMIN_LOCAL: solo lectura
 */
export function canMutateUsersAdmin(): boolean {
  if (isSuperAdmin()) return true;
  return getOwnerBranchIds().length > 0;
}

export function canManageBranchUsers(branchId: string | number | null | undefined): boolean {
  if (isSuperAdmin()) return true;
  if (branchId == null || branchId === "") return false;
  return getOwnerBranchIds().includes(String(branchId));
}
