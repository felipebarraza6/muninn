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

  const themeHintLabel = useMemo(
    () => resolveThemeHintLabel(branchId, query.data),
    [branchId, query.data],
  );

  const effectiveTheme = useMemo(() => {
    if (query.isError) {
      return resolveEffectiveTheme(null, themeHintLabel);
    }
    if (query.data) {
      return resolveEffectiveTheme(query.data, themeHintLabel);
    }
    return undefined;
  }, [query.data, query.isError, themeHintLabel]);

  useEffect(() => {
    if (query.isError) {
      applyResolvedBranchTheme(null, themeHintLabel);
      return;
    }
    if (query.data) {
      applyResolvedBranchTheme(query.data, themeHintLabel);
    }
  }, [query.data, query.isError, themeHintLabel]);

  return {
    ...query,
    data: effectiveTheme ?? query.data,
    rawTheme: query.data,
    branchLabel: themeHintLabel,
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
