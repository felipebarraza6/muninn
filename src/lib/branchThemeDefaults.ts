import type { BranchThemeLike } from "@/lib/applyBranchTheme";

/**
 * Defaults de fábrica del backend (no cuentan como branding propio).
 * No incluir #000000: negro es color de marca válido.
 */
export const PLACEHOLDER_PRIMARIES = new Set(["#1890ff"].map((c) => c.toLowerCase()));

export const MUNINN_DEFAULT_THEME = {
  app_name: "Muninn",
  primary_color: "#2dd4bf",
  secondary_color: "#0d9488",
  algorithm: "dark" as const,
};

export function normalizeBranchLabel(name: string | null | undefined): string {
  if (!name) return "";
  return name
    .toLowerCase()
    .trim()
    .replace(/\s*-\s*erp\s*$/i, "")
    .replace(/\s+/g, " ");
}

function hasUsableAsset(value: string | null | undefined): boolean {
  if (!value || typeof value !== "string") return false;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed !== "null" && trimmed !== "undefined";
}

function themeLogoOrFavicon(theme: BranchThemeLike | null | undefined): boolean {
  if (!theme) return false;
  const branding = (theme as { branding?: Record<string, unknown> }).branding;
  return (
    hasUsableAsset(theme.logo_url) ||
    hasUsableAsset(theme.logo) ||
    hasUsableAsset(theme.favicon_url) ||
    hasUsableAsset(theme.favicon) ||
    (typeof branding?.logo_url === "string" && hasUsableAsset(branding.logo_url)) ||
    (typeof branding?.logo === "string" && hasUsableAsset(branding.logo))
  );
}

/** True si el tenant tiene branding propio (logo o primary no placeholder). */
export function isCustomBranchTheme(theme: BranchThemeLike | null | undefined): boolean {
  if (!theme) return false;
  if (themeLogoOrFavicon(theme)) return true;
  const primary = theme.primary_color?.trim().toLowerCase();
  if (!primary) return false;
  return !PLACEHOLDER_PRIMARIES.has(primary);
}

/** Base genérica — sin excepciones por nombre de org/sucursal. */
export function getLocalBaseTheme(_branchLabel?: string | null): BranchThemeLike {
  return { ...MUNINN_DEFAULT_THEME };
}

/**
 * Theme custom de API → tal cual (colores del tenant).
 * Ausente / no usable → Muninn default (nunca hardcode por nombre).
 */
export function resolveEffectiveTheme(
  apiTheme: BranchThemeLike | null | undefined,
  _branchLabel?: string | null,
): BranchThemeLike {
  if (isCustomBranchTheme(apiTheme)) {
    return {
      ...apiTheme,
      primary_color: apiTheme!.primary_color?.trim() || MUNINN_DEFAULT_THEME.primary_color,
      secondary_color: apiTheme!.secondary_color?.trim() || MUNINN_DEFAULT_THEME.secondary_color,
      algorithm: "dark",
    };
  }

  if (!apiTheme) return { ...MUNINN_DEFAULT_THEME, algorithm: "dark" };

  return {
    ...MUNINN_DEFAULT_THEME,
    app_name: apiTheme.app_name || MUNINN_DEFAULT_THEME.app_name,
    tagline: apiTheme.tagline || undefined,
    logo: apiTheme.logo ?? undefined,
    logo_url: apiTheme.logo_url ?? undefined,
    favicon: apiTheme.favicon ?? undefined,
    favicon_url: apiTheme.favicon_url ?? undefined,
    branding: apiTheme.branding ?? undefined,
    algorithm: "dark",
  };
}
