import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Globe,
  Instagram,
  Mail,
  MessageCircle,
  MessagesSquare,
  Phone,
  Send,
  Slack,
  Smartphone,
} from "lucide-react";
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

/** Icono Lucide según tipo de canal (lista / detalle / bandeja). */
export function channelIcon(channelType?: string): LucideIcon {
  const t = (channelType || "").toLowerCase();
  if (t.includes("whatsapp")) return MessageCircle;
  if (t.includes("telegram")) return Send;
  if (t.includes("email") || t.includes("mail")) return Mail;
  if (t.includes("instagram")) return Instagram;
  if (t.includes("messenger") || t.includes("facebook")) return MessagesSquare;
  if (t.includes("sms")) return Smartphone;
  if (t.includes("slack")) return Slack;
  if (t.includes("discord")) return MessagesSquare;
  if (t.includes("teams") || t.includes("google_chat")) return Phone;
  if (t.includes("web") || t.includes("embed") || t.includes("socket") || t.includes("push"))
    return Globe;
  return Bot;
}

/** Acento visual por tipo (lista de canales). */
export function channelAccent(channelType?: string): {
  bar: string;
  avatar: string;
  glow: string;
} {
  const t = (channelType || "").toLowerCase();
  if (t.includes("whatsapp")) {
    return {
      bar: "from-emerald-500/70 via-emerald-500/35 to-transparent",
      avatar: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/25",
      glow: "group-hover:shadow-emerald-500/10",
    };
  }
  if (t.includes("telegram")) {
    return {
      bar: "from-sky-500/70 via-sky-500/35 to-transparent",
      avatar: "bg-sky-500/15 text-sky-400 ring-sky-500/25",
      glow: "group-hover:shadow-sky-500/10",
    };
  }
  if (t.includes("instagram")) {
    return {
      bar: "from-fuchsia-500/70 via-pink-500/35 to-transparent",
      avatar: "bg-fuchsia-500/15 text-fuchsia-400 ring-fuchsia-500/25",
      glow: "group-hover:shadow-fuchsia-500/10",
    };
  }
  if (t.includes("email") || t.includes("mail")) {
    return {
      bar: "from-amber-500/70 via-amber-500/35 to-transparent",
      avatar: "bg-amber-500/15 text-amber-400 ring-amber-500/25",
      glow: "group-hover:shadow-amber-500/10",
    };
  }
  if (t.includes("web") || t.includes("embed") || t.includes("socket")) {
    return {
      bar: "from-primary/70 via-primary/40 to-transparent",
      avatar: "bg-primary/15 text-primary ring-primary/25",
      glow: "group-hover:shadow-primary/10",
    };
  }
  if (t.includes("messenger") || t.includes("facebook")) {
    return {
      bar: "from-blue-500/70 via-blue-500/35 to-transparent",
      avatar: "bg-blue-500/15 text-blue-400 ring-blue-500/25",
      glow: "group-hover:shadow-blue-500/10",
    };
  }
  return {
    bar: "from-info/70 via-info/35 to-transparent",
    avatar: "bg-info-soft text-info ring-info/25",
    glow: "group-hover:shadow-info/10",
  };
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
