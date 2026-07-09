import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientName: string;
  defaultTreatment?: string;
  onConfirm: (appointment: { date: string; time: string; treatment: string }) => void;
}

export function BookAppointmentDialog({
  open,
  onOpenChange,
  patientName,
  defaultTreatment = "",
  onConfirm,
}: Props) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [treatment, setTreatment] = useState(defaultTreatment);

  const canSubmit = date && time && treatment;

  const submit = () => {
    if (!canSubmit) return;
    onConfirm({ date, time, treatment });
    onOpenChange(false);
    setDate("");
    setTime("");
    setTreatment(defaultTreatment);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-base">Marcar cita agendada</DialogTitle>
          <DialogDescription>
            Confirma la cita de <span className="font-medium text-foreground">{patientName}</span>.
            La conversación pasa a Archivadas y la oportunidad se cierra como agendada.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="appt-date" className="text-xs">
                Fecha
              </Label>
              <Input
                id="appt-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="appt-time" className="text-xs">
                Hora
              </Label>
              <Input
                id="appt-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="appt-treatment" className="text-xs">
              Tratamiento
            </Label>
            <Input
              id="appt-treatment"
              placeholder="Ej. Limpieza + evaluación"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={submit} disabled={!canSubmit}>
            Confirmar agendamiento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
