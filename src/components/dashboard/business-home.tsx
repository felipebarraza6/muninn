import { Link } from "react-router-dom";
import {
  Bot,
  Share2,
  LayoutGrid,
  Sparkles,
  MessageSquare,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { useAgents } from "@/api/hooks/useAgents";
import { useChannels } from "@/api/hooks/useChannels";
import { useExternalAPIs } from "@/api/hooks/useExternalAPIs";
import { useAgentFunctions } from "@/api/hooks/useAgentFunctions";
import { useClinicDashboard } from "@/api/hooks/useAnalytics";
import { formatNumber } from "@/lib/format";
import { AdminMotionItem, AdminPageMotion } from "@/components/admin/AdminPageMotion";
import { StudioBranchFilter } from "@/components/branch/StudioBranchFilter";
import { SummaryKpiGrid, type SummaryKpi } from "@/components/dashboard/summary-kpi-grid";
import { OpsHealthCard } from "@/components/dashboard/ops-health-card";
import { canAccessConversations, canAccessSkills } from "@/lib/authGuards";

type HumanConversation = {
  id?: string | number;
  external_user_name?: string | null;
  message_count?: number | null;
  last_message_at?: string | null;
};

/** Resumen operativo de negocio/sucursal — con Contacto y Conversaciones. */
export function BusinessHome() {
  const showConversations = canAccessConversations();
  const showSkills = canAccessSkills();

  const { data: agents = [], isLoading: agentsLoading } = useAgents();
  const { data: channels = [], isLoading: channelsLoading } = useChannels();
  const { data: apis = [], isLoading: apisLoading } = useExternalAPIs();
  const { data: functions = [], isLoading: functionsLoading } = useAgentFunctions();
  const { data: dashboardData, isLoading: dashboardLoading } = useClinicDashboard({
    enabled: showConversations,
  });

  const dashboard = dashboardData as
    | {
        kpis?: { active_conversations?: number };
        human_conversations?: HumanConversation[];
      }
    | undefined;

  const activeConversations = dashboard?.kpis?.active_conversations ?? 0;
  const humanQueue = dashboard?.human_conversations ?? [];
  const isLoading =
    agentsLoading ||
    channelsLoading ||
    apisLoading ||
    (showSkills && functionsLoading) ||
    (showConversations && dashboardLoading);

  const summaryItems: SummaryKpi[] = [
    {
      key: "agents",
      label: "Agentes",
      count: agents.filter((a) => a.is_active).length,
      icon: Bot,
      href: "/agentes",
      tone: "primary",
    },
    {
      key: "channels",
      label: "Canales",
      count: channels.filter((c) => c.is_active).length,
      icon: Share2,
      href: "/canales",
      tone: "success",
    },
    {
      key: "apis",
      label: "Aplicaciones",
      count: apis.filter((a) => a.is_active).length,
      icon: LayoutGrid,
      href: "/aplicaciones",
      tone: "info",
    },
    ...(showSkills
      ? [
          {
            key: "functions",
            label: "Skills",
            count: functions.filter((f) => f.is_active).length,
            icon: Sparkles,
            href: "/skills",
            tone: "warning" as const,
          },
        ]
      : []),
    ...(showConversations
      ? [
          {
            key: "conversations",
            label: "Conversaciones activas",
            count: activeConversations,
            icon: MessageSquare,
            href: "/conversaciones",
            tone: "primary" as const,
          },
        ]
      : []),
  ];

  const kpiCols =
    summaryItems.length >= 5
      ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
      : summaryItems.length === 4
        ? "grid-cols-2 md:grid-cols-4"
        : "grid-cols-2 md:grid-cols-3";

  if (isLoading) {
    return <PageSkeleton variant="dashboard" />;
  }

  return (
    <AdminPageMotion>
      <AdminMotionItem>
        <PageHeader
          description="Operación de tu sucursal: agentes, canales y cola humana."
          actions={<StudioBranchFilter />}
          className="mb-3"
        />
      </AdminMotionItem>
      <AdminMotionItem>
        <SummaryKpiGrid items={summaryItems} columnsClass={kpiCols} />
      </AdminMotionItem>

      <AdminMotionItem>
        <section className="mt-4">
          <OpsHealthCard />
        </section>
      </AdminMotionItem>

      {showConversations && (
        <AdminMotionItem>
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 space-y-0">
                <div className="min-w-0">
                  <CardTitle className="text-base">Contacto con clientes</CardTitle>
                  <CardDescription>Últimas conversaciones que requieren atención.</CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm" className="h-8 self-start">
                  <Link to="/conversaciones">
                    Ver todas <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {humanQueue.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No hay conversaciones pendientes de atención humana.
                  </div>
                )}
                {humanQueue.slice(0, 5).map((conv, index) => {
                  const href =
                    conv.id != null && conv.id !== ""
                      ? `/conversaciones?id=${encodeURIComponent(String(conv.id))}`
                      : "/conversaciones";
                  return (
                    <Link
                      key={conv.id != null ? String(conv.id) : `conv-${index}`}
                      to={href}
                      className="flex items-center justify-between gap-3 rounded-lg border p-3 transition hover:border-primary/40 hover:bg-muted/30"
                    >
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">
                          {conv.external_user_name || "Cliente"}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {conv.message_count ?? 0} mensajes ·{" "}
                          {conv.last_message_at
                            ? new Date(conv.last_message_at).toLocaleString("es-CL", {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
                        </div>
                      </div>
                      <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                    </Link>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-primary-soft/40">
              <CardContent className="p-5 flex flex-col sm:flex-row gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="text-sm font-semibold text-primary">
                    Revisa las conversaciones
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    Tienes {formatNumber(activeConversations)} conversaciones activas. Revisa la
                    bandeja para ver mensajes recientes y tomar control cuando sea necesario.
                  </p>
                  <div className="pt-2">
                    <Button asChild size="sm">
                      <Link to="/conversaciones">Ver conversaciones</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </AdminMotionItem>
      )}
    </AdminPageMotion>
  );
}
