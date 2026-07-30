# landing-v2 — Landing rediseñada: menú lateral, paisajes por sección, copy mejorado

## TL;DR (For humans)

**What you'll get:** Landing navegada por menú lateral (sin scroll). Cada sección tiene contenido distinto Y un paisaje nórdico diferente de fondo. Copy renovado basado en investigación de competencia (CrewAI, Arahi, Nagent). Sin referencias a Gotham.

**Why this approach:** El scroll-snap no funcionaba porque la estructura no fue diseñada para scroll. Menú lateral + state-driven da control total, animaciones limpias, y permite que cada sección se sienta como un "lugar" distinto del mundo Muninn.

**Effort:** Large | **Risk:** Medium

## Scope

### Must have

1. Rename "Compañero" → "Agente" en copy y navegación
2. Mejorar textos de landing basado en research de competencia (lenguaje más directo, outcome-driven)
3. Reemplazar scroll-snap con state-driven section switching (activeSection state)
4. Menú lateral con iconos (siempre visible, no estorba)
5. PixelNordicScene zone prop con 5 variantes de paisaje (fjord, forest, mountains, shore, cave)
6. AnimatePresence transitions entre secciones y paisajes
7. Remover todas las referencias a Gotham (CSS vars, mood, text)
8. Build exit 0

### Must NOT have

- No cambiar diseño visual (pixel art, dark, mint)
- No modificar entrar.tsx (cave login ya está bueno)
- No modificar PixelRaven, LoginProductDemo, auth, dashboard
- No nuevas dependencias externas

## Todos

- [ ] 1. Copy audit + Gotham removal: loginLanding.ts (nuevos textos, "Agente", remover Gotham)
- [ ] 2. Zone prop + scene variants: PixelNordicScene.tsx + LoginAtmosphere.tsx (5 paisajes SVG)
- [ ] 3. State-driven nav + left rail + content panels: MuninnLoginLanding.tsx + styles.css
- [ ] 4. Final build + verification
