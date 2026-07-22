import { motion, useReducedMotion } from "framer-motion";
import {
  Bot,
  ExternalLink,
  LayoutGrid,
  MessageCircle,
  Share2,
  Users,
  type LucideIcon,
} from "lucide-react";
import { AppIcon } from "@/components/applications/app-icon";
import { LoginSocialLinks } from "@/components/brand/LoginSocialLinks";
import { MuninnBrand } from "@/components/brand/MuninnBrand";
import { ORG_LOGIN_CAPABILITIES, type OrgLoginCapabilityId } from "@/lib/orgLoginLanding";
import type {
  PublicAvailableApp,
  PublicSocialLink,
  PublicSponsor,
} from "@/lib/publicLoginTheme";
import { resolveMediaUrl } from "@/lib/mediaUrl";
import { cn } from "@/lib/utils";

const CAPABILITY_ICONS: Record<OrgLoginCapabilityId, LucideIcon> = {
  agents: Bot,
  channels: Share2,
  apps: LayoutGrid,
  conversations: MessageCircle,
  team: Users,
};

function appIconSrc(app: PublicAvailableApp): string | null {
  const raw = (app.icon_url || app.logo_url || "").trim();
  if (!raw) return null;
  return resolveMediaUrl(raw) || raw;
}

type GalleryItem =
  | { kind: "capability"; id: string; title: string; description: string; icon: LucideIcon }
  | {
      kind: "app";
      id: string;
      title: string;
      description?: string | null;
      category?: string | null;
      logoUrl?: string | null;
    };

type Props = {
  loading?: boolean;
  orgName?: string | null;
  brandTitle?: string | null;
  brandLogoUrl?: string | null;
  tagline?: string | null;
  description?: string | null;
  websiteUrl?: string | null;
  welcomeMessage?: string | null;
  socialLinks?: PublicSocialLink[] | null;
  sponsors?: PublicSponsor[] | null;
  showSponsors?: boolean;
  apps?: PublicAvailableApp[] | null;
  children: React.ReactNode;
  className?: string;
};

/**
 * Landing login de organización — plantilla única.
 * Datos mutables del perfil org: apariencia (logo/colores), copy, web, redes,
 * patrocinadores y apps designadas.
 */
