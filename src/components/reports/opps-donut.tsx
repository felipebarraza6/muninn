import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { oppsMix } from "@/lib/mock-data";
import { formatCLP } from "@/lib/format";

export function OppsDonut() {
  const totalRevenue = oppsMix.reduce((s, o) => s + o.revenue, 0);
  return (
    <Card className="border-border/60 shadow-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Mix de oportunidades</CardTitle>
        <CardDescription>Por tipo, ponderado por valor estimado</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4 items-center">
          <div className="h-36 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={oppsMix}
                  dataKey="revenue"
                  innerRadius={42}
                  outerRadius={64}
                  paddingAngle={2}
                  stroke="var(--color-card)"
                  strokeWidth={2}
                >
                  {oppsMix.map((o) => (
                    <Cell key={o.name} fill={o.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => formatCLP(v)}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-[10px] text-muted-foreground">Total</div>
              <div className="text-sm font-semibold tabular-nums">
                ${(totalRevenue / 1000000).toFixed(1)}M
              </div>
            </div>
          </div>
          <ul className="space-y-1.5 text-xs">
            {oppsMix.map((o) => {
              const pct = Math.round((o.revenue / totalRevenue) * 100);
              return (
                <li key={o.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-2 w-2 rounded-sm shrink-0" style={{ background: o.color }} />
                    <span className="truncate">{o.name}</span>
                  </div>
                  <span className="text-muted-foreground tabular-nums shrink-0">
                    {formatCLP(o.revenue)}{" "}
                    <span className="text-muted-foreground/70">· {pct}%</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
