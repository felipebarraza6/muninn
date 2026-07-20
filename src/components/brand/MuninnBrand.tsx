import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import muninnMark from "@/assets/muninn-mark.png";
import { cn } from "@/lib/utils";

interface MuninnBrandProps {
  /**
   * Título principal: `Branch.fantasy_name` (reemplaza "MUNINN").
   */
  branchLabel?: string | null;
  /**
   * Subtítulo con sucursal: `theme.app_name` (donde iba "Agentes").
   */
  appName?: string | null;
  /** Subtítulo fallback (login / Muninn default). */
  tagline?: string | null;
  /** Logo de sucursal: si existe, es el icono; si no, mark Muninn. */
  branchLogoUrl?: string | null;
  /** Si se omite, renderiza sin enlace. */
  to?: string | null;
  onClick?: () => void;
  compact?: boolean;
  /** `stacked`: logo arriba, título abajo (login org). Default horizontal. */
  layout?: "horizontal" | "stacked";
  className?: string;
}

/**
 * Shell de marca:
 * - Con sucursal: título = fantasy_name, subtítulo = app_name; logo sucursal o Muninn.
 * - Sin sucursal: título = MUNINN, subtítulo = Agentes (+ mark Muninn).
 * - stacked: logo arriba + nombre abajo (sin forzar subtítulo).
 */
export function MuninnBrand({
  branchLabel,
  appName,
  tagline,
  branchLogoUrl,
  to,
  onClick,
  compact = false,
  layout = "horizontal",
  className,
}: MuninnBrandProps) {
  const stacked = layout === "stacked";
  const branchName = branchLabel?.trim() || "";
  const inBranch = Boolean(branchName);
  const title = inBranch ? branchName : "MUNINN";
  const subtitle = stacked
    ? appName?.trim() || null
    : inBranch
      ? appName?.trim() || tagline?.trim() || null
      : tagline?.trim() || "Agentes";

  const [logoFailed, setLogoFailed] = useState(false);
  useEffect(() => {
    setLogoFailed(false);
  }, [branchLogoUrl]);
  const showBranchLogo = Boolean(branchLogoUrl) && !logoFailed;

  const content = (
    <>
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg border",
          showBranchLogo
            ? "border-border bg-muted p-0.5"
            : "border-primary/40 bg-primary/20 dark:bg-primary/15",
          stacked ? "h-16 w-16 rounded-2xl" : compact ? "h-8 w-8" : "h-9 w-9",
          !stacked && "group-data-[collapsible=icon]:!h-8 group-data-[collapsible=icon]:!w-8",
        )}
      >
        {showBranchLogo ? (
          <img
            src={branchLogoUrl!}
            alt={title}
            className="h-full w-full object-contain"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <img
            src={muninnMark}
            alt=""
            aria-hidden
            className={cn(
              "object-contain opacity-95 brightness-0 dark:invert",
              stacked ? "h-9 w-9" : compact ? "h-5 w-5" : "h-6 w-6",
              !stacked && "group-data-[collapsible=icon]:!h-5 group-data-[collapsible=icon]:!w-5",
            )}
          />
        )}
      </span>

      {!compact && (
        <div
          className={cn(
            "flex min-w-0 flex-col leading-tight",
            stacked ? "items-center text-center" : "group-data-[collapsible=icon]:hidden",
          )}
        >
          <span
            className={cn(
              "font-semibold text-foreground",
              stacked
                ? "text-lg tracking-tight"
                : inBranch
                  ? "truncate text-sm tracking-tight"
                  : "truncate text-[15px] tracking-[0.04em]",
            )}
          >
            {title}
          </span>
          {subtitle && (
            <span
              className={cn(
                "mt-0.5 uppercase tracking-[0.14em]",
                stacked
                  ? "text-[10px] text-muted-foreground"
                  : inBranch
                    ? "truncate text-[9.5px] text-muted-foreground"
                    : "truncate text-[9.5px] text-primary/90",
              )}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </>
  );

  const aria = inBranch
    ? subtitle
      ? `${title} — ${subtitle}`
      : title
    : `Muninn — ${subtitle || "Agentes"}`;

  const shellClass = cn(
    "flex min-w-0",
    stacked
      ? "flex-col items-center gap-3"
      : "items-center gap-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0",
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
