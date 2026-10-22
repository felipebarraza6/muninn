import { canAccessChannels } from "@/lib/authGuards";
import { AccessDenied } from "@/components/auth/AccessDenied";

/** Protege /canales. Quien no tiene el módulo no entra (incluye OWNER sin acceso). */
export function RequireChannels({ children }: { children: React.ReactNode }) {
  if (!canAccessChannels()) {
    return <AccessDenied section="la sección de canales" />;
  }
  return <>{children}</>;
}
