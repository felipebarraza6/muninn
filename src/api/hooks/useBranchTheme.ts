import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GET } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { getActiveBranchId, onBranchChange } from "@/lib/branchStorage";
import { getStoredBranches } from "@/lib/authSession";
import { applyResolvedBranchTheme, type BranchThemeLike } from "@/lib/applyBranchTheme";
import { resolveEffectiveTheme, MUNINN_DEFAULT_THEME } from "@/lib/branchThemeDefaults";
import {
  flattenPublicLoginTheme,
  hasUsablePublicBranding,
  type PublicLoginThemeResponse,
} from "@/lib/publicLoginTheme";
import { loginContextFromPublicTheme, persistLoginPortalContext } from "@/lib/loginContext";

export type BranchTheme = BranchThemeLike & {
  id?: number;
  branch?: number;
  branding?: Record<string, unknown>;
  ui_preferences?: Record<string, unknown>;
};

function useActiveBranchIdState() {
  const [branchId, setBranchId] = useState<string | null>(() => getActiveBranchId());
  useEffect(() => {
    return onBranchChange((id) => setBranchId(id));
  }, []);
  return branchId;
}

/** Label de la sucursal activa (sesión o app_name del theme). */
function resolveBranchLabel(
  branchId: string | null,
  apiTheme: BranchThemeLike | null | undefined,
): string | null {
  if (branchId) {
    const stored = getStoredBranches().find((b) => String(b.branch_id) === String(branchId));
    const fromSession = stored?.business_name || stored?.branch_name;
    if (fromSession) return fromSession;
  }
  return apiTheme?.app_name || null;
}

/**
 * Flujo preferido de resolve:
 * 1. by-host (dominio custom)
 * 2. si falla y hay slug → public-login-theme/{slug}
 * 3. si falla → null (Muninn default)
 */
export async function resolvePublicLoginTheme(
  slug?: string | null,
): Promise<PublicLoginThemeResponse | null> {
  // 1) Dominio custom (Host)
  try {
    return await GET<PublicLoginThemeResponse>(ENDPOINTS.branches.publicLoginThemeByHost);
  } catch {
    // 404 u otro → seguir con slug / default
  }

  // 2) /login/{slug} → Branch o Org (incluye fallback branch→org)
  if (slug) {
    try {
      return await GET<PublicLoginThemeResponse>(ENDPOINTS.branches.publicLoginTheme(slug));
    } catch {
      // 404 → login genérico Muninn
    }
  }

  // 3) Theme base Muninn
  return null;
}

export function useBranchTheme(branchIdOverride?: string | null) {
  const activeId = useActiveBranchIdState();
  const branchId = branchIdOverride !== undefined ? branchIdOverride : activeId;

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

  const branchLabel = useMemo(
    () => resolveBranchLabel(branchId, query.data),
    [branchId, query.data],
  );

  const effectiveTheme = useMemo(() => {
    if (query.isError) {
      return resolveEffectiveTheme(null, branchLabel);
    }
    if (query.data) {
      return resolveEffectiveTheme(query.data, branchLabel);
    }
    return undefined;
  }, [query.data, query.isError, branchLabel]);

  useEffect(() => {
    if (query.isError) {
      applyResolvedBranchTheme(null, branchLabel);
      return;
    }
    if (query.data) {
      applyResolvedBranchTheme(query.data, branchLabel);
    }
  }, [query.data, query.isError, branchLabel]);

  return {
    ...query,
    data: effectiveTheme ?? query.data,
    rawTheme: query.data,
  };
}

/**
 * Resuelve branding de login: by-host → slug → Muninn.
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
