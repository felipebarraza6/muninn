import { AgentList } from "@/components/agents/agent-list";
import { AdminPageMotion } from "@/components/admin/AdminPageMotion";

export default function Agentes() {
  return (
    <AdminPageMotion className="space-y-5">
      <AgentList />
    </AdminPageMotion>
  );
}
