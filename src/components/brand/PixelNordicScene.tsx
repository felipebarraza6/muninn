import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
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
    let skip = 0;
    const mobileCanvas = window.matchMedia("(max-width: 1023px)").matches;
    const SKIP_FRAME = mobileCanvas ? 1 : 0; // skip each Nth frame on mobile

    const spawn = (anywhere = false): Flake => ({
      x: Math.random() * (w + 40) - 20,
      y: anywhere ? Math.random() * h : -8 - Math.random() * 40,
      size: Math.random() < 0.72 ? 1 : 2,
      speed: 0.35 + Math.random() * 0.75,
      drift: 0.25 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.3 + Math.random() * 0.5,
    });

    let resizeTimer = 0;
    const resize = () => {
      cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(() => {
        const rect = canvas.getBoundingClientRect();
        w = Math.max(1, Math.floor(rect.width));
        h = Math.max(1, Math.floor(rect.height));
        canvas.width = w;
        canvas.height = h;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        flakes = Array.from({ length: mobileCanvas ? 45 : 90 }, () => spawn(true));
      });
    };

    const tick = () => {
      if (!running) return;
      frame++;
      if (SKIP_FRAME && skip++ % (SKIP_FRAME + 1) !== 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
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
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeTimer);
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

/**
 * Flujo de agua Canvas 2D — líneas pixel que fluyen sin reinicio.
 * Cada línea se mueve a velocidad constante. Cuando sale por la izquierda,
 * reaparece por la derecha con un nuevo offset de Y.
 */
function PixelFlowCanvas({ className }: { className?: string }) {
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
    let lines: { x: number; y: number; w: number; speed: number; opacity: number }[] = [];
    let w = 0;
    let h = 0;
    let skip = 0;
    const mobileCanvas = window.matchMedia("(max-width: 1023px)").matches;
    const SKIP_FRAME = mobileCanvas ? 1 : 0;
    const COUNT = mobileCanvas ? 40 : 80;

    const WATER_START = 0.56;
    let waterTop = 0;

    let resizeTimer = 0;
    const resize = () => {
      cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(() => {
        const rect = canvas.getBoundingClientRect();
        w = Math.max(1, Math.floor(rect.width));
        h = Math.max(1, Math.floor(rect.height));
        canvas.width = w;
        canvas.height = h;
        waterTop = Math.floor(h * WATER_START);
        const waterH = h - waterTop;
        lines = Array.from({ length: COUNT }, (_, i) => ({
          x: (i / COUNT) * w + Math.random() * 20,
          y: waterTop + Math.random() * waterH,
          w: 8 + Math.floor(Math.random() * 16),
          speed: 0.4 + Math.random() * 0.5,
          opacity: 0.35 + Math.random() * 0.35,
        }));
      });
    };

    const tick = () => {
      if (!running) return;
      if (SKIP_FRAME && skip++ % (SKIP_FRAME + 1) !== 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      ctx.clearRect(0, 0, w, h);
      const waterH = h - waterTop;
      for (const l of lines) {
        l.x -= l.speed;
        if (l.x + l.w < 0) {
          l.x = w + Math.random() * 40;
          l.y = waterTop + Math.random() * waterH;
        }
        ctx.globalAlpha = l.opacity;
        ctx.fillStyle = "#4a7a94";
        ctx.fillRect(Math.round(l.x), Math.round(l.y), l.w, 1);
      }
      ctx.globalAlpha = 1;
      raf = window.requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeTimer);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

/**
 * Lluvia espesa Canvas 2D — líneas verticales pixel que caen rápido.
 */
type Raindrop = {
  x: number;
  y: number;
  len: number;
  speed: number;
  opacity: number;
  wind: number;
};

function PixelRainCanvas({ className, density = 140 }: { className?: string; density?: number }) {
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
    let drops: Raindrop[] = [];
    let w = 0;
    let h = 0;
    let skip = 0;
    const mobileCanvas = window.matchMedia("(max-width: 1023px)").matches;
    const SKIP_FRAME = mobileCanvas ? 1 : 0;
    const DENSITY = mobileCanvas ? Math.min(density, 200) : density;

    const spawn = (anywhere = false): Raindrop => ({
      x: Math.random() * (w + 60) - 30,
      y: anywhere ? Math.random() * h : -10 - Math.random() * 60,
      len: 5 + Math.floor(Math.random() * 9),
      speed: 5 + Math.random() * 6,
      opacity: 0.25 + Math.random() * 0.25,
      wind: -0.6 + Math.random() * 1.0,
    });

    let resizeTimer = 0;
    const resize = () => {
      cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(() => {
        const rect = canvas.getBoundingClientRect();
        w = Math.max(1, Math.floor(rect.width));
        h = Math.max(1, Math.floor(rect.height));
        canvas.width = w;
        canvas.height = h;
        drops = Array.from({ length: DENSITY }, () => spawn(true));
      });
    };

    const tick = () => {
      if (!running) return;
      if (SKIP_FRAME && skip++ % (SKIP_FRAME + 1) !== 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(190, 210, 225, 0.95)";
      ctx.lineWidth = 1;
      for (const d of drops) {
        d.x += d.wind;
        d.y += d.speed;
        if (d.y > h + 10) {
          Object.assign(d, spawn(false));
        }
        if (d.x > w + 20) d.x = -10;
        if (d.x < -20) d.x = w + 10;
        ctx.globalAlpha = d.opacity;
        ctx.beginPath();
        ctx.moveTo(Math.round(d.x), Math.round(d.y));
        ctx.lineTo(Math.round(d.x), Math.round(d.y - d.len));
        ctx.stroke();
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
  }, [reduceMotion, density]);

  if (reduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
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

/** Bandada de pájaros diminutos (V pixel distante). */
function PixelBirdFlock({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 6"
      shapeRendering="crispEdges"
      className={cn("h-full w-full", className)}
      aria-hidden
    >
      <g fill="currentColor" opacity="0.6">
        <rect x="2" y="2" width="2" height="1" />
        <rect x="4" y="1" width="1" height="1" />
        <rect x="2" y="3" width="1" height="1" />
        <rect x="10" y="2" width="2" height="1" />
        <rect x="12" y="1" width="1" height="1" />
        <rect x="10" y="3" width="1" height="1" />
        <rect x="18" y="2" width="2" height="1" />
        <rect x="20" y="1" width="1" height="1" />
        <rect x="18" y="3" width="1" height="1" />
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

/** Zona nórdica — variante de paisaje pixel. */
export type NordicZone = "fjord" | "forest" | "mountains" | "shore" | "cave" | "moon";

/** FJORD: fiordo notturno — cordilleras, pinos, agua, reflejos, orillas. */
function FjordScene() {
  return (
    <>
      {/* FAR: cordillera alta nevada + pinos al pie */}
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
        <Pine x={10} base={116} h={8} tone="far" />
        <Pine x={28} base={114} h={7} tone="far" />
        <Pine x={46} base={116} h={9} tone="far" />
        <Pine x={64} base={114} h={6} tone="far" />
        <Pine x={82} base={116} h={8} tone="far" />
        <Pine x={100} base={114} h={7} tone="far" />
        <Pine x={118} base={116} h={9} tone="far" />
        <Pine x={136} base={114} h={6} tone="far" />
        <Pine x={154} base={116} h={8} tone="far" />
        <Pine x={172} base={114} h={7} tone="far" />
        <Pine x={190} base={116} h={9} tone="far" />
        <Pine x={208} base={114} h={6} tone="far" />
        <Pine x={226} base={116} h={8} tone="far" />
        <Pine x={244} base={114} h={7} tone="far" />
        <Pine x={262} base={116} h={9} tone="far" />
        <Pine x={280} base={114} h={6} tone="far" />
        <Pine x={298} base={116} h={8} tone="far" />
        <Pine x={316} base={114} h={7} tone="far" />
      </g>

      {/* Niebla natural esparcida — sin concentración en un solo lugar */}
      <g className="pixel-nordic-fog">
        <ellipse cx="40" cy="108" rx="45" ry="5" />
        <ellipse cx="90" cy="112" rx="55" ry="4" />
        <ellipse cx="150" cy="110" rx="65" ry="5" />
        <ellipse cx="210" cy="114" rx="50" ry="4" />
        <ellipse cx="270" cy="108" rx="60" ry="4" />
        <ellipse cx="310" cy="116" rx="35" ry="3" />
        <ellipse cx="50" cy="120" rx="30" ry="3" opacity="0.5" />
        <ellipse cx="130" cy="118" rx="25" ry="3" opacity="0.4" />
        <ellipse cx="250" cy="120" rx="35" ry="3" opacity="0.5" />
        <ellipse cx="180" cy="122" rx="40" ry="3" opacity="0.35" />
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
        <rect x="100" y="146" width="50" height="1" />
        <rect x="50" y="152" width="40" height="1" />
        <rect x="130" y="158" width="35" height="1" />
        <rect x="80" y="164" width="45" height="1" />
        <rect x="40" y="170" width="30" height="1" />
      </g>
      {/* Ondas del caudal — estáticas (movimiento vía canvas) */}
      <g className="pixel-nordic-ripples">
        {[
          [10, 142, 24],
          [80, 144, 30],
          [180, 140, 20],
          [260, 146, 28],
          [40, 150, 34],
          [140, 152, 26],
          [230, 148, 30],
          [300, 154, 20],
          [10, 160, 28],
          [110, 158, 36],
          [200, 162, 24],
          [280, 160, 30],
          [60, 168, 22],
          [170, 170, 30],
          [250, 172, 26],
          [30, 176, 30],
          [140, 174, 28],
          [290, 178, 24],
        ].map(([x, y, w], i) => (
          <rect key={i} x={x} y={y} width={w} height={1} />
        ))}
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
    </>
  );
}

/** FOREST: bosque denso de pinos — sin agua, suelo nevado, capas múltiples. */
function ForestScene() {
  return (
    <>
      {/* FAR: lomas bajas con pinos lejanos */}
      <g className="pixel-nordic-far">
        <MountainRange
          base={104}
          tone="pixel-nordic-peak-far"
          snowTone="pixel-nordic-snow-far"
          points={[
            [-8, 96],
            [24, 84],
            [54, 94],
            [86, 82],
            [120, 92],
            [154, 84],
            [188, 96],
            [222, 82],
            [256, 94],
            [290, 86],
            [328, 98],
          ]}
        />
        <Pine x={8} base={98} h={9} tone="far" />
        <Pine x={22} base={96} h={8} tone="far" />
        <Pine x={34} base={98} h={10} tone="far" />
        <Pine x={48} base={96} h={7} tone="far" />
        <Pine x={62} base={98} h={9} tone="far" />
        <Pine x={76} base={96} h={8} tone="far" />
        <Pine x={90} base={98} h={10} tone="far" />
        <Pine x={104} base={96} h={7} tone="far" />
        <Pine x={118} base={98} h={9} tone="far" />
        <Pine x={134} base={96} h={8} tone="far" />
        <Pine x={150} base={98} h={10} tone="far" />
        <Pine x={166} base={96} h={7} tone="far" />
        <Pine x={182} base={98} h={9} tone="far" />
        <Pine x={198} base={96} h={8} tone="far" />
        <Pine x={214} base={98} h={10} tone="far" />
        <Pine x={230} base={96} h={7} tone="far" />
        <Pine x={246} base={98} h={9} tone="far" />
        <Pine x={262} base={96} h={8} tone="far" />
        <Pine x={278} base={98} h={10} tone="far" />
        <Pine x={294} base={96} h={7} tone="far" />
        <Pine x={310} base={98} h={9} tone="far" />
        <Pine x={324} base={96} h={8} tone="far" />
      </g>

      {/* Niebla baja entre lomas y bosque */}
      <g className="pixel-nordic-fog">
        <ellipse cx="30" cy="100" rx="40" ry="4" />
        <ellipse cx="80" cy="104" rx="50" ry="4" />
        <ellipse cx="150" cy="102" rx="60" ry="5" />
        <ellipse cx="220" cy="106" rx="45" ry="4" />
        <ellipse cx="290" cy="100" rx="55" ry="4" />
        <ellipse cx="60" cy="110" rx="25" ry="3" opacity="0.4" />
        <ellipse cx="200" cy="112" rx="30" ry="3" opacity="0.35" />
        <ellipse cx="280" cy="108" rx="20" ry="2" opacity="0.45" />
      </g>

      {/* MID: bosque denso */}
      <g className="pixel-nordic-mid">
        <Pine x={6} base={132} h={20} tone="mid" />
        <Pine x={20} base={134} h={24} tone="mid" />
        <Pine x={34} base={131} h={18} tone="mid" />
        <Pine x={48} base={135} h={22} tone="mid" />
        <Pine x={62} base={132} h={26} tone="mid" />
        <Pine x={76} base={134} h={19} tone="mid" />
        <Pine x={90} base={131} h={23} tone="mid" />
        <Pine x={104} base={135} h={20} tone="mid" />
        <Pine x={118} base={132} h={25} tone="mid" />
        <Pine x={132} base={134} h={18} tone="mid" />
        <Pine x={146} base={131} h={22} tone="mid" />
        <Pine x={160} base={135} h={24} tone="mid" />
        <Pine x={174} base={132} h={19} tone="mid" />
        <Pine x={188} base={134} h={23} tone="mid" />
        <Pine x={202} base={131} h={20} tone="mid" />
        <Pine x={216} base={135} h={25} tone="mid" />
        <Pine x={230} base={132} h={18} tone="mid" />
        <Pine x={244} base={134} h={22} tone="mid" />
        <Pine x={258} base={131} h={24} tone="mid" />
        <Pine x={272} base={135} h={19} tone="mid" />
        <Pine x={286} base={132} h={23} tone="mid" />
        <Pine x={300} base={134} h={20} tone="mid" />
        <Pine x={314} base={131} h={22} tone="mid" />
      </g>

      {/* Suelo nevado que cubre todo el fondo */}
      <rect className="pixel-nordic-shore-snow" x="0" y="158" width="320" height="42" />
      <rect className="pixel-nordic-shore" x="0" y="186" width="320" height="14" />

      {/* NEAR: pinos altos primer plano — densos a través de todo el ancho */}
      <g className="pixel-nordic-near">
        <Pine x={10} base={176} h={42} tone="near" />
        <Pine x={26} base={172} h={50} tone="near" />
        <Pine x={42} base={178} h={36} tone="near" />
        <Pine x={58} base={170} h={48} tone="near" />
        <Pine x={74} base={176} h={40} tone="near" />
        <Pine x={90} base={172} h={46} tone="near" />
        <Pine x={106} base={178} h={34} tone="near" />
        <Pine x={122} base={170} h={50} tone="near" />
        <Pine x={138} base={176} h={38} tone="near" />
        <Pine x={154} base={172} h={44} tone="near" />
        <Pine x={170} base={178} h={36} tone="near" />
        <Pine x={186} base={170} h={48} tone="near" />
        <Pine x={202} base={176} h={40} tone="near" />
        <Pine x={218} base={172} h={46} tone="near" />
        <Pine x={234} base={178} h={34} tone="near" />
        <Pine x={250} base={170} h={50} tone="near" />
        <Pine x={266} base={176} h={38} tone="near" />
        <Pine x={282} base={172} h={44} tone="near" />
        <Pine x={298} base={178} h={36} tone="near" />
        <Pine x={314} base={170} h={48} tone="near" />
      </g>
    </>
  );
}

/** MOUNTAINS: picos altos y dramáticos — valles profundos, niebla, lago mínimo. */
function MountainsScene() {
  return (
    <>
      {/* FAR: picos altos nevados */}
      <g className="pixel-nordic-far">
        <MountainRange
          base={132}
          tone="pixel-nordic-peak-far"
          snowTone="pixel-nordic-snow-far"
          points={[
            [-8, 60],
            [22, 36],
            [44, 58],
            [70, 30],
            [96, 54],
            [122, 40],
            [148, 62],
            [176, 34],
            [204, 58],
            [232, 38],
            [260, 60],
            [288, 42],
            [312, 58],
            [328, 40],
          ]}
        />
      </g>

      {/* Niebla en los valles */}
      <g className="pixel-nordic-fog">
        <ellipse cx="20" cy="116" rx="35" ry="4" />
        <ellipse cx="60" cy="120" rx="45" ry="5" />
        <ellipse cx="130" cy="118" rx="55" ry="5" />
        <ellipse cx="200" cy="122" rx="50" ry="4" />
        <ellipse cx="270" cy="120" rx="50" ry="4" />
        <ellipse cx="310" cy="124" rx="30" ry="3" />
        <ellipse cx="100" cy="126" rx="25" ry="3" opacity="0.4" />
        <ellipse cx="230" cy="126" rx="20" ry="2" opacity="0.35" />
      </g>

      {/* MID: picos medios con nieve */}
      <g className="pixel-nordic-mid">
        <MountainRange
          base={168}
          tone="pixel-nordic-peak-mid"
          snowTone="pixel-nordic-snow-mid"
          points={[
            [-10, 110],
            [30, 86],
            [64, 108],
            [104, 80],
            [144, 106],
            [184, 84],
            [224, 110],
            [264, 88],
            [304, 108],
            [330, 96],
          ]}
        />
        {/* Pinos mínimos en la base */}
        <Pine x={20} base={166} h={14} tone="mid" />
        <Pine x={36} base={168} h={11} tone="mid" />
        <Pine x={150} base={167} h={13} tone="mid" />
        <Pine x={284} base={168} h={12} tone="mid" />
        <Pine x={302} base={166} h={14} tone="mid" />
      </g>

      {/* Lago mínimo al fondo del valle */}
      <rect className="pixel-nordic-water" x="0" y="180" width="320" height="20" />
      <g className="pixel-nordic-reflect-aurora">
        <rect x="40" y="183" width="80" height="1" />
        <rect x="120" y="187" width="90" height="1" />
        <rect x="60" y="192" width="70" height="1" />
        <rect x="180" y="196" width="60" height="1" />
      </g>
      <g className="pixel-nordic-ripples">
        <rect x="20" y="186" width="30" height="1" />
        <rect x="200" y="190" width="40" height="1" />
        <rect x="120" y="195" width="34" height="1" />
      </g>

      {/* NEAR: pocos pinos en la base */}
      <g className="pixel-nordic-near">
        <path className="pixel-nordic-shore-snow" d="M0 200 V188 H320 V200 Z" />
        <Pine x={14} base={188} h={22} tone="near" />
        <Pine x={306} base={188} h={24} tone="near" />
      </g>
    </>
  );
}

/** SHORE: línea costera del fiordo — agua ocupa el 60% inferior, luna baja en horizonte. */
function ShoreScene() {
  return (
    <>
      {/* FAR: lomas bajas en el horizonte */}
      <g className="pixel-nordic-far">
        <MountainRange
          base={92}
          tone="pixel-nordic-peak-far"
          snowTone="pixel-nordic-snow-far"
          points={[
            [-8, 84],
            [30, 76],
            [62, 86],
            [96, 74],
            [130, 84],
            [166, 76],
            [202, 86],
            [238, 74],
            [274, 84],
            [310, 78],
            [328, 86],
          ]}
        />
      </g>

      {/* Luna baja en el horizonte (pixel) */}
      <g className="pixel-nordic-reflect-moon" aria-hidden>
        <rect x="232" y="80" width="10" height="2" />
        <rect x="230" y="82" width="14" height="6" />
        <rect x="232" y="88" width="10" height="2" />
        <rect x="234" y="84" width="2" height="2" fill="#0a121c" opacity="0.5" />
        <rect x="238" y="86" width="2" height="2" fill="#0a121c" opacity="0.4" />
      </g>

      {/* Niebla sobre el horizonte */}
      <g className="pixel-nordic-fog">
        <ellipse cx="160" cy="92" rx="130" ry="4" />
        <ellipse cx="90" cy="96" rx="70" ry="3" />
        <ellipse cx="240" cy="94" rx="60" ry="3" />
      </g>

      {/* Agua — 60% inferior */}
      <rect className="pixel-nordic-water" x="0" y="92" width="320" height="108" />

      {/* Reflejo de la luna baja */}
      <g className="pixel-nordic-reflect-moon">
        <rect x="232" y="98" width="10" height="1" />
        <rect x="230" y="104" width="14" height="1" />
        <rect x="234" y="112" width="8" height="1" />
        <rect x="230" y="122" width="12" height="1" />
        <rect x="236" y="134" width="7" height="1" />
        <rect x="232" y="148" width="9" height="1" />
      </g>
      {/* Reflejo aurora */}
      <g className="pixel-nordic-reflect-aurora">
        <rect x="40" y="100" width="70" height="1" />
        <rect x="80" y="108" width="100" height="1" />
        <rect x="30" y="118" width="80" height="1" />
        <rect x="110" y="128" width="70" height="1" />
        <rect x="50" y="140" width="90" height="1" />
        <rect x="140" y="152" width="60" height="1" />
        <rect x="20" y="166" width="70" height="1" />
        <rect x="160" y="178" width="50" height="1" />
      </g>
      {/* Ondas */}
      <g className="pixel-nordic-ripples">
        <rect x="10" y="106" width="34" height="1" />
        <rect x="180" y="116" width="44" height="1" />
        <rect x="60" y="126" width="38" height="1" />
        <rect x="250" y="138" width="40" height="1" />
        <rect x="120" y="150" width="36" height="1" />
        <rect x="200" y="162" width="44" height="1" />
        <rect x="40" y="174" width="30" height="1" />
      </g>

      {/* NEAR: orillas con rocas + pino a la derecha */}
      <g className="pixel-nordic-near">
        {/* orilla izquierda */}
        <path className="pixel-nordic-shore" d="M0 200 V150 H36 L54 142 H88 L104 200 Z" />
        <path className="pixel-nordic-shore-snow" d="M0 154 H34 L52 146 H86 L98 200 H0 Z" />
        {/* orilla derecha con pino */}
        <path className="pixel-nordic-shore" d="M320 200 V130 H286 L268 144 H236 L224 200 Z" />
        <path className="pixel-nordic-shore-snow" d="M320 134 H288 L270 148 H238 L228 200 H320 Z" />
        <Pine x={296} base={150} h={42} tone="near" />
        <Pine x={278} base={152} h={32} tone="near" />
        {/* rocas en el agua */}
        <g className="pixel-nordic-rock">
          <rect x="140" y="170" width="16" height="6" />
          <rect x="142" y="167" width="12" height="3" />
          <rect className="pixel-nordic-rock-snow" x="142" y="166" width="11" height="1" />
          <rect x="180" y="178" width="12" height="5" />
          <rect x="182" y="176" width="8" height="2" />
          <rect className="pixel-nordic-rock-snow" x="182" y="175" width="7" height="1" />
        </g>
      </g>
    </>
  );
}

/** CAVE: interior de cueva mirando hacia la entrada — arco con estalactitas, vista lejana del fiordo. */
function CaveScene() {
  // Vista lejana del fiordo a través de la entrada (x=116..204)
  const viewLeft = 116;
  const viewRight = 204;
  const viewW = viewRight - viewLeft;
  return (
    <>
      {/* Vista distante del fiordo a través de la entrada */}
      <g className="pixel-nordic-cave-view" aria-hidden>
        <MountainRange
          base={96}
          tone="pixel-nordic-peak-far"
          snowTone="pixel-nordic-snow-far"
          points={[
            [viewLeft - 2, 78],
            [viewLeft + 14, 64],
            [viewLeft + 28, 76],
            [viewLeft + 44, 60],
            [viewLeft + 60, 74],
            [viewLeft + 74, 66],
            [viewRight + 2, 80],
          ]}
        />
        {/* agua lejana */}
        <rect className="pixel-nordic-water" x={viewLeft} y={96} width={viewW} height={84} />
        {/* reflejo aurora lejano */}
        <g className="pixel-nordic-reflect-aurora">
          <rect x={viewLeft + 6} y={104} width={viewW - 12} height={1} />
          <rect x={viewLeft + 10} y={116} width={viewW - 20} height={1} />
          <rect x={viewLeft + 4} y={128} width={viewW - 8} height={1} />
          <rect x={viewLeft + 14} y={142} width={viewW - 28} height={1} />
          <rect x={viewLeft + 8} y={158} width={viewW - 16} height={1} />
        </g>
        {/* reflejo luna lejano */}
        <g className="pixel-nordic-reflect-moon">
          <rect x={viewLeft + 30} y={108} width={14} height={1} />
          <rect x={viewLeft + 32} y={122} width={10} height={1} />
          <rect x={viewLeft + 28} y={138} width={16} height={1} />
        </g>
        {/* pinos lejanos diminutos en la orilla lejana */}
        <Pine x={viewLeft + 10} base={96} h={8} tone="far" />
        <Pine x={viewLeft + 24} base={95} h={7} tone="far" />
        <Pine x={viewLeft + 60} base={96} h={8} tone="far" />
        <Pine x={viewLeft + 76} base={95} h={7} tone="far" />
      </g>

      {/* Paredes de roca oscura que enmarcan la entrada */}
      <g className="pixel-nordic-cave-arch" aria-hidden>
        {/* Techo de roca */}
        <rect x="0" y="0" width="320" height="14" fill="#030507" />
        <rect x="0" y="14" width="320" height="2" fill="#060a10" />
        {/* Stalactitas izquierda */}
        <rect x="0" y="16" width="44" height="8" fill="#030507" />
        <rect x="0" y="24" width="24" height="6" fill="#030507" />
        <rect x="0" y="30" width="12" height="8" fill="#030507" />
        <rect x="44" y="16" width="30" height="10" fill="#030507" />
        <rect x="50" y="26" width="16" height="8" fill="#030507" />
        <rect x="54" y="34" width="8" height="6" fill="#030507" />
        <rect x="74" y="16" width="24" height="14" fill="#030507" />
        <rect x="80" y="30" width="12" height="8" fill="#030507" />
        <rect x="82" y="38" width="6" height="6" fill="#030507" />
        <rect x="98" y="16" width="18" height="10" fill="#030507" />
        <rect x="102" y="26" width="10" height="6" fill="#060a10" />
        {/* Stalactitas derecha — espejo */}
        <rect x="204" y="16" width="18" height="10" fill="#030507" />
        <rect x="208" y="26" width="10" height="6" fill="#060a10" />
        <rect x="222" y="16" width="24" height="14" fill="#030507" />
        <rect x="228" y="30" width="12" height="8" fill="#030507" />
        <rect x="232" y="38" width="6" height="6" fill="#030507" />
        <rect x="246" y="16" width="30" height="10" fill="#030507" />
        <rect x="254" y="26" width="16" height="8" fill="#030507" />
        <rect x="258" y="34" width="8" height="6" fill="#030507" />
        <rect x="276" y="16" width="44" height="8" fill="#030507" />
        <rect x="296" y="24" width="24" height="6" fill="#030507" />
        <rect x="308" y="30" width="12" height="8" fill="#030507" />
        {/* Paredes laterales — enmarcan la entrada */}
        <rect x="0" y="44" width={viewLeft} height="156" fill="#060a10" />
        <rect x="0" y="44" width={viewLeft} height="156" fill="#030507" opacity="0.55" />
        <rect x={viewRight} y="44" width={320 - viewRight} height="156" fill="#060a10" />
        <rect
          x={viewRight}
          y="44"
          width={320 - viewRight}
          height="156"
          fill="#030507"
          opacity="0.55"
        />
        {/* Suelo de cueva */}
        <rect x={viewLeft} y="180" width={viewW} height="20" fill="#030507" />
        {/* Bordes del arco — línea más clara */}
        <rect x="0" y="14" width="320" height="1" fill="#0a121c" />
        <rect x={viewLeft - 1} y="44" width="1" height="136" fill="#0a121c" />
        <rect x={viewRight} y="44" width="1" height="136" fill="#0a121c" />
        {/* Textura de roca en las paredes */}
        <rect x="20" y="80" width="14" height="3" fill="#0a121c" opacity="0.6" />
        <rect x="40" y="120" width="20" height="3" fill="#0a121c" opacity="0.5" />
        <rect x="10" y="160" width="16" height="3" fill="#0a121c" opacity="0.5" />
        <rect x="260" y="90" width="18" height="3" fill="#0a121c" opacity="0.6" />
        <rect x="240" y="130" width="22" height="3" fill="#0a121c" opacity="0.5" />
        <rect x="280" y="165" width="14" height="3" fill="#0a121c" opacity="0.5" />
      </g>
    </>
  );
}

/**
 * Fiordo nocturno nórdico — marca Muninn (el cuervo de Odín).
 * Escala de grises + aurora mint; nieve en vez de lluvia.
 * mood="gotham" = landing; mood="batcave" = umbral /entrar (atenuado).
 * zone = variante de paisaje: fjord (default) | forest | mountains | shore | cave | moon.
 */

/** Cielo puro — sin paisaje, solo estrellas y luna. Lugar de calma. */
function MoonScene() {
  return <g />;
}

export function PixelNordicScene({
  className,
  parallax = false,
  mood = "gotham",
  zone = "fjord",
}: {
  className?: string;
  parallax?: boolean;
  mood?: "gotham" | "batcave";
  zone?: NordicZone;
}) {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SVGSVGElement>(null);
  const sectionRef = useRef(0);
  const batcave = mood === "batcave";

  const ZONE_PAN: Record<NordicZone, number> = {
    fjord: 0,
    forest: -320,
    mountains: -640,
    shore: -960,
    cave: -1280,
    moon: -1600,
  };
  const panOffset = ZONE_PAN[zone];

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

      // Sección de landing derivada del progreso de scroll completo (0..4).
      // section 0 = hero · 1 = compañero · 2 = técnico/flujo · 3 = live demo · 4 = docs/plataforma
      const scrollProgress = Math.min(Math.max(y / docH, 0), 1);
      const section = Math.min(4, Math.floor(scrollProgress * 5));
      if (sectionRef.current !== section) {
        sectionRef.current = section;
        root.setAttribute("data-nordic-section", String(section));
      }
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
      {/* Estrellas brillantes individuales — centelleo asíncrono */}
      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
        <span className="pixel-nordic-sparkle pixel-nordic-sparkle--1" />
        <span className="pixel-nordic-sparkle pixel-nordic-sparkle--2" />
        <span className="pixel-nordic-sparkle pixel-nordic-sparkle--3" />
        <span className="pixel-nordic-sparkle pixel-nordic-sparkle--4" />
        <span className="pixel-nordic-sparkle pixel-nordic-sparkle--5" />
        <span className="pixel-nordic-sparkle pixel-nordic-sparkle--6" />
      </div>
      <div className="pixel-nordic-dither absolute inset-0" aria-hidden />

      {/* Aurora boreal — bandas mint que ondean lento */}
      <div className="pixel-nordic-aurora absolute inset-x-0 top-0 h-[46%]" aria-hidden>
        <span className="pixel-nordic-aurora__band pixel-nordic-aurora__band--a" />
        <span className="pixel-nordic-aurora__band pixel-nordic-aurora__band--b" />
        <span className="pixel-nordic-aurora__band pixel-nordic-aurora__band--c" />
      </div>

      {/* Luna pixel — fija en el cielo, no panea con el paisaje */}
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

      {/* Cuervo grande que cruza el cielo */}
      {!reduceMotion && !batcave && (
        <div
          className="pixel-nordic-raven-flight absolute left-0 top-[16%] z-[1] h-4 w-6 text-[#05080a] sm:h-5 sm:w-8"
          aria-hidden
        >
          <PixelRavenFlight />
        </div>
      )}
      {/* Segundo cuervo más pequeño, dirección inversa */}
      {!reduceMotion && !batcave && (
        <div
          className="pixel-nordic-raven-flight pixel-nordic-raven-flight--small absolute left-0 top-[8%] z-[1] h-3 w-4 text-[#05080a] opacity-70 sm:h-3.5 sm:w-5"
          aria-hidden
        >
          <PixelRavenFlight />
        </div>
      )}
      {/* Bandada de pájaros diminutos al fondo */}
      {!reduceMotion && !batcave && (
        <div
          className="pixel-nordic-bird-flock absolute left-0 top-[12%] z-[1] h-2 w-6 text-[#05080a] opacity-60 sm:h-2.5 sm:w-8"
          aria-hidden
        >
          <PixelBirdFlock />
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
        {/* BATCAVE: arco de cueva pixel superpuesto al fiordo (mood batcave) */}
        {batcave && (
          <g className="pixel-nordic-cave-arch" aria-hidden>
            {/* Techo de roca */}
            <rect x="0" y="0" width="320" height="14" fill="#030507" />
            <rect x="0" y="14" width="320" height="2" fill="#060a10" />
            {/* Stalactitas izquierda — descienden hacia el centro */}
            <rect x="0" y="16" width="44" height="8" fill="#030507" />
            <rect x="0" y="24" width="24" height="6" fill="#030507" />
            <rect x="0" y="30" width="12" height="8" fill="#030507" />
            <rect x="44" y="16" width="30" height="10" fill="#030507" />
            <rect x="50" y="26" width="16" height="8" fill="#030507" />
            <rect x="54" y="34" width="8" height="6" fill="#030507" />
            <rect x="74" y="16" width="24" height="14" fill="#030507" />
            <rect x="80" y="30" width="12" height="8" fill="#030507" />
            <rect x="82" y="38" width="6" height="6" fill="#030507" />
            <rect x="98" y="16" width="18" height="10" fill="#030507" />
            <rect x="102" y="26" width="10" height="6" fill="#060a10" />
            {/* Centro abierto: x=116 a x=204 — enmarca el umbral */}
            {/* Stalactitas derecha — espejo */}
            <rect x="204" y="16" width="18" height="10" fill="#030507" />
            <rect x="208" y="26" width="10" height="6" fill="#060a10" />
            <rect x="222" y="16" width="24" height="14" fill="#030507" />
            <rect x="228" y="30" width="12" height="8" fill="#030507" />
            <rect x="232" y="38" width="6" height="6" fill="#030507" />
            <rect x="246" y="16" width="30" height="10" fill="#030507" />
            <rect x="254" y="26" width="16" height="8" fill="#030507" />
            <rect x="258" y="34" width="8" height="6" fill="#030507" />
            <rect x="276" y="16" width="44" height="8" fill="#030507" />
            <rect x="296" y="24" width="24" height="6" fill="#030507" />
            <rect x="308" y="30" width="12" height="8" fill="#030507" />
            {/* Borde inferior del techo — línea más clara */}
            <rect x="0" y="14" width="320" height="1" fill="#0a121c" />
          </g>
        )}

        {/* Fade cross entre paisajes — cada zona aparece/desaparece */}
        <g
          opacity={zone === "fjord" ? 1 : 0}
          style={{ transition: reduceMotion ? "none" : "opacity 0.6s ease" }}
        >
          {FjordScene()}
        </g>
        <g
          opacity={zone === "forest" ? 1 : 0}
          style={{ transition: reduceMotion ? "none" : "opacity 0.6s ease" }}
        >
          {ForestScene()}
        </g>
        <g
          opacity={zone === "mountains" ? 1 : 0}
          style={{ transition: reduceMotion ? "none" : "opacity 0.6s ease" }}
        >
          {MountainsScene()}
        </g>
        <g
          opacity={zone === "shore" ? 1 : 0}
          style={{ transition: reduceMotion ? "none" : "opacity 0.6s ease" }}
        >
          {ShoreScene()}
        </g>
        <g
          opacity={zone === "cave" ? 1 : 0}
          style={{ transition: reduceMotion ? "none" : "opacity 0.6s ease" }}
        >
          {CaveScene()}
        </g>
        <g
          opacity={zone === "moon" ? 1 : 0}
          style={{ transition: reduceMotion ? "none" : "opacity 0.6s ease" }}
        >
          {MoonScene()}
        </g>
      </svg>

      {/* Niebla baja sobre el agua */}
      <div className="pixel-nordic-mist absolute inset-x-0 bottom-0 h-[30%]" aria-hidden />
      <div className="pixel-nordic-scanlines absolute inset-0" aria-hidden />

      <PixelSnowCanvas className="z-[2]" />
      <PixelRainCanvas className="z-[3]" density={800} />

      <div className="pixel-nordic-content-veil absolute inset-0 z-[3]" aria-hidden />
      {(batcave || zone === "cave") && (
        <div className="pixel-nordic-torch-glow absolute inset-x-0 bottom-0 z-[3]" aria-hidden />
      )}
      {batcave && <div className="pixel-nordic-batcave-focus absolute inset-0 z-[3]" aria-hidden />}
      <div className="pixel-nordic-vignette absolute inset-0 z-[3]" />
    </div>
  );
}
