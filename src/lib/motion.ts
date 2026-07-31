/** Escala de motion compartida (CSS vars + Framer Motion).
 * Nombrado `motionTokens` para no colisionar con `motion` de framer-motion.
 */
export const motionTokens = {
  /** Segundos — Framer Motion */
  fast: 0.15,
  base: 0.2,
  slow: 0.35,
  page: 0.22,
  card: 0.28,
  stagger: 0.04,
  ease: [0.25, 0.1, 0.25, 1] as const,
  easeOut: [0.16, 1, 0.3, 1] as const,
  easePage: [0.22, 1, 0.36, 1] as const,
  easePunchy: [0.45, 0, 0.2, 1] as const,
} as const;

/** @deprecated Usar `motionTokens`. */
export const motion = motionTokens;

export type MotionDuration = keyof Pick<
  typeof motionTokens,
  "fast" | "base" | "slow" | "page" | "card"
>;
