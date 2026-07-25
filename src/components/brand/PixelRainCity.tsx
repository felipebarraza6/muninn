import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { dispatchMuninnLiveDemo } from "@/lib/muninnLiveDemo";
import { cn } from "@/lib/utils";

type Drop = {
  x: number;
  y: number;
  len: number;
  speed: number;
  opacity: number;
  thick: number;
  drift: number;
};

/**
 * Lluvia Canvas 2D — densa abajo (calle), suave arriba (zona de UI).
 */
function PixelRainCanvas({ className }: { className?: string }) {
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
    let drops: Drop[] = [];
    let w = 0;
    let h = 0;
    let frame = 0;

    const spawn = (anywhere = false): Drop => ({
      x: Math.random() * (w + 60) - 30,
      y: anywhere ? Math.random() * h : -Math.random() * 80,
      len: 12 + Math.random() * 18,
      speed: 5.2 + Math.random() * 5.5,
      opacity: 0.2 + Math.random() * 0.35,
      thick: 1,
      drift: (Math.random() - 0.5) * 0.28,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = w;
      canvas.height = h;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const mobile = window.matchMedia("(max-width: 1023px)").matches;
      drops = Array.from({ length: mobile ? 36 : 48 }, () => spawn(true));
    };

    const tick = () => {
      if (!running) return;
      frame++;
      if (frame % 2 === 1) {
        raf = window.requestAnimationFrame(tick);
        return;
      }
      ctx.clearRect(0, 0, w, h);
      const uiBand = h * 0.42;
      ctx.beginPath();
      for (const d of drops) {
        d.x += d.drift;
        d.y += d.speed;
        if (d.y > h + 12 || d.x < -40) {
          Object.assign(d, spawn(false));
          d.y = -12;
          d.x = Math.random() * (w + 50) - 10;
        }
        const fade = d.y < uiBand ? 0.35 + (d.y / uiBand) * 0.65 : 1;
        if (fade < 0.5) continue;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.drift * 1.3, d.y + d.len);
      }
      ctx.strokeStyle = "rgba(200, 240, 235, 0.38)";
      ctx.lineWidth = 1;
      ctx.stroke();
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
    />
  );
}

function PixelCat({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 10"
      shapeRendering="crispEdges"
      className={cn("h-full w-full", className)}
      aria-hidden
    >
      <g fill="currentColor">
        <rect x="3" y="3" width="6" height="4" />
        <rect x="2" y="4" width="1" height="2" />
        <rect x="9" y="4" width="1" height="2" />
        <rect x="3" y="1" width="1" height="2" />
        <rect x="8" y="1" width="1" height="2" />
        <rect x="4" y="2" width="1" height="1" />
        <rect x="7" y="2" width="1" height="1" />
        <rect x="5" y="5" width="2" height="1" />
        <rect x="4" y="7" width="1" height="2" />
        <rect x="7" y="7" width="1" height="2" />
        <rect x="9" y="5" width="3" height="1" />
      </g>
    </svg>
  );
}

function PixelRavenWire({ flip }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 14 8"
      shapeRendering="crispEdges"
      className="h-full w-full"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden
    >
      <g fill="currentColor">
        <rect x="5" y="0" width="3" height="1" />
        <rect x="3" y="1" width="6" height="1" />
        <rect x="1" y="2" width="9" height="1" />
        <rect x="0" y="3" width="12" height="1" />
        <rect x="2" y="4" width="10" height="1" />
        <rect x="4" y="5" width="6" height="1" />
        <rect x="6" y="6" width="2" height="1" />
        <rect x="11" y="2" width="3" height="1" />
        <rect x="12" y="3" width="2" height="1" />
      </g>
    </svg>
  );
}

function BuildingWindows({
  x,
  y,
  cols,
  rows,
  gapX = 8,
  gapY = 10,
}: {
  x: number;
  y: number;
  cols: number;
  rows: number;
  gapX?: number;
  gapY?: number;
}) {
  const cells: Array<[number, number]> = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Más apagadas: ~50% off
      if ((r * 3 + c * 5) % 2 === 0) continue;
      cells.push([x + c * gapX, y + r * gapY]);
    }
  }
  return (
    <>
      {cells.map(([wx, wy], i) => (
        <rect key={i} x={wx} y={wy} width="2" height="3" />
      ))}
    </>
  );
}

