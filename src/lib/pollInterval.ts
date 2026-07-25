/**
 * Helpers de polling para TanStack Query.
 * Preferir intervalos cortos solo cuando hay trabajo vivo; nunca en background.
 */

/** Estados que justifican poll agresivo en work plans / items. */
export function isWorkPlanLiveStatus(status?: string | null): boolean {
  const s = (status || "").toLowerCase();
  return s === "running" || s === "queued" || s === "pending";
}

/** Conversación de canal que espera humano o está muy activa. */
export function isConversationLive(c: {
  is_waiting_human?: boolean;
  status?: string;
  display_status?: string;
}): boolean {
  if (c.is_waiting_human) return true;
  const s = (c.status || c.display_status || "").toLowerCase();
  return s === "waiting_human" || s === "active" || s === "ai_responding";
}

export const POLL = {
  /** Lista con ítems vivos */
  live: 3_000,
  /** Lista en reposo */
  idle: 20_000,
  /** Mensajes de hilo abierto con actividad */
  messagesLive: 5_000,
  /** Mensajes sin actividad urgente */
  messagesIdle: 15_000,
  /** Detalle de plan/ejecución running */
  detailLive: 3_000,
  /** Detalle en reposo */
  detailIdle: 20_000,
} as const;
