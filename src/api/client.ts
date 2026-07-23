import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import { getActiveBranchId, getBranchMode } from "@/lib/branchStorage";

const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : (import.meta.env.VITE_API_URL ?? "https://api.agenciapatagoniachile.com/api");

export type ApiRequestConfig = AxiosRequestConfig & {
  /** No inyectar x-branch-id del switcher (listados admin multi-sucursal). */
  skipBranchHeader?: boolean;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

function extractValidationErrors(data: unknown): string[] {
  const errors: string[] = [];
  if (!data || typeof data !== "object") return errors;

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      errors.push(`${key}: ${value.join(", ")}`);
    } else if (typeof value === "object" && value !== null) {
      errors.push(...extractValidationErrors(value));
    } else if (typeof value === "string") {
      errors.push(`${key}: ${value}`);
    }
  }

  if (errors.length === 0) {
    const d = data as Record<string, unknown>;
    if (d.errors && Array.isArray(d.errors)) errors.push(...d.errors.map(String));
    if (d.detail) errors.push(String(d.detail));
    if (d.message) errors.push(String(d.message));
  }

  return errors;
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // FormData: dejar que el browser ponga multipart + boundary.
    // Si forzamos "multipart/form-data" sin boundary (o dejamos application/json),
    // Django no recibe archivos.
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      const headers = config.headers as {
        set?: (k: string, v: unknown) => void;
        delete?: (k: string) => void;
        setContentType?: (v: false | string) => void;
      } & Record<string, unknown>;
      if (typeof headers.setContentType === "function") {
        headers.setContentType(false);
      } else if (typeof headers.delete === "function") {
        headers.delete("Content-Type");
        headers.delete("content-type");
      } else {
        delete headers["Content-Type"];
        delete headers["content-type"];
      }
    }

    const url = String(config.url ?? "");
    const isLogin =
      url.includes("/accounts/users/login") || url.includes("/accounts/users/login_complete");

    // No mandar Authorization en login: un token viejo en localStorage + cookie
    // inválida no deben interferir con autenticarse de nuevo.
    if (!isLogin) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Token ${token}`;
      }
    } else {
      delete config.headers.Authorization;
    }

    const activeBranchId = getActiveBranchId();
    const branchMode = getBranchMode();

    // No pisar un x-branch-id explícito (p.ej. roles/asignaciones de otra sucursal en admin).
    const skipBranchHeader = Boolean((config as ApiRequestConfig).skipBranchHeader);
    const existingBranchHeader =
      config.headers.get?.("x-branch-id") ??
      (config.headers as Record<string, unknown>)["x-branch-id"] ??
      (config.headers as Record<string, unknown>)["X-Branch-ID"];

    if (!skipBranchHeader && !existingBranchHeader && activeBranchId && branchMode === "branch") {
      config.headers["x-branch-id"] = activeBranchId;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const url = String(error.config?.url ?? "");
    const isLogin =
      url.includes("/accounts/users/login") || url.includes("/accounts/users/login_complete");

    if (error.response?.status === 401 && !isLogin) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("branches");
      localStorage.removeItem("permissions");
      localStorage.removeItem("activeBranchId");
      sessionStorage.removeItem("activeBranchId");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (error.response?.data) {
      const messages = extractValidationErrors(error.response.data);
      if (messages.length > 0) {
        (error as AxiosError & { friendlyMessage?: string }).friendlyMessage = messages.join("\n");
      }
    }

    return Promise.reject(error);
  },
);

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export function normalizeListResponse<T>(
  data: T[] | PaginatedResponse<T> | { count: number; results: T[] },
): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray((data as { results: T[] }).results)) {
    return (data as { results: T[] }).results;
  }
  return [];
}

/** Máximo permitido por StandardResultsSetPagination en Yggdra. */
export const API_MAX_PAGE_SIZE = 200;

/**
 * Trae todas las páginas de un listado paginado (page_size ≤ 200).
 * Si la respuesta ya es array, la devuelve tal cual.
 */
export async function GET_ALL_PAGES<T>(url: string, config: ApiRequestConfig = {}): Promise<T[]> {
  const baseParams =
    config.params && typeof config.params === "object" && !Array.isArray(config.params)
      ? { ...(config.params as Record<string, unknown>) }
      : {};

  const pageSize = Math.min(
    Number(baseParams.page_size) > 0 ? Number(baseParams.page_size) : API_MAX_PAGE_SIZE,
    API_MAX_PAGE_SIZE,
  );

  const first = await GET<T[] | PaginatedResponse<T>>(url, {
    ...config,
    params: { ...baseParams, page_size: pageSize, page: 1 },
  });

  if (Array.isArray(first)) return first;

  const all = [...normalizeListResponse<T>(first)];
  const total = typeof first.count === "number" ? first.count : all.length;
  let page = 2;

  while (all.length < total) {
    const next = await GET<T[] | PaginatedResponse<T>>(url, {
      ...config,
      params: { ...baseParams, page_size: pageSize, page },
    });
    const chunk = normalizeListResponse<T>(next);
    if (chunk.length === 0) break;
    all.push(...chunk);
    page += 1;
    if (page > 100) break; // safety
  }

  return all;
}

export const GET = <T>(url: string, config: ApiRequestConfig = {}) =>
  apiClient.get<T>(url, config).then((r) => r.data);
export const POST = <T>(url: string, data = {}, config: ApiRequestConfig = {}) =>
  apiClient.post<T>(url, data, config).then((r) => r.data);
export const PUT = <T>(url: string, data = {}, config: ApiRequestConfig = {}) =>
  apiClient.put<T>(url, data, config).then((r) => r.data);
export const PATCH = <T>(url: string, data = {}, config: ApiRequestConfig = {}) =>
  apiClient.patch<T>(url, data, config).then((r) => r.data);
export const DELETE = <T>(url: string, config: ApiRequestConfig = {}) =>
  apiClient.delete<T>(url, config).then((r) => r.data);
