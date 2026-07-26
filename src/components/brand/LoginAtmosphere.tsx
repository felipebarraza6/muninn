import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { PixelCityLayers } from "@/components/brand/PixelCityLayers";
import { PixelNordicScene } from "@/components/brand/PixelNordicScene";
import { GOTHAM_USE_STATIC_LAYERS } from "@/lib/gothamAssets";
import { cn } from "@/lib/utils";

type SwarmNode = {
  x: number;
  y: number;
  size: string;
  float: string;
  glow?: boolean;
};

type Streak = {
  key: string;
  d: string;
  delay: number;
  duration: number;
  weight: "soft" | "mid";
};

/** Coordenadas % — permiten conectar puntos con SVG. */
const SWARM_NODES: SwarmNode[] = [
  { x: 4, y: 10, size: "h-3 w-3", float: "login-float-a", glow: true },
  { x: 11, y: 22, size: "h-2 w-2", float: "login-float-c" },
  { x: 7, y: 38, size: "h-3.5 w-3.5", float: "login-float-b", glow: true },
  { x: 16, y: 52, size: "h-2 w-2", float: "login-float-e" },
  { x: 5, y: 68, size: "h-2.5 w-2.5", float: "login-float-d" },
  { x: 20, y: 82, size: "h-2 w-2", float: "login-float-a" },
  { x: 28, y: 14, size: "h-1.5 w-1.5", float: "login-float-b" },
  { x: 34, y: 30, size: "h-3 w-3", float: "login-float-c", glow: true },
  { x: 30, y: 58, size: "h-2 w-2", float: "login-float-d" },
  { x: 38, y: 74, size: "h-1.5 w-1.5", float: "login-float-e" },
  { x: 44, y: 20, size: "h-3.5 w-3.5", float: "login-float-a", glow: true },
  { x: 48, y: 46, size: "h-2 w-2", float: "login-float-b" },
  { x: 42, y: 88, size: "h-2.5 w-2.5", float: "login-float-c" },
  { x: 55, y: 12, size: "h-2.5 w-2.5", float: "login-float-e", glow: true },
  { x: 62, y: 28, size: "h-2 w-2", float: "login-float-d" },
  { x: 58, y: 44, size: "h-4 w-4", float: "login-float-a", glow: true },
  { x: 68, y: 18, size: "h-1.5 w-1.5", float: "login-float-c" },
  { x: 72, y: 36, size: "h-3 w-3", float: "login-float-b", glow: true },
  { x: 64, y: 56, size: "h-2 w-2", float: "login-float-e" },
  { x: 76, y: 48, size: "h-3.5 w-3.5", float: "login-float-d", glow: true },
  { x: 70, y: 70, size: "h-1.5 w-1.5", float: "login-float-a" },
  { x: 82, y: 22, size: "h-2.5 w-2.5", float: "login-float-c" },
  { x: 88, y: 40, size: "h-2 w-2", float: "login-float-b", glow: true },
  { x: 84, y: 62, size: "h-2.5 w-2.5", float: "login-float-e" },
  { x: 92, y: 16, size: "h-1.5 w-1.5", float: "login-float-d" },
  { x: 90, y: 78, size: "h-3.5 w-3.5", float: "login-float-a", glow: true },
  { x: 78, y: 86, size: "h-2 w-2", float: "login-float-c" },
  { x: 52, y: 78, size: "h-2.5 w-2.5", float: "login-float-b" },
];

function dist(a: SwarmNode, b: SwarmNode) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Curva suave entre dos puntos (estela nebulosa). */
function streakPath(a: SwarmNode, b: SwarmNode, bend = 0.22): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = mx - (dy / len) * len * bend;
  const cy = my + (dx / len) * len * bend;
  return `M ${a.x} ${a.y} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${b.x} ${b.y}`;
}

