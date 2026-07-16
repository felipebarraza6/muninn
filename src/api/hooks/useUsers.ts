import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DELETE, GET_ALL_PAGES, PATCH, POST } from "../client";
import { ENDPOINTS } from "../endpoints/index";

const USERS_KEY = ["accounts", "users"];

export interface AdminUser {
  id: number | string;
  username?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  dni?: string | null;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  is_multi_branch?: boolean;
  assigned_product?: number | string | null;
  type_user?: string;
  date_joined?: string;
  last_login?: string | null;
}

export type CreateAndAssignPayload = {
  user_data: {
    username?: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    dni: string;
    is_superuser?: boolean;
    is_staff?: boolean;
    is_multi_branch?: boolean;
    assigned_product?: number | string | null;
  };
  /** Obligatorio para usuarios normales; omitir solo si Root. */
  branch_assignment?: {
    branch_id: string | number;
    role: string;
    is_active?: boolean;
  } | null;
};

export type CreateAndAssignResponse = {
  user: AdminUser;
  message?: string;
  branch_assignment?: {
    branch_id: number | string;
    branch_name?: string;
    role_code?: string;
    is_active?: boolean;
  };
};

export function useAdminUsers() {
  return useQuery({
    queryKey: USERS_KEY,
    queryFn: () => GET_ALL_PAGES<AdminUser>(ENDPOINTS.users.list),
    staleTime: 30_000,
  });
}

/** Crear usuario vía endpoint recomendado (soporta Root + asignación). */
export function useCreateAndAssignUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAndAssignPayload) =>
      POST<CreateAndAssignResponse>(ENDPOINTS.users.createAndAssign, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEY });
      qc.invalidateQueries({ queryKey: ["branches", "users"] });
    },
  });
}

export function useUpdateAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: Partial<AdminUser> & { password?: string };
    }) => PATCH<AdminUser>(ENDPOINTS.users.detail(id), data),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  });
}

/** Soft delete: API marca `is_active=false`. */
export function useDeleteAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => DELETE(ENDPOINTS.users.detail(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  });
}

export type AssignToBranchPayload = {
  user_id: string | number;
  branch_id: string | number;
  role: string;
  is_active?: boolean;
};

export function useAssignUserToBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignToBranchPayload) =>
      POST(ENDPOINTS.users.assignToBranch, {
        user_id: data.user_id,
        branch_id: data.branch_id,
        role: data.role,
        is_active: data.is_active ?? true,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEY });
      qc.invalidateQueries({ queryKey: ["branches", "users"] });
    },
  });
}

export type ChangeUserRolePayload = {
  user_id: string | number;
  branch_id: string | number;
  role: string;
};

export function useChangeUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ChangeUserRolePayload) =>
      POST<{ message?: string }>(ENDPOINTS.users.changeUserRole, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEY });
      qc.invalidateQueries({ queryKey: ["branches", "users"] });
    },
  });
}

/** Activar/desactivar usuario globalmente (`{ user_id }`). */
export function useToggleUserGlobalStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string | number) =>
      POST<{ message?: string; is_active?: boolean }>(ENDPOINTS.users.toggleGlobalStatus, {
        user_id: userId,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  });
}

/** Activar/desactivar asignación (`{ assignment_id }`). */
export function useToggleAssignmentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (assignmentId: string | number) =>
      POST(ENDPOINTS.users.toggleAssignmentStatus, { assignment_id: assignmentId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USERS_KEY });
      qc.invalidateQueries({ queryKey: ["branches", "users"] });
    },
  });
}

export type GeneratePasswordResponse = {
  message?: string;
  new_password: string;
  username?: string;
  generated_at?: string;
  password_info?: string;
};

/** Reinicia password en servidor y devuelve la nueva (one-shot). */
export function useGenerateUserPassword() {
  return useMutation({
    mutationFn: (id: string | number) =>
      // Sin body: el action solo usa pk (OpenAPI puede pedir UserModelRequest por error).
      POST<GeneratePasswordResponse>(ENDPOINTS.users.generatePassword(id)),
  });
}

/** Reset admin por email + new_password (manual). */
export function useResetUserPassword() {
  return useMutation({
    mutationFn: (data: { user: string; new_password: string }) =>
      POST<{ message?: string }>(ENDPOINTS.users.resetPassword, data),
  });
}
