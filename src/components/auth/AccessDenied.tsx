import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

/**
 * Pantalla de acceso denegado: reemplaza el redirect silencioso a "/"
 * para que el usuario entienda por qué no ve la sección (bookmark, URL compartida).
 */
export function AccessDenied({ section }: { section?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
      <EmptyState
        icon={<ShieldAlert className="h-5 w-5" />}
        title="No tienes acceso a esta sección"
        description={
          section
            ? `Tu cuenta no tiene permisos para ${section}. Si crees que es un error, contacta a un administrador de tu organización.`
            : "Tu cuenta no tiene permisos para ver esta pantalla. Si crees que es un error, contacta a un administrador de tu organización."
        }
        action={
          <Button asChild size="sm">
            <Link to="/app">Ir al inicio</Link>
          </Button>
        }
      />
    </div>
  );
}
