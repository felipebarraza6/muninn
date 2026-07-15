import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GET } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { getActiveBranchId, onBranchChange } from "@/lib/branchStorage";
import { applyBranchTheme, resetHuginnTheme, type BranchThemeLike } from "@/lib/applyBranchTheme";

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

  useEffect(() => {
    if (query.data) {
      applyBranchTheme(query.data);
    } else if (query.isError) {
      resetHuginnTheme();
    }
  }, [query.data, query.isError]);

  return query;
}

export function usePublicLoginTheme(slug: string | undefined) {
  const query = useQuery({
    queryKey: ["branches", "public-login-theme", slug],
    queryFn: () => GET<BranchTheme>(ENDPOINTS.branches.publicLoginTheme(slug!)),
    enabled: Boolean(slug),
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (query.data) applyBranchTheme(query.data);
  }, [query.data]);

  return query;
}
