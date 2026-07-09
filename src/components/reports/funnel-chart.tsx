import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { funnel } from "@/lib/mock-data";
import { formatNumber } from "@/lib/format";

/**
 * Embudo de recuperación con forma real de funnel:
 * - Cada etapa es una banda trapezoidal cuyo ancho es proporcional al volumen.
 * - A la derecha, la conversión etapa-a-etapa con tono semántico.
 */
export function FunnelChart() {
  const total = funnel[0]?.value ?? 1;

  return (
    <Card className="border-border/60 shadow-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Embudo de recuperación</CardTitle>
        <CardDescription>De contacto a recuperación · últimos 30 días</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1.5">
          {funnel.map((row, idx) => {
            const pctTotal = (row.value / total) * 100;
            const prev = idx > 0 ? funnel[idx - 1].value : null;
            const conv = prev ? Math.round((row.value / prev) * 100) : null;
            const drop = prev ? prev - row.value : 0;

            // Intensidad de color: más oscuro en las etapas finales (más valiosas)
            const intensity = 0.45 + (idx / Math.max(funnel.length - 1, 1)) * 0.55;

            const convTone =
              conv === null
                ? ""
                : conv >= 70
                  ? "text-success"
                  : conv >= 40
                    ? "text-foreground"
                    : "text-warning-foreground";

            return (
              <div
                key={row.stage}
                className="grid grid-cols-[100px_1fr_80px] sm:grid-cols-[140px_1fr_120px] items-center gap-3"
              >
                <div className="text-xs">
                  <div className="font-medium text-foreground leading-tight">{row.stage}</div>
                  <div className="text-[11px] text-muted-foreground tabular-nums">
                    {formatNumber(row.value)}
                  </div>
                </div>

                <div className="relative h-9 flex items-center justify-center">
                  <div
                    className="h-full rounded-md flex items-center justify-center text-[11px] font-semibold tabular-nums text-primary-foreground transition-all"
                    style={{
                      width: `${Math.max(pctTotal, 6)}%`,
                      backgroundColor: `color-mix(in oklab, var(--color-primary) ${Math.round(intensity * 100)}%, transparent)`,
                    }}
                  >
                    {Math.round(pctTotal)}%
                  </div>
                </div>

                <div className="text-[11px] text-right tabular-nums">
                  {conv !== null ? (
                    <>
                      <span className={`font-semibold ${convTone}`}>{conv}%</span>
                      <span className="text-muted-foreground"> conversión</span>
                      {drop > 0 && (
                        <div className="text-[10px] text-muted-foreground/80">
                          −{formatNumber(drop)} caídos
                        </div>
                      )}
                    </>
                  ) : (
                    <span className="text-muted-foreground">Punto de partida</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Conversión total</span>
          <span className="font-semibold text-success tabular-nums">
            {Math.round(((funnel[funnel.length - 1]?.value ?? 0) / total) * 100)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
