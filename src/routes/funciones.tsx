import { Link } from "react-router-dom";
import { Loader2, FunctionSquare, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAgentFunctions } from "@/api/hooks/useAgentFunctions";

export default function Funciones() {
  const { data: functions = [], isLoading } = useAgentFunctions();

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
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Funciones</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Herramientas que tus agentes pueden ejecutar durante una conversación.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Funciones configuradas</CardTitle>
          <CardDescription>Funciones disponibles para los agentes.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {functions.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No hay funciones configuradas.
            </div>
          )}
          {functions.map((fn) => (
            <div
              key={fn.id}
              className="flex items-center justify-between gap-3 rounded-lg border p-3 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                  <FunctionSquare className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">{fn.name}</span>
                    <Badge variant={fn.is_active ? "default" : "secondary"} className="text-[10px]">
                      {fn.is_active ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {fn.slug ?? "Sin slug"} · {fn.external_api_name ?? "Sin API asociada"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                  <Link to={`/funciones/${fn.id}`}>
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
