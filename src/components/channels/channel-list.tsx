import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Eye, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useChannels } from "@/api/hooks/useChannels";
import { ChannelForm } from "@/components/channels/channel-form";

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
  };
  return map[type ?? ""] ?? type ?? "Canal";
}

export function ChannelList() {
  const { data: channels = [], isLoading, refetch } = useChannels();
  const [creating, setCreating] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="text-base">Canales</CardTitle>
            <CardDescription>
              Conecta WhatsApp, Telegram, correo y widgets a tus agentes.
            </CardDescription>
          </div>
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Nuevo
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {channels.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No hay canales aún. Crea el primero.
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
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                <Link to={`/canales/${channel.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuevo canal</DialogTitle>
          </DialogHeader>
          <ChannelForm
            onCancel={() => setCreating(false)}
            onSaved={() => {
              setCreating(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
