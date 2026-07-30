import { useEffect, useMemo, useRef, useState } from "react";
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
 * Filtro de sucursal en Studio (agentes, canales, chat…).
 * Superadmin/org: lista completa de sucursales + «Todas».
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

  const { data: adminBranches = [], isLoading: adminLoading } = useAdminBranches({
    enabled: isGlobalAdmin || isOrgOwner,
  });
  const { data: myBranches = [], isLoading: myLoading } = useMyBranchesSelect();
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
        label:
          b.fantasy_name?.trim() ||
          b.business_name?.trim() ||
          (b as { name?: string }).name?.trim() ||
          String(b.id),
      }));
      // Admin primero (catálogo completo); myBranches completa huecos.
      return mergeBranchOptions([...fromAdmin, ...fromMy]);
    }

    return mergeBranchOptions(fromMy);
  }, [adminBranches, isGlobalAdmin, isOrgOwner, myBranches]);

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

  if (!show) return null;

  const loading = (isGlobalAdmin || isOrgOwner ? adminLoading : myLoading) && options.length === 0;
  if (loading) {
    return (
      <div
        className={cn(
          "h-9 w-full shrink-0 rounded-md border border-border/60 bg-muted/30 sm:w-[240px]",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <BranchFilterSelect
      className={cn("shrink-0 space-y-0", className)}
      label=""
      includeAll
      allValue={GLOBAL_BRANCH_ID}
      allLabel="Todas las sucursales"
      value={value}
      options={options}
      triggerClassName={cn("h-9 w-full min-w-0 sm:w-[260px]", triggerClassName)}
      searchPlaceholder="Buscar sucursal…"
      onValueChange={(id) => {
        const next = isGlobalBranchId(id) || id === GLOBAL_BRANCH_ID ? GLOBAL_BRANCH_ID : id;
        setFilterValue(next);
        // Sin startTransition: el chat debe refetch agentes al toque.
        if (next === GLOBAL_BRANCH_ID) {
          setGlobalBranchMode(true);
        } else {
          setActiveBranchId(next, true, false);
        }
      }}
    />
  );
}
