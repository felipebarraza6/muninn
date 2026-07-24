import { useMemo } from "react";
import {
  useOrganizationRoleApps,
  useOrganizations,
} from "@/api/hooks/useBranches";
import { getStoredBranches } from "@/lib/authSession";
import {
  getAssignmentRoleCode,
  getOwnedOrganizationIds,
  isOrganizationOwner,
  isSuperAdmin,
  ROLE_ADMIN_LOCAL,
  ROLE_OWNER,
} from "@/lib/authGuards";

const ROLE_EMPLOYEE = "EMPLOYEE";
const STORE_ROLES = [ROLE_OWNER, ROLE_ADMIN_LOCAL, ROLE_EMPLOYEE] as const;

/**
 * Filtro defensivo del store: IDs designados por org/rol.
 * null = sin filtro extra (superadmin o sin designación).
 */
export function useDesignatedStoreAppIds(): {
  ready: boolean;
  allowedIds: Set<string> | null;
} {
  const isSA = isSuperAdmin();
  const orgOwner = isOrganizationOwner();
  const ownedIds = getOwnedOrganizationIds();

  const { data: orgs = [], isLoading: orgsLoading } = useOrganizations({
    enabled: !isSA && ownedIds.length === 0,
  });

  const orgId = useMemo(() => {
    if (ownedIds.length > 0) return ownedIds[0]!;
    if (orgs[0]?.id != null) return String(orgs[0].id);
    return null;
  }, [ownedIds, orgs]);

  const { data: roleApps, isLoading: roleLoading, isError } = useOrganizationRoleApps(
    isSA ? null : orgId,
  );

  const userRoles = useMemo(() => {
    const roles = new Set<string>();
    if (orgOwner) roles.add(ROLE_OWNER);
    for (const b of getStoredBranches().filter((x) => x.is_active !== false)) {
      const code = getAssignmentRoleCode(b);
      if (code === "ORG_OWNER") roles.add(ROLE_OWNER);
      else if (STORE_ROLES.includes(code as (typeof STORE_ROLES)[number])) {
        roles.add(code);
      }
    }
    return roles;
  }, [orgOwner]);

  return useMemo(() => {
    if (isSA) return { ready: true, allowedIds: null };
    if (!orgId) {
      return { ready: !orgsLoading, allowedIds: null };
    }
    if (roleLoading) return { ready: false, allowedIds: null };
    if (isError || !roleApps) return { ready: true, allowedIds: null };

    const orgAllowed = (roleApps.org_allowed_external_api_ids ?? []).map(String);
    const orgRestricted = orgAllowed.length > 0;
    const byRole = roleApps.roles ?? {
      OWNER: [],
      ADMIN_LOCAL: [],
      EMPLOYEE: [],
    };

    const visible = new Set<string>();
    let any = false;

    if (orgOwner) {
      if (orgRestricted) {
        any = true;
        for (const id of orgAllowed) visible.add(id);
      } else if ((byRole.OWNER ?? []).length > 0) {
        any = true;
        for (const id of byRole.OWNER) visible.add(String(id));
      }
    }

    for (const code of STORE_ROLES) {
      if (!userRoles.has(code)) continue;
      // Evitar duplicar el cupo OWNER ya aplicado como organizador.
      if (orgOwner && code === ROLE_OWNER && (orgRestricted || (byRole.OWNER ?? []).length > 0)) {
        continue;
      }
      const roleSet = (byRole[code] ?? []).map(String);
      if (orgRestricted) {
        any = true;
        if (roleSet.length > 0) {
          const allow = new Set(orgAllowed);
          for (const id of roleSet) if (allow.has(id)) visible.add(id);
        } else {
          for (const id of orgAllowed) visible.add(id);
        }
      } else if (roleSet.length > 0) {
        any = true;
        for (const id of roleSet) visible.add(id);
      }
    }

    return { ready: true, allowedIds: any ? visible : null };
  }, [isSA, orgId, orgsLoading, roleLoading, isError, roleApps, orgOwner, userRoles]);
}
