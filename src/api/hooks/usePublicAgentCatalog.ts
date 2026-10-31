import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GET, POST } from "../client";
import { apiErrorStatus } from "@/lib/apiError";
import {
  AGENT_CATALOG_PATHS,
  isAgentCatalogMockEnabled,
  parseAgentCatalogCategories,
  parseAgentCatalogCloneResult,
  parseAgentCatalogDetail,
  parseAgentCatalogListResponse,
  parseAgentCatalogPublishResult,
  type AgentCatalogClonePayload,
  type AgentCatalogCloneResult,
  type AgentCatalogDetail,
  type AgentCatalogListItem,
  type AgentCatalogListParams,
  type AgentCatalogPublishPayload,
  type AgentCatalogPublishResult,
  type AgentCatalogReviewPayload,
  type AgentCatalogReviewResult,
} from "@/lib/agentCatalog";
import {
  filterMockCatalog,
  mockAgentCatalogDetail,
  MOCK_AGENT_CATALOG_CATEGORIES,
} from "@/lib/agentCatalogMocks";
export const PUBLIC_AGENT_CATALOG_PATH = AGENT_CATALOG_PATHS.list;

/** Compat landing antigua. Preferir AgentCatalogListItem. */
export type PublicCatalogAgent = {
  id: string;
  name: string;
  summary: string;
  channels: string[];
};

export function toLegacyPublicCatalogAgent(item: AgentCatalogListItem): PublicCatalogAgent {
  return {
    id: item.slug || item.id,
    name: item.name,
    summary: item.tagline || item.description,
    channels: item.recommended_channels,
  };
}

/** @deprecated Usar parseAgentCatalogListResponse. */
export function parsePublicAgentCatalog(data: unknown): PublicCatalogAgent[] {
  return parseAgentCatalogListResponse(data).results.map(toLegacyPublicCatalogAgent);
}

export function catalogUnavailable(error: unknown): boolean {
  const status = apiErrorStatus(error);
  return status === 404 || status === 401 || status === 403 || status == null;
}

export function useAgentCatalogList(params: AgentCatalogListParams = {}) {
  const category = params.category?.trim() || undefined;
  const ambito = params.ambito?.trim() || undefined;
  const q = params.q?.trim() || undefined;

  return useQuery({
    queryKey: ["agent-catalog", "list", { category, ambito, q }],
    queryFn: async () => {
      if (isAgentCatalogMockEnabled()) {
        const results = filterMockCatalog({ category, ambito, q });
        return { count: results.length, results };
      }
      const search = new URLSearchParams();
      if (category) search.set("category", category);
      if (ambito) search.set("ambito", ambito);
      if (q) search.set("q", q);
      const qs = search.toString();
      const path = qs ? `${AGENT_CATALOG_PATHS.list}?${qs}` : AGENT_CATALOG_PATHS.list;
      const data = await GET<unknown>(path, { skipAuth: true });
      return parseAgentCatalogListResponse(data);
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

/** Landing: listado completo sin filtros (destacados se eligen en cliente). */
export function usePublicAgentCatalog() {
  const query = useAgentCatalogList({});
  return {
    ...query,
    data: query.data?.results.map(toLegacyPublicCatalogAgent),
    catalog: query.data?.results,
  };
}

export function useAgentCatalogCategories() {
  return useQuery({
    queryKey: ["agent-catalog", "categories"],
    queryFn: async () => {
      if (isAgentCatalogMockEnabled()) return MOCK_AGENT_CATALOG_CATEGORIES;
      const data = await GET<unknown>(AGENT_CATALOG_PATHS.categories, { skipAuth: true });
      return parseAgentCatalogCategories(data);
    },
    retry: false,
    staleTime: 30 * 60 * 1000,
  });
}

export function useAgentCatalogDetail(slug: string | undefined) {
  return useQuery({
    queryKey: ["agent-catalog", "detail", slug],
    enabled: Boolean(slug),
    queryFn: async (): Promise<AgentCatalogDetail> => {
      if (!slug) throw new Error("slug requerido");
      if (isAgentCatalogMockEnabled()) {
        const mock = mockAgentCatalogDetail(slug);
        if (!mock) {
          const err = new Error("Plantilla no encontrada") as Error & {
            response?: { status: number };
          };
          err.response = { status: 404 };
          throw err;
        }
        return mock;
      }
      const data = await GET<unknown>(AGENT_CATALOG_PATHS.detail(slug), { skipAuth: true });
      const parsed = parseAgentCatalogDetail(data);
      if (!parsed) throw new Error("Respuesta de catálogo inválida");
      return parsed;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCloneCatalogAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      slug,
      payload,
    }: {
      slug: string;
      payload?: AgentCatalogClonePayload;
    }): Promise<AgentCatalogCloneResult> => {
      if (isAgentCatalogMockEnabled()) {
        return {
          agent_id: `mock-cloned-${slug}`,
          slug: `${slug}-copia`,
          name: payload?.name || slug,
          branch_id: String(payload?.branch ?? "0"),
          template_slug: slug,
          clone_count: 1,
        };
      }
      const data = await POST<unknown>(AGENT_CATALOG_PATHS.clone(slug), payload ?? {});
      const parsed = parseAgentCatalogCloneResult(data);
      if (!parsed) throw new Error("Respuesta de clonado inválida");
      return parsed;
    },
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: ["agent-catalog"] });
      void qc.invalidateQueries({ queryKey: ["ai-agents"] });
      void qc.invalidateQueries({ queryKey: ["agent-catalog", "detail", vars.slug] });
    },
  });
}

export function usePublishCatalogAgent() {
  return useMutation({
    mutationFn: async (payload: AgentCatalogPublishPayload): Promise<AgentCatalogPublishResult> => {
      if (isAgentCatalogMockEnabled()) {
        return {
          id: `mock-pub-${payload.agent_id}`,
          slug: `pub-agent-${payload.agent_id}`,
          review_status: "pending",
          visibility: payload.visibility || "public",
          message: "Plantilla enviada a revisión (mock).",
        };
      }
      const data = await POST<unknown>(AGENT_CATALOG_PATHS.publish, payload);
      const parsed = parseAgentCatalogPublishResult(data);
      if (!parsed) throw new Error("Respuesta de publicación inválida");
      return parsed;
    },
  });
}

export function useApproveCatalogAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      slug,
      notes,
    }: {
      slug: string;
      notes?: string;
    }): Promise<AgentCatalogReviewResult> => {
      const body: AgentCatalogReviewPayload = notes ? { notes } : {};
      if (isAgentCatalogMockEnabled()) {
        return { slug, review_status: "approved" };
      }
      return POST<AgentCatalogReviewResult>(AGENT_CATALOG_PATHS.approve(slug), body);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["agent-catalog"] });
    },
  });
}

export function useRejectCatalogAgent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      slug,
      notes,
    }: {
      slug: string;
      notes?: string;
    }): Promise<AgentCatalogReviewResult> => {
      const body: AgentCatalogReviewPayload = notes ? { notes } : {};
      if (isAgentCatalogMockEnabled()) {
        return { slug, review_status: "rejected" };
      }
      return POST<AgentCatalogReviewResult>(AGENT_CATALOG_PATHS.reject(slug), body);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["agent-catalog"] });
    },
  });
}
