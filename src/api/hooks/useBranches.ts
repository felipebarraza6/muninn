import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DELETE, GET, GET_ALL_PAGES, PATCH, POST, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { getStoredBranches, isAuthenticated } from "@/lib/authSession";
import { getActiveBranchId, onBranchChange } from "@/lib/branchStorage";
import type { BranchAssignment } from "./useAuth";

export interface BranchSelectOption {
  value: string | number;
  label: string;
  role_code?: string | null;
  is_all_option?: boolean;
}

/** Links dinámicos de marca (espejo de sponsors en theme_config). */
export interface SocialLink {
  name: string;
  url: string;
  icon?: string | null;
  enabled?: boolean;
  order?: number;
}

/** Campos alineados a BranchRequest / BranchDetailRequest (Redoc app=branches). */
export interface AdminBranch {
  id: number | string;
  business_name: string;
  fantasy_name?: string | null;
  commercial_business?: string | null;
  phone?: string | null;
  dni?: string | null;
  email?: string | null;
  region?: string | null;
  province?: string | null;
  commune?: string | null;
  address?: string | null;
  logo?: string | null;
  owner_id?: number | string | null;
  is_active?: boolean;
  allow_multi_branch_access?: boolean;
  allow_public_customer_signup?: boolean;
  custom_domain?: string | null;
  from_email?: string | null;
  organization?: number | string | null;
  organization_name?: string | null;
  plan?: number | string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  login_slug?: string | null;
  login_welcome_message?: string | null;
  login_subtitle?: string | null;
  tagline?: string | null;
  website_url?: string | null;
  brand_description?: string | null;
  social_links?: SocialLink[];
  favicon?: string | null;
  banner_image?: string | null;
  algorithm?: string | null;
  /** Lectura anidada del serializer (canonical). */
  theme_config?: {
    id?: number | string;
    app_name?: string | null;
    primary_color?: string | null;
    secondary_color?: string | null;
    font_size?: number | null;
    borderRadius?: number | null;
    compact?: boolean | null;
    motion?: boolean | null;
    tagline?: string | null;
    website_url?: string | null;
    brand_description?: string | null;
    social_links?: SocialLink[];
    logo?: string | null;
    favicon?: string | null;
    banner_image?: string | null;
    algorithm?: string | null;
    login_slug?: string | null;
    login_welcome_message?: string | null;
    login_subtitle?: string | null;
    show_sponsor_logos?: boolean;
    sponsor_logos?: Array<{
      name?: string;
      logo_url?: string;
      website_url?: string;
      enabled?: boolean;
      order?: number;
    }> | null;
    branding?: {
      logo_url?: string | null;
      favicon_url?: string | null;
      banner_image_url?: string | null;
      social_links?: SocialLink[];
    } | null;
  } | null;
  login_config?: {
    login_slug?: string | null;
    login_welcome_message?: string | null;
    login_subtitle?: string | null;
    show_sponsor_logos?: boolean;
    sponsor_logos?: Array<{
      name?: string;
      logo_url?: string;
      website_url?: string;
      enabled?: boolean;
      order?: number;
    }> | null;
  } | null;
  sii_enabled?: boolean;
  sii_resolution_number?: string | null;
  sii_resolution_date?: string | null;
}

export interface Organization {
  id: number | string;
  name: string;
  business_name?: string | null;
  dni?: string | null;
  owner?: number | string | null;
  owner_email?: string | null;
  max_branches?: number;
  custom_domain?: string | null;
  is_active?: boolean;
  stores_count?: number;
  can_add_store?: boolean | string;
  login_slug?: string | null;
}

export interface OrganizationStore {
  id: number | string;
  business_name?: string;
  fantasy_name?: string | null;
  dni?: string | null;
  email?: string | null;
  phone?: string | null;
  is_active?: boolean;
  commune?: string | null;
  region?: string | null;
}

