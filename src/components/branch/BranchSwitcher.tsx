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

interface BranchSwitcherProps {
  /** Versión angosta para header móvil. */
  compact?: boolean;
}

export function BranchSwitcher({ compact = false }: BranchSwitcherProps) {
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
    return (
      <div
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 text-xs text-muted-foreground",
          compact ? "max-w-[160px]" : "",
        )}
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
        {!compact && <span className="hidden sm:inline">Sucursales…</span>}
      </div>
    );
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
              className={cn(
                "rounded-md border border-border/70 bg-muted/30 px-2.5 py-2.5 text-xs",
                "cursor-pointer focus:bg-accent focus:text-accent-foreground",
                "data-[state=checked]:border-primary/45 data-[state=checked]:bg-primary/10",
                index > 0 && "mt-1.5",
              )}
            >
              {b.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
