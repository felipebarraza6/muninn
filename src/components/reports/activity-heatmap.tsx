import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { activityHeatmap, heatmapBlocks, heatmapDays } from "@/lib/mock-data";

export function ActivityHeatmap() {
  const max = Math.max(...activityHeatmap.flat());
  return (
    <Card className="border-border/60 shadow-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Cuándo escriben los clientes</CardTitle>
        <CardDescription>Volumen de mensajes entrantes por hora · semana típica</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="flex flex-col justify-around pt-5 text-[10px] text-muted-foreground">
            {heatmapDays.map((d) => (
              <span key={d} className="h-5 leading-5">
                {d}
              </span>
            ))}
          </div>
          <div className="flex-1 min-w-0 overflow-x-auto">
            <div className="min-w-[320px]">
              <div className="grid grid-cols-12 gap-1 mb-1">
                {heatmapBlocks.map((b) => (
                  <div key={b} className="text-[10px] text-muted-foreground text-center">
                    {b}
                  </div>
                ))}
              </div>
              {activityHeatmap.map((row, di) => (
                <div key={di} className="grid grid-cols-12 gap-1 mb-1">
                  {row.map((v, hi) => {
                    const intensity = v / max;
                    const opacity = v === 0 ? 0.04 : 0.12 + intensity * 0.85;
                    return (
                      <div
                        key={hi}
                        className="h-5 rounded-sm transition-colors hover:ring-1 hover:ring-primary/40"
                        style={{
                          background: `color-mix(in oklab, var(--color-primary) ${Math.round(opacity * 100)}%, transparent)`,
                        }}
                        title={`${heatmapDays[di]} ${heatmapBlocks[hi]}h · ${v} msgs`}
                      />
                    );
                  })}
                </div>
              ))}
              <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-muted-foreground">
                <span>menos</span>
                {[0.1, 0.3, 0.5, 0.7, 0.95].map((o) => (
                  <span
                    key={o}
                    className="h-3 w-3 rounded-sm"
                    style={{
                      background: `color-mix(in oklab, var(--color-primary) ${o * 100}%, transparent)`,
                    }}
                  />
                ))}
                <span>más</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
