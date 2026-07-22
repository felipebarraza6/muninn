import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Trash2,
  Pencil,
  Play,
  Send,
  Inbox,
} from "lucide-react";
import {
  useChannel,
  useChannelsCatalog,
  useChannelSessions,
  useDeleteChannel,
  useRegenerateChannelSecret,
  useSendChannelMessage,
  useSimulateChannel,
  useTestChannel,
  useUpdateChannel,
  type Channel,
} from "@/api/hooks/useChannels";
import { useAgents } from "@/api/hooks/useAgents";
import { EmbedChatPanel } from "@/components/channels/EmbedChatPanel";
import {
  ChannelConfigFields,
  configPayloadForSave,
} from "@/components/channels/channel-config-fields";
import {
  getEmbedUrl,
  getIframeCode,
  getInAppEmbedUrl,
  getWidgetScriptCode,
} from "@/lib/channelEmbed";
import { channelAccent, channelIcon, channelLabel, formatChannelTestToast } from "@/lib/channels";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TABS = ["configuracion", "webhook", "probar", "sesiones", "instalacion"] as const;
type TabId = (typeof TABS)[number];

function ChannelPanel({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/60 bg-card/40 overflow-hidden",
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 px-4 sm:px-5 py-4 border-b border-border/50">
        <div className="min-w-0 space-y-0.5">
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
          {description ? (
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2 shrink-0">{actions}</div> : null}
      </div>
      <div className="px-4 sm:px-5 py-4 space-y-4">{children}</div>
    </section>
  );
}

function ChannelSubSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 pt-4 first:pt-0 border-t border-border/40 first:border-0">
      <div className="space-y-0.5">
        <h3 className="text-sm font-medium">{title}</h3>
        {description ? (
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copiado al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar");
    }
  };

  return (
    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCopy}>
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </Button>
  );
}

