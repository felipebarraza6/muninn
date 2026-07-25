import { isSuperAdmin } from "@/lib/authGuards";
import { AccessDenied } from "@/components/auth/AccessDenied";

/** Ops + Workflows: preview interno solo para superadmin por ahora. */
export function RequireSuperAdmin({ children }: { children: React.ReactNode }) {
  if (!isSuperAdmin()) {
    return <AccessDenied section="esta sección (preview interno)" />;
  }
  return <>{children}</>;
}
