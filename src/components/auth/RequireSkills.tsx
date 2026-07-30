import { canAccessSkills } from "@/lib/authGuards";
import { AccessDenied } from "@/components/auth/AccessDenied";

/** Protege /skills — solo organizador y superadmin. */
export function RequireSkills({ children }: { children: React.ReactNode }) {
  if (!canAccessSkills()) {
    return <AccessDenied section="el catálogo de skills" />;
  }
  return <>{children}</>;
}
