import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateWorkPlanPayload, WorkItemKind } from "@/api/hooks/useWorkPlans";
import { apiErrorMessage } from "@/lib/apiError";
import { fromDatetimeLocal, toDatetimeLocal } from "@/lib/datetime";
import { parseJsonObject, prettyJson } from "@/lib/json";
import {
  WORK_PLAN_TEMPLATES,
  templateAvailability,
  type WorkPlanTemplateId,
} from "@/lib/workPlanTemplates";
import {
  ITEM_KIND_HINT,
  ITEM_KIND_LABEL,
  draftFromPayload,
  newDraftItem,
  payloadFromDraft,
  type DraftItem,
} from "@/components/work-plans/work-plan-model";
import { KindFields } from "@/components/work-plans/item-inspector";

export function CreatePlanDialog({
  open,
  onOpenChange,
  agents,
  workflows,
  pending,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  agents: { id: string; name: string; slug: string }[];
  workflows: { id: string; name: string }[];
  pending: boolean;
  onSubmit: (payload: CreateWorkPlanPayload) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [agentId, setAgentId] = useState("");
  const [workflowId, setWorkflowId] = useState<string>("none");
  const [scheduledFor, setScheduledFor] = useState("");
  const [contextJson, setContextJson] = useState("{}");
  const [templateId, setTemplateId] = useState<string>("blank");
  const [items, setItems] = useState<DraftItem[]>([
    newDraftItem({
      title: "Primera tarea",
      kind: "agent_turn",
      message: "Revisar pendientes del día",
    }),
  ]);

  const agentIdBySlug = useMemo(() => {
    const map: Record<string, string> = {};
    for (const a of agents) {
      if (a.slug) map[a.slug] = a.id;
    }
    return map;
  }, [agents]);

  const agentSlugs = useMemo(() => new Set(agents.map((a) => a.slug).filter(Boolean)), [agents]);
  const workflowNames = useMemo(() => workflows.map((w) => w.name), [workflows]);

  const workflowIdByName = (needle: string) => {
    const hit = workflows.find((w) => (w.name || "").toLowerCase().includes(needle.toLowerCase()));
    return hit?.id ?? null;
  };

  useEffect(() => {
    if (!open) return;
    setName("");
    setDescription("");
    setAgentId(agents[0]?.id ? String(agents[0].id) : "");
    setWorkflowId("none");
    setScheduledFor("");
    setContextJson("{}");
    setTemplateId("blank");
    setItems([
      newDraftItem({
        title: "Primera tarea",
        kind: "agent_turn",
        message: "Revisar pendientes del día",
      }),
    ]);
  }, [open, agents]);

  const applyTemplate = (id: WorkPlanTemplateId | "blank") => {
    setTemplateId(id);
    if (id === "blank") return;
    const tpl = WORK_PLAN_TEMPLATES.find((t) => t.id === id);
    if (!tpl) return;
    const built = tpl.build({
      agentIdBySlug,
      workflowIdByName,
    });
    if (!built) {
      toast.error(tpl.requiresHint);
      return;
    }
    setName(built.name);
    setDescription(built.description || "");
    setAgentId(built.assigned_agent != null ? String(built.assigned_agent) : "");
    setWorkflowId(built.workflow ? String(built.workflow) : "none");
    setContextJson(prettyJson(built.context ?? {}) || "{}");
    setScheduledFor(toDatetimeLocal(built.scheduled_for));
    setItems(
      (built.items || []).map((it) => {
        const base = draftFromPayload(it.kind || "agent_turn", it.payload);
        return newDraftItem({
          title: it.title,
          kind: (it.kind || "agent_turn") as WorkItemKind,
          ...base,
          message:
            base.message ||
            (typeof it.payload?.message === "string" ? it.payload.message : it.title),
        });
      }),
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo plan de trabajo</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-1">
          <div className="space-y-1.5">
            <Label>Plantilla</Label>
            <Select
              value={templateId}
              onValueChange={(v) => applyTemplate(v as WorkPlanTemplateId | "blank")}
            >
              <SelectTrigger>
                <SelectValue placeholder="En blanco o ejemplo real" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blank">En blanco</SelectItem>
                {WORK_PLAN_TEMPLATES.map((t) => {
                  const avail = templateAvailability(t, agentSlugs, workflowNames);
                  return (
                    <SelectItem key={t.id} value={t.id} disabled={!avail.available}>
                      {t.label}
                      {!avail.available ? " (no disponible aquí)" : ""}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Ejemplos reales: Agenda Clínica WM (Dentidesk) o Ops SmartHydro. Si no ves el tuyo,
              cambia de sucursal.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="plan-name">Nombre</Label>
            <Input
              id="plan-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Viernes ops"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="plan-desc">Descripción</Label>
            <Textarea
              id="plan-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Qué debe lograr este plan"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Agente asignado</Label>
              <Select value={agentId || undefined} onValueChange={setAgentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Elige un agente" />
                </SelectTrigger>
                <SelectContent>
                  {agents
                    .filter((a) => a.id)
                    .map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name || a.id}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Workflow (opcional)</Label>
              <Select value={workflowId || "none"} onValueChange={setWorkflowId}>
                <SelectTrigger>
                  <SelectValue placeholder="Ninguno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Ninguno</SelectItem>
                  {workflows
                    .filter((w) => w.id)
                    .map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name || w.id}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Programar para (opcional)</Label>
            <Input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Contexto (JSON)</Label>
            <Textarea
              value={contextJson}
              onChange={(e) => setContextJson(e.target.value)}
              rows={2}
              className="font-mono text-xs"
              placeholder='{"demo": true}'
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Ítems</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7"
                onClick={() =>
                  setItems((prev) => [
                    ...prev,
                    newDraftItem({ title: `Tarea ${prev.length + 1}`, kind: "agent_turn" }),
                  ])
                }
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Ítem
              </Button>
            </div>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={item.key} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      #{idx + 1}
                    </span>
                    <Input
                      value={item.title}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((it) =>
                            it.key === item.key ? { ...it, title: e.target.value } : it,
                          ),
                        )
                      }
                      placeholder="Título"
                      className="h-8"
                    />
                    <Select
                      value={item.kind}
                      onValueChange={(v) =>
                        setItems((prev) =>
                          prev.map((it) =>
                            it.key === item.key ? { ...it, kind: v as WorkItemKind } : it,
                          ),
                        )
                      }
                    >
                      <SelectTrigger className="h-8 w-[140px] shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(ITEM_KIND_LABEL) as WorkItemKind[]).map((k) => (
                          <SelectItem key={k} value={k}>
                            {ITEM_KIND_LABEL[k]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 shrink-0"
                      disabled={items.length <= 1}
                      onClick={() => setItems((prev) => prev.filter((it) => it.key !== item.key))}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{ITEM_KIND_HINT[item.kind]}</p>
                  <KindFields
                    kind={item.kind}
                    fields={item}
                    onChange={(patch) =>
                      setItems((prev) =>
                        prev.map((it) => (it.key === item.key ? { ...it, ...patch } : it)),
                      )
                    }
                  />
                  {item.kind === "workflow" && workflows.length > 0 ? (
                    <Select
                      value={item.workflowId || "none"}
                      onValueChange={(v) =>
                        setItems((prev) =>
                          prev.map((it) =>
                            it.key === item.key
                              ? {
                                  ...it,
                                  workflowId: v === "none" ? "" : v,
                                  workflowName:
                                    v === "none"
                                      ? ""
                                      : workflows.find((w) => w.id === v)?.name || "",
                                }
                              : it,
                          ),
                        )
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Elegir workflow" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Elegir…</SelectItem>
                        {workflows.map((w) => (
                          <SelectItem key={w.id} value={w.id}>
                            {w.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            disabled={pending || !name.trim() || !agentId}
            onClick={() => {
              const parsedCtx = parseJsonObject(contextJson, "Contexto");
              if (!parsedCtx.ok) {
                toast.error(parsedCtx.error);
                return;
              }
              const ctx = parsedCtx.value;
              const builtItems: NonNullable<CreateWorkPlanPayload["items"]> = [];
              for (let i = 0; i < items.length; i++) {
                const it = items[i];
                if (!it.title.trim()) {
                  toast.error(`El ítem #${i + 1} necesita título`);
                  return;
                }
                const payload = payloadFromDraft(it);
                if (!payload) return;
                builtItems.push({
                  title: it.title.trim(),
                  kind: it.kind,
                  sort_order: i,
                  payload,
                });
              }
              const agentPk = Number(agentId);
              onSubmit({
                name: name.trim(),
                description: description.trim() || undefined,
                assigned_agent: Number.isFinite(agentPk) ? agentPk : agentId,
                workflow: workflowId === "none" ? null : workflowId,
                scheduled_for: fromDatetimeLocal(scheduledFor),
                context: ctx,
                items: builtItems,
              });
            }}
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
            Crear plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
