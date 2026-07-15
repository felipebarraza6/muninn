import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DELETE, GET, PATCH, POST, normalizeListResponse } from "../client";
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

export interface AdminBranch {
  id: number | string;
  business_name: string;
  fantasy_name?: string | null;
  commercial_business?: string | null;
  email?: string | null;
  phone?: string | null;
  custom_domain?: string | null;
  is_active?: boolean;
  primary_color?: string | null;
  login_slug?: string | null;
  organization?: number | string | null;
  organization_name?: string | null;
}

export interface Organization {
  id: number | string;
  name: string;
  business_name?: string | null;
  dni?: string | null;
  owner?: number | string | null;
  owner_email?: string | null;
  max_branches?: number;
  is_active?: boolean;
  stores_count?: number;
  can_add_store?: boolean;
}

export interface BranchRole {
  id: number | string;
  code?: string;
  name?: string;
  branch?: number | string;
}

/** Roles estándar si la API no devuelve definiciones para la sucursal. */
export const FALLBACK_BRANCH_ROLES: BranchRole[] = [
  { id: "EMPLOYEE", code: "EMPLOYEE", name: "Empleado" },
  { id: "ADMIN_LOCAL", code: "ADMIN_LOCAL", name: "Administrador local" },
  { id: "OWNER", code: "OWNER", name: "Propietario" },
];

export interface BranchUserAssignment {
  id: number | string;
  user: number | string;
  user_name?: string;
  user_email?: string;
  branch: number | string;
  branch_name?: string;
  role_definition?: number | string;
  role_code?: string;
  role_name?: string;
  is_active?: boolean;
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

const BRANCHES_KEY = ["branches", "admin-list"];

export function useAdminBranches() {
  return useQuery({
    queryKey: BRANCHES_KEY,
    queryFn: () =>
      GET<AdminBranch[] | { results: AdminBranch[] }>(ENDPOINTS.branches.list).then((data) =>
        normalizeListResponse<AdminBranch>(data),
      ),
    staleTime: 30_000,
  });
}

export function useCreateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AdminBranch>) => POST<AdminBranch>(ENDPOINTS.branches.list, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BRANCHES_KEY });
      qc.invalidateQueries({ queryKey: ["branches", "my-branches-select"] });
    },
  });
}

export function useUpdateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<AdminBranch> }) =>
      PATCH<AdminBranch>(ENDPOINTS.branches.detail(id), data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BRANCHES_KEY });
      qc.invalidateQueries({ queryKey: ["branches", "my-branches-select"] });
    },
  });
}

export function useBranchRoles(branchId?: string | number | null) {
  return useQuery({
    queryKey: ["branches", "roles", branchId],
    queryFn: async () => {
      if (!branchId) return [];
      const data = await GET<BranchRole[] | { results: BranchRole[] }>(ENDPOINTS.branches.roles, {
        // El ViewSet filtra por request.branch (header), no por query.
        headers: { "x-branch-id": String(branchId) },
      });
      const list = normalizeListResponse<BranchRole>(data);
      return list.length > 0 ? list : FALLBACK_BRANCH_ROLES;
    },
    enabled: Boolean(branchId),
    staleTime: 60_000,
  });
}

export function useOrganizations() {
  return useQuery({
    queryKey: ["branches", "organizations"],
    queryFn: () =>
      GET<Organization[] | { results: Organization[] }>(ENDPOINTS.branches.organizations).then(
        (data) => normalizeListResponse<Organization>(data),
      ),
    staleTime: 60_000,
  });
}

export function useBranchUsers() {
  return useQuery({
    queryKey: ["branches", "users"],
    queryFn: () =>
      GET<BranchUserAssignment[] | { results: BranchUserAssignment[] }>(
        ENDPOINTS.branches.users,
      ).then((data) => normalizeListResponse<BranchUserAssignment>(data)),
    staleTime: 30_000,
  });
}

export function useCreateBranchUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      user: string | number;
      branch: string | number;
      role_definition: string | number;
      is_active?: boolean;
    }) =>
      POST<BranchUserAssignment>(ENDPOINTS.branches.users, data, {
        headers: { "x-branch-id": String(data.branch) },
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["branches", "users"] }),
  });
}

export function useDeleteBranchUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => DELETE(ENDPOINTS.branches.userDetail(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["branches", "users"] }),
  });
}
