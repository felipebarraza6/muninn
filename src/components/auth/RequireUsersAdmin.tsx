import { canAccessUsersAdmin } from "@/lib/authGuards";
import { AccessDenied } from "@/components/auth/AccessDenied";

/** Protege /admin/usuarios — superadmin, OWNER o ADMIN_LOCAL. */
export function RequireUsersAdmin({ children }: { children: React.ReactNode }) {
  if (!canAccessUsersAdmin()) {
    return <AccessDenied section="la administración de usuarios" />;
  }
  return <>{children}</>;
}
