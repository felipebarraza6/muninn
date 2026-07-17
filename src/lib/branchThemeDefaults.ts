import type { BranchThemeLike } from "@/lib/applyBranchTheme";

/** Defaults de fábrica del backend (no cuentan como branding propio). */
export const PLACEHOLDER_PRIMARIES = new Set(["#000000", "#1890ff"].map((c) => c.toLowerCase()));

export const MUNINN_DEFAULT_THEME = {
  app_name: "Muninn",
  primary_color: "#2dd4bf",
  secondary_color: "#0d9488",
  algorithm: "dark" as const,
};

type LocalBase = {
  app_name: string;
  primary_color: string;
  secondary_color: string;
  algorithm: "dark";
};

/** Bases locales por sucursal demo (cuando el theme API es placeholder/ausente). */
const BRANCH_BASE_THEMES: Record<string, LocalBase> = {
  "bizantni gelato": {
    app_name: "Bizantni Gelato",
    primary_color: "#C4784A",
    secondary_color: "#8B4513",
    algorithm: "dark",
  },
  "smart hydro": {
    app_name: "Smart Hydro",
    primary_color: "#0284C7",
    secondary_color: "#0369A1",
    algorithm: "dark",
  },
  "sucursal demo norte": {
    app_name: "Sucursal Demo Norte",
    primary_color: "#16A34A",
    secondary_color: "#15803D",
    algorithm: "dark",
  },
  "sucursal demo sur": {
    app_name: "Sucursal Demo Sur",
    primary_color: "#D97706",
    secondary_color: "#B45309",
    algorithm: "dark",
  },
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

/** True si la sucursal tiene branding propio (logo o primary no placeholder). */
export function isCustomBranchTheme(theme: BranchThemeLike | null | undefined): boolean {
  if (!theme) return false;
  if (themeLogoOrFavicon(theme)) return true;
  const primary = theme.primary_color?.trim().toLowerCase();
  if (!primary) return false;
  return !PLACEHOLDER_PRIMARIES.has(primary);
}

export function getLocalBaseTheme(branchLabel?: string | null): BranchThemeLike {
  const key = normalizeBranchLabel(branchLabel);
  if (key && BRANCH_BASE_THEMES[key]) {
    return { ...BRANCH_BASE_THEMES[key] };
  }
  // Match parcial: "bizantni gelato spa" → bizantni gelato
  if (key) {
    for (const [mapKey, base] of Object.entries(BRANCH_BASE_THEMES)) {
      if (key.includes(mapKey) || mapKey.includes(key)) {
        return { ...base };
      }
    }
  }
  return { ...MUNINN_DEFAULT_THEME };
}

/**
 * Theme custom de API → tal cual.
 * Placeholder / ausente → base local por nombre de sucursal (o Muninn).
 */
export function resolveEffectiveTheme(
  apiTheme: BranchThemeLike | null | undefined,
  branchLabel?: string | null,
): BranchThemeLike {
  const labelHint = branchLabel || apiTheme?.app_name || null;

  // Solo se toman primary/logo de la sucursal; light/dark lo decide el toggle del usuario.
  if (isCustomBranchTheme(apiTheme)) {
    return {
      ...apiTheme,
      primary_color: apiTheme!.primary_color?.trim() || getLocalBaseTheme(labelHint).primary_color,
      secondary_color:
        apiTheme!.secondary_color?.trim() || getLocalBaseTheme(labelHint).secondary_color,
      algorithm: "dark",
    };
  }

  const base = getLocalBaseTheme(labelHint);
  if (!apiTheme) return { ...base, algorithm: "dark" };

  return {
    ...base,
    app_name: apiTheme.app_name || base.app_name,
    tagline: apiTheme.tagline || undefined,
    // Conservar assets aunque el primary sea placeholder (p. ej. logo del holding).
    logo: apiTheme.logo ?? base.logo,
    logo_url: apiTheme.logo_url ?? base.logo_url,
    favicon: apiTheme.favicon ?? base.favicon,
    favicon_url: apiTheme.favicon_url ?? base.favicon_url,
    branding: apiTheme.branding ?? base.branding,
    algorithm: "dark",
  };
}
