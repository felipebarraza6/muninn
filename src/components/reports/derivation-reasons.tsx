import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { derivationReasons } from "@/lib/mock-data";

export function DerivationReasons() {
  const max = Math.max(...derivationReasons.map((r) => r.count));
  return (
    <Card className="border-border/60 shadow-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Principales motivos de derivación a humano</CardTitle>
        <CardDescription>Temas que aún requieren atención humana</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {derivationReasons.map((r) => {
          const pct = (r.count / max) * 100;
          return (
            <div key={r.reason} className="space-y-1">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-foreground">{r.reason}</span>
                <span className="text-muted-foreground tabular-nums font-medium">{r.count}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-warning rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
