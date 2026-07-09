import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  Send,
  ExternalLink,
  MoreHorizontal,
  ArrowUpRight,
  ArrowRight,
  Calendar,
  MessageSquareText,
  Inbox,
  Bot,
  CalendarCheck,
  CheckCheck,
  Archive,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { OPP_STATUS_LABEL, type OpportunityStatus } from "@/lib/mock-data";
import {
  BUCKET_LABEL,
  CURRENT_USER,
  PRIORITY_DOT,
  PRIORITY_LABEL,
  PRIORITY_RING,
  STATUS_TONE,
  AGE_LABEL,
  ageLabel,
  getBucket,
  getOpenValue,
  getPriority,
  getPrimaryAction,
  matchesAge,
  sortByPriority,
  type AgeFilter,
  type Bucket,
  type Opportunity,
  type Priority,
} from "@/lib/opportunities";
import { formatCLP, initials, avatarColor } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useOpportunities,
  useChangeOpportunityStage,
  useMarkOpportunityRecovered,
  useMarkOpportunityLost,
  useOpportunityFollowUp,
  useAssignOpportunity,
} from "@/api/hooks/useOpportunities";
import { OpportunityDetailSheet } from "@/components/opportunities/opportunity-detail-sheet";
import { MarkLostDialog, MarkRecoveredDialog } from "@/components/opportunities/close-dialogs";
import { FollowUpDialog } from "@/components/opportunities/follow-up-dialog";

const BUCKET_ORDER: Bucket[] = ["todo", "ai_managed", "booked", "recovered", "lost"];

const STAGE_TO_BUCKET: Record<string, Bucket> = {
  TODO: "todo",
  MANAGING_AI: "ai_managed",
  BOOKED: "booked",
  RECOVERED: "recovered",
  LOST: "lost",
};

const STATUS_TO_STAGE: Record<string, string> = {
  new: "TODO",
  contacted: "TODO",
  responded: "MANAGING_AI",
  interested: "MANAGING_AI",
  ready_to_book: "TODO",
  booked: "BOOKED",
  attended: "BOOKED",
  recovered: "RECOVERED",
  requires_human: "TODO",
  lost: "LOST",
};

function mapApiOpportunity(raw: Record<string, unknown>): Opportunity {
  const status = String(
    raw?.opportunity_stage ?? raw?.status ?? "new",
  ).toLowerCase() as OpportunityStatus;
  const validStatuses: OpportunityStatus[] = [
    "new",
    "contacted",
    "responded",
    "interested",
    "ready_to_book",
    "booked",
    "attended",
    "recovered",
    "requires_human",
    "lost",
  ];
  const normalizedStatus = validStatuses.includes(status) ? status : "new";

  const estimatedValue = Number(raw?.estimated_value ?? raw?.amount ?? raw?.value ?? 0);
  const hoursSinceContact = Number(raw?.hours_since_contact ?? raw?.hoursSinceContact ?? 0);
  const ageDays = Number(raw?.age_days ?? raw?.ageDays ?? raw?.days_old ?? 0);

  return {
    id: String(raw?.id ?? ""),
    patient: String(
      raw?.patient_name ?? raw?.patient ?? raw?.client_name ?? raw?.name ?? "Sin nombre",
    ),
    reason: String(
      raw?.reason ?? raw?.treatment ?? raw?.service ?? raw?.opportunity_type ?? "General",
    ),
    estimatedValue,
    status: normalizedStatus,
    lastContact: String(raw?.last_contact ?? raw?.lastContact ?? "Sin contacto"),
    hoursSinceContact,
    nextAction: String(raw?.next_action ?? raw?.nextAction ?? raw?.description ?? "Seguimiento"),
    responsible: String(raw?.responsible ?? raw?.assigned_to ?? raw?.owner ?? "IA"),
    conversationId: raw?.conversation_id ? String(raw.conversation_id) : undefined,
    lostReason: raw?.lost_reason ? String(raw.lost_reason) : undefined,
    ageDays,
  };
}