export interface OrganizationTheme {
  app_name?: string | null;
  logo?: string | null;
  logo_url?: string | null;
  favicon?: string | null;
  favicon_url?: string | null;
  banner_image?: string | null;
  banner_image_url?: string | null;
  tagline?: string | null;
  website_url?: string | null;
  brand_description?: string | null;
  social_links?: SocialLink[];
  primary_color?: string | null;
  secondary_color?: string | null;
  font_size?: number | null;
  borderRadius?: number | null;
  compact?: boolean | null;
  motion?: boolean | null;
  algorithm?: string | null;
  login_slug?: string | null;
  login_welcome_message?: string | null;
  login_subtitle?: string | null;
  show_sponsor_logos?: boolean;
  sponsor_logos?: Array<{
    name?: string;
    logo_url?: string;
    website_url?: string;
    enabled?: boolean;
    order?: number;
  }> | null;
  branding?: {
    logo_url?: string | null;
    favicon_url?: string | null;
    banner_image_url?: string | null;
    social_links?: SocialLink[];
  } | null;
  is_active?: boolean;
}

export interface BranchRole {
  id: number | string;
  code?: string;
  name?: string;
  branch?: number | string;
  hierarchy_level?: number;
  is_system?: boolean;
  /** Alias del action GET /branches/{id}/roles/ */
  value?: string;
  label?: string;
}

/** En Muninn solo se asignan Propietario, Administrador local y Empleado. */
export const MUNINN_ASSIGNABLE_ROLE_CODES = ["OWNER", "ADMIN_LOCAL", "EMPLOYEE"] as const;

/** Roles estándar si la API no devuelve definiciones para la sucursal. */
export const FALLBACK_BRANCH_ROLES: BranchRole[] = [
  { id: "OWNER", code: "OWNER", name: "Propietario", hierarchy_level: 1 },
  { id: "ADMIN_LOCAL", code: "ADMIN_LOCAL", name: "Administrador local", hierarchy_level: 2 },
  { id: "EMPLOYEE", code: "EMPLOYEE", name: "Empleado", hierarchy_level: 5 },
];

function normalizeBranchRoles(raw: unknown, branchId: string | number): BranchRole[] {
  const list = Array.isArray(raw)
    ? raw
    : normalizeListResponse<BranchRole>(raw as { results?: BranchRole[] });

  const allowed = new Set<string>(MUNINN_ASSIGNABLE_ROLE_CODES);

  const mapped = list
    .map((r) => {
      const code = (r.code || r.value || String(r.id)).trim();
      const name = (r.name || r.label || code).trim();
      return {
        id: r.id,
        code,
        name,
        branch: r.branch ?? branchId,
        hierarchy_level: typeof r.hierarchy_level === "number" ? r.hierarchy_level : 999,
        is_system: r.is_system,
      } satisfies BranchRole;
    })
    .filter((r) => allowed.has(r.code));

  return mapped.sort((a, b) => {
    const ha = a.hierarchy_level ?? 999;
    const hb = b.hierarchy_level ?? 999;
    if (ha !== hb) return ha - hb;
    return (a.name || "").localeCompare(b.name || "", "es", { sensitivity: "base" });
  });
}

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
const ORGS_KEY = ["branches", "organizations"];

export function useAdminBranches(options?: {
  refetchOnMount?: boolean | "always";
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: BRANCHES_KEY,
    queryFn: () =>
      GET<AdminBranch[] | { results: AdminBranch[] }>(ENDPOINTS.branches.list, {
        params: { page_size: 200 },
      }).then((data) => normalizeListResponse<AdminBranch>(data)),
    staleTime: 30_000,
    refetchOnMount: options?.refetchOnMount ?? "always",
    enabled: options?.enabled ?? true,
  });
}

/** Invalidación del admin de sucursales (+ orgs por stores_count). */
export function useRefreshBranches() {
  const qc = useQueryClient();
  return async () => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: BRANCHES_KEY }),
      qc.invalidateQueries({ queryKey: ORGS_KEY }),
      qc.invalidateQueries({ queryKey: ["branches", "my-branches-select"] }),
    ]);
  };
}

export function useCreateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AdminBranch> | FormData) =>
      POST<AdminBranch>(
        ENDPOINTS.branches.list,
        data,
        data instanceof FormData
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : undefined,
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BRANCHES_KEY });
      qc.invalidateQueries({ queryKey: ORGS_KEY });
      qc.invalidateQueries({ queryKey: ["branches", "my-branches-select"] });
    },
  });
}

export function useUpdateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<AdminBranch> | FormData }) =>
      PATCH<AdminBranch>(
        ENDPOINTS.branches.detail(id),
        data,
        data instanceof FormData
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : undefined,
      ),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: BRANCHES_KEY });
      qc.invalidateQueries({ queryKey: ORGS_KEY });
      qc.invalidateQueries({ queryKey: ["branches", "my-branches-select"] });
      qc.invalidateQueries({ queryKey: ["branches", "detail", String(vars.id)] });
    },
  });
}

