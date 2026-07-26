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

/** App/API pública del holding (login org) — sin secretos. */
export type PublicAvailableApp = {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  tags?: string[];
  logo_url?: string | null;
  icon_url?: string | null;
};

export type PublicSocialLink = {
  url: string;
  icon?: string | null;
  name?: string | null;
  order?: number;
  enabled?: boolean;
};

export type PublicSponsor = {
  name?: string | null;
  logo_url?: string | null;
  website_url?: string | null;
  enabled?: boolean;
  order?: number;
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
  social_links?: PublicSocialLink[] | null;
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
    sponsors?: PublicSponsor[] | null;
  };
};

export type PublicLoginThemeResponse = {
  scope: PublicThemeScope;
  branch_id: number | string | null;
  organization_id?: number | string | null;
  organization_name?: string | null;
  organization_logo_url?: string | null;
  fantasy_name?: string | null;
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
  ui_preferences?: {
    density?: string | null;
    border_radius_px?: number | null;
    font_size_px?: number | null;
    motion_enabled?: boolean | null;
  } | null;
  login_welcome_message?: string | null;
  login_subtitle?: string | null;
  welcome_message?: string | null;
  subtitle?: string | null;
  tagline?: string | null;
  website_url?: string | null;
  brand_description?: string | null;
  social_links?: PublicSocialLink[] | null;
  show_sponsor_logos?: boolean;
  enabled_sponsors?: PublicSponsor[] | null;
  sponsors?: PublicSponsor[] | null;
  login_slug?: string | null;
  custom_domain?: string | null;
  stores?: PublicStoreSummary[] | null;
  available_apps?: PublicAvailableApp[] | null;
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
    theme.fantasy_name ||
    theme.organization_name,
  );
}

/** Copia plana útil para MuninnBrand / applyBranchTheme. */
export function flattenPublicLoginTheme(theme: PublicLoginThemeResponse) {
  const b = theme.branding;
  const prefs = theme.ui_preferences;
  const socialLinks = normalizePublicSocialLinks(theme.social_links ?? b?.social_links ?? null);
  const showSponsors = theme.show_sponsor_logos !== false && b?.login?.show_sponsor_logos !== false;
  const sponsors = normalizePublicSponsors(
    theme.enabled_sponsors ?? theme.sponsors ?? b?.login?.sponsors ?? null,
  );
  return {
    scope: theme.scope,
    branch_id: theme.branch_id,
    organization_id: theme.organization_id ?? null,
    organization_name: theme.organization_name ?? null,
    organization_logo_url: theme.organization_logo_url || null,
    fantasy_name: theme.fantasy_name ?? null,
    app_name: theme.app_name || b?.app_name || null,
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
    website_url: theme.website_url || b?.website_url || null,
    social_links: socialLinks,
    show_sponsor_logos: showSponsors,
    sponsors,
    branding: theme.branding ?? undefined,
    stores: theme.stores ?? null,
    available_apps: Array.isArray(theme.available_apps) ? theme.available_apps : [],
    fallback_from_branch_slug: theme.fallback_from_branch_slug ?? null,
    custom_domain: theme.custom_domain ?? null,
    login_slug: theme.login_slug || b?.login?.slug || null,
    font_size: prefs?.font_size_px ?? null,
    borderRadius: prefs?.border_radius_px ?? null,
    compact: prefs?.density === "compact" ? true : prefs?.density ? false : null,
    motion: typeof prefs?.motion_enabled === "boolean" ? prefs.motion_enabled : null,
    ui_preferences: prefs ?? null,
  };
}

function normalizePublicSocialLinks(
  raw: PublicSocialLink[] | null | undefined,
): PublicSocialLink[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return [...raw]
    .filter((l) => l && typeof l.url === "string" && l.url.trim())
    .map((l, i) => ({
      url: l.url.trim(),
      icon: l.icon ?? "web",
      name: l.name ?? null,
      enabled: l.enabled !== false,
      order: typeof l.order === "number" ? l.order : i + 1,
    }))
    .filter((l) => l.enabled !== false)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

function normalizePublicSponsors(raw: PublicSponsor[] | null | undefined): PublicSponsor[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return [...raw]
    .filter((s) => s && (s.logo_url?.trim() || s.name?.trim()))
    .map((s, i) => ({
      name: s.name?.trim() || null,
      logo_url: s.logo_url?.trim() || null,
      website_url: s.website_url?.trim() || null,
      enabled: s.enabled !== false,
      order: typeof s.order === "number" ? s.order : i + 1,
    }))
    .filter((s) => s.enabled !== false)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}
