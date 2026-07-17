import { useEffect, useMemo, useState, startTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BranchFilterSelect } from "@/components/branch/BranchFilterSelect";
import { useAdminBranches, useMyBranchesSelect } from "@/api/hooks/useBranches";
import { getActiveBranchId, onBranchChange, setActiveBranchId } from "@/lib/branchStorage";
import { isOrganizationOwner, isSuperAdmin, showBranchFilterUI } from "@/lib/authGuards";
import { cn } from "@/lib/utils";

type BranchOption = { id: string; label: string };

function mergeBranchOptions(sources: BranchOption[]): BranchOption[] {
  const byId = new Map<string, BranchOption>();
  for (const opt of sources) {
    const id = String(opt.id || "").trim();
    if (!id || id === "all") continue;
    if (!byId.has(id)) {
      byId.set(id, { id, label: opt.label?.trim() || `Sucursal ${id}` });
    }
  }
  return Array.from(byId.values()).sort((a, b) =>
    a.label.localeCompare(b.label, "es", { sensitivity: "base" }),
  );
}

/**
 * Mismo criterio de visibilidad que Usuarios / LLM (`showBranchFilterUI`).
 * Organizador: lista admin del holding (como Sucursales) + my-branches.
 * Al cambiar, setea x-branch-id y refresca Studio.
 */
export function StudioBranchFilter({ className }: { className?: string }) {
  const qc = useQueryClient();
  const isGlobalAdmin = isSuperAdmin();
  const isOrgOwner = isOrganizationOwner();
  const show = showBranchFilterUI();

  const { data: adminBranches = [] } = useAdminBranches({
    // Igual que admin sucursales: organizador confía en el API del holding.
    enabled: isGlobalAdmin || isOrgOwner,
  });
  const { data: myBranches = [] } = useMyBranchesSelect();
  const [activeId, setActiveId] = useState(() => getActiveBranchId());

  useEffect(() => onBranchChange((id) => setActiveId(id)), []);

  const options = useMemo(() => {
    // Misma fuente que /admin/llm y /admin/usuarios para organizador.
    const fromMy: BranchOption[] = myBranches.map((b) => ({
      id: String(b.value),
      label: b.label,
    }));

    if (isGlobalAdmin) {
      const fromAdmin = adminBranches.map((b) => ({
        id: String(b.id),
        label: b.fantasy_name?.trim() || b.business_name || String(b.id),
      }));
      return mergeBranchOptions([...fromAdmin, ...fromMy]);
    }

    if (isOrgOwner) {
      // No filtrar por getOwnerBranchIds() de sesión (suele traer 1 sola).
      // El listado admin ya viene scoped al holding.
      const fromAdmin = adminBranches.map((b) => ({
        id: String(b.id),
        label: b.fantasy_name?.trim() || b.business_name || String(b.id),
      }));
      return mergeBranchOptions([...fromAdmin, ...fromMy]);
    }

    return mergeBranchOptions(fromMy);
  }, [adminBranches, isGlobalAdmin, isOrgOwner, myBranches]);

  // Misma puerta que Usuarios/LLM; basta con tener opciones (aunque sea 1).
  const value =
    options.length > 0 && activeId && options.some((o) => o.id === String(activeId))
      ? String(activeId)
      : options[0]?.id;

  useEffect(() => {
    if (!show || !value) return;
    if (activeId && options.some((o) => o.id === String(activeId))) return;
    setActiveBranchId(value, true, false);
  }, [activeId, options, show, value]);

  if (!show || options.length === 0 || !value) return null;

  return (
    <BranchFilterSelect
      className={cn("space-y-0 shrink-0", className)}
      label=""
      includeAll={false}
      value={value}
      options={options}
      triggerClassName="h-9 w-full sm:w-[200px]"
      onValueChange={(id) => {
        startTransition(() => {
          setActiveBranchId(id, true, false);
          void qc.invalidateQueries();
        });
      }}
    />
  );
}
