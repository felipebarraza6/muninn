import { useState } from "react";
import { Link } from "react-router-dom";
import muninnMark from "@/assets/muninn-mark.png";
import { cn } from "@/lib/utils";

interface MuninnBrandProps {
  /** Nombre de sucursal / theme (secundario; no reemplaza Muninn). */
  branchLabel?: string | null;
  tagline?: string | null;
  /** Logo de sucursal: si existe, es el icono principal. */
  branchLogoUrl?: string | null;
  /** Si se omite, renderiza sin enlace. */
  to?: string | null;
  onClick?: () => void;
  compact?: boolean;
  className?: string;
}

/**
 * Shell de marca: logo de sucursal cuando hay theme; fallback mark Muninn legible.
 * El producto "MUNINN" se mantiene en texto.
 */
export function MuninnBrand({
  branchLabel,
  tagline,
  branchLogoUrl,
  to,
  onClick,
  compact = false,
  className,
}: MuninnBrandProps) {
  const subtitle = branchLabel || tagline || "Agentes";
  const [logoFailed, setLogoFailed] = useState(false);
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
          // Sidebar icon mode: 3rem rail → mark 32px centered, sin corte
          "group-data-[collapsible=icon]:!h-8 group-data-[collapsible=icon]:!w-8",
        )}
      >
        {showBranchLogo ? (
          <img
            src={branchLogoUrl!}
            alt={branchLabel || "Sucursal"}
            className="h-full w-full object-contain"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <img
            src={muninnMark}
            alt=""
            aria-hidden
            className={cn(
              // Claro: silueta oscura; oscuro: silueta blanca (evita logo blanco traslúcido)
              "object-contain opacity-95 brightness-0 dark:invert",
              compact ? "h-5 w-5" : "h-6 w-6",
              "group-data-[collapsible=icon]:!h-5 group-data-[collapsible=icon]:!w-5",
            )}
          />
        )}
      </span>

      {!compact && (
        <div className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
          <span className="text-[15px] font-semibold tracking-[0.04em] text-foreground">
            MUNINN
          </span>
          <span className="mt-0.5 truncate text-[9.5px] uppercase tracking-[0.14em] text-primary/90">
            {subtitle}
          </span>
        </div>
      )}
    </>
  );

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
        aria-label={`Muninn — ${subtitle}`}
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
