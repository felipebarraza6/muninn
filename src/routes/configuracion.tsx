import { useProfile } from "@/api/hooks/useAuth";
import { GET } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints/index";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Configuracion() {
  const { data: profile } = useProfile();
  const { data: integrations } = useQuery({
    queryKey: ["integrations"],
    queryFn: () => GET(ENDPOINTS.integrations.list),
  });

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Configuración</h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Perfil</CardTitle>
          <CardDescription>Información de tu cuenta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">Usuario:</span>{" "}
            <span className="font-medium">{profile?.username || "..."}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Correo electrónico:</span>{" "}
            <span className="font-medium">{profile?.email || "..."}</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Integraciones</CardTitle>
          <CardDescription>Conexiones activas con sistemas externos.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="text-muted-foreground">Sistema de gestión conectado</p>
          {integrations &&
          Array.isArray(integrations) &&
          (integrations as Array<{ id?: string; name?: string }>).length > 0 ? (
            <ul className="mt-2 space-y-1">
              {(integrations as Array<{ id?: string; name?: string }>).map((integration) => (
                <li key={integration.id ?? integration.name} className="font-medium">
                  {integration.name ?? integration.id}
                </li>
              ))}
            </ul>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
