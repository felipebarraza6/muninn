import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Bot } from "lucide-react";
import { AgentChatCore } from "@/components/agent-chat-core";
import { useAgents } from "@/api/hooks/useAgents";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const agentIdFromUrl = searchParams.get("agent");
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
        next.delete("conversation");
        return next;
      },
      { replace: true },
    );
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100dvh-3.5rem)] w-full bg-background">
        <PageSkeleton variant="chat" className="h-full max-w-none px-4 py-4" padded={false} />
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
    <div className="h-[calc(100dvh-3.5rem)] w-full overflow-hidden">
      {selectedAgentId ? (
        <AgentChatCore
          agentId={selectedAgentId}
          showBackLink={false}
          fillParent
          agentSwitcher={{
            agents: activeAgents,
            onChange: handleAgentChange,
          }}
          headerExtra={<StudioBranchFilter />}
        />
      ) : null}
    </div>
  );
}
