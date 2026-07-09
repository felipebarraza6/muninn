import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { Opportunity } from "@/lib/mock-data";
import { formatCLP } from "@/lib/format";

interface RecoveredProps {
  opportunity: Opportunity | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: (amount: number) => void;
}

export function MarkRecoveredDialog({
  opportunity,
  open,
  onOpenChange,
  onConfirm,
}: RecoveredProps) {
  const [amount, setAmount] = useState<string>("");

  useEffect(() => {
    if (opportunity) setAmount(String(opportunity.estimatedValue));
  }, [opportunity]);

  if (!opportunity) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Marcar como recuperada</DialogTitle>
          <DialogDescription>
            Confirma el monto efectivamente cerrado para <strong>{opportunity.patient}</strong>.
            Esto sumará a "Ingresos recuperados".
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="amount">Monto cobrado (CLP)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="text-xs text-muted-foreground">
              Estimado original: {formatCLP(opportunity.estimatedValue)}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onConfirm(Number(amount) || 0)}>Confirmar recuperación</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface LostProps {
  opportunity: Opportunity | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: (reason: string) => void;
}

const LOST_REASONS = [
  "No contesta",
  "No interesado",
  "Fuera de presupuesto",
  "Atendido en otra clínica",
  "Otro",
];

export function MarkLostDialog({ opportunity, open, onOpenChange, onConfirm }: LostProps) {
  const [reason, setReason] = useState<string>(LOST_REASONS[0]);
  const [note, setNote] = useState<string>("");

  if (!opportunity) return null;
  const finalReason = reason === "Otro" && note.trim() ? `Otro: ${note.trim()}` : reason;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Marcar como perdida</DialogTitle>
          <DialogDescription>
            Selecciona el motivo por el que se cierra la oportunidad de{" "}
            <strong>{opportunity.patient}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <RadioGroup value={reason} onValueChange={setReason} className="space-y-1.5">
            {LOST_REASONS.map((r) => (
              <div key={r} className="flex items-center gap-2">
                <RadioGroupItem id={`reason-${r}`} value={r} />
                <Label htmlFor={`reason-${r}`} className="font-normal text-sm cursor-pointer">
                  {r}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {reason === "Otro" && (
            <Textarea
              placeholder="Escribe el motivo…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={() => onConfirm(finalReason)}>
            Confirmar pérdida
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
