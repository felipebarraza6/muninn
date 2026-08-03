import { Link } from "react-router-dom";
import {
  Bot,
  Share2,
  LayoutGrid,
  Sparkles,
  CalendarCheck,
  DollarSign,
  BarChart3,
  ArrowRight,
  MessageSquare,
  Zap,
  TrendingUp,
  Activity,
  Clock,
  Users,
  ShoppingCart,
  Package,
  Target,
  PieChart,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { useAgents, useDashboardStats } from "@/api/hooks/useAgents";
import { useChannels } from "@/api/hooks/useChannels";
import { useExternalAPIs } from "@/api/hooks/useExternalAPIs";
import { useAgentFunctions } from "@/api/hooks/useAgentFunctions";
import { formatNumber } from "@/lib/format";
import { AdminMotionItem, AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import { SummaryKpiGrid, type SummaryKpi } from "@/components/dashboard/summary-kpi-grid";
import { OpsHealthCard } from "@/components/dashboard/ops-health-card";
import { canAccessSkills } from "@/lib/authGuards";
import { cn } from "@/lib/utils";

type WidgetStyle = {
  icon: LucideIcon;
  toneClass: string;
  iconBox: string;
  glow: string;
  bg: string;
};

const SOURCE_STYLES: Record<string, WidgetStyle> = {
  function_execution_revenue: {
    icon: DollarSign,
    toneClass: "text-success",
    iconBox: "bg-success/15",
    glow: "from-success/30",
    bg: "bg-success/5",
  },
  function_execution: {
    icon: CalendarCheck,
    toneClass: "text-primary",
    iconBox: "bg-primary/15",
    glow: "from-primary/30",
    bg: "bg-primary/5",
  },
};

const KEY_PATTERNS: Array<{ pattern: RegExp; style: WidgetStyle }> = [
  {
    pattern: /revenue|ingresos|venta|precio|costo|monto/i,
    style: {
      icon: DollarSign,
      toneClass: "text-success",
      iconBox: "bg-success/15",
      glow: "from-success/30",
      bg: "bg-success/5",
    },
  },
  {
    pattern: /cita|reserva|agend|appointment|booking/i,
    style: {
      icon: CalendarCheck,
      toneClass: "text-primary",
      iconBox: "bg-primary/15",
      glow: "from-primary/30",
      bg: "bg-primary/5",
    },
  },
  {
    pattern: /cliente|user|usuario|customer|client/i,
    style: {
      icon: Users,
      toneClass: "text-info",
      iconBox: "bg-info/15",
      glow: "from-info/30",
      bg: "bg-info/5",
    },
  },
  {
    pattern: /hora|time|tiempo|duration|duracion/i,
    style: {
      icon: Clock,
      toneClass: "text-warning",
      iconBox: "bg-warning/15",
      glow: "from-warning/30",
      bg: "bg-warning/5",
    },
  },
  {
    pattern: /producto|product|item|articulo/i,
    style: {
      icon: Package,
      toneClass: "text-info",
      iconBox: "bg-info/15",
      glow: "from-info/30",
      bg: "bg-info/5",
    },
  },
  {
    pattern: /sale|order|pedido|compra|purchase/i,
    style: {
      icon: ShoppingCart,
      toneClass: "text-primary",
      iconBox: "bg-primary/15",
      glow: "from-primary/30",
      bg: "bg-primary/5",
    },
  },
  {
    pattern: /meta|goal|target|objetivo/i,
    style: {
      icon: Target,
      toneClass: "text-warning",
      iconBox: "bg-warning/15",
      glow: "from-warning/30",
      bg: "bg-warning/5",
    },
  },
  {
    pattern: /stat|metric|kpi|indicador/i,
    style: {
      icon: PieChart,
      toneClass: "text-info",
      iconBox: "bg-info/15",
      glow: "from-info/30",
      bg: "bg-info/5",
    },
  },
];

const DEFAULT_STYLE: WidgetStyle = {
  icon: BarChart3,
  toneClass: "text-muted-foreground",
  iconBox: "bg-white/5",
  glow: "from-white/10",
  bg: "bg-white/5",
};

function resolveWidgetStyle(source: string, key: string): WidgetStyle {
  if (SOURCE_STYLES[source]) return SOURCE_STYLES[source];
  for (const { pattern, style } of KEY_PATTERNS) {
    if (pattern.test(key)) return style;
  }
  return DEFAULT_STYLE;
}

/** Resumen operativo de negocio/sucursal — config-driven por flow_policy. */
export function BusinessHome() {
  const showSkills = canAccessSkills();

  const { data: agents = [], isLoading: agentsLoading } = useAgents();
  const { data: channels = [], isLoading: channelsLoading } = useChannels();
  const { data: apis = [], isLoading: apisLoading } = useExternalAPIs();
  const { data: functions = [], isLoading: functionsLoading } = useAgentFunctions();
  const { data: widgets = [], isLoading: widgetsLoading } = useDashboardStats();

  const isLoading =
    agentsLoading ||
    channelsLoading ||
    apisLoading ||
    (showSkills && functionsLoading) ||
    widgetsLoading;

  const activeAgents = agents.filter((a) => a.is_active).length;
  const activeChannels = channels.filter((c) => c.is_active).length;
  const activeApis = apis.filter((a) => a.is_active).length;
  const activeFunctions = functions.filter((f) => f.is_active).length;

  const summaryItems: SummaryKpi[] = [
    {
      key: "agents",
      label: "Agentes",
      count: activeAgents,
      icon: Bot,
      href: "/agentes",
      tone: "primary",
    },
    {
      key: "channels",
      label: "Canales",
      count: activeChannels,
      icon: Share2,
      href: "/canales",
      tone: "success",
    },
    {
      key: "apis",
      label: "Aplicaciones",
      count: activeApis,
      icon: LayoutGrid,
      href: "/aplicaciones",
      tone: "info",
    },
    ...(showSkills
      ? [
          {
            key: "functions",
            label: "Skills",
            count: activeFunctions,
            icon: Sparkles,
            href: "/skills",
            tone: "warning" as const,
          },
        ]
      : []),
  ];

  const kpiCols =
    summaryItems.length >= 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3";

  if (isLoading) {
    return <PageSkeleton variant="dashboard" />;
  }

  return (
    <AdminPageMotion className="space-y-6">
      {/* Hero Section */}
      <AdminMotionItem>
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-muted/20 p-6 md:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-success/5" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary" strokeWidth={1.75} />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Panel de Control</h1>
              </div>
              <p className="text-muted-foreground text-sm md:text-base">
                Operación de tu sucursal en tiempo real
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StudioBranchFilter />
              {activeAgents > 0 && (
                <Badge
                  variant="outline"
                  className="gap-1.5 bg-success/10 border-success/30 text-success hover:bg-success/15"
                >
                  <Zap className="h-3 w-3" />
                  {activeAgents} {activeAgents === 1 ? "agente activo" : "agentes activos"}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </AdminMotionItem>

      {/* KPI Grid */}
      <AdminMotionItem>
        <SummaryKpiGrid items={summaryItems} columnsClass={kpiCols} />
      </AdminMotionItem>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Ops Health */}
        <AdminMotionItem className="lg:col-span-2">
          <OpsHealthCard />
        </AdminMotionItem>

        {/* Right Column - Quick Actions */}
        <AdminMotionItem>
          <Card className="border-border/60 bg-card h-full">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-info/15 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-info" strokeWidth={1.75} />
                </div>
                <h3 className="font-semibold">Accesos rápidos</h3>
              </div>
              <div className="space-y-2">
                <QuickLink
                  href="/app/conversaciones"
                  icon={MessageSquare}
                  label="Conversaciones"
                  tone="primary"
                />
                <QuickLink href="/app/agentes" icon={Bot} label="Agentes" tone="success" />
                <QuickLink href="/app/canales" icon={Share2} label="Canales" tone="info" />
                {showSkills && (
                  <QuickLink href="/app/skills" icon={Sparkles} label="Skills" tone="warning" />
                )}
                <QuickLink
                  href="/app/aplicaciones"
                  icon={LayoutGrid}
                  label="Aplicaciones"
                  tone="primary"
                />
                <QuickLink
                  href="/app/conocimiento"
                  icon={BarChart3}
                  label="Conocimiento"
                  tone="success"
                />
              </div>
            </CardContent>
          </Card>
        </AdminMotionItem>
      </div>

      {/* Widgets Section */}
      {widgets.length > 0 && (
        <AdminMotionItem>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-primary" strokeWidth={1.75} />
              </div>
              <h2 className="text-lg font-semibold tracking-tight">Métricas operativas</h2>
            </div>
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {widgets.map((w) => {
                const {
                  icon: Icon,
                  toneClass,
                  iconBox,
                  glow,
                  bg,
                } = resolveWidgetStyle(w.source, w.key);
                const isRevenue =
                  w.source === "function_execution_revenue" ||
                  /revenue|ingresos|venta|precio/i.test(w.key);
                const formattedValue = isRevenue
                  ? `$${formatNumber(w.value)}`
                  : formatNumber(w.value);
                const rangeLabel =
                  w.range === "today"
                    ? "Hoy"
                    : w.range === "week"
                      ? "7 días"
                      : w.range === "month"
                        ? "Mes"
                        : w.range;
                const hasRevenue = w.revenue != null && w.revenue > 0;
                const formattedRevenue = hasRevenue ? `$${formatNumber(w.revenue)}` : null;
                return (
                  <div key={w.key} className="group relative">
                    <Card
                      className={cn(
                        "border-border/60 bg-card shadow-xs overflow-hidden h-full transition duration-200 group-hover:border-primary/40 group-hover:shadow-lg group-hover:-translate-y-1",
                        bg,
                      )}
                    >
                      <div
                        className={cn(
                          "absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent opacity-0 transition group-hover:opacity-100",
                          glow,
                        )}
                      />
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div
                            className={cn(
                              "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition group-hover:scale-110",
                              iconBox,
                            )}
                          >
                            <Icon className={cn("h-5 w-5", toneClass)} strokeWidth={1.75} />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-baseline gap-2">
                            <div className="text-2xl font-semibold tracking-tight tabular-nums">
                              {formattedValue}
                            </div>
                            {rangeLabel && (
                              <span className="text-xs font-medium text-muted-foreground/70">
                                {rangeLabel}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                            {w.label}
                          </div>
                          {formattedRevenue && (
                            <div className="text-sm font-medium text-success mt-1 tabular-nums">
                              {formattedRevenue}
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <div
                        className={cn(
                          "absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-current to-transparent transition-all duration-300 group-hover:w-full",
                          toneClass,
                        )}
                      />
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </AdminMotionItem>
      )}
    </AdminPageMotion>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
  tone,
}: {
  href: string;
  icon: typeof Bot;
  label: string;
  tone: "primary" | "success" | "info" | "warning";
}) {
  const toneClasses = {
    primary: "hover:border-primary/40 hover:bg-primary/5 group-hover:text-primary",
    success: "hover:border-success/40 hover:bg-success/5 group-hover:text-success",
    info: "hover:border-info/40 hover:bg-info/5 group-hover:text-info",
    warning: "hover:border-warning/40 hover:bg-warning/5 group-hover:text-warning",
  };

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border/60 bg-card px-3 py-2.5 transition-all duration-200 group",
        toneClasses[tone],
      )}
    >
      <Icon className="h-4 w-4 text-muted-foreground transition group-hover:scale-110" />
      <span className="text-sm font-medium">{label}</span>
      <ArrowRight className="h-3.5 w-3.5 ml-auto opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
    </Link>
  );
}
