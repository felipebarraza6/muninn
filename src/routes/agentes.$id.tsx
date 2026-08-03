import { useMemo, useState } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  ArrowLeft,
  Loader2,
  Settings,
  BookOpen,
  FlaskConical,
  Sparkles,
  GitBranch,
  Trash2,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { useAgent, useDeleteAgent, useUpdateAgent, useTestAgentLLM } from "@/api/hooks/useAgents";
import { AgentKnowledgePanel } from "@/components/agents/agent-knowledge-panel";
import { AgentSkillsPanel } from "@/components/agents/agent-skills-panel";
import { AgentFlowPolicyPanel } from "@/components/agents/agent-flow-policy-panel";
import { AgentForm } from "@/components/agents/agent-form";
import { AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { isSuperAdmin, isAgentReadOnly } from "@/lib/authGuards";
import { cn } from "@/lib/utils";
import { motionTokens } from "@/lib/motion";
import { apiErrorMessage } from "@/lib/apiError";
import { toast } from "sonner";

const AGENT_SECTIONS = [
  { id: "modelo", label: "Modelo", icon: Settings },
  { id: "rag", label: "RAG", icon: BookOpen },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "flujo", label: "DataRules", icon: GitBranch },
  { id: "test", label: "Test LLM", icon: FlaskConical },
] as const;

type AgentSectionId = (typeof AGENT_SECTIONS)[number]["id"];

function parseSection(raw: string | null): AgentSectionId {
  if (raw === "herramientas") return "skills";
  const match = AGENT_SECTIONS.find((s) => s.id === raw);
  return match?.id ?? "modelo";
}

function AgentSectionNav({
  value,
  onChange,
}: {
  value: AgentSectionId;
  onChange: (id: AgentSectionId) => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="tablist"
      aria-label="Secciones del agente"
      className="relative flex w-full gap-1 overflow-x-auto rounded-xl border border-border/60 bg-muted/50 p-1"
    >
      {AGENT_SECTIONS.map((section) => {
        const active = value === section.id;
        const Icon = section.icon as LucideIcon;
        return (
          <button
            key={section.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(section.id)}
            className={cn(
              "relative z-[1] flex flex-1 min-w-[6.5rem] items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && !reduceMotion && (
              <motion.span
                layoutId="agent-section-active"
                className="absolute inset-0 rounded-lg bg-background shadow-sm border border-border/50"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            {active && reduceMotion && (
              <span className="absolute inset-0 rounded-lg bg-background shadow-sm border border-border/50" />
            )}
            <Icon className={cn("relative h-4 w-4 shrink-0", active && "text-primary")} />
            <span className="relative truncate">{section.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const reduceMotion = useReducedMotion();
  const editing = searchParams.get("edit") === "1";
  const section = parseSection(searchParams.get("sec"));
  const { data: agent, isLoading, error, refetch } = useAgent(id);
  const deleteAgent = useDeleteAgent();
  const updateAgent = useUpdateAgent();
  const testLlm = useTestAgentLLM();
  const canHardDelete = isSuperAdmin();
  const readOnly = isAgentReadOnly();
  const [testMessage, setTestMessage] = useState("Hola, ¿quién eres?");
  const [testResult, setTestResult] = useState<string | null>(null);

  const setSection = (next: AgentSectionId) => {
    setSearchParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        if (next === "modelo") p.delete("sec");
        else p.set("sec", next);
        return p;
      },
      { replace: true },
    );
  };

  const panelMotion = useMemo(
    () =>
      reduceMotion
        ? undefined
        : {
            initial: { opacity: 0, y: 10 },
            animate: {
              opacity: 1,
              y: 0,
              transition: { duration: motionTokens.page, ease: motionTokens.easePage },
            },
            exit: {
              opacity: 0,
              y: -6,
              transition: { duration: motionTokens.fast, ease: motionTokens.easeOut },
            },
          },
    [reduceMotion],
  );

  if (isLoading) {
    return <PageSkeleton variant="studio" />;
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
    <AdminPageMotion>
      <header className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Button variant="outline" size="sm" asChild className="self-start">
          <Link to="/app/agentes">
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
          {!readOnly && (
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
          )}
          {!readOnly && agent.is_active === false && (
            <Button
              variant="outline"
              size="sm"
              disabled={updateAgent.isPending}
              onClick={() => {
                if (!id) return;
                updateAgent.mutate(
                  { id, data: { is_active: true, status: "ACTIVE" } },
                  {
                    onSuccess: (saved) => {
                      if (saved?.is_active === false) {
                        toast.error("El servidor no reactivó el agente. Intenta de nuevo.");
                        refetch();
                        return;
                      }
                      toast.success("Agente reactivado");
                      refetch();
                    },
                    onError: (e) =>
                      toast.error(apiErrorMessage(e, "No se pudo reactivar el agente")),
                  },
                );
              }}
            >
              {updateAgent.isPending ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4 mr-1.5" />
              )}
              Reactivar
            </Button>
          )}
          {!readOnly && agent.is_active !== false && (
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
                  Desactivar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Desactivar agente</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Desactivar «{agent.name}»? Podrás verlo con «Ver inactivos» y reactivarlo
                    después.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => {
                      if (!id) return;
                      deleteAgent.mutate(
                        { id, hard: false },
                        {
                          onSuccess: () => {
                            toast.success("Agente desactivado");
                            navigate("/app/agentes");
                          },
                          onError: (e) =>
                            toast.error(apiErrorMessage(e, "No se pudo desactivar el agente")),
                        },
                      );
                    }}
                  >
                    Desactivar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {!readOnly && agent.is_active === false && canHardDelete && (
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
                  <AlertDialogTitle>Eliminar permanentemente</AlertDialogTitle>
                  <AlertDialogDescription>
                    ¿Eliminar «{agent.name}» de forma permanente? No se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => {
                      if (!id) return;
                      deleteAgent.mutate(
                        { id, hard: true },
                        {
                          onSuccess: () => {
                            toast.success("Agente eliminado");
                            navigate("/app/agentes");
                          },
                          onError: (e) =>
                            toast.error(apiErrorMessage(e, "No se pudo eliminar el agente")),
                        },
                      );
                    }}
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </header>

      <AgentSectionNav value={section} onChange={setSection} />

      <div className="relative min-h-[280px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={section} role="tabpanel" className="space-y-4" {...(panelMotion ?? {})}>
            {section === "modelo" && (
              <>
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
                      <span className="font-medium">
                        {agent.use_rag ? "Activado" : "Desactivado"}
                      </span>
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
              </>
            )}

            {section === "rag" && <AgentKnowledgePanel agentId={id!} readOnly={readOnly} />}

            {section === "skills" && <AgentSkillsPanel agentId={id!} readOnly={readOnly} />}

            {section === "flujo" && <AgentFlowPolicyPanel agentId={id!} readOnly={readOnly} />}

            {section === "test" && (
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
                            setTestResult(
                              res.response || res.error || JSON.stringify(res, null, 2),
                            );
                            toast.success("Test completado");
                          },
                          onError: (e) => toast.error(apiErrorMessage(e, "Falló el test LLM")),
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
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AdminPageMotion>
  );
}
