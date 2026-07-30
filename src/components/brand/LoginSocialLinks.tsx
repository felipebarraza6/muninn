import type { LucideIcon } from "lucide-react";
import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  MessageCircle,
  Share2,
  Twitter,
  Youtube,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicSocialLink } from "@/lib/publicLoginTheme";

const ICON_BY_KEY: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  whatsapp: MessageCircle,
  youtube: Youtube,
  twitter: Twitter,
  x: Twitter,
  linkedin: Linkedin,
  web: Globe,
  website: Globe,
  tiktok: Share2,
  other: Share2,
};

type LoginSocialLinksProps = {
  links: PublicSocialLink[];
  className?: string;
};

export function LoginSocialLinks({ links, className }: LoginSocialLinksProps) {
  const enabled = links.filter((l) => l.enabled !== false && Boolean(l.url?.trim()));
  if (enabled.length === 0) return null;

  return (
    <nav
      aria-label="Redes sociales"
      className={cn("flex flex-wrap items-center justify-center gap-2", className)}
    >
      {enabled.map((link, i) => {
        const key = (link.icon || "web").toLowerCase().trim();
        const Icon = ICON_BY_KEY[key] || Globe;
        const label = link.name?.trim() || key;
        return (
          <a
            key={`${link.url}-${i}`}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={label}
            aria-label={label}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full",
              "border border-border/60 bg-card/60 text-muted-foreground",
              "transition-colors hover:border-primary/40 hover:text-primary",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </a>
        );
      })}
    </nav>
  );
}
