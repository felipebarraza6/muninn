/** Mensaje usable en toasts desde errores Axios (interceptor setea friendlyMessage). */
export function apiErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "friendlyMessage" in error) {
    const msg = (error as { friendlyMessage?: unknown }).friendlyMessage;
    if (typeof msg === "string" && msg.trim()) return msg.trim();
  }
  if (error instanceof Error && error.message.trim()) {
    // Evitar ruido técnico de Axios ("Request failed with status code 400").
    if (!/^request failed with status code/i.test(error.message)) {
      return error.message.trim();
    }
  }
  return fallback;
}

/** Status HTTP si el error viene de Axios; null si es red / desconocido. */
export function apiErrorStatus(error: unknown): number | null {
  if (!error || typeof error !== "object") return null;
  const resp = (error as { response?: { status?: number } }).response;
  const status = resp?.status;
  return typeof status === "number" ? status : null;
}

/** Cuerpo útil del error (detail / message) para pantallas de diagnóstico. */
export function apiErrorDetail(error: unknown): string {
  if (!error || typeof error !== "object") return "";
  const withFriendly = error as { friendlyMessage?: string };
  if (typeof withFriendly.friendlyMessage === "string" && withFriendly.friendlyMessage.trim()) {
    return withFriendly.friendlyMessage.trim();
  }
  const data = (error as { response?: { data?: unknown } }).response?.data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    if (typeof d.detail === "string" && d.detail.trim()) return d.detail.trim();
    if (typeof d.message === "string" && d.message.trim()) return d.message.trim();
    if (typeof d.error === "string" && d.error.trim()) return d.error.trim();
  }
  const msg = (error as { message?: string }).message;
  if (typeof msg === "string" && msg.trim() && !/^request failed with status code/i.test(msg)) {
    return msg.trim();
  }
  if (!(error as { response?: unknown }).response) {
    return "Sin respuesta del servidor (red, proxy o API caída).";
  }
  return "";
}
