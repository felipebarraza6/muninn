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

export function BranchSwitcher() {
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
      <div className="flex h-8 items-center gap-1.5 rounded-md border border-border/50 bg-secondary/40 px-2 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span className="hidden sm:inline">Sucursales…</span>
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div
        className="flex h-8 max-w-[180px] items-center gap-1.5 rounded-md border border-warning/40 bg-warning-soft/30 px-2 text-[11px] text-warning-foreground"
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
    <div className="flex items-center gap-1.5 min-w-0">
      <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0 hidden sm:block" />
      <Select
        value={value}
        onValueChange={(next) => {
          setValue(next);
          setActiveBranchId(next, true, Boolean(user?.is_superuser));
          window.location.reload();
        }}
      >
        <SelectTrigger className="h-8 w-[140px] sm:w-[200px] text-xs border-border/50 bg-secondary/40">
          <SelectValue placeholder="Sucursal" />
        </SelectTrigger>
        <SelectContent>
          {options.map((b) => (
            <SelectItem key={String(b.value)} value={String(b.value)}>
              {b.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
