import type { ReactNode } from "react";
import { Loader2, Activity, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useSkillStats } from "@/api/hooks/useAgentFunctions";
import { LOG_SOURCE_LABEL } from "@/lib/skills";
import { cn } from "@/lib/utils";

function formatWhen(iso?: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("es-CL", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function agentLabel(row: { agent: string | null; agent_name?: string | null }): string {
  if (row.agent_name) return row.agent_name;
  if (row.agent) return "Agente";
  return "Pruebas (sin agente)";
}

export function SkillStatsPanel({ skillId }: { skillId: string }) {
  const { data, isLoading, error } = useSkillStats(skillId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground py-3">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Cargando uso…
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  const agentRows = data.by_agent.slice(0, 8);

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h2 className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Uso
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ejecuciones registradas de esta skill (sin secretos).
          </p>
        </div>
        <p className="text-[11px] text-muted-foreground shrink-0">
          Última vez: {formatWhen(data.last_used_at)}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard
          label="Total"
          value={String(data.total)}
          icon={<Activity className="h-3.5 w-3.5" />}
        />
        <StatCard
          label="Éxito"
          value={`${data.success_rate}%`}
          icon={<CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
        />
        <StatCard
          label="Errores"
          value={String(data.error_count)}
          icon={<XCircle className="h-3.5 w-3.5 text-destructive" />}
        />
        <StatCard
          label="Latencia avg"
          value={`${data.avg_latency_ms} ms`}
          icon={<Clock className="h-3.5 w-3.5" />}
        />
      </div>

      {agentRows.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium">Por agente</p>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-xs">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr className="text-left">
                  <th className="px-3 py-2 font-medium">Agente</th>
                  <th className="px-3 py-2 font-medium text-right tabular-nums">Total</th>
                  <th className="px-3 py-2 font-medium text-right tabular-nums">OK</th>
                  <th className="px-3 py-2 font-medium text-right tabular-nums">Errores</th>
                  <th className="px-3 py-2 font-medium text-right tabular-nums hidden sm:table-cell">
                    % éxito
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {agentRows.map((row) => {
                  const rate =
                    row.total > 0 ? Math.round((row.success_count / row.total) * 1000) / 10 : 0;
                  const errors = row.error_count ?? Math.max(0, row.total - row.success_count);
                  return (
                    <tr key={row.agent ?? "none"} className="hover:bg-muted/20">
                      <td className="px-3 py-2 font-medium max-w-[220px] truncate">
                        {agentLabel(row)}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                        {row.total}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums text-primary">
                        {row.success_count}
                      </td>
                      <td
                        className={cn(
                          "px-3 py-2 text-right tabular-nums",
                          errors > 0 ? "text-destructive" : "text-muted-foreground",
                        )}
                      >
                        {errors}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums text-muted-foreground hidden sm:table-cell">
                        {rate}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data.by_source.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium">Por origen</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {data.by_source.map((row) => (
              <div
                key={row.source}
                className="rounded-lg border bg-muted/20 px-2.5 py-2 flex items-center justify-between gap-2"
              >
                <span className="text-[11px] text-muted-foreground truncate">
                  {LOG_SOURCE_LABEL[row.source] || row.source}
                </span>
                <span className="text-sm font-semibold tabular-nums shrink-0">{row.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-lg border bg-muted/20 px-2.5 py-2 space-y-0.5">
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}
