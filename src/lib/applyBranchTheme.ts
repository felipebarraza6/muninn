/**
 * Theme Huginn: shell siempre dark.
 * Solo se clava --primary (y derivados sólidos). Nunca invertir superficies/texto.
 */

import { HUGINN_DEFAULT_THEME, resolveEffectiveTheme } from "@/lib/branchThemeDefaults";

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
}

type Rgb = { r: number; g: number; b: number };

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

/** Tinte sólido de primary sobre el canvas dark (sin alpha). */
function tintOnDark(primaryHex: string, amount: number): string {
  const primary = hexToRgb(primaryHex);
  if (!primary) return "#141414";
  return rgbToHex(mixRgb({ r: 0, g: 0, b: 0 }, primary, amount));
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

/** Texto sobre primary sólido: negro si el accent es claro, blanco si es oscuro. */
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
  let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = href;
}

/** Restaura la paleta mint Huginn (dark). */
export function resetHuginnTheme(): void {
  applyBranchTheme({ ...HUGINN_DEFAULT_THEME });
}

/**
 * Aplica solo el primary de sucursal sobre shell dark fijo.
 * Ignora algorithm light del API (Huginn no invierte textos/superficies).
 */
export function applyBranchTheme(theme: BranchThemeLike | null | undefined): void {
  const root = document.documentElement;
  const primary = theme?.primary_color?.trim() || HUGINN_DEFAULT_THEME.primary_color;
  const deep = resolveDeep(primary, theme?.secondary_color);
  const onPrimary = primaryForeground(primary);
  const soft = tintOnDark(primary, 0.14);
  const glow = darken(primary, 0.12); // hover sólido del botón primary
  const accent = tintOnDark(primary, 0.16);
  const ring = tintOnDark(primary, 0.45);

  // Shell siempre dark — no tocar light
  root.classList.add("dark");
  root.classList.remove("light");

  // Superficies dark fijas (opacas)
  root.style.setProperty("--background", "#000000");
  root.style.setProperty("--foreground", "#f0f0f0");
  root.style.setProperty("--card", "#0a0a0a");
  root.style.setProperty("--card-foreground", "#f0f0f0");
  root.style.setProperty("--popover", "#0a0a0a");
  root.style.setProperty("--popover-foreground", "#f0f0f0");
  root.style.setProperty("--muted", "#141414");
  root.style.setProperty("--muted-foreground", "#a3a3a3");
  root.style.setProperty("--secondary", "#141414");
  root.style.setProperty("--secondary-foreground", "#f0f0f0");
  root.style.setProperty("--border", "#1f1f1f");
  root.style.setProperty("--input", "#1f1f1f");
  root.style.setProperty("--sidebar", "#000000");
  root.style.setProperty("--sidebar-foreground", "#f0f0f0");
  root.style.setProperty("--sidebar-border", "#1f1f1f");
  root.style.setProperty("--accent-foreground", "#f0f0f0");
  root.style.setProperty("--sidebar-accent-foreground", "#f0f0f0");

  // Solo clavar primary + derivados sólidos
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
  root.style.setProperty("--bubble-ai", soft);
  root.style.setProperty("--bubble-ai-foreground", "#f0f0f0");

  setFavicon(theme?.favicon_url || theme?.favicon || null);
}

/** Aplica el theme efectivo (custom API o base local) en shell dark. */
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
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("/")) {
    const api =
      import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
      (import.meta.env.DEV ? "" : "https://api.agenciapatagoniachile.com");
    const origin = import.meta.env.DEV
      ? (import.meta.env.VITE_DEV_API_PROXY || "http://localhost:8000").replace(/\/$/, "")
      : api.replace(/\/$/, "");
    return `${origin}${trimmed}`;
  }

  return trimmed;
}
