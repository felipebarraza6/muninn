import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AdminListToolbarAction = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "outline" | "secondary" | "ghost";
  icon?: LucideIcon;
  /** Si true, el icono gira (p. ej. Actualizar). */
  spinning?: boolean;
};

type AdminListToolbarProps = {
  countLabel?: ReactNode;
  actions?: AdminListToolbarAction[];
  /** Acciones extra a la izquierda del bloque desktop (filtros, etc.). */
  leading?: ReactNode;
  className?: string;
};

/** Barra de lista: contador + acciones desktop (md+). */
export function AdminListToolbar({
  countLabel,
  actions = [],
  leading,
  className,
}: AdminListToolbarProps) {
  return (
    <div className={cn("mb-3 flex flex-wrap items-center justify-between gap-3", className)}>
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        {countLabel != null ? (
          <span className="text-xs tabular-nums text-muted-foreground">{countLabel}</span>
        ) : null}
        {leading}
      </div>
      {actions.length > 0 ? (
        <div className="hidden flex-wrap items-center gap-2 md:flex">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                size="sm"
                variant={action.variant ?? "outline"}
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {Icon ? (
                  <Icon className={cn("mr-1.5 h-4 w-4", action.spinning && "animate-spin")} />
                ) : null}
                {action.label}
              </Button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
