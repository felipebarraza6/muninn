import { Navigate } from "react-router-dom";
import { canAccessOrganizationsAdmin } from "@/lib/authGuards";

/** Protege /admin/organizaciones — superadmin u organizador de holding. */
export function RequireOrganizationsAdmin({ children }: { children: React.ReactNode }) {
  if (!canAccessOrganizationsAdmin()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
