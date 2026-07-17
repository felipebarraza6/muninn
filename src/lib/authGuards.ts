import { getStoredBranches, getStoredUser } from "@/lib/authSession";
import type { BranchAssignment } from "@/api/hooks/useAuth";

export const ROLE_OWNER = "OWNER";
export const ROLE_ADMIN_LOCAL = "ADMIN_LOCAL";
export const ROLE_ORG_OWNER = "ORG_OWNER";

function isOwnerLikeRole(code: string): boolean {
  return code === ROLE_OWNER || code === ROLE_ORG_OWNER;
}

function isManagerRole(code: string): boolean {
  return isOwnerLikeRole(code) || code === ROLE_ADMIN_LOCAL;
}

/** Superadmin de Muninn (gestión LLM / orgs / sucursales / usuarios globales). */
export function isSuperAdmin(): boolean {
  const user = getStoredUser();
  if (!user) return false;
  return Boolean(user.is_superuser || user.is_admin);
}

/** Usuario con más de una sucursal (flag o asignaciones). */
export function isMultiBranchUser(): boolean {
  if (isSuperAdmin()) return true;
  // Organizadores siempre son multi-branch: gestionan N stores de su holding.
  if (isOrganizationOwner()) return true;
  const user = getStoredUser();
  if (user?.is_multi_branch === false) return false;
  if (user?.is_multi_branch === true) return true;
  return getManagedBranchIds().length > 1;
}

/** Mostrar selector/filtro de sucursal en UI (header o toolbar). */
export function showBranchFilterUI(): boolean {
  if (isSuperAdmin()) return true;
  if (isMultiBranchUser()) return true;
  return getManagedBranchIds().length > 1;
}

/** Puede cambiar la sucursal activa en el header. */
export function canSwitchActiveBranch(optionsCount: number): boolean {
  // Organizador: no usa el switcher del header; filtra con StudioBranchFilter / BranchFilterSelect en admin.
  if (isOrganizationOwner()) return false;
  if (isSuperAdmin()) return true;
  if (optionsCount <= 1) return false;
  const user = getStoredUser();
  if (user?.is_multi_branch === false) return false;
  return true;
}

/**
 * Mostrar selector de sucursal en el header.
 * - Organizador: no (usa StudioBranchFilter en Studio y BranchFilterSelect en admin).
 * - OWNER / usuario de una sola sucursal: no (redundante con el branding).
 * - Multi-sucursal o superadmin: sí.
 */
export function showHeaderBranchSwitcher(): boolean {
  if (isOrganizationOwner()) return false;
  if (isSuperAdmin()) return true;
  if (!isMultiBranchUser()) return false;
  return getManagedBranchIds().length > 1;
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
  // Organizador: todas las stores del holding (asignaciones reales o sintéticas).
  if (isOrganizationOwner()) {
    return branches.map((b) => String(b.branch_id));
  }
  const ids = new Set<string>();
  for (const b of branches) {
    if (isManagerRole(getAssignmentRoleCode(b))) {
      ids.add(String(b.branch_id));
    }
  }
  return Array.from(ids);
}

export function getOwnerBranchIds(): string[] {
  if (isSuperAdmin()) return [];
  const branches = getStoredBranches().filter((b) => b.is_active !== false);
  if (isOrganizationOwner()) {
    return branches.map((b) => String(b.branch_id));
  }
  return branches
    .filter((b) => isOwnerLikeRole(getAssignmentRoleCode(b)))
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
  if (isOrganizationOwner()) return true;
  return getManagedBranchIds().length > 0;
}

/**
 * Puede crear/editar/asignar usuarios.
 * - Superadmin: sí
 * - Organizador: sí (stores de su holding)
 * - OWNER en al menos una sucursal: sí (solo esas)
 * - ADMIN_LOCAL: solo lectura
 */
export function canMutateUsersAdmin(): boolean {
  if (isSuperAdmin()) return true;
  if (isOrganizationOwner()) return true;
  return getOwnerBranchIds().length > 0;
}

export function canManageBranchUsers(branchId: string | number | null | undefined): boolean {
  if (isSuperAdmin()) return true;
  if (branchId == null || branchId === "") return false;
  // Organizador: puede gestionar usuarios en las stores de su holding.
  // Si aún no hay IDs en sesión, no bloquear en FE (el API valida).
  if (isOrganizationOwner()) {
    const owned = getOwnerBranchIds();
    if (owned.length === 0) return true;
    return owned.includes(String(branchId));
  }
  return getOwnerBranchIds().includes(String(branchId));
}

/** Dueño de al menos una organización (holding), sin requerir BranchUser. */
export function isOrganizationOwner(): boolean {
  if (isSuperAdmin()) return false;
  const user = getStoredUser();
  if (!user) return false;
  if (user.is_organization_owner) return true;
  return (user.owned_organizations?.length ?? 0) > 0;
}