function buildStreaks(nodes: SwarmNode[], maxDist: number, maxPerNode: number): Streak[] {
  const streaks: Streak[] = [];
  const seen = new Set<string>();
  let idx = 0;

  for (let i = 0; i < nodes.length; i++) {
    const neighbors = nodes
      .map((n, j) => ({ j, d: dist(nodes[i], n) }))
      .filter((n) => n.j !== i && n.d > 3 && n.d <= maxDist)
      .sort((a, b) => a.d - b.d)
      .slice(0, maxPerNode);

    for (const n of neighbors) {
      const a = Math.min(i, n.j);
      const b = Math.max(i, n.j);
      const key = `${a}-${b}`;
      if (seen.has(key)) continue;
      seen.add(key);
      streaks.push({
        key,
        d: streakPath(nodes[i], nodes[n.j], 0.18 + (idx % 3) * 0.06),
        delay: (idx % 8) * 0.9,
        duration: 8 + (idx % 5) * 1.2,
        weight: idx % 3 === 0 ? "mid" : "soft",
      });
      idx++;
    }
  }

  const longPairs: Array<[number, number]> = [
    [0, 15],
    [7, 22],
    [2, 19],
    [11, 25],
    [14, 27],
    [4, 17],
  ];
  for (const [i, j] of longPairs) {
    if (!nodes[i] || !nodes[j]) continue;
    const key = `long-${i}-${j}`;
    if (seen.has(key)) continue;
    seen.add(key);
    streaks.push({
      key,
      d: streakPath(nodes[i], nodes[j], 0.32),
      delay: 1.8 + idx * 0.55,
      duration: 11 + (idx % 3),
      weight: "soft",
    });
    idx++;
  }

  return streaks;
}

type Props = {
  className?: string;
  intensity?: "full" | "soft";
  /** "pixel": ciudad lluviosa pixel (login Muninn). */
  variant?: "aurora" | "pixel";
  /** Parallax de capas al scroll (solo landing Gotham). */
  parallax?: boolean;
  /** gotham = ciudad viva; batcave = umbral de entrada. */
  mood?: "gotham" | "batcave";
};

/**
 * Atmósfera full-bleed: matices tonales + estrellas/estelas difusas.
 * variant="pixel" → ciudad lluviosa pixel (login Muninn).
 */
