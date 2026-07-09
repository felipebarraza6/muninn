import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { monthlyRevenue, monthlyRevenuePrevious } from "@/lib/mock-data";
import { formatCLP } from "@/lib/format";

export function RevenueCompare() {
  const merged = monthlyRevenue.map((m, i) => ({
    month: m.month,
    actual: m.value,
    previo: monthlyRevenuePrevious[i]?.value ?? 0,
  }));
  const totalActual = merged.reduce((s, m) => s + m.actual, 0);
  const totalPrev = merged.reduce((s, m) => s + m.previo, 0);
  const delta = totalPrev > 0 ? Math.round(((totalActual - totalPrev) / totalPrev) * 100) : 0;
  return (
    <Card className="border-border/60 shadow-xs">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">Ingresos recuperados</CardTitle>
            <CardDescription>Últimos 6 meses vs período anterior</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold tabular-nums">{formatCLP(totalActual)}</div>
            <div className="text-[11px] inline-flex items-center gap-0.5 text-success font-medium">
              <ArrowUp className="h-3 w-3" /> {delta}% vs anterior
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={merged} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="rev-actual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="var(--color-muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v: number) => formatCLP(v)}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} iconType="line" />
              <Line
                type="monotone"
                dataKey="previo"
                name="Período anterior"
                stroke="var(--color-muted-foreground)"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
                fill="url(#rev-actual)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
