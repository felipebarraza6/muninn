import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export type SummaryTone = "primary" | "success" | "info" | "warning";

export type SummaryKpi = {
  key: string;
  label: string;
  count: number;
  icon: LucideIcon;
  href: string;
  tone: SummaryTone;
};

const TONE: Record<SummaryTone, { iconBox: string; glow: string; bar: string }> = {
  primary: {
    iconBox: "bg-primary/15 text-primary",
    glow: "from-primary/25",
    bar: "bg-primary",
  },
  success: {
    iconBox: "bg-success/15 text-success",
    glow: "from-success/25",
    bar: "bg-success",
  },
  info: {
    iconBox: "bg-info/15 text-info",
    glow: "from-info/25",
    bar: "bg-info",
  },
  warning: {
    iconBox: "bg-warning/15 text-warning",
    glow: "from-warning/25",
    bar: "bg-warning",
  },
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
      {items.map((item) => {
        const tone = TONE[item.tone];
        return (
          <Link
            key={item.key}
            to={item.href}
            className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl relative"
          >
            <Card className="border-border/60 bg-card shadow-xs overflow-hidden h-full transition duration-200 group-hover:border-primary/40 group-hover:shadow-lg group-hover:-translate-y-1 group-hover:bg-card/80">
              <div
                className={cn(
                  "absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent opacity-0 transition group-hover:opacity-100",
                  tone.glow,
                )}
              />
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "h-9 w-9 rounded-xl flex items-center justify-center transition group-hover:scale-110",
                      tone.iconBox,
                    )}
                  >
                    <item.icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
              <div
                className={cn(
                  "absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-current to-transparent transition-all duration-300 group-hover:w-full",
                  tone.bar,
                )}
              />
            </Card>
          </Link>
        );
      })}
    </section>
  );
}
