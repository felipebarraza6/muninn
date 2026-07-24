import type { StatusTone } from "@/components/ui/status-chip";

export const PLAN_STATUS_LABEL: Record<string, string> = {
  draft: "Borrador",
  scheduled: "Programado",
  ready: "Listo",
  queued: "En cola",
  running: "En curso",
  completed: "Completado",
  failed: "Fallido",
  cancelled: "Cancelado",
  paused: "Pausado",
};

export const ITEM_STATUS_LABEL: Record<string, string> = {
  pending: "Pendiente",
  queued: "En cola",
  running: "Ejecutando",
  done: "Hecha",
  completed: "Hecha",
  failed: "Fallida",
  skipped: "Omitida",
  cancelled: "Cancelada",
};

export function planStatusLabel(status?: string | null): string {
  if (!status) return "—";
  return PLAN_STATUS_LABEL[status] || status;
}

export function itemStatusLabel(status?: string | null): string {
  if (!status) return "—";
  return ITEM_STATUS_LABEL[status] || status;
}

/** Mapea status de plan/item a tono del StatusChip. */
export function workPlanStatusTone(status?: string | null): StatusTone {
  const s = String(status || "").toLowerCase();
  if (s === "failed" || s === "cancelled" || s.includes("error")) return "failed";
  if (s === "running" || s === "processing" || s === "in_progress") return "running";
  if (s === "completed" || s === "done" || s === "ready" || s === "ok") return "success";
  if (s === "pending" || s === "queued" || s === "scheduled" || s === "draft") return "pending";
  if (s === "skipped" || s === "paused") return "skipped";
  return "idle";
}
