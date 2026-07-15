import { useQuery, useMutation } from "@tanstack/react-query";
import { POST, GET, apiClient } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { setActiveBranchId, syncBranchId } from "@/lib/branchStorage";
import { clearSession, persistSession } from "@/lib/authSession";

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
  is_admin: boolean;
  is_client: boolean;
  dni?: string;
  branch_assignments: BranchAssignment[];
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
  permissions: AuthPermissions;
  token: string;
  message?: string;
}

function selectDefaultBranch(user: User, branches: BranchAssignment[]) {
  if (branches.length === 1) {
    setActiveBranchId(branches[0].branch_id, true, user.is_superuser);
    return;
  }

  const existing = syncBranchId();
  if (existing) return;

  const firstActive = branches.find((b) => b.is_active);
  if (firstActive) {
    setActiveBranchId(firstActive.branch_id, true, user.is_superuser);
  }
}

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      POST<LoginCompleteResponse>(ENDPOINTS.auth.login, credentials),
    onSuccess: (data) => {
      const branches = data.branches ?? data.user.branch_assignments ?? [];
      persistSession({
        token: data.token,
        user: data.user,
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

export async function logout() {
  try {
    await apiClient.post(ENDPOINTS.auth.logout);
  } catch {
    // Si el logout en backend falla, igual limpiamos sesión local.
  }
  clearSession();
  localStorage.removeItem("activeBranchId");
  sessionStorage.removeItem("activeBranchId");
  window.location.href = "/login";
}
