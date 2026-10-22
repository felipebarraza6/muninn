/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_APP_ENV?: string;
  readonly VITE_BASE_PATH?: string;
  readonly VITE_WIDGET_BASE_URL?: string;
  readonly VITE_REALTIME_URL?: string;
  readonly VITE_DEV_API_PROXY?: string;
  /** `cookie` (HttpOnly + CSRF) o `token` (memoria, default). */
  readonly VITE_AUTH_MODE?: "cookie" | "token" | string;
  /** `mock` usa cifras de ejemplo. Vacío o `live` llama a la API. */
  readonly VITE_COMMERCIAL_API?: "mock" | "live" | string;
  readonly VITE_PWA_NAME?: string;
  readonly VITE_PWA_THEME_COLOR?: string;
}
