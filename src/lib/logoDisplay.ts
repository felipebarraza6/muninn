/**
 * Reglas de visualización de logos de tenant en dark mode.
 * Solo invertimos PNGs (o WebP) con canal alpha real — si el PNG es opaco,
 * invert deja un cuadrado blanco.
 */

export function isLikelyRasterWithAlphaSupport(url: string): boolean {
  const path = url.split("?")[0].toLowerCase();
  return (
    path.endsWith(".png") ||
    path.endsWith(".webp") ||
    path.includes(".png") ||
    path.includes(".webp") ||
    path.startsWith("data:image/png") ||
    path.startsWith("data:image/webp")
  );
}

/** Muestrea el canvas: true si hay píxeles con alpha &lt; 250. */
export function canvasHasTransparency(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): boolean {
  if (width <= 0 || height <= 0) return false;
  try {
    const { data } = ctx.getImageData(0, 0, width, height);
    // Muestreo cada N píxeles para no bloquear con logos grandes.
    const step = Math.max(1, Math.floor(data.length / 4 / 4000));
    for (let i = 3; i < data.length; i += 4 * step) {
      if (data[i]! < 250) return true;
    }
  } catch {
    // Canvas tainted (CORS) → no arriesgar invert.
    return false;
  }
  return false;
}

/**
 * Detecta transparencia real del logo.
 * - JPEG/sin alpha → false
 * - PNG/WebP con alpha → true
 * - CORS/tainted → false (no invert)
 */
export function probeLogoNeedsDarkInvert(url: string): Promise<boolean> {
  const src = (url || "").trim();
  if (!src) return Promise.resolve(false);
  if (!isLikelyRasterWithAlphaSupport(src)) return Promise.resolve(false);

  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    // Misma origen /media proxied → ok; externos pueden taint.
    if (/^https?:\/\//i.test(src) && typeof window !== "undefined") {
      try {
        const u = new URL(src, window.location.href);
        if (u.origin !== window.location.origin) {
          img.crossOrigin = "anonymous";
        }
      } catch {
        /* ignore */
      }
    }

    img.onload = () => {
      const w = Math.min(img.naturalWidth || 0, 256);
      const h = Math.min(img.naturalHeight || 0, 256);
      if (!w || !h) {
        resolve(false);
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        resolve(false);
        return;
      }
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvasHasTransparency(ctx, w, h));
    };
    img.onerror = () => resolve(false);
    img.src = src;
  });
}
