/**
 * Rutas de trabajo donde la shell (sidebar + header app) se oculta
 * para maximizar inmersión (chat Studio, bandeja, chat legacy de agente).
 */
export function isImmersiveWorkspacePath(pathname: string): boolean {
  const p = pathname.replace(/^\/app\/?/, "/") || "/";
  if (p === "/chat" || p.startsWith("/chat/")) return true;
  if (p === "/conversaciones" || p.startsWith("/conversaciones/")) return true;
  if (p === "/planes" || p.startsWith("/planes/")) return true;
  if (p === "/workflows" || p.startsWith("/workflows/")) return true;
  if (/^\/agentes\/[^/]+\/chat\/?$/.test(p)) return true;
  return false;
}
