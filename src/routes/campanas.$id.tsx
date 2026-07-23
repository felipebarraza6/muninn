import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  Pause,
  Play,
  MessageSquareText,
  Users,
  ClipboardList,
  Sparkles,
  Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CAMPAIGN_KIND_LABEL,
  CAMPAIGN_STAGE_LABEL,
  type CampaignPatientStage,
} from "@/lib/mock-data";
import { formatCLP, formatNumber, initials, avatarColor, pluralize } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { CAMPAIGN_KIND_ICON } from "@/components/campaigns/campaign-hint-icon";
import { useCampaign, useChangeCampaignStatus } from "@/api/hooks/useCampaigns";

const STATUS_TONE: Record<string, string> = {
  active: "bg-success-soft text-success",
  paused: "bg-warning-soft text-warning-foreground",
  draft: "bg-muted text-muted-foreground",
  completed: "bg-info-soft text-info",
};
const STATUS_LABEL: Record<string, string> = {
  active: "Activa",
  paused: "En pausa",
  draft: "Borrador",
  completed: "Completada",
};

interface CampaignDetail {
  id: string;
  name: string;
  kind?: string;
  segment?: string;
  status: string;
  contacted: number;
  responded: number;
  appointments: number;
  revenue: number;
  cost?: number;
  pending?: number;
  created?: string;
  audienceSample?: CampaignPatient[];
  excludedSample?: CampaignPatient[];
  audienceCriteria?: { label: string; value: string }[];
  template?: { first?: string; followUps?: CampaignFollowUp[] };
}

interface CampaignPatient {
  id?: string;
  patient: string;
  phone?: string;
  note?: string;
  stage?: CampaignPatientStage;
  estimatedValue?: number;
}

interface CampaignFollowUp {
  afterHours: number;
  text: string;
}

