const d = {
    none: "Abierta (sin auth)",
    api_key: "API Key",
    bearer: "Bearer Token",
    oauth2: "Token estático (Bearer)",
    basic: "Basic Auth",
    endpoint_auth: "Login (obtener token)",
  },
  p = {
    none: "Sin autenticación. Solo default_headers si los defines.",
    api_key:
      "Clave fija de la integración. Por sucursal se configura en Instalación (cuenta de servicio).",
    bearer: "Token fijo → Authorization: Bearer …. Por sucursal en Instalación.",
    oauth2:
      "Access token estático ya obtenido (sin flujo OAuth automático). Por sucursal en Instalación.",
    basic: "Usuario y contraseña → Authorization: Basic. Por sucursal en Instalación.",
    endpoint_auth:
      "Define el flujo: endpoint de login + dónde sale el token + prefijo (Bearer/Token). La cuenta de la instalación (por sucursal) es la que usan los agentes; «Cuenta de prueba» solo sirve para Studio / Probar.",
  },
  m = [
    { value: "Bearer", label: "Bearer (JWT / OAuth)" },
    { value: "Token", label: "Token (DRF / API key hex)" },
  ];
function u(e, a) {
  if (a?.authEndpointKey && String(a.authEndpointKey).trim()) return !0;
  const t = String(e || "none")
    .toLowerCase()
    .trim();
  return t !== "" && t !== "none";
}
function h(e) {
  return u(e.auth_type, { authEndpointKey: e.auth_endpoint_key })
    ? !0
    : (e.endpoints ? Object.keys(e.endpoints).length : 0) > 0;
}
function c(e) {
  switch (
    String(e || "none")
      .toLowerCase()
      .trim()
  ) {
    case "api_key":
      return [
        {
          name: "api_key",
          type: "string",
          format: "password",
          required: !0,
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
          required: !0,
          label: "Bearer token",
          hint: "Access token completo (sin el prefijo Bearer).",
        },
      ];
    case "basic":
      return [
        { name: "username", type: "string", required: !0, label: "Usuario" },
        { name: "password", type: "string", format: "password", required: !0, label: "Contraseña" },
      ];
    case "endpoint_auth":
      return [
        { name: "email", type: "string", format: "email", required: !0, label: "Email / usuario" },
        { name: "password", type: "string", format: "password", required: !0, label: "Contraseña" },
      ];
    default:
      return [
        {
          name: "api_key",
          type: "string",
          format: "password",
          required: !0,
          label: "API Key / token",
          hint: "Pega la clave o token del proveedor. Si usa login con usuario/clave, cambia Auth a «Login» en Configuración.",
        },
        {
          name: "token",
          type: "string",
          format: "password",
          required: !1,
          label: "Token extra (opcional)",
          hint: "Solo si el proveedor pide un segundo secreto.",
        },
      ];
  }
}
function y(e, a, t) {
  let r;
  Array.isArray(a) && a.length > 0
    ? (r = a.map((n) => ({ ...n, label: n.label || n.name.replace(/[_-]+/g, " ") })))
    : (r = c(e));
  const o = new Set(r.map((n) => n.name.toLowerCase())),
    s = /nubox/i.test(`${t?.baseUrl || ""} ${t?.name || ""}`),
    i = o.has("company_api_key"),
    l =
      o.has("partner_token") ||
      o.has("token") ||
      o.has("authorization") ||
      o.has("bearer") ||
      o.has("partner_key");
  return (
    i && !l
      ? (r = [
          {
            name: "partner_token",
            type: "string",
            format: "password",
            required: !0,
            label: "Token del partner (Bearer)",
            hint: "Header Authorization: Bearer … — secret del integrador Nubox.",
          },
          ...r.map((n) =>
            n.name.toLowerCase() === "company_api_key"
              ? {
                  ...n,
                  required: !0,
                  label: n.label || "API Key de la empresa",
                  hint: n.hint || "Header X-Api-Key de la compañía cliente en Nubox.",
                }
              : n,
          ),
        ])
      : s &&
        r.length <= 2 &&
        !i &&
        (r = [
          {
            name: "partner_token",
            type: "string",
            format: "password",
            required: !0,
            label: "Token del partner (Bearer)",
            hint: "Authorization: Bearer …",
          },
          {
            name: "company_api_key",
            type: "string",
            format: "password",
            required: !0,
            label: "API Key de la empresa (X-Api-Key)",
            hint: "Header X-Api-Key de la compañía.",
          },
        ]),
    r
  );
}
const b = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"];
function _(e) {
  const a = e.tested,
    t =
      a?.mode === "health" || a?.mode === "login"
        ? `${a.mode === "health" ? "health" : "login"} «${a.endpoint || "auth"}»`
        : a?.mode === "base_url"
          ? `GET ${a.base_url || "base_url"}`
          : null;
  if (e.success) {
    const s = [t ? `OK · ${t}` : "Conexión OK"];
    return (
      a?.installation_label && s.push(a.installation_label),
      e.status_code != null && s.push(`HTTP ${e.status_code}`),
      e.latency_ms != null && s.push(`${e.latency_ms} ms`),
      { ok: !0, message: s.join(" · ") }
    );
  }
  const r =
    e.error ||
    e.detail ||
    e.auth?.error ||
    (e.status_code != null ? `HTTP ${e.status_code}` : "Test falló");
  return { ok: !1, message: `${t ? `${t}: ` : ""}${r}` };
}
export { d as A, b as H, p as a, m as b, h as c, _ as f, u as n, y as r };
