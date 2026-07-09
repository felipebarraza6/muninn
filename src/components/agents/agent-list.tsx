import { Bot, Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAgents, type Agent } from "@/api/hooks/useAgents";

export function AgentList() {
  const { data: agents = [], isLoading } = useAgents();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Agentes IA</CardTitle>
        <CardDescription>
          Revisa la información y el conocimiento con el que están entrenados tus agentes.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {agents.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No hay agentes configurados aún.
          </div>
        )}
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="flex items-center justify-between gap-3 rounded-lg border p-3 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                <Bot className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{agent.name}</span>
                  <Badge
                    variant={agent.is_active ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {agent.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <div className="text-[11px] text-muted-foreground truncate">
                  Temperatura: {agent.temperature ?? "—"} · Máximo de tokens:{" "}
                  {agent.max_tokens ?? "—"} ·{" "}
                  {agent.use_rag
                    ? `Conocimiento activado (top ${agent.rag_top_k ?? "—"})`
                    : "Conocimiento desactivado"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link to={`/agentes/${agent.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