export function LoginAtmosphere({
  className,
  intensity = "full",
  variant = "aurora",
  parallax = false,
  mood = "gotham",
}: Props) {
  const reduceMotion = useReducedMotion();
  const soft = intensity === "soft";
  const streaks = useMemo(() => buildStreaks(SWARM_NODES, soft ? 17 : 20, soft ? 1 : 2), [soft]);

  if (variant === "pixel") {
    if (GOTHAM_USE_STATIC_LAYERS) {
      return (
        <PixelCityLayers
          className={className ?? "absolute inset-0"}
          parallax={parallax}
          mood={mood}
          rain
        />
      );
    }
    return (
      <PixelNordicScene
        className={className ?? "absolute inset-0"}
        parallax={parallax}
        mood={mood}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* Base con matices (no plano) */}
      <div
        className={cn(
          "absolute inset-0",
          soft
            ? "bg-[radial-gradient(ellipse_120%_90%_at_10%_0%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_55%),radial-gradient(ellipse_90%_80%_at_90%_100%,color-mix(in_oklab,var(--primary-soft)_70%,transparent),transparent_50%),linear-gradient(165deg,color-mix(in_oklab,var(--background)_92%,var(--primary)_8%),var(--background)_45%,color-mix(in_oklab,var(--background)_88%,var(--muted)_12%))]"
            : "bg-[radial-gradient(ellipse_110%_85%_at_8%_-5%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_52%),radial-gradient(ellipse_95%_75%_at_95%_105%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_48%),radial-gradient(ellipse_70%_55%_at_55%_40%,color-mix(in_oklab,var(--muted)_55%,transparent),transparent_65%),linear-gradient(160deg,color-mix(in_oklab,var(--background)_90%,var(--primary)_10%),var(--background)_42%,color-mix(in_oklab,var(--background)_86%,var(--secondary)_14%))]",
        )}
      />

      {/* Nebulosas / blobs tonales */}
      <div
        className={cn(
          "absolute -left-[14%] top-[-10%] h-[32rem] w-[32rem] rounded-full blur-3xl",
          soft ? "bg-primary/16" : "bg-primary/22 dark:bg-primary/14",
          !reduceMotion && "login-drift",
        )}
      />
      <div
        className={cn(
          "absolute -right-[12%] bottom-[-8%] h-[30rem] w-[30rem] rounded-full blur-3xl",
          soft ? "bg-primary/10" : "bg-primary/14 dark:bg-primary/10",
          !reduceMotion && "login-drift-slow",
        )}
      />
      <div
        className={cn(
          "absolute left-[35%] top-[42%] h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl",
          "bg-[color-mix(in_oklab,var(--muted)_70%,var(--primary)_12%)] opacity-60 dark:opacity-40",
          !reduceMotion && "login-float-d",
        )}
      />
      <div
        className={cn(
          "absolute right-[18%] top-[18%] h-[16rem] w-[16rem] rounded-full blur-3xl",
          "bg-[color-mix(in_oklab,var(--secondary)_80%,var(--primary)_8%)] opacity-50 dark:bg-primary/8 dark:opacity-50",
          !reduceMotion && "login-float-b",
        )}
      />

      {/* Estelas difusas / borrosas (sin núcleo nítido ni brillito) */}
      <svg
        className={cn(
          "absolute inset-0 h-full w-full",
          soft ? "opacity-[0.22] dark:opacity-[0.26]" : "opacity-[0.28] dark:opacity-[0.32]",
        )}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="login-streak-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
            <stop offset="45%" stopColor="var(--primary)" stopOpacity="0.35" />
            <stop offset="55%" stopColor="var(--primary)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
          <filter id="login-streak-blur-soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.15" />
          </filter>
          <filter id="login-streak-blur-heavy" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.1" />
          </filter>
        </defs>

        <g filter="url(#login-streak-blur-heavy)" opacity="0.55">
          {streaks.map((s) => (
            <path
              key={`haze-${s.key}`}
              d={s.d}
              fill="none"
              stroke="url(#login-streak-grad)"
              strokeWidth={s.weight === "mid" ? 2.4 : 1.8}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              className={cn(!reduceMotion && "login-atmosphere-streak")}
              style={
                !reduceMotion
                  ? {
                      animationDelay: `${s.delay}s`,
                      animationDuration: `${s.duration}s`,
                    }
                  : undefined
              }
            />
          ))}
        </g>

        <g filter="url(#login-streak-blur-soft)" opacity="0.4">
          {streaks.map((s) => (
            <path
              key={s.key}
              d={s.d}
              fill="none"
              stroke="url(#login-streak-grad)"
              strokeWidth={s.weight === "mid" ? 1.1 : 0.75}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              className={cn(!reduceMotion && "login-atmosphere-streak")}
              style={
                !reduceMotion
                  ? {
                      animationDelay: `${s.delay + 0.4}s`,
                      animationDuration: `${s.duration * 1.1}s`,
                    }
                  : undefined
              }
            />
          ))}
        </g>
      </svg>

      {/* Estrellas borrosas */}
      <div className="absolute inset-0">
        {SWARM_NODES.map((node, i) => (
          <span
            key={i}
            className={cn(
              "login-atmosphere-dot absolute -translate-x-1/2 -translate-y-1/2 rounded-full",
              node.size,
              !reduceMotion && node.float,
              node.glow && "login-atmosphere-dot-glow",
              soft && "opacity-60",
            )}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          />
        ))}
      </div>

      {/* Grain: textura tonal */}
      <div className="login-atmosphere-grain absolute inset-0" />

      {/* Vignette: protege legibilidad */}
      <div
        className={cn(
          "absolute inset-0",
          soft
            ? "bg-[radial-gradient(ellipse_at_center,transparent_40%,color-mix(in_oklab,var(--background)_62%,transparent)_100%)]"
            : "bg-[radial-gradient(ellipse_65%_60%_at_72%_45%,transparent_16%,color-mix(in_oklab,var(--background)_52%,transparent)_92%)]",
        )}
      />
    </div>
  );
}
