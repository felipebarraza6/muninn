import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { GET, POST, PATCH, DELETE, normalizeListResponse } from "../client";
import { ENDPOINTS } from "../endpoints/index";
import { useActiveBranchId } from "@/hooks/useActiveBranchId";

const QUERY_KEY = ["ai-agents", "channels"];

export interface ChannelConfigField {
  key: string;
  label: string;
  type: "text" | "password" | "number" | "select" | "switch" | "url" | "email" | string;
  required?: boolean;
  secret?: boolean;
  help?: string;
  default?: unknown;
  options?: { value: string; label: string }[];
}

export interface ChannelCatalogItem {
  channel_type: string;
  display_name: string;
  capabilities: string[];
  supports_inbound: boolean;
  supports_outbound: boolean;
  production_ready: boolean;
  deprecated?: boolean;
  notes?: string;
  providers: { value: string; label: string }[];
  default_provider: string;
  config_fields: ChannelConfigField[];
  config_fields_by_provider: Record<string, ChannelConfigField[]>;
}

export interface ChannelsCatalogResponse {
  count: number;
  results: ChannelCatalogItem[];
  webhook_config_schema?: Record<string, unknown>;
  webhook_profiles?: string[];
}

export interface Channel {
  id: string | number;
  name: string;
  channel_type: string;
  provider?: string;
  is_active?: boolean;
  is_verified?: boolean;
  config?: Record<string, unknown>;
  /** Secrets enmascarados + campos públicos (lectura). */
  config_masked?: Record<string, unknown>;
  webhook_secret?: string;
  webhook_url?: string;
  custom_domain?: string;
  welcome_message?: string;
  assigned_agent?: string | number | null;
  assigned_agent_name?: string;
  capabilities?: string[];
  supports_inbound?: boolean;
  supports_outbound?: boolean;
  production_ready?: boolean;
  channel_notes?: string;
  webhook_profile?: string | null;
  inbound_mapping?: Record<string, unknown>;
  branch?: number | null;
  created?: string;
  modified?: string;
}

export interface ChannelSession {
  id: string;
  external_user_name?: string;
  external_user_id: string;
  status: string;
  last_message_at?: string | null;
  message_count?: number;
}

export interface ChannelTestResult {
  ok: boolean;
  tested: string;
  status: string;
  detail: string;
  label?: string;
  is_verified?: boolean;
}

export function useChannels(filters?: { is_active?: boolean; channel_type?: string }) {
  const branchId = useActiveBranchId();
  return useQuery({
    queryKey: [...QUERY_KEY, branchId ?? "all", filters],
    queryFn: () =>
      GET<Channel[] | { count: number; results: Channel[] }>(ENDPOINTS.channels.list, {
        params: {
          ...filters,
          include_inactive: "true",
          ...(branchId ? { branch: branchId } : {}),
        },
      }).then((data) => normalizeListResponse<Channel>(data)),
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useChannel(id: string | undefined) {
  const branchId = useActiveBranchId();
  return useQuery({
    queryKey: [...QUERY_KEY, branchId, id],
    queryFn: () => GET<Channel>(ENDPOINTS.channels.detail(id!)),
    enabled: !!id,
  });
}

export function useChannelsCatalog(includeDeprecated = false) {
  return useQuery({
    queryKey: [...QUERY_KEY, "catalog", includeDeprecated],
    queryFn: () =>
      GET<ChannelsCatalogResponse>(ENDPOINTS.channels.catalog, {
        params: includeDeprecated ? { include_deprecated: "true" } : undefined,
      }),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Channel>) => POST<Channel>(ENDPOINTS.channels.list, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useUpdateChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<Channel> }) =>
      PATCH<Channel>(ENDPOINTS.channels.detail(String(id)), data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => DELETE(ENDPOINTS.channels.detail(String(id))),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useRegenerateChannelSecret() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) =>
      POST<{ id: string; webhook_secret: string; webhook_url: string }>(
        ENDPOINTS.channels.regenerateSecret(String(id)),
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useTestChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, config }: { id: string | number; config?: Record<string, unknown> }) =>
      POST<ChannelTestResult>(ENDPOINTS.channels.testConnection(String(id)), {
        ...(config ? { config } : {}),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useSimulateChannel() {
  return useMutation({
    mutationFn: ({
      id,
      external_user_id,
      message,
      external_user_name,
      metadata,
    }: {
      id: string | number;
      external_user_id: string;
      message: string;
      external_user_name?: string;
      metadata?: Record<string, unknown>;
    }) =>
      POST<Record<string, unknown>>(ENDPOINTS.channels.simulate(String(id)), {
        external_user_id,
        message,
        external_user_name: external_user_name ?? "",
        metadata: metadata ?? {},
      }),
  });
}

export function useSendChannelMessage() {
  return useMutation({
    mutationFn: ({
      id,
      external_user_id,
      message,
    }: {
      id: string | number;
      external_user_id: string;
      message: string;
    }) =>
      POST<Record<string, unknown>>(ENDPOINTS.channels.sendMessage(String(id)), {
        external_user_id,
        message,
      }),
  });
}

export function useChannelSessions(id: string | undefined) {
  return useQuery({
    queryKey: [...QUERY_KEY, id, "sessions"],
    queryFn: async () => {
      const data = await GET<ChannelSession[] | { count?: number; results: ChannelSession[] }>(
        ENDPOINTS.channels.sessions(id!),
      );
      if (Array.isArray(data)) return data;
      return data.results ?? [];
    },
    enabled: !!id,
    staleTime: 30_000,
  });
}
