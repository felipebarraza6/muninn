import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { GOTHAM_LAYERS, gothamLayerSrc, type GothamMood } from "@/lib/gothamAssets";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  mood?: GothamMood;
  /** Parallax suave al scroll (solo capas far/mid/near). */
  parallax?: boolean;
  /** Lluvia canvas ligera encima. */
  rain?: boolean;
};

/**
 * Ciudad pixel por capas PNG estáticas (Aseprite).
 * Astro-ready: cero estado de negocio; solo presentacional.
 */
export function PixelCityLayers({
  className,
  mood = "gotham",
  parallax = false,
  rain = true,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const batcave = mood === "batcave";

  useEffect(() => {
    if (!parallax || reduceMotion || batcave) return;
    const root = rootRef.current;
    if (!root) return;

    let raf = 0;
    const apply = () => {
      raf = 0;
      const y = window.scrollY;
      root.style.setProperty("--nordic-par-far", `${Math.min(y * 0.05, 24)}px`);
      root.style.setProperty("--nordic-par-mid", `${Math.min(y * 0.12, 40)}px`);
      root.style.setProperty("--nordic-par-near", `${Math.min(y * 0.22, 64)}px`);
    };

    const onScroll = () => {
      if (raf) window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [parallax, reduceMotion, batcave]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden gotham-layers",
        batcave && "gotham-layers--batcave",
        parallax && !reduceMotion && !batcave && "gotham-layers--parallax",
        className,
      )}
      aria-hidden
    >
      <div className="gotham-layers__sky-fallback absolute inset-0" />

      {GOTHAM_LAYERS.map((layer) => (
        <img
          key={layer}
          src={gothamLayerSrc(layer, mood)}
          alt=""
          draggable={false}
          className={cn(
            "gotham-layers__img absolute inset-x-0 pointer-events-none",
            `gotham-layers__img--${layer}`,
          )}
        />
      ))}

      {rain && !reduceMotion && <GothamRainCanvas />}

      <div className="gotham-layers__veil absolute inset-0" />
      <div className="gotham-layers__vignette absolute inset-0" />
    </div>
  );
}

function GothamRainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let frame = 0;
    let w = 0;
    let h = 0;
    type Drop = { x: number; y: number; len: number; speed: number; drift: number };
    let drops: Drop[] = [];

    const spawn = (anywhere = false): Drop => ({
      x: Math.random() * (w + 40) - 20,
      y: anywhere ? Math.random() * h : -20,
      len: 10 + Math.random() * 16,
      speed: 5 + Math.random() * 5,
      drift: (Math.random() - 0.5) * 0.25,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = w;
      canvas.height = h;
      const mobile = window.matchMedia("(max-width: 1023px)").matches;
      drops = Array.from({ length: mobile ? 28 : 40 }, () => spawn(true));
    };

    const tick = () => {
      if (!running) return;
      frame++;
      if (frame % 2 === 1) {
        raf = window.requestAnimationFrame(tick);
        return;
      }
      ctx.clearRect(0, 0, w, h);
      const uiBand = h * 0.4;
      ctx.beginPath();
      for (const d of drops) {
        d.x += d.drift;
        d.y += d.speed;
        if (d.y > h + 10) {
          Object.assign(d, spawn(false));
          d.y = -8;
        }
        if (d.y < uiBand * 0.5) continue;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.drift, d.y + d.len);
      }
      ctx.strokeStyle = "rgba(200, 240, 235, 0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();
      raf = window.requestAnimationFrame(tick);
    };

    const onVis = () => {
      if (document.hidden) {
        running = false;
        window.cancelAnimationFrame(raf);
      } else {
        running = true;
        raf = window.requestAnimationFrame(tick);
      }
    };

    resize();
    raf = window.requestAnimationFrame(tick);
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
      aria-hidden
    />
  );
}
