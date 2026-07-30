/**
 * Theme Muninn: primary de sucursal sobre shell light/dark (toggle de usuario).
 * No fuerza `.dark` — eso lo maneja ThemeProvider.
 */

import { MUNINN_DEFAULT_THEME, resolveEffectiveTheme } from "@/lib/branchThemeDefaults";
import { resolveMediaUrl } from "@/lib/mediaUrl";
import { getResolvedAppearance, type ResolvedAppearance } from "@/lib/theme";

export interface BranchThemeLike {
  app_name?: string | null;
  tagline?: string | null;
  logo?: string | null;
  logo_url?: string | null;
  favicon?: string | null;
  favicon_url?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  algorithm?: "light" | "dark" | string | null;
  brand_description?: string | null;
  login_welcome_message?: string | null;
  login_subtitle?: string | null;
  welcome_message?: string | null;
  subtitle?: string | null;
  branding?: Record<string, unknown>;
  /** Preferencias de UI (theme-config). */
  font_size?: number | null;
  borderRadius?: number | null;
  compact?: boolean | null;
  motion?: boolean | null;
  ui_preferences?: {
    font_size_px?: number | null;
    border_radius_px?: number | null;
    motion_enabled?: boolean | null;
    density?: string | null;
  } | null;
}

type Rgb = { r: number; g: number; b: number };

let lastAppliedTheme: BranchThemeLike | null = null;

function hexToRgb(hex: string): Rgb | null {
  const cleaned = hex.replace("#", "").trim();
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: Rgb): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return "#" + [clamp(r), clamp(g), clamp(b)].map((n) => n.toString(16).padStart(2, "0")).join("");
}

/** Mezcla opaca: a*(1-t) + b*t — evita hovers rgba translúcidos. */
function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return {
    r: a.r * (1 - t) + b.r * t,
    g: a.g * (1 - t) + b.g * t,
    b: a.b * (1 - t) + b.b * t,
  };
}

function darken(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return rgbToHex(mixRgb(rgb, { r: 0, g: 0, b: 0 }, amount));
}

function tintOnDark(primaryHex: string, amount: number): string {
  const primary = hexToRgb(primaryHex);
  if (!primary) return "#141414";
  return rgbToHex(mixRgb({ r: 0, g: 0, b: 0 }, primary, amount));
}

function tintOnLight(primaryHex: string, amount: number): string {
  const primary = hexToRgb(primaryHex);
  if (!primary) return "#f4f4f5";
  return rgbToHex(mixRgb({ r: 255, g: 255, b: 255 }, primary, amount));
}

