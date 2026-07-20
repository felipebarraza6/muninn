import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GET } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { getActiveBranchId, onBranchChange } from "@/lib/branchStorage";
import { getStoredBranches } from "@/lib/authSession";
import {
  applyResolvedBranchTheme,
  resetMuninnTheme,
  type BranchThemeLike,
} from "@/lib/applyBranchTheme";
import { resolveEffectiveTheme, MUNINN_DEFAULT_THEME } from "@/lib/branchThemeDefaults";
import {
  flattenPublicLoginTheme,
  hasUsablePublicBranding,
  type PublicLoginThemeResponse,
} from "@/lib/publicLoginTheme";
import { loginContextFromPublicTheme, persistLoginPortalContext } from "@/lib/loginContext";
import {
  getPrimaryOrganizationId,
  getPrimaryOrganizationName,
  isOrganizationOwner,
  isSuperAdmin,
} from "@/lib/authGuards";
import { useActiveBranch, useOrganizations, type OrganizationTheme } from "./useBranches";

export type BranchTheme = BranchThemeLike & {
  id?: number;
  branch?: number;
  branding?: Record<string, unknown>;
  ui_preferences?: Record<string, unknown>;
};

function pickAssetUrl(...candidates: Array<string | null | undefined>): string | null {
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }
  return null;
}

/**
 * Organizador: el logo/favicon viven en Organization.theme, no en la sucursal.
 * Colores/textos pueden venir del theme de sucursal (o fallback local); overlay de assets del holding.
 */
function overlayOrgBrandAssets(
  branchTheme: BranchThemeLike | null | undefined,
  orgTheme: OrganizationTheme | null | undefined,
  branchLogo?: string | null,
): BranchThemeLike | null | undefined {
  const orgLogo = pickAssetUrl(
    orgTheme?.logo_url,
    orgTheme?.logo,
    orgTheme?.branding?.logo_url ?? undefined,
  );
  const orgFavicon = pickAssetUrl(
    orgTheme?.favicon_url,
    orgTheme?.favicon,
    orgTheme?.branding?.favicon_url ?? undefined,
  );
  const fallbackBranchLogo = pickAssetUrl(branchLogo);

  if (!orgLogo && !orgFavicon && !fallbackBranchLogo) return branchTheme;

  const base: BranchThemeLike = { ...(branchTheme ?? {}) };
  const logo = orgLogo || fallbackBranchLogo;
  if (logo) {
    base.logo_url = logo;
    base.logo = logo;
    base.branding = { ...(base.branding ?? {}), logo_url: logo };
  }
  if (orgFavicon) {
    base.favicon_url = orgFavicon;
    base.favicon = orgFavicon;
    base.branding = { ...(base.branding ?? {}), favicon_url: orgFavicon };
  }
  return base;
}

function useActiveBranchIdState() {
  const [branchId, setBranchId] = useState<string | null>(() => getActiveBranchId());
  useEffect(() => {
    return onBranchChange((id) => setBranchId(id));
  }, []);
  return branchId;
}

function isGenericMuninnName(name: string | null | undefined): boolean {
  return !name?.trim() || name.trim().toLowerCase() === "muninn";
}

/** Hint para bases de color locales (demo); no es el título del header. */
function resolveThemeHintLabel(
  branchId: string | null,
  apiTheme: BranchThemeLike | null | undefined,
): string | null {
  const fromTheme =
    apiTheme?.app_name?.trim() ||
    (typeof apiTheme?.branding?.app_name === "string" ? apiTheme.branding.app_name.trim() : "") ||
    null;
  if (fromTheme && !isGenericMuninnName(fromTheme)) return fromTheme;

  if (branchId) {
    const stored = getStoredBranches().find((b) => String(b.branch_id) === String(branchId));
    return stored?.business_name?.trim() || stored?.branch_name?.trim() || null;
  }
  return fromTheme;
}

