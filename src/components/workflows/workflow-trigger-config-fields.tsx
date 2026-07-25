import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  triggerConfigNeedsFields,
  type TriggerConfigDraft,
} from "@/lib/workflowTriggerConfig";

type Props = {
  triggerType: string;
  value: TriggerConfigDraft;
  onChange: (next: TriggerConfigDraft) => void;
};

export function WorkflowTriggerConfigFields({ triggerType, value, onChange }: Props) {
  if (!triggerConfigNeedsFields(triggerType)) return null;

  const t = triggerType.toLowerCase();
  const patch = (partial: Partial<TriggerConfigDraft>) => onChange({ ...value, ...partial });

  return (
    <div className="space-y-3 rounded-xl border border-border/50 bg-muted/15 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Configuración del trigger
      </p>

      {t === "cron" || t.startsWith("campaign_") ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1 sm:col-span-2">
            <Label className="text-[10px] text-muted-foreground">Expresión cron</Label>
            <Input
              value={value.cron_expression}
              onChange={(e) => patch({ cron_expression: e.target.value })}
              placeholder="0 9 * * 1-5"
              className="h-9 font-mono text-xs"
            />
            <p className="text-[10px] text-muted-foreground">
              Minuto hora día-mes mes día-semana (ej. lun–vie 09:00).
            </p>
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Zona horaria</Label>
            <Input
              value={value.timezone}
              onChange={(e) => patch({ timezone: e.target.value })}
              placeholder="America/Santiago"
              className="h-9 text-xs"
            />
          </div>
        </div>
      ) : null}

      {t === "webhook" ? (
        <div className="grid gap-3">
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Path relativo (opcional)</Label>
            <Input
              value={value.webhook_path}
              onChange={(e) => patch({ webhook_path: e.target.value })}
              placeholder="/hooks/mi-flujo"
              className="h-9 font-mono text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Secret (opcional)</Label>
            <Input
              type="password"
              autoComplete="off"
              value={value.webhook_secret}
              onChange={(e) => patch({ webhook_secret: e.target.value })}
              placeholder="Token de verificación"
              className="h-9 font-mono text-xs"
            />
          </div>
        </div>
      ) : null}

      {t === "event" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Nombre del evento</Label>
            <Input
              value={value.event_name}
              onChange={(e) => patch({ event_name: e.target.value })}
              placeholder="appointment.created"
              className="h-9 font-mono text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">Fuente / app</Label>
            <Input
              value={value.event_source}
              onChange={(e) => patch({ event_source: e.target.value })}
              placeholder="erp, channels, …"
              className="h-9 text-xs"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
