import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import muninnMark from "@/assets/muninn-mark.png";
import { BrandMarkSkeleton } from "@/components/ui/page-loader";
import { LOGIN_BRAND_SUBTITLE } from "@/lib/loginLanding";
import { probeLogoNeedsDarkInvert } from "@/lib/logoDisplay";
import { cn } from "@/lib/utils";

interface MuninnBrandProps {
  /**
   * Título principal: `Branch.fantasy_name` (reemplaza "MUNINN").
   */
  branchLabel?: string | null;
  /**
   * Subtítulo con sucursal: `theme.app_name`.
   */
  appName?: string | null;
  /** Subtítulo fallback (login / Muninn default). */
  tagline?: string | null;
  /** Logo de sucursal: si existe, es el icono; si no, mark Muninn. */
  branchLogoUrl?: string | null;
  /**
   * Branding aún cargando (org/sucursal).
   * Muestra skeleton en lugar del cuervo Muninn — evita flash crow→logo.
   */
  pending?: boolean;
  /** Si se omite, renderiza sin enlace. */
  to?: string | null;
  onClick?: () => void;
  compact?: boolean;
  /** `stacked`: logo arriba, título abajo (login org). Default horizontal. */
  layout?: "horizontal" | "stacked";
  /**
   * Login / hero: mark más sólido y wordmark con más peso.
   */
  hero?: boolean;
  className?: string;
}

/**
 * Shell de marca:
 * - Con logo de org/sucursal: solo el logo (sin nombre al lado).
 * - Sin logo + tenant: monograma + nombre; subtítulo = app_name.
 * - Plataforma Muninn: cuervo + MUNINN / Harness de agentes.
 * - pending: skeleton hasta que el tema/logo real esté listo.
 */
