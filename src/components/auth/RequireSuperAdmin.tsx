import { Navigate } from "react-router-dom";
import { isSuperAdmin } from "@/lib/authGuards";

/** Ops + Workflows: preview interno solo para superadmin por ahora. */
export function RequireSuperAdmin({ children }: { children: React.ReactNode }) {
  if (!isSuperAdmin()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
