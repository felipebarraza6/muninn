import { Link } from "react-router-dom";
import { Loader2, Globe, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useExternalAPIs } from "@/api/hooks/useExternalAPIs";

const AUTH_TYPE_LABEL: Record<string, string> = {
  none: "Sin autenticación",
  api_key: "API Key",
  bearer: "Bearer Token",
  oauth2: "OAuth 2.0",
  basic: "Basic Auth",
  endpoint_auth: "Auth por endpoint",
};

export default function APIs() {
  const { data: apis = [], isLoading } = useExternalAPIs();

  if (isLoading) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">APIs externas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Conexiones que tus agentes pueden usar para ejecutar funciones.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Integraciones configuradas</CardTitle>
          <CardDescription>APIs externas disponibles para los agentes.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {apis.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No hay APIs externas configuradas.
            </div>
          )}
          {apis.map((api) => (
            <div
              key={api.id}
              className="flex items-center justify-between gap-3 rounded-lg border p-3 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{api.name}</span>
                    <Badge
                      variant={api.is_active ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {api.is_active ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {AUTH_TYPE_LABEL[api.auth_type ?? "none"] ?? api.auth_type} ·{" "}
                    {api.base_url ?? "Sin URL base"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                  <Link to={`/apis/${api.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