/** Sucursal activa (detalle): usa `fantasy_name` para el header. */
export function useActiveBranch(branchIdOverride?: string | null) {
  const [activeId, setActiveId] = useState<string | null>(() => getActiveBranchId());
  useEffect(() => onBranchChange((id) => setActiveId(id)), []);
  const branchId = branchIdOverride !== undefined ? branchIdOverride : activeId;

  return useQuery({
    queryKey: ["branches", "detail", branchId],
    queryFn: () => GET<AdminBranch>(ENDPOINTS.branches.detail(branchId!)),
    enabled: Boolean(branchId) && typeof window !== "undefined" && isAuthenticated(),
    staleTime: 60_000,
  });
}

export type BranchThemeConfigResponse = {
  id?: number | string;
  app_name?: string | null;
  logo?: string | null;
  favicon?: string | null;
  banner_image?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  font_size?: number | null;
  borderRadius?: number | null;
  compact?: boolean | null;
  motion?: boolean | null;
  tagline?: string | null;
  website_url?: string | null;
  brand_description?: string | null;
  social_links?: SocialLink[];
  login_slug?: string | null;
  login_welcome_message?: string | null;
  login_subtitle?: string | null;
  show_sponsor_logos?: boolean;
  sponsor_logos?: Array<{
    name?: string;
    logo_url?: string;
    website_url?: string;
    enabled?: boolean;
    order?: number;
  }> | null;
  branding?: {
    logo_url?: string | null;
    favicon_url?: string | null;
    banner_image_url?: string | null;
    social_links?: SocialLink[];
  } | null;
  ui_preferences?: {
    font_size_px?: number | null;
    border_radius_px?: number | null;
    motion_enabled?: boolean | null;
    density?: string | null;
  } | null;
};

/** GET `/branches/{id}/theme-config/` — URLs absolutas de branding. */
export function useBranchThemeConfig(branchId?: string | number | null) {
  return useQuery({
    queryKey: ["branches", branchId, "theme-config"],
    queryFn: () => GET<BranchThemeConfigResponse>(ENDPOINTS.branches.themeConfig(branchId!)),
    enabled: Boolean(branchId),
    staleTime: 15_000,
  });
}

/** Theme/branding: PATCH `/branches/{id}/theme-config/` (logo/favicon/banner theme). */
export function useUpdateBranchThemeConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: FormData | Record<string, unknown> }) =>
      PATCH<BranchThemeConfigResponse>(
        ENDPOINTS.branches.themeConfig(id),
        data,
        data instanceof FormData
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : undefined,
      ),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: BRANCHES_KEY });
      qc.invalidateQueries({ queryKey: ["branches", vars.id, "theme-config"] });
      // Sidebar / applyBranchTheme usan esta key
      qc.invalidateQueries({ queryKey: ["branches", "theme", String(vars.id)] });
      qc.invalidateQueries({ queryKey: ["branches", "my-branches-select"] });
    },
  });
}

/** Roles de la sucursal filtrados a los asignables en Muninn (OWNER, ADMIN_LOCAL, EMPLOYEE). */
export function useBranchRoles(branchId?: string | number | null) {
  return useQuery({
    queryKey: ["branches", "roles", branchId, "muninn-v2"],
    queryFn: async () => {
      if (!branchId) return [];
      // Path explícito: no depende de x-branch-id ni del switcher activo.
      const data = await GET<BranchRole[] | { results: BranchRole[] }>(
        ENDPOINTS.branches.branchRoles(branchId),
      );
      const list = normalizeBranchRoles(data, branchId);
      return list.length > 0 ? list : FALLBACK_BRANCH_ROLES;
    },
    enabled: Boolean(branchId),
    staleTime: 60_000,
  });
}

export function useOrganizations(options?: {
  refetchOnMount?: boolean | "always";
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ORGS_KEY,
    queryFn: () =>
      GET<Organization[] | { results: Organization[] }>(ENDPOINTS.branches.organizations, {
        params: { page_size: 200 },
      }).then((data) => normalizeListResponse<Organization>(data)),
    staleTime: 30_000,
    refetchOnMount: options?.refetchOnMount ?? "always",
    enabled: options?.enabled ?? true,
  });
}

