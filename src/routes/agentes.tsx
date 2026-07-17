import { AgentList } from "@/components/agents/agent-list";
import { AdminPageMotion } from "@/components/admin/AdminPageMotion";

export default function Agentes() {
  return (
    <AdminPageMotion className="max-w-none">
      <AgentList />
    </AdminPageMotion>
  );
}
