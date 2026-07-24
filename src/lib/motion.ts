/** Escala de motion compartida (CSS vars + Framer Motion). */
export const motion = {
  /** Segundos — Framer Motion */
  fast: 0.15,
  base: 0.2,
  slow: 0.35,
  stagger: 0.04,
  ease: [0.25, 0.1, 0.25, 1] as const,
  easeOut: [0.16, 1, 0.3, 1] as const,
} as const;

export type MotionDuration = keyof Pick<typeof motion, "fast" | "base" | "slow">;
