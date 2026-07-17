import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Loader2,
  MessageSquare,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useChannel, useRegenerateChannelSecret } from "@/api/hooks/useChannels";
import { EmbedChatPanel } from "@/components/channels/EmbedChatPanel";
import { getEmbedUrl, getIframeCode, getInAppEmbedUrl } from "@/lib/channelEmbed";
import { useState } from "react";
import { toast } from "sonner";

function channelLabel(type?: string) {
  const map: Record<string, string> = {
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    email: "Correo electrónico",
    web_socket: "Chat web",
    web_embed: "Widget web",
    instagram: "Instagram",
    messenger: "Messenger",
    sms: "SMS",
    slack: "Slack",
    discord: "Discord",
  };
  return map[type ?? ""] ?? type ?? "Canal";
}

const WHATSAPP_LABELS: Record<string, string> = {
  api_key: "Access Token (Meta)",
  phone_number_id: "WhatsApp Phone Number ID",
  verify_token: "Verify Token",
  app_secret: "App Secret",
  webhook_url: "Webhook URL",
  webhook_secret: "Webhook Secret",
};

function formatWhatsAppValue(key: string, value: unknown) {
  if (typeof value !== "string") return JSON.stringify(value);
  if (
    key === "api_key" ||
    key === "app_secret" ||
    key === "verify_token" ||
    key === "webhook_secret"
  ) {
    return value.length > 8 ? `${value.slice(0, 6)}...${value.slice(-4)}` : value;
  }
  return value;
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
  const { data: channel, isLoading, error, refetch } = useChannel(id);
  const regenerate = useRegenerateChannelSecret();

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

  const isWeb = channel.channel_type === "web_socket" || channel.channel_type === "web_embed";
  const isWhatsApp = channel.channel_type === "whatsapp";
  const embedUrl = getEmbedUrl(channel.id);
  const inAppUrl = getInAppEmbedUrl(channel.id);
  const iframeCode = getIframeCode(channel.id);

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <header className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link to="/canales">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight truncate">
              {channel.name}
            </h1>
            <Badge variant={channel.is_active ? "default" : "secondary"} className="text-[10px]">
              {channel.is_active ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {channelLabel(channel.channel_type)} · {channel.provider ?? "Sin proveedor"} ·{" "}
            {channel.assigned_agent_name ?? "Sin agente"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={regenerate.isPending}
          onClick={() =>
            regenerate.mutate(channel.id, {
              onSuccess: () => {
                toast.success("Secret regenerado");
                refetch();
              },
              onError: () => toast.error("No se pudo regenerar"),
            })
          }
        >
          {regenerate.isPending ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-1.5" />
          )}
          Regenerar secret
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configuración</CardTitle>
          <CardDescription>Parámetros actuales del canal.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Nombre:</span>{" "}
            <span className="font-medium">{channel.name}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Tipo:</span>{" "}
            <span className="font-medium">{channelLabel(channel.channel_type)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Proveedor:</span>{" "}
            <span className="font-medium">{channel.provider ?? "—"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Agente asignado:</span>{" "}
            <span className="font-medium">{channel.assigned_agent_name ?? "—"}</span>
          </div>
        </CardContent>
      </Card>

      {isWeb && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Probar chat aquí</CardTitle>
              <CardDescription>
                Preview en Muninn — no hace falta abrir otra app. Usa el mismo endpoint público del
                widget.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <EmbedChatPanel channelId={String(channel.id)} compact />
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={inAppUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                    Abrir a pantalla completa
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">URL pública y embed</CardTitle>
              <CardDescription>
                Comparte este link o incrusta el widget en tu sitio web.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <div className="text-sm text-muted-foreground">URL pública</div>
                <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-mono truncate flex-1">{embedUrl}</span>
                  <CopyButton text={embedUrl} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-muted-foreground">Código iframe</div>
                <div className="relative rounded-md border bg-muted/30 p-3">
                  <pre className="text-xs font-mono whitespace-pre-wrap pr-8">{iframeCode}</pre>
                  <div className="absolute top-2 right-2">
                    <CopyButton text={iframeCode} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {isWhatsApp && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configuración de WhatsApp</CardTitle>
            <CardDescription>Datos de conexión con Meta/WhatsApp.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {channel.webhook_url && (
              <div className="space-y-1 md:col-span-2">
                <span className="text-muted-foreground">{WHATSAPP_LABELS.webhook_url}:</span>
                <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
                  <span className="text-sm font-mono truncate flex-1">{channel.webhook_url}</span>
                  <CopyButton text={channel.webhook_url} />
                </div>
              </div>
            )}
            {channel.webhook_secret && (
              <div className="space-y-1">
                <span className="text-muted-foreground">{WHATSAPP_LABELS.webhook_secret}:</span>
                <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
                  <span className="text-sm font-mono truncate flex-1">
                    {formatWhatsAppValue("webhook_secret", channel.webhook_secret)}
                  </span>
                  <CopyButton text={channel.webhook_secret} />
                </div>
              </div>
            )}
            {channel.config &&
              Object.entries(channel.config).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <span className="text-muted-foreground">
                    {WHATSAPP_LABELS[key] ??
                      key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    :
                  </span>
                  <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
                    <span className="text-sm font-mono truncate flex-1">
                      {formatWhatsAppValue(key, value)}
                    </span>
                    {typeof value === "string" && value && <CopyButton text={value} />}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {!isWhatsApp && channel.config && Object.keys(channel.config).length > 0 && !isWeb && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configuración técnica</CardTitle>
            <CardDescription>Parámetros de conexión del canal.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm font-mono bg-muted/50 p-4 rounded-md">
              {JSON.stringify(channel.config, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
