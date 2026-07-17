import { Navigate } from "react-router-dom";
import { canAccessUsersAdmin } from "@/lib/authGuards";

/** Protege /admin/usuarios — superadmin, OWNER o ADMIN_LOCAL. */
export function RequireUsersAdmin({ children }: { children: React.ReactNode }) {
  if (!canAccessUsersAdmin()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
