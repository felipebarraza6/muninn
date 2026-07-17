import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStoredUser } from "@/lib/authSession";
import { getActiveBranchId, setActiveBranchId, onBranchChange } from "@/lib/branchStorage";
import { useMyBranchesSelect } from "@/api/hooks/useBranches";
import { Building2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { canSwitchActiveBranch, showHeaderBranchSwitcher } from "@/lib/authGuards";

interface BranchSwitcherProps {
  /** Versión angosta para header móvil. */
  compact?: boolean;
}

function BranchLabel({
  compact,
  label,
  loading,
}: {
  compact?: boolean;
  label: string;
  loading?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-9 items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 text-xs text-foreground",
        compact ? "max-w-[180px] w-full min-w-0" : "max-w-[220px]",
      )}
      title={label}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0 text-muted-foreground" />
      ) : (
        <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
      )}
      <span className="truncate">{label}</span>
    </div>
  );
}

export function BranchSwitcher({ compact = false }: BranchSwitcherProps) {
  // Organizador: sin switcher global; cada pantalla filtra por sucursal.
  if (!showHeaderBranchSwitcher()) {
    return null;
  }

  return <BranchSwitcherInner compact={compact} />;
}

function BranchSwitcherInner({ compact = false }: BranchSwitcherProps) {
  const user = getStoredUser();
  const { data: options = [], isLoading, isError } = useMyBranchesSelect();
  const [value, setValue] = useState(() => getActiveBranchId() ?? "");

  useEffect(() => {
    return onBranchChange((id) => setValue(id ?? ""));
  }, []);

  // Si hay opciones y no hay branch activa (o la activa no está en la lista), elegir la primera.
  useEffect(() => {
    if (options.length === 0) return;
    const ids = new Set(options.map((o) => String(o.value)));
    if (!value || !ids.has(value)) {
      const first = String(options[0].value);
      setValue(first);
      setActiveBranchId(first, true, Boolean(user?.is_superuser));
    }
  }, [options, value, user?.is_superuser]);

  if (isLoading) {
    return <BranchLabel compact={compact} label={compact ? "…" : "Sucursales…"} loading />;
  }

  if (options.length === 0) {
    return (
      <div
        className={cn(
          "flex h-9 max-w-[160px] items-center gap-1.5 rounded-md border border-warning/40 bg-muted px-2.5 text-[11px] text-warning-foreground",
        )}
        title={
          isError
            ? "No se pudieron cargar sucursales"
            : "Sin sucursales. Corre seed_test_data en la API."
        }
      >
        <Building2 className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">Sin sucursal</span>
      </div>
    );
  }

  const showSelect = canSwitchActiveBranch(options.length);

  // Una sola sucursal: no mostrar nada en el header (el branding ya identifica la tienda).
  if (!showSelect) {
    return null;
  }

  return (
    <div className={cn("min-w-0", compact && "w-full max-w-[180px]")}>
      <Select
        value={value}
        onValueChange={(next) => {
          setValue(next);
          setActiveBranchId(next, true, Boolean(user?.is_superuser));
          window.location.reload();
        }}
      >
        <SelectTrigger
          className={cn(
            "h-9 gap-2 border-border bg-muted text-xs shadow-none focus:ring-1 focus:ring-ring",
            compact ? "w-full min-w-0 px-2.5" : "w-[160px] sm:w-[220px]",
          )}
        >
          <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden />
          <SelectValue placeholder="Sucursal" />
        </SelectTrigger>
        <SelectContent className="min-w-[var(--radix-select-trigger-width)] p-1.5">
          {options.map((b, index) => (
            <SelectItem
              key={String(b.value)}
              value={String(b.value)}
              className={cn(index === 0 && "mt-0")}
            >
              {b.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
