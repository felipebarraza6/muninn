import { useState } from "react";
import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PERIODS = [
  { value: "7d", label: "Últimos 7 días" },
  { value: "30d", label: "Últimos 30 días" },
  { value: "90d", label: "Últimos 90 días" },
  { value: "year", label: "Este año" },
];

const BRANCHES = [
  { value: "all", label: "Todas las sucursales" },
  { value: "providencia", label: "Providencia" },
  { value: "lascondes", label: "Las Condes" },
  { value: "nunoa", label: "Ñuñoa" },
];

export function PeriodSelector() {
  const [period, setPeriod] = useState("30d");
  const [branch, setBranch] = useState("all");
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={period} onValueChange={setPeriod}>
        <SelectTrigger className="h-8 w-full sm:w-[170px] text-xs">
          <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" strokeWidth={1.75} />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PERIODS.map((p) => (
            <SelectItem key={p.value} value={p.value} className="text-xs">
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={branch} onValueChange={setBranch}>
        <SelectTrigger className="h-8 w-full sm:w-[180px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {BRANCHES.map((b) => (
            <SelectItem key={b.value} value={b.value} className="text-xs">
              {b.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
