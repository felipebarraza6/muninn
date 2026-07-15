/**
 * Tipos del theme de login público (Yggdra).
 * Endpoints: by-host, public-login-theme/{slug}, public-org-login-theme/{slug}.
 */

export type PublicThemeScope = "branch" | "organization";

export type PublicStoreSummary = {
  id: number;
  name: string;
  commune?: string;
  region?: string;
};

export type PublicThemeBranding = {
  app_name?: string | null;
  tagline?: string | null;
  brand_description?: string | null;
  colors?: {
    primary?: string | null;
    secondary?: string | null;
    background?: string | null;
  };
  color_mode?: string | null;
  logo_url?: string | null;
  favicon_url?: string | null;
  banner_image_url?: string | null;
  website_url?: string | null;
  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  login?: {
    slug?: string | null;
    welcome_message?: string | null;
    subtitle?: string | null;
    show_sponsor_logos?: boolean;
    sponsors?: unknown;
  };
};

export type PublicLoginThemeResponse = {
  scope: PublicThemeScope;
  branch_id: number | string | null;
  organization_id?: number | string | null;
  organization_name?: string | null;
  app_name?: string | null;
  branch_name?: string | null;
  logo?: string | null;
  logo_url?: string | null;
  favicon?: string | null;
  favicon_url?: string | null;
  banner_image_url?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  color_mode?: string | null;
  algorithm?: string | null;
  branding?: PublicThemeBranding | null;
  ui_preferences?: Record<string, unknown> | null;
  login_welcome_message?: string | null;
  login_subtitle?: string | null;
  welcome_message?: string | null;
  subtitle?: string | null;
  tagline?: string | null;
  website_url?: string | null;
  brand_description?: string | null;
  login_slug?: string | null;
  custom_domain?: string | null;
  stores?: PublicStoreSummary[] | null;
  fallback_from_branch_slug?: string | null;
};

export function hasUsablePublicBranding(
  theme: PublicLoginThemeResponse | null | undefined,
): boolean {
  if (!theme) return false;
  if (theme.branding) {
    const colors = theme.branding.colors;
    if (colors?.primary || theme.branding.logo_url) return true;
    if (theme.branding.app_name) return true;
  }
  return Boolean(
    theme.primary_color ||
    theme.logo_url ||
    theme.logo ||
    theme.app_name ||
    theme.organization_name,
  );
}

/** Copia plana útil para MuninnBrand / applyBranchTheme. */
export function flattenPublicLoginTheme(theme: PublicLoginThemeResponse) {
  const b = theme.branding;
  return {
    scope: theme.scope,
    branch_id: theme.branch_id,
    organization_id: theme.organization_id ?? null,
    organization_name: theme.organization_name ?? null,
    app_name: theme.app_name || b?.app_name || theme.organization_name || theme.branch_name || null,
    branch_name: theme.branch_name ?? null,
    tagline: theme.tagline || b?.tagline || null,
    primary_color: theme.primary_color || b?.colors?.primary || null,
    secondary_color: theme.secondary_color || b?.colors?.secondary || null,
    algorithm: theme.algorithm || theme.color_mode || b?.color_mode || null,
    logo: theme.logo || null,
    logo_url: theme.logo_url || b?.logo_url || null,
    favicon: theme.favicon || null,
    favicon_url: theme.favicon_url || b?.favicon_url || null,
    login_welcome_message:
      theme.login_welcome_message || theme.welcome_message || b?.login?.welcome_message || null,
    login_subtitle: theme.login_subtitle || theme.subtitle || b?.login?.subtitle || null,
    welcome_message: theme.welcome_message || b?.login?.welcome_message || null,
    subtitle: theme.subtitle || b?.login?.subtitle || null,
    brand_description: theme.brand_description || b?.brand_description || null,
    branding: theme.branding ?? undefined,
    stores: theme.stores ?? null,
    fallback_from_branch_slug: theme.fallback_from_branch_slug ?? null,
    custom_domain: theme.custom_domain ?? null,
    login_slug: theme.login_slug || b?.login?.slug || null,
  };
}
