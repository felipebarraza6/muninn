import { useMemo, useState } from "react";
import { Check, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useExternalAPIs, type ExternalAPI } from "@/api/hooks/useExternalAPIs";
import { cn } from "@/lib/utils";

type Props = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  /** Si se pasa, solo se listan estas apps (catálogo restringido). */
  catalogIds?: string[] | null;
  disabled?: boolean;
  emptyHint?: string;
};

export function OrganizationAppPicker({
  selectedIds,
  onChange,
  catalogIds,
  disabled = false,
  emptyHint = "No hay aplicaciones en el catálogo.",
}: Props) {
  const { data: allApps = [], isLoading } = useExternalAPIs({
    scope: "store",
    includeInactive: true,
    forDesignation: true,
  });
  const [search, setSearch] = useState("");

  const selected = useMemo(() => new Set(selectedIds.map(String)), [selectedIds]);
  const catalogFilter = useMemo(
    () => (catalogIds == null ? null : new Set(catalogIds.map(String))),
    [catalogIds],
  );

  const apps = useMemo(() => {
    let list = allApps as ExternalAPI[];
    if (catalogFilter) {
      list = list.filter((a) => catalogFilter.has(String(a.id)));
    }
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        (a.description ?? "").toLowerCase().includes(q) ||
        (a.category ?? "").toLowerCase().includes(q),
    );
  }, [allApps, catalogFilter, search]);

  const toggle = (id: string) => {
    if (disabled) return;
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(Array.from(next));
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-6 justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
        Cargando aplicaciones…
      </div>
    );
  }

  if (catalogFilter && catalogFilter.size === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4">
        Primero el superadmin debe designar apps permitidas para esta organización.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar app…"
          className="pl-8 h-9"
          disabled={disabled}
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <Badge variant="secondary" className="font-normal">
          {selected.size} seleccionada{selected.size === 1 ? "" : "s"}
        </Badge>
        {!disabled && selected.size > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => onChange([])}
          >
            Quitar todas
          </Button>
        )}
      </div>
      {apps.length === 0 ? (
        <p className="text-sm text-muted-foreground py-3">{emptyHint}</p>
      ) : (
        <ul className="space-y-1 max-h-72 overflow-y-auto pr-1">
          {apps.map((app) => {
            const id = String(app.id);
            const on = selected.has(id);
            return (
              <li key={id}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => toggle(id)}
                  className={cn(
                    "w-full flex items-start gap-2.5 rounded-md border px-2.5 py-2 text-left transition-colors",
                    on ? "border-teal-500/40 bg-teal-500/10" : "border-border/60 hover:bg-muted/40",
                    disabled && "opacity-60 cursor-not-allowed",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                      on ? "border-teal-500 bg-teal-500 text-black" : "border-muted-foreground/40",
                    )}
                  >
                    {on ? <Check className="h-3 w-3" /> : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium leading-tight">{app.name}</span>
                    {app.description ? (
                      <span className="block text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {app.description}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
