import { Navigate } from "react-router-dom";
import { canAccessConversations } from "@/lib/authGuards";

/** Protege /conversaciones — SA, organizador y roles de sucursal. */
export function RequireConversations({ children }: { children: React.ReactNode }) {
  if (!canAccessConversations()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
