import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bot,
  Share2,
  Globe,
  FunctionSquare,
  MessageSquare,
  ArrowRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAgents } from "@/api/hooks/useAgents";
import { useChannels } from "@/api/hooks/useChannels";
import { useExternalAPIs } from "@/api/hooks/useExternalAPIs";
import { useAgentFunctions } from "@/api/hooks/useAgentFunctions";
import { useClinicDashboard } from "@/api/hooks/useAnalytics";
import { formatNumber } from "@/lib/format";

interface SummaryItem {
  key: string;
  label: string;
  count: number;
  icon: typeof Bot;
  href: string;
  tone: "primary" | "success" | "info" | "warning";
}

const TONE_BG: Record<SummaryItem["tone"], string> = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  info: "bg-info-soft text-info",
  warning: "bg-warning-soft text-warning",
};

export default function HomePage() {
  const { data: agents = [], isLoading: agentsLoading } = useAgents();
  const { data: channels = [], isLoading: channelsLoading } = useChannels();
  const { data: apis = [], isLoading: apisLoading } = useExternalAPIs();
  const { data: functions = [], isLoading: functionsLoading } = useAgentFunctions();
  const { data: dashboardData, isLoading: dashboardLoading } = useClinicDashboard();

  const activeConversations = dashboardData?.kpis?.active_conversations ?? 0;
  const humanQueue = dashboardData?.human_conversations ?? [];
  const isLoading =
    agentsLoading || channelsLoading || apisLoading || functionsLoading || dashboardLoading;

  const summaryItems: SummaryItem[] = [
    {
      key: "agents",
      label: "Agentes IA",
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
      label: "APIs externas",
      count: apis.filter((a) => a.is_active).length,
      icon: Globe,
      href: "/apis",
      tone: "info",
    },
    {
      key: "functions",
      label: "Funciones",
      count: functions.filter((f) => f.is_active).length,
      icon: FunctionSquare,
      href: "/funciones",
      tone: "warning",
    },
    {
      key: "conversations",
      label: "Conversaciones activas",
      count: activeConversations,
      icon: MessageSquare,
      href: "/conversaciones",
      tone: "primary",
    },
  ];

  if (isLoading) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div
      className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Inicio</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Resumen de tu operación con agentes IA.
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {summaryItems.map((item) => (
          <Link
            key={item.key}
            to={item.href}
            className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
          >
            <Card className="border-border/60 bg-card shadow-xs overflow-hidden h-full transition group-hover:border-primary/40 group-hover:shadow-md group-hover:-translate-y-0.5">
              <CardContent className="p-4 space-y-3">
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center ${TONE_BG[item.tone]}`}
                >
                  <item.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="text-2xl font-semibold tracking-tight tabular-nums">
                    {formatNumber(item.count)}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    {item.label}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
            {humanQueue.slice(0, 5).map((conv) => (
              <div
                key={conv.id}
                className="flex items-center justify-between gap-3 rounded-lg border p-3"
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
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary-soft/40">
          <CardContent className="p-5 flex flex-col sm:flex-row gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="text-sm font-semibold text-primary">Revisa las conversaciones</div>
              <p className="text-sm text-foreground leading-relaxed">
                Tienes {formatNumber(activeConversations)} conversaciones activas. Revisa la bandeja
                para ver mensajes recientes y tomar control cuando sea necesario.
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
    </motion.div>
  );
}
