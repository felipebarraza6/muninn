import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Plus,
  Pause,
  Play,
  MoreVertical,
  Sparkles,
  ArrowUpRight,
  Copy,
  Archive,
  Eye,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CAMPAIGN_KIND_LABEL, type CampaignKind } from "@/lib/mock-data";
import { formatCLP, formatNumber, pluralize } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CAMPAIGN_KIND_ICON } from "@/components/campaigns/campaign-hint-icon";
import { NewCampaignWizard } from "@/components/campaigns/new-campaign-wizard";
import { toast } from "sonner";
import {
  useCampaigns,
  useCampaignAggregates,
  useCampaignHints,
  useChangeCampaignStatus,
  useDuplicateCampaign,
} from "@/api/hooks/useCampaigns";

interface Campaign {
  id: string;
  name: string;
  kind?: CampaignKind;
  status: string;
  contacted: number;
  responded: number;
  appointments: number;
  revenue: number;
  audience_size?: number;
  progress?: number;
  start_date?: string;
  end_date?: string;
}

interface CampaignHint {
  kind: CampaignKind;
  title: string;
  audienceSize: number;
  estimatedValue: number;
}

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

export default function CampaignsPage() {
  const [open, setOpen] = useState(false);
  const [presetKind, setPresetKind] = useState<CampaignKind | null>(null);

  const {
    data: campaigns = [],
    isLoading,
    error,
  } = useCampaigns() as { data: Campaign[]; isLoading: boolean; error: Error | null };
  const { data: aggregates } = useCampaignAggregates() as {
    data:
      | { active?: number; contacted?: number; appointments?: number; revenue?: number }
      | undefined;
  };
  const { data: hints = [] } = useCampaignHints() as { data: CampaignHint[] };
  const changeStatus = useChangeCampaignStatus();
  const duplicateCampaign = useDuplicateCampaign();

  const monthly = {
    active: aggregates?.active ?? campaigns.filter((c) => c.status === "active").length,
    contacted: aggregates?.contacted ?? campaigns.reduce((acc, c) => acc + (c.contacted || 0), 0),
    appointments:
      aggregates?.appointments ?? campaigns.reduce((acc, c) => acc + (c.appointments || 0), 0),
    revenue: aggregates?.revenue ?? campaigns.reduce((acc, c) => acc + (c.revenue || 0), 0),
  };

  const launchWizard = (kind?: CampaignKind) => {
    setPresetKind(kind ?? null);
    setOpen(true);
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    changeStatus.mutate(
      { id, status: newStatus },
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

  const handleDuplicate = (id: string) => {
    duplicateCampaign.mutate(id, {
      onSuccess: () => toast.success("Campaña duplicada"),
      onError: () => toast.error("Error al duplicar la campaña"),
    });
  };

  if (isLoading) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-4">
        <div className="text-center text-destructive">Error al cargar las campañas</div>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            Patagon.IA - Motor proactivo
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mt-0.5">Campañas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            La IA contacta, tú decides qué activar.
          </p>
        </div>
        <Button onClick={() => launchWizard()}>
          <Plus className="h-4 w-4 mr-1.5" /> Nueva campaña
        </Button>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <KpiChip label="Activas" value={String(monthly.active)} />
        <KpiChip label="Contactados (mes)" value={formatNumber(monthly.contacted)} />
        <KpiChip label="Citas generadas" value={formatNumber(monthly.appointments)} />
        <KpiChip
          label="Ingresos recuperados (mes)"
          value={formatCLP(monthly.revenue)}
          tone="success"
          to="/metricas/ingresos-recuperados"
        />
      </section>

      {campaigns.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No hay campañas creadas aún.</p>
          <Button onClick={() => launchWizard()}>
            <Plus className="h-4 w-4 mr-1.5" /> Crear primera campaña
          </Button>
        </Card>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {campaigns.map((c) => {
            const Icon =
              (c.kind && CAMPAIGN_KIND_ICON[c.kind as keyof typeof CAMPAIGN_KIND_ICON]) || Sparkles;
            const responseRate =
              c.contacted > 0 ? Math.round((c.responded / c.contacted) * 100) : 0;
            return (
              <Card key={c.id} className="flex flex-col group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link to={`/campanas/${c.id}`} className="block">
                        <CardTitle className="text-base truncate hover:text-primary transition-colors">
                          {c.name}
                        </CardTitle>
                      </Link>
                      <CardDescription className="mt-0.5 truncate text-xs">
                        {CAMPAIGN_KIND_LABEL[c.kind as keyof typeof CAMPAIGN_KIND_LABEL] || c.kind}{" "}
                        - {c.segment}
                      </CardDescription>
                    </div>
                    <Badge className={STATUS_TONE[c.status] + " border-transparent shrink-0"}>
                      {STATUS_LABEL[c.status] || c.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <ClickableKpi
                      label="Contactados"
                      value={formatNumber(c.contacted || 0)}
                      to="/conversaciones"
                    />
                    <ClickableKpi
                      label="Respondieron"
                      value={formatNumber(c.responded || 0)}
                      to="/conversaciones"
                    />
                    <ClickableKpi
                      label="Citas generadas"
                      value={formatNumber(c.appointments || 0)}
                      to="/oportunidades"
                    />
                    <ClickableKpi
                      label="Pendientes"
                      value={formatNumber(c.pending || 0)}
                      to={`/campanas/${c.id}`}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Tasa de respuesta</span>
                      <span className="font-medium">{responseRate}%</span>
                    </div>
                    <Progress value={responseRate} className="h-1.5" />
                  </div>
                  <Link
                    to={`/campanas/${c.id}`}
                    className="block rounded-lg bg-success-soft text-success px-3 py-2 text-sm font-semibold flex items-center justify-between hover:opacity-90 transition"
                  >
                    <span className="text-xs font-medium opacity-80">Ingresos recuperados</span>
                    <span className="tabular-nums">{formatCLP(c.revenue || 0)}</span>
                  </Link>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Inicio:{" "}
                      {c.created
                        ? new Date(c.created).toLocaleDateString("es-CL", {
                            day: "2-digit",
                            month: "short",
                          })
                        : "—"}
                    </span>
                    <span>
                      {c.pending || 0} {pluralize(c.pending || 0, "pendiente", "pendientes")}
                    </span>
                  </div>
                </CardContent>
                <div className="flex gap-2 px-6 pb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-9"
                    disabled={changeStatus.isPending}
                    title={
                      c.status === "active"
                        ? "Pausar deja de enviar mensajes nuevos. Las conversaciones abiertas siguen funcionando."
                        : "Activar reanuda los envíos a quienes aún no han sido contactados."
                    }
                    onClick={() => handleToggleStatus(c.id, c.status)}
                  >
                    {c.status === "active" ? (
                      <>
                        <Pause className="h-3.5 w-3.5 mr-1.5" /> Pausar
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 mr-1.5" /> Activar
                      </>
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2 h-9 w-9"
                        aria-label="Más acciones"
                      >
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem asChild>
                        <Link to={`/campanas/${c.id}`}>
                          <Eye className="h-3.5 w-3.5 mr-2" /> Ver detalle
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={duplicateCampaign.isPending}
                        onClick={() => handleDuplicate(c.id)}
                      >
                        <Copy className="h-3.5 w-3.5 mr-2" /> Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => toast("Campaña archivada")}
                        className="text-destructive focus:text-destructive"
                      >
                        <Archive className="h-3.5 w-3.5 mr-2" /> Archivar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            );
          })}
        </section>
      )}

      {hints.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Sugerencias basadas en tu CRM</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {hints
              .filter((h) => h.audienceSize > 0 && !campaigns.some((c) => c.kind === h.kind))
              .slice(0, 6)
              .map((h) => {
                const Icon =
                  (h.kind && CAMPAIGN_KIND_ICON[h.kind as keyof typeof CAMPAIGN_KIND_ICON]) ||
                  Sparkles;
                return (
                  <button
                    key={h.kind}
                    type="button"
                    onClick={() => launchWizard(h.kind)}
                    className="flex items-start gap-3 rounded-xl border bg-card p-3 text-left hover:border-primary/40 hover:bg-muted/30 transition"
                  >
                    <div className="h-8 w-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold flex items-center gap-1">
                        {h.title}
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                        {h.description}
                      </p>
                      <div className="flex gap-2 mt-1 text-[11px]">
                        <span className="text-muted-foreground">
                          {formatNumber(h.audienceSize)} clientes
                        </span>
                        {h.estimatedValue > 0 && (
                          <span className="text-success font-medium">
                            ~ {formatCLP(h.estimatedValue)}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </section>
      )}

      <NewCampaignWizard open={open} onOpenChange={setOpen} initialKind={presetKind} />
    </div>
  );
}

function KpiChip({
  label,
  value,
  tone,
  to,
}: {
  label: string;
  value: string;
  tone?: "success";
  to?: string;
}) {
  const inner = (
    <div className="flex items-center justify-between rounded-xl border bg-card px-4 py-3 hover:shadow-sm transition">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
          {label}
        </div>
        <div
          className={cn(
            "text-lg font-semibold tabular-nums mt-0.5",
            tone === "success" && "text-success",
          )}
        >
          {value}
        </div>
      </div>
      {to && <ArrowUpRight className="h-4 w-4 text-muted-foreground" />}
    </div>
  );
  return to ? (
    <Link to={to} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
}

function ClickableKpi({ label, value, to }: { label: string; value: string; to: string }) {
  const content = (
    <div className="rounded-md px-2 py-1.5 -mx-2 -my-1.5 hover:bg-muted/60 transition">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-semibold tabular-nums">{value}</div>
    </div>
  );
  return <Link to={to}>{content}</Link>;
}
