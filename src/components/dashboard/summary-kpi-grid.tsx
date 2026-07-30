import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";

export type SummaryTone = "primary" | "success" | "info" | "warning";

export type SummaryKpi = {
  key: string;
  label: string;
  count: number;
  icon: LucideIcon;
  href: string;
  tone: SummaryTone;
};

const TONE_BG: Record<SummaryTone, string> = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  info: "bg-info-soft text-info",
  warning: "bg-warning-soft text-warning",
};

export function SummaryKpiGrid({
  items,
  columnsClass = "grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
}: {
  items: SummaryKpi[];
  columnsClass?: string;
}) {
  return (
    <section className={`grid gap-3 ${columnsClass}`}>
      {items.map((item) => (
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
  );
}
