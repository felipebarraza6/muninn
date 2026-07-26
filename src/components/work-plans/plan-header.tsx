import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Play, Save, Sparkles, Trash2, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusChip } from "@/components/ui/status-chip";
import type { WorkPlan } from "@/api/hooks/useWorkPlans";
import { fromDatetimeLocal, toDatetimeLocal } from "@/lib/datetime";
import { parseJsonObject, prettyJson } from "@/lib/json";
import { planStatusLabel, workPlanStatusTone } from "@/lib/workPlanStatus";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function PlanHeader({
  plan,
  agentLabel,
  busy,
  itemCount = 0,
  doneCount = 0,
  onRunNext,
  onRunAll,
  onCancel,
  onDelete,
  onSaveMeta,
}: {
  plan?: WorkPlan;
  agentLabel: string;
  busy: boolean;
  itemCount?: number;
  doneCount?: number;
  onRunNext: () => void;
  onRunAll: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onSaveMeta: (patch: { context?: Record<string, unknown>; scheduled_for?: string | null }) => void;
}) {
  const [contextJson, setContextJson] = useState("{}");
  const [scheduledFor, setScheduledFor] = useState("");
  const [metaOpen, setMetaOpen] = useState(
    () => itemCount === 0 && (plan?.status === "draft" || !plan?.status),
  );

  useEffect(() => {
    if (!plan) return;
    setContextJson(prettyJson(plan.context ?? {}) || "{}");
    setScheduledFor(toDatetimeLocal(plan.scheduled_for));
  }, [plan?.id, plan?.context, plan?.scheduled_for]);

  useEffect(() => {
    setMetaOpen(itemCount === 0 && (plan?.status === "draft" || !plan?.status));
  }, [plan?.id, plan?.status, itemCount]);

  if (!plan) return null;

  const progress = itemCount > 0 ? Math.min(100, Math.round((doneCount / itemCount) * 100)) : 0;

  return (
    <div className="shrink-0 border-b border-border/40 bg-background/50 backdrop-blur-sm">
      <div className="px-4 py-2.5 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-sm font-semibold truncate">{plan.name}</h2>
            <StatusChip
              label={planStatusLabel(plan.status)}
              tone={workPlanStatusTone(plan.status)}
            />
            {itemCount > 0 ? (
              <span className="text-[10px] tabular-nums text-muted-foreground">
                {doneCount}/{itemCount} pasos
              </span>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {plan.description || "Sin descripción"} · Agente: {agentLabel}
            {plan.workflow ? (
              <>
                {" · "}
                <Link
                  to={`/workflows/${plan.workflow}`}
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  <Workflow className="h-3 w-3" />
                  Abrir workflow
                </Link>
              </>
            ) : null}
          </p>
          {itemCount > 0 ? (
            <div
              className="mt-2 h-1 w-full max-w-md rounded-full bg-muted/60 overflow-hidden"
              title={`${progress}% completado`}
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="sm"
            variant="outline"
            disabled={busy || plan.status === "cancelled"}
            onClick={onRunNext}
            className="h-8 gap-1"
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            <span className="hidden lg:inline">Siguiente</span>
          </Button>
          <Button size="sm" disabled={busy} onClick={onRunAll} className="h-8 gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ejecutar todo</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={busy || plan.status === "cancelled"}
            onClick={onCancel}
            className="h-8 px-2"
          >
            Cancelar
          </Button>
          <Button
            size="icon"
            variant="ghost"
            disabled={busy}
            onClick={onDelete}
            className="h-8 w-8 text-destructive hover:text-destructive"
            title="Eliminar plan"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="border-t border-border/50">
        <button
          type="button"
          className="w-full px-4 py-2 text-[11px] font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 text-left"
          onClick={() => setMetaOpen((v) => !v)}
        >
          <span
            className={cn(
              "text-primary/80 transition-transform inline-block",
              metaOpen && "rotate-90",
            )}
          >
            ▸
          </span>
          Contexto y programación
          <span className="font-normal opacity-70">
            {plan.scheduled_for
              ? `· ${new Date(plan.scheduled_for).toLocaleString("es-CL", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}`
              : "· sin horario"}
          </span>
        </button>
        {metaOpen ? (
          <div className="px-4 pb-3 grid gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-[11px]">Programar para</Label>
              <Input
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-[11px]">Contexto (JSON)</Label>
              <Textarea
                value={contextJson}
                onChange={(e) => setContextJson(e.target.value)}
                rows={2}
                className="text-[11px] font-mono min-h-[52px]"
                placeholder='{"demo": true}'
              />
            </div>
            <div className="sm:col-span-2">
              <Button
                size="sm"
                variant="secondary"
                className="h-7 gap-1"
                disabled={busy}
                onClick={() => {
                  const parsed = parseJsonObject(contextJson, "Contexto");
                  if (!parsed.ok) {
                    toast.error(parsed.error);
                    return;
                  }
                  onSaveMeta({
                    context: parsed.value,
                    scheduled_for: fromDatetimeLocal(scheduledFor),
                  });
                }}
              >
                <Save className="h-3.5 w-3.5" />
                Guardar contexto / programación
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
