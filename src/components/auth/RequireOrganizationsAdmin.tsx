import { canAccessOrganizationsAdmin } from "@/lib/authGuards";
import { AccessDenied } from "@/components/auth/AccessDenied";

/** Protege /admin/organizaciones — superadmin u organizador de holding. */
export function RequireOrganizationsAdmin({ children }: { children: React.ReactNode }) {
  if (!canAccessOrganizationsAdmin()) {
    return <AccessDenied section="la administración de organizaciones" />;
  }
  return <>{children}</>;
}
