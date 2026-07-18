import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFunctionExecutionLogs } from "@/api/hooks/useAgentFunctions";
import {
  formatLogLatency,
  formatLogSource,
  formatLogWhen,
  summarizeLogError,
} from "@/lib/skills";
import { cn } from "@/lib/utils";

export function SkillExecutionHistory({ skillId }: { skillId: string }) {
  const { data: logs = [], isLoading, isFetching, refetch } = useFunctionExecutionLogs({
    agentFunctionId: skillId,
  });

  return (
    <section className="rounded-xl border bg-card/60 p-4 md:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium">Historial de ejecuciones</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pruebas manuales, chat del agente y canales. Más recientes primero.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isFetching}
          onClick={() => void refetch()}
        >
          {isFetching ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-1.5" />
          )}
          Actualizar
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[160px]">
          <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-lg border border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
          Aún no hay ejecuciones de esta skill.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-xs">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr className="text-left">
                <th className="px-3 py-2 font-medium">Cuándo</th>
                <th className="px-3 py-2 font-medium">Estado</th>
                <th className="px-3 py-2 font-medium">HTTP</th>
                <th className="px-3 py-2 font-medium">Latencia</th>
                <th className="px-3 py-2 font-medium">Origen</th>
                <th className="px-3 py-2 font-medium">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {logs.map((log) => {
                const err = summarizeLogError(log);
                return (
                  <tr key={log.id} className="hover:bg-muted/20">
                    <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                      {formatLogWhen(log.created)}
                    </td>
                    <td className="px-3 py-2">
                      <Badge
                        variant={log.success ? "default" : "destructive"}
                        className="text-[10px] font-normal"
                      >
                        {log.success ? "OK" : "Error"}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 font-mono tabular-nums">
                      {log.status_code ?? "—"}
                    </td>
                    <td className="px-3 py-2 tabular-nums text-muted-foreground">
                      {formatLogLatency(log.latency_ms)}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {formatLogSource(log.source)}
                    </td>
                    <td
                      className={cn(
                        "px-3 py-2 max-w-[280px] truncate",
                        err ? "text-destructive" : "text-muted-foreground",
                      )}
                      title={log.error || log.endpoint_type || ""}
                    >
                      {err || log.endpoint_type || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
