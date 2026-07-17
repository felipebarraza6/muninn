import { Navigate } from "react-router-dom";
import { canAccessKnowledgeCatalog } from "@/lib/authGuards";

/** Protege /conocimiento — superadmin, organizador u OWNER de sucursal. */
export function RequireKnowledgeCatalog({ children }: { children: React.ReactNode }) {
  if (!canAccessKnowledgeCatalog()) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}
