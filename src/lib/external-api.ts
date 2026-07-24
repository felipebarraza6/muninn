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
    "Clave fija de la integración. Por sucursal se configura en Instalación (cuenta de servicio).",
  bearer: "Token fijo → Authorization: Bearer …. Por sucursal en Instalación.",
  oauth2:
    "Access token estático ya obtenido (sin flujo OAuth automático). Por sucursal en Instalación.",
  basic: "Usuario y contraseña → Authorization: Basic. Por sucursal en Instalación.",
  endpoint_auth:
    "Define el flujo: endpoint de login + dónde sale el token + prefijo (Bearer/Token). La cuenta de la instalación (por sucursal) es la que usan los agentes; «Cuenta de prueba» solo sirve para Studio / Probar.",
};

/** Prefijo del header Authorization tras login (endpoint_auth). */
export const AUTH_HEADER_PREFIX_OPTIONS = [
  { value: "Bearer", label: "Bearer (JWT / OAuth)" },
  { value: "Token", label: "Token (DRF / API key hex)" },
] as const;

export type CredentialFieldDef = {
  name: string;
  type?: string;
  format?: string | null;
  required?: boolean;
  label?: string;
  hint?: string;
};

/**
 * Auth que necesita credenciales por instalación / cuenta de prueba
 * (no solo metadatos del catálogo).
 */
export function needsPerInstallationCredentials(
  authType?: string | null,
  hints?: { authEndpointKey?: string | null },
): boolean {
  if (hints?.authEndpointKey && String(hints.authEndpointKey).trim()) return true;
  const t = String(authType || "none")
    .toLowerCase()
    .trim();
  return t !== "" && t !== "none";
}

/**
 * Mostrar «Conectar cuenta» en Instalación aunque el catálogo diga `none`
 * (apps con endpoints suelen necesitar API key; ej. Nubox tipada como abierta).
 */
export function canOfferInstallationCredentials(api: {
  auth_type?: string | null;
  auth_endpoint_key?: string | null;
  endpoints?: Record<string, unknown> | null;
}): boolean {
  if (
    needsPerInstallationCredentials(api.auth_type, {
      authEndpointKey: api.auth_endpoint_key,
    })
  ) {
    return true;
  }
  const n = api.endpoints ? Object.keys(api.endpoints).length : 0;
  return n > 0;
}

/** Campos por defecto si el backend no devuelve credential-fields. */
export function defaultCredentialFields(authType?: string | null): CredentialFieldDef[] {
  const t = String(authType || "none")
    .toLowerCase()
    .trim();
  switch (t) {
    case "api_key":
      return [
        {
          name: "api_key",
          type: "string",
          format: "password",
          required: true,
          label: "API Key",
          hint: "Pega la clave que te dio el proveedor.",
        },
      ];
    case "bearer":
    case "oauth2":
      return [
        {
          name: "token",
          type: "string",
          format: "password",
          required: true,
          label: "Bearer token",
          hint: "Access token completo (sin el prefijo Bearer).",
        },
      ];
    case "basic":
      return [
        {
          name: "username",
          type: "string",
          required: true,
          label: "Usuario",
        },
        {
          name: "password",
          type: "string",
          format: "password",
          required: true,
          label: "Contraseña",
        },
      ];
    case "endpoint_auth":
      return [
        {
          name: "email",
          type: "string",
          format: "email",
          required: true,
          label: "Email / usuario",
        },
        {
          name: "password",
          type: "string",
          format: "password",
          required: true,
          label: "Contraseña",
        },
      ];
    case "none":
    default:
      return [
        {
          name: "api_key",
          type: "string",
          format: "password",
          required: true,
          label: "API Key / token",
          hint: "Pega la clave o token del proveedor. Si usa login con usuario/clave, cambia Auth a «Login» en Configuración.",
        },
        {
          name: "token",
          type: "string",
          format: "password",
          required: false,
          label: "Token extra (opcional)",
          hint: "Solo si el proveedor pide un segundo secreto.",
        },
      ];
  }
}

