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

export function channelLabel(type?: string) {
  return CHANNEL_LABELS[type ?? ""] ?? type ?? "Canal";
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