/**
 * Avenida-cañón nocturna (composición hecha a mano).
 * mood="gotham" = landing; mood="batcave" = umbral /entrar.
 * Desktop: slice + inmersión (--city-enter) para llenar y “entrar” al scrollear.
 */
export function PixelRainCityScene({
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
      // Móvil: meet (sin crop lateral). Desktop: slice (full-bleed, sin franja vacía).
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
      // 0 → 1: zoom hacia la calle (estar adentro)
      const enter = Math.min(Math.max(y / Math.min(docH * 0.55, 900), 0), 1);
      const ease = enter * enter * (3 - 2 * enter);
      root.style.setProperty("--city-enter", ease.toFixed(4));
      root.style.setProperty("--city-par-far", `${Math.min(y * 0.04 + ease * 8, 36)}px`);
      root.style.setProperty("--city-par-mid", `${Math.min(y * 0.12 + ease * 18, 64)}px`);
      root.style.setProperty("--city-par-near", `${Math.min(y * 0.22 + ease * 36, 110)}px`);
      root.style.setProperty("--city-par-mist", `${Math.min(y * 0.06 + ease * 10, 32)}px`);
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
        "pointer-events-none inset-0 overflow-hidden pixel-raven-sky",
        batcave ? "pixel-city--batcave" : "pixel-city--gotham",
        parallax && !reduceMotion && !batcave && "pixel-city--parallax",
        className ?? "absolute",
      )}
      style={{ "--city-enter": "0" } as CSSProperties}
    >
      <div className="pixel-city-sky absolute inset-0" />
      <div className="pixel-city-dither absolute inset-0" aria-hidden />
      <div className="pixel-city-scanlines absolute inset-0" aria-hidden />
      <div className="pixel-city-mist absolute inset-0" />
      <div className="pixel-city-mist-side absolute inset-0" aria-hidden />
      <div className="pixel-city-haze absolute inset-0" aria-hidden />

      <div
        className={cn(
          "pixel-city-moon absolute right-[8%] top-[5%] h-9 w-9 sm:right-[10%] sm:top-[6%] sm:h-12 sm:w-12 lg:h-16 lg:w-16",
          batcave && "pixel-city-moon--veiled",
        )}
        aria-hidden
      />

      <svg
        ref={sceneRef}
        className={cn(
          "pixel-city-scene absolute inset-x-0 bottom-0 w-full",
          batcave ? "h-[58%] sm:h-[62%] lg:h-[70%]" : "h-[72%] sm:h-[78%] lg:h-[92%] xl:h-full",
        )}
        viewBox="0 0 320 200"
        preserveAspectRatio="xMidYMax meet"
        shapeRendering="crispEdges"
      >
        {/* FAR: skyline en el vanishing (más denso, night-city) */}
        <g className="pixel-city-far">
          <rect x="118" y="82" width="6" height="24" />
          <rect x="124" y="74" width="10" height="32" />
          <rect x="134" y="66" width="8" height="40" />
          <rect x="142" y="58" width="12" height="48" />
          <rect x="154" y="70" width="10" height="36" />
          <rect x="164" y="62" width="14" height="44" />
          <rect x="178" y="68" width="10" height="38" />
          <rect x="188" y="76" width="8" height="30" />
          <rect x="196" y="84" width="6" height="22" />
          <rect x="148" y="48" width="2" height="12" />
          <rect x="170" y="50" width="2" height="14" />
          <rect x="182" y="54" width="2" height="10" />
        </g>

        <g className="pixel-city-fog-band">
          <rect x="100" y="96" width="120" height="18" />
          <rect x="112" y="108" width="96" height="10" />
        </g>

        {/* MID WALLS: más altas en laterales — cañón que enmarca (desktop slice) */}
        <g className="pixel-city-mid">
          <rect x="0" y="18" width="36" height="138" />
          <rect x="34" y="32" width="28" height="124" />
          <rect x="60" y="48" width="24" height="108" />
          <rect x="82" y="66" width="20" height="90" />
          <rect x="100" y="86" width="12" height="70" />
          <rect x="208" y="86" width="12" height="70" />
          <rect x="218" y="66" width="20" height="90" />
          <rect x="236" y="48" width="24" height="108" />
          <rect x="258" y="32" width="28" height="124" />
          <rect x="284" y="18" width="36" height="138" />
          <rect className="pixel-city-roof" x="0" y="16" width="38" height="4" />
          <rect className="pixel-city-roof" x="32" y="30" width="32" height="4" />
          <rect className="pixel-city-roof" x="58" y="46" width="28" height="4" />
          <rect className="pixel-city-roof" x="80" y="64" width="24" height="4" />
          <rect className="pixel-city-roof" x="98" y="84" width="16" height="4" />
          <rect className="pixel-city-roof" x="206" y="84" width="16" height="4" />
          <rect className="pixel-city-roof" x="216" y="64" width="24" height="4" />
          <rect className="pixel-city-roof" x="234" y="46" width="28" height="4" />
          <rect className="pixel-city-roof" x="256" y="30" width="32" height="4" />
          <rect className="pixel-city-roof" x="282" y="16" width="38" height="4" />
          <rect x="12" y="4" width="2" height="14" />
          <rect x="48" y="14" width="2" height="18" />
          <rect x="270" y="12" width="2" height="20" />
          <rect x="304" y="2" width="2" height="16" />
        </g>

        <g className="pixel-city-facade-detail">
          <rect x="4" y="40" width="26" height="2" />
          <rect x="4" y="62" width="26" height="2" />
          <rect x="4" y="86" width="26" height="2" />
          <rect x="4" y="110" width="26" height="2" />
          <rect x="40" y="52" width="18" height="2" />
          <rect x="40" y="78" width="18" height="2" />
          <rect x="40" y="104" width="18" height="2" />
          <rect x="66" y="68" width="14" height="2" />
          <rect x="66" y="94" width="14" height="2" />
          <rect x="240" y="68" width="14" height="2" />
          <rect x="240" y="94" width="14" height="2" />
          <rect x="262" y="52" width="18" height="2" />
          <rect x="262" y="78" width="18" height="2" />
          <rect x="262" y="104" width="18" height="2" />
          <rect x="290" y="40" width="26" height="2" />
          <rect x="290" y="62" width="26" height="2" />
          <rect x="290" y="86" width="26" height="2" />
          <rect x="290" y="110" width="26" height="2" />
          <rect x="68" y="100" width="12" height="2" />
          <rect x="68" y="114" width="12" height="2" />
          <rect x="69" y="98" width="1" height="30" />
          <rect x="78" y="98" width="1" height="30" />
          <rect x="240" y="100" width="12" height="2" />
          <rect x="240" y="114" width="12" height="2" />
          <rect x="241" y="98" width="1" height="30" />
          <rect x="250" y="98" width="1" height="30" />
        </g>

        {/* NEAR: bases / toldos / arcos — primer plano */}
        <g className="pixel-city-near">
          <rect x="0" y="120" width="56" height="36" />
          <rect x="264" y="120" width="56" height="36" />
          <rect className="pixel-city-awning" x="0" y="116" width="58" height="5" />
          <rect className="pixel-city-awning" x="262" y="116" width="58" height="5" />
          <path d="M12 156 V138 H16 V134 H32 V138 H36 V156 H32 V140 H16 V156 Z" />
          <path d="M284 156 V138 H288 V134 H304 V138 H308 V156 H304 V140 H288 V156 Z" />
        </g>

        <g className="pixel-city-window">
          <BuildingWindows x={6} y={28} cols={3} rows={9} />
          <BuildingWindows x={40} y={42} cols={2} rows={8} />
          <BuildingWindows x={66} y={56} cols={2} rows={7} />
          <BuildingWindows x={86} y={74} cols={1} rows={5} />
          <BuildingWindows x={222} y={74} cols={1} rows={5} />
          <BuildingWindows x={242} y={56} cols={2} rows={7} />
          <BuildingWindows x={268} y={42} cols={2} rows={8} />
          <BuildingWindows x={292} y={28} cols={3} rows={9} />
        </g>
        <g className="pixel-city-window pixel-city-window--cyan">
          <BuildingWindows x={10} y={50} cols={2} rows={3} gapX={10} gapY={14} />
          <BuildingWindows x={294} y={54} cols={2} rows={3} gapX={10} gapY={14} />
        </g>
        <g className="pixel-city-window pixel-city-window--far">
          <BuildingWindows x={128} y={70} cols={3} rows={3} gapX={5} gapY={7} />
          <BuildingWindows x={166} y={72} cols={3} rows={3} gapX={5} gapY={7} />
        </g>

        <g className="pixel-city-sign">
          <rect x="8" y={52} width="8" height="26" />
          <rect x="304" y={48} width="8" height="28" />
        </g>
        <g className="pixel-city-sign pixel-city-sign--amber">
          <rect x="64" y="112" width="16" height="3" />
          <rect x="240" y="112" width="16" height="3" />
        </g>
        <g className="pixel-city-sign pixel-city-sign--rose">
          <rect x="44" y="96" width="10" height="3" />
          <rect x="266" y="96" width="10" height="3" />
        </g>

        {/* Farolas */}
        <g className="pixel-city-lamp-glow">
          <rect x="92" y="132" width="12" height="8" />
          <rect x="216" y="132" width="12" height="8" />
        </g>
        <g className="pixel-city-lamp">
          <rect x="97" y="136" width="2" height="24" />
          <rect x="93" y="134" width="10" height="3" />
          <rect x="221" y="136" width="2" height="24" />
          <rect x="217" y="134" width="10" height="3" />
        </g>

        {/* Calle: perspectiva clara */}
        <rect className="pixel-city-street" x="0" y="152" width="320" height="48" />
        <path className="pixel-city-sidewalk" d="M0 152 H100 L140 142 H0 Z" />
        <path className="pixel-city-sidewalk" d="M220 152 H320 V142 H180 Z" />
        <rect className="pixel-city-curb" x="0" y="150" width="102" height="3" />
        <rect className="pixel-city-curb" x="218" y="150" width="102" height="3" />
        {/* Avenida: trapecio limpio */}
        <path className="pixel-city-road" d="M100 152 H220 L180 142 H140 Z" />
        <path className="pixel-city-road" d="M40 200 H280 L220 152 H100 Z" />
        <path className="pixel-city-road-line" d="M156 146 H164 L168 162 H152 Z" />
        <path className="pixel-city-road-line" d="M150 172 H170 L176 190 H144 Z" />

        <g className="pixel-city-reflect">
          <rect x="120" y="158" width="2" height="14" />
          <rect x="140" y="156" width="3" height="18" />
          <rect x="158" y="154" width="3" height="20" />
          <rect x="176" y="156" width="3" height="18" />
          <rect x="196" y="158" width="2" height="14" />
          <rect x="110" y="176" width="2" height="12" />
          <rect x="208" y="176" width="2" height="12" />
          <rect x="148" y="182" width="3" height="14" />
          <rect x="170" y="182" width="3" height="14" />
        </g>
        <g className="pixel-city-puddle">
          <rect x="130" y="168" width="28" height="2" />
          <rect x="162" y="166" width="24" height="2" />
          <rect x="120" y="186" width="80" height="3" />
          <rect x="132" y="189" width="56" height="2" />
        </g>

        <g className="pixel-city-wire">
          <rect x="96" y="58" width="128" height="1" />
          <rect x="102" y="70" width="116" height="1" />
        </g>
      </svg>

      <button
        type="button"
        className="pixel-city-egg pointer-events-auto absolute bottom-[12%] left-[3%] z-[1] h-7 w-8 text-[#1a2420] opacity-90 hover:opacity-100 sm:bottom-[10%] sm:left-[4%] sm:h-8 sm:w-9"
        aria-label="Probar demo en vivo"
        title="Probar en vivo"
        onClick={(e) => {
          e.stopPropagation();
          dispatchMuninnLiveDemo();
        }}
      >
        <PixelCat />
      </button>

      <button
        type="button"
        className="pixel-city-egg pointer-events-auto absolute bottom-[38%] right-[6%] z-[1] h-5 w-8 text-[#0c1412] opacity-85 hover:opacity-100 sm:bottom-[36%] sm:right-[8%] sm:h-5 sm:w-9"
        aria-label="Probar demo en vivo"
        title="Probar en vivo"
        onClick={(e) => {
          e.stopPropagation();
          dispatchMuninnLiveDemo();
        }}
      >
        <PixelRavenWire flip />
      </button>

      <PixelRainCanvas className="z-[2]" />

      {!batcave && (
        <div
          className="pixel-city-traffic pointer-events-none absolute inset-x-0 bottom-[4%] z-[2]"
          aria-hidden
        >
          <span className="pixel-city-car pixel-city-car--a" />
          <span className="pixel-city-car pixel-city-car--b" />
        </div>
      )}

      <div className="pixel-city-content-veil absolute inset-0 z-[3]" aria-hidden />
      {batcave && <div className="pixel-city-batcave-focus absolute inset-0 z-[3]" aria-hidden />}
      <div className="pixel-city-vignette absolute inset-0 z-[3]" />
    </div>
  );
}
