import { useEffect, useMemo, useRef, useState, startTransition } from "react";
import { BranchFilterSelect } from "@/components/branch/BranchFilterSelect";
import { useAdminBranches, useMyBranchesSelect } from "@/api/hooks/useBranches";
import {
  GLOBAL_BRANCH_ID,
  getActiveBranchId,
  getBranchMode,
  isGlobalBranchId,
  onBranchChange,
  setActiveBranchId,
  setGlobalBranchMode,
} from "@/lib/branchStorage";
import { isOrganizationOwner, isSuperAdmin, showBranchFilterUI } from "@/lib/authGuards";
import { cn } from "@/lib/utils";

type BranchOption = { id: string; label: string };

function mergeBranchOptions(sources: BranchOption[]): BranchOption[] {
  const byId = new Map<string, BranchOption>();
  for (const opt of sources) {
    const id = String(opt.id || "").trim();
    if (!id || id === "all" || isGlobalBranchId(id)) continue;
    if (!byId.has(id)) {
      byId.set(id, { id, label: opt.label?.trim() || `Sucursal ${id}` });
    }
  }
  return Array.from(byId.values()).sort((a, b) =>
    a.label.localeCompare(b.label, "es", { sensitivity: "base" }),
  );
}

function readFilterValue(): string {
  if (getBranchMode() === "global") return GLOBAL_BRANCH_ID;
  return getActiveBranchId() || GLOBAL_BRANCH_ID;
}

/**
 * Filtro de sucursal en Studio (agentes, canales, etc.).
 * Incluye «Todas»: sin pin de sucursal (superadmin/org ven todo su alcance).
 */
export function StudioBranchFilter({
  className,
  triggerClassName,
}: {
  className?: string;
  triggerClassName?: string;
}) {
  const isGlobalAdmin = isSuperAdmin();
  const isOrgOwner = isOrganizationOwner();
  const show = showBranchFilterUI();

  const { data: adminBranches = [] } = useAdminBranches({
    enabled: isGlobalAdmin || isOrgOwner,
  });
  const { data: myBranches = [] } = useMyBranchesSelect();
  const [filterValue, setFilterValue] = useState(readFilterValue);
  const normalizedRef = useRef(false);

  useEffect(
    () =>
      onBranchChange((id, mode) => {
        const next =
          mode === "global" || isGlobalBranchId(id) ? GLOBAL_BRANCH_ID : id || GLOBAL_BRANCH_ID;
        setFilterValue((prev) => (prev === next ? prev : next));
      }),
    [],
  );

  const options = useMemo(() => {
    const fromMy: BranchOption[] = myBranches.map((b) => ({
      id: String(b.value),
      label: b.label,
    }));

    if (isGlobalAdmin || isOrgOwner) {
      const fromAdmin = adminBranches.map((b) => ({
        id: String(b.id),
        label: b.fantasy_name?.trim() || b.business_name || String(b.id),
      }));
      return mergeBranchOptions([...fromAdmin, ...fromMy]);
    }

    return mergeBranchOptions(fromMy);
  }, [adminBranches, isGlobalAdmin, isOrgOwner, myBranches]);

  // Una sola normalización cuando llegan opciones (no en cada cambio de filtro).
  useEffect(() => {
    if (!show || options.length === 0 || normalizedRef.current) return;
    normalizedRef.current = true;

    const mode = getBranchMode();
    if (mode === "branch") {
      const id = getActiveBranchId();
      if (id && options.some((o) => o.id === id)) {
        setFilterValue(id);
        return;
      }
      setGlobalBranchMode(true);
      setFilterValue(GLOBAL_BRANCH_ID);
      return;
    }
    if (mode === "none") {
      setGlobalBranchMode(true);
      setFilterValue(GLOBAL_BRANCH_ID);
    }
  }, [options, show]);

  const value =
    filterValue === GLOBAL_BRANCH_ID || isGlobalBranchId(filterValue)
      ? GLOBAL_BRANCH_ID
      : options.some((o) => o.id === filterValue)
        ? filterValue
        : GLOBAL_BRANCH_ID;

  // Mantener montado el selector aunque options aún carguen (evita flash null→UI).
  if (!show) return null;
  if (options.length === 0) {
    return (
      <div
        className={cn("h-9 w-full sm:w-[240px] shrink-0 rounded-md border border-border/60 bg-muted/30", className)}
        aria-hidden
      />
    );
  }

  return (
    <BranchFilterSelect
      className={cn("space-y-0 shrink-0", className)}
      label=""
      includeAll
      allValue={GLOBAL_BRANCH_ID}
      allLabel="Todas"
      value={value}
      options={options}
      triggerClassName={cn("h-9 w-full sm:w-[240px]", triggerClassName)}
      onValueChange={(id) => {
        const next = isGlobalBranchId(id) || id === GLOBAL_BRANCH_ID ? GLOBAL_BRANCH_ID : id;
        setFilterValue(next);
        // Solo cambiar sucursal: los hooks ya tienen branchId en queryKey y refetch solos.
        // Invalidar aquí provocaba refetch doble + flash de lista vacía.
        startTransition(() => {
          if (next === GLOBAL_BRANCH_ID) {
            // Quitar pin de store (también limpia localStorage de una tienda concreta).
            setGlobalBranchMode(true);
          } else {
            setActiveBranchId(next, true, false);
          }
        });
      }}
    />
  );
}
