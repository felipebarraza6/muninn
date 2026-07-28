import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GET, POST, PATCH, DELETE, normalizeListResponse, apiClient } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { useActiveBranchId } from "@/hooks/useActiveBranchId";

const QUERY_KEY = ["ai-agents", "knowledge"];

export type KnowledgeType =
  | "DOCUMENT"
  | "FAQ"
  | "DATA"
  | "FUNCTION"
  | "PROCEDURE"
  | "POLICY"
  | "API_DOC"
  | "CODE"
  | "CUSTOM";

export type ApiRefreshMappingType = "json_to_table" | "raw_string" | "title_and_body" | "json_path";

export interface ApiRefreshContentMapping {
  type: ApiRefreshMappingType;
  /** Ruta dentro del JSON response (json_path / json_to_table). Ej: "data.products". */
  path?: string;
  /** Columnas a mostrar (solo json_to_table). */
  columns?: string[];
}

export interface ApiRefreshPayloadVariables {
  [key: string]: string;
}

export type ApiRefreshIntegrationMode = "replace" | "append" | "merge" | "increment";

export interface ApiRefreshIntegrationStrategy {
  mode: ApiRefreshIntegrationMode;
  /** Campo clave para merge (solo mode=merge). */
  key_field?: string;
  /** Separador para append (solo mode=append). */
  separator?: string;
  /** Maximo de entradas historicas para append (solo mode=append). */
  max_history?: number;
}

export interface ApiRefreshConfig {
  external_api_id: string;
  /** Key del endpoint dentro de ExternalAPI.endpoints. Ej: "get_products". */
  endpoint: string;
  /** Metadata de frecuencia (backend ejecuta cada 1h). Ej: "0 *\/6 * * *". */
  cron: string;
  content_mapping: ApiRefreshContentMapping;
  /** Variables para resolver placeholders {{key}} en el endpoint. */
  payload_variables?: ApiRefreshPayloadVariables;
  /** Estrategia de integracion con contenido existente. */
  integration_strategy?: ApiRefreshIntegrationStrategy;
  /** Template markdown con {{title}}, {{timestamp}}, {{data_table}}, {{raw_json}}. */
  content_template?: string;
}

export interface AgentKnowledge {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  knowledge_type: KnowledgeType;
  /** Categoría libre (max 80). Vacío = sin categoría. */
  category?: string | null;
  source_app?: string;
  source_model?: string;
  source_id?: string;
  tags?: string[];
  is_indexed: boolean;
  indexed_at?: string;
  usage_count?: number;
  last_used_at?: string;
  is_active: boolean;
  file?: string;
  chunks_count?: number;
  /** Chunks activos con embedding real (vectores RAG). */
  embeddings_count?: number;
  /** Columnas detectadas (tipo DATA). */
  columns?: string[];
  branch?: number | string | null;
  created?: string;
  modified?: string;
  api_refresh_config?: ApiRefreshConfig | null;
}

export interface KnowledgeCategory {
  name: string;
  count: number;
}

export type KnowledgeIndexResponse = AgentKnowledge & {
  indexing_task_id?: string;
};

export interface KnowledgeIndexingStatus {
  document_id: string;
  title?: string;
  is_indexed: boolean;
  indexed_at?: string | null;
  chunks_count: number;
  embeddings_count: number;
  has_vectors: boolean;
  task_id?: string | null;
  task_state?: string | null;
  task_ready?: boolean | null;
  task_successful?: boolean | null;
  task_result?: {
    status?: string;
    chunks?: number;
    has_embeddings?: boolean;
    error?: string;
    knowledge_id?: string;
    embedding_model?: string;
    embedding_error?: string;
  } | null;
  task_error?: string | null;
}

/**
 * Tiene fragmentos indexados (puede ser solo keywords, sin embeddings).
 */
export function isKnowledgeIndexed(
  doc: Pick<AgentKnowledge, "is_indexed" | "chunks_count" | "embeddings_count">,
): boolean {
  if ((doc.embeddings_count ?? 0) > 0) return true;
  return Boolean(doc.is_indexed) && (doc.chunks_count ?? 0) > 0;
}

/** Tiene vectores/embeddings reales para RAG semántico. */
export function hasKnowledgeVectors(
  doc: Pick<AgentKnowledge, "embeddings_count" | "is_indexed" | "chunks_count">,
): boolean {
  return (doc.embeddings_count ?? 0) > 0;
}

export interface KnowledgeSearchResult {
  id: string;
  title: string;
  knowledge_type: KnowledgeType;
  source_app?: string;
  is_indexed: boolean;
  score: number;
}

