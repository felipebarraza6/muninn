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
  className?: string;
}

/**
 * Shell de marca:
 * - Con sucursal: título = fantasy_name, subtítulo = app_name; logo sucursal o Muninn.
 * - Sin sucursal: título = MUNINN, subtítulo = Agentes (+ mark Muninn).
 */
export function MuninnBrand({
  branchLabel,
  appName,
  tagline,
  branchLogoUrl,
  to,
  onClick,
  compact = false,
  className,
}: MuninnBrandProps) {
  const branchName = branchLabel?.trim() || "";
  const inBranch = Boolean(branchName);
  const title = inBranch ? branchName : "MUNINN";
  const subtitle = inBranch
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
          compact ? "h-8 w-8" : "h-9 w-9",
          "group-data-[collapsible=icon]:!h-8 group-data-[collapsible=icon]:!w-8",
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
              compact ? "h-5 w-5" : "h-6 w-6",
              "group-data-[collapsible=icon]:!h-5 group-data-[collapsible=icon]:!w-5",
            )}
          />
        )}
      </span>

      {!compact && (
        <div className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
          <span
            className={cn(
              "truncate font-semibold text-foreground",
              inBranch ? "text-sm tracking-tight" : "text-[15px] tracking-[0.04em]",
            )}
          >
            {title}
          </span>
          {subtitle && (
            <span
              className={cn(
                "mt-0.5 truncate text-[9.5px] uppercase tracking-[0.14em]",
                inBranch ? "text-muted-foreground" : "text-primary/90",
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

  if (to) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={cn(
          "flex items-center gap-2.5 min-w-0",
          "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0",
          className,
        )}
        aria-label={aria}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 min-w-0",
        "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0",
        className,
      )}
    >
      {content}
    </div>
  );
}
