import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { GLOBAL_BRANCH_ID } from "@/lib/branchStorage";
import { cn } from "@/lib/utils";

export type BranchFilterOption = {
  id: string;
  label: string;
};

type BranchFilterSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  options: BranchFilterOption[];
  /** Incluye opción "Todas" (default true). */
  includeAll?: boolean;
  allValue?: string;
  allLabel?: string;
  label?: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
  /** Placeholder del buscador dentro del popover. */
  searchPlaceholder?: string;
};

/**
 * Filtro de sucursal con búsqueda (necesario cuando hay muchas stores).
 * Organizador / multi-sucursal / superadmin: default típico = "all" o store activa.
 */
export function BranchFilterSelect({
  value,
  onValueChange,
  options,
  includeAll = true,
  allValue = GLOBAL_BRANCH_ID,
  allLabel = "Todas",
  label = "Sucursal",
  className,
  triggerClassName,
  disabled,
  searchPlaceholder = "Buscar sucursal…",
}: BranchFilterSelectProps) {
  const [open, setOpen] = useState(false);

  const items = useMemo(() => {
    const list: BranchFilterOption[] = [];
    if (includeAll) list.push({ id: allValue, label: allLabel });
    list.push(...options);
    return list;
  }, [allLabel, allValue, includeAll, options]);

  const selectedLabel =
    items.find((o) => o.id === value)?.label ??
    options.find((o) => o.id === value)?.label ??
    "Sucursal";

  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? <Label className="text-xs text-muted-foreground">{label}</Label> : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-[200px] justify-between font-normal",
              !value && "text-muted-foreground",
              triggerClassName,
            )}
          >
            <span className="truncate">{selectedLabel}</span>
            <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[14rem] p-0" align="end">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>Sin sucursales.</CommandEmpty>
              <CommandGroup>
                {items.map((opt) => (
                  <CommandItem
                    key={opt.id}
                    value={`${opt.label} ${opt.id}`}
                    onSelect={() => {
                      onValueChange(opt.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-3.5 w-3.5 shrink-0",
                        value === opt.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="truncate">{opt.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
