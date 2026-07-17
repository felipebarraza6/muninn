import { Navigate } from "react-router-dom";
import { canAccessBranchesAdmin } from "@/lib/authGuards";

/** Protege /admin/sucursales — superadmin, organizador u OWNER de sucursal. */
export function RequireBranchesAdmin({ children }: { children: React.ReactNode }) {
  if (!canAccessBranchesAdmin()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
