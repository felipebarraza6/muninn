/** Aplica el theme de sucursal sobre el shell Huginn (CSS vars + favicon). */

const HUGINN_PRIMARY = "#2dd4bf";
const HUGINN_PRIMARY_DEEP = "#0d9488";

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
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
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

function softFrom(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return `rgba(45, 212, 191, ${alpha})`;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
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

/** Restaura la paleta mint Huginn por defecto. */
export function resetHuginnTheme(): void {
  applyBranchTheme({
    primary_color: HUGINN_PRIMARY,
    secondary_color: HUGINN_PRIMARY_DEEP,
    algorithm: "dark",
  });
}

export function applyBranchTheme(theme: BranchThemeLike | null | undefined): void {
  const root = document.documentElement;
  const primary = theme?.primary_color?.trim() || HUGINN_PRIMARY;
  const secondary = theme?.secondary_color?.trim() || HUGINN_PRIMARY_DEEP;
  const algorithm = theme?.algorithm === "light" ? "light" : "dark";

  root.classList.toggle("dark", algorithm === "dark");
  root.classList.toggle("light", algorithm === "light");

  root.style.setProperty("--primary", primary);
  root.style.setProperty("--primary-deep", secondary);
  root.style.setProperty("--primary-soft", softFrom(primary, 0.12));
  root.style.setProperty("--primary-glow", softFrom(primary, 0.18));
  root.style.setProperty("--primary-foreground", algorithm === "light" ? "#000000" : "#000000");
  root.style.setProperty("--ring", softFrom(primary, 0.4));
  root.style.setProperty("--accent", softFrom(primary, 0.1));
  root.style.setProperty("--sidebar-primary", primary);
  root.style.setProperty("--sidebar-accent", softFrom(primary, 0.1));
  root.style.setProperty("--sidebar-ring", softFrom(primary, 0.4));
  root.style.setProperty("--chart-1", primary);
  root.style.setProperty("--success", primary);
  root.style.setProperty("--bubble-ai", softFrom(primary, 0.12));

  if (algorithm === "light") {
    root.style.setProperty("--background", "#f8fafc");
    root.style.setProperty("--foreground", "#0f172a");
    root.style.setProperty("--card", "#ffffff");
    root.style.setProperty("--card-foreground", "#0f172a");
    root.style.setProperty("--muted", "#f1f5f9");
    root.style.setProperty("--muted-foreground", "#64748b");
    root.style.setProperty("--border", "rgba(15, 23, 42, 0.08)");
    root.style.setProperty("--sidebar", "#ffffff");
    root.style.setProperty("--sidebar-foreground", "#0f172a");
    root.style.setProperty("--sidebar-border", "rgba(15, 23, 42, 0.08)");
  } else {
    root.style.setProperty("--background", "#000000");
    root.style.setProperty("--foreground", "#f0f0f0");
    root.style.setProperty("--card", "rgba(255, 255, 255, 0.03)");
    root.style.setProperty("--card-foreground", "#f0f0f0");
    root.style.setProperty("--muted", "rgba(255, 255, 255, 0.06)");
    root.style.setProperty("--muted-foreground", "rgba(240, 240, 240, 0.45)");
    root.style.setProperty("--border", "rgba(255, 255, 255, 0.06)");
    root.style.setProperty("--sidebar", "#000000");
    root.style.setProperty("--sidebar-foreground", "#f0f0f0");
    root.style.setProperty("--sidebar-border", "rgba(255, 255, 255, 0.06)");
  }

  setFavicon(theme?.favicon_url || theme?.favicon || null);
}

export function resolveThemeLogo(theme: BranchThemeLike | null | undefined): string | null {
  return theme?.logo_url || theme?.logo || null;
}
