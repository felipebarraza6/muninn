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
  const conversationFromUrl = searchParams.get("conversation");
  const { data: agents = [], isLoading } = useAgents({ is_active: true });
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(agentIdFromUrl);

  const activeAgents = useMemo(() => agents.filter((a) => a.is_active !== false), [agents]);

  useEffect(() => {
    if (agentIdFromUrl) {
      setSelectedAgentId(agentIdFromUrl);
      return;
    }
    if (selectedAgentId) return;
    const first = activeAgents[0];
    if (first) {
      const id = String(first.id);
      setSelectedAgentId(id);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("agent", id);
          return next;
        },
        { replace: true },
      );
    }
  }, [agentIdFromUrl, activeAgents, selectedAgentId, setSearchParams]);

  const handleAgentChange = (value: string) => {
    setSelectedAgentId(value);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("agent", value);
        // Al cambiar de agente, limpiar conversación de otro agente
        next.delete("conversation");
        return next;
      },
      { replace: true },
    );
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
      <div className="border-b border-border/50 bg-card/50 backdrop-blur px-4 py-2 shrink-0 w-full flex items-center justify-start gap-3">
        <Bot className="h-4 w-4 text-muted-foreground shrink-0" />
        <Select value={selectedAgentId ?? undefined} onValueChange={handleAgentChange}>
          <SelectTrigger className="w-auto min-w-[12rem] max-w-sm shrink-0 border-0 bg-transparent shadow-none focus:ring-0 px-0 py-0 h-auto text-sm font-medium">
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
        {conversationFromUrl ? (
          <span className="text-[11px] text-muted-foreground truncate hidden sm:inline">
            Conv. #{conversationFromUrl}
          </span>
        ) : null}
      </div>

      <div className="flex-1 min-h-0">
        {selectedAgentId ? (
          <AgentChatCore agentId={selectedAgentId} showBackLink={false} fillParent />
        ) : null}
      </div>
    </div>
  );
}
