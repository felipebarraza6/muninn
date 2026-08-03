import { getStoredBranches, getStoredPermissions, getStoredUser } from "@/lib/authSession";
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
  // Organizador: Studio (canales, agentes, bandeja) filtra por sucursal del holding.
  if (isOrganizationOwner()) return true;
  if (isMultiBranchUser()) return true;
  return getManagedBranchIds().length > 1;
}

/** Puede cambiar la sucursal activa en el header. */
export function canSwitchActiveBranch(optionsCount: number): boolean {
  // Superadmin / organizador: no usan el switcher del header (filtran en Studio).
  if (isSuperAdmin() || isOrganizationOwner()) return false;
  if (optionsCount <= 1) return false;
  const user = getStoredUser();
  if (user?.is_multi_branch === false) return false;
  return true;
}

/**
 * Mostrar selector de sucursal en el header.
 * - Superadmin: no (tema Muninn fijo; filtra con StudioBranchFilter).
 * - Organizador: no (usa StudioBranchFilter / BranchFilterSelect en admin).
 * - OWNER / una sola sucursal: no.
 * - Multi-sucursal operativo: sí.
 */
export function showHeaderBranchSwitcher(): boolean {
  if (isSuperAdmin() || isOrganizationOwner()) return false;
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

/** Id del holding principal del organizador (para branding/tema). */
export function getPrimaryOrganizationId(): string | null {
  const ids = getOwnedOrganizationIds();
  return ids[0] ?? null;
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
 * Bandeja de Conversaciones (inbox de clientes / canales).
 * - Root (superadmin): sí (análisis; filtrar por sucursal).
 * - Organizador: sí (solo stores de su holding).
 * - OWNER / roles de sucursal: sí (sus sucursales).
 */
export function canAccessConversations(): boolean {
  if (!getStoredUser()) return false;
  if (isSuperAdmin()) return true;
  if (isOrganizationOwner()) return true;
  // OWNER, ADMIN_LOCAL, EMPLOYEE, etc. con asignación activa
  return getStoredBranches().some((b) => b.is_active !== false);
}

/**
 * Intervención operativa (tomar control, responder, cerrar).
 * Superadmin: solo lectura/análisis; organizador y negocio: sí.
 */
export function canInterveneInConversations(): boolean {
  if (!canAccessConversations()) return false;
  if (isSuperAdmin()) return false;
  return true;
}

export type HomeDashboardKind = "platform" | "organization" | "business";

/** Qué Resumen mostrar en `/` según rol. */
export function getHomeDashboardKind(): HomeDashboardKind {
  if (isSuperAdmin()) return "platform";
  if (isOrganizationOwner()) return "organization";
  return "business";
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
 * Puede ver Aplicaciones (lista / detalle).
 * Studio: cualquier usuario autenticado con acceso a la sucursal.
 * El catálogo (`scope=store`) lo filtra el backend por cascada:
 * superadmin → todas; org → allowed-apps; usuario → org ∩ role-apps.
 */
export function canAccessExternalApis(): boolean {
  return Boolean(getStoredUser());
}

/**
 * Crear / editar / eliminar / probar Aplicaciones.
 * - Superadmin: sí
 * - Organizador: sí (stores de su holding)
 * - OWNER u otros roles: solo lectura
 */
export function canManageExternalApis(): boolean {
  if (isSuperAdmin()) return true;
  return isOrganizationOwner();
}

/**
 * Ver/editar la pestaña Endpoints del store.
 * Solo superadmin: es la definición técnica del catálogo.
 */
export function canViewExternalApiEndpoints(): boolean {
  return isSuperAdmin();
}

/**
 * Ver la pestaña Skills dentro del detalle de una app.
 * Mismo criterio que el catálogo `/skills` (superadmin / organizador).
 * OWNER de sucursal y roles operativos: no.
 */
export function canViewExternalApiSkillsInStore(): boolean {
  return canAccessSkills();
}

/**
 * Ver instalaciones (pestaña Instalación) y configurar cuenta de servicio.
 * - Superadmin / organizador: mapa multi-sucursal
 * - OWNER de sucursal: sus sucursales (cuenta de servicio)
 */
export function canViewExternalApiInstallations(): boolean {
  if (canManageExternalApis()) return true;
  return isBranchOwner();
}

/**
 * Instalar/desinstalar app en sucursales (toggle del mapa).
 * Solo superadmin u organizador; el OWNER de tienda solo configura la cuenta.
 */
export function canToggleExternalApiInstallations(): boolean {
  return canManageExternalApis();
}

/**
 * Conectar/editar cuenta de servicio de una instalación.
 * SA/organizador: cualquiera de su alcance; OWNER: solo sus sucursales.
 */
export function canManageInstallationAccount(
  branchId: string | number | null | undefined,
): boolean {
  if (canManageExternalApis()) return true;
  return canManageBranchUsers(branchId);
}

/**
 * Superadmin designa qué apps del store ve una organización
 * (`PUT …/organizations/{id}/allowed-apps/`).
 */
export function canDesignateOrganizationApps(): boolean {
  return isSuperAdmin();
}

/**
 * Organizador (o superadmin) designa apps por rol hacia adentro
 * (`PUT …/organizations/{id}/role-apps/`).
 */
export function canDesignateOrganizationRoleApps(): boolean {
  if (isSuperAdmin()) return true;
  return isOrganizationOwner();
}

/**
 * Puede entrar al catálogo de Skills (`/skills`).
 * - Superadmin: sí
 * - Organizador: sí
 * - Roles operativos: no (usan Skills solo desde el Agente en esta versión)
 */
export function canAccessSkills(): boolean {
  if (isSuperAdmin()) return true;
  return isOrganizationOwner();
}

/**
 * Crear / editar / desactivar / reactivar Skills.
 * Misma política que acceso al catálogo.
 */
export function canManageSkills(): boolean {
  return canAccessSkills();
}

/**
 * Borrado físico definitivo de una skill.
 * Solo superadmin; el organizador desactiva y puede reactivar.
 */
export function canHardDeleteSkills(): boolean {
  return isSuperAdmin();
}

/**
 * Puede editar/desactivar/reactivar una skill concreta.
 * - Superadmin: sí
 * - Organizador: solo si `can_edit` del API o `created_by` es él
 * - Skills de plataforma (sin autoría propia): solo lectura
 */
export function canEditOwnedSkill(skill: {
  can_edit?: boolean;
  created_by?: string | number | null;
}): boolean {
  if (isSuperAdmin()) return true;
  if (!canManageSkills()) return false;
  if (typeof skill.can_edit === "boolean") return skill.can_edit;
  const user = getStoredUser();
  if (!user?.id || skill.created_by == null || skill.created_by === "") return false;
  return String(skill.created_by) === String(user.id);
}

/**
 * Scope de OWNER de tienda (rol), sin ser organizador ni superadmin.
 */
export function isStoreOwnerScope(): boolean {
  return !isSuperAdmin() && !isOrganizationOwner() && isBranchOwner();
}

export function canCreateAgents(): boolean {
  if (isSuperAdmin()) return true;
  if (isOrganizationOwner()) return true;
  return false;
}

export function canCreateKnowledge(): boolean {
  if (isSuperAdmin()) return true;
  if (isOrganizationOwner()) return true;
  return false;
}

/** Solo superadmin y organizador pueden editar agentes en Studio. */
export function isAgentReadOnly(): boolean {
  if (isSuperAdmin()) return false;
  if (isOrganizationOwner()) return false;
  return true;
}

/**
 * Crear / editar / desactivar canales.
 * - Superadmin y organizador: sí
 * - OWNER y ADMIN_LOCAL: solo lectura
 * - Empleado y roles operativos: solo lectura
 */
export function canManageChannels(branchId?: string | number | null): boolean {
  if (isSuperAdmin()) return true;
  if (isOrganizationOwner()) return true;
  return false;
}

/**
 * Soft-delete / desactivar canal: mismos roles que gestionar.
 */
export function canDeleteChannels(branchId?: string | number | null): boolean {
  return canManageChannels(branchId);
}

/**
 * Borrado físico de canal ya inactivo.
 * - Superadmin, organizador (holding) y OWNER de la sucursal: sí
 * - ADMIN_LOCAL / empleados: no
 */
export function canHardDeleteChannels(branchId?: string | number | null): boolean {
  if (isSuperAdmin()) return true;
  if (isOrganizationOwner()) return true;
  if (branchId == null || branchId === "") {
    return getOwnerBranchIds().length > 0;
  }
  return getOwnerBranchIds().includes(String(branchId));
}

/**
 * Ver recursos inactivos en Studio (agentes, conocimiento, skills, APIs).
 * - Superadmin / organizador (owner de holding): sí (activos + inactivos)
 * - OWNER de sucursal y demás roles: no (solo activos)
 */
export function canViewInactiveStudioResources(): boolean {
  if (isSuperAdmin()) return true;
  if (isOrganizationOwner()) return true;
  // Fallback: rol ORG_OWNER en permisos o asignaciones (por si el login no marcó el flag).
  const perms = getStoredPermissions();
  const role = String(perms?.user_role ?? "")
    .trim()
    .toUpperCase();
  if (role === ROLE_ORG_OWNER) return true;
  return getStoredBranches().some((b) => getAssignmentRoleCode(b) === ROLE_ORG_OWNER);
}

/**
 * Ver conocimiento inactivo (para reactivar / borrar definitivo).
 * - Superadmin / organizador: sí
 * - OWNER de sucursal: sí (sus stores)
 */
export function canViewInactiveKnowledge(): boolean {
  if (canViewInactiveStudioResources()) return true;
  return isBranchOwner();
}

/**
 * Borrado físico de conocimiento.
 * - Superadmin: cualquier sucursal
 * - Organizador: stores de su holding
 * - OWNER: solo sus sucursales
 * - ADMIN_LOCAL / empleados: no
 */
export function canHardDeleteKnowledge(branchId?: string | number | null): boolean {
  if (isSuperAdmin()) return true;
  if (isOrganizationOwner()) {
    if (branchId == null || branchId === "") return true;
    const owned = getOwnerBranchIds();
    if (owned.length === 0) return true;
    return owned.includes(String(branchId));
  }
  return false;
}

/**
 * Desactivar / reactivar conocimiento: mismos roles que pueden borrarlo.
 */
export function canManageKnowledge(branchId?: string | number | null): boolean {
  return canHardDeleteKnowledge(branchId);
}

/**
 * Reactivar conocimiento desactivado.
 */
export function canRestoreKnowledge(branchId?: string | number | null): boolean {
  return canHardDeleteKnowledge(branchId);
}

/**
 * Puede acceder a la sección Agentes (Studio).
 * - Superadmin: sí
 * - Organizador: sí
 * - Cualquier usuario con al menos una sucursal activa: sí
 */
export function canAccessAgents(): boolean {
  if (!getStoredUser()) return false;
  if (isSuperAdmin()) return true;
  if (isOrganizationOwner()) return true;
  return getStoredBranches().some((b) => b.is_active !== false);
}

/** @deprecated Usar canViewInactiveStudioResources */
export function canViewInactiveAgents(): boolean {
  return canViewInactiveStudioResources();
}

/**
 * Label del menú:
 * - Organizador: "Sucursales/Clientes" (stores del holding)
 * - OWNER de una sola tienda: "Mi Sucursal"
 * - Resto: "Sucursales"
 */
export function getBranchesAdminNavLabel(): string {
  if (isOrganizationOwner()) return "Sucursales/Clientes";
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
 * Solo superadmin (plataforma). El organizador no necesita gestionar LLMs.
 */
export function canAccessLlmAdmin(): boolean {
  return isSuperAdmin();
}

/**
 * Crear / editar / eliminar proveedores LLM.
 * Solo superadmin.
 */
export function canManageLlmProviders(): boolean {
  return isSuperAdmin();
}

/** Alias: configurar provider (incluye create/edit). */
export function canConfigureLlmProvider(): boolean {
  return canManageLlmProviders();
}

/**
 * Agregar / editar modelos.
 * Solo superadmin.
 */
export function canMutateLlmModels(): boolean {
  return isSuperAdmin();
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
