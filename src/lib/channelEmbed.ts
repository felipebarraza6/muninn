/**
 * URLs del chat embebido de canales web (web_embed / web_socket).
 * Por defecto usa esta misma app (Muninn) para no depender de un host externo.
 */

function trimSlash(url: string) {
  return url.replace(/\/+$/, "");
}

/** Origen de la app actual (preview y link interno). */
export function getAppOrigin(): string {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

/**
 * Base pública del widget.
 * `VITE_WIDGET_BASE_URL` opcional (CDN / dominio de clientes);
 * si no hay, esta misma app.
 */
export function getWidgetBaseUrl(): string {
  const configured = (import.meta.env.VITE_WIDGET_BASE_URL as string | undefined)?.trim();
  if (configured) return trimSlash(configured);
  return trimSlash(getAppOrigin());
}

export function getEmbedPath(channelId: string | number): string {
  return `/embed/chat/${channelId}`;
}

/** URL absoluta para compartir / iframe en sitios externos. */
export function getEmbedUrl(channelId: string | number): string {
  return `${getWidgetBaseUrl()}${getEmbedPath(channelId)}`;
}

/** URL same-origin para preview dentro de Muninn. */
export function getInAppEmbedUrl(channelId: string | number): string {
  return `${trimSlash(getAppOrigin())}${getEmbedPath(channelId)}`;
}

export function getIframeCode(channelId: string | number): string {
  const url = getEmbedUrl(channelId);
  return `<iframe\n  src="${url}"\n  width="100%"\n  height="600"\n  style="border:none;border-radius:12px;"\n  title="Chat"\n  allow="clipboard-write">\n</iframe>`;
}

/**
 * Snippet de una línea: burbuja flotante (widget.js) para montar en cualquier web.
 */
export function getWidgetScriptCode(channelId: string | number): string {
  const base = getWidgetBaseUrl();
  return `<script src="${base}/widget.js" data-channel-id="${channelId}" async></script>`;
}
