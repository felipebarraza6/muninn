import { canAccessAgents } from "@/lib/authGuards";
import { AccessDenied } from "@/components/auth/AccessDenied";

/** Protege /agentes — SA, organizador y usuarios con sucursal activa. */
export function RequireAgents({ children }: { children: React.ReactNode }) {
  if (!canAccessAgents()) {
    return <AccessDenied section="la sección de agentes" />;
  }
  return <>{children}</>;
}