export default function ChannelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: channel, isLoading, error, refetch } = useChannel(id);
  const { data: catalog } = useChannelsCatalog();
  const { data: agents = [] } = useAgents();
  const update = useUpdateChannel();
  const remove = useDeleteChannel();
  const regenerate = useRegenerateChannelSecret();
  const testConnection = useTestChannel();
  const simulate = useSimulateChannel();
  const sendMessage = useSendChannelMessage();
  const {
    data: sessions = [],
    isLoading: sessionsLoading,
    refetch: refetchSessions,
  } = useChannelSessions(id);

  const tabParam = searchParams.get("tab");
  const activeTab: TabId = TABS.includes(tabParam as TabId) ? (tabParam as TabId) : "configuracion";

  const setTab = (tab: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", tab);
        return next;
      },
      { replace: true },
    );
  };

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [agentId, setAgentId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [configValues, setConfigValues] = useState<Record<string, unknown>>({});
  const [freshSecret, setFreshSecret] = useState<string | null>(null);

  const [simUser, setSimUser] = useState("test-user");
  const [simMessage, setSimMessage] = useState("Hola");
  const [sendUser, setSendUser] = useState("");
  const [sendText, setSendText] = useState("Mensaje de prueba desde Studio");
  const [lastResult, setLastResult] = useState<unknown>(null);

  useEffect(() => {
    if (!channel) return;
    setName(channel.name ?? "");
    setAgentId(channel.assigned_agent ? String(channel.assigned_agent) : "");
    setIsActive(channel.is_active ?? true);
    setWelcomeMessage(channel.welcome_message ?? "");
    setConfigValues(channel.config_masked ?? {});
    setFreshSecret(null);
  }, [channel]);

  const catalogItem = useMemo(
    () => catalog?.results.find((c) => c.channel_type === channel?.channel_type),
    [catalog, channel?.channel_type],
  );

  const fields = useMemo(() => {
    if (!catalogItem || !channel) return [];
    const byProvider = catalogItem.config_fields_by_provider?.[channel.provider ?? ""];
    return byProvider ?? catalogItem.config_fields ?? [];
  }, [catalogItem, channel]);

  const isWeb = channel?.channel_type === "web_socket" || channel?.channel_type === "web_embed";
  const supportsInbound = Boolean(channel?.supports_inbound);
  const supportsOutbound = channel?.supports_outbound !== false;

  const handleSave = () => {
    if (!channel) return;
    const payload: Partial<Channel> = {
      name: name.trim(),
      assigned_agent: agentId || null,
      is_active: isActive,
      welcome_message: welcomeMessage,
      config: configPayloadForSave(configValues, fields),
    };
    update.mutate(
      { id: channel.id, data: payload },
      {
        onSuccess: () => {
          toast.success("Canal guardado");
          setEditing(false);
          refetch();
        },
        onError: () => toast.error("No se pudo guardar"),
      },
    );
  };

  const handleTest = () => {
    if (!channel) return;
    testConnection.mutate(
      { id: channel.id },
      {
        onSuccess: (result) => {
          const toastMsg = formatChannelTestToast(result);
          if (result.ok) toast.success(toastMsg.title, { description: toastMsg.description });
          else toast.error(toastMsg.title, { description: toastMsg.description });
          setLastResult(result);
          refetch();
        },
        onError: () => toast.error("Error al probar conexión"),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver
        </Button>
        <Card>
          <CardContent className="p-6 text-destructive">
            Error al cargar el canal. Verifica que tengas permisos y que la API esté disponible.
          </CardContent>
        </Card>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(channel.id);
  const inAppUrl = getInAppEmbedUrl(channel.id);
  const iframeCode = getIframeCode(channel.id);
  const scriptCode = getWidgetScriptCode(channel.id);
  const accent = channelAccent(channel.channel_type);
  const ChannelIcon = channelIcon(channel.channel_type);

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <header className="flex flex-wrap items-start gap-4">
        <Button variant="outline" size="sm" asChild className="mt-1">
          <Link to="/canales">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver
          </Link>
        </Button>
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1",
            accent.avatar,
          )}
        >
          <ChannelIcon className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight truncate">
              {channel.name}
            </h1>
            <Badge variant={channel.is_active ? "default" : "secondary"} className="text-[10px]">
              {channel.is_active ? "Activo" : "Inactivo"}
            </Badge>
            {channel.is_verified ? (
              <Badge className="text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                Verificado
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px]">
                Sin verificar
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {channelLabel(channel.channel_type)} · {channel.provider ?? "Sin proveedor"} ·{" "}
            {channel.assigned_agent_name ?? "Sin agente"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTest}
            disabled={testConnection.isPending}
          >
            {testConnection.isPending ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-1.5" />
            )}
            Probar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive">
                <Trash2 className="h-4 w-4 mr-1.5" /> Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar canal?</AlertDialogTitle>
                <AlertDialogDescription>
                  Se eliminará «{channel.name}». Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    remove.mutate(channel.id, {
                      onSuccess: () => {
                        toast.success("Canal eliminado");
                        navigate("/canales");
                      },
                      onError: () => toast.error("No se pudo eliminar"),
                    })
                  }
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setTab}>
        <TabsList className="w-full sm:w-auto justify-start flex-wrap h-auto">
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
          <TabsTrigger value="webhook">Webhook</TabsTrigger>
          {isWeb && <TabsTrigger value="instalacion">Instalación</TabsTrigger>}
          <TabsTrigger value="probar">Probar</TabsTrigger>
          <TabsTrigger value="sesiones">Sesiones</TabsTrigger>
        </TabsList>

        <TabsContent value="configuracion" className="mt-4">
          <ChannelPanel
            title="Configuración"
            description={`Campos tipados del proveedor · ${channelLabel(channel.channel_type)}`}
            actions={
              !editing ? (
                <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                  <Pencil className="h-3.5 w-3.5 mr-1.5" /> Editar
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditing(false);
                      setName(channel.name ?? "");
                      setAgentId(channel.assigned_agent ? String(channel.assigned_agent) : "");
                      setIsActive(channel.is_active ?? true);
                      setWelcomeMessage(channel.welcome_message ?? "");
                      setConfigValues(channel.config_masked ?? {});
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={update.isPending}>
                    {update.isPending && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
                    Guardar
                  </Button>
                </>
              )
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!editing}
                />
              </div>
              <div className="space-y-2">
                <Label>Agente asignado</Label>
                <Select
                  value={agentId || "__none__"}
                  onValueChange={(v) => setAgentId(v === "__none__" ? "" : v)}
                  disabled={!editing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un agente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Ninguno</SelectItem>
                    {agents.map((a) => (
                      <SelectItem key={a.id} value={String(a.id)}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mensaje de bienvenida</Label>
              <Input
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                disabled={!editing}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-3 py-3">
              <div>
                <Label>Activo</Label>
                <p className="text-xs text-muted-foreground">Puede recibir/enviar mensajes</p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} disabled={!editing} />
            </div>

            <ChannelSubSection title="Credenciales / configuración">
              {editing ? (
                <ChannelConfigFields
                  fields={fields}
                  values={configValues}
                  onChange={(k, v) => setConfigValues((prev) => ({ ...prev, [k]: v }))}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {fields.length === 0 && (
                    <p className="text-muted-foreground col-span-full">Sin campos adicionales.</p>
                  )}
                  {fields.map((f) => {
                    const val = channel.config_masked?.[f.key];
                    return (
                      <div key={f.key} className="space-y-1">
                        <span className="text-muted-foreground text-xs">{f.label}</span>
                        <div className="rounded-lg border border-border/50 bg-muted/30 px-3 py-2 font-mono text-xs truncate">
                          {val === undefined || val === null || val === "" ? "—" : String(val)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ChannelSubSection>
          </ChannelPanel>
        </TabsContent>

        <TabsContent value="webhook" className="mt-4">
          <ChannelPanel
            title="Webhook"
            description="URL pública para mensajes entrantes. Configurala en el proveedor externo."
          >
            {channel.webhook_url ? (
              <div className="space-y-1.5">
                <div className="text-xs text-muted-foreground">Webhook URL</div>
                <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2">
                  <ChannelIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-mono truncate flex-1">{channel.webhook_url}</span>
                  <CopyButton text={channel.webhook_url} />
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Sin webhook URL (se genera al guardar).
              </p>
            )}

            <div className="space-y-1.5">
              <div className="text-xs text-muted-foreground">Webhook secret</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 font-mono text-sm truncate">
                  {freshSecret ? freshSecret : "•••••••• (solo se muestra al regenerar)"}
                </div>
                {freshSecret && <CopyButton text={freshSecret} />}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={regenerate.isPending}
                  onClick={() =>
                    regenerate.mutate(channel.id, {
                      onSuccess: (data) => {
                        setFreshSecret(data.webhook_secret);
                        toast.success("Secret regenerado — cópialo ahora");
                        refetch();
                      },
                      onError: () => toast.error("No se pudo regenerar"),
                    })
                  }
                >
                  {regenerate.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  Regenerar
                </Button>
              </div>
            </div>

            {(channel.channel_type === "whatsapp" ||
              channel.channel_type === "messenger" ||
              channel.channel_type === "instagram") && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm space-y-1">
                <p className="font-medium text-primary">Handshake Meta</p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  En la consola de Meta usá esta URL de callback y el{" "}
                  <code className="text-xs">verify_token</code> que configuraste en Credenciales.
                  Meta hará un GET con <code className="text-xs">hub.challenge</code>.
                </p>
              </div>
            )}

            {channel.channel_type === "telegram" && (
              <div className="rounded-xl border border-border/60 p-3 text-sm text-muted-foreground">
                Telegram usa el header{" "}
                <code className="text-xs">X-Telegram-Bot-Api-Secret-Token</code> con el webhook
                secret. Configurá el webhook del bot apuntando a la URL de arriba.
              </div>
            )}
          </ChannelPanel>
        </TabsContent>

        {isWeb && (
          <TabsContent value="instalacion" className="mt-4">
            <ChannelPanel
              title="Instalar en tu web"
              description="Burbuja flotante (recomendado) o iframe directo — tipo chat widget."
            >
              <div className="space-y-1.5">
                <div className="text-xs text-muted-foreground">URL pública</div>
                <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2">
                  <span className="text-sm font-mono truncate flex-1">{embedUrl}</span>
                  <CopyButton text={embedUrl} />
                </div>
              </div>

              <ChannelSubSection
                title="Script flotante (recomendado)"
                description='Pegalo antes de </body>. Aparece una burbuja que abre el chat.'
              >
                <div className="relative rounded-lg border border-border/50 bg-muted/30 p-3">
                  <pre className="text-xs font-mono whitespace-pre-wrap pr-8">{scriptCode}</pre>
                  <div className="absolute top-2 right-2">
                    <CopyButton text={scriptCode} />
                  </div>
                </div>
              </ChannelSubSection>

              <ChannelSubSection title="Iframe directo">
                <div className="relative rounded-lg border border-border/50 bg-muted/30 p-3">
                  <pre className="text-xs font-mono whitespace-pre-wrap pr-8">{iframeCode}</pre>
                  <div className="absolute top-2 right-2">
                    <CopyButton text={iframeCode} />
                  </div>
                </div>
              </ChannelSubSection>

              <Button variant="outline" size="sm" asChild>
                <a href={inAppUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Abrir a pantalla completa
                </a>
              </Button>
            </ChannelPanel>
          </TabsContent>
        )}

        <TabsContent value="probar" className="mt-4">
          <ChannelPanel
            title="Probar canal"
            description="Validá credenciales, simulá inbound o enviá un mensaje de prueba."
            actions={
              <Button size="sm" onClick={handleTest} disabled={testConnection.isPending}>
                {testConnection.isPending ? (
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-1.5" />
                )}
                Probar conexión
              </Button>
            }
          >
            {isWeb && (
              <ChannelSubSection
                title="Preview del chat"
                description="Widget embebido con el endpoint público."
              >
                <div className="rounded-xl border border-border/50 overflow-hidden bg-background/50">
                  <EmbedChatPanel channelId={String(channel.id)} compact />
                </div>
              </ChannelSubSection>
            )}

            {supportsInbound && (
              <ChannelSubSection
                title="Simular mensaje entrante"
                description="Dispara el router del agente sin pasar por el proveedor externo."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Usuario externo</Label>
                    <Input value={simUser} onChange={(e) => setSimUser(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Mensaje</Label>
                    <Input value={simMessage} onChange={(e) => setSimMessage(e.target.value)} />
                  </div>
                </div>
                <Button
                  disabled={simulate.isPending || !simUser || !simMessage}
                  onClick={() =>
                    simulate.mutate(
                      {
                        id: channel.id,
                        external_user_id: simUser,
                        message: simMessage,
                      },
                      {
                        onSuccess: (data) => {
                          toast.success("Simulación OK");
                          setLastResult(data);
                          refetchSessions();
                        },
                        onError: () => toast.error("Falló la simulación"),
                      },
                    )
                  }
                >
                  {simulate.isPending ? (
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  ) : (
                    <Inbox className="h-4 w-4 mr-1.5" />
                  )}
                  Simular
                </Button>
              </ChannelSubSection>
            )}

            {supportsOutbound && (
              <ChannelSubSection
                title="Enviar mensaje de prueba"
                description="Envía un mensaje real por el canal (WhatsApp, Telegram, email, etc.)."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Destinatario (external_user_id)</Label>
                    <Input
                      value={sendUser}
                      onChange={(e) => setSendUser(e.target.value)}
                      placeholder="teléfono, chat_id, email…"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mensaje</Label>
                    <Input value={sendText} onChange={(e) => setSendText(e.target.value)} />
                  </div>
                </div>
                <Button
                  disabled={sendMessage.isPending || !sendUser || !sendText}
                  onClick={() =>
                    sendMessage.mutate(
                      {
                        id: channel.id,
                        external_user_id: sendUser,
                        message: sendText,
                      },
                      {
                        onSuccess: (data) => {
                          toast.success("Mensaje enviado");
                          setLastResult(data);
                        },
                        onError: () => toast.error("No se pudo enviar"),
                      },
                    )
                  }
                >
                  {sendMessage.isPending ? (
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-1.5" />
                  )}
                  Enviar
                </Button>
              </ChannelSubSection>
            )}

            {lastResult != null && (
              <ChannelSubSection title="Último resultado">
                <pre className="text-xs font-mono whitespace-pre-wrap bg-muted/40 rounded-lg border border-border/40 p-3 max-h-80 overflow-auto">
                  {JSON.stringify(lastResult, null, 2)}
                </pre>
              </ChannelSubSection>
            )}
          </ChannelPanel>
        </TabsContent>

        <TabsContent value="sesiones" className="mt-4">
          <ChannelPanel
            title="Sesiones"
            description="Conversaciones activas en este canal."
            actions={
              <Button size="sm" variant="outline" onClick={() => refetchSessions()}>
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Actualizar
              </Button>
            }
          >
            {sessionsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                Aún no hay sesiones. Usá «Simular» o el widget para generar una.
              </p>
            ) : (
              <div className="overflow-x-auto -mx-1">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/60 text-left text-muted-foreground">
                      <th className="py-2 pr-3 font-medium">Usuario</th>
                      <th className="py-2 pr-3 font-medium">Estado</th>
                      <th className="py-2 pr-3 font-medium">Msgs</th>
                      <th className="py-2 font-medium">Último</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((s) => (
                      <tr key={s.id} className="border-b border-border/40">
                        <td className="py-2.5 pr-3">
                          <div className="font-medium">
                            {s.external_user_name || s.external_user_id}
                          </div>
                          {s.external_user_name ? (
                            <div className="text-xs text-muted-foreground font-mono">
                              {s.external_user_id}
                            </div>
                          ) : null}
                        </td>
                        <td className="py-2.5 pr-3">
                          <Badge variant="outline" className="text-[10px]">
                            {s.status}
                          </Badge>
                        </td>
                        <td className="py-2.5 pr-3 tabular-nums">{s.message_count ?? 0}</td>
                        <td className="py-2.5 text-muted-foreground text-xs">
                          {s.last_message_at ? new Date(s.last_message_at).toLocaleString() : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ChannelPanel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
