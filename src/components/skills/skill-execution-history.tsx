import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { useFunctionExecutionLogs, type FunctionExecutionLog } from "@/api/hooks/useAgentFunctions";
import {
  formatLogLatency,
  formatLogSource,
  formatLogWhen,
  prettyJson,
  summarizeLogError,
} from "@/lib/skills";
import { cn } from "@/lib/utils";

export function SkillExecutionHistory({ skillId }: { skillId: string }) {
  const {
    data: logs = [],
    isLoading,
    isFetching,
    refetch,
  } = useFunctionExecutionLogs({
    agentFunctionId: skillId,
  });
  const [selected, setSelected] = useState<FunctionExecutionLog | null>(null);

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium">Historial de ejecuciones</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ejecuciones de esta skill en la sucursal activa (pruebas, chat y canales). No es un
            historial global.
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
        <PageSkeleton variant="list" padded={false} rows={4} />
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
                <th className="px-3 py-2 font-medium">Agente</th>
                <th className="px-3 py-2 font-medium">Origen</th>
                <th className="px-3 py-2 font-medium">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {logs.map((log) => {
                const err = summarizeLogError(log);
                return (
                  <tr
                    key={log.id}
                    className="hover:bg-muted/30 cursor-pointer"
                    onClick={() => setSelected(log)}
                  >
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
                    <td className="px-3 py-2 font-mono tabular-nums">{log.status_code ?? "—"}</td>
                    <td className="px-3 py-2 tabular-nums text-muted-foreground">
                      {formatLogLatency(log.latency_ms)}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground max-w-[140px] truncate">
                      {log.agent_name || "—"}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {formatLogSource(log.source)}
                    </td>
                    <td
                      className={cn(
                        "px-3 py-2 max-w-[280px] truncate",
                        err ? "text-destructive" : "text-muted-foreground",
                      )}
                    >
                      {err || log.endpoint_type || "Ver detalle"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ExecutionLogDetailDialog
        log={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </section>
  );
}

function ExecutionLogDetailDialog({
  log,
  onOpenChange,
}: {
  log: FunctionExecutionLog | null;
  onOpenChange: (open: boolean) => void;
}) {
  if (!log) return null;
  const err = (log.error || "").trim();

  return (
    <Dialog open={!!log} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-xl gap-4 p-4 sm:p-6 max-h-[min(90vh,720px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2">
            Detalle de ejecución
            <Badge
              variant={log.success ? "default" : "destructive"}
              className="text-[10px] font-normal"
            >
              {log.success ? "OK" : "Error"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <Meta label="Cuándo" value={formatLogWhen(log.created)} />
          <Meta label="Origen" value={formatLogSource(log.source)} />
          <Meta label="Agente" value={log.agent_name || "—"} />
          <Meta label="HTTP" value={log.status_code != null ? String(log.status_code) : "—"} />
          <Meta label="Latencia" value={formatLogLatency(log.latency_ms)} />
          <Meta label="Endpoint" value={log.endpoint_type || "—"} />
          {log.conversation_title && (
            <Meta label="Conversación" value={log.conversation_title} className="col-span-2" />
          )}
        </div>

        {err && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-1">
            <p className="text-xs font-medium text-destructive">Error</p>
            <p className="text-xs whitespace-pre-wrap break-words">{err}</p>
          </div>
        )}

        {log.parameters && Object.keys(log.parameters).length > 0 && (
          <PayloadBlock title="Parámetros" value={log.parameters} />
        )}
        {log.response_payload != null && Object.keys(log.response_payload).length > 0 && (
          <PayloadBlock title="Respuesta" value={log.response_payload} />
        )}
        {log.request_payload != null && Object.keys(log.request_payload).length > 0 && (
          <PayloadBlock title="Request" value={log.request_payload} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function Meta({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn("space-y-0.5", className)}>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="font-medium break-words">{value}</p>
    </div>
  );
}

function PayloadBlock({ title, value }: { title: string; value: unknown }) {
  return (
    <details className="rounded-lg border bg-muted/20 px-3 py-2 text-xs open:pb-3">
      <summary className="cursor-pointer font-medium text-muted-foreground">{title}</summary>
      <pre className="mt-2 max-h-48 overflow-auto font-mono text-[11px] whitespace-pre-wrap break-all">
        {prettyJson(value)}
      </pre>
    </details>
  );
}
