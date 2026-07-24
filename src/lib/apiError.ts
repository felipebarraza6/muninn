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
