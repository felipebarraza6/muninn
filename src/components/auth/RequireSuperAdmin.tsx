import { Navigate } from "react-router-dom";
import { isSuperAdmin } from "@/lib/authGuards";

/** Protege rutas /admin/* — solo superadmin. */
export function RequireSuperAdmin({ children }: { children: React.ReactNode }) {
  if (!isSuperAdmin()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
