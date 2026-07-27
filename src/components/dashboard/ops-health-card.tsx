import { Link } from "react-router-dom";
import { Activity, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOpsHealth } from "@/api/hooks/useAgents";
import { cn } from "@/lib/utils";

/** Checklist go-live desde GET /agents/ops-health/. */
export function OpsHealthCard() {
  const { data, isLoading, isError } = useOpsHealth();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">
          Cargando salud operativa…
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return null;
  }

  const ready = Boolean(data.ready_for_production);
  const checklist = data.checklist ?? {};
  const last24h = data.last_24h ?? {};
  const nextSteps = data.onboarding?.next_steps ?? [];
  const toolFails = last24h.tool_calls_failed ?? checklist.tool_failures_24h ?? 0;

  return (
    <Card className={cn(ready ? "border-success/40" : "border-warning/40")}>
      <CardHeader className="pb-2 flex flex-row items-start justify-between gap-3 space-y-0">
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4 shrink-0" />
            Salud operativa
          </CardTitle>
          <CardDescription>Checklist go-live de la sucursal (últimas 24h).</CardDescription>
        </div>
        <Badge variant={ready ? "default" : "secondary"} className="shrink-0">
          {ready ? "Listo" : "Pendiente"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-1.5 text-sm">
          <CheckRow
            ok={Boolean(checklist.ready_to_chat)}
            label="Listo para chatear (LLM + agente)"
          />
          <CheckRow
            ok={Boolean(checklist.has_bidirectional_channel)}
            label="Canal bidireccional activo"
          />
          <CheckRow
            ok={toolFails === 0}
            label={
              toolFails === 0
                ? "Sin fallos de skills (24h)"
                : `${toolFails} fallo${toolFails === 1 ? "" : "s"} de skills (24h)`
            }
          />
        </ul>

        {!ready && nextSteps.length > 0 ? (
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Próximos pasos</p>
            {nextSteps.slice(0, 3).map((step, i) => (
              <p key={step.code || i} className="text-xs text-foreground leading-relaxed">
                {step.message}
              </p>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 pt-1">
          <Button asChild size="sm" variant="outline" className="h-8">
            <Link to="/app/agentes">
              Agentes <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="ghost" className="h-8">
            <Link to="/app/canales">Canales</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CheckRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2">
      {ok ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
      ) : (
        <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />
      )}
      <span className={cn(ok ? "text-foreground" : "text-muted-foreground")}>{label}</span>
    </li>
  );
}
