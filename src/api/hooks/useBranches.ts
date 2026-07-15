import { useQuery } from "@tanstack/react-query";
import { GET, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { getStoredBranches } from "@/lib/authSession";
import type { BranchAssignment } from "./useAuth";
import { isAuthenticated } from "@/lib/authSession";

export interface BranchSelectOption {
  value: string | number;
  label: string;
  role_code?: string | null;
  is_all_option?: boolean;
}

function normalizeSelectOptions(raw: unknown): BranchSelectOption[] {
  const list = Array.isArray(raw)
    ? raw
    : normalizeListResponse<BranchSelectOption>(raw as { results?: BranchSelectOption[] });

  return list
    .map((item) => {
      const anyItem = item as BranchSelectOption & {
        id?: number | string;
        branch_id?: number | string;
        business_name?: string;
        name?: string;
        branch?: { id?: number; business_name?: string; name?: string };
      };
      const value = anyItem.value ?? anyItem.branch_id ?? anyItem.id ?? anyItem.branch?.id;
      const label =
        anyItem.label ||
        anyItem.business_name ||
        anyItem.name ||
        anyItem.branch?.business_name ||
        anyItem.branch?.name ||
        (value != null ? `Sucursal ${value}` : "");
      return {
        value: value as string | number,
        label: String(label),
        role_code: anyItem.role_code,
        is_all_option: Boolean(anyItem.is_all_option) || String(value) === "all",
      };
    })
    .filter((o) => o.value != null && o.label);
}

/** Sucursales para el select: API real (superadmin ve todas) + fallback sesión. */
export function useMyBranchesSelect() {
  return useQuery({
    queryKey: ["branches", "my-branches-select"],
    queryFn: async () => {
      try {
        const data = await GET<BranchSelectOption[] | { results: BranchSelectOption[] }>(
          ENDPOINTS.branches.myBranchesSelect,
        );
        const options = normalizeSelectOptions(data).filter((o) => !o.is_all_option);
        if (options.length > 0) return options;
      } catch {
        // fallback abajo
      }

      try {
        const data = await GET<unknown>(ENDPOINTS.branches.myBranches);
        const options = normalizeSelectOptions(data).filter((o) => !o.is_all_option);
        if (options.length > 0) return options;
      } catch {
        // fallback sesión
      }

      const stored = getStoredBranches();
      return stored.map((b: BranchAssignment) => ({
        value: b.branch_id,
        label: b.branch_name || b.business_name || `Sucursal ${b.branch_id}`,
        role_code: b.role,
        is_all_option: false,
      }));
    },
    enabled: typeof window !== "undefined" && isAuthenticated(),
    staleTime: 60_000,
  });
}
