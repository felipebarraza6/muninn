import { useEffect, useMemo, useState } from "react";
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
import {
  useCreateChannel,
  useUpdateChannel,
  useChannelsCatalog,
  type Channel,
} from "@/api/hooks/useChannels";
import { useAgents } from "@/api/hooks/useAgents";
import {
  ChannelConfigFields,
  configPayloadForSave,
} from "@/components/channels/channel-config-fields";
import { toast } from "sonner";
import { apiErrorMessage } from "@/lib/apiError";
import { Loader2 } from "lucide-react";

interface ChannelFormProps {
  channel?: Channel | null;
  onCancel: () => void;
  onSaved: (channel?: Channel) => void;
  /** Si true, omitir Card wrapper (útil dentro de Dialog). */
  bare?: boolean;
}

export function ChannelForm({ channel, onCancel, onSaved, bare }: ChannelFormProps) {
  const create = useCreateChannel();
  const update = useUpdateChannel();
  const { data: agents = [] } = useAgents();
  const { data: catalog, isLoading: catalogLoading } = useChannelsCatalog();
  const isEditing = !!channel;

  const catalogItems = useMemo(() => catalog?.results ?? [], [catalog?.results]);

  const [name, setName] = useState(channel?.name ?? "");
  const [channelType, setChannelType] = useState(channel?.channel_type ?? "");
  const [provider, setProvider] = useState(channel?.provider ?? "");
  const [agentId, setAgentId] = useState(
    channel?.assigned_agent ? String(channel.assigned_agent) : "",
  );
  const [isActive, setIsActive] = useState(channel?.is_active ?? true);
  const [welcomeMessage, setWelcomeMessage] = useState(channel?.welcome_message ?? "");
  const [configValues, setConfigValues] = useState<Record<string, unknown>>(
    () => channel?.config_masked ?? channel?.config ?? {},
  );

  const selectedCatalog = useMemo(
    () => catalogItems.find((c) => c.channel_type === channelType),
    [catalogItems, channelType],
  );

  const providers = selectedCatalog?.providers ?? [];
  const fields = useMemo(() => {
    if (!selectedCatalog) return [];
    if (provider && selectedCatalog.config_fields_by_provider?.[provider]) {
      return selectedCatalog.config_fields_by_provider[provider];
    }
    return selectedCatalog.config_fields ?? [];
  }, [selectedCatalog, provider]);

  useEffect(() => {
    if (channel) {
      setName(channel.name ?? "");
      setChannelType(channel.channel_type ?? "");
      setProvider(channel.provider ?? "");
      setAgentId(channel.assigned_agent ? String(channel.assigned_agent) : "");
      setIsActive(channel.is_active ?? true);
      setWelcomeMessage(channel.welcome_message ?? "");
      setConfigValues(channel.config_masked ?? channel.config ?? {});
    }
  }, [channel]);

  // Defaults al cargar catálogo / cambiar tipo
  useEffect(() => {
    if (!catalogItems.length) return;
    if (!channelType) {
      const first = catalogItems[0];
      setChannelType(first.channel_type);
      setProvider(first.default_provider);
      return;
    }
    const item = catalogItems.find((c) => c.channel_type === channelType);
    if (!item) return;
    const allowed = item.providers.map((p) => p.value);
    if (!provider || !allowed.includes(provider)) {
      setProvider(item.default_provider || allowed[0] || "custom");
    }
  }, [catalogItems, channelType, provider]);

  const handleConfigChange = (key: string, value: unknown) => {
    setConfigValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    if (!channelType || !provider) {
      toast.error("Selecciona tipo y proveedor");
      return;
    }

    const missing = fields.filter(
      (f) =>
        f.required &&
        !f.secret &&
        (configValues[f.key] === undefined ||
          configValues[f.key] === null ||
          configValues[f.key] === ""),
    );
    // En create, secrets required también
    const missingSecrets = !isEditing
      ? fields.filter(
          (f) =>
            f.required &&
            f.secret &&
            (configValues[f.key] === undefined ||
              configValues[f.key] === null ||
              configValues[f.key] === ""),
        )
      : [];
    if (missing.length || missingSecrets.length) {
      toast.error(`Completa: ${[...missing, ...missingSecrets].map((f) => f.label).join(", ")}`);
      return;
    }

    const payload: Partial<Channel> = {
      name: name.trim(),
      channel_type: channelType,
      provider,
      assigned_agent: agentId || null,
      is_active: isActive,
      welcome_message: welcomeMessage,
      config: configPayloadForSave(configValues, fields),
    };

    if (isEditing && channel) {
      update.mutate(
        { id: channel.id, data: payload },
        {
          onSuccess: (data) => {
            toast.success("Canal actualizado");
            onSaved(data);
          },
          onError: (e) => toast.error(apiErrorMessage(e, "Error al actualizar el canal")),
        },
      );
    } else {
      create.mutate(payload, {
        onSuccess: (data) => {
          toast.success("Canal creado");
          onSaved(data);
        },
        onError: (e) => toast.error(apiErrorMessage(e, "Error al crear el canal")),
      });
    }
  };

  const isPending = create.isPending || update.isPending;

  const form = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {catalogLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Cargando tipos de canal…
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="channelType">Tipo de canal</Label>
          <Select
            value={channelType}
            onValueChange={(v) => {
              setChannelType(v);
              setConfigValues({});
            }}
            disabled={isEditing}
          >
            <SelectTrigger id="channelType">
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              {catalogItems.map((t) => (
                <SelectItem key={t.channel_type} value={t.channel_type}>
                  {t.display_name}
                  {!t.production_ready ? " (beta)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedCatalog?.notes ? (
            <p className="text-xs text-muted-foreground">{selectedCatalog.notes}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="provider">Proveedor</Label>
          <Select
            value={provider}
            onValueChange={(v) => {
              setProvider(v);
              setConfigValues({});
            }}
            disabled={isEditing && providers.length <= 1}
          >
            <SelectTrigger id="provider">
              <SelectValue placeholder="Selecciona un proveedor" />
            </SelectTrigger>
            <SelectContent>
              {providers.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="agent">Agente asignado</Label>
        <Select
          value={agentId || "__none__"}
          onValueChange={(v) => setAgentId(v === "__none__" ? "" : v)}
        >
          <SelectTrigger id="agent">
            <SelectValue placeholder="Selecciona un agente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Ninguno</SelectItem>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={String(agent.id)}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="welcome">Mensaje de bienvenida</Label>
        <Input
          id="welcome"
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
          placeholder="Hola, ¿en qué puedo ayudarte?"
        />
      </div>

      <div className="space-y-2">
        <Label>Credenciales / configuración</Label>
        <ChannelConfigFields
          fields={fields}
          values={configValues}
          onChange={handleConfigChange}
          disabled={isPending}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="space-y-0.5">
          <Label htmlFor="isActiveChannel">Activo</Label>
          <p className="text-xs text-muted-foreground">
            Determina si el canal puede recibir/enviar mensajes.
          </p>
        </div>
        <Switch id="isActiveChannel" checked={isActive} onCheckedChange={setIsActive} />
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending || catalogLoading}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Guardar cambios" : "Crear canal"}
        </Button>
      </div>
    </form>
  );

  if (bare) return form;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{isEditing ? "Editar canal" : "Nuevo canal"}</CardTitle>
        <CardDescription>Configura un punto de contacto para tus agentes.</CardDescription>
      </CardHeader>
      <CardContent>{form}</CardContent>
    </Card>
  );
}
