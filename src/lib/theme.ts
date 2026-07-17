/**
 * Preferencia de apariencia (light / dark / system).
 * Drive Tailwind dark variant via class `.dark` on <html>.
 * @see https://tailwindcss.com/docs/dark-mode
 */

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedAppearance = "light" | "dark";

export const THEME_STORAGE_KEY = "muninn-theme";
const LEGACY_THEME_STORAGE_KEY = "huginn-theme";

const MEDIA = "(prefers-color-scheme: dark)";

export function getSystemAppearance(): ResolvedAppearance {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia(MEDIA).matches ? "dark" : "light";
}

export function getStoredThemePreference(): ThemePreference {
  if (typeof window === "undefined") return "dark";
  try {
    const raw =
      localStorage.getItem(THEME_STORAGE_KEY) ?? localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    if (raw === "light" || raw === "dark" || raw === "system") return raw;
  } catch {
    // ignore
  }
  return "dark";
}

export function resolveAppearance(preference: ThemePreference): ResolvedAppearance {
  if (preference === "system") return getSystemAppearance();
  return preference;
}

/** Aplica `.dark` en <html> según preferencia. */
export function applyAppearanceClass(preference: ThemePreference): ResolvedAppearance {
  const resolved = resolveAppearance(preference);
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.classList.remove("light");
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
  return resolved;
}

export function persistThemePreference(preference: ThemePreference): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
    localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function getResolvedAppearance(): ResolvedAppearance {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function subscribeSystemAppearance(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(MEDIA);
  const handler = () => onChange();
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}
