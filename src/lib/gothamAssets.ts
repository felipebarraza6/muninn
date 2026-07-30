/**
 * Assets estáticos de la ciudad Gotham (landing).
 * Exportar desde Aseprite → public/brand/gotham/*.png
 *
 * Cuando tengas los PNG, cambiá esto a `true`.
 */
export const GOTHAM_USE_STATIC_LAYERS = false;

export type GothamMood = "gotham" | "batcave";

export type GothamLayerId = "sky" | "far" | "mid" | "near";

const BASE = "/brand/gotham";

/** Rutas públicas (Vite sirve `public/` en `/`). */
export function gothamLayerSrc(layer: GothamLayerId, mood: GothamMood = "gotham"): string {
  if (mood === "batcave") {
    // Fallback: mismas capas; CSS --batcave oscurece. Si exportás variantes, usá:
    // return `${BASE}/${layer}-batcave.png`;
  }
  return `${BASE}/${layer}.png`;
}

export const GOTHAM_LAYERS: GothamLayerId[] = ["sky", "far", "mid", "near"];
