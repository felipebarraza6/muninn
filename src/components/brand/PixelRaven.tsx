import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Look = "left" | "center" | "right";

const LOOK_CYCLE: Look[] = ["center", "left", "center", "right", "center", "left", "right"];

/** Frames del cuervo: mismo cuerpo, ojo y pico según mirada (sin flip). */
function RavenFrame({ look }: { look: Look }) {
  const eyeX = look === "left" ? 4 : look === "right" ? 6 : 5;
  const beakX = look === "left" ? 1 : look === "right" ? 3 : 2;

  return (
    <svg viewBox="0 0 16 14" shapeRendering="crispEdges" className="h-full w-full" aria-hidden>
      <g fill="currentColor">
        <rect x="5" y="1" width="3" height="1" />
        <rect x="4" y="2" width="5" height="1" />
        <rect x="2" y="3" width="7" height="1" />
        <rect x="4" y="4" width="6" height="1" />
        <rect x="5" y="5" width="6" height="1" />
        <rect x="5" y="6" width="8" height="1" />
        <rect x="4" y="7" width="10" height="1" />
        <rect x="3" y="8" width="11" height="1" />
        <rect x="3" y="9" width="9" height="1" />
        <rect x="4" y="10" width="6" height="1" />
        <rect x="5" y="11" width="4" height="1" />
        <rect x="6" y="12" width="1" height="1" />
        <rect x="8" y="12" width="1" height="1" />
        <rect x="5" y="13" width="2" height="1" />
        <rect x="8" y="13" width="2" height="1" />
      </g>
      <rect
        x={beakX}
        y="4"
        width="2"
        height="1"
        fill="color-mix(in oklab, var(--primary) 75%, #fbbf24)"
      />
      <rect x={eyeX} y="3" width="1" height="1" fill="var(--primary)" />
    </svg>
  );
}

type Props = {
  className?: string;
  /** Destaca el mark (marco mint + pedestal). */
  featured?: boolean;
};

/**
 * Cuervo de Odín pixel — mira a lados en pasos (estilo sprite).
 */
export function PixelRaven({ className, featured = true }: Props) {
  const reduceMotion = useReducedMotion();
  const [lookIdx, setLookIdx] = useState(0);
  const look = reduceMotion ? "center" : LOOK_CYCLE[lookIdx % LOOK_CYCLE.length];

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setLookIdx((i) => (i + 1) % LOOK_CYCLE.length);
    }, 900);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <div
      className={cn(
        "pixel-raven relative shrink-0",
        featured && "pixel-raven--featured",
        className,
      )}
      aria-hidden
    >
      <div className="pixel-raven__sprite text-foreground">
        <RavenFrame look={look} />
      </div>
      {featured && <span className="pixel-raven__pedestal" />}
    </div>
  );
}
