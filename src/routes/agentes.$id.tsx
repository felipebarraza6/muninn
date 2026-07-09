import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Bot, Loader2, Settings, BookOpen, MessageSquare } from "lucide-react";
import { useAgent } from "@/api/hooks/useAgents";
import { AgentKnowledgePanel } from "@/components/agents/agent-knowledge-panel";

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: agent, isLoading, error } = useAgent(id);
  const canChat = Boolean(agent?.llm_provider || agent?.llm_provider_name);

  if (isLoading) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver
        </Button>
        <Card>
          <CardContent className="p-6 text-destructive">
            Error al cargar el agente. Verifica que tengas permisos y que la API esté disponible.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Button variant="outline" size="sm" asChild className="self-start">
          <Link to="/agentes">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight truncate">
              {agent.name}
            </h1>
            <Badge variant={agent.is_active ? "default" : "secondary"} className="text-[10px]">
              {agent.is_active ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            Temperatura: {agent.temperature ?? "—"} · Máximo de tokens: {agent.max_tokens ?? "—"} ·{" "}
            {agent.use_rag
              ? `Conocimiento activado (top ${agent.rag_top_k ?? "—"})`
              : "Conocimiento desactivado"}
          </p>
        </div>
        <Button
          asChild
          size="icon"
          className="self-start sm:self-auto"
          title="Chatear con este agente"
        >
          <Link to={`/agentes/${id}/chat`}>
            <MessageSquare className="h-4 w-4" />
          </Link>
        </Button>
      </header>

      <Tabs defaultValue="info">
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="info" className="gap-1.5">
            <Settings className="h-4 w-4" /> Información
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="gap-1.5">
            <BookOpen className="h-4 w-4" /> Entrenamiento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configuración</CardTitle>
              <CardDescription>Parámetros actuales del agente.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Temperatura:</span>{" "}
                <span className="font-medium">{agent.temperature ?? "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Máximo de tokens:</span>{" "}
                <span className="font-medium">{agent.max_tokens ?? "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Conocimiento (RAG):</span>{" "}
                <span className="font-medium">{agent.use_rag ? "Activado" : "Desactivado"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Fragmentos recuperados (top K):</span>{" "}
                <span className="font-medium">{agent.rag_top_k ?? "—"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Instrucciones del sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm font-mono bg-muted/50 p-4 rounded-md">
                {agent.system_prompt || "Sin instrucciones del sistema configuradas."}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="mt-4">
          <AgentKnowledgePanel agentId={id!} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
