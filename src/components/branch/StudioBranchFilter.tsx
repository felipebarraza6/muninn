import { useEffect, useMemo, useState, startTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BranchFilterSelect } from "@/components/branch/BranchFilterSelect";
import { useMyBranchesSelect } from "@/api/hooks/useBranches";
import { getActiveBranchId, onBranchChange, setActiveBranchId } from "@/lib/branchStorage";
import {
  isOrganizationOwner,
  showBranchFilterUI,
  showHeaderBranchSwitcher,
} from "@/lib/authGuards";

/**
 * Filtro de sucursal en páginas Studio cuando el switcher del header está oculto
 * (p.ej. organizador). Cambia el X-Branch-ID activo y refresca queries.
 */
export function StudioBranchFilter({ className }: { className?: string }) {
  const qc = useQueryClient();
  const { data: myBranches = [] } = useMyBranchesSelect();
  const [activeId, setActiveId] = useState(() => getActiveBranchId());

  useEffect(() => onBranchChange((id) => setActiveId(id)), []);

  const options = useMemo(
    () =>
      myBranches.map((b) => ({
        id: String(b.value),
        label: b.label,
      })),
    [myBranches],
  );

  const show =
    options.length > 1 &&
    (isOrganizationOwner() || (showBranchFilterUI() && !showHeaderBranchSwitcher()));

  if (!show) return null;

  const value = activeId && options.some((o) => o.id === activeId) ? activeId : options[0]?.id;

  return (
    <BranchFilterSelect
      className={className}
      label="Sucursal"
      includeAll={false}
      value={value || ""}
      options={options}
      onValueChange={(id) => {
        startTransition(() => {
          setActiveBranchId(id, true, false);
          void qc.invalidateQueries();
        });
      }}
    />
  );
}