export function OrgLoginLanding({
  loading = false,
  orgName,
  brandTitle,
  brandLogoUrl,
  tagline,
  description,
  websiteUrl,
  welcomeMessage,
  socialLinks = [],
  sponsors = [],
  showSponsors = true,
  apps = [],
  children,
  className,
}: Props) {
  const reduceMotion = useReducedMotion();
  const appList = apps ?? [];
  const links = socialLinks ?? [];
  const sponsorList = showSponsors ? (sponsors ?? []) : [];
  const site = (websiteUrl || "").trim();
  const welcome = (welcomeMessage || "").trim() || "Bienvenido";
  const slogan = tagline?.trim() || null;
  const blurb =
    description?.trim() ||
    `Portal de ${orgName || "la organización"}. Iniciá sesión para continuar.`;

  const capabilityItems: GalleryItem[] = ORG_LOGIN_CAPABILITIES.map((c) => ({
    kind: "capability" as const,
    id: c.id,
    title: c.title,
    description: c.description,
    icon: CAPABILITY_ICONS[c.id],
  }));

  const appItems: GalleryItem[] = appList.map((a) => ({
    kind: "app" as const,
    id: `app-${a.id}`,
    title: a.name,
    description: a.description,
    category: a.category,
    logoUrl: appIconSrc(a),
  }));

  const renderCard = (item: GalleryItem, i: number) => {
    const Icon = item.kind === "capability" ? item.icon : LayoutGrid;
    return (
      <motion.article
        key={item.id}
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.35,
          delay: reduceMotion ? 0 : Math.min(0.04 + i * 0.03, 0.45),
          ease: [0.22, 1, 0.36, 1],
        }}
        className={cn(
          "group flex h-full flex-col rounded-2xl bg-card/50 p-4 backdrop-blur-sm",
          "transition-colors hover:bg-card/80",
          item.kind === "app" && "bg-primary/[0.07] hover:bg-primary/[0.12]",
        )}
      >
        <div className="flex items-start gap-3">
          {item.kind === "app" ? (
            <AppIcon name={item.title} src={item.logoUrl} size="sm" className="rounded-xl" />
          ) : (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
          )}
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-[15px] font-semibold tracking-tight text-foreground leading-snug">
              {item.title}
            </p>
            {item.kind === "app" && item.category ? (
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {item.category}
              </p>
            ) : null}
          </div>
        </div>
        {item.description ? (
          <p className="mt-3 flex-1 text-[13px] leading-relaxed text-muted-foreground line-clamp-4">
            {item.description}
          </p>
        ) : (
          <div className="flex-1" />
        )}
        {item.kind === "app" ? (
          <p className="mt-3 text-[11px] font-medium text-primary/90">Aplicación disponible</p>
        ) : null}
      </motion.article>
    );
  };

  const gridClass = cn(
    "grid gap-3 sm:gap-4",
    "grid-cols-1",
    "min-[480px]:grid-cols-2",
    "md:grid-cols-3",
    "xl:grid-cols-4",
    "2xl:grid-cols-5",
  );

  return (
    <div className={cn("relative min-h-dvh overflow-x-hidden", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-primary-soft/30"
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -left-24 top-0 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-3xl",
          !reduceMotion && "login-drift",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl",
          !reduceMotion && "login-drift-slow",
        )}
      />

      {/* safe center: centra si hay poco contenido; si desborda, alinea arriba sin cortar */}
      <div className="relative z-[1] flex min-h-dvh flex-col justify-safe-center">
        <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:gap-10 lg:px-8 lg:py-12 xl:px-10">
          <header className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,28rem)] lg:gap-12 xl:gap-16">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left"
            >
              {loading ? (
                <MuninnBrand
                  pending
                  hero
                  layout="horizontal"
                  className="justify-center lg:justify-start"
                />
              ) : (
                <MuninnBrand
                  branchLabel={orgName || brandTitle}
                  branchLogoUrl={brandLogoUrl}
                  hero
                  layout="horizontal"
                  className="justify-center lg:justify-start"
                />
              )}

              <div className="max-w-xl space-y-2 lg:max-w-2xl">
                <p className="text-base font-medium text-foreground/90 sm:text-lg">{welcome}</p>
                {slogan ? <p className="text-sm font-medium text-primary/90">{slogan}</p> : null}
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                  {blurb}
                </p>
              </div>

              {(site || links.length > 0 || appList.length > 0) && (
                <div className="flex w-full max-w-xl flex-col items-center gap-3 lg:max-w-2xl lg:items-start">
                  {appList.length > 0 ? (
                    <p className="text-[11px] tabular-nums text-muted-foreground/80">
                      {appList.length} aplicación{appList.length === 1 ? "" : "es"} habilitada
                      {appList.length === 1 ? "" : "s"}
                    </p>
                  ) : null}
                  {site ? (
                    <a
                      href={site.startsWith("http") ? site : `https://${site}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-2"
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                      {site.replace(/^https?:\/\//i, "")}
                    </a>
                  ) : null}
                  {links.length > 0 ? (
                    <LoginSocialLinks links={links} className="justify-center lg:justify-start" />
                  ) : null}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.06 }}
              className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none"
            >
              {children}
            </motion.div>
          </header>

          <div className="flex flex-col gap-8 pb-2">
            {/* Apps designadas (perfil org / SA) */}
            {(loading || appItems.length > 0) && (
              <section aria-label="Aplicaciones disponibles" className="space-y-3">
                <div className="flex items-end justify-between gap-3">
                  <h2 className="text-sm font-semibold tracking-tight text-foreground">
                    Aplicaciones disponibles
                  </h2>
                  {!loading ? (
                    <p className="text-[11px] text-muted-foreground">
                      Desde el perfil de la organización
                    </p>
                  ) : null}
                </div>
                <div className={gridClass}>
                  {loading
                    ? Array.from({ length: 5 }, (_, i) => (
                        <div key={i} className="h-36 animate-pulse rounded-2xl bg-muted/45" />
                      ))
                    : appItems.map((item, i) => renderCard(item, i))}
                </div>
              </section>
            )}

            {/* Capacidades del portal (igual para todas las orgs) */}
            <section aria-label="Capacidades del portal" className="space-y-3">
              <h2 className="text-sm font-semibold tracking-tight text-foreground">
                En este portal
              </h2>
              <div className={gridClass}>
                {loading
                  ? Array.from({ length: 5 }, (_, i) => (
                      <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted/40" />
                    ))
                  : capabilityItems.map((item, i) => renderCard(item, i))}
              </div>
            </section>

            {/* Patrocinadores del theme org */}
            {!loading && sponsorList.length > 0 ? (
              <section
                aria-label="Patrocinadores"
                className="space-y-3 border-t border-border/40 pt-6"
              >
                <h2 className="text-center text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  Patrocinadores
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                  {sponsorList.map((s, i) => {
                    const logo = resolveMediaUrl(s.logo_url) || s.logo_url || "";
                    const href = (s.website_url || "").trim();
                    const name = s.name?.trim() || "Patrocinador";
                    const inner = logo ? (
                      <img
                        src={logo}
                        alt={name}
                        className="h-8 w-auto max-w-[7rem] object-contain opacity-80 transition-opacity hover:opacity-100 sm:h-10 sm:max-w-[9rem]"
                      />
                    ) : (
                      <span className="text-xs font-medium text-muted-foreground">{name}</span>
                    );
                    return href ? (
                      <a
                        key={`${name}-${i}`}
                        href={href.startsWith("http") ? href : `https://${href}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={name}
                        className="inline-flex items-center"
                      >
                        {inner}
                      </a>
                    ) : (
                      <span key={`${name}-${i}`} className="inline-flex items-center">
                        {inner}
                      </span>
                    );
                  })}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
