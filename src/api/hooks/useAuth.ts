import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { POST, GET, PATCH, apiClient } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { setActiveBranchId, syncBranchId } from "@/lib/branchStorage";
import { clearSession, persistSession, updateStoredUser } from "@/lib/authSession";
import {
  clearLoginPortalContext,
  getLoginPortalContext,
  type LoginPortalContext,
} from "@/lib/loginContext";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface BranchAssignment {
  id: number;
  branch_id: number;
  branch_name: string;
  business_name: string;
  commercial_business: string;
  role: string;
  role_display: string;
  /** Presente en login_complete. */
  role_code?: string;
  role_name?: string;
  is_active: boolean;
  assigned_at: string;
  owner?: {
    id: number;
    username: string;
    full_name: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  type_user: string;
  is_superuser: boolean;
  is_staff?: boolean;
  is_active?: boolean;
  is_admin: boolean;
  is_client: boolean;
  is_multi_branch?: boolean;
  is_organization_owner?: boolean;
  owned_organizations?: OwnedOrganization[];
  dni?: string;
  last_login?: string | null;
  created?: string | null;
  branch_assignments: BranchAssignment[];
}

export interface OwnedOrganization {
  id: number;
  name?: string;
  business_name?: string;
  stores_count?: number;
}

export interface AuthPermissions {
  user_role: string;
  enabled_apps: string[];
  read_only_apps: string[];
  disabled_apps: string[];
}

/** Respuesta real de login_complete (más rica que UserModel en OpenAPI). */
export interface LoginCompleteResponse {
  user: User;
  branches: BranchAssignment[];
  owned_organizations?: OwnedOrganization[];
  permissions: AuthPermissions;
  token: string;
  message?: string;
}

function pickFromContext(
  branches: BranchAssignment[],
  ctx: LoginPortalContext | null,
  isSuperuser: boolean,
): boolean {
  if (!ctx || ctx.scope === "app") return false;

  const accessible = (id: string | number) =>
    branches.some((b) => String(b.branch_id) === String(id) && b.is_active !== false);

  // Login de tienda (o fallback branch→org con branch_id).
  if (ctx.branchId && (isSuperuser || accessible(ctx.branchId))) {
    setActiveBranchId(ctx.branchId, true, isSuperuser);
    return true;
  }

  // Portal org: preferir stores del branding que el usuario pueda ver.
  if (ctx.scope === "organization" && ctx.stores.length > 0) {
    const overlap = ctx.stores
      .map((s) => String(s.id))
      .filter((id) => isSuperuser || accessible(id));

    if (overlap.length >= 1) {
      setActiveBranchId(overlap[0], true, isSuperuser);
      return true;
    }
  }

  return false;
}

/**
 * Elige sucursal activa tras login:
 * 1) contexto del portal (branch_id / stores de org)
 * 2) única asignación
 * 3) sync previa / primera activa (descarta branch stale)
 *
 * Nota: el organizador mantiene sucursal activa (tema/logo/favicon),
 * pero el switcher del header está oculto — filtra por pantalla.
 */
export function selectDefaultBranch(user: User, branches: BranchAssignment[]) {
  const ctx = getLoginPortalContext();
  if (pickFromContext(branches, ctx, user.is_superuser)) {
    clearLoginPortalContext();
    return;
  }

  if (branches.length === 1) {
    setActiveBranchId(branches[0].branch_id, true, user.is_superuser);
    clearLoginPortalContext();
    return;
  }

  const existing = syncBranchId();
  const existingOk =
    Boolean(existing) &&
    (user.is_superuser ||
      branches.some((b) => String(b.branch_id) === String(existing) && b.is_active !== false));
  if (existingOk) {
    clearLoginPortalContext();
    return;
  }

  const firstActive = branches.find((b) => b.is_active !== false);
  if (firstActive) {
    setActiveBranchId(firstActive.branch_id, true, user.is_superuser);
  }
  clearLoginPortalContext();
}

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => {
      // Limpiar sesión local antes del login para no reutilizar token viejo.
      clearSession();
      return POST<LoginCompleteResponse>(ENDPOINTS.auth.login, credentials);
    },
    onSuccess: (data) => {
      const raw = data.branches ?? data.user.branch_assignments ?? [];
      const branches = raw.map((b) => {
        const anyB = b as BranchAssignment & { role_code?: string; role_name?: string };
        return {
          ...b,
          role: anyB.role_code || b.role || "",
          role_display: anyB.role_name || b.role_display || "",
          role_code: anyB.role_code || b.role,
          role_name: anyB.role_name || b.role_display,
        };
      });
      persistSession({
        token: data.token,
        user: {
          ...data.user,
          branch_assignments: branches,
          owned_organizations: data.owned_organizations ?? data.user.owned_organizations ?? [],
          is_organization_owner: Boolean(
            (data.owned_organizations ?? data.user.owned_organizations ?? []).length > 0 ||
            data.user.is_organization_owner,
          ),
        },
        branches,
        permissions: data.permissions as unknown as Record<string, unknown>,
      });
      selectDefaultBranch(data.user, branches);
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["auth", "profile"],
    queryFn: () => GET<User>(ENDPOINTS.auth.myProfile),
    enabled: typeof window !== "undefined",
    retry: false,
  });
}

export type UpdateProfilePayload = Pick<User, "first_name" | "last_name" | "email" | "username"> & {
  dni?: string;
};

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfilePayload) =>
      PATCH<User>(ENDPOINTS.auth.myProfile, data, { skipBranchHeader: true }),
    onSuccess: (data) => {
      updateStoredUser({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        username: data.username,
        dni: data.dni,
        full_name:
          [data.first_name, data.last_name].filter(Boolean).join(" ").trim() ||
          data.username ||
          data.email,
      });
      qc.setQueryData(["auth", "profile"], data);
    },
  });
}

export type ChangePasswordPayload = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordPayload) =>
      POST<{ message: string }>(ENDPOINTS.auth.changePassword, data, {
        skipBranchHeader: true,
      }),
  });
}

export type ForgotPasswordPayload = {
  email: string;
  login_slug?: string | null;
  branch_id?: number | null;
};

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordPayload) =>
      POST<{ message?: string; error?: string }>(
        ENDPOINTS.auth.forgotPassword,
        {
          email: data.email,
          ...(data.login_slug ? { login_slug: data.login_slug } : {}),
          ...(data.branch_id != null ? { branch_id: data.branch_id } : {}),
        },
        { skipBranchHeader: true },
      ),
  });
}

export type ResetPasswordConfirmPayload = {
  token: string;
  new_password: string;
  confirm_password: string;
};

export function useResetPasswordConfirm() {
  return useMutation({
    mutationFn: (data: ResetPasswordConfirmPayload) =>
      POST<{ message?: string; error?: string }>(
        ENDPOINTS.auth.resetPasswordConfirm,
        data,
        { skipBranchHeader: true },
      ),
  });
}

export async function logout() {
  try {
    await apiClient.post(ENDPOINTS.auth.logout);
  } catch {
    // Si el logout en backend falla, igual limpiamos sesión local.
  }
  clearSession();
  clearLoginPortalContext();
  localStorage.removeItem("activeBranchId");
  sessionStorage.removeItem("activeBranchId");
  window.location.href = "/login";
}
