import { useQuery, useMutation } from "@tanstack/react-query";
import { POST, GET, apiClient } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { setActiveBranchId, syncBranchId } from "@/lib/branchStorage";

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
  owner: {
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

export interface LoginCompleteResponse {
  user: User;
  branches: BranchAssignment[];
  permissions: {
    user_role: string;
    enabled_apps: string[];
    read_only_apps: string[];
    disabled_apps: string[];
  };
  token: string;
  message: string;
}

function selectDefaultBranch(user: User, branches: BranchAssignment[]) {
  // Si hay una sola sucursal, seleccionarla automáticamente.
  if (branches.length === 1) {
    setActiveBranchId(branches[0].branch_id, true, user.is_superuser);
    return;
  }

  // Si hay varias, intentar restaurar la última usada.
  const existing = syncBranchId();
  if (existing) return;

  // Como fallback, seleccionar la primera sucursal activa.
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
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      selectDefaultBranch(data.user, data.branches ?? data.user.branch_assignments ?? []);
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
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("activeBranchId");
  sessionStorage.removeItem("activeBranchId");
  window.location.href = "/login";
}
