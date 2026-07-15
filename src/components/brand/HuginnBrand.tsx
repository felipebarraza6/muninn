import { Link } from "react-router-dom";
import huginnMark from "@/assets/huginn-mark.png";
import { cn } from "@/lib/utils";

interface HuginnBrandProps {
  /** Nombre de sucursal / theme (secundario; no reemplaza Huginn). */
  branchLabel?: string | null;
  tagline?: string | null;
  /** Logo de sucursal opcional (chip junto a Huginn). */
  branchLogoUrl?: string | null;
  to?: string;
  onClick?: () => void;
  compact?: boolean;
  className?: string;
}

/**
 * Shell de marca Huginn: siempre legible en dark.
 * El mark oscuro va sobre placa mint; la sucursal es subtítulo, no sustituye el producto.
 */
export function HuginnBrand({
  branchLabel,
  tagline,
  branchLogoUrl,
  to = "/",
  onClick,
  compact = false,
  className,
}: HuginnBrandProps) {
  const subtitle = branchLabel || tagline || "Agentes IA";

  const content = (
    <>
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-lg border border-primary/35 bg-primary/15 shadow-[0_0_0_1px_rgba(45,212,191,0.08)]",
          compact ? "h-8 w-8" : "h-9 w-9",
        )}
      >
        <img
          src={huginnMark}
          alt=""
          aria-hidden
          className={cn(
            "object-contain brightness-0 invert opacity-95",
            compact ? "h-5 w-5" : "h-6 w-6",
          )}
        />
      </span>

      {!compact && (
        <div className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
          <span className="flex items-center gap-1.5 text-[15px] font-semibold tracking-[0.04em] text-foreground">
            HUGINN
            {branchLogoUrl ? (
              <img
                src={branchLogoUrl}
                alt=""
                className="h-4 w-4 rounded-sm object-contain opacity-90"
              />
            ) : null}
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
        className={cn("flex items-center gap-2.5 min-w-0", className)}
        aria-label={`Huginn — ${subtitle}`}
      >
        {content}
      </Link>
    );
  }

  return <div className={cn("flex items-center gap-2.5 min-w-0", className)}>{content}</div>;
}
