import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useCreateAgent, useUpdateAgent, type Agent } from "@/api/hooks/useAgents";
import { useLlmModels, useLlmProviders } from "@/api/hooks/useLlm";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AgentFormProps {
  agent?: Agent | null;
  onCancel: () => void;
  onSaved: (agent?: Agent) => void;
}

const AGENT_TYPES = [
  { value: "sales", label: "Ventas" },
  { value: "support", label: "Soporte" },
  { value: "scheduling", label: "Agendamiento" },
  { value: "recovery", label: "Recuperación" },
  { value: "general", label: "General" },
];

export function AgentForm({ agent, onCancel, onSaved }: AgentFormProps) {
  const create = useCreateAgent();
  const update = useUpdateAgent();
  const isEditing = !!agent;

  const [name, setName] = useState(agent?.name ?? "");
  const [agentType, setAgentType] = useState(agent?.agent_type ?? "general");
  const [systemPrompt, setSystemPrompt] = useState(agent?.system_prompt ?? "");
  const [welcomeMessage, setWelcomeMessage] = useState(agent?.welcome_message ?? "");
  const [providerId, setProviderId] = useState(
    agent?.llm_provider ? String(agent.llm_provider) : "",
  );
  const [modelId, setModelId] = useState(agent?.llm_model ? String(agent.llm_model) : "");
  const [temperature, setTemperature] = useState(agent?.temperature ?? 0.7);
  const [maxTokens, setMaxTokens] = useState(agent?.max_tokens ?? 1024);
  const [useRag, setUseRag] = useState(agent?.use_rag ?? false);
  const [ragTopK, setRagTopK] = useState(agent?.rag_top_k ?? 5);
  const [embeddingModel, setEmbeddingModel] = useState(agent?.embedding_model ?? "");
  const [semanticWeight, setSemanticWeight] = useState(agent?.semantic_weight ?? 0.7);
  const [useSemanticSearch, setUseSemanticSearch] = useState(agent?.use_semantic_search ?? true);
  const [isActive, setIsActive] = useState(agent?.is_active ?? true);

  const { data: providers = [] } = useLlmProviders();
  const { data: models = [] } = useLlmModels(providerId || null);

  useEffect(() => {
    if (!agent) return;
    setName(agent.name ?? "");
    setAgentType(agent.agent_type ?? "general");
    setSystemPrompt(agent.system_prompt ?? "");
    setWelcomeMessage(agent.welcome_message ?? "");
    setProviderId(agent.llm_provider ? String(agent.llm_provider) : "");
    setModelId(agent.llm_model ? String(agent.llm_model) : "");
    setTemperature(agent.temperature ?? 0.7);
    setMaxTokens(agent.max_tokens ?? 1024);
    setUseRag(agent.use_rag ?? false);
    setRagTopK(agent.rag_top_k ?? 5);
    setEmbeddingModel(agent.embedding_model ?? "");
    setSemanticWeight(agent.semantic_weight ?? 0.7);
    setUseSemanticSearch(agent.use_semantic_search ?? true);
    setIsActive(agent.is_active ?? true);
  }, [agent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<Agent> = {
      name,
      agent_type: agentType,
      system_prompt: systemPrompt,
      welcome_message: welcomeMessage || undefined,
      llm_provider: providerId || null,
      llm_model: modelId || null,
      temperature,
      max_tokens: maxTokens,
      use_rag: useRag,
      rag_top_k: ragTopK,
      embedding_model: embeddingModel || undefined,
      semantic_weight: semanticWeight,
      use_semantic_search: useSemanticSearch,
      is_active: isActive,
    };

    if (isEditing && agent) {
      update.mutate(
        { id: agent.id, data: payload },
        {
          onSuccess: (saved) => {
            toast.success("Agente actualizado");
            onSaved(saved);
          },
          onError: () => toast.error("Error al actualizar el agente"),
        },
      );
    } else {
      create.mutate(payload, {
        onSuccess: (saved) => {
          toast.success("Agente creado");
          onSaved(saved);
        },
        onError: () => toast.error("Error al crear el agente"),
      });
    }
  };

  const isPending = create.isPending || update.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{isEditing ? "Editar agente" : "Nuevo agente"}</CardTitle>
        <CardDescription>Modelo, prompt, RAG y comportamiento del agente.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={agentType} onValueChange={setAgentType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {AGENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">Proveedor LLM</Label>
              <Select
                value={providerId}
                onValueChange={(v) => {
                  setProviderId(v);
                  setModelId("");
                }}
              >
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Selecciona proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((p) => (
                    <SelectItem key={String(p.id)} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="model">Modelo</Label>
              <Select value={modelId} onValueChange={setModelId} disabled={!providerId}>
                <SelectTrigger id="model">
                  <SelectValue placeholder="Selecciona modelo" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={String(m.id)} value={String(m.id)}>
                      {m.name}
                      {m.model_id ? ` (${m.model_id})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Instrucciones del sistema</Label>
            <Textarea
              id="prompt"
              rows={5}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Instrucciones del sistema para el agente..."
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcome">Mensaje de bienvenida</Label>
            <Textarea
              id="welcome"
              rows={2}
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Temperatura</Label>
              <span className="text-xs text-muted-foreground">{temperature.toFixed(2)}</span>
            </div>
            <Slider
              value={[temperature]}
              onValueChange={(v) => setTemperature(v[0])}
              min={0}
              max={2}
              step={0.05}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxTokens">Máximo de tokens</Label>
            <Input
              id="maxTokens"
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
              min={1}
              max={8192}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="useRag">Usar conocimiento (RAG)</Label>
              <p className="text-xs text-muted-foreground">
                El agente podrá consultar documentos indexados.
              </p>
            </div>
            <Switch id="useRag" checked={useRag} onCheckedChange={setUseRag} />
          </div>

          {useRag && (
            <div className="grid gap-4 sm:grid-cols-2 rounded-lg border p-3">
              <div className="space-y-2">
                <Label htmlFor="ragTopK">Top K fragmentos</Label>
                <Input
                  id="ragTopK"
                  type="number"
                  min={1}
                  max={50}
                  value={ragTopK}
                  onChange={(e) => setRagTopK(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="embedding">Modelo de embeddings</Label>
                <Input
                  id="embedding"
                  value={embeddingModel}
                  onChange={(e) => setEmbeddingModel(e.target.value)}
                  placeholder="text-embedding-3-small"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <Label>Peso semántico</Label>
                  <span className="text-xs text-muted-foreground">{semanticWeight.toFixed(2)}</span>
                </div>
                <Slider
                  value={[semanticWeight]}
                  onValueChange={(v) => setSemanticWeight(v[0])}
                  min={0}
                  max={1}
                  step={0.05}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3 sm:col-span-2">
                <Label htmlFor="semantic">Búsqueda semántica</Label>
                <Switch
                  id="semantic"
                  checked={useSemanticSearch}
                  onCheckedChange={setUseSemanticSearch}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Activo</Label>
              <p className="text-xs text-muted-foreground">
                Determina si el agente puede atender conversaciones.
              </p>
            </div>
            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Guardar cambios" : "Crear agente"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
