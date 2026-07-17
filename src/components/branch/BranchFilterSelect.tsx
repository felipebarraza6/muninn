import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
};

/**
 * Filtro local de sucursal para pantallas admin.
 * Organizador / multi-sucursal: default típico = "all".
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
}: BranchFilterSelectProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? <Label className="text-xs text-muted-foreground">{label}</Label> : null}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className={cn("w-[200px]", triggerClassName)}>
          <SelectValue placeholder={allLabel} />
        </SelectTrigger>
        <SelectContent>
          {includeAll && <SelectItem value={allValue}>{allLabel}</SelectItem>}
          {options.map((b) => (
            <SelectItem key={b.id} value={b.id}>
              {b.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
