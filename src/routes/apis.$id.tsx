import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Globe } from "lucide-react";
import { useExternalAPI } from "@/api/hooks/useExternalAPIs";

const AUTH_TYPE_LABEL: Record<string, string> = {
  none: "Sin autenticación",
  api_key: "API Key",
  bearer: "Bearer Token",
  oauth2: "OAuth 2.0",
  basic: "Basic Auth",
  endpoint_auth: "Auth por endpoint",
};

export default function APIDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: api, isLoading, error } = useExternalAPI(id);

  if (isLoading) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !api) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver
        </Button>
        <Card>
          <CardContent className="p-6 text-destructive">
            Error al cargar la API externa. Verifica que tengas permisos y que la API esté
            disponible.
          </CardContent>
        </Card>
      </div>
    );
  }

  const endpoints = api.endpoints ? Object.entries(api.endpoints) : [];

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <header className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link to="/apis">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight truncate">
              {api.name}
            </h1>
            <Badge variant={api.is_active ? "default" : "secondary"} className="text-[10px]">
              {api.is_active ? "Activa" : "Inactiva"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {AUTH_TYPE_LABEL[api.auth_type ?? "none"] ?? api.auth_type} ·{" "}
            {api.base_url ?? "Sin URL base"}
          </p>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configuración general</CardTitle>
          <CardDescription>Parámetros de conexión de la API.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Nombre:</span>{" "}
            <span className="font-medium">{api.name}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Autenticación:</span>{" "}
            <span className="font-medium">
              {AUTH_TYPE_LABEL[api.auth_type ?? "none"] ?? api.auth_type}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">URL base:</span>{" "}
            <span className="font-medium">{api.base_url ?? "—"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Tiempo de espera:</span>{" "}
            <span className="font-medium">{api.timeout_seconds ?? "—"}s</span>
          </div>
          {api.description && (
            <div className="col-span-full">
              <span className="text-muted-foreground">Descripción:</span>{" "}
              <span className="font-medium">{api.description}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Puntos de conexión ({endpoints.length})</CardTitle>
          <CardDescription>Puntos de conexión disponibles de esta API.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {endpoints.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No hay puntos de conexión configurados.
            </div>
          )}
          {endpoints.map(([type, endpoint]) => (
            <div key={type} className="rounded-lg border p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">{type}</span>
                <Badge variant="outline" className="text-[10px]">
                  {endpoint.method ?? "GET"}
                </Badge>
              </div>
              <div className="text-sm font-mono text-muted-foreground">{endpoint.path ?? "—"}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
