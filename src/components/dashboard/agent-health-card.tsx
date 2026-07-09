import { Bot, Activity, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export interface AgentHealth {
  id: string;
  name: string;
  status: string;
  type: string;
  target_app: string;
  is_active: boolean;
}

export interface RecentAgentResponse {
  id: string;
  agent: string | null;
  content: string;
  created: string;
  response_time_ms: number | null;
  tokens_used: number | null;
}

interface AgentHealthCardProps {
  agents?: AgentHealth[];
  activeConversations?: number;
  recentResponses?: RecentAgentResponse[];
}

function formatDuration(ms: number | null): string {
  if (!ms) return "—";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${Math.round(ms / 1000)}s`;
}

export function AgentHealthCard({
  agents = [],
  activeConversations = 0,
  recentResponses = [],
}: AgentHealthCardProps) {
  const activeAgent = agents[0];
  const avgResponseTime =
    recentResponses.length > 0
      ? Math.round(
          recentResponses.reduce((acc, r) => acc + (r.response_time_ms ?? 0), 0) /
            recentResponses.length,
        )
      : null;

  return (
    <Card className="border bg-card">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="h-9 w-9 rounded-lg bg-success-soft text-success flex items-center justify-center">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-semibold">
                {activeAgent
                  ? `${activeAgent.name} · ${activeAgent.is_active ? "activo" : "inactivo"}`
                  : "Tu agente IA · sin agentes activos"}
              </div>
              <div className="text-xs text-muted-foreground">
                {activeConversations} conversaciones activas
              </div>
            </div>
          </div>
          <Link
            to="/conversaciones"
            className="text-xs text-primary hover:underline inline-flex items-center"
          >
            Ver bandeja <ArrowUpRight className="h-3 w-3 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Metric label="Agentes activos" value={String(agents.length)} tone="success" />
          <Metric label="Conversaciones" value={String(activeConversations)} tone="info" />
          <Metric
            label="Tiempo medio de respuesta"
            value={formatDuration(avgResponseTime)}
            tone="muted"
          />
        </div>

        <div className="space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Activity className="h-3 w-3" /> Respuestas recientes del agente
          </div>
          <div className="flex flex-col gap-2">
            {recentResponses.length === 0 && (
              <div className="text-xs text-muted-foreground">Sin respuestas recientes</div>
            )}
            {recentResponses.slice(0, 3).map((r) => (
              <div key={r.id} className="rounded-lg border bg-muted/30 px-3 py-2 text-xs">
                <div className="font-medium truncate">{r.agent ?? "Agente"}</div>
                <div className="text-muted-foreground line-clamp-2">{r.content}</div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {formatDuration(r.response_time_ms)} ·{" "}
                  {new Date(r.created).toLocaleTimeString("es-CL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "info" | "muted";
}) {
  const toneClass =
    tone === "success" ? "text-success" : tone === "info" ? "text-info" : "text-foreground";
  return (
    <div className="rounded-lg border bg-muted/30 p-2.5">
      <div className={`text-base font-semibold tracking-tight ${toneClass}`}>{value}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
