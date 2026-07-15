import { BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/** Placeholder P0: la biblioteca completa llega en P2. */
export default function Conocimiento() {
  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-primary" />
            Conocimiento
          </CardTitle>
          <CardDescription>
            Biblioteca RAG del studio. La ingestión e indexación se habilitan en la siguiente fase.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Mientras tanto puedes asignar documentos existentes desde el detalle de cada agente
          (pestaña Entrenamiento).
        </CardContent>
      </Card>
    </div>
  );
}
