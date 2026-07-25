import { canAccessLlmAdmin } from "@/lib/authGuards";
import { AccessDenied } from "@/components/auth/AccessDenied";

export function RequireLlmAdmin({ children }: { children: React.ReactNode }) {
  if (!canAccessLlmAdmin()) {
    return <AccessDenied section="la administración de modelos LLM" />;
  }
  return <>{children}</>;
}
