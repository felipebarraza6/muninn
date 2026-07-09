import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCLP, pluralize } from "@/lib/format";
import type { CampaignAudienceMember } from "@/lib/mock-data";

interface Props {
  contacts: CampaignAudienceMember[];
  excluded: Set<string>;
  onToggle: (id: string) => void;
  onBulk: (ids: string[], action: "include" | "exclude") => void;
  /** Si es true, oculta los checkboxes (modo lectura). */
  readOnly?: boolean;
}

export function AudienceReviewTable({ contacts, excluded, onToggle, onBulk, readOnly }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) => c.patient.toLowerCase().includes(q) || (c.phone ?? "").toLowerCase().includes(q),
    );
  }, [contacts, query]);

  const includedCount = contacts.length - excluded.size;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="text-sm">
          <span className="font-semibold tabular-nums">{includedCount}</span>{" "}
          <span className="text-muted-foreground">
            {pluralize(includedCount, "seleccionado", "seleccionados")} de {contacts.length}{" "}
            {pluralize(contacts.length, "contacto", "contactos")}
          </span>
        </div>
        {!readOnly && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBulk(contacts.map((c) => c.id!).filter(Boolean), "include")}
            >
              Seleccionar todos
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBulk(contacts.map((c) => c.id!).filter(Boolean), "exclude")}
            >
              Deseleccionar todos
            </Button>
          </div>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o teléfono..."
          className="pl-9 h-9"
        />
      </div>

      <div className="rounded-lg border overflow-hidden">
        <div className="max-h-[340px] overflow-y-auto divide-y">
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Sin resultados
            </div>
          )}
          {filtered.map((c) => {
            const id = c.id!;
            const isExcluded = excluded.has(id);
            return (
              <label
                key={id}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 hover:bg-muted/40 cursor-pointer transition-colors",
                  isExcluded && "opacity-50",
                )}
              >
                {!readOnly && (
                  <Checkbox
                    checked={!isExcluded}
                    onCheckedChange={() => onToggle(id)}
                    aria-label={`Incluir ${c.patient}`}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className={cn("text-sm font-medium truncate", isExcluded && "line-through")}>
                    {c.patient}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {c.phone ?? "—"}
                    {c.note && <span className="ml-2 italic">· {c.note}</span>}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground hidden sm:block w-28 truncate text-right">
                  {c.treatment ?? "—"}
                </div>
                <div className="text-xs tabular-nums w-24 shrink-0 text-right text-muted-foreground">
                  {c.value > 0 ? formatCLP(c.value) : "—"}
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
