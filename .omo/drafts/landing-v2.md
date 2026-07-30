---
slug: landing-v2
status: awaiting-approval
intent: clear
review_required: false
pending-action: write .omo/plans/landing-v2.md
approach: "Replace scroll-snap with menu-driven section switching. Each nav section shows different content + different Nordic landscape zone. Improve content, remove Gotham references. Respect current pixel/Nordic/mint design."
---

# Draft: landing-v2

## Findings (cited - path:lines)

1. **Current scroll-snap isn't working** — MuninnLoginLanding.tsx L641 uses `.snap-container` with `overflow-y: scroll` forcing scroll. User explicitly wants NO scroll, menu-driven navigation instead.
2. **PixelNordicScene has one static scene** — Single SVG fiordo scene (L263-547). No facility for different landscape zones per section.
3. **LoginAtmosphere** wraps PixelNordicScene with variant="pixel" mood="gotham" — still references Gotham. Must remove.
4. **Content is too verbose** — "Contigo" section (L696-726) has 3 cards with long text. "Flujo+Átomos" merged section (L728-751) has two SectionChromes with heavy content.
5. **Gotham references exist** — styles.css L612-631 has `--gotham-*` CSS vars, LoginAtmosphere has `mood="gotham"`, entrar.tsx had "Volver a Gotham" (already removed). Need to rename to Nordic.
6. **Hero section (L642-694)** is good — framed raven, CTA buttons, live demo card. Keep as-is.
7. **Navigation** currently uses IntersectionObserver to track active section (L580-600). Needs to become a click-driven state controller instead.
8. **LandingNav** (defined in file) has section buttons with active highlighting. Can be repurposed as the primary nav.

## Decisions (with rationale)

1. **State-driven section switching** — Replace scroll-snap with `activeSection` state. When user clicks nav item → setActiveSection(id) → content panel and background scene both change. No scroll, instant transitions.
2. **PixelNordicScene gets a `zone` prop** — Instead of one scene, PixelNordicScene renders different SVG scene variants based on `zone` prop: "fjord" (current), "forest", "mountains", "shore", "cave". Each zone is a different pixel landscape.
3. **Animated transitions** — Content panel uses `<AnimatePresence mode="wait">` with slide/fade. Background uses crossfade or zoom transition between zones.
4. **Content restructure** — Condense to 5 concise sections:
   - Inicio: Hero (current framed raven)
   - Compañero: Short 3-card companion (condensed text)
   - Harness: Flow steps + atom grid (concise)
   - Live: LoginProductDemo
   - Docs: Short value blocks + CTA
5. **Remove all Gotham** — Rename CSS vars `--gotham-*` → `--nordic-*`, remove Gotham references from LoginAtmosphere, styles.css.
6. **Navigation as left rail** — Small vertical rail on the left side with section icons, current section highlighted. Clean, minimal, always visible.

## Scope IN

1. Convert scroll-snap to state-driven section rendering in MuninnLoginLanding.tsx
2. Add `zone` prop to PixelNordicScene with multiple landscape SVG variants
3. Create left rail navigation (replacing current top nav)
4. Restructure content (condense text, improve "Compañero" content)
5. Remove all Gotham references (CSS vars, components, text)
6. Add AnimatePresence transitions for section + scene changes
7. Verify build

## Scope OUT (Must NOT have)

- No changes to design system (pixel style, dark, mint)
- No changes to PixelRaven component
- No changes to LoginProductDemo (keep as-is)
- No changes to entrar.tsx (cave login is already good)
- No changes to auth logic or dashboard routes
- No new external dependencies
- No removal of framed raven hero

## Approval gate

status: awaiting-approval

### Brief

**Problema**: El scroll-snap actual no funciona bien. Demasiado scroll, la navegación no es fluida, el contenido es verboso, y references a Gotham.

**Solución**: Convertir la landing en una experiencia tipo "museo" o "galería" navegada por menú:

1. **Rail lateral** con iconos de sección (siempre visible, no estorba)
2. **Cada clic** → cambia el panel de contenido Y el paisaje de fondo
3. **5 zonas del mundo nórdico**: fiordo (actual), bosque, montañas, orilla, cueva
4. **Contenido condensado** — textos más cortos, mismos componentes
5. **Sin Gotham** — renombrar todo a Nordic
6. **Transiciones animadas** entre secciones

### Archivos a modificar

- `MuninnLoginLanding.tsx` — estructura completa (cambiar scroll-snap → state-driven, rail nav, section panels)
- `PixelNordicScene.tsx` — zone prop, 5 variantes de paisaje SVG
- `LoginAtmosphere.tsx` — remover Gotham, pasar zone prop
- `styles.css` — renombrar vars gotham→nordic, nuevos estilos rail/transition
- `loginLanding.ts` — textos condensados, remover Gotham
- `login.tsx` — pasar zone prop a LoginAtmosphere

### Fases de implementación

Wave 1 (paralelo): (1) Zone prop + scene variants, (2) Content/text audit + Gotham removal
Wave 2: State-driven navigation + left rail + transitions
Wave 3: Final integration + build

### Próximo paso

Correr `$start-work .omo/plans/landing-v2.md` tras aprobación.
