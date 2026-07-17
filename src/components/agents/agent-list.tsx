import { useMemo, useState } from "react";
import { Bot, Loader2, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAgents, type Agent } from "@/api/hooks/useAgents";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";

export function AgentList() {
  const { data: agents = [], isLoading } = useAgents();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return agents;
    return agents.filter((a) => {
      const hay = [a.name, a.llm_provider_name, a.llm_model_name, a.slug]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(term);
    });
  }, [agents, q]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">Modelo, SOUL.md, RAG y herramientas.</p>
        <Button size="sm" asChild className="self-start sm:self-auto shrink-0">
          <Link to="/agentes/nuevo">
            <Plus className="h-4 w-4 mr-1.5" /> Nuevo
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:max-w-xl">
        <Input
          placeholder="Buscar agente…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-9 flex-1 min-w-0"
        />
        <StudioBranchFilter />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          {q.trim()
            ? "Sin agentes para esa búsqueda."
            : "No hay agentes aún. Crea el primero para empezar."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
          {filtered.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
}

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Link
      to={`/agentes/${agent.id}`}
      className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 px-4 py-3.5 transition-colors hover:border-primary/40 hover:bg-card outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="h-10 w-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
        <Bot className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{agent.name}</span>
          <Badge
            variant={agent.is_active ? "default" : "secondary"}
            className="text-[10px] shrink-0"
          >
            {agent.is_active ? "Activo" : "Inactivo"}
          </Badge>
        </div>
        <div className="text-[11px] text-muted-foreground truncate mt-0.5">
          {agent.llm_provider_name || agent.llm_model_name || "Sin modelo"} ·{" "}
          {agent.use_rag ? `RAG top ${agent.rag_top_k ?? "—"}` : "Sin RAG"}
        </div>
      </div>
    </Link>
  );
}
