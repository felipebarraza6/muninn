import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { dispatchMuninnLiveDemo } from "@/lib/muninnLiveDemo";
import { cn } from "@/lib/utils";

type Flake = {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  phase: number;
  opacity: number;
};

/**
 * Nieve Canvas 2D — copos cuadrados pixel, caída lenta con deriva.
 * Más densos abajo (primer plano), sutil arriba (zona de UI).
 */
function PixelSnowCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let flakes: Flake[] = [];
    let w = 0;
    let h = 0;
    let frame = 0;

    const spawn = (anywhere = false): Flake => ({
      x: Math.random() * (w + 40) - 20,
      y: anywhere ? Math.random() * h : -8 - Math.random() * 40,
      size: Math.random() < 0.72 ? 1 : 2,
      speed: 0.35 + Math.random() * 0.75,
      drift: 0.25 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.3 + Math.random() * 0.5,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = w;
      canvas.height = h;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const mobile = window.matchMedia("(max-width: 1023px)").matches;
      flakes = Array.from({ length: mobile ? 60 : 90 }, () => spawn(true));
    };

    const tick = () => {
      if (!running) return;
      frame++;
      ctx.clearRect(0, 0, w, h);
      const uiBand = h * 0.3;
      for (const f of flakes) {
        f.phase += 0.012;
        f.x += Math.sin(f.phase) * f.drift * 0.35;
        f.y += f.speed;
        if (f.y > h + 6) {
          Object.assign(f, spawn(false));
        }
        if (f.x > w + 10) f.x = -8;
        if (f.x < -10) f.x = w + 8;
        const fade = f.y < uiBand ? 0.4 + (f.y / uiBand) * 0.6 : 1;
        ctx.globalAlpha = f.opacity * fade;
        ctx.fillRect(Math.round(f.x), Math.round(f.y), f.size, f.size);
      }
      ctx.globalAlpha = 1;
      raf = window.requestAnimationFrame(tick);
    };

    const onVisibility = () => {
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
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      style={{ filter: "brightness(1.1)" }}
    />
  );
}

/** Cuervo Muninn en vuelo (silueta pixel). */
function PixelRavenFlight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 10"
      shapeRendering="crispEdges"
      className={cn("h-full w-full", className)}
      aria-hidden
    >
      <g fill="currentColor">
        {/* cuerpo */}
        <rect x="7" y="4" width="4" height="2" />
        <rect x="10" y="3" width="2" height="2" />
        {/* pico */}
        <rect x="12" y="4" width="2" height="1" />
        {/* cola */}
        <rect x="5" y="5" width="2" height="1" />
        <rect x="4" y="6" width="2" height="1" />
        {/* ala alta */}
        <rect x="7" y="1" width="3" height="1" />
        <rect x="6" y="2" width="5" height="1" />
        <rect x="6" y="3" width="4" height="1" />
        {/* ala baja */}
        <rect x="8" y="7" width="3" height="1" />
        <rect x="8" y="8" width="2" height="1" />
      </g>
    </svg>
  );
}

/** Cuervo posado (easter egg, como el gato de la ciudad). */
function PixelRavenPerched({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      className={cn("h-full w-full", className)}
      aria-hidden
    >
      <g fill="currentColor">
        {/* cabeza + pico */}
        <rect x="7" y="1" width="3" height="2" />
        <rect x="10" y="2" width="2" height="1" />
        {/* ojo */}
        <rect x="8" y="2" width="1" height="1" fill="#5eead4" />
        {/* cuerpo */}
        <rect x="5" y="3" width="4" height="4" />
        <rect x="4" y="4" width="1" height="2" />
        {/* cola */}
        <rect x="3" y="6" width="2" height="1" />
        <rect x="2" y="7" width="2" height="1" />
        {/* patas */}
        <rect x="6" y="7" width="1" height="3" />
        <rect x="8" y="7" width="1" height="3" />
        <rect x="5" y="10" width="2" height="1" />
        <rect x="7" y="10" width="2" height="1" />
      </g>
    </svg>
  );
}

