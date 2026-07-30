import { canAccessBranchesAdmin } from "@/lib/authGuards";
import { AccessDenied } from "@/components/auth/AccessDenied";

/** Protege /admin/sucursales — superadmin, organizador u OWNER de sucursal. */
export function RequireBranchesAdmin({ children }: { children: React.ReactNode }) {
  if (!canAccessBranchesAdmin()) {
    return <AccessDenied section="la administración de sucursales" />;
  }
  return <>{children}</>;
}
