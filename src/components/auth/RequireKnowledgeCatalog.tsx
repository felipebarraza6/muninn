import { canAccessKnowledgeCatalog } from "@/lib/authGuards";
import { AccessDenied } from "@/components/auth/AccessDenied";

/** Protege /conocimiento — superadmin, organizador u OWNER de sucursal. */
export function RequireKnowledgeCatalog({ children }: { children: React.ReactNode }) {
  if (!canAccessKnowledgeCatalog()) {
    return <AccessDenied section="el catálogo de conocimiento" />;
  }
  return <>{children}</>;
}
