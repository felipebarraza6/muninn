import { useQuery } from "@tanstack/react-query";
import { GET } from "../client";
import { apiErrorStatus } from "@/lib/apiError";

/**
 * Catálogo público de agentes.
 * Contrato previsto: GET /ai-agents/public/agents/
 * `{ results: [{ id, name, summary|description, channels?: string[] }] }`
 * o un array con la misma forma. Si el endpoint aún no existe, la landing muestra el vacío.
 */
export const PUBLIC_AGENT_CATALOG_PATH = "/ai-agents/public/agents/";

export type PublicCatalogAgent = {
  id: string;
  name: string;
  summary: string;
  channels: string[];
};

export function parsePublicAgentCatalog(data: unknown): PublicCatalogAgent[] {
  const rows = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray((data as { results?: unknown }).results)
      ? (data as { results: unknown[] }).results
      : [];

  const agents: PublicCatalogAgent[] = [];
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const item = row as Record<string, unknown>;
    const id = item.id != null ? String(item.id) : "";
    const name = typeof item.name === "string" ? item.name.trim() : "";
    if (!id || !name) continue;
    const summaryRaw = item.summary ?? item.description ?? "";
    const summary = typeof summaryRaw === "string" ? summaryRaw.trim() : "";
    const channels = Array.isArray(item.channels)
      ? item.channels.filter((ch): ch is string => typeof ch === "string" && ch.trim().length > 0)
      : [];
    agents.push({ id, name, summary, channels });
  }
  return agents;
}

export function usePublicAgentCatalog() {
  return useQuery({
    queryKey: ["ai-agents", "public-catalog"],
    queryFn: () =>
      GET<unknown>(PUBLIC_AGENT_CATALOG_PATH, { skipAuth: true }).then((data) =>
        parsePublicAgentCatalog(data),
      ),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function catalogUnavailable(error: unknown): boolean {
  const status = apiErrorStatus(error);
  return status === 404 || status === 401 || status === 403 || status == null;
}
