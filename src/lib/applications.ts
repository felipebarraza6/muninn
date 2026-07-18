/** Identidad visual de “Aplicaciones” (store) — solo UI. */

export const APP_STORE_LABEL = "Aplicaciones";
export const APP_STORE_PATH = "/aplicaciones";

const APP_ICON_PALETTES = [
  { from: "from-teal-500/35", to: "to-teal-500/5", text: "text-teal-300", ring: "ring-teal-500/30" },
  { from: "from-cyan-500/30", to: "to-emerald-500/5", text: "text-cyan-300", ring: "ring-cyan-500/25" },
  { from: "from-emerald-500/30", to: "to-teal-500/5", text: "text-emerald-300", ring: "ring-emerald-500/25" },
  { from: "from-sky-500/30", to: "to-teal-500/5", text: "text-sky-300", ring: "ring-sky-500/25" },
  { from: "from-amber-500/25", to: "to-orange-500/5", text: "text-amber-300", ring: "ring-amber-500/25" },
  { from: "from-rose-500/25", to: "to-teal-500/5", text: "text-rose-300", ring: "ring-rose-500/20" },
  { from: "from-slate-400/30", to: "to-teal-500/5", text: "text-slate-200", ring: "ring-slate-400/25" },
] as const;

export type AppIconPalette = (typeof APP_ICON_PALETTES)[number];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function appInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "App";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function appIconPalette(name: string): AppIconPalette {
  return APP_ICON_PALETTES[hashString(name || "app") % APP_ICON_PALETTES.length];
}

export function hostFromUrl(url?: string): string {
  if (!url) return "Sin URL";
  try {
    return new URL(url).host;
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0] || url;
  }
}
