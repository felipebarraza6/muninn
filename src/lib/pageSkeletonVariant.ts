export type PageSkeletonVariant =
  | "table"
  | "tableFilters"
  | "cards"
  | "split"
  | "inbox"
  | "workspace"
  | "catalog"
  | "canvas"
  | "detail"
  | "studio"
  | "profile"
  | "chat"
  | "dashboard"
  | "list"
  | "neutral";

/**
 * Elige el skeleton que corresponde a la ruta (Suspense / transición).
 * Evita mostrar "barras neutras" o inbox en chat/planes/canvas.
 */
export function resolvePageSkeletonVariant(pathname: string): PageSkeletonVariant {
  const p = pathname.replace(/\/+$/, "") || "/";

  if (p === "/chat" || /^\/agentes\/[^/]+\/chat$/.test(p) || /^\/embed\/chat\//.test(p)) {
    return "chat";
  }
  if (p.startsWith("/conversaciones")) return "inbox";
  if (p.startsWith("/planes")) return "workspace";
  if (/^\/workflows\/[^/]+$/.test(p)) return "canvas";
  if (p.startsWith("/workflows")) return "catalog";
  if (/^\/agentes\/[^/]+$/.test(p) || /^\/skills\/[^/]+$/.test(p)) return "studio";
  if (p === "/agentes" || p === "/skills" || p === "/canales" || p.startsWith("/apps")) {
    return "cards";
  }
  if (p.startsWith("/apis")) return "cards";
  if (p.startsWith("/conocimiento")) return "list";
  if (p === "/perfil") return "profile";
  if (p.startsWith("/admin/llm")) return "split";
  if (p.startsWith("/admin/usuarios")) return "tableFilters";
  if (p.startsWith("/admin")) return "table";
  if (p === "/") return "dashboard";
  return "neutral";
}
