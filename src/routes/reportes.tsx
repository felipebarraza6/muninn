import { useClinicDashboard } from "@/api/hooks/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const KPI_LABELS = [
  { key: "total_patients", label: "Total clientes" },
  { key: "total_conversations", label: "Conversaciones" },
  { key: "active_campaigns", label: "Campañas activas" },
  { key: "total_opportunities", label: "Oportunidades" },
] as const;

export default function Reportes() {
  const { data, isLoading } = useClinicDashboard();

  if (isLoading) {
    return (
      <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Reportes</h1>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {KPI_LABELS.map(({ key, label }) => (
          <Card key={key}>
            <CardContent className="p-4">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                {label}
              </div>
              <div className="text-2xl font-semibold tabular-nums mt-1">
                {(data?.kpis?.[key as keyof typeof data.kpis] as number) ?? 0}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
