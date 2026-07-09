import { useEffect, useState } from "react";
import { Sparkles, Send, UserCheck, Pencil, Bot } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { generateFollowUpSuggestion } from "@/lib/opportunities";
import { initials, avatarColor, formatCLP } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Opportunity } from "@/lib/mock-data";

interface FollowUpDialogProps {
  opportunity: Opportunity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** La IA envía el mensaje y sigue al mando — la oportunidad sale de "Por hacer". */
  onSendAsAI: (o: Opportunity, message: string) => void;
  /** Camila envía y toma control — la IA pausa, oportunidad queda asignada a humano. */
  onTakeOver: (o: Opportunity, message: string) => void;
}

export function FollowUpDialog({
  opportunity,
  open,
  onOpenChange,
  onSendAsAI,
  onTakeOver,
}: FollowUpDialogProps) {
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (opportunity && open) {
      setMessage(generateFollowUpSuggestion(opportunity));
      setEditing(false);
    }
  }, [opportunity, open]);

  if (!opportunity) return null;
  const o = opportunity;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-xl rounded-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-1 ring-border">
              <AvatarFallback className={cn("text-xs font-semibold", avatarColor(o.patient))}>
                {initials(o.patient)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <DialogTitle className="font-display text-base">
                Seguimiento con {o.patient}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {o.reason} · {formatCLP(o.estimatedValue)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Contexto */}
        <div className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-1.5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Contexto
          </div>
          <div className="text-xs text-foreground/80">
            <span className="font-medium">Última actividad:</span> {o.lastContact.toLowerCase()}
            {o.responsible === "IA" ? " · gestionado por IA" : ` · ${o.responsible}`}
          </div>
          <div className="text-xs text-foreground/80">
            <span className="font-medium">Próximo paso registrado:</span> {o.nextAction}
          </div>
        </div>

        {/* Sugerencia IA */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" />
              Sugerencia de la IA
            </div>
            {!editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
              >
                <Pencil className="h-3 w-3" />
                Editar mensaje
              </button>
            )}
          </div>

          {editing ? (
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="text-sm"
              autoFocus
            />
          ) : (
            <div className="rounded-lg border border-primary/20 bg-primary-soft/40 p-3 text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {message}
            </div>
          )}
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="outline" onClick={() => onTakeOver(o, message)} className="gap-1.5">
            <UserCheck className="h-3.5 w-3.5" />
            Enviar y tomar control
          </Button>
          <Button onClick={() => onSendAsAI(o, message)} className="gap-1.5">
            <Bot className="h-3.5 w-3.5" />
            Enviar como IA
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
