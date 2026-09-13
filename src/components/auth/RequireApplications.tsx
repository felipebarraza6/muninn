import { canAccessExternalApis } from "@/lib/authGuards";
import { AccessDenied } from "@/components/auth/AccessDenied";

/** Protege /aplicaciones — superadmin, organizador y sucursales con permisos. */
export function RequireApplications({ children }: { children: React.ReactNode }) {
  if (!canAccessExternalApis()) {
    return <AccessDenied section="la sección de aplicaciones" />;
  }
  return <>{children}</>;
}
