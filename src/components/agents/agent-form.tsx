import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { agentFormSchema, type AgentFormValues } from "@/lib/schemas/agent";
import { PromptEditor } from "@/components/editors/PromptEditor";
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

function toDefaults(agent?: Agent | null): AgentFormValues {
  return {
    name: agent?.name ?? "",
    agent_type: agent?.agent_type ?? "general",
    system_prompt: agent?.system_prompt ?? "",
    welcome_message: agent?.welcome_message ?? "",
    llm_provider: agent?.llm_provider ? String(agent.llm_provider) : null,
    llm_model: agent?.llm_model ? String(agent.llm_model) : null,
    temperature: agent?.temperature ?? 0.7,
    max_tokens: agent?.max_tokens ?? 1024,
    use_rag: agent?.use_rag ?? false,
    rag_top_k: agent?.rag_top_k ?? 5,
    embedding_model: agent?.embedding_model ?? "",
    semantic_weight: agent?.semantic_weight ?? 0.7,
    use_semantic_search: agent?.use_semantic_search ?? true,
    is_active: agent?.is_active ?? true,
  };
}

export function AgentForm({ agent, onCancel, onSaved }: AgentFormProps) {
  const create = useCreateAgent();
  const update = useUpdateAgent();
  const isEditing = !!agent;

  const form = useForm<AgentFormValues>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: toDefaults(agent),
  });

  const providerId = form.watch("llm_provider");
  const useRag = form.watch("use_rag");
  const temperature = form.watch("temperature");
  const semanticWeight = form.watch("semantic_weight");

  const { data: providers = [] } = useLlmProviders();
  const { data: models = [] } = useLlmModels(providerId || null);

  useEffect(() => {
    form.reset(toDefaults(agent));
  }, [agent, form]);

  const onSubmit = form.handleSubmit((values) => {
    const payload: Partial<Agent> = {
      name: values.name,
      agent_type: values.agent_type,
      system_prompt: values.system_prompt,
      welcome_message: values.welcome_message || undefined,
      llm_provider: values.llm_provider || null,
      llm_model: values.llm_model || null,
      temperature: values.temperature,
      max_tokens: values.max_tokens,
      use_rag: values.use_rag,
      rag_top_k: values.rag_top_k,
      embedding_model: values.embedding_model || undefined,
      semantic_weight: values.semantic_weight,
      use_semantic_search: values.use_semantic_search,
      is_active: values.is_active,
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
  });

  const isPending = create.isPending || update.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{isEditing ? "Editar agente" : "Nuevo agente"}</CardTitle>
        <CardDescription>Modelo, prompt (CodeMirror), RAG y comportamiento.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Controller
                control={form.control}
                name="agent_type"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AGENT_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Proveedor LLM</Label>
              <Controller
                control={form.control}
                name="llm_provider"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(v) => {
                      field.onChange(v);
                      form.setValue("llm_model", null);
                    }}
                  >
                    <SelectTrigger>
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
                )}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Modelo</Label>
              <Controller
                control={form.control}
                name="llm_model"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={!providerId}
                  >
                    <SelectTrigger>
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
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Instrucciones del sistema</Label>
            <Controller
              control={form.control}
              name="system_prompt"
              render={({ field }) => (
                <PromptEditor value={field.value ?? ""} onChange={field.onChange} />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcome">Mensaje de bienvenida</Label>
            <Textarea id="welcome" rows={2} {...form.register("welcome_message")} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Temperatura</Label>
              <span className="text-xs text-muted-foreground">{temperature.toFixed(2)}</span>
            </div>
            <Controller
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <Slider
                  value={[field.value]}
                  onValueChange={(v) => field.onChange(v[0])}
                  min={0}
                  max={2}
                  step={0.05}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxTokens">Máximo de tokens</Label>
            <Input
              id="maxTokens"
              type="number"
              {...form.register("max_tokens", { valueAsNumber: true })}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label>Usar conocimiento (RAG)</Label>
              <p className="text-xs text-muted-foreground">
                El agente podrá consultar documentos indexados.
              </p>
            </div>
            <Controller
              control={form.control}
              name="use_rag"
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>

          {useRag && (
            <div className="grid gap-4 sm:grid-cols-2 rounded-lg border p-3">
              <div className="space-y-2">
                <Label>Top K</Label>
                <Input type="number" {...form.register("rag_top_k", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label>Embedding</Label>
                <Input {...form.register("embedding_model")} placeholder="text-embedding-3-small" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <Label>Peso semántico</Label>
                  <span className="text-xs text-muted-foreground">{semanticWeight.toFixed(2)}</span>
                </div>
                <Controller
                  control={form.control}
                  name="semantic_weight"
                  render={({ field }) => (
                    <Slider
                      value={[field.value]}
                      onValueChange={(v) => field.onChange(v[0])}
                      min={0}
                      max={1}
                      step={0.05}
                    />
                  )}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3 sm:col-span-2">
                <Label>Búsqueda semántica</Label>
                <Controller
                  control={form.control}
                  name="use_semantic_search"
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label>Activo</Label>
              <p className="text-xs text-muted-foreground">
                Determina si el agente puede atender conversaciones.
              </p>
            </div>
            <Controller
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
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
