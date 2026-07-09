import { Link } from "react-router-dom";
import { MessageSquare, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useChannels } from "@/api/hooks/useChannels";

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

export function ChannelList() {
  const { data: channels = [], isLoading } = useChannels();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Canales</CardTitle>
        <CardDescription>
          Conecta WhatsApp, Telegram, correo electrónico y otros puntos de contacto.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {channels.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No hay canales configurados aún.
          </div>
        )}
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="flex items-center justify-between gap-3 rounded-lg border p-3 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{channel.name}</span>
                  <Badge
                    variant={channel.is_active ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {channel.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {channelLabel(channel.channel_type)} · {channel.provider ?? "Sin proveedor"} ·{" "}
                  {channel.assigned_agent_name ?? "Sin agente"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link to={`/canales/${channel.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
