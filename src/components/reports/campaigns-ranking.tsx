import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { campaigns } from "@/lib/mock-data";
import { formatCLP, formatNumber } from "@/lib/format";
import { TrendingUp, Users, MessageCircle, CalendarCheck } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-success-soft text-success border-success/20",
  paused: "bg-warning-soft text-warning-foreground border-warning/20",
  draft: "bg-muted text-muted-foreground border-border",
  completed: "bg-info-soft text-info border-info/20",
};

const STATUS_LABEL: Record<string, string> = {
  active: "Activa",
  paused: "Pausada",
  draft: "Borrador",
  completed: "Completada",
};

export function CampaignsRanking() {
  // Ordenar por ingresos recuperados (más accionable que ROI)
  const ranked = [...campaigns].sort((a, b) => b.revenue - a.revenue);
  const maxRevenue = Math.max(...ranked.map((c) => c.revenue), 1);

  return (
    <Card className="border-border/60 shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">Ranking de campañas</CardTitle>
            <CardDescription>Ordenadas por ingresos recuperados</CardDescription>
          </div>
          <Badge variant="outline" className="text-[11px] font-normal">
            {ranked.length} campañas
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Header */}
        <div className="hidden md:grid grid-cols-[minmax(220px,2fr)_110px_110px_110px_minmax(180px,1.5fr)] gap-4 px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground border-y border-border/60 bg-muted/30">
          <div>Campaña</div>
          <div className="text-right inline-flex items-center justify-end gap-1">
            <Users className="h-3 w-3" /> Contactados
          </div>
          <div className="text-right inline-flex items-center justify-end gap-1">
            <MessageCircle className="h-3 w-3" /> Respuestas
          </div>
          <div className="text-right inline-flex items-center justify-end gap-1">
            <CalendarCheck className="h-3 w-3" /> Citas
          </div>
          <div className="text-right inline-flex items-center justify-end gap-1">
            <TrendingUp className="h-3 w-3" /> Ingresos recuperados
          </div>
        </div>

        <ul className="divide-y divide-border/40">
          {ranked.map((c, idx) => {
            const respPct = c.contacted > 0 ? Math.round((c.responded / c.contacted) * 100) : 0;
            const revPct = (c.revenue / maxRevenue) * 100;
            const statusClass = STATUS_STYLES[c.status] ?? STATUS_STYLES.draft;

            return (
              <li
                key={c.id}
                className="grid grid-cols-1 md:grid-cols-[minmax(220px,2fr)_110px_110px_110px_minmax(180px,1.5fr)] gap-y-2 md:gap-4 px-5 py-3 hover:bg-muted/30 transition-colors"
              >
                {/* Campaña */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary-soft text-[11px] font-semibold text-primary tabular-nums">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="font-medium text-sm text-foreground truncate">{c.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-muted-foreground truncate">
                        {c.segment}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 h-4 font-medium ${statusClass}`}
                      >
                        {STATUS_LABEL[c.status] ?? c.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Contactados */}
                <div className="md:text-right tabular-nums text-sm flex md:block items-baseline gap-2">
                  <span className="md:hidden text-[11px] text-muted-foreground">Contactados</span>
                  <span>{formatNumber(c.contacted)}</span>
                </div>

                {/* Respuesta */}
                <div className="md:text-right tabular-nums text-sm flex md:block items-baseline gap-2">
                  <span className="md:hidden text-[11px] text-muted-foreground">Respuesta</span>
                  <span>
                    {c.responded}{" "}
                    <span className="text-[11px] text-muted-foreground">({respPct}%)</span>
                  </span>
                </div>

                {/* Citas */}
                <div className="md:text-right tabular-nums text-sm flex md:block items-baseline gap-2">
                  <span className="md:hidden text-[11px] text-muted-foreground">Citas</span>
                  <span className="font-medium">{c.appointments}</span>
                </div>

                {/* Ingresos con barra */}
                <div className="flex items-center gap-2.5">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden min-w-[60px]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-success"
                      style={{ width: `${revPct}%` }}
                    />
                  </div>
                  <span className="tabular-nums text-sm font-semibold text-foreground w-auto sm:w-[88px] shrink-0 text-right">
                    {formatCLP(c.revenue)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
