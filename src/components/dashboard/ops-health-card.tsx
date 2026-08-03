import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Circle,
  MessageSquare,
  Globe,
  Bot,
  Sparkles,
  KeyRound,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOpsHealth } from "@/api/hooks/useAgents";
import { cn } from "@/lib/utils";

const CHANNEL_ICONS: Record<string, typeof Globe> = {
  whatsapp: MessageSquare,
  web_embed: Globe,
  telegram: MessageSquare,
};

function channelIcon(type: string) {
  return CHANNEL_ICONS[type] ?? Bot;
}

type CheckItem = {
  ok: boolean;
  label: string;
  icon: typeof Sparkles;
  doneLabel?: string;
};

/** Resumen de salud operativa — enfoque en lo que el usuario necesita saber. */
export function OpsHealthCard() {
  const { data, isLoading, isError } = useOpsHealth();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">Cargando estado…</CardContent>
      </Card>
    );
  }

  if (isError || !data) return null;

  const ready = Boolean(data.ready_for_production);
  const onboarding = data.onboarding ?? {};
  const channels = data.channels ?? [];

  const checks: CheckItem[] = [
    {
      ok: Boolean(onboarding.has_llm_provider),
      label: "IA conectada",
      doneLabel: "IA conectada",
      icon: Sparkles,
    },
    {
      ok: Boolean(onboarding.has_api_key),
      label: "API key",
      doneLabel: "API key",
      icon: KeyRound,
    },
    {
      ok: Boolean(onboarding.has_agents),
      label: "Agente",
      doneLabel: "Agente",
      icon: Bot,
    },
    {
      ok: Boolean(data.checklist?.has_bidirectional_channel),
      label: "Canal bidireccional",
      doneLabel: "Canal bidireccional",
      icon: MessageCircle,
    },
  ];

  const doneCount = checks.filter((c) => c.ok).length;

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-border/60 bg-card",
        ready ? "border-success/30" : "border-warning/30",
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent",
          ready ? "from-success/60" : "from-warning/60",
        )}
      />
      <CardHeader className="pb-3 flex flex-row items-start justify-between gap-3 space-y-0">
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-base flex items-center gap-2">
            <span
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                ready ? "bg-success/15 text-success" : "bg-warning/15 text-warning",
              )}
            >
              <Activity className="h-4 w-4" strokeWidth={1.75} />
            </span>
            Estado del agente
          </CardTitle>
          <CardDescription>
            {ready
              ? "Tu agente está listo para atender clientes."
              : `${doneCount}/${checks.length} pasos completados para activarlo.`}
          </CardDescription>
        </div>
        <Badge
          variant={ready ? "default" : "secondary"}
          className={cn(
            "shrink-0 gap-1",
            ready && "bg-success/15 text-success border-success/30 hover:bg-success/20",
          )}
        >
          {ready ? (
            <>
              <CheckCircle2 className="h-3 w-3" /> Activo
            </>
          ) : (
            "Pendiente"
          )}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {checks.map((c) => (
            <CheckRow key={c.label} {...c} />
          ))}
        </ul>

        {channels.length > 0 && (
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Canales conectados
            </p>
            <div className="flex flex-wrap gap-2">
              {channels.map((ch) => {
                const Icon = channelIcon(ch.channel_type ?? "");
                return (
                  <span
                    key={ch.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-2.5 py-1 text-xs text-foreground"
                  >
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    {ch.name || ch.channel_type}
                    {ch.production_ready && (
                      <span className="ml-0.5 inline-flex items-center gap-0.5 text-success">
                        <CheckCircle2 className="h-3 w-3" />
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <Button asChild size="sm" variant="outline" className="h-8">
            <Link to="/app/agentes">
              Agentes <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
          <Button asChild size="sm" variant="ghost" className="h-8">
            <Link to="/app/canales">Canales</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CheckRow({ ok, label, doneLabel, icon: Icon }: CheckItem) {
  return (
    <li className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/15 px-2.5 py-2">
      {ok ? (
        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
      ) : (
        <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
      )}
      <Icon
        className={cn("h-3.5 w-3.5 shrink-0", ok ? "text-success" : "text-muted-foreground/50")}
      />
      <span className={cn("text-sm", ok ? "text-foreground" : "text-muted-foreground")}>
        {ok ? (doneLabel ?? label) : label}
      </span>
    </li>
  );
}