export function getOwnedOrganizationIds(): string[] {
  const user = getStoredUser();
  return (user?.owned_organizations ?? []).map((o) => String(o.id));
}

/** Nombre del holding principal del organizador (para branding). */
export function getPrimaryOrganizationName(): string | null {
  const user = getStoredUser();
  const org = user?.owned_organizations?.[0];
  if (!org) return null;
  return org.name?.trim() || org.business_name?.trim() || null;
}

/**
 * Puede entrar a /admin/sucursales.
 * - Superadmin: sí
 * - Organizador (Organization.owner): sí (stores de su holding)
 * - OWNER de sucursal (rol): sí (solo sus stores)
 * - Otros roles: no
 */
export function canAccessBranchesAdmin(): boolean {
  if (isSuperAdmin()) return true;
  if (isOrganizationOwner()) return true;
  return isBranchOwner();
}

/**
 * Puede entrar al catálogo global de Conocimiento.
 * - Superadmin: sí
 * - Organizador / owner de organización: sí
 * - OWNER de sucursal: sí
 * - Otros roles: no; solo ven conocimiento ya asignado dentro del agente.
 */
export function canAccessKnowledgeCatalog(): boolean {
  if (isSuperAdmin()) return true;
  if (isOrganizationOwner()) return true;
  return isBranchOwner();
}

/**
 * Scope de OWNER de tienda (rol), sin ser organizador ni superadmin.
 */
export function isStoreOwnerScope(): boolean {
  return !isSuperAdmin() && !isOrganizationOwner() && isBranchOwner();
}

/**
 * Label del menú: "Mi Sucursal" si OWNER de una sola tienda; si no "Sucursales".
 */
export function getBranchesAdminNavLabel(): string {
  if (isStoreOwnerScope() && !isMultiBranchUser()) return "Mi Sucursal";
  return "Sucursales";
}

/** Crear sucursales nuevas: superadmin u organizador (no OWNER de tienda). */
export function canCreateBranchesAdmin(): boolean {
  if (isSuperAdmin()) return true;
  return isOrganizationOwner();
}

/**
 * Editar una sucursal concreta.
 * - Superadmin / organizador: sí (en sus stores)
 * - OWNER de esa sucursal: sí
 * - Otros: solo lectura
 */
export function canMutateBranch(branchId: string | number | null | undefined): boolean {
  if (isSuperAdmin()) return true;
  if (branchId == null || branchId === "") return false;
  if (isOrganizationOwner()) {
    const owned = getOwnerBranchIds();
    if (owned.length === 0) return true;
    return owned.includes(String(branchId));
  }
  return getOwnerBranchIds().includes(String(branchId));
}

/**
 * Puede entrar a /admin/llm.
 * - Superadmin / organizador: gestión
 * - OWNER de sucursal: solo lectura
 */
export function canAccessLlmAdmin(): boolean {
  if (isSuperAdmin()) return true;
  if (isOrganizationOwner()) return true;
  return isBranchOwner();
}

/**
 * Crear / editar / eliminar proveedores LLM.
 * - Superadmin: global
 * - Organizador: stores de su holding
 * - OWNER de sucursal: no
 */
export function canManageLlmProviders(): boolean {
  if (isSuperAdmin()) return true;
  return isOrganizationOwner();
}

/** Alias: configurar provider (incluye create/edit). */
export function canConfigureLlmProvider(): boolean {
  return canManageLlmProviders();
}

/**
 * Agregar / editar modelos.
 * - Superadmin / organizador: sí
 * - OWNER de sucursal: no
 */
export function canMutateLlmModels(): boolean {
  if (isSuperAdmin()) return true;
  return isOrganizationOwner();
}

/** Sync de catálogo remoto: superadmin y organizador. */
export function canSyncLlmProviders(): boolean {
  return canManageLlmProviders();
}

/**
 * Puede entrar a /admin/organizaciones.
 * - Superadmin: sí (todas)
 * - Organizador: sí (solo su holding)
 */
export function canAccessOrganizationsAdmin(): boolean {
  if (isSuperAdmin()) return true;
  return isOrganizationOwner();
}

/** Scope de organizador (holding), sin ser superadmin. */
export function isOrganizationOwnerScope(): boolean {
  return !isSuperAdmin() && isOrganizationOwner();
}

/**
 * Label del menú:
 * - Organizador con 1 holding → "Mi Organización"
 * - Varios holdings / superadmin → "Organizaciones"
 */
export function getOrganizationsAdminNavLabel(): string {
  if (isOrganizationOwnerScope() && getOwnedOrganizationIds().length <= 1) {
    return "Mi Organización";
  }
  return "Organizaciones";
}

/** Crear organizaciones nuevas: solo superadmin. */
export function canCreateOrganizationsAdmin(): boolean {
  return isSuperAdmin();
}

/** Organizador con un solo holding (editor directo, sin lista). */
export function isSingleOrganizationOwner(): boolean {
  return isOrganizationOwnerScope() && getOwnedOrganizationIds().length <= 1;
}