function branchParams(branch?: string | number | null) {
  return branch != null && branch !== "" ? { branch } : undefined;
}

export function useKnowledgeCatalog(filters?: {
  page_size?: number;
  includeInactive?: boolean;
  /** Filtra por categoría exacta (API `?category=`). */
  category?: string | null;
  /** Sucursal a listar; por defecto la activa. */
  branch?: string | number | null;
}) {
  const activeBranchId = useActiveBranchId();
  const { includeInactive, page_size, category, branch } = filters ?? {};
  const branchId = branch ?? activeBranchId;
  const categoryFilter = (category || "").trim() || null;
  return useQuery({
    queryKey: [
      ...QUERY_KEY,
      "list",
      branchId,
      { page_size, includeInactive: !!includeInactive, category: categoryFilter },
    ],
    queryFn: () =>
      GET<AgentKnowledge[] | { count: number; results: AgentKnowledge[] }>(
        ENDPOINTS.knowledge.list,
        {
          params: {
            page_size: page_size ?? 100,
            ...(branchId ? { branch: branchId } : {}),
            ...(includeInactive ? { include_inactive: "true" } : {}),
            ...(categoryFilter ? { category: categoryFilter } : {}),
          },
        },
      ).then((data) => normalizeListResponse<AgentKnowledge>(data)),
    staleTime: 30_000,
  });
}

export function useKnowledgeCategories(options?: { branch?: string | number | null }) {
  const activeBranchId = useActiveBranchId();
  const branchId = options?.branch ?? activeBranchId;
  return useQuery({
    queryKey: [...QUERY_KEY, "categories", branchId],
    queryFn: () =>
      GET<KnowledgeCategory[]>(ENDPOINTS.knowledge.categories, {
        params: branchId ? { branch: branchId } : undefined,
      }),
    staleTime: 30_000,
  });
}

export function useRenameKnowledgeCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { from: string; to: string; branch?: string | number | null }) =>
      POST<{ ok: boolean; updated: number; name: string }>(
        ENDPOINTS.knowledge.categoriesRename,
        { from: payload.from, to: payload.to },
        { params: branchParams(payload.branch) },
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteKnowledgeCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; branch?: string | number | null }) =>
      POST<{ ok: boolean; cleared: number }>(
        ENDPOINTS.knowledge.categoriesDelete,
        { name: payload.name },
        { params: branchParams(payload.branch) },
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useKnowledgeList(filters?: { source_app?: string; q?: string; top_k?: number }) {
  const q = filters?.q?.trim() ?? "";
  return useQuery({
    queryKey: [...QUERY_KEY, "search", filters],
    queryFn: () =>
      GET<{ query: string; results: KnowledgeSearchResult[]; count: number }>(
        ENDPOINTS.knowledge.search,
        { params: { ...filters, q } },
      ),
    enabled: q.length >= 2,
    staleTime: 15_000,
  });
}

type KnowledgeIdInput = string | { id: string; branch?: string | number | null; hard?: boolean };

function resolveKnowledgeIdInput(input: KnowledgeIdInput): {
  id: string;
  branch?: string | number | null;
  hard?: boolean;
} {
  if (typeof input === "string") return { id: input };
  return input;
}

export function useDeleteKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: KnowledgeIdInput) => {
      const { id, branch, hard } = resolveKnowledgeIdInput(input);
      return DELETE(ENDPOINTS.knowledge.detail(id), {
        params: {
          ...(branchParams(branch) ?? {}),
          include_inactive: "true",
          ...(hard ? { hard: "true" } : {}),
        },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useKnowledge(
  id: string | undefined,
  options?: { branch?: string | number | null },
) {
  const branch = options?.branch;
  return useQuery({
    queryKey: [...QUERY_KEY, id, branch ?? null],
    queryFn: () =>
      GET<AgentKnowledge>(ENDPOINTS.knowledge.detail(id!), {
        params: branchParams(branch),
      }),
    enabled: !!id,
  });
}

export function useCreateKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AgentKnowledge>) =>
      POST<AgentKnowledge>(ENDPOINTS.knowledge.list, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
      branch,
    }: {
      id: string;
      data: Partial<AgentKnowledge>;
      branch?: string | number | null;
    }) =>
      PATCH<AgentKnowledge>(ENDPOINTS.knowledge.detail(id), data, {
        params: branchParams(branch),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

function patchKnowledgeInLists(
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
  patch: Partial<AgentKnowledge>,
) {
  queryClient.setQueriesData<AgentKnowledge[]>({ queryKey: [...QUERY_KEY, "list"] }, (old) => {
    if (!Array.isArray(old)) return old;
    return old.map((doc) => (String(doc.id) === id ? { ...doc, ...patch } : doc));
  });
  queryClient.setQueryData<AgentKnowledge>([...QUERY_KEY, id], (old) =>
    old ? { ...old, ...patch } : old,
  );
}

export function useIndexKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: KnowledgeIdInput) => {
      const { id, branch } = resolveKnowledgeIdInput(input);
      return POST<KnowledgeIndexResponse>(
        ENDPOINTS.knowledge.index(id),
        {},
        {
          params: branchParams(branch),
        },
      );
    },
    onSuccess: (data, variables) => {
      const { id } = resolveKnowledgeIdInput(variables);
      patchKnowledgeInLists(queryClient, id, {
        ...data,
        is_indexed: false,
        chunks_count: 0,
        embeddings_count: 0,
        indexed_at: undefined,
      });
      void queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, id, "chunks"] });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useReindexKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: KnowledgeIdInput) => {
      const { id, branch } = resolveKnowledgeIdInput(input);
      return POST<KnowledgeIndexResponse>(
        ENDPOINTS.knowledge.reindex(id),
        {},
        {
          params: branchParams(branch),
        },
      );
    },
    onSuccess: (data, variables) => {
      const { id } = resolveKnowledgeIdInput(variables);
      // El endpoint marca is_indexed=false al encolar; reflejarlo ya en UI.
      patchKnowledgeInLists(queryClient, id, {
        ...data,
        is_indexed: false,
        chunks_count: 0,
        embeddings_count: 0,
        indexed_at: undefined,
      });
      void queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, id, "chunks"] });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export async function fetchKnowledgeIndexingStatus(
  id: string,
  taskId?: string | null,
  branch?: string | number | null,
): Promise<KnowledgeIndexingStatus> {
  return GET<KnowledgeIndexingStatus>(ENDPOINTS.knowledge.indexingStatus(id), {
    params: {
      ...(taskId ? { task_id: taskId } : {}),
      ...(branchParams(branch) ?? {}),
    },
  });
}