/**
 * Une fields del API con fallback por auth_type.
 * Si el backend responde vacío, usa defaults tipados (Nubox api_key, etc.).
 * Si solo viene `company_api_key` (Nubox), exige también el token Bearer del partner.
 */
export function resolveCredentialFields(
  authType: string | null | undefined,
  fromApi?: CredentialFieldDef[] | null,
  hints?: { baseUrl?: string | null; name?: string | null },
): CredentialFieldDef[] {
  let fields: CredentialFieldDef[];
  if (Array.isArray(fromApi) && fromApi.length > 0) {
    fields = fromApi.map((f) => ({
      ...f,
      label: f.label || f.name.replace(/[_-]+/g, " "),
    }));
  } else {
    fields = defaultCredentialFields(authType);
  }

  const names = new Set(fields.map((f) => f.name.toLowerCase()));
  const looksNubox = /nubox/i.test(`${hints?.baseUrl || ""} ${hints?.name || ""}`);
  const hasCompanyKey = names.has("company_api_key");
  const hasPartner =
    names.has("partner_token") ||
    names.has("token") ||
    names.has("authorization") ||
    names.has("bearer") ||
    names.has("partner_key");

  if (hasCompanyKey && !hasPartner) {
    fields = [
      {
        name: "partner_token",
        type: "string",
        format: "password",
        required: true,
        label: "Token del partner (Bearer)",
        hint: "Header Authorization: Bearer … — secret del integrador Nubox.",
      },
      ...fields.map((f) =>
        f.name.toLowerCase() === "company_api_key"
          ? {
              ...f,
              required: true,
              label: f.label || "API Key de la empresa",
              hint: f.hint || "Header X-Api-Key de la compañía cliente en Nubox.",
            }
          : f,
      ),
    ];
  } else if (looksNubox && fields.length <= 2 && !hasCompanyKey) {
    // Catálogo sin fields: guía dual típica de Nubox Pyme.
    fields = [
      {
        name: "partner_token",
        type: "string",
        format: "password",
        required: true,
        label: "Token del partner (Bearer)",
        hint: "Authorization: Bearer …",
      },
      {
        name: "company_api_key",
        type: "string",
        format: "password",
        required: true,
        label: "API Key de la empresa (X-Api-Key)",
        hint: "Header X-Api-Key de la compañía.",
      },
    ];
  }

  return fields;
}

export const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"] as const;

export { prettyJson } from "@/lib/json";

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

/** Body de endpoint: objeto `{…}` o array `[…]`. */
export function parseJsonObjectOrArray(
  raw: string,
  label = "JSON",
): { ok: true; value: Record<string, unknown> | unknown[] } | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: true, value: {} };
  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (Array.isArray(parsed)) return { ok: true, value: parsed };
    if (parsed && typeof parsed === "object") {
      return { ok: true, value: parsed as Record<string, unknown> };
    }
    return { ok: false, error: `${label} debe ser un objeto { … } o un array [ … ]` };
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
  tested?: {
    mode?: string;
    endpoint?: string;
    method?: string;
    path?: string;
    base_url?: string;
    installation_label?: string | null;
  };
  auth?: { success?: boolean; error?: string | null };
}): { ok: boolean; message: string } {
  const tested = result.tested;
  const modeHint =
    tested?.mode === "health" || tested?.mode === "login"
      ? `${tested.mode === "health" ? "health" : "login"} «${tested.endpoint || "auth"}»`
      : tested?.mode === "base_url"
        ? `GET ${tested.base_url || "base_url"}`
        : null;

  if (result.success) {
    const parts = [modeHint ? `OK · ${modeHint}` : "Conexión OK"];
    if (tested?.installation_label) parts.push(tested.installation_label);
    if (result.status_code != null) parts.push(`HTTP ${result.status_code}`);
    if (result.latency_ms != null) parts.push(`${result.latency_ms} ms`);
    return { ok: true, message: parts.join(" · ") };
  }
  const err =
    result.error ||
    result.detail ||
    result.auth?.error ||
    (result.status_code != null ? `HTTP ${result.status_code}` : "Test falló");
  const prefix = modeHint ? `${modeHint}: ` : "";
  return { ok: false, message: `${prefix}${err}` };
}
