import { canManageChannels } from "@/lib/authGuards";
import { AccessDenied } from "@/components/auth/AccessDenied";

/** Protege /canales — superadmin y organizador. */
export function RequireChannels({ children }: { children: React.ReactNode }) {
  if (!canManageChannels()) {
    return <AccessDenied section="la sección de canales" />;
  }
  return <>{children}</>;
}