const STAGE_TONE: Record<CampaignPatientStage, string> = {
  queued: "bg-muted text-muted-foreground",
  contacted: "bg-info-soft text-info",
  responded: "bg-primary-soft text-primary",
  booked: "bg-success-soft text-success",
  closed: "bg-success-soft text-success",
  discarded: "bg-destructive-soft text-destructive",
};

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const {
    data: c,
    isLoading,
    error,
  } = useCampaign(id) as { data: CampaignDetail; isLoading: boolean; error: Error | null };
  const changeStatus = useChangeCampaignStatus();

  const [tab, setTab] = useState<"audience" | "message" | "results">("audience");

  if (isLoading) {
    return <PageSkeleton variant="detail" />;
  }

  if (error || !c) {
    return (
      <div className="px-6 py-12 max-w-md mx-auto text-center space-y-3">
        <h1 className="text-xl font-semibold">Campaña no encontrada</h1>
        <Button asChild variant="outline">
          <Link to="/campanas">Volver a Campañas</Link>
        </Button>
      </div>
    );
  }

  const Icon =
    (c?.kind && CAMPAIGN_KIND_ICON[c.kind as keyof typeof CAMPAIGN_KIND_ICON]) || Sparkles;
  const responseRate = c.contacted > 0 ? Math.round((c.responded / c.contacted) * 100) : 0;
  const bookRate =
    c.responded > 0 ? Math.round((c.appointments / Math.max(c.responded, 1)) * 100) : 0;
  const profit = (c.revenue || 0) - (c.cost || 0);

  const audienceSample = c.audienceSample || [];
  const excludedSample = c.excludedSample || [];
  const audienceCriteria = c.audienceCriteria || [];
  const template = c.template || { first: "", followUps: [] };

  const handleToggleStatus = () => {
    const newStatus = c.status === "active" ? "paused" : "active";
    changeStatus.mutate(
      { id: c.id, status: newStatus },
      {
        onSuccess: () =>
          toast(
            newStatus === "active"
              ? "Campaña activada. Reanudando envíos a pendientes."
              : "Campaña pausada. La IA seguirá respondiendo a quienes ya están conversando.",
          ),
        onError: () => toast.error("Error al cambiar el estado de la campaña"),
      },
    );
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1200px] mx-auto space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
          <Link to="/campanas">
            <ArrowLeft className="h-4 w-4 mr-1" /> Campañas
          </Link>
        </Button>
      </div>

      <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <div className="h-12 w-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              {CAMPAIGN_KIND_LABEL[c.kind as keyof typeof CAMPAIGN_KIND_LABEL] || c.kind}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight truncate">{c.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{c.segment}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge className={STATUS_TONE[c.status] + " border-transparent"}>
                {STATUS_LABEL[c.status] || c.status}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Inicio{" "}
                {c.created
                  ? new Date(c.created).toLocaleDateString("es-CL", {
                      day: "2-digit",
                      month: "short",
                    })
                  : "—"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              {c.status === "active" && (
                <>
                  Enviando - {formatNumber(c.pending || 0)}{" "}
                  {pluralize(c.pending || 0, "pendiente", "pendientes")} por contactar
                </>
              )}
              {c.status === "paused" && (
                <>
                  Pausada - {formatNumber(c.pending || 0)}{" "}
                  {pluralize(c.pending || 0, "pendiente", "pendientes")} esperando reanudar. Las
                  conversaciones abiertas siguen activas.
                </>
              )}
              {c.status === "completed" && <>Audiencia completa contactada</>}
              {c.status === "draft" && <>Borrador - aún no se han enviado mensajes</>}
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            disabled={changeStatus.isPending}
            title={
              c.status === "active"
                ? "Pausar deja de enviar mensajes nuevos. Las conversaciones abiertas siguen funcionando."
                : "Activar reanuda los envíos a quienes aún no han sido contactados."
            }
            onClick={handleToggleStatus}
          >
            {c.status === "active" ? (
              <>
                <Pause className="h-4 w-4 mr-1.5" /> Pausar
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1.5" /> Activar
              </>
            )}
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <KpiTile label="Contactados" value={formatNumber(c.contacted || 0)} />
        <KpiTile
          label="Respondieron"
          value={formatNumber(c.responded || 0)}
          hint={`${responseRate}% de tasa`}
        />
        <KpiTile
          label="Citas generadas"
          value={formatNumber(c.appointments || 0)}
          hint={`${bookRate}% conversión`}
        />
        <KpiTile label="Ingresos recuperados" value={formatCLP(c.revenue || 0)} tone="success" />
      </section>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="audience">
            <Users className="h-3.5 w-3.5 mr-1.5" /> Audiencia
          </TabsTrigger>
          <TabsTrigger value="message">
            <MessageSquareText className="h-3.5 w-3.5 mr-1.5" /> Mensaje
          </TabsTrigger>
          <TabsTrigger value="results">
            <ClipboardList className="h-3.5 w-3.5 mr-1.5" /> Resultados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="audience" className="space-y-4 mt-4">
          {audienceCriteria.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Criterios del segmento</CardTitle>
                <CardDescription className="text-xs">
                  Quién entra automáticamente a esta campaña.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {audienceCriteria.map((cr) => (
                    <div key={cr.label} className="rounded-lg border p-3">
                      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                        {cr.label}
                      </dt>
                      <dd className="font-medium mt-0.5">{cr.value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3 flex-row items-end justify-between">
              <div>
                <CardTitle className="text-sm">Clientes incluidos</CardTitle>
                <CardDescription className="text-xs">
                  Muestra de los que están avanzando o trabados.
                </CardDescription>
              </div>
              <span className="text-xs text-muted-foreground">
                {audienceSample.length} de {formatNumber(c.audienceTotal ?? c.contacted ?? 0)}
              </span>
            </CardHeader>
            <CardContent>
              {audienceSample.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Sin clientes en muestra
                </p>
              ) : (
                <div className="overflow-x-auto -mx-6 px-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="text-right">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {audienceSample.map((m) => (
                        <TableRow key={m.id ?? m.patient}>
                          <TableCell>
                            <div className="flex items-center gap-2 min-w-0">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback
                                  className={cn(
                                    "text-[10px] font-semibold",
                                    avatarColor(m.patient),
                                  )}
                                >
                                  {initials(m.patient)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium truncate">{m.patient}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                                STAGE_TONE[m.stage as CampaignPatientStage] ||
                                  "bg-muted text-muted-foreground",
                              )}
                            >
                              {CAMPAIGN_STAGE_LABEL[m.stage as CampaignPatientStage] || m.stage}
                            </span>
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-sm">
                            {formatCLP(m.value || 0)}
                          </TableCell>
                          <TableCell className="text-right">
                            {m.conversationId ? (
                              <Button asChild size="sm" variant="ghost" aria-label="Ver chat">
                                <Link to={`/conversaciones?id=${m.conversationId}`}>
                                  <MessageSquareText className="h-3.5 w-3.5 sm:mr-1" />
                                  <span className="hidden sm:inline">Ver chat</span>
                                </Link>
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() => toast(`${m.patient} pausado para esta campaña`)}
                              >
                                Pausar
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {excludedSample && excludedSample.length > 0 && (
            <Card>
              <CardHeader className="pb-3 flex-row items-end justify-between">
                <div>
                  <CardTitle className="text-sm">Excluidos al lanzar</CardTitle>
                  <CardDescription className="text-xs">
                    Clientes que el operador desmarcó manualmente. No serán contactados por esta
                    campaña.
                  </CardDescription>
                </div>
                <span className="text-xs text-muted-foreground">
                  {excludedSample.length}{" "}
                  {pluralize(excludedSample.length, "excluido", "excluidos")}
                </span>
              </CardHeader>
              <CardContent>
                <ul className="divide-y">
                  {excludedSample.map((m) => (
                    <li key={m.id ?? m.patient} className="flex items-center gap-3 py-2.5">
                      <Avatar className="h-7 w-7 opacity-70">
                        <AvatarFallback
                          className={cn("text-[10px] font-semibold", avatarColor(m.patient))}
                        >
                          {initials(m.patient)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate line-through opacity-70">
                          {m.patient}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {m.phone ?? "—"}
                          {m.note && <span className="ml-2 italic">- {m.note}</span>}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="message" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" /> Primer mensaje
              </CardTitle>
              <CardDescription className="text-xs">
                El que envía la IA cuando el cliente entra a la campaña.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {template.first ? (
                <>
                  <div className="rounded-2xl rounded-bl-sm bg-bubble-ai text-bubble-ai-foreground p-3.5 text-sm max-w-md">
                    {template.first
                      .replace("{nombre}", "Maria")
                      .replace(
                        "{tratamiento}",
                        c.kind === "budgets" ? "presupuesto" : c.name.toLowerCase(),
                      )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2">
                    Variables disponibles: <code className="font-mono">{"{nombre}"}</code> -{" "}
                    <code className="font-mono">{"{tratamiento}"}</code>
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Sin mensaje configurado</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Seguimientos automáticos</CardTitle>
              <CardDescription className="text-xs">
                Si el cliente no responde, la IA reintenta así.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {template.followUps && template.followUps.length === 0 ? (
                <p className="text-xs text-muted-foreground">Sin seguimientos configurados.</p>
              ) : (
                template.followUps?.map((fu, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold w-20 shrink-0 pt-1">
                      +{fu.afterHours}h
                    </div>
                    <div className="rounded-2xl rounded-bl-sm bg-muted p-3 text-sm flex-1">
                      {fu.text
                        .replace("{nombre}", "Maria")
                        .replace("{tratamiento}", "tu tratamiento")}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Reglas de cierre</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1.5">
              <div className="flex gap-2">
                <span className="text-success">✓</span> Si el cliente responde, la IA continúa el
                diálogo en Conversaciones.
              </div>
              <div className="flex gap-2">
                <span className="text-success">✓</span> Si pide hablar con humano, deriva al bucket
                "Para mí".
              </div>
              <div className="flex gap-2">
                <span className="text-success">✓</span> Si agenda hora, la conversación va a
                "Archivadas".
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Embudo de la campaña</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Contactados", value: c.contacted || 0 },
                { label: "Respondieron", value: c.responded || 0 },
                { label: "Agendaron", value: c.appointments || 0 },
                { label: "Cerrados (recuperados)", value: Math.round((c.appointments || 0) * 0.7) },
              ].map((row, i, arr) => {
                const pct = arr[0].value > 0 ? Math.round((row.value / arr[0].value) * 100) : 0;
                return (
                  <div key={row.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">{row.label}</span>
                      <span className="text-muted-foreground">
                        {formatNumber(row.value)} - {pct}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Recuperación vs costo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row
                label="Ingresos recuperados"
                value={formatCLP(c.revenue || 0)}
                tone="text-success"
                strong
              />
              <Row
                label="Costo estimado (mensajería + configuración)"
                value={`- ${formatCLP(c.cost || 0)}`}
                tone="text-muted-foreground"
              />
              <div className="border-t pt-2">
                <Row label="Utilidad" value={formatCLP(profit)} strong />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KpiTile({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "success";
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
          {label}
        </div>
        <div
          className={cn(
            "text-xl font-semibold tabular-nums mt-1",
            tone === "success" && "text-success",
          )}
        >
          {value}
        </div>
        {hint && <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div>}
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  value,
  tone,
  strong,
}: {
  label: string;
  value: string;
  tone?: string;
  strong?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className={cn("text-sm", tone ?? "text-foreground")}>{label}</span>
      <span className={cn("tabular-nums", strong && "font-semibold")}>{value}</span>
    </div>
  );
}
