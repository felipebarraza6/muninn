import { useMemo, useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BranchAssignment } from "@/api/hooks/useAuth";
import { getStoredBranches, getStoredUser } from "@/lib/authSession";
import { getActiveBranchId, setActiveBranchId, onBranchChange } from "@/lib/branchStorage";
import { Building2 } from "lucide-react";

export function BranchSwitcher() {
  const user = getStoredUser();
  const branches = useMemo(() => {
    const list = getStoredBranches().filter((b) => b.is_active !== false);
    return list;
  }, []);
  const [value, setValue] = useState(() => getActiveBranchId() ?? "");

  useEffect(() => {
    return onBranchChange((id) => setValue(id ?? ""));
  }, []);

  if (branches.length === 0) return null;

  const labelFor = (b: BranchAssignment) =>
    b.branch_name || b.business_name || `Sucursal ${b.branch_id}`;

  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0 hidden sm:block" />
      <Select
        value={value}
        onValueChange={(next) => {
          setValue(next);
          setActiveBranchId(next, true, Boolean(user?.is_superuser));
          // Refetch data that depends on branch header
          window.location.reload();
        }}
      >
        <SelectTrigger className="h-8 w-[140px] sm:w-[180px] text-xs border-border/50 bg-secondary/40">
          <SelectValue placeholder="Sucursal" />
        </SelectTrigger>
        <SelectContent>
          {branches.map((b) => (
            <SelectItem key={b.branch_id} value={String(b.branch_id)}>
              {labelFor(b)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
