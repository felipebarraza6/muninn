import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import { getActiveBranchId, getBranchMode } from "@/lib/branchStorage";
import { resolveApiBaseUrl } from "@/lib/apiBaseUrl";

const API_BASE_URL = resolveApiBaseUrl();

export type ApiRequestConfig = AxiosRequestConfig & {
  /** No inyectar x-branch-id del switcher (listados admin multi-sucursal). */
  skipBranchHeader?: boolean;
  /** No inyectar Authorization (endpoints públicos: embed, login theme, etc.). */
  skipAuth?: boolean;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

/** Rutas de API que no deben llevar Token ni disparar logout global en 401. */
function isPublicApiUrl(url: string): boolean {
  return (
    url.includes("/accounts/users/login") ||
    url.includes("/accounts/users/login_complete") ||
    url.includes("/accounts/users/forgot_password") ||
    url.includes("/accounts/users/reset_password_confirm") ||
    url.includes("/ai-agents/public/") ||
    url.includes("/branches/public-login-theme") ||
    url.includes("/branches/public-org-login-theme")
  );
}

/** Páginas del frontend donde un 401 no debe forzar redirect a /entrar. */
function isPublicAppPath(pathname: string): boolean {
  if (pathname === "/login" || pathname.startsWith("/login/")) return true;
  if (pathname === "/entrar") return true;
  if (pathname.startsWith("/forgot-password")) return true;
  if (pathname.startsWith("/reset-password")) return true;
  if (pathname.startsWith("/embed/")) return true;
  return false;
}

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
    const skipAuth = Boolean((config as ApiRequestConfig).skipAuth) || isPublicApiUrl(url);

    // No mandar Authorization en login/públicos: token viejo no debe interferir.
    if (!skipAuth) {
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
    const skipBranchHeader = Boolean((config as ApiRequestConfig).skipBranchHeader) || skipAuth;
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
    const status = error.response?.status;
    const isPublicApi = isPublicApiUrl(url);

    if (status === 401 && !isPublicApi) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("branches");
      localStorage.removeItem("permissions");
      localStorage.removeItem("activeBranchId");
      sessionStorage.removeItem("activeBranchId");
      if (!isPublicAppPath(window.location.pathname)) {
        window.location.href = "/entrar";
      }
    }

    if (status === 429) {
      const retryAfter = error.response?.headers?.["retry-after"];
      const secs = retryAfter ? parseInt(retryAfter, 10) : undefined;
      const wait = secs && Number.isFinite(secs) ? ` Intenta de nuevo en ${secs}s.` : "";
      (error as AxiosError & { friendlyMessage?: string }).friendlyMessage =
        `Demasiadas solicitudes.${wait} Espera un momento antes de continuar.`;
    }

    if (status === 404) {
      const url = String(error.config?.url ?? "");
      if (url.includes("work-plans")) {
        (error as AxiosError & { friendlyMessage?: string }).friendlyMessage =
          "Ruta work-plans no encontrada en el API.";
      }
    }

    if (!error.response) {
      (error as AxiosError & { friendlyMessage?: string }).friendlyMessage =
        "Sin respuesta del servidor. Revisá que el API y el proxy estén activos.";
    }

    if (error.response?.data) {
      const data = error.response.data as Record<string, unknown>;

      if (status === 400 && data.plan_limit) {
        const pl = data.plan_limit as Record<string, unknown>;
        const resource = String(pl.resource ?? "").trim() || "este recurso";
        const current = pl.current ?? "?";
        const max = pl.max ?? "?";
        (error as AxiosError & { friendlyMessage?: string }).friendlyMessage =
          `Límite del plan alcanzado para ${resource} (${current}/${max}). Contacta a tu administrador para ampliar el plan.`;
      }

      if (!(error as AxiosError & { friendlyMessage?: string }).friendlyMessage) {
        const messages = extractValidationErrors(data);
        if (messages.length > 0) {
          (error as AxiosError & { friendlyMessage?: string }).friendlyMessage =
            messages.join("\n");
        }
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
  data: T[] | PaginatedResponse<T> | { count?: number; results?: T[] } | { results?: T[] },
): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray((data as { results?: T[] }).results)) {
    return (data as { results?: T[] }).results!;
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
