import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GET } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { getActiveBranchId, onBranchChange } from "@/lib/branchStorage";
import { getStoredBranches } from "@/lib/authSession";
import { applyResolvedBranchTheme, type BranchThemeLike } from "@/lib/applyBranchTheme";
import { resolveEffectiveTheme } from "@/lib/branchThemeDefaults";

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

export function usePublicLoginTheme(slug: string | undefined) {
  const query = useQuery({
    queryKey: ["branches", "public-login-theme", slug],
    queryFn: () => GET<BranchTheme>(ENDPOINTS.branches.publicLoginTheme(slug!)),
    enabled: Boolean(slug),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  const effectiveTheme = useMemo(() => {
    if (!query.data) return undefined;
    return resolveEffectiveTheme(query.data, query.data.app_name || slug);
  }, [query.data, slug]);

  useEffect(() => {
    if (query.data) {
      applyResolvedBranchTheme(query.data, query.data.app_name || slug);
    }
  }, [query.data, slug]);

  return {
    ...query,
    data: effectiveTheme ?? query.data,
    rawTheme: query.data,
  };
}
