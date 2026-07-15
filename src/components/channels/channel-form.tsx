import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateChannel, useUpdateChannel, type Channel } from "@/api/hooks/useChannels";
import { useAgents } from "@/api/hooks/useAgents";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ChannelFormProps {
  channel?: Channel | null;
  onCancel: () => void;
  onSaved: () => void;
}

const CHANNEL_TYPES = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
  { value: "email", label: "Correo electrónico" },
  { value: "web_socket", label: "Chat web" },
  { value: "web_embed", label: "Widget web" },
  { value: "instagram", label: "Instagram" },
  { value: "messenger", label: "Messenger" },
  { value: "sms", label: "SMS" },
];

const PROVIDERS: Record<string, string[]> = {
  whatsapp: ["meta", "twilio"],
  telegram: ["telegram_bot"],
  email: ["sendgrid", "smtp"],
  web_socket: ["custom"],
  web_embed: ["custom"],
  instagram: ["meta"],
  messenger: ["meta"],
  sms: ["twilio"],
};

export function ChannelForm({ channel, onCancel, onSaved }: ChannelFormProps) {
  const create = useCreateChannel();
  const update = useUpdateChannel();
  const { data: agents = [] } = useAgents();
  const isEditing = !!channel;

  const [name, setName] = useState(channel?.name ?? "");
  const [channelType, setChannelType] = useState(channel?.channel_type ?? "whatsapp");
  const [provider, setProvider] = useState(channel?.provider ?? "");
  const [agentId, setAgentId] = useState(
    channel?.assigned_agent ? String(channel.assigned_agent) : "",
  );
  const [isActive, setIsActive] = useState(channel?.is_active ?? true);
  const [configJson, setConfigJson] = useState(
    channel?.config ? JSON.stringify(channel.config, null, 2) : "{}",
  );

  useEffect(() => {
    if (channel) {
      setName(channel.name ?? "");
      setChannelType(channel.channel_type ?? "whatsapp");
      setProvider(channel.provider ?? PROVIDERS[channel.channel_type ?? "whatsapp"]?.[0] ?? "");
      setAgentId(channel.assigned_agent ? String(channel.assigned_agent) : "");
      setIsActive(channel.is_active ?? true);
      setConfigJson(channel.config ? JSON.stringify(channel.config, null, 2) : "{}");
    }
  }, [channel]);

  useEffect(() => {
    const allowed = PROVIDERS[channelType] ?? ["custom"];
    if (!allowed.includes(provider)) {
      setProvider(allowed[0] ?? "custom");
    }
  }, [channelType, provider]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let parsedConfig = {};
    try {
      parsedConfig = JSON.parse(configJson);
    } catch {
      toast.error("El JSON de configuración no es válido");
      return;
    }

    const payload: Partial<Channel> = {
      name,
      channel_type: channelType,
      provider,
      assigned_agent: agentId ? Number(agentId) : null,
      is_active: isActive,
      config: parsedConfig,
    };

    if (isEditing && channel) {
      update.mutate(
        { id: channel.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Canal actualizado");
            onSaved();
          },
          onError: () => toast.error("Error al actualizar el canal"),
        },
      );
    } else {
      create.mutate(payload, {
        onSuccess: () => {
          toast.success("Canal creado");
          onSaved();
        },
        onError: () => toast.error("Error al crear el canal"),
      });
    }
  };

  const isPending = create.isPending || update.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{isEditing ? "Editar canal" : "Nuevo canal"}</CardTitle>
        <CardDescription>Configura un punto de contacto para tus agentes.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="channelType">Tipo de canal</Label>
            <Select value={channelType} onValueChange={setChannelType}>
              <SelectTrigger id="channelType">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {CHANNEL_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider">Proveedor</Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger id="provider">
                <SelectValue placeholder="Selecciona un proveedor" />
              </SelectTrigger>
              <SelectContent>
                {(PROVIDERS[channelType] ?? ["custom"]).map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent">Agente asignado</Label>
            <Select value={agentId} onValueChange={setAgentId}>
              <SelectTrigger id="agent">
                <SelectValue placeholder="Selecciona un agente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Ninguno</SelectItem>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={String(agent.id)}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="config">Configuración (JSON)</Label>
            <textarea
              id="config"
              value={configJson}
              onChange={(e) => setConfigJson(e.target.value)}
              rows={6}
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="text-xs text-muted-foreground">
              Ejemplo WhatsApp/Meta: {'{"api_key": "...", "phone_number_id": "..."}'}
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="isActiveChannel">Activo</Label>
              <p className="text-xs text-muted-foreground">
                Determina si el canal puede recibir mensajes.
              </p>
            </div>
            <Switch id="isActiveChannel" checked={isActive} onCheckedChange={setIsActive} />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Guardar cambios" : "Crear canal"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
