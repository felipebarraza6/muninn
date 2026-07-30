---
slug: landing-redesign
status: awaiting-approval
intent: clear
review_required: false
pending-action: write .omo/plans/landing-redesign.md
approach: "Refactor MuninnLoginLanding.tsx and entrar.tsx with vertical snap sections, hero-as-framed-raven, scroll-based Nordic scene zoom transitions, enhanced cave login, and legibility audit"
---

# Draft: landing-redesign

## Components (topology ledger)

| id                    | outcome                                                                                      | status | evidence path                                                                                |
| --------------------- | -------------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- |
| hero-section          | Muninn raven as centerpiece "cuadro", Nordic scene full background, live demo card overlay   | active | MuninnLoginLanding.tsx L729-770, PixelNordicScene.tsx, PixelRaven.tsx                        |
| section-nav           | Vertical snap sections + improved sticky nav                                                 | active | MuninnLoginLanding.tsx L173-237 (existing nav), CSS scroll-snap                              |
| scroll-zoom           | CSS custom property driven zoom into forest as user progresses                               | active | PixelNordicScene.tsx L289-318 (existing parallax with --nordic-enter), styles.css L2793-2834 |
| pixel-art-transitions | Scene elements change by section: moon phase, aurora intensity, snow density, raven position | active | PixelNordicScene.tsx layers, styles.css L2323-2789                                           |
| companion-flujo-atoms | Sections become snap panels with condensed content                                           | active | MuninnLoginLanding.tsx L774-850 (existing content), loginLanding.ts data                     |
| live-demo-section     | LoginProductDemo as floating card in hero + dedicated snap section                           | active | LoginProductDemo.tsx, MuninnLoginLanding.tsx L855-872                                        |
| docs-section          | Restructured platform section in snap panel                                                  | active | MuninnLoginLanding.tsx L877-948                                                              |
| cave-login            | Entrar page enhanced with cave framing, torch effects, batcave mood                          | active | entrar.tsx, PixelNordicScene.tsx batcave mode L2837-2874                                     |
| legibility-audit      | Text contrast, spacing, font sizing review across all landing sections                       | active | styles.css, MuninnLoginLanding.tsx                                                           |
| reduced-motion        | All scroll/zoom effects respect prefers-reduced-motion                                       | active | Existing useReducedMotion patterns                                                           |

## Open assumptions (announced defaults)

| assumption                                                                                | adopted default                                                    | rationale                                                           | reversible? |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------- | ----------- |
| Vertical snap sections use CSS scroll-snap-type                                           | scroll-snap-type: y mandatory with scroll-mutual exclusion via CSS | Native performance, no JS framerate issues, works on mobile         | Yes         |
| Transition between sections uses Framer Motion page transitions + CSS snap                | Combine AnimatePresence with scroll-snap for best UX               | Smooth visual transition + native scroll behavior                   | Yes         |
| Zoom into forest: scene scales from 1.0 to ~1.6 across sections                           | Use existing --nordic-enter mechanism extended across full page    | Already implemented in PixelNordicScene parallax, just extend range | Yes         |
| Cave login: add SVG cave arch framing + warm torch glow                                   | CSS mask + gradient overlays on existing batcave scene             | Non-invasive, composable on existing components                     | Yes         |
| Section count reduced from 6 to 5 (hero, companion, flow+atoms, live+demo, docs+platform) | Merge flow+atoms into one technical section                        | Reduces scroll fatigue, keeps content density                       | Yes         |
| Legibility: increase pixel-display font sizes by 1-2px across sections                    | Current 12-13px body text → 13-15px                                | Matches request for better readability                              | Yes         |

## Findings (cited - path:lines)

