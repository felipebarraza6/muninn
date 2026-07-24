/**
 * Rutas de trabajo donde la shell (sidebar + header app) se oculta
 * para maximizar inmersión (chat Studio, bandeja, chat legacy de agente).
 */
export function isImmersiveWorkspacePath(pathname: string): boolean {
  if (pathname === "/chat" || pathname.startsWith("/chat/")) return true;
  if (pathname === "/conversaciones" || pathname.startsWith("/conversaciones/")) return true;
  if (pathname === "/planes" || pathname.startsWith("/planes/")) return true;
  if (pathname === "/workflows" || pathname.startsWith("/workflows/")) return true;
  // /agentes/:id/chat
  if (/^\/agentes\/[^/]+\/chat\/?$/.test(pathname)) return true;
  return false;
}
