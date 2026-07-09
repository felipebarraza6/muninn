import { Link } from "react-router-dom";
import { ExternalLink, MessageSquareText, Sparkles, User, Megaphone } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { campaigns, conversations, OPP_STATUS_LABEL, type Opportunity } from "@/lib/mock-data";
import { getPriority, getPrimaryAction, PRIORITY_LABEL, PRIORITY_TONE } from "@/lib/opportunities";
import { formatCLP, initials, avatarColor } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  opportunity: Opportunity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrimaryAction: (o: Opportunity) => void;
  onMarkRecovered: (o: Opportunity) => void;
  onMarkLost: (o: Opportunity) => void;
}

export function OpportunityDetailSheet({
  opportunity,
  open,
  onOpenChange,
  onPrimaryAction,
  onMarkRecovered,
  onMarkLost,
}: Props) {
  if (!opportunity) return null;
  const priority = getPriority(opportunity);
  const primary = getPrimaryAction(opportunity);
  const convo = opportunity.conversationId
    ? conversations.find((c) => c.id === opportunity.conversationId)
    : null;
  const campaign = convo?.campaign ? campaigns.find((c) => c.name === convo.campaign) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-5 pb-3 border-b space-y-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-11 w-11">
              <AvatarFallback
                className={cn("text-sm font-semibold", avatarColor(opportunity.patient))}
              >
                {initials(opportunity.patient)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-base truncate">{opportunity.patient}</SheetTitle>
              <SheetDescription className="text-xs">{opportunity.reason}</SheetDescription>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                PRIORITY_TONE[priority],
              )}
            >
              Prioridad {PRIORITY_LABEL[priority]}
            </span>
            <span className="inline-flex items-center rounded-full bg-muted text-muted-foreground px-2 py-0.5 text-[11px] font-medium">
              {OPP_STATUS_LABEL[opportunity.status]}
            </span>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <section>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
              Valor estimado
            </div>
            <div className="text-2xl font-semibold text-success tabular-nums">
              {formatCLP(opportunity.estimatedValue)}
            </div>
          </section>

          {campaign && (
            <Link
              to={`/campanas/${campaign.id}`}
              className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 text-xs hover:bg-muted/60 transition gap-2"
            >
              <span className="flex items-center gap-1.5 min-w-0">
                <Megaphone className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-muted-foreground shrink-0">Vino de campaña</span>
                <span className="font-medium text-foreground truncate">{campaign.name}</span>
              </span>
              <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
            </Link>
          )}

          <section className="rounded-lg border bg-primary-soft/30 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Próxima acción sugerida
            </div>
            <div className="text-sm text-foreground">{opportunity.nextAction}</div>
          </section>

          {convo && (
            <section className="space-y-2">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                Resumen IA
              </div>
              <p className="text-sm leading-relaxed text-foreground">{convo.aiSummary}</p>
              {convo.humanReasons.length > 0 && (
                <ul className="text-xs space-y-1 mt-2">
                  {convo.humanReasons.map((r) => (
                    <li key={r} className="flex gap-1.5">
                      <span className="text-muted-foreground">·</span>
                      {r}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {convo && convo.timeline.length > 0 && (
            <section className="space-y-2">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                Línea de tiempo
              </div>
              <ol className="space-y-2">
                {convo.timeline.map((t, i) => (
                  <li key={i} className="flex gap-2 text-xs">
                    <span className="text-muted-foreground tabular-nums w-20 shrink-0">
                      {t.time}
                    </span>
                    <span className="text-foreground">{t.label}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-muted-foreground">Responsable</div>
              <div className="font-medium flex items-center gap-1 mt-0.5">
                <User className="h-3 w-3" />
                {opportunity.responsible}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Último contacto</div>
              <div className="font-medium mt-0.5">{opportunity.lastContact}</div>
            </div>
          </section>
        </div>

        <div className="p-4 border-t space-y-2 bg-muted/30">
          <Button className="w-full" onClick={() => onPrimaryAction(opportunity)}>
            {primary.label}
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => onMarkRecovered(opportunity)}>
              Marcar recuperada
            </Button>
            <Button variant="outline" size="sm" onClick={() => onMarkLost(opportunity)}>
              Marcar perdida
            </Button>
          </div>
          {convo && (
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link to="/conversaciones">
                <MessageSquareText className="h-3.5 w-3.5 mr-1.5" />
                Abrir conversación
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            Abrir en Sistema de gestión
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