/** Pino nóvido con nieve (crece hacia arriba desde base y). */
function Pine({
  x,
  base,
  h,
  tone = "mid",
}: {
  x: number;
  base: number;
  h: number;
  tone?: "far" | "mid" | "near";
}) {
  const w1 = Math.round(h * 0.62);
  const w2 = Math.round(h * 0.46);
  const w3 = Math.round(h * 0.3);
  const trunk = Math.max(1, Math.round(h * 0.08));
  const tier = Math.round(h / 3);
  return (
    <g className={`pixel-nordic-pine pixel-nordic-pine--${tone}`}>
      {/* tronco */}
      <rect x={x - trunk / 2} y={base - 2} width={trunk} height={2} />
      {/* copa: 3 pisos */}
      <path d={`M${x - w1 / 2} ${base - 2} H${x + w1 / 2} L${x} ${base - 2 - tier} Z`} />
      <path
        d={`M${x - w2 / 2} ${base - 2 - tier + 1} H${x + w2 / 2} L${x} ${base - 2 - tier * 2} Z`}
      />
      <path d={`M${x - w3 / 2} ${base - 2 - tier * 2 + 1} H${x + w3 / 2} L${x} ${base - h} Z`} />
      {/* nieve en puntas */}
      <rect className="pixel-nordic-pine-snow" x={x - 1} y={base - h} width={2} height={1} />
      <rect
        className="pixel-nordic-pine-snow"
        x={x - w3 / 2}
        y={base - 2 - tier * 2 + 1}
        width={2}
        height={1}
      />
    </g>
  );
}

/** Cordillera con picos nevados (path escalonado pixel). */
function MountainRange({
  points,
  tone,
  snowTone,
  base,
}: {
  /** Lista de [x, y] cimas/valles. */
  points: Array<[number, number]>;
  tone: string;
  snowTone: string;
  base: number;
}) {
  const ridge = points.map(([x, y]) => `L${x} ${y}`).join(" ");
  const d = `M${points[0][0]} ${base} ${ridge} L${points[points.length - 1][0]} ${base} Z`;
  // Nieve: triángulos bajo cada cima (punto más bajo local).
  const caps: Array<[number, number]> = [];
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i];
    const [, py] = points[i - 1];
    const [, ny] = points[i + 1];
    if (y <= py && y <= ny) caps.push([x, y]);
  }
  return (
    <g>
      <path className={tone} d={d} />
      {caps.map(([x, y], i) => {
        const w = 6 + ((i * 5) % 7);
        const drop = 3 + ((i * 3) % 4);
        return (
          <path
            key={i}
            className={snowTone}
            d={`M${x} ${y} L${x - w} ${y + drop} L${x - w / 2} ${y + drop - 1} L${x} ${y + drop + 1} L${x + w / 2} ${y + drop - 1} L${x + w} ${y + drop} Z`}
          />
        );
      })}
    </g>
  );
}

/**
 * Fiordo nocturno nórdico — marca Muninn (el cuervo de Odín).
 * Escala de grises + aurora mint; nieve en vez de lluvia.
 * mood="gotham" = landing; mood="batcave" = umbral /entrar (atenuado).
 */
