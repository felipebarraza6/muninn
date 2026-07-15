import { useState } from "react";
import { Bot, Eye, Loader2, Plus, Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAgents, type Agent } from "@/api/hooks/useAgents";
import { AgentForm } from "@/components/agents/agent-form";

export function AgentList() {
  const navigate = useNavigate();
  const { data: agents = [], isLoading } = useAgents();
  const [creating, setCreating] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="text-base">Agentes</CardTitle>
            <CardDescription>
              Crea y entrena agentes: modelo, prompt, RAG y herramientas.
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Nuevo
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {agents.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No hay agentes aún. Crea el primero para empezar.
            </div>
          )}
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </CardContent>
      </Card>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuevo agente</DialogTitle>
          </DialogHeader>
          <AgentForm
            onCancel={() => setCreating(false)}
            onSaved={(saved) => {
              setCreating(false);
              if (saved?.id) navigate(`/agentes/${saved.id}`);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3 hover:border-primary/40 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
          <Bot className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">{agent.name}</span>
            <Badge variant={agent.is_active ? "default" : "secondary"} className="text-[10px]">
              {agent.is_active ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <div className="text-[11px] text-muted-foreground truncate">
            {agent.llm_provider_name || agent.llm_model_name || "Sin modelo"} ·{" "}
            {agent.use_rag ? `RAG top ${agent.rag_top_k ?? "—"}` : "Sin RAG"}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="icon" className="h-9 w-9" asChild title="Abrir studio">
          <Link to={`/agentes/${agent.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9" asChild title="Editar">
          <Link to={`/agentes/${agent.id}?edit=1`}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