1. Current hero at MuninnLoginLanding.tsx L729-770: flex column centered with PitchSwap + CTA buttons, no raven as visual centerpiece
2. Section nav exists at MuninnLoginLanding.tsx L173-237: sticky top bar with progress indicator, but no scroll-snap
3. PixelNordicScene parallax at styles.css L2793-2834 uses --nordic-enter (0→1) for subtle scale (1 + enter\*0.22) and layer translation — good foundation for enhanced zoom
4. Entrar page at entrar.tsx L56-131 uses mood="batcave" for darkened scene with vignette focus at styles.css L2837-2874
5. LoginProductDemo at LoginProductDemo.tsx is a 411-line interactive sandbox component ready for hero card placement
6. LoginLandingPanel.tsx L106-190 has PitchSwap with brand mode that renders PixelRaven + MUNINN wordmark
7. pixel-display font at styles.css L698-701 uses Pixelify Sans at 12-13px for body text — user reports legibility issues
8. Full page content spans ~965 lines in MuninnLoginLanding.tsx — too much scrolling confirmed

## Decisions (with rationale)

1. **Vertical snap sections** — user confirmed. CSS `scroll-snap-type: y mandatory` on container, `scroll-snap-align: start` on each section. Improves navigation and reduces scroll fatigue.
2. **Hero as framed raven** — PixelRaven featured component inside a "frame" (border container) centered on screen, Nordic scene fills background, LoginProductDemo as floating card overlay. Replaces current text-heavy hero.
3. **Scroll zoom extends existing parallax** — --nordic-enter range increased from 0-1 to 0-1 with more aggressive scale curve. Scene elements respond per-section: moon darkens, aurora intensifies, snow increases, mist rises.
4. **Section consolidation** — 5 sections instead of 6: hero → compañero → flujo+átomos (merged) → live demo → docs+plataforma. Each is one snap panel.
5. **Cave login** — Add SVG cave arch SVG overlay to PixelNordicScene when mood="batcave", plus warm amber torch gradient on form card, retaining existing batcave vignette.
6. **Font sizing** — Increase pixel-display body to 13-15px, section headings to 15-17px. Audited across all .login-pixel text elements.

## Scope IN

1. Restructure MuninnLoginLanding.tsx hero: raven centerpiece, Nordic scene full bg, live demo card overlay
2. Implement vertical snap sections (CSS scroll-snap + updated nav)
3. Enhance PixelNordicScene scroll zoom (extended --nordic-enter range, per-section element states)
4. Consolidate and condense section content (merge flow+atoms, shorter copy)
5. Create cave login enhancements in PixelNordicScene (cave arch SVG, torch glow)
6. Legibility pass: font sizes, contrast, spacing across landing
7. Ensure all motion respects prefers-reduced-motion

## Scope OUT (Must NOT have)

- Do NOT modify any routes other than `/` (login.tsx → MuninnLoginLanding) and `/entrar` (entrar.tsx)
- Do NOT touch any authenticated dashboard code (/app routes)
- Do NOT modify the actual login form behavior or auth logic
- Do NOT add new external dependencies (use existing: framer-motion, tailwind, radix)
- Do NOT change the copy/content in loginLanding.ts unless for legibility (font size only)
- Do NOT remove any existing section content — only consolidate/condense layout

## Open questions

None — user confirmed vertical snap navigation, all other decisions have defensible defaults.

## Approval gate

status: awaiting-approval

**Brief**: Redesign the Muninn landing (and login cave) with:

1. Hero = Muninn raven as framed centerpiece, Nordic scene full background, live demo card overlay
2. Vertical scroll-snap sections (5 panels) instead of infinite scroll
3. Enhanced zoom transition into the forest as you progress (extend existing parallax)
4. Cave-framed login with torch glow on `/entrar`
5. Font sizing + legibility improvements

**Files touched**: MuninnLoginLanding.tsx, PixelNordicScene.tsx, entrar.tsx, styles.css (+ new CSS for cave arch, snap, zoom), login.tsx
**Implementation phases**: 5 parallel work units
**Timeline**: ~400-600 lines total change, mostly visual CSS + layout restructuring in MuninnLoginLanding.tsx

**After approval**: I'll write the full plan to `.omo/plans/landing-redesign.md` and delegate to visual-engineering specialists.
