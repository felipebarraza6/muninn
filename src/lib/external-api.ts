export const AUTH_TYPE_LABEL: Record<string, string> = {
  none: "Abierta (sin auth)",
  api_key: "API Key",
  bearer: "Bearer Token",
  oauth2: "Token estático (Bearer)",
  basic: "Basic Auth",
  endpoint_auth: "Login (obtener token)",
};

export const AUTH_TYPE_HINT: Record<string, string> = {
  none: "Sin autenticación. Solo default_headers si los defines.",
  api_key:
    "Clave fija de la integración (se guarda aquí). Se envía en un header (por defecto X-API-Key).",
  bearer: "Token fijo guardado aquí → Authorization: Bearer …",
  oauth2: "Access token estático ya obtenido (sin flujo OAuth automático).",
  basic: "Usuario y contraseña fijos de la integración → Authorization: Basic.",
  endpoint_auth:
    "Define el flujo: endpoint de login + dónde sale el token + prefijo (Bearer/Token). Cada owner conecta su cuenta en «Mi cuenta»; las skills reutilizan esa sesión sin pedir usuario/clave como parámetros.",
};

/** Prefijo del header Authorization tras login (endpoint_auth). */
export const AUTH_HEADER_PREFIX_OPTIONS = [
  { value: "Bearer", label: "Bearer (JWT / OAuth)" },
  { value: "Token", label: "Token (DRF / API key hex)" },
] as const;

export const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"] as const;

export function prettyJson(value: unknown, fallback = "{}"): string {
  if (value == null) return fallback;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return fallback;
  }
}

export function parseJsonObject(
  raw: string,
  label = "JSON",
): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: true, value: {} };
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false, error: `${label} debe ser un objeto { … }` };
    }
    return { ok: true, value: parsed as Record<string, unknown> };
  } catch {
    return { ok: false, error: `${label} inválido` };
  }
}

export function formatTestResultToast(result: {
  success?: boolean;
  status_code?: number;
  latency_ms?: number;
  error?: string | null;
  detail?: string;
}): { ok: boolean; message: string } {
  if (result.success) {
    const parts = ["Conexión OK"];
    if (result.status_code != null) parts.push(`HTTP ${result.status_code}`);
    if (result.latency_ms != null) parts.push(`${result.latency_ms} ms`);
    return { ok: true, message: parts.join(" · ") };
  }
  const err =
    result.error ||
    result.detail ||
    (result.status_code != null ? `HTTP ${result.status_code}` : "Test falló");
  return { ok: false, message: String(err) };
}
