/**
 * Totales Studio del Resumen de plataforma (superadmin).
 * Fuente: GET /ai-agents/summary/ (AgentSummaryViewSet en yggdra_infra).
 */

export type PlatformStudioCounts = {
  agents: number;
  channels: number;
  applications: number;
  skills: number;
};

export type PlatformStudioBranchRow = {
  branch_id: number | string;
  branch_name?: string | null;
  counts: Record<string, number>;
};

export type PlatformStudioSummary = {
  generated_at?: string;
  totals: Record<string, number>;
  by_branch: PlatformStudioBranchRow[];
};

function readCount(bag: Record<string, number> | undefined, key: string): number {
  const n = bag?.[key];
  return typeof n === "number" && Number.isFinite(n) ? n : 0;
}

/**
 * Elige totales globales (`branchId` null = Todas) o el desglose de una sucursal.
 * Devuelve `null` si aún no hay datos o la sucursal no aparece en el resumen
 * (evita pintar 0 engañosos).
 */
export function selectStudioSummaryCounts(
  summary: PlatformStudioSummary | null | undefined,
  branchId: string | null,
): PlatformStudioCounts | null {
  if (!summary?.totals || typeof summary.totals !== "object") return null;

  if (branchId == null || branchId === "" || branchId === "all") {
    return {
      agents: readCount(summary.totals, "agents"),
      channels: readCount(summary.totals, "channels"),
      applications: readCount(summary.totals, "external_apis"),
      skills: readCount(summary.totals, "agent_functions"),
    };
  }

  const row = (summary.by_branch ?? []).find((b) => String(b.branch_id) === String(branchId));
  if (!row?.counts) return null;

  return {
    agents: readCount(row.counts, "agents"),
    channels: readCount(row.counts, "channels"),
    applications: readCount(row.counts, "external_apis"),
    skills: readCount(row.counts, "agent_functions"),
  };
}
