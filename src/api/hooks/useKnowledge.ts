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

export interface AgentKnowledge {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  knowledge_type: KnowledgeType;
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
  created?: string;
  modified?: string;
}

export interface KnowledgeSearchResult {
  id: string;
  title: string;
  knowledge_type: KnowledgeType;
  source_app?: string;
  is_indexed: boolean;
  score: number;
}

export function useKnowledgeCatalog(filters?: { page_size?: number }) {
  const branchId = useActiveBranchId();
  return useQuery({
    queryKey: [...QUERY_KEY, "list", branchId, filters],
    queryFn: () =>
      GET<AgentKnowledge[] | { count: number; results: AgentKnowledge[] }>(
        ENDPOINTS.knowledge.list,
        { params: { page_size: filters?.page_size ?? 100 } },
      ).then((data) => normalizeListResponse<AgentKnowledge>(data)),
    staleTime: 30_000,
  });
}

export function useKnowledgeList(filters?: { source_app?: string; q?: string; top_k?: number }) {
  return useQuery({
    queryKey: [...QUERY_KEY, "search", filters],
    queryFn: () =>
      GET<{ query: string; results: KnowledgeSearchResult[]; count: number }>(
        ENDPOINTS.knowledge.search,
        { params: filters },
      ),
    staleTime: 30_000,
  });
}

export function useKnowledge(id: string | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => GET<AgentKnowledge>(ENDPOINTS.knowledge.detail(id!)),
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
    mutationFn: ({ id, data }: { id: string; data: Partial<AgentKnowledge> }) =>
      PATCH<AgentKnowledge>(ENDPOINTS.knowledge.detail(id), data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => DELETE(ENDPOINTS.knowledge.detail(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useIndexKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => POST<AgentKnowledge>(ENDPOINTS.knowledge.index(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useReindexKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => POST<AgentKnowledge>(ENDPOINTS.knowledge.reindex(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUnindexKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => POST<AgentKnowledge>(ENDPOINTS.knowledge.unindex(id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
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
      return apiClient
        .post<SpreadsheetParseResponse>(ENDPOINTS.knowledge.parseSpreadsheet, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
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
