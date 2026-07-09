import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, FunctionSquare } from "lucide-react";
import { useAgentFunction } from "@/api/hooks/useAgentFunctions";

export default function FunctionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: fn, isLoading, error } = useAgentFunction(id);

  if (isLoading) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !fn) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver
        </Button>
        <Card>
          <CardContent className="p-6 text-destructive">
            Error al cargar la función. Verifica que tengas permisos y que la API esté disponible.
          </CardContent>
        </Card>
      </div>
    );
  }

  const parameters = fn.parameters_schema?.properties
    ? Object.entries(
        fn.parameters_schema.properties as Record<string, { type?: string; description?: string }>,
      )
    : [];
  const required = Array.isArray(fn.parameters_schema?.required)
    ? fn.parameters_schema.required
    : [];

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <header className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link to="/funciones">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight truncate">
              {fn.name}
            </h1>
            <Badge variant={fn.is_active ? "default" : "secondary"} className="text-[10px]">
              {fn.is_active ? "Activa" : "Inactiva"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {fn.slug ?? "Sin slug"} · {fn.external_api_name ?? "Sin API asociada"}
          </p>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configuración</CardTitle>
          <CardDescription>Parámetros de la función.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Nombre:</span>{" "}
            <span className="font-medium">{fn.name}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Slug:</span>{" "}
            <span className="font-medium">{fn.slug ?? "—"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Implementación:</span>{" "}
            <span className="font-medium">{fn.implementation_type ?? "—"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">API externa:</span>{" "}
            <span className="font-medium">{fn.external_api_name ?? fn.external_api ?? "—"}</span>
          </div>
          {fn.config?.endpoint_type && (
            <div>
              <span className="text-muted-foreground">Punto de conexión:</span>{" "}
              <span className="font-medium">{fn.config.endpoint_type}</span>
            </div>
          )}
          {fn.description && (
            <div className="col-span-full">
              <span className="text-muted-foreground">Descripción:</span>{" "}
              <span className="font-medium">{fn.description}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Parámetros ({parameters.length})</CardTitle>
          <CardDescription>
            Datos que el agente debe recolectar para ejecutar la función.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {parameters.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No hay parámetros configurados.
            </div>
          )}
          {parameters.map(([key, config]) => (
            <div key={key} className="rounded-lg border p-3 space-y-1">
              <div className="flex items-center gap-2">
                <FunctionSquare className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">{key}</span>
                <Badge variant="outline" className="text-[10px]">
                  {config.type ?? "string"}
                </Badge>
                {required.includes(key) && (
                  <Badge variant="default" className="text-[10px]">
                    Requerido
                  </Badge>
                )}
              </div>
              {config.description && (
                <div className="text-sm text-muted-foreground">{config.description}</div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {fn.response_instructions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Instrucciones de respuesta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm">{fn.response_instructions}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