export function useUnindexKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: KnowledgeIdInput) => {
      const { id, branch } = resolveKnowledgeIdInput(input);
      return POST<AgentKnowledge>(
        ENDPOINTS.knowledge.unindex(id),
        {},
        {
          params: branchParams(branch),
        },
      );
    },
    onSuccess: (data, variables) => {
      const { id } = resolveKnowledgeIdInput(variables);
      patchKnowledgeInLists(queryClient, id, {
        ...data,
        is_indexed: false,
        chunks_count: 0,
      });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export interface KnowledgeChunk {
  id: string;
  order: number;
  content: string;
  char_count: number;
  has_embedding: boolean;
  dimensions: number;
  norm: number | null;
  preview: number[];
}

export interface KnowledgeChunksResponse {
  document_id: string;
  is_indexed: boolean;
  indexed_at?: string | null;
  count: number;
  dimensions: number;
  chunks: KnowledgeChunk[];
}

export function useKnowledgeChunks(
  id: string | undefined,
  enabled = true,
  options?: { branch?: string | number | null },
) {
  const branch = options?.branch;
  return useQuery({
    queryKey: [...QUERY_KEY, id, "chunks", branch ?? null],
    queryFn: () =>
      GET<KnowledgeChunksResponse>(ENDPOINTS.knowledge.chunks(id!), {
        params: branchParams(branch),
      }),
    enabled: !!id && enabled,
    staleTime: 15_000,
  });
}

export interface SpreadsheetParseRow {
  title: string;
  content: string;
  knowledge_type?: KnowledgeType | string;
  tags?: string[];
}

export interface SpreadsheetParseResponse {
  rows: SpreadsheetParseRow[];
  count: number;
  error?: string;
}

export function useParseSpreadsheet() {
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      // Sin Content-Type manual: el interceptor de apiClient deja el boundary al browser.
      return apiClient
        .post<SpreadsheetParseResponse>(ENDPOINTS.knowledge.parseSpreadsheet, formData)
        .then((r) => r.data);
    },
  });
}

export function useBulkCreateKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      items: Partial<AgentKnowledge>[];
      index?: boolean;
      assign_to_agent?: string | number;
    }) =>
      POST<{
        created: AgentKnowledge[];
        count?: number;
        errors?: unknown[];
      }>(ENDPOINTS.knowledge.bulkCreate, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useBulkIndexKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) =>
      POST<{ total: number; tasks: string[] }>(ENDPOINTS.knowledge.bulkIndex, { ids }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
