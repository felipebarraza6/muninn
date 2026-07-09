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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AgentFormProps {
  agent?: Agent | null;
  onCancel: () => void;
  onSaved: () => void;
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
  const [temperature, setTemperature] = useState(agent?.temperature ?? 0.7);
  const [maxTokens, setMaxTokens] = useState(agent?.max_tokens ?? 1024);
  const [useRag, setUseRag] = useState(agent?.use_rag ?? false);
  const [isActive, setIsActive] = useState(agent?.is_active ?? true);

  useEffect(() => {
    if (agent) {
      setName(agent.name ?? "");
      setAgentType(agent.agent_type ?? "general");
      setSystemPrompt(agent.system_prompt ?? "");
      setTemperature(agent.temperature ?? 0.7);
      setMaxTokens(agent.max_tokens ?? 1024);
      setUseRag(agent.use_rag ?? false);
      setIsActive(agent.is_active ?? true);
    }
  }, [agent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<Agent> = {
      name,
      agent_type: agentType,
      system_prompt: systemPrompt,
      temperature,
      max_tokens: maxTokens,
      use_rag: useRag,
      is_active: isActive,
    };

    if (isEditing && agent) {
      update.mutate(
        { id: agent.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Agente actualizado");
            onSaved();
          },
          onError: () => toast.error("Error al actualizar el agente"),
        },
      );
    } else {
      create.mutate(payload, {
        onSuccess: () => {
          toast.success("Agente creado");
          onSaved();
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
        <CardDescription>Configura el comportamiento y el modelo del agente.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
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
            <Label htmlFor="prompt">Instrucciones del sistema</Label>
            <Textarea
              id="prompt"
              rows={5}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Instrucciones del sistema para el agente..."
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
