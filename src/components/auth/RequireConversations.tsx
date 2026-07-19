import { Navigate } from "react-router-dom";
import { canAccessConversations } from "@/lib/authGuards";

/** Protege /conversaciones — solo usuarios con rol (no superadmin). */
export function RequireConversations({ children }: { children: React.ReactNode }) {
  if (!canAccessConversations()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
