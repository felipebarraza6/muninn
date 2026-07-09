import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function MetricDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="px-6 py-16 max-w-2xl mx-auto text-center space-y-4">
        <h1 className="font-display text-3xl font-bold">Métrica no encontrada</h1>
        <p className="text-sm text-muted-foreground">
          No existe un detalle para esta métrica. Vuelve al inicio para ver las disponibles.
        </p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver al inicio
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 text-muted-foreground hover:text-foreground"
      >
        <Link to="/">
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver al inicio
        </Link>
      </Button>

      <header className="space-y-3">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Detalle de Métrica</h1>
        <p className="text-sm text-muted-foreground">ID: {id}</p>
        <p className="text-sm text-muted-foreground">
          Los datos detallados de esta métrica se cargarán desde la API cuando el endpoint esté
          disponible.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Métrica ID</CardTitle>
          <CardDescription>Conectando a datos reales del panel.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            <span className="text-muted-foreground">Identificador:</span>{" "}
            <span className="font-mono font-medium">{id}</span>
          </p>
          <p className="text-muted-foreground">Conectando a datos reales del panel...</p>
        </CardContent>
      </Card>
    </div>
  );
}
