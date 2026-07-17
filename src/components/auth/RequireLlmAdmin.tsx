import { Navigate } from "react-router-dom";
import { canAccessLlmAdmin } from "@/lib/authGuards";

export function RequireLlmAdmin({ children }: { children: React.ReactNode }) {
  if (!canAccessLlmAdmin()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