/**
 * Flujo de resolve:
 * 1. Con slug → public-login-theme/{slug} (no tocar by-host: en localhost da 404)
 * 2. Sin slug → by-host (dominio custom)
 * 3. Si falla → null (Muninn default)
 */
export async function resolvePublicLoginTheme(
  slug?: string | null,
): Promise<PublicLoginThemeResponse | null> {
  // 1) /login/{slug} → Branch o Org
  if (slug) {
    try {
      return await GET<PublicLoginThemeResponse>(ENDPOINTS.branches.publicLoginTheme(slug));
    } catch {
      // 404 → login genérico Muninn (no caer a by-host con Host=localhost)
    }
    return null;
  }

  // 2) Dominio custom (solo cuando no hay slug en la URL)
  try {
    return await GET<PublicLoginThemeResponse>(ENDPOINTS.branches.publicLoginThemeByHost);
  } catch {
    // 404 esperado en localhost / hosts sin dominio propio
  }

  return null;
}

export function useBranchTheme(branchIdOverride?: string | null) {
  const activeId = useActiveBranchIdState();
  const branchId = branchIdOverride !== undefined ? branchIdOverride : activeId;
  const isOrgOwner = isOrganizationOwner();
  const sessionOrgId = isOrgOwner ? getPrimaryOrganizationId() : null;

  const { data: activeBranch } = useActiveBranch(branchId);
  const branchOrgId =
    isOrgOwner && activeBranch?.organization != null ? String(activeBranch.organization) : null;

  // Si el login no trajo owned_organizations, resolvemos el holding por listado.
  const { data: organizations = [] } = useOrganizations({
    enabled: isOrgOwner && !sessionOrgId && !branchOrgId,
  });
  const listOrgId = isOrgOwner && organizations.length > 0 ? String(organizations[0].id) : null;

  const orgId = sessionOrgId || branchOrgId || listOrgId;

  const query = useQuery({
    queryKey: ["branches", "theme", branchId],
    queryFn: async () => {
      if (!branchId) {
        return GET<BranchTheme>(ENDPOINTS.branches.myDefaultTheme);
      }
      return GET<BranchTheme>(ENDPOINTS.branches.themeConfig(branchId));
    },
    enabled: typeof window !== "undefined",
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const orgThemeQuery = useQuery({
    queryKey: ["branches", "organizations", orgId, "theme"],
    queryFn: () => GET<OrganizationTheme>(ENDPOINTS.branches.organizationTheme(orgId!)),
    enabled: Boolean(orgId) && typeof window !== "undefined",
    staleTime: 60_000,
    retry: 1,
  });

  const themeWithOrgAssets = useMemo(
    () =>
      overlayOrgBrandAssets(
        query.data,
        orgThemeQuery.data,
        // Branch.logo del modelo (a veces tiene asset aunque theme-config no).
        activeBranch?.logo ?? null,
      ),
    [query.data, orgThemeQuery.data, activeBranch?.logo],
  );

  const themeHintLabel = useMemo(
    () =>
      resolveThemeHintLabel(
        branchId,
        themeWithOrgAssets ??
          ({
            app_name:
              getPrimaryOrganizationName() ||
              activeBranch?.fantasy_name ||
              activeBranch?.business_name ||
              null,
          } as BranchThemeLike),
      ),
    [branchId, themeWithOrgAssets, activeBranch?.fantasy_name, activeBranch?.business_name],
  );

  const effectiveTheme = useMemo(() => {
    if (query.isError && !orgThemeQuery.data && !activeBranch?.logo) {
      return resolveEffectiveTheme(null, themeHintLabel);
    }
    if (themeWithOrgAssets) {
      return resolveEffectiveTheme(themeWithOrgAssets, themeHintLabel);
    }
    return undefined;
  }, [themeWithOrgAssets, query.isError, orgThemeQuery.data, activeBranch?.logo, themeHintLabel]);

  useEffect(() => {
    // Superadmin: siempre branding Muninn (no heredar logo/colores de la sucursal activa).
    if (isSuperAdmin()) {
      resetMuninnTheme();
      document.title = "Muninn — Agentes";
      return;
    }

    if (query.isError && !orgThemeQuery.data && !activeBranch?.logo) {
      applyResolvedBranchTheme(null, themeHintLabel);
    } else if (themeWithOrgAssets) {
      applyResolvedBranchTheme(themeWithOrgAssets, themeHintLabel);
    }

    // Organizador: título de pestaña = nombre del holding.
    if (isOrganizationOwner()) {
      const orgName =
        getPrimaryOrganizationName() ||
        activeBranch?.organization_name?.trim() ||
        organizations[0]?.name?.trim() ||
        null;
      if (orgName) {
        document.title = `${orgName} — Agentes`;
      }
    }
  }, [
    themeWithOrgAssets,
    query.isError,
    orgThemeQuery.data,
    activeBranch?.logo,
    activeBranch?.organization_name,
    organizations,
    themeHintLabel,
  ]);

  const muninnTheme = useMemo(
    () =>
      isSuperAdmin() ? resolveEffectiveTheme({ ...MUNINN_DEFAULT_THEME }, "Muninn") : undefined,
    [],
  );

  return {
    ...query,
    data: muninnTheme ?? effectiveTheme ?? themeWithOrgAssets ?? query.data,
    rawTheme: isSuperAdmin() ? { ...MUNINN_DEFAULT_THEME } : (themeWithOrgAssets ?? query.data),
    branchLabel: isSuperAdmin() ? "Muninn" : themeHintLabel,
    isFetching: query.isFetching || orgThemeQuery.isFetching,
  };
}

/**
 * Resuelve branding de login: slug → by-host (sin slug) → Muninn.
 * Persiste contexto portal para post-login (X-Branch-ID).
 */
export function useResolvePublicLoginTheme(slug?: string | null) {
  const host = typeof window !== "undefined" ? window.location.host : "";

  const query = useQuery({
    queryKey: ["branches", "public-login-theme", "resolve", host, slug ?? ""],
    queryFn: () => resolvePublicLoginTheme(slug),
    enabled: typeof window !== "undefined",
    staleTime: 10 * 60 * 1000,
    retry: false,
  });

  const raw = query.data ?? null;
  const flat = useMemo(() => (raw ? flattenPublicLoginTheme(raw) : null), [raw]);
  const isAppDefault = !raw || !hasUsablePublicBranding(raw);

  const effectiveTheme = useMemo(() => {
    if (isAppDefault) {
      return resolveEffectiveTheme(null, null);
    }
    return resolveEffectiveTheme(flat as BranchThemeLike, flat?.app_name || slug);
  }, [flat, isAppDefault, slug]);

  useEffect(() => {
    if (query.isLoading) return;

    const ctx = loginContextFromPublicTheme(raw, { host, slug });
    persistLoginPortalContext(ctx);

    if (isAppDefault) {
      applyResolvedBranchTheme({ ...MUNINN_DEFAULT_THEME }, "Muninn");
      return;
    }
    if (flat) {
      applyResolvedBranchTheme(flat as BranchThemeLike, flat.app_name || slug);
    }
  }, [query.isLoading, raw, flat, isAppDefault, host, slug]);

  return {
    ...query,
    raw,
    flat,
    scope: raw?.scope ?? (isAppDefault ? ("app" as const) : undefined),
    isAppDefault,
    data: effectiveTheme,
    stores: raw?.stores ?? [],
    branchId: raw?.branch_id != null ? String(raw.branch_id) : null,
    organizationId: raw?.organization_id != null ? String(raw.organization_id) : null,
  };
}

/** @deprecated Preferir useResolvePublicLoginTheme */
export function usePublicLoginTheme(slug: string | undefined) {
  return useResolvePublicLoginTheme(slug);
}
