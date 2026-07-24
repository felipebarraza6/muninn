import { useEffect, useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateAgent, useUpdateAgent, type Agent } from "@/api/hooks/useAgents";
import { useLlmModels, useLlmProviders, type LlmModel } from "@/api/hooks/useLlm";
import {
  MUNINN_ASSIGNABLE_ROLE_CODES,
  MUNINN_ROLE_LABELS_ES,
} from "@/api/hooks/useBranches";
import { agentFormSchema, type AgentFormValues } from "@/lib/schemas/agent";
import { apiErrorMessage } from "@/lib/apiError";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AgentFormProps {
  agent?: Agent | null;
  onCancel: () => void;
  onSaved: (agent?: Agent) => void;
}

function isEmbeddingCapable(m: LlmModel): boolean {
  const caps = m.capabilities;
  if (Array.isArray(caps) && caps.some((c) => String(c).toLowerCase().includes("embed"))) {
    return true;
  }
  if (caps && typeof caps === "object" && !Array.isArray(caps)) {
    const map = caps as Record<string, unknown>;
    if (map.embeddings || map.embedding) return true;
  }
  const id = (m.model_id || m.name || "").toLowerCase();
  return id.includes("embed");
}

function modelLabel(m: LlmModel): string {
  return (m.model_id || m.name || "").trim() || String(m.id);
}

/** Slug en minúsculas desde el nombre (ej: "Mi Agente" → "mi-agente"). */
function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

