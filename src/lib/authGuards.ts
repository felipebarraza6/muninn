import { getStoredUser } from "@/lib/authSession";

/** Superadmin de Muninn (gestión LLM / sucursales / usuarios). */
export function isSuperAdmin(): boolean {
  const user = getStoredUser();
  if (!user) return false;
  return Boolean(user.is_superuser || user.is_admin);
}