export default function OpportunitiesPage() {
  const [bucket, setBucket] = useState<Bucket>("todo");
  const [priority, setPriority] = useState<Priority | "all">("all");
  const [reason, setReason] = useState<string>("all");
  const [age, setAge] = useState<AgeFilter>("all");
  const [budgetsOnly, setBudgetsOnly] = useState(false);
  const [search, setSearch] = useState("");

  const [detailId, setDetailId] = useState<string | null>(null);
  const [recoverId, setRecoverId] = useState<string | null>(null);
  const [lostId, setLostId] = useState<string | null>(null);
  const [followUpId, setFollowUpId] = useState<string | null>(null);

  const { data: apiData, isLoading } = useOpportunities();
  const changeStage = useChangeOpportunityStage();
  const markRecovered = useMarkOpportunityRecovered();
  const markLost = useMarkOpportunityLost();
  const followUp = useOpportunityFollowUp();
  const assignOpp = useAssignOpportunity();

  const rawItems = useMemo(() => {
    if (!apiData) return [];
    const results = Array.isArray(apiData?.results)
      ? apiData.results
      : Array.isArray(apiData)
        ? apiData
        : [];
    return results.map(mapApiOpportunity);
  }, [apiData]);

  const items = useMemo(() => {
    return rawItems.map((o) => {
      const apiStage = String(o.status).toUpperCase();
      const mappedBucket = STAGE_TO_BUCKET[apiStage];
      if (mappedBucket) {
        const statusFromBucket: Record<Bucket, OpportunityStatus> = {
          todo:
            o.status === "requires_human"
              ? "requires_human"
              : o.status === "ready_to_book"
                ? "ready_to_book"
                : "new",
          ai_managed: "interested",
          booked: "booked",
          recovered: "recovered",
          lost: "lost",
        };
        return { ...o, status: statusFromBucket[mappedBucket] };
      }
      return o;
    });
  }, [rawItems]);

  const detailOpp = items.find((o) => o.id === detailId) ?? null;
  const recoverOpp = items.find((o) => o.id === recoverId) ?? null;
  const lostOpp = items.find((o) => o.id === lostId) ?? null;
  const followUpOpp = items.find((o) => o.id === followUpId) ?? null;

  const counts = useMemo(() => {
    const c: Record<Bucket, number> = { todo: 0, ai_managed: 0, booked: 0, recovered: 0, lost: 0 };
    for (const o of items) c[getBucket(o)]++;
    return c;
  }, [items]);

  const reasons = useMemo(() => {
    const set = new Set(items.map((o) => o.reason));
    return Array.from(set);
  }, [items]);

  const visible = useMemo(() => {
    return sortByPriority(
      items.filter((o) => {
        if (getBucket(o) !== bucket) return false;
        if (priority !== "all" && getPriority(o) !== priority) return false;
        if (reason !== "all" && o.reason !== reason) return false;
        if (budgetsOnly && !o.reason.toLowerCase().startsWith("presupuesto")) return false;
        if (!matchesAge(o, age)) return false;
        if (search && !o.patient.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    );
  }, [items, bucket, priority, reason, budgetsOnly, age, search]);

  const budgetsPendingCount = useMemo(
    () =>
      items.filter(
        (o) => o.reason.toLowerCase().startsWith("presupuesto") && getBucket(o) === "todo",
      ).length,
    [items],
  );

  const applyBudgetsShortcut = () => {
    setBucket("todo");
    setReason("all");
    setPriority("all");
    setAge("all");
    setSearch("");
    setBudgetsOnly(true);
  };

  const totalOpenValue = getOpenValue(items);

  const handlePrimary = (o: Opportunity) => {
    const action = getPrimaryAction(o);
    switch (action.kind) {
      case "schedule":
        changeStage.mutate(
          { id: o.id, stage: "BOOKED" },
          { onSuccess: () => toast.success(`${o.patient}: cita agendada`) },
        );
        break;
      case "take_control":
        changeStage.mutate(
          { id: o.id, stage: "TODO" },
          { onSuccess: () => toast.success(`Tomaste control de ${o.patient}`) },
        );
        break;
      case "first_contact":
        changeStage.mutate(
          { id: o.id, stage: "TODO" },
          { onSuccess: () => toast.success(`Mensaje inicial enviado a ${o.patient}`) },
        );
        break;
      case "send_reminder":
        toast.success(`Recordatorio enviado a ${o.patient}`);
        break;
      case "send_followup":
        setFollowUpId(o.id);
        break;
      case "mark_recovered":
        setRecoverId(o.id);
        break;
    }
  };

  const handleSendAsAI = (o: Opportunity, message: string) => {
    followUp.mutate(
      { id: o.id, notes: message },
      {
        onSuccess: () => {
          toast.success(`IA envió seguimiento a ${o.patient}`);
          setFollowUpId(null);
        },
      },
    );
  };

  const handleTakeOver = (o: Opportunity, message: string) => {
    followUp.mutate(
      { id: o.id, notes: message },
      {
        onSuccess: () => {
          toast.success(`Tomaste control de la conversación con ${o.patient}`);
          setFollowUpId(null);
        },
      },
    );
  };

  const handleConfirmRecovered = (amount: number) => {
    if (!recoverOpp) return;
    markRecovered.mutate(recoverOpp.id, {
      onSuccess: () => {
        toast.success(`${recoverOpp.patient} marcado como recuperado - ${formatCLP(amount)}`);
        setRecoverId(null);
        setDetailId(null);
      },
    });
  };

  const handleConfirmLost = (lostReason: string) => {
    if (!lostOpp) return;
    markLost.mutate(
      { id: lostOpp.id, reason: lostReason },
      {
        onSuccess: () => {
          toast(`${lostOpp.patient} marcada como perdida - ${lostReason}`);
          setLostId(null);
          setDetailId(null);
        },
      },
    );
  };

  const handleAssignToMe = (o: Opportunity) => {
    assignOpp.mutate(
      { id: o.id, userId: 1 },
      {
        onSuccess: () => toast.success(`${o.patient} asignada a ti`),
      },
    );
  };

  const BUCKET_META: Record<Bucket, { icon: typeof Inbox; tone: string; iconBg: string }> = {
    todo: { icon: Inbox, tone: "text-primary", iconBg: "bg-primary-soft text-primary" },
    ai_managed: { icon: Bot, tone: "text-info", iconBg: "bg-info-soft text-info" },
    booked: { icon: CalendarCheck, tone: "text-success", iconBg: "bg-success-soft text-success" },
    recovered: { icon: CheckCheck, tone: "text-success", iconBg: "bg-success-soft text-success" },
    lost: {
      icon: Archive,
      tone: "text-muted-foreground",
      iconBg: "bg-muted text-muted-foreground",
    },
  };

  if (isLoading) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6">
        <div className="text-sm text-muted-foreground">Cargando oportunidades...</div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <header className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-end pt-2">
        <div className="space-y-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            Bandeja de trabajo
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold leading-[1.05] tracking-tight text-foreground">
            Oportunidades
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            Clientes priorizados por valor y urgencia. La IA propone la siguiente acción para cada
            uno.
          </p>
        </div>

        <Link to="/metricas/oportunidades-abiertas" className="group block">
          <Card className="bg-gradient-to-br from-primary-soft/60 to-background border-primary/20 transition group-hover:shadow-lg group-hover:-translate-y-0.5">
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Valor total potencial
                </div>
                <div className="font-display text-2xl md:text-3xl font-bold tabular-nums text-foreground mt-1">
                  {formatCLP(totalOpenValue)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Ver detalle de las{" "}
                  {
                    items.filter((o) => {
                      const b = getBucket(o);
                      return b !== "recovered" && b !== "lost";
                    }).length
                  }{" "}
                  oportunidades abiertas
                </div>
              </div>
              <div className="rounded-full bg-primary text-primary-foreground p-2 group-hover:scale-110 transition">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
        {BUCKET_ORDER.map((b) => {
          const meta = BUCKET_META[b];
          const Icon = meta.icon;
          const active = bucket === b;
          return (
            <button
              key={b}
              type="button"
              onClick={() => setBucket(b)}
              className={cn(
                "group relative rounded-xl border bg-card p-3 text-left transition",
                "hover:shadow-md hover:-translate-y-0.5",
                active
                  ? "border-primary ring-2 ring-primary/30 shadow-sm"
                  : "border-border hover:border-primary/40",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className={cn("rounded-lg p-1.5", meta.iconBg)}>
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className={cn(
                    "text-lg font-semibold tabular-nums leading-none",
                    active ? meta.tone : "text-foreground",
                  )}
                >
                  {counts[b]}
                </span>
              </div>
              <div
                className={cn(
                  "mt-2 text-[11px] leading-tight font-medium line-clamp-2",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {BUCKET_LABEL[b]}
              </div>
            </button>
          );
        })}
      </section>

      {budgetsPendingCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Atajos:</span>
          <button
            type="button"
            onClick={applyBudgetsShortcut}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition",
              budgetsOnly
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card hover:border-primary/40 hover:bg-muted/40",
            )}
          >
            <Sparkles className="h-3 w-3" />
            Presupuestos pendientes
            <span
              className={cn(
                "rounded-full px-1.5 py-0 text-[10px] tabular-nums",
                budgetsOnly ? "bg-primary-foreground/20" : "bg-muted",
              )}
            >
              {budgetsPendingCount}
            </span>
          </button>
          {budgetsOnly && (
            <button
              type="button"
              onClick={() => setBudgetsOnly(false)}
              className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
            >
              Quitar
            </button>
          )}
        </div>
      )}

      <Tabs value={bucket} onValueChange={(v) => setBucket(v as Bucket)}>
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Mostrando <span className="font-semibold text-foreground">{visible.length}</span> en{" "}
            <span className="font-semibold text-foreground">{BUCKET_LABEL[bucket]}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 w-full sm:w-48"
              />
            </div>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority | "all")}>
              <SelectTrigger className="w-full sm:w-36">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las prioridades</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los motivos</SelectItem>
                {reasons.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={age} onValueChange={(v) => setAge(v as AgeFilter)}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Antigüedad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{AGE_LABEL.all}</SelectItem>
                <SelectItem value="today">{AGE_LABEL.today}</SelectItem>
                <SelectItem value="week">{AGE_LABEL.week}</SelectItem>
                <SelectItem value="month">{AGE_LABEL.month}</SelectItem>
                <SelectItem value="older">{AGE_LABEL.older}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {BUCKET_ORDER.map((b) => (
          <TabsContent key={b} value={b} className="mt-4 space-y-3">
            {b === "ai_managed" && (
              <div className="rounded-lg border border-info/30 bg-info-soft text-info px-3 py-2 text-xs flex items-start gap-2">
                <Bot className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  Estas oportunidades las está gestionando la IA. No requieren tu acción ahora -
                  solo lectura. Si una se estanca (presupuesto alto sin respuesta {">"}24h, o lead
                  sin avance {">"}30d), sube automáticamente a "Por hacer".
                </span>
              </div>
            )}
            {b === "booked" && (
              <div className="rounded-lg border border-info/30 bg-info-soft text-info px-3 py-2 text-xs flex items-start gap-2">
                <CalendarCheck className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  Las oportunidades agendadas salen automáticamente de tu cola "Por hacer". Si el
                  cliente cancela, vuelven aquí.
                </span>
              </div>
            )}
            {visible.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center text-sm text-muted-foreground">
                  {b === "ai_managed"
                    ? "La IA no tiene conversaciones activas en este momento."
                    : "No hay oportunidades en esta bandeja con los filtros actuales."}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {visible.map((o) => (
                  <OpportunityRow
                    key={o.id}
                    o={o}
                    variant={b === "ai_managed" ? "readOnly" : "actionable"}
                    onOpen={() => setDetailId(o.id)}
                    onPrimary={() => handlePrimary(o)}
                    onAssignToMe={() => handleAssignToMe(o)}
                    onRecover={() => setRecoverId(o.id)}
                    onLose={() => setLostId(o.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <OpportunityDetailSheet
        opportunity={detailOpp}
        open={!!detailId}
        onOpenChange={(v) => !v && setDetailId(null)}
        onPrimaryAction={(o) => handlePrimary(o)}
        onMarkRecovered={(o) => setRecoverId(o.id)}
        onMarkLost={(o) => setLostId(o.id)}
      />
      <MarkRecoveredDialog
        opportunity={recoverOpp}
        open={!!recoverId}
        onOpenChange={(v) => !v && setRecoverId(null)}
        onConfirm={handleConfirmRecovered}
      />
      <MarkLostDialog
        opportunity={lostOpp}
        open={!!lostId}
        onOpenChange={(v) => !v && setLostId(null)}
        onConfirm={handleConfirmLost}
      />
      <FollowUpDialog
        opportunity={followUpOpp}
        open={!!followUpId}
        onOpenChange={(v) => !v && setFollowUpId(null)}
        onSendAsAI={handleSendAsAI}
        onTakeOver={handleTakeOver}
      />
    </div>
  );
}

interface RowProps {
  o: Opportunity;
  variant?: "actionable" | "readOnly";
  onOpen: () => void;
  onPrimary: () => void;
  onAssignToMe: () => void;
  onRecover: () => void;
  onLose: () => void;
}

function OpportunityRow({
  o,
  variant = "actionable",
  onOpen,
  onPrimary,
  onAssignToMe,
  onRecover,
  onLose,
}: RowProps) {
  const priority = getPriority(o);
  const action = getPrimaryAction(o);
  const isClosed = o.status === "recovered" || o.status === "lost";
  const isRecovered = o.status === "recovered";
  const isReadOnly = variant === "readOnly";

  const PrimaryIcon =
    action.kind === "schedule"
      ? Calendar
      : action.kind === "take_control"
        ? Sparkles
        : action.kind === "send_reminder"
          ? Send
          : action.kind === "first_contact"
            ? MessageSquareText
            : action.kind === "mark_recovered"
              ? CheckCircle2
              : Send;

  const age = ageLabel(o);

  return (
    <TooltipProvider delayDuration={200}>
      <Card
        className={cn(
          "group rounded-lg border-border/60 transition",
          "hover:border-primary/40 hover:shadow-sm",
          isClosed && "opacity-70",
        )}
      >
        <CardContent className="p-0">
          <div className="flex items-center gap-3 pl-3 pr-2 py-2.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className={cn(
                    "shrink-0 inline-block h-2 w-2 rounded-full ring-4",
                    PRIORITY_DOT[priority],
                    PRIORITY_RING[priority],
                  )}
                  aria-label={`Prioridad ${PRIORITY_LABEL[priority].toLowerCase()}`}
                />
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                Prioridad {PRIORITY_LABEL[priority].toLowerCase()}
              </TooltipContent>
            </Tooltip>

            <Avatar className="h-9 w-9 shrink-0 ring-1 ring-border">
              <AvatarFallback className={cn("text-xs font-semibold", avatarColor(o.patient))}>
                {initials(o.patient)}
              </AvatarFallback>
            </Avatar>

            <button type="button" onClick={onOpen} className="flex-1 min-w-0 text-left">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
                <span className="font-display font-semibold text-sm text-foreground truncate">
                  {o.patient}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-1.5 py-[1px] text-[10px] font-medium leading-none shrink-0",
                    STATUS_TONE[o.status],
                  )}
                >
                  {OPP_STATUS_LABEL[o.status]}
                </span>
                {isReadOnly && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-info/30 bg-info-soft text-info px-1.5 py-[1px] text-[10px] font-medium leading-none shrink-0">
                    <Bot className="h-2.5 w-2.5" />
                    IA gestionando
                  </span>
                )}
                <span className="hidden sm:inline text-[11px] text-muted-foreground truncate">
                  - {o.reason}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-foreground/75 min-w-0">
                <ArrowRight className="h-3 w-3 text-primary/70 shrink-0" />
                <span className="truncate">{o.nextAction}</span>
                {age && <span className="text-[11px] text-muted-foreground shrink-0">- {age}</span>}
              </div>
              <div className="mt-1 md:hidden text-sm font-semibold tabular-nums">
                {formatCLP(o.estimatedValue)}
              </div>
            </button>

            <div className="hidden md:flex flex-col items-end shrink-0 pr-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "font-display font-semibold text-base tabular-nums leading-tight",
                      isRecovered ? "text-success" : "text-foreground",
                    )}
                  >
                    {formatCLP(o.estimatedValue)}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="text-xs">
                  Último contacto: {o.lastContact.toLowerCase()}
                </TooltipContent>
              </Tooltip>
              <div className="text-[11px] text-muted-foreground tabular-nums">{o.lastContact}</div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {isReadOnly
                ? o.conversationId && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-9 gap-1.5 px-2 sm:px-3 text-xs font-medium"
                    >
                      <Link to="/conversaciones">
                        <MessageSquareText className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Ver conversación</span>
                      </Link>
                    </Button>
                  )
                : !isClosed && (
                    <Button
                      size="sm"
                      onClick={onPrimary}
                      className="h-9 gap-1.5 px-2 sm:px-3 text-xs font-medium"
                    >
                      <PrimaryIcon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{action.label}</span>
                    </Button>
                  )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-foreground"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem onClick={onOpen}>
                    <ArrowUpRight className="h-3.5 w-3.5 mr-2" />
                    Ver detalle
                  </DropdownMenuItem>
                  {isReadOnly && !isClosed && (
                    <DropdownMenuItem onClick={onAssignToMe}>
                      <Sparkles className="h-3.5 w-3.5 mr-2" />
                      Tomar control
                    </DropdownMenuItem>
                  )}
                  {!isReadOnly && !isClosed && (
                    <>
                      <DropdownMenuItem onClick={onAssignToMe}>
                        <Sparkles className="h-3.5 w-3.5 mr-2" />
                        Asignar a mí
                      </DropdownMenuItem>
                      {o.conversationId && (
                        <DropdownMenuItem asChild>
                          <Link to="/conversaciones">
                            <MessageSquareText className="h-3.5 w-3.5 mr-2" />
                            Abrir conversación
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={onRecover}>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-success" />
                        Marcar recuperada
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onLose}>
                        <XCircle className="h-3.5 w-3.5 mr-2 text-destructive" />
                        Marcar como perdida
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast("Abriendo en Sistema de gestión...")}>
                    <ExternalLink className="h-3.5 w-3.5 mr-2" />
                    Abrir en Sistema de gestión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
