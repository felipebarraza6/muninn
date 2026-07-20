import { Navigate } from "react-router-dom";
import { canAccessSkills } from "@/lib/authGuards";

/** Protege /skills — solo organizador y superadmin. */
export function RequireSkills({ children }: { children: React.ReactNode }) {
  if (!canAccessSkills()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