function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const lin = [rgb.r, rgb.g, rgb.b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

/**
 * En dark mode, un primary casi negro (#000) deja botones invisibles.
 * Regla genérica (todas las orgs): subir luminancia mínima para UI.
 */
function ensureUsablePrimary(hex: string, appearance: ResolvedAppearance): string {
  const raw = hex.trim() || MUNINN_DEFAULT_THEME.primary_color;
  if (appearance !== "dark") return raw;
  const lum = relativeLuminance(raw);
  if (lum >= 0.12) return raw;
  const rgb = hexToRgb(raw);
  if (!rgb) return raw;
  // Mezclar hacia blanco hasta ~0.18 de luminancia percibida.
  return rgbToHex(mixRgb(rgb, { r: 255, g: 255, b: 255 }, 0.55));
}

function primaryForeground(primaryHex: string): string {
  return relativeLuminance(primaryHex) > 0.4 ? "#000000" : "#ffffff";
}

const PLACEHOLDER_SECONDARIES = new Set(
  ["#ffffff", "#fff", "#000000", "#000"].map((c) => c.toLowerCase()),
);

function resolveDeep(primary: string, secondary?: string | null): string {
  const sec = secondary?.trim();
  if (sec && !PLACEHOLDER_SECONDARIES.has(sec.toLowerCase())) {
    return sec;
  }
  return darken(primary, 0.22);
}

function setFavicon(href: string | null | undefined) {
  if (!href) return;
  const resolved = resolveMediaUrl(href) || href;
  let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = resolved;
}

function setDocumentTitle(theme: BranchThemeLike | null | undefined) {
  const raw = theme?.app_name?.trim();
  const brandingName =
    typeof theme?.branding?.app_name === "string" ? theme.branding.app_name.trim() : "";
  const name = raw || brandingName;
  if (name && name.toLowerCase() !== "muninn" && name.toLowerCase() !== "erp system") {
    document.title = `${name} — Agentes`;
    return;
  }
  document.title = "Muninn — Agentes Especializados";
}

function clearPrimaryOverrides(root: HTMLElement) {
  const keys = [
    "--primary",
    "--primary-deep",
    "--primary-foreground",
    "--primary-soft",
    "--primary-glow",
    "--accent",
    "--ring",
    "--sidebar-primary",
    "--sidebar-primary-foreground",
    "--sidebar-accent",
    "--sidebar-ring",
    "--chart-1",
    "--success",
    "--success-foreground",
    "--success-soft",
    "--bubble-ai",
    "--bubble-ai-foreground",
    "--radius",
  ];
  for (const k of keys) root.style.removeProperty(k);
  root.style.removeProperty("font-size");
  root.removeAttribute("data-compact");
  root.removeAttribute("data-motion");
}

function applyUiPreferences(root: HTMLElement, theme: BranchThemeLike | null | undefined) {
  const prefs = theme?.ui_preferences;
  const radiusPx = theme?.borderRadius ?? prefs?.border_radius_px ?? null;
  const fontPx = theme?.font_size ?? prefs?.font_size_px ?? null;
  const compact =
    theme?.compact ?? (prefs?.density === "compact" ? true : prefs?.density ? false : null);
  const motion =
    theme?.motion ?? (typeof prefs?.motion_enabled === "boolean" ? prefs.motion_enabled : null);

  if (typeof radiusPx === "number" && radiusPx >= 0) {
    root.style.setProperty("--radius", `${radiusPx / 16}rem`);
  } else {
    root.style.removeProperty("--radius");
  }

  if (typeof fontPx === "number" && fontPx >= 10 && fontPx <= 22) {
    root.style.fontSize = `${fontPx}px`;
  } else {
    root.style.removeProperty("font-size");
  }

  if (compact === true) root.setAttribute("data-compact", "true");
  else root.removeAttribute("data-compact");

  if (motion === false) root.setAttribute("data-motion", "off");
  else root.removeAttribute("data-motion");
}

/** Restaura primary mint por defecto (respeta light/dark CSS). */
export function resetMuninnTheme(): void {
  lastAppliedTheme = null;
  clearPrimaryOverrides(document.documentElement);
  applyBranchTheme({ ...MUNINN_DEFAULT_THEME });
}

/**
 * Clava primary (+ soft/accent) y preferencias de UI (radius, font, compact, motion).
 * No toca class `.dark` ni superficies (las define styles.css).
 */
export function applyBranchTheme(theme: BranchThemeLike | null | undefined): void {
  const root = document.documentElement;
  lastAppliedTheme = theme ? { ...theme } : null;

  const appearance: ResolvedAppearance = getResolvedAppearance();
  const defaultPrimary = appearance === "dark" ? "#2dd4bf" : "#0d9488";
  const primary = ensureUsablePrimary(
    theme?.primary_color?.trim() || MUNINN_DEFAULT_THEME.primary_color || defaultPrimary,
    appearance,
  );
  const deep = resolveDeep(primary, theme?.secondary_color);
  const onPrimary = primaryForeground(primary);
  const soft = appearance === "dark" ? tintOnDark(primary, 0.14) : tintOnLight(primary, 0.12);
  const glow = darken(primary, appearance === "dark" ? 0.12 : 0.08);
  const accent = appearance === "dark" ? tintOnDark(primary, 0.16) : tintOnLight(primary, 0.1);
  const ring = appearance === "dark" ? tintOnDark(primary, 0.45) : tintOnLight(primary, 0.35);
  const bubbleFg = appearance === "dark" ? "#f0f0f0" : "#134e4a";

  root.style.setProperty("--primary", primary);
  root.style.setProperty("--primary-deep", deep);
  root.style.setProperty("--primary-foreground", onPrimary);
  root.style.setProperty("--primary-soft", soft);
  root.style.setProperty("--primary-glow", glow);
  root.style.setProperty("--accent", accent);
  root.style.setProperty("--ring", ring);
  root.style.setProperty("--sidebar-primary", primary);
  root.style.setProperty("--sidebar-primary-foreground", onPrimary);
  root.style.setProperty("--sidebar-accent", accent);
  root.style.setProperty("--sidebar-ring", ring);
  root.style.setProperty("--chart-1", primary);
  root.style.setProperty("--success", primary);
  root.style.setProperty("--success-foreground", onPrimary);
  root.style.setProperty("--success-soft", soft);
  root.style.setProperty("--bubble-ai", soft);
  root.style.setProperty("--bubble-ai-foreground", bubbleFg);

  applyUiPreferences(root, theme);
  setFavicon(theme?.favicon_url || theme?.favicon || null);
  setDocumentTitle(theme);
}

/** Reaplica primary al cambiar light/dark. */
export function refreshBranchThemeForAppearance(): void {
  if (lastAppliedTheme) {
    applyBranchTheme(lastAppliedTheme);
  }
}

export function applyResolvedBranchTheme(
  apiTheme: BranchThemeLike | null | undefined,
  branchLabel?: string | null,
): BranchThemeLike {
  const effective = resolveEffectiveTheme(apiTheme, branchLabel);
  applyBranchTheme(effective);
  return effective;
}

export function resolveThemeLogo(theme: BranchThemeLike | null | undefined): string | null {
  if (!theme) return null;

  const branding = theme.branding;
  const raw =
    theme.logo_url ||
    theme.logo ||
    (typeof branding?.logo_url === "string" ? branding.logo_url : null) ||
    (typeof branding?.logo === "string" ? branding.logo : null) ||
    null;

  if (!raw || typeof raw !== "string") return null;
  const resolved = resolveMediaUrl(raw);
  return resolved || null;
}
