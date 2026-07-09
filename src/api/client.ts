import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getActiveBranchId, getBranchMode } from "@/lib/branchStorage";

const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : (import.meta.env.VITE_API_URL ?? "https://api.agenciapatagoniachile.com/api");

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
    const token = localStorage.getItem("token");
    const activeBranchId = getActiveBranchId();
    const branchMode = getBranchMode();

    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    if (activeBranchId && branchMode === "branch") {
      config.headers["x-branch-id"] = activeBranchId;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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

export const GET = <T>(url: string, config = {}) =>
  apiClient.get<T>(url, config).then((r) => r.data);
export const POST = <T>(url: string, data = {}, config = {}) =>
  apiClient.post<T>(url, data, config).then((r) => r.data);
export const PATCH = <T>(url: string, data = {}, config = {}) =>
  apiClient.patch<T>(url, data, config).then((r) => r.data);
export const DELETE = <T>(url: string, config = {}) =>
  apiClient.delete<T>(url, config).then((r) => r.data);
