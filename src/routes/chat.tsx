import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Bot } from "lucide-react";
import { AgentChatCore } from "@/components/agent-chat-core";
import { useAgents } from "@/api/hooks/useAgents";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useActiveBranchId } from "@/hooks/useActiveBranchId";

export default function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const agentIdFromUrl = searchParams.get("agent");
  const branchId = useActiveBranchId();
  const previousBranchId = useRef(branchId);
  const {
    data: agents = [],
    isLoading,
    isFetching,
  } = useAgents({
    is_active: true,
    keepPrevious: false,
  });
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(agentIdFromUrl);

  /**
   * Filtrado por sucursal activa.
   * Con keepPrevious:false la API ya viene con ?branch=; si el item trae `branch`,
   * validamos en cliente para no mezclar sucursales.
   */
  const activeAgents = useMemo(() => {
    return agents.filter((a) => {
      if (a.is_active === false) return false;
      if (!branchId) return true;
      if (a.branch == null) return true;
      return String(a.branch) === String(branchId);
    });
  }, [agents, branchId]);

  const listPending = isLoading || (isFetching && agents.length === 0);

  useEffect(() => {
    if (previousBranchId.current === branchId) return;
    previousBranchId.current = branchId;
    setSelectedAgentId(null);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("agent");
        next.delete("conversation");
        return next;
      },
      { replace: true },
    );
  }, [branchId, setSearchParams]);

  useEffect(() => {
    if (listPending || isFetching) return;

    const requestedId = agentIdFromUrl || selectedAgentId;
    const requestedExists =
      requestedId != null && activeAgents.some((agent) => String(agent.id) === String(requestedId));

    if (requestedId && requestedExists) {
      if (selectedAgentId !== requestedId) setSelectedAgentId(requestedId);
      return;
    }

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
      return;
    }

    setSelectedAgentId(null);
    if (agentIdFromUrl) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("agent");
          next.delete("conversation");
          return next;
        },
        { replace: true },
      );
    }
  }, [agentIdFromUrl, activeAgents, selectedAgentId, setSearchParams, listPending, isFetching]);

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

  if (listPending) {
    return (
      <div className="h-dvh w-full bg-background">
        <PageSkeleton variant="chat" className="h-full max-w-none" padded={false} />
      </div>
    );
  }

  if (activeAgents.length === 0) {
    return (
      <div className="flex h-dvh w-full flex-col bg-background">
        <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
          <p className="text-sm text-muted-foreground">
            {branchId ? "Sin agentes en esta sucursal" : "Sin agentes activos"}
          </p>
          <StudioBranchFilter />
        </div>
        <div className="flex flex-1 items-center justify-center px-6">
          <EmptyState
            icon={<Bot className="h-5 w-5" />}
            title="Sin agentes activos"
            description={
              branchId
                ? "No hay agentes para chatear en la sucursal seleccionada. Cambia el filtro o elige «Todas»."
                : "No hay agentes disponibles para chatear."
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh w-full overflow-hidden">
      {selectedAgentId ? (
        <AgentChatCore
          agentId={selectedAgentId}
          showBackLink
          backTo="/"
          fillParent
          skipInitialSkeleton
          agentSwitcher={{
            agents: activeAgents,
            onChange: handleAgentChange,
          }}
          headerExtra={<StudioBranchFilter />}
        />
      ) : isFetching ? (
        <div className="h-dvh w-full bg-background">
          <PageSkeleton variant="chat" className="h-full max-w-none" padded={false} />
        </div>
      ) : null}
    </div>
  );
}
