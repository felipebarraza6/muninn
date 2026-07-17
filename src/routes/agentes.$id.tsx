import { useState } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Loader2, Settings, BookOpen, FlaskConical, Wrench, Trash2 } from "lucide-react";
import { useAgent, useDeleteAgent, useTestAgentLLM } from "@/api/hooks/useAgents";
import { AgentKnowledgePanel } from "@/components/agents/agent-knowledge-panel";
import { AgentToolsPanel } from "@/components/agents/agent-tools-panel";
import { AgentForm } from "@/components/agents/agent-form";
import { toast } from "sonner";

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const editing = searchParams.get("edit") === "1";
  const { data: agent, isLoading, error, refetch } = useAgent(id);
  const deleteAgent = useDeleteAgent();
  const testLlm = useTestAgentLLM();
  const [testMessage, setTestMessage] = useState("Hola, ¿quién eres?");
  const [testResult, setTestResult] = useState<string | null>(null);

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

  if (editing) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[900px] mx-auto space-y-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            searchParams.delete("edit");
            setSearchParams(searchParams);
          }}
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver al studio
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Configurar agente</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Modelo, SOUL.md, bienvenida, RAG y comportamiento de {agent.name}.
          </p>
        </div>
        <AgentForm
          agent={agent}
          onCancel={() => {
            searchParams.delete("edit");
            setSearchParams(searchParams);
          }}
          onSaved={() => {
            searchParams.delete("edit");
            setSearchParams(searchParams);
            refetch();
          }}
        />
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
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-lg font-semibold tracking-tight truncate">{agent.name}</h1>
            <Badge
              variant={agent.is_active ? "default" : "secondary"}
              className="text-[10px] shrink-0"
            >
              {agent.is_active ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {agent.llm_provider_name || "Sin provider"} · {agent.llm_model_name || "Sin modelo"} ·{" "}
            {agent.use_rag
              ? `RAG top ${agent.rag_top_k ?? "—"} · ${agent.embedding_model || "embedding default"}`
              : "RAG off"}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              searchParams.set("edit", "1");
              setSearchParams(searchParams);
            }}
          >
            <Settings className="h-4 w-4 mr-1.5" /> Configurar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                disabled={deleteAgent.isPending}
              >
                {deleteAgent.isPending ? (
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-1.5" />
                )}
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar agente</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Eliminar «{agent.name}»? Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    if (!id) return;
                    deleteAgent.mutate(id, {
                      onSuccess: () => {
                        toast.success("Agente eliminado");
                        navigate("/agentes");
                      },
                      onError: () => toast.error("No se pudo eliminar el agente"),
                    });
                  }}
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <Tabs defaultValue="info">
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="info" className="gap-1.5">
            <Settings className="h-4 w-4" /> Modelo
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="gap-1.5">
            <BookOpen className="h-4 w-4" /> RAG
          </TabsTrigger>
          <TabsTrigger value="tools" className="gap-1.5">
            <Wrench className="h-4 w-4" /> Herramientas
          </TabsTrigger>
          <TabsTrigger value="test" className="gap-1.5">
            <FlaskConical className="h-4 w-4" /> Test LLM
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
                <span className="text-muted-foreground">Proveedor:</span>{" "}
                <span className="font-medium">{agent.llm_provider_name ?? "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Modelo:</span>{" "}
                <span className="font-medium">{agent.llm_model_name ?? "—"}</span>
              </div>
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
                <span className="text-muted-foreground">Top K / embedding:</span>{" "}
                <span className="font-medium">
                  {agent.rag_top_k ?? "—"} / {agent.embedding_model || "—"}
                </span>
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

        <TabsContent value="tools" className="mt-4">
          <AgentToolsPanel agentId={id!} />
        </TabsContent>

        <TabsContent value="test" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Probar LLM</CardTitle>
              <CardDescription>
                Llama a <code>test_llm</code> sin abrir una conversación completa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Mensaje de prueba"
              />
              <Button
                disabled={testLlm.isPending || !testMessage.trim()}
                onClick={() => {
                  testLlm.mutate(
                    { id: agent.id, message: testMessage },
                    {
                      onSuccess: (res) => {
                        setTestResult(res.response || res.error || JSON.stringify(res, null, 2));
                        toast.success("Test completado");
                      },
                      onError: () => toast.error("Falló el test LLM"),
                    },
                  );
                }}
              >
                {testLlm.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ejecutar test
              </Button>
              {testResult && (
                <pre className="whitespace-pre-wrap text-sm font-mono bg-muted/50 p-4 rounded-md max-h-80 overflow-auto">
                  {testResult}
                </pre>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
