import type { LucideIcon } from "lucide-react";
import { Bot, Globe, MessageCircle } from "lucide-react";
import type { ChannelTestResult } from "@/api/hooks/useChannels";

const CHANNEL_LABELS: Record<string, string> = {
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
  teams: "Microsoft Teams",
  google_chat: "Google Chat",
  internal_notification: "Notificación interna",
  push_web: "Push web",
};

export function channelLabel(type?: string, channelName?: string) {
  if (channelName) return channelName;
  return CHANNEL_LABELS[type ?? ""] ?? type ?? "Canal";
}

/** Icono Lucide según tipo de canal (bandeja / detalle). */
export function channelIcon(channelType?: string): LucideIcon {
  const t = (channelType || "").toLowerCase();
  if (t.includes("whatsapp")) return MessageCircle;
  if (t.includes("web")) return Globe;
  return Bot;
}

export function formatChannelTestToast(result: ChannelTestResult): {
  title: string;
  description: string;
} {
  if (result.ok) {
    return {
      title: "Conexión OK",
      description: [result.label, result.detail, result.tested && `(${result.tested})`]
        .filter(Boolean)
        .join(" · "),
    };
  }
  return {
    title: "Falló la prueba",
    description: [result.detail, result.tested && `(${result.tested})`].filter(Boolean).join(" · "),
  };
}