function toDefaults(agent?: Agent | null): AgentFormValues {
  return {
    name: agent?.name ?? "",
    slug: agent?.slug ?? "",
    agent_type: agent?.agent_type ?? "ASSISTANT",
    system_prompt: agent?.system_prompt ?? "",
    welcome_message: agent?.welcome_message ?? "",
    llm_provider: agent?.llm_provider ? String(agent.llm_provider) : "",
    llm_model: agent?.llm_model ? String(agent.llm_model) : "",
    temperature: agent?.temperature ?? 0.7,
    max_tokens: agent?.max_tokens ?? 1024,
    max_tool_iterations: agent?.max_tool_iterations ?? 3,
    icon: agent?.icon ?? "",
    color: agent?.color ?? "",
    allowed_roles: Array.isArray(agent?.allowed_roles) ? [...agent.allowed_roles] : [],
    use_rag: agent?.use_rag ?? false,
    rag_top_k: agent?.rag_top_k ?? 5,
    embedding_model: agent?.embedding_model ? String(agent.embedding_model) : "",
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
  const slugTouched = useRef(isEditing);

  const providerId = form.watch("llm_provider");
  const useRag = form.watch("use_rag");
  const temperature = form.watch("temperature");
  const maxToolIterations = form.watch("max_tool_iterations");
  const allowedRoles = form.watch("allowed_roles");
  const semanticWeight = form.watch("semantic_weight");
  const errors = form.formState.errors;

  const { data: providers = [] } = useLlmProviders();
  const { data: modelsPage } = useLlmModels({
    providerId: providerId || null,
    isActive: true,
    enabled: Boolean(providerId),
  });
  const models = modelsPage?.results ?? [];
  const { data: embeddingModelsPage } = useLlmModels({
    isActive: true,
    capabilities: ["embeddings"],
  });
  const embeddingModels = useMemo(() => {
    const fromApi = embeddingModelsPage?.results ?? [];
    // Refuerzo en cliente por si el API no marca capabilities en todos.
    return fromApi.filter(isEmbeddingCapable);
  }, [embeddingModelsPage]);

  useEffect(() => {
    slugTouched.current = isEditing;
    form.reset(toDefaults(agent));
  }, [agent, form, isEditing]);

  const onSubmit = form.handleSubmit((values) => {
    const payload: Partial<Agent> = {
      name: values.name,
      slug: values.slug,
      agent_type: values.agent_type || "ASSISTANT",
      target_app: agent?.target_app || "ai_agents",
      system_prompt: values.system_prompt,
      welcome_message: values.welcome_message || undefined,
      llm_provider: values.llm_provider || null,
      llm_model: values.llm_model || null,
      temperature: values.temperature,
      max_tokens: values.max_tokens,
      max_tool_iterations: values.max_tool_iterations,
      icon: values.icon?.trim() || null,
      color: values.color?.trim() || null,
      allowed_roles: values.allowed_roles ?? [],
      use_rag: values.use_rag,
      rag_top_k: values.rag_top_k,
      embedding_model: values.embedding_model || null,
      semantic_weight: values.semantic_weight,
      use_semantic_search: values.use_semantic_search,
      is_active: values.is_active,
      // Mantener status alineado: el backend antes podía ignorar is_active=true
      // si el agente seguía con status INACTIVE.
      status: values.is_active ? "ACTIVE" : "INACTIVE",
    };

    if (isEditing && agent) {
      update.mutate(
        { id: agent.id, data: payload },
        {
          onSuccess: (saved) => {
            toast.success("Agente actualizado");
            onSaved(saved);
          },
          onError: (e) => toast.error(apiErrorMessage(e, "Error al actualizar el agente")),
        },
      );
    } else {
      create.mutate(payload, {
        onSuccess: (saved) => {
          toast.success("Agente creado");
          onSaved(saved);
        },
        onError: (e) => toast.error(apiErrorMessage(e, "Error al crear el agente")),
      });
    }
  });

  const isPending = create.isPending || update.isPending;

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Ej. Asistente de ventas"
                {...form.register("name", {
                  onChange: (e) => {
                    if (!isEditing && !slugTouched.current) {
                      form.setValue("slug", slugify(e.target.value), { shouldValidate: false });
                    }
                  },
                })}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Identificador (slug)</Label>
              <Input
                id="slug"
                placeholder="mi-agente"
                {...form.register("slug", {
                  onChange: (e) => {
                    slugTouched.current = true;
                    const cleaned = e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "-")
                      .replace(/-+/g, "-");
                    form.setValue("slug", cleaned, { shouldValidate: true });
                  },
                })}
              />
              {errors.slug ? (
                <p className="text-xs text-destructive">{errors.slug.message}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Se genera desde el nombre; puedes editarlo. Minúsculas y guiones.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Proveedor</Label>
              <Controller
                control={form.control}
                name="llm_provider"
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={(v) => {
                      field.onChange(v);
                      form.setValue("llm_model", "");
                    }}
                  >
                    <SelectTrigger aria-invalid={!!errors.llm_provider}>
                      <SelectValue placeholder="Selecciona LLM" />
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
              {errors.llm_provider && (
                <p className="text-xs text-destructive">{errors.llm_provider.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Modelo</Label>
              <Controller
                control={form.control}
                name="llm_model"
                render={({ field }) => (
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                    disabled={!providerId}
                  >
                    <SelectTrigger aria-invalid={!!errors.llm_model}>
                      <SelectValue
                        placeholder={providerId ? "Selecciona modelo" : "Primero el proveedor"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((m) => (
                        <SelectItem key={String(m.id)} value={String(m.id)}>
                          <span className="font-mono text-xs">{modelLabel(m)}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.llm_model && (
                <p className="text-xs text-destructive">{errors.llm_model.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="soul">SOUL.md</Label>
            <p className="text-xs text-muted-foreground">
              Instrucciones del sistema: personalidad, reglas y tono. Define cómo piensa y responde.
            </p>
            <Textarea
              id="soul"
              rows={8}
              className="font-mono text-sm"
              placeholder={"# SOUL.md\n\nQuién eres, qué puedes hacer y cómo debes responder…"}
              {...form.register("system_prompt")}
            />
            {errors.system_prompt && (
              <p className="text-xs text-destructive">{errors.system_prompt.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcome">Mensaje de bienvenida</Label>
            <p className="text-xs text-muted-foreground">
              Cómo se presenta el agente al abrir el chat: el primer mensaje que ve el usuario.
            </p>
            <Textarea
              id="welcome"
              rows={2}
              placeholder="Hola, soy… ¿en qué te puedo ayudar?"
              {...form.register("welcome_message")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
              {errors.max_tokens && (
                <p className="text-xs text-destructive">{errors.max_tokens.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Iteraciones de tools</Label>
                <span className="text-xs text-muted-foreground">{maxToolIterations}</span>
              </div>
              <Controller
                control={form.control}
                name="max_tool_iterations"
                render={({ field }) => (
                  <Slider
                    value={[field.value]}
                    onValueChange={(v) => field.onChange(v[0])}
                    min={1}
                    max={8}
                    step={1}
                  />
                )}
              />
              <p className="text-xs text-muted-foreground">
                Cuántas veces el agente puede encadenar skills en un turno (1–8).
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="agent-icon">Icono</Label>
                <Input
                  id="agent-icon"
                  placeholder="🤖 o nombre"
                  maxLength={64}
                  {...form.register("icon")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agent-color">Color</Label>
                <Input
                  id="agent-color"
                  placeholder="#2dd4bf"
                  maxLength={32}
                  {...form.register("color")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border p-3">
            <Label>Roles permitidos</Label>
            <p className="text-xs text-muted-foreground">
              Sin selección = visible para todos con acceso al módulo. Si marcas roles, solo esos
              ven el agente.
            </p>
            <div className="flex flex-wrap gap-4 pt-1">
              {MUNINN_ASSIGNABLE_ROLE_CODES.map((code) => {
                const checked = allowedRoles.includes(code);
                return (
                  <label key={code} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => {
                        const next = new Set(allowedRoles);
                        if (v === true) next.add(code);
                        else next.delete(code);
                        form.setValue("allowed_roles", Array.from(next), {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                    />
                    {MUNINN_ROLE_LABELS_ES[code]}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label>Usar conocimiento (RAG)</Label>
              <p className="text-xs text-muted-foreground">
                Activa la consulta a documentos. Después asignas e indexas en Conocimiento / tab
                RAG.
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
                <Label>Modelo de embedding</Label>
                <Controller
                  control={form.control}
                  name="embedding_model"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={(v) => field.onChange(v === "__none__" ? "" : v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">Automático / por defecto</SelectItem>
                        {embeddingModels.map((m) => (
                          <SelectItem key={String(m.id)} value={String(m.id)}>
                            <span className="font-mono text-xs">{modelLabel(m)}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Usado al buscar en RAG. Los documentos se vectorizan al asignarlos (embedding de
                  la sucursal)
                  {embeddingModels.length === 0 ? " · ninguno activo en el catálogo" : ""}.
                </p>
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
                Si está activo, puede atender conversaciones y canales.
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
