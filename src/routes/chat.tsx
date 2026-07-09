import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Bot, Loader2 } from "lucide-react";
import { AgentChatCore } from "@/components/agent-chat-core";
import { useAgents } from "@/api/hooks/useAgents";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const agentIdFromUrl = searchParams.get("agent");
  const { data: agents = [], isLoading } = useAgents({ is_active: true });
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(agentIdFromUrl);

  const activeAgents = useMemo(() => agents.filter((a) => a.is_active !== false), [agents]);

  useEffect(() => {
    if (selectedAgentId) return;
    if (agentIdFromUrl) {
      setSelectedAgentId(agentIdFromUrl);
      return;
    }
    const first = activeAgents[0];
    if (first) {
      const id = String(first.id);
      setSelectedAgentId(id);
      setSearchParams({ agent: id }, { replace: true });
    }
  }, [agentIdFromUrl, activeAgents, selectedAgentId, setSearchParams]);

  const handleAgentChange = (value: string) => {
    setSelectedAgentId(value);
    setSearchParams({ agent: value }, { replace: true });
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100dvh-3.5rem)] w-full bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (activeAgents.length === 0) {
    return (
      <div className="h-[calc(100dvh-3.5rem)] w-full bg-background flex flex-col items-center justify-center gap-4 px-6">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        <p className="text-muted-foreground text-center">
          No hay agentes activos disponibles para chatear.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-3.5rem)] w-full flex flex-col overflow-hidden">
      <div className="border-b border-border/50 bg-card/50 backdrop-blur px-4 py-2 shrink-0">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Bot className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select value={selectedAgentId ?? undefined} onValueChange={handleAgentChange}>
            <SelectTrigger className="w-full max-w-xs border-0 bg-transparent shadow-none focus:ring-0 px-0 py-0 h-auto text-sm font-medium">
              <SelectValue placeholder="Selecciona un agente" />
            </SelectTrigger>
            <SelectContent>
              {activeAgents.map((agent) => (
                <SelectItem key={String(agent.id)} value={String(agent.id)}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedAgentId ? <AgentChatCore agentId={selectedAgentId} showBackLink={false} /> : null}
    </div>
  );
}
