import {
  conversations,
  funnel,
  kpis,
  kpiSparklines,
  monthlyRevenue,
  opportunities,
  weeklyRevenue,
  derivationReasons,
  type Conversation,
  type Opportunity,
} from "@/lib/mock-data";
import { formatCLP, formatNumber } from "@/lib/format";

export type MetricId =
  | "ingresos-recuperados"
  | "oportunidades-abiertas"
  | "citas-generadas"
  | "clientes-reactivados"
  | "conversaciones-humano";

export type MetricTone = "primary" | "success" | "info" | "destructive";

/** Fila de cliente que respalda la métrica. */
export interface MetricPatientRow {
  id: string;
  patient: string;
  reason: string;
  value?: number;
  date: string;
  campaign?: string;
  /** Para abrir el detalle. */
  link: { to: "/conversaciones" | "/oportunidades"; search?: { id?: string } };
}

export interface MetricBreakdownItem {
  label: string;
  value: number;
  /** Si es monetario, mostramos en CLP; si no, número. */
  format: "money" | "count";
}

export interface MetricSeriesPoint {
  label: string;
  value: number;
}

export interface MetricDetail {
  id: MetricId;
  label: string;
  /** Texto largo para el subtítulo. */
  description: string;
  /** Valor formateado para mostrar grande. */
  displayValue: string;
  /** Variación porcentual descrita ("+18% vs. mes anterior"). */
  delta: string;
  deltaTone: "success" | "destructive" | "muted";
  tone: MetricTone;
  /** Serie de evolución (semanas o meses, según métrica). */
  series: MetricSeriesPoint[];
  seriesLabel: string;
  /** Cómo se compone el número. */
  breakdown: MetricBreakdownItem[];
  breakdownTitle: string;
  /** Listado de clientes/conversaciones que respaldan el número. */
  patients: MetricPatientRow[];
  patientsTitle: string;
  patientValueColumn?: string;
}

const STATUS_REASON: Record<string, string> = {
  new: "Nuevo lead",
  contacted: "Contactado",
  responded: "Respondió",
  interested: "Interesado",
  ready_to_book: "Listo para agendar",
  booked: "Agendado",
  attended: "Atendido",
  recovered: "Recuperado",
  requires_human: "Requiere humano",
  lost: "Perdido",
};

function groupOpportunitiesByReason(items: Opportunity[]): MetricBreakdownItem[] {
  const map = new Map<string, number>();
  for (const o of items) {
    map.set(o.reason, (map.get(o.reason) ?? 0) + o.estimatedValue);
  }
  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value, format: "money" as const }))
    .sort((a, b) => b.value - a.value);
}

function groupOpportunitiesByStatus(items: Opportunity[]): MetricBreakdownItem[] {
  const map = new Map<string, number>();
  for (const o of items) {
    const k = STATUS_REASON[o.status] ?? o.status;
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value, format: "count" as const }))
    .sort((a, b) => b.value - a.value);
}

function groupConvosByBranch(items: Conversation[]): MetricBreakdownItem[] {
  const map = new Map<string, number>();
  for (const c of items) {
    map.set(c.branch, (map.get(c.branch) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value, format: "count" as const }))
    .sort((a, b) => b.value - a.value);
}

function oppToRow(o: Opportunity): MetricPatientRow {
  return {
    id: o.id,
    patient: o.patient,
    reason: o.reason,
    value: o.estimatedValue,
    date: o.lastContact,
    link: { to: "/oportunidades" },
  };
}

function convoToRow(c: Conversation): MetricPatientRow {
  return {
    id: c.id,
    patient: c.patientName,
    reason: c.opportunityType,
    value: c.estimatedValue,
    date: c.lastContact,
    campaign: c.campaign,
    link: { to: "/conversaciones", search: { id: c.id } },
  };
}