export function MuninnBrand({
  branchLabel,
  appName,
  tagline,
  branchLogoUrl,
  pending = false,
  to,
  onClick,
  compact = false,
  layout = "horizontal",
  hero = false,
  className,
}: MuninnBrandProps) {
  const stacked = layout === "stacked";
  const branchName = branchLabel?.trim() || "";
  /** Marca plataforma Muninn (superadmin / login default): siempre cuervo, nunca monograma. */
  const isMuninnPlatformBrand =
    !branchLogoUrl && (!branchName || branchName.toLowerCase() === "muninn");
  const inTenant = Boolean(branchName) && !isMuninnPlatformBrand;
  const title =
    pending && !inTenant && !isMuninnPlatformBrand ? "" : inTenant ? branchName : "MUNINN";
  const subtitle = pending
    ? null
    : stacked
      ? appName?.trim() || null
      : inTenant
        ? appName?.trim() || tagline?.trim() || null
        : tagline?.trim() || appName?.trim() || LOGIN_BRAND_SUBTITLE;

  const [logoFailed, setLogoFailed] = useState(false);
  const [darkInvert, setDarkInvert] = useState(false);

  useEffect(() => {
    setLogoFailed(false);
    setDarkInvert(false);
    const url = branchLogoUrl?.trim();
    if (!url) return;
    let cancelled = false;
    void probeLogoNeedsDarkInvert(url).then((needs) => {
      if (!cancelled) setDarkInvert(needs);
    });
    return () => {
      cancelled = true;
    };
  }, [branchLogoUrl]);

  const showBranchLogo = Boolean(branchLogoUrl) && !logoFailed && !pending;
  /** Con logo de org/sucursal basta: no repetir el nombre al lado. */
  const hideWordmark = showBranchLogo;
  const showTenantSkeleton = pending && !isMuninnPlatformBrand;
  /** Org/sucursal sin logo: inicial. Superadmin / Muninn: cuervo. */
  const monogram =
    inTenant && !showBranchLogo && !pending ? branchName.charAt(0).toUpperCase() || "·" : null;

  const markSize = stacked || hero ? "lg" : compact ? "sm" : "md";
  const platformHero = isMuninnPlatformBrand && (hero || stacked);

  const content = (
    <>
      {showTenantSkeleton ? (
        <BrandMarkSkeleton size={markSize} />
      ) : (
        <span
          className={cn(
            "relative z-[2] flex shrink-0 items-center justify-center overflow-hidden transition-opacity duration-300",
            showBranchLogo
              ? "border-0 bg-transparent p-0"
              : monogram
                ? "rounded-lg border border-primary/30 bg-primary/15 text-primary p-0"
                : platformHero
                  ? "rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/30 ring-1 ring-primary/40"
                  : "rounded-lg border border-primary/40 bg-primary/20 dark:bg-primary/15",
            showBranchLogo && hero
              ? "h-14 w-auto max-w-[13rem] sm:h-16 sm:max-w-[16rem]"
              : showBranchLogo && stacked
                ? "h-16 w-auto max-w-[12rem] rounded-2xl"
                : showBranchLogo
                  ? compact
                    ? "h-8 w-auto max-w-[7rem]"
                    : "h-10 w-auto max-w-[9rem]"
                  : platformHero
                    ? "h-14 w-14 sm:h-16 sm:w-16"
                    : stacked
                      ? "h-16 w-16 rounded-2xl"
                      : compact
                        ? "h-8 w-8"
                        : "h-9 w-9",
            !stacked &&
              !showBranchLogo &&
              !platformHero &&
              "group-data-[collapsible=icon]:!h-8 group-data-[collapsible=icon]:!w-8",
          )}
        >
          {showBranchLogo ? (
            <img
              src={branchLogoUrl!}
              alt={title || "Logo"}
              className={cn(
                "h-full w-auto max-w-full object-contain object-left animate-in fade-in duration-300",
                darkInvert && "dark:brightness-0 dark:invert",
              )}
              onError={() => setLogoFailed(true)}
            />
          ) : monogram ? (
            <span
              className={cn(
                "font-semibold leading-none",
                stacked || hero ? "text-xl" : compact ? "text-xs" : "text-sm",
              )}
            >
              {monogram}
            </span>
          ) : (
            <img
              src={muninnMark}
              alt=""
              aria-hidden
              className={cn(
                "object-contain",
                platformHero
                  ? // Placa mint: cuervo blanco en light, negro en dark (primary-foreground).
                    "h-8 w-8 sm:h-9 sm:w-9 brightness-0 invert dark:invert-0"
                  : cn(
                      "opacity-95 brightness-0 dark:invert",
                      stacked ? "h-9 w-9" : compact ? "h-5 w-5" : "h-6 w-6",
                      !stacked &&
                        "group-data-[collapsible=icon]:!h-5 group-data-[collapsible=icon]:!w-5",
                    ),
              )}
            />
          )}
        </span>
      )}

      {!compact && !hideWordmark && (
        <div
          className={cn(
            "relative z-[2] flex min-w-0 flex-col leading-tight",
            stacked ? "items-center text-center" : "group-data-[collapsible=icon]:hidden",
            hero && "lg:items-start lg:text-left",
          )}
        >
          {pending && !title ? (
            <span
              className={cn(
                "block animate-pulse rounded bg-muted",
                stacked || hero ? "h-5 w-36" : "h-4 w-24",
              )}
            />
          ) : (
            <span
              className={cn(
                "font-semibold text-foreground transition-opacity duration-300",
                platformHero
                  ? "font-display text-2xl tracking-[-0.03em] sm:text-[1.75rem]"
                  : stacked || hero
                    ? "text-xl tracking-tight sm:text-2xl"
                    : inTenant
                      ? "truncate text-sm tracking-tight"
                      : "truncate text-[15px] tracking-[0.04em]",
              )}
            >
              {title || "\u00a0"}
            </span>
          )}
          {pending && !subtitle ? (
            <span className="mt-1.5 block h-2.5 w-16 animate-pulse rounded bg-muted/80" />
          ) : subtitle ? (
            <span
              className={cn(
                "mt-1 transition-opacity duration-300",
                platformHero
                  ? "text-[12px] font-medium tracking-[0.04em] text-muted-foreground"
                  : stacked || hero
                    ? "text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
                    : inTenant
                      ? "truncate text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground"
                      : "truncate text-[9.5px] uppercase tracking-[0.14em] text-primary/90",
              )}
            >
              {subtitle}
            </span>
          ) : null}
        </div>
      )}
    </>
  );

  const aria = pending
    ? "Cargando marca"
    : inTenant
      ? subtitle
        ? `${title} — ${subtitle}`
        : title
      : `Muninn — ${subtitle || LOGIN_BRAND_SUBTITLE}`;

  const shellClass = cn(
    "flex min-w-0 transition-opacity duration-300",
    stacked
      ? "flex-col items-center gap-3"
      : "items-center gap-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0",
    platformHero && "gap-3.5 sm:gap-4",
    hero && !platformHero && "gap-3 sm:gap-4",
    className,
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={shellClass} aria-label={aria}>
        {content}
      </Link>
    );
  }

  return (
    <div className={shellClass} aria-label={aria}>
      {content}
    </div>
  );
}
