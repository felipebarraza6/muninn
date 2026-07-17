/** URL pública de ingreso al portal (sin tecnicismos en la UI). */

export type PortalAccessSource = "domain" | "org-domain" | "slug" | "app";

export type PortalAccessResult = {
  /** URL lista para abrir / copiar */
  url: string;
  source: PortalAccessSource;
};

/** Host limpio: sin protocolo ni path. */
export function normalizePortalHost(domain: string | null | undefined): string {
  if (!domain?.trim()) return "";
  let host = domain
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "")
    .replace(/\.$/, "")
    .toLowerCase();
  // Quitar userinfo si pegaron algo raro
  host = host.replace(/^[^@]+@/, "");
  // Debe parecer un dominio (tiene al menos un punto)
  if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/.test(host)) {
    return "";
  }
  return host;
}

export function getAppOrigin(): string {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

/**
 * Prioridad del link de acceso:
 * 1. Dominio propio (sucursal u org según contexto)
 * 2. Dominio de la organización (solo sucursal)
 * 3. Nombre corto → {origen}/login/{slug}
 * 4. Raíz de la app → {origen}/login
 */
export function buildPortalAccessUrl(opts: {
  customDomain?: string | null;
  organizationDomain?: string | null;
  loginSlug?: string | null;
}): PortalAccessResult {
  const ownHost = normalizePortalHost(opts.customDomain);
  if (ownHost) {
    return { url: `https://${ownHost}/login`, source: "domain" };
  }

  const orgHost = normalizePortalHost(opts.organizationDomain);
  if (orgHost) {
    return { url: `https://${orgHost}/login`, source: "org-domain" };
  }

  const origin = getAppOrigin();
  const slug = opts.loginSlug?.trim();
  if (slug) {
    return {
      url: `${origin}/login/${encodeURIComponent(slug)}`,
      source: "slug",
    };
  }

  return { url: `${origin}/login`, source: "app" };
}

export function portalAccessHint(source: PortalAccessSource): string {
  switch (source) {
    case "domain":
      return "Entra por el dominio propio.";
    case "org-domain":
      return "Entra por el dominio de la organización.";
    case "slug":
      return "Entra con el nombre corto en esta app.";
    default:
      return "Ingreso general de la app (sin nombre corto ni dominio).";
  }
}