export function PixelNordicScene({
  className,
  parallax = false,
  mood = "gotham",
}: {
  className?: string;
  parallax?: boolean;
  mood?: "gotham" | "batcave";
}) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SVGSVGElement>(null);
  const batcave = mood === "batcave";

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const applyRatio = () => {
      scene.setAttribute("preserveAspectRatio", mq.matches ? "xMidYMax slice" : "xMidYMax meet");
    };
    applyRatio();
    mq.addEventListener("change", applyRatio);
    return () => mq.removeEventListener("change", applyRatio);
  }, []);

  useEffect(() => {
    if (!parallax || reduceMotion || batcave) return;
    const root = rootRef.current;
    if (!root) return;

    let raf = 0;
    const apply = () => {
      raf = 0;
      const y = window.scrollY;
      const docH = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const enter = Math.min(Math.max(y / Math.min(docH * 0.55, 900), 0), 1);
      const ease = enter * enter * (3 - 2 * enter);
      root.style.setProperty("--nordic-enter", ease.toFixed(4));
      root.style.setProperty("--nordic-par-sky", `${Math.min(y * 0.02 + ease * 4, 18)}px`);
      root.style.setProperty("--nordic-par-far", `${Math.min(y * 0.05 + ease * 8, 32)}px`);
      root.style.setProperty("--nordic-par-mid", `${Math.min(y * 0.11 + ease * 16, 60)}px`);
      root.style.setProperty("--nordic-par-near", `${Math.min(y * 0.2 + ease * 32, 100)}px`);
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
        "pointer-events-none inset-0 overflow-hidden pixel-nordic-root",
        batcave ? "pixel-nordic--batcave" : "pixel-nordic--landing",
        parallax && !reduceMotion && !batcave && "pixel-nordic--parallax",
        className ?? "absolute",
      )}
      style={{ "--nordic-enter": "0" } as CSSProperties}
    >
      <div className="pixel-nordic-sky absolute inset-0" />
      <div className="pixel-nordic-stars absolute inset-0" aria-hidden />
      <div className="pixel-nordic-dither absolute inset-0" aria-hidden />

      {/* Aurora boreal — bandas mint que ondean lento */}
      <div className="pixel-nordic-aurora absolute inset-x-0 top-0 h-[46%]" aria-hidden>
        <span className="pixel-nordic-aurora__band pixel-nordic-aurora__band--a" />
        <span className="pixel-nordic-aurora__band pixel-nordic-aurora__band--b" />
        <span className="pixel-nordic-aurora__band pixel-nordic-aurora__band--c" />
      </div>

      {/* Luna pixel — con textura de cráteres */}
      <div
        className={cn(
          "pixel-nordic-moon absolute right-[10%] top-[7%] h-12 w-12 sm:right-[12%] sm:h-14 sm:w-14 lg:h-16 lg:w-16",
          batcave && "pixel-nordic-moon--veiled",
        )}
        aria-hidden
      >
        <div className="pixel-nordic-moon-crater absolute left-[20%] top-[22%] h-[18%] w-[18%] rounded-full" />
        <div className="pixel-nordic-moon-crater absolute left-[52%] top-[35%] h-[12%] w-[12%] rounded-full" />
        <div className="pixel-nordic-moon-crater absolute left-[35%] top-[55%] h-[15%] w-[15%] rounded-full" />
        <div className="pixel-nordic-moon-crater absolute left-[60%] top-[60%] h-[10%] w-[10%] rounded-full" />
        <div className="pixel-nordic-moon-crater absolute left-[25%] top-[70%] h-[8%] w-[8%] rounded-full" />
      </div>

      {/* Cuervo que cruza el cielo cada tanto */}
      {!reduceMotion && !batcave && (
        <div
          className="pixel-nordic-raven-flight absolute left-0 top-[16%] z-[1] h-4 w-6 text-[#05080a] sm:h-5 sm:w-8"
          aria-hidden
        >
          <PixelRavenFlight />
        </div>
      )}

      <svg
        ref={sceneRef}
        className={cn(
          "pixel-nordic-scene absolute inset-x-0 bottom-0 w-full",
          batcave ? "h-[60%] sm:h-[64%] lg:h-[72%]" : "h-[74%] sm:h-[80%] lg:h-[94%] xl:h-full",
        )}
        viewBox="0 0 320 200"
        preserveAspectRatio="xMidYMax meet"
        shapeRendering="crispEdges"
      >
        {/* FAR: cordillera alta nevada */}
        <g className="pixel-nordic-far">
          <MountainRange
            base={122}
            tone="pixel-nordic-peak-far"
            snowTone="pixel-nordic-snow-far"
            points={[
              [-8, 108],
              [18, 86],
              [34, 100],
              [56, 72],
              [76, 98],
              [96, 82],
              [118, 102],
              [140, 78],
              [160, 96],
              [180, 84],
              [202, 104],
              [224, 80],
              [246, 100],
              [268, 88],
              [290, 106],
              [310, 92],
              [328, 110],
            ]}
          />
        </g>

        {/* Niebla entre cordilleras — nubes más redondas y centradas */}
        <g className="pixel-nordic-fog">
          <ellipse cx="160" cy="112" rx="120" ry="6" />
          <ellipse cx="100" cy="116" rx="70" ry="5" />
          <ellipse cx="230" cy="118" rx="65" ry="4" />
          <ellipse cx="160" cy="122" rx="90" ry="4" />
        </g>

        {/* MID: lomas con bosque */}
        <g className="pixel-nordic-mid">
          <MountainRange
            base={138}
            tone="pixel-nordic-peak-mid"
            snowTone="pixel-nordic-snow-mid"
            points={[
              [-10, 126],
              [24, 108],
              [52, 122],
              [86, 104],
              [120, 124],
              [154, 110],
              [188, 126],
              [222, 106],
              [256, 124],
              [292, 112],
              [330, 128],
            ]}
          />
          {/* Bosque en las lomas */}
          <Pine x={16} base={132} h={16} tone="mid" />
          <Pine x={30} base={134} h={20} tone="mid" />
          <Pine x={44} base={133} h={14} tone="mid" />
          <Pine x={70} base={136} h={18} tone="mid" />
          <Pine x={84} base={137} h={13} tone="mid" />
          <Pine x={104} base={135} h={17} tone="mid" />
          <Pine x={138} base={136} h={15} tone="mid" />
          <Pine x={164} base={134} h={19} tone="mid" />
          <Pine x={182} base={136} h={13} tone="mid" />
          <Pine x={206} base={135} h={16} tone="mid" />
          <Pine x={236} base={134} h={18} tone="mid" />
          <Pine x={258} base={136} h={14} tone="mid" />
          <Pine x={282} base={135} h={17} tone="mid" />
          <Pine x={302} base={136} h={15} tone="mid" />
        </g>

        {/* Agua del fiordo */}
        <rect className="pixel-nordic-water" x="0" y="138" width="320" height="40" />
        {/* Reflejo luna */}
        <g className="pixel-nordic-reflect-moon">
          <rect x="236" y="142" width="10" height="1" />
          <rect x="238" y="146" width="14" height="1" />
          <rect x="234" y="151" width="8" height="1" />
          <rect x="240" y="156" width="12" height="1" />
          <rect x="236" y="162" width="7" height="1" />
          <rect x="242" y="168" width="9" height="1" />
        </g>
        {/* Reflejo aurora */}
        <g className="pixel-nordic-reflect-aurora">
          <rect x="60" y="141" width="60" height="1" />
          <rect x="90" y="145" width="90" height="1" />
          <rect x="40" y="150" width="70" height="1" />
          <rect x="120" y="154" width="60" height="1" />
          <rect x="70" y="160" width="80" height="1" />
          <rect x="150" y="166" width="50" height="1" />
          <rect x="30" y="172" width="60" height="1" />
        </g>
        {/* Ondas tenues */}
        <g className="pixel-nordic-ripples">
          <rect x="10" y="144" width="30" height="1" />
          <rect x="200" y="148" width="40" height="1" />
          <rect x="150" y="158" width="34" height="1" />
          <rect x="260" y="170" width="36" height="1" />
          <rect x="90" y="174" width="28" height="1" />
        </g>

        {/* NEAR: orillas nevadas + pinos primer plano */}
        <g className="pixel-nordic-near">
          <path
            className="pixel-nordic-shore"
            d="M0 200 V178 H40 L58 170 H96 L112 176 H148 L160 200 Z"
          />
          <path
            className="pixel-nordic-shore"
            d="M320 200 V176 H284 L268 170 H232 L214 178 H184 L176 200 Z"
          />
          <path
            className="pixel-nordic-shore-snow"
            d="M0 182 H38 L56 174 H94 L110 180 H146 L154 188 H0 Z"
          />
          <path
            className="pixel-nordic-shore-snow"
            d="M320 180 H286 L270 174 H234 L218 182 H186 L182 188 H320 Z"
          />
          {/* pinos izquierda */}
          <Pine x={12} base={182} h={30} tone="near" />
          <Pine x={28} base={178} h={40} tone="near" />
          <Pine x={46} base={176} h={28} tone="near" />
          <Pine x={66} base={174} h={36} tone="near" />
          <Pine x={88} base={175} h={26} tone="near" />
          {/* pinos derecha */}
          <Pine x={306} base={180} h={32} tone="near" />
          <Pine x={290} base={177} h={42} tone="near" />
          <Pine x={272} base={175} h={28} tone="near" />
          <Pine x={252} base={176} h={36} tone="near" />
          <Pine x={232} base={178} h={26} tone="near" />
        </g>

        {/* Rocas en el agua */}
        <g className="pixel-nordic-rock">
          <rect x="150" y="166" width="14" height="5" />
          <rect x="152" y="164" width="10" height="2" />
          <rect className="pixel-nordic-rock-snow" x="152" y="163" width="9" height="1" />
          <rect x="120" y="176" width="10" height="4" />
          <rect x="122" y="174" width="6" height="2" />
        </g>
      </svg>

      {/* Easter egg: Muninn posado en un pino (abre demo en vivo) */}
      <button
        type="button"
        className="pixel-nordic-egg pointer-events-auto absolute bottom-[26%] left-[8%] z-[1] h-8 w-8 text-[#05080a] opacity-90 hover:opacity-100 sm:bottom-[24%] sm:left-[9%] sm:h-9 sm:w-9"
        aria-label="Probar demo en vivo"
        title="Muninn te observa — probar en vivo"
        onClick={(e) => {
          e.stopPropagation();
          dispatchMuninnLiveDemo();
        }}
      >
        <PixelRavenPerched />
      </button>

      {/* Niebla baja sobre el agua */}
      <div className="pixel-nordic-mist absolute inset-x-0 bottom-0 h-[30%]" aria-hidden />
      <div className="pixel-nordic-scanlines absolute inset-0" aria-hidden />

      <PixelSnowCanvas className="z-[2]" />

      <div className="pixel-nordic-content-veil absolute inset-0 z-[3]" aria-hidden />
      {batcave && <div className="pixel-nordic-batcave-focus absolute inset-0 z-[3]" aria-hidden />}
      <div className="pixel-nordic-vignette absolute inset-0 z-[3]" />
    </div>
  );
}
