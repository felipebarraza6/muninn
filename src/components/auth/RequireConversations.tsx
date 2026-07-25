import { canAccessConversations } from "@/lib/authGuards";
import { AccessDenied } from "@/components/auth/AccessDenied";

/** Protege /conversaciones — SA, organizador y roles de sucursal. */
export function RequireConversations({ children }: { children: React.ReactNode }) {
  if (!canAccessConversations()) {
    return <AccessDenied section="la bandeja de conversaciones" />;
  }
  return <>{children}</>;
}