export function getMetricDetail(id: string): MetricDetail | null {
  switch (id) {
    case "ingresos-recuperados": {
      const recovered = opportunities.filter((o) => o.status === "recovered");
      // Para enriquecer el listado del demo, agregamos también las conversaciones marcadas como "ready_to_book" + los recovered de opps.
      const extra = conversations.filter((c) => ["ready_to_book"].includes(c.status)).slice(0, 4);
      return {
        id: "ingresos-recuperados",
        label: "Ingresos recuperados · este mes",
        description:
          "Suma de las cotizaciones efectivamente cerradas y atendidas durante el mes en curso, gracias a la recuperación por WhatsApp.",
        displayValue: formatCLP(kpis.recoveredRevenue),
        delta: "+18% vs. mes anterior",
        deltaTone: "success",
        tone: "primary",
        series: monthlyRevenue.map((m) => ({ label: m.month, value: m.value })),
        seriesLabel: "Evolución mensual",
        breakdown: [
          { label: "Cotizaciones pendientes cerradas", value: 4200000, format: "money" },
          { label: "No asistieron recuperados", value: 1850000, format: "money" },
          { label: "Reactivación de inactivos", value: 1500000, format: "money" },
          { label: "Controles y mantenimientos", value: 900000, format: "money" },
        ],
        breakdownTitle: "Composición por origen",
        patients: [...recovered.map(oppToRow), ...extra.map(convoToRow)],
        patientsTitle: "Clientes recuperados",
        patientValueColumn: "Monto cobrado",
      };
    }
    case "oportunidades-abiertas": {
      const open = opportunities.filter((o) => !["recovered", "lost"].includes(o.status));
      return {
        id: "oportunidades-abiertas",
        label: "Oportunidades abiertas",
        description:
          "Suma del valor potencial de todas las oportunidades activas en el pipeline: cotizaciones pendientes, clientes inactivos, leads interesados, etc.",
        displayValue: formatCLP(open.reduce((s, o) => s + o.estimatedValue, 0)),
        delta: "+$1.4M esta semana",
        deltaTone: "success",
        tone: "primary",
        series: kpiSparklines.openOpportunities.map((p, i) => ({
          label: `Sem ${i + 1}`,
          value: p.v * 1_000_000,
        })),
        seriesLabel: "Evolución últimas 8 semanas",
        breakdown: groupOpportunitiesByReason(open),
        breakdownTitle: "Composición por motivo",
        patients: open.map(oppToRow),
        patientsTitle: `Oportunidades activas (${open.length})`,
        patientValueColumn: "Valor estimado",
      };
    }
    case "citas-generadas": {
      const booked = conversations.filter((c) =>
        ["ready_to_book", "ai_responding"].includes(c.status),
      );
      return {
        id: "citas-generadas",
        label: "Citas generadas por IA",
        description:
          "Conversaciones donde la IA logró agendar o dejar lista para agendar una cita en el Sistema de gestión durante el período.",
        displayValue: formatNumber(kpis.appointmentsCreated),
        delta: "+24 esta semana",
        deltaTone: "success",
        tone: "primary",
        series: weeklyRevenue.slice(-8).map((w, i) => ({
          label: w.week,
          value: 12 + i * 2 + Math.round(Math.sin(i) * 3),
        })),
        seriesLabel: "Citas por semana",
        breakdown: groupConvosByBranch(booked.length ? booked : conversations),
        breakdownTitle: "Composición por sucursal",
        patients: (booked.length ? booked : conversations.slice(0, 6)).map(convoToRow),
        patientsTitle: "Conversaciones con cita agendada",
        patientValueColumn: "Valor cita",
      };
    }
    case "clientes-reactivados": {
      const reactivated = conversations.filter((c) =>
        ["follow_up_pending", "ai_responding", "ready_to_book"].includes(c.status),
      );
      return {
        id: "clientes-reactivados",
        label: "Clientes reactivados",
        description:
          "Clientes inactivos que respondieron a una campaña de reactivación y volvieron a interactuar con la clínica.",
        displayValue: formatNumber(kpis.reactivatedPatients),
        delta: "+9 esta semana",
        deltaTone: "success",
        tone: "info",
        series: kpiSparklines.reactivatedPatients.map((p, i) => ({
          label: `Sem ${i + 1}`,
          value: p.v,
        })),
        seriesLabel: "Reactivados por semana",
        breakdown: [
          { label: "Inactivos 3-6 meses", value: 18, format: "count" },
          { label: "Inactivos 6-12 meses", value: 14, format: "count" },
          { label: "Inactivos > 12 meses", value: 10, format: "count" },
        ],
        breakdownTitle: "Por tiempo de inactividad",
        patients: reactivated.map(convoToRow),
        patientsTitle: "Clientes que respondieron",
        patientValueColumn: "Valor potencial",
      };
    }
    case "conversaciones-humano": {
      const humans = conversations.filter(
        (c) => c.badges.includes("requires_human") || c.status === "angry_patient",
      );
      return {
        id: "conversaciones-humano",
        label: "Conversaciones que requieren humano",
        description:
          "Conversaciones donde la IA detectó una situación que necesita intervención de recepción para no perder la oportunidad o resolver un reclamo.",
        displayValue: formatNumber(kpis.conversationsRequireHuman),
        delta: "Acción recomendada",
        deltaTone: "destructive",
        tone: "destructive",
        series: kpiSparklines.conversationsRequireHuman.map((p, i) => ({
          label: `Sem ${i + 1}`,
          value: p.v,
        })),
        seriesLabel: "Derivaciones por semana",
        breakdown: derivationReasons.map((r) => ({
          label: r.reason,
          value: r.count,
          format: "count" as const,
        })),
        breakdownTitle: "Motivos de derivación",
        patients: humans.map(convoToRow),
        patientsTitle: "Conversaciones pendientes de atención",
        patientValueColumn: "Valor en juego",
      };
    }
    default:
      return null;
  }
}

/** Para evitar la dependencia circular del funnel sin uso */
export const _funnel = funnel;
