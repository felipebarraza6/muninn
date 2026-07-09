import { opportunities, type Opportunity, type OpportunityStatus } from "@/lib/mock-data";

export type Priority = "high" | "medium" | "low";
export type Bucket = "todo" | "ai_managed" | "booked" | "recovered" | "lost";

export const CURRENT_USER = "Camila R.";

export const PRIORITY_LABEL: Record<Priority, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

export const PRIORITY_TONE: Record<Priority, string> = {
  high: "bg-destructive-soft text-destructive border-destructive/30",
  medium: "bg-warning-soft text-warning border-warning/30",
  low: "bg-muted text-muted-foreground border-border",
};

export const PRIORITY_DOT: Record<Priority, string> = {
  high: "bg-destructive",
  medium: "bg-warning",
  low: "bg-muted-foreground/40",
};

/** Anillo suave para acompañar al dot de prioridad. */
export const PRIORITY_RING: Record<Priority, string> = {
  high: "ring-destructive/25",
  medium: "ring-warning/30",
  low: "ring-muted-foreground/15",
};

/** Tonos semánticos para el chip de estado de la oportunidad. */
export const STATUS_TONE: Record<OpportunityStatus, string> = {
  new: "bg-muted text-muted-foreground border-border",
  contacted: "bg-muted text-muted-foreground border-border",
  responded: "bg-primary-soft text-primary border-primary/20",
  interested: "bg-info-soft text-info border-info/20",
  ready_to_book: "bg-success-soft text-success border-success/25",
  booked: "bg-success-soft text-success border-success/25",
  attended: "bg-success-soft text-success border-success/25",
  recovered: "bg-success-soft text-success border-success/25",
  requires_human: "bg-destructive-soft text-destructive border-destructive/25",
  lost: "bg-muted text-muted-foreground border-border",
};

export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const BUCKET_LABEL: Record<Bucket, string> = {
  todo: "Por hacer",
  ai_managed: "Gestionando IA",
  booked: "Agendadas",
  recovered: "Recuperadas",
  lost: "Perdidas",
};

/** Calcula prioridad según las reglas del producto. */
export function getPriority(o: Opportunity): Priority {
  if (o.status === "recovered" || o.status === "lost") return "low";

  // Alta
  if (o.status === "ready_to_book") return "high";
  if (o.status === "requires_human") return "high";
  if ((o.status === "interested" || o.status === "responded") && o.estimatedValue >= 400000) {
    return "high";
  }
  if (o.estimatedValue >= 800000 && o.hoursSinceContact >= 24) return "high";

  // Media
  if (o.status === "interested" && o.estimatedValue >= 150000) return "medium";
  if (o.status === "responded") return "medium";
  if (o.status === "booked") return "medium";

  // Baja por defecto
  return "low";
}

/**
 * Clasifica una oportunidad en su bandeja.
 *
 * Filosofía: "Por hacer" = solo lo que requiere acción humana.
 * Si la IA está al mando y avanzando dentro de los umbrales conservadores,
 * la oportunidad va a "Gestionando IA" (solo lectura).
 */
export function getBucket(o: Opportunity, currentUser = CURRENT_USER): Bucket {
  if (o.status === "recovered") return "recovered";
  if (o.status === "lost") return "lost";
  if (o.status === "booked" || o.status === "attended") return "booked";

  // Reglas que llevan a "Por hacer" (humano)
  if (o.status === "requires_human") return "todo";
  if (o.status === "ready_to_book") return "todo";
  if (o.responsible !== "IA" && o.responsible !== currentUser) {
    // asignada a otra persona — mostrar igual en "Por hacer" si está activa
    return "todo";
  }
  if (o.responsible === currentUser) return "todo";

  // Escalamiento por presupuesto alto parado (>$500k, >24h sin contacto)
  if (o.estimatedValue > 500000 && o.hoursSinceContact >= 24) return "todo";

  // Lead muy antiguo sin avance
  if (o.ageDays > 30 && (o.status === "contacted" || o.status === "responded")) {
    return "todo";
  }

  // Resto: la IA lo gestiona
  return "ai_managed";
}

export type PrimaryActionKind =
  | "schedule"
  | "take_control"
  | "send_followup"
  | "first_contact"
  | "send_reminder"
  | "mark_recovered";

export interface PrimaryAction {
  kind: PrimaryActionKind;
  label: string;
}