export type OrganizationSyncVersion = {
  version: string;
  count: number;
  org_updated_at?: string | null;
  theme_updated_at?: string | null;
  store_updated_at?: string | null;
};

/** Poll liviano: si `version` cambia, invalida el listado de organizaciones. */
export function useOrganizationSyncVersion(enabled = true) {
  const qc = useQueryClient();
  const lastVersionRef = useRef<string | null>(null);

  const query = useQuery({
    queryKey: [...ORGS_KEY, "sync-version"],
    queryFn: () => GET<OrganizationSyncVersion>(ENDPOINTS.branches.organizationSyncVersion),
    enabled,
    staleTime: 0,
    refetchInterval: enabled ? 15_000 : false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const version = query.data?.version;
    if (!version) return;
    const prev = lastVersionRef.current;
    if (prev && prev !== version) {
      // Solo el listado: no re-disparar sync-version (evita bucle).
      void qc.invalidateQueries({ queryKey: ORGS_KEY, exact: true });
    }
    lastVersionRef.current = version;
  }, [query.data?.version, qc]);

  return query;
}

/** Invalidación completa del admin de organizaciones (lista + sync + stores). */
export function useRefreshOrganizations() {
  const qc = useQueryClient();
  return async () => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: ORGS_KEY }),
      qc.invalidateQueries({ queryKey: BRANCHES_KEY }),
    ]);
  };
}

export function useCreateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Organization>) =>
      POST<Organization>(ENDPOINTS.branches.organizations, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ORGS_KEY }),
  });
}

export function useUpdateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<Organization> }) =>
      PATCH<Organization>(ENDPOINTS.branches.organizationDetail(id), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ORGS_KEY }),
  });
}

export function useDeleteOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => DELETE(ENDPOINTS.branches.organizationDetail(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ORGS_KEY }),
  });
}

export function useOrganizationStores(orgId?: string | number | null) {
  return useQuery({
    queryKey: ["branches", "organizations", orgId, "stores"],
    queryFn: () =>
      GET<OrganizationStore[] | { results: OrganizationStore[] }>(
        ENDPOINTS.branches.organizationStores(orgId!),
      ).then((data) => normalizeListResponse<OrganizationStore>(data)),
    enabled: Boolean(orgId),
    staleTime: 30_000,
  });
}

export function useAttachStore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, branchId }: { orgId: string | number; branchId: string | number }) =>
      POST(ENDPOINTS.branches.organizationAttachStore(orgId), { branch_id: branchId }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ORGS_KEY });
      qc.invalidateQueries({ queryKey: ["branches", "organizations", vars.orgId, "stores"] });
      qc.invalidateQueries({ queryKey: BRANCHES_KEY });
    },
  });
}

export function useDetachStore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orgId, branchId }: { orgId: string | number; branchId: string | number }) =>
      POST(ENDPOINTS.branches.organizationDetachStore(orgId), { branch_id: branchId }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ORGS_KEY });
      qc.invalidateQueries({ queryKey: ["branches", "organizations", vars.orgId, "stores"] });
      qc.invalidateQueries({ queryKey: BRANCHES_KEY });
    },
  });
}

export function useOrganizationTheme(orgId?: string | number | null) {
  return useQuery({
    queryKey: ["branches", "organizations", orgId, "theme"],
    queryFn: () => GET<OrganizationTheme>(ENDPOINTS.branches.organizationTheme(orgId!)),
    enabled: Boolean(orgId),
    staleTime: 60_000,
  });
}

export function useUpdateOrganizationTheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: FormData | Partial<OrganizationTheme>;
    }) =>
      PATCH<OrganizationTheme>(
        ENDPOINTS.branches.organizationTheme(id),
        data,
        data instanceof FormData
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : undefined,
      ),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["branches", "organizations", vars.id, "theme"] });
      qc.invalidateQueries({ queryKey: ORGS_KEY });
    },
  });
}

export function useBranchUsers(options?: { allBranches?: boolean }) {
  const allBranches = Boolean(options?.allBranches);
  return useQuery({
    queryKey: ["branches", "users", allBranches ? "all" : "active"],
    queryFn: () =>
      GET_ALL_PAGES<BranchUserAssignment>(ENDPOINTS.branches.users, {
        // Admin usuarios: ver asignaciones de todas las sucursales (superadmin).
        ...(allBranches ? { skipBranchHeader: true } : {}),
      }),
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
