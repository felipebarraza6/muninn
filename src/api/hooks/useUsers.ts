import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DELETE, GET, PATCH, POST, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";

const USERS_KEY = ["accounts", "users"];

export interface AdminUser {
  id: number | string;
  username?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  type_user?: string;
  date_joined?: string;
  last_login?: string | null;
}

export function useAdminUsers() {
  return useQuery({
    queryKey: USERS_KEY,
    queryFn: () =>
      GET<AdminUser[] | { results: AdminUser[] }>(ENDPOINTS.users.list).then((data) =>
        normalizeListResponse<AdminUser>(data),
      ),
    staleTime: 30_000,
  });
}

export function useCreateAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AdminUser> & { password?: string }) =>
      POST<AdminUser>(ENDPOINTS.users.list, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
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

export function useDeleteAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => DELETE(ENDPOINTS.users.detail(id)),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
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
      POST<GeneratePasswordResponse>(ENDPOINTS.users.generatePassword(id), {}),
  });
}

/** Reset admin por email + new_password (manual). */
export function useResetUserPassword() {
  return useMutation({
    mutationFn: (data: { user: string; new_password: string }) =>
      POST<{ message?: string }>(ENDPOINTS.users.resetPassword, data),
  });
}
