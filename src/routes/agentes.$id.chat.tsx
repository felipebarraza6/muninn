import { useParams } from "react-router-dom";
import { AgentChatCore } from "@/components/agent-chat-core";

export default function AgentChatPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return (
      <div className="h-[calc(100dvh-3.5rem)] w-full bg-background flex items-center justify-center">
        <p className="text-destructive">No se especificó un agente.</p>
      </div>
    );
  }
  return <AgentChatCore agentId={id} showBackLink backTo={`/agentes/${id}`} />;
}
