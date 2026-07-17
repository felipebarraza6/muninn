import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentForm } from "@/components/agents/agent-form";
import { AdminPageMotion } from "@/components/admin/AdminPageMotion";

export default function AgentesNuevoPage() {
  const navigate = useNavigate();

  return (
    <AdminPageMotion>
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[900px] mx-auto space-y-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/agentes">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver a agentes
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Nuevo agente</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Define nombre, modelo, SOUL.md y cómo se presenta. El RAG y las herramientas se
            configuran después en el detalle.
          </p>
        </div>
        <AgentForm
          onCancel={() => navigate("/agentes")}
          onSaved={(saved) => {
            if (saved?.id) navigate(`/agentes/${saved.id}`);
            else navigate("/agentes");
          }}
        />
      </div>
    </AdminPageMotion>
  );
}
