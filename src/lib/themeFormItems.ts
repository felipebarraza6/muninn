/** Helpers compartidos para formularios de marca (org / sucursal). */

export type ThemeSponsorItem = {
  key: string;
  name: string;
  logo_url: string;
  website_url: string;
  enabled: boolean;
  order: number;
};

export type ThemeSocialLinkItem = {
  key: string;
  name: string;
  url: string;
  icon: string;
  enabled: boolean;
  order: number;
};

export const SOCIAL_ICON_OPTIONS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "twitter", label: "X / Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "web", label: "Web" },
  { value: "other", label: "Otro" },
] as const;

export function newThemeSponsor(partial?: Partial<ThemeSponsorItem>): ThemeSponsorItem {
  return {
    key: `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    logo_url: "",
    website_url: "",
    enabled: true,
    order: 1,
    ...partial,
  };
}

export function newThemeSocialLink(partial?: Partial<ThemeSocialLinkItem>): ThemeSocialLinkItem {
  return {
    key: `l-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    url: "",
    icon: "web",
    enabled: true,
    order: 1,
    ...partial,
  };
}

export function normalizeThemeSponsors(
  raw:
    | Array<{
        name?: string;
        logo_url?: string;
        website_url?: string;
        enabled?: boolean;
        order?: number;
      }>
    | null
    | undefined,
): ThemeSponsorItem[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return [...raw]
    .map((s, i) =>
      newThemeSponsor({
        name: s.name || "",
        logo_url: s.logo_url || "",
        website_url: s.website_url || "",
        enabled: s.enabled !== false,
        order: typeof s.order === "number" ? s.order : i + 1,
      }),
    )
    .sort((a, b) => a.order - b.order);
}

export function normalizeThemeSocialLinks(
  raw:
    | Array<{
        name?: string;
        url?: string;
        icon?: string | null;
        enabled?: boolean;
        order?: number;
      }>
    | null
    | undefined,
): ThemeSocialLinkItem[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return [...raw]
    .map((s, i) =>
      newThemeSocialLink({
        name: s.name || "",
        url: s.url || "",
        icon: (s.icon || "web").toLowerCase(),
        enabled: s.enabled !== false,
        order: typeof s.order === "number" ? s.order : i + 1,
      }),
    )
    .sort((a, b) => a.order - b.order);
}
