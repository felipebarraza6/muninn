import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { WorkItemKind } from "@/api/hooks/useWorkPlans";
import { apiErrorMessage } from "@/lib/apiError";
import {
  ITEM_KIND_HINT,
  ITEM_KIND_LABEL,
  newDraftItem,
  payloadFromDraft,
  type DraftItem,
} from "@/components/work-plans/work-plan-model";
import { KindFields } from "@/components/work-plans/item-inspector";

export function AddItemDialog({
  open,
  onOpenChange,
  workflows,
  pending,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  workflows: { id: string; name: string }[];
  pending: boolean;
  onSubmit: (draft: DraftItem) => void;
}) {
  const [draft, setDraft] = useState<DraftItem>(newDraftItem());

  useEffect(() => {
    if (!open) return;
    setDraft(newDraftItem({ title: "Nuevo ítem", kind: "agent_turn" }));
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Añadir ítem al plan</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Título</Label>
            <Input
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Tipo</Label>
            <Select
              value={draft.kind}
              onValueChange={(v) => setDraft((d) => ({ ...d, kind: v as WorkItemKind }))}
            >
              <SelectTrigger>
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
            <p className="text-[11px] text-muted-foreground">{ITEM_KIND_HINT[draft.kind]}</p>
          </div>
          <KindFields
            kind={draft.kind}
            fields={draft}
            onChange={(patch) => setDraft((d) => ({ ...d, ...patch }))}
          />
          {draft.kind === "workflow" && workflows.length > 0 ? (
            <Select
              value={draft.workflowId || "none"}
              onValueChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  workflowId: v === "none" ? "" : v,
                  workflowName: v === "none" ? "" : workflows.find((w) => w.id === v)?.name || "",
                }))
              }
            >
              <SelectTrigger>
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
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={pending} onClick={() => onSubmit(draft)}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
            Añadir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