/** Acción principal sugerida según el estado. */
export function getPrimaryAction(o: Opportunity): PrimaryAction {
  switch (o.status) {
    case "ready_to_book":
      return { kind: "schedule", label: "Agendar" };
    case "requires_human":
      return { kind: "take_control", label: "Tomar control" };
    case "new":
      return { kind: "first_contact", label: "Iniciar contacto" };
    case "booked":
      return { kind: "send_reminder", label: "Enviar recordatorio" };
    case "attended":
      return { kind: "mark_recovered", label: "Marcar recuperada" };
    case "interested":
    case "responded":
    case "contacted":
    default:
      return { kind: "send_followup", label: "Enviar seguimiento" };
  }
}

/** Ordena oportunidades: prioridad desc → valor desc. */
export function sortByPriority(items: Opportunity[]): Opportunity[] {
  return [...items].sort((a, b) => {
    const pa = PRIORITY_ORDER[getPriority(a)];
    const pb = PRIORITY_ORDER[getPriority(b)];
    if (pa !== pb) return pa - pb;
    return b.estimatedValue - a.estimatedValue;
  });
}

/** Suma de valor de oportunidades abiertas (no cerradas/perdidas). */
export function getOpenValue(items: Opportunity[] = opportunities): number {
  return items
    .filter((o) => o.status !== "recovered" && o.status !== "lost")
    .reduce((s, o) => s + o.estimatedValue, 0);
}

export function isOpen(status: OpportunityStatus): boolean {
  return status !== "recovered" && status !== "lost";
}

// ───────── Filtro por antigüedad ─────────

export type AgeFilter = "all" | "today" | "week" | "month" | "older";

export const AGE_LABEL: Record<AgeFilter, string> = {
  all: "Cualquier antigüedad",
  today: "Hoy",
  week: "Esta semana",
  month: "Este mes",
  older: "Más de un mes",
};

export function matchesAge(o: Opportunity, age: AgeFilter): boolean {
  if (age === "all") return true;
  const d = o.ageDays;
  if (age === "today") return d === 0;
  if (age === "week") return d <= 7;
  if (age === "month") return d <= 30;
  if (age === "older") return d > 30;
  return true;
}

/** Etiqueta corta de antigüedad para mostrar en filas. */
export function ageLabel(o: Opportunity): string | null {
  const d = o.ageDays;
  if (d <= 0) return null;
  if (d === 1) return "Generada hace 1 día";
  if (d < 30) return `Generada hace ${d}d`;
  const months = Math.round(d / 30);
  return months === 1 ? "Generada hace 1 mes" : `Generada hace ${months} meses`;
}

// ───────── Sugerencia de follow-up (mock contextual) ─────────

/**
 * Genera un mensaje de seguimiento sugerido por la IA, basado en el motivo
 * de la oportunidad y la próxima acción registrada. Es un mock — en el futuro
 * se reemplaza por una llamada al modelo con el historial real.
 */
export function generateFollowUpSuggestion(o: Opportunity): string {
  const firstName = o.patient.split(" ")[0];
  const reason = o.reason.toLowerCase();

  if (reason.includes("cotización") || reason.includes("presupuesto")) {
    return `Hola ${firstName}, ¿pudiste revisar la cotización que te enviamos? Si tienes dudas sobre el financiamiento o las opciones de pago puedo aclararlas. ¿Te coordino una evaluación esta semana?`;
  }
  if (reason.includes("inactiv") || reason.includes("lead antiguo")) {
    return `Hola ${firstName}, ha pasado un tiempo desde tu última visita. Tenemos disponibilidad esta semana para un control rápido. ¿Te gustaría coordinar una hora?`;
  }
  if (reason.includes("no asistió") || reason.includes("reagendam")) {
    return `Hola ${firstName}, vimos que no pudiste asistir a tu última hora. ¿Te ayudo a reagendar? Tenemos cupos disponibles esta semana.`;
  }
  if (reason.includes("control")) {
    return `Hola ${firstName}, te queda pendiente tu control. ¿Te coordino una hora esta semana? Tenemos disponibilidad en mañana y tarde.`;
  }
  if (reason.includes("limpieza") || reason.includes("mantenimiento")) {
    return `Hola ${firstName}, tu mantenimiento preventivo está pendiente. ¿Te agendo una hora esta semana?`;
  }
  if (reason.includes("reclamo")) {
    return `Hola ${firstName}, lamento la situación. Quiero llamarte para entender mejor lo ocurrido y resolverlo. ¿En qué horario te acomoda?`;
  }
  // Genérico
  return `Hola ${firstName}, te escribo para hacer seguimiento. ${o.nextAction}. ¿Cómo podemos avanzar?`;
}
