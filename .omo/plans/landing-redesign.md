# landing-redesign - Work Plan

## TL;DR (For humans)

**What you'll get:** A redesigned Muninn landing page with the raven as a framed centerpiece over the Nordic scene, live demo card floating in the hero, 5 vertical snap sections instead of endless scroll with a zoom-into-the-forest effect as you scroll, and a cave-framed login page. Better legibility throughout.

**Why this approach:** Vertical snap sections eliminate scroll fatigue while keeping all existing content. The zoom transition extends the existing parallax system (`--nordic-enter`) making it more dramatic. The cave login enhances the existing batcave mood with minimal new code.

**What it will NOT do:** Touch any authenticated dashboard routes, modify auth logic, add new dependencies, or remove any content — only restructure layout.

**Effort:** Large
**Risk:** Medium - visual layout restructuring of 965-line component, needs careful scroll-snap coordination
**Decisions to sanity-check:** Scroll-snap container vs per-section height, zoom intensity curve, cave arch shape/style

Your next move: Run `$start-work` to execute this plan. Full execution detail follows below.

---

> TL;DR (machine): Large effort, Medium risk — restructure MuninnLoginLanding.tsx hero + vertical snap sections + enhanced Nordic zoom + cave login + legibility audit

## Scope

### Must have

1. Hero section: Muninn raven (PixelRaven featured) as framed centerpiece, Nordic scene full background, LoginProductDemo as floating card overlay
2. Vertical scroll-snap navigation: 5 snap panels (hero, compañero, flujo+átomos, live demo, docs+plataforma)
3. Enhanced scroll zoom: extend --nordic-enter for dramatic forest zoom, per-section scene element changes
4. Cave login: SVG cave arch framing + warm torch glow on `/entrar`
5. Legibility pass: pixel-display font sizes increased (body 13-15px, headings 15-17px), spacing audit
6. All motion respects prefers-reduced-motion

### Must NOT have (guardrails, anti-slop, scope boundaries)

- No changes to routes other than `/` (login.tsx → MuninnLoginLanding) and `/entrar`
- No changes to auth logic or login form behavior
- No changes to loginLanding.ts content/copy
- No new external dependencies
- No authenticated dashboard code (/app routes)
- No removal of existing section content — only consolidation

## Verification strategy

> Zero human intervention - all verification is agent-executed.

- Test decision: none (visual-only changes, manual QA)
- Evidence: .omo/evidence/landing-redesign/

## Execution strategy

### Parallel execution waves

Wave 1 (all independent — run in parallel):

- Todo 1: Hero raven centerpiece + Nordic bg + live demo card (MuninnLoginLanding.tsx)
- Todo 3: Cave login enhancements (PixelNordicScene.tsx + entrar.tsx + styles.css)
- Todo 5: Legibility audit (styles.css + MuninnLoginLanding.tsx)

Wave 2 (depends on Wave 1 hero restructure):

- Todo 2: Vertical snap sections + nav refactor (MuninnLoginLanding.tsx + styles.css)
- Todo 4: Enhanced scroll zoom transitions (PixelNordicScene.tsx + styles.css)

Wave 3 (integration):

- Todo 6: Final integration, scroll coordination, reduced-motion checks

### Dependency matrix

| Todo                | Depends on      | Blocks | Can parallelize with |
| ------------------- | --------------- | ------ | -------------------- |
| 1. Hero restructure | —               | 2      | 3, 5                 |
| 2. Snap sections    | 1               | —      | 4                    |
| 3. Cave login       | —               | —      | 1, 5                 |
| 4. Scroll zoom      | 1 (scene setup) | —      | 2                    |
| 5. Legibility audit | —               | —      | 1, 3                 |
| 6. Integration      | 1, 2, 3, 4, 5   | —      | —                    |

## Todos

> Implementation + Test = ONE todo. Never separate.

<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->

- [ ] 1. Hero restructure: raven centerpiece + Nordic scene background + live demo card
     What to do:
  - In MuninnLoginLanding.tsx, restructure the hero section (currently L729-770) to:
    - Make PixelNordicScene the full-viewport background (already rendered by LoginAtmosphere in login.tsx)
    - Center a "framed" PixelRaven (featured) component as the visual hero — use a border frame with pixel-jules-sm styling, 2dd4bf accent border, dark card background
    - Below/beside the framed raven, add the Muninn wordmark (MUNINN text)
    - Overlay LoginProductDemo as a floating card in the lower-middle of the hero area
    - Keep CTA buttons (Entrar + Ver cómo opera) but reposition below the raven frame
    - Remove the existing "code editor viewport" block (L639-724)
    - Remove the existing PitchSwap/hero text, replace with framed raven
    - Make hero section `min-h-dvh` with flex centering
  - In login.tsx, ensure LoginAtmosphere gets `parallax` prop for the hero scene
  - Move LoginProductDemo import — it's already imported
    Must NOT do:
  - Do not remove the CTA buttons entirely, just reposition
  - Do not delete any existing imports needed elsewhere
  - Do not modify PixelRaven component itself
    Parallelization: Wave 1 | Blocked by: — | Blocks: 2, 4
    References:
  - MuninnLoginLanding.tsx L729-770 (current hero) L639-724 (code editor to remove)
  - PixelRaven.tsx (available component)
  - LoginProductDemo.tsx (to overlay as card)
  - login.tsx L171-194 (parent layout with LoginAtmosphere)
  - PixelNordicScene.tsx (full background scene)
    Acceptance criteria:
  - Hero shows framed raven centered with Nordic scene behind
  - Live demo card is visible as overlay in hero
  - CTA buttons present below raven
  - No code editor viewport visible
    QA scenarios:
  - `lsp_diagnostics` on MuninnLoginLanding.tsx — 0 errors
  - `bun run build` — exit 0
  - Visual: hero has raven centerpiece, live demo card overlay, Nordic bg
    Commit: Y | feat(landing): restructure hero with framed raven centerpiece and live demo card

- [ ] 2. Vertical snap sections + nav refactor
     What to do:
  - In MuninnLoginLanding.tsx:
    - Wrap all sections in a container with scroll-snap
    - Add CSS classes: `snap-container` (parent, `scroll-snap-type: y mandatory; overflow-y: scroll; height: 100dvh`), `snap-section` (children, `scroll-snap-align: start; min-height: 100dvh;`)
    - Restructure into 5 snap panels:
      1. Hero (todo 1)
      2. Companion (contigo — condensed LOGIN_COMPANION_BEATS)
      3. Flow + Atoms (merged — FlowSteps + AtomSections in one panel)
      4. Live demo (LoginProductDemo)
      5. Docs + Platform (restructured LOGIN_VALUE_BLOCKS + HarnessPeek)
    - Remove explicit `gap-20 lg:gap-28` between sections, replace with snap panels
    - Update LandingNav to highlight which snap section is active using IntersectionObserver (keep existing logic)
    - Remove MobileSectionJump or adapt it
    - Make the nav more compact
    - Reduce overall component height — each section is exactly 100dvh
  - In styles.css, add:
    ```css
    .snap-container {
      scroll-snap-type: y mandatory;
      overflow-y: scroll;
      height: 100dvh;
    }
    .snap-section {
      scroll-snap-align: start;
      min-height: 100dvh;
      overflow-y: auto;
    }
    ```
    Must NOT do:
  - Do not remove content from companion beats, atoms, flow steps, live demo, or docs sections
  - Do not modify the data in loginLanding.ts
  - Keep all existing Reveal/enter animations working
    Parallelization: Wave 2 | Blocked by: 1 | Blocks: 6
    References:
  - MuninnLoginLanding.tsx L726-962 (full section structure)
  - MuninnLoginLanding.tsx L173-237 (LandingNav)
  - MuninnLoginLanding.tsx L240-273 (MobileSectionJump)
  - loginLanding.ts (LOGIN_COMPANION_BEATS, LOGIN_OPERATE_STEPS, LOGIN_ATOMS, LOGIN_VALUE_BLOCKS)
    Acceptance criteria:
  - 5 snap panels visible, each filling viewport
  - Scroll jumps between sections cleanly (snap)
  - Nav highlights active section
  - All content present across sections
    QA scenarios:
  - `lsp_diagnostics` on MuninnLoginLanding.tsx — 0 errors
  - `bun run build` — exit 0
  - Manual: scroll between sections, verify snap, verify nav tracking
    Commit: Y | feat(landing): implement vertical snap sections with 5-panel navigation

- [ ] 3. Cave login enhancements
     What to do:
  - In PixelNordicScene.tsx:
    - When `mood="batcave"`, render an SVG cave arch overlay at the top of the scene (dripping stalactites, arch shape framing the center). Use pixel-style rects to match the art style
    - Add a warm amber torch glow gradient that emanates from the bottom-center (where the form sits). Use existing `--gotham-amber` color
    - The cave arch should be a `<path>` with crispEdges rendering, dark silhouette, framing the upper 30% of the viewport
    - Keep existing batcave vignette + batcave-focus overlay
  - In entrar.tsx:
    - Add a label "Cueva de Muninn" or similar Nordic cave reference near the "Umbral · Batcueva" text
    - Ensure the form card has a warm tint from the torch glow
  - In styles.css, add:
    ```css
    .pixel-nordic-cave-arch { ... }
    .pixel-nordic-torch-glow { ... }
    ```
    Must NOT do:
  - Do not change the batcave mood's existing darkening/sky adjustments
  - Do not make the cave arch too tall (max 30% viewport)
  - Must remain pointer-events-none so form interaction works
    Parallelization: Wave 1 | Blocked by: — | Blocks: 6
    References:
  - PixelNordicScene.tsx L2837-2874 (batcave mode)
  - entrar.tsx L56-131 (entrar page layout)
  - styles.css L2837-2874 (batcave CSS)
  - gotham-amber color token for torch effect
    Acceptance criteria:
  - Cave arch visible on /entrar, framing the scene
  - Warm torch glow present at bottom-center
  - Form remains interactive
  - Existing batcave darkening preserved
    QA scenarios:
  - `lsp_diagnostics` on PixelNordicScene.tsx, entrar.tsx — 0 errors
  - `bun run build` — exit 0
  - Visual: cave arch frames the scene, warm glow on form
    Commit: Y | feat(landing): add cave arch framing and torch glow to login page

- [ ] 4. Enhanced scroll zoom transitions
     What to do:
  - In PixelNordicScene.tsx:
    - Extend the existing parallax system (L277-318) so that `--nordic-enter` drives more dramatic zoom:
      - Base scene scale: `scale(calc(1 + var(--nordic-enter) * 0.45))` (was 0.22 — doubled)
      - TranslateY: `translateY(calc(var(--nordic-enter) * -8%))` (was -4% — doubled)
    - Add per-section scene state via CSS custom properties:
      - `--nordic-section`: 0-4 mapped via section data attributes on the HTML element
      - Section 0 (hero): default scene
      - Section 1 (companion): aurora intensifies, moon starts veiling
      - Section 2 (flow+atoms): aurora bright, mist rises, snow increases
      - Section 3 (live): scene at max zoom, aurora peak, heavy snow
      - Section 4 (docs): settled scene, mist covers water
    - These can be driven by the existing scroll progress → calculate section index from scroll position
  - In styles.css:
    - Update `.pixel-nordic--parallax .pixel-nordic-scene` transform for new scale/translate
    - Add section-specific CSS using `[data-nordic-section="N"]` selectors
    - Adjust `.pixel-nordic-aurora__band` opacity based on section
    - Increase `.pixel-nordic-snow-canvas` density based on section
  - In MuninnLoginLanding.tsx:
    - Add `data-nordic-section` attribute to the root div based on activeSection state
    - Drive `--nordic-enter` from overall scroll progress (already done in existing code L604-616)
      Must NOT do:
  - Do not break the batcave mood (cave login should not have zoom)
  - Parallax must remain disabled when `reduceMotion` is true
  - Do not remove existing parallax behavior, only enhance it
    Parallelization: Wave 2 | Blocked by: 1 (scene structure in place) | Blocks: 6
    References:
  - PixelNordicScene.tsx L277-318 (existing parallax)
  - PixelNordicScene.tsx L337-366 (aurora, moon)
  - styles.css L2793-2834 (parallax CSS)
  - MuninnLoginLanding.tsx L604-616 (scroll progress tracking)
    Acceptance criteria:
  - Scene zooms into forest as user scrolls through sections
  - Aurora intensifies, mist rises, snow increases per section
  - Respects reduced-motion
  - Batcave mood unaffected
    QA scenarios:
  - `lsp_diagnostics` on PixelNordicScene.tsx — 0 errors
  - `bun run build` — exit 0
  - Visual: dramatic zoom progression through sections
    Commit: Y | feat(landing): enhance scroll zoom transitions with per-section scene states

- [ ] 5. Legibility audit
     What to do:
  - In styles.css, update `.login-pixel` text sizing:
    - `.pixel-display` body text: increase from 12-13px to 13-15px (target elements: `.pixel-display` in MuninnLoginLanding.tsx)
    - Section headings (`.pixel-font` h2 equivalents): increase from 12-13px to 15-17px
    - `.pixel-jules-badge` text: currently 7-8px, increase to 8-9px
    - `.pixel-font` body text: increase minimum from 8px to 9px for readability
  - In MuninnLoginLanding.tsx:
    - Audit all text-containing elements for consistent sizing
    - Increase `text-[12px]` to `text-[13px]` or `text-[14px]` in key sections
    - Increase `text-[8px]` minimum to `text-[9px]` for section labels/chapter rules
    - Ensure consistent line-height (existing leading-relaxed is fine)
    - Add more padding to card elements: `.p-3` → `.p-4` in section cards
  - In SectionChrome: increase lead text size
  - In ChapterRule: increase label size
  - In FlowSteps cards: increase step titles and body text
  - In AtomSections: increase example/tech text
    Must NOT do:
  - Do not change fonts, only sizes
  - Do not modify login form itself
  - Do not change loginLanding.ts copy
    Parallelization: Wave 1 | Blocked by: — | Blocks: 6
    References:
  - styles.css L692-701 (.pixel-font, .pixel-display)
  - MuninnLoginLanding.tsx L54-81 (SectionChrome, ChapterRule)
  - MuninnLoginLanding.tsx L469-553 (FlowSteps)
  - MuninnLoginLanding.tsx L309-466 (AtomSections)
    Acceptance criteria:
  - Body text ≥13px across landing
  - Section headings ≥15px
  - All text elements have comfortable spacing
  - No text overflow or truncation introduced
    QA scenarios:
  - `lsp_diagnostics` on MuninnLoginLanding.tsx — 0 errors
  - `bun run build` — exit 0
  - Visual: text is larger and more readable across all sections
    Commit: Y | fix(landing): increase font sizes and spacing for legibility

- [ ] 6. Final scroll integration and reduced-motion check
     What to do:
  - Ensure all scroll-based features coexist:
    - scroll-snap does not fight with the zoom parallax
    - The nav IntersectionObserver works correctly with snap container
    - Section data-nordic-section attribute updates correctly
  - Test reduced-motion paths:
    - All snap sections still work (snap is CSS, unaffected)
    - Zoom transitions disabled when reduceMotion=true
    - Pixel art scene shows at default state
  - Clean up any console warnings about scroll containers
  - Run `lsp_diagnostics` on all changed files
  - Run `bun run build`
    Must NOT do:
  - No new features in this todo — only integration and verification
    Parallelization: Wave 3 | Blocked by: 1, 2, 3, 4, 5 | Blocks: —
    References:
  - All changed files from todos 1-5
    Acceptance criteria:
  - All todos 1-5 work together without conflicts
  - `bun run build` passes
  - All `lsp_diagnostics` clean
  - Reduced-motion: all animations disabled, layout works
    QA scenarios:
  - `lsp_diagnostics` on all changed files — 0 errors
  - `bun run lint` — exit 0
  - `bun run build` — exit 0
  - Manual: scroll through sections with and without reduced motion
    Commit: N (integration — changes already committed in individual todos)

## Final verification wave

> Runs in parallel after ALL todos. All must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.

- [ ] F1. Plan compliance audit — all 6 todos completed per spec
- [ ] F2. Build verification — `bun run build` exit 0
- [ ] F3. Visual QA — hero shows framed raven + Nordic bg + live demo card, snap sections work, cave login shows cave arch + torch glow, text is larger
- [ ] F4. Scope fidelity — no dashboard/auth changes, no new deps, all content preserved

## Commit strategy

One commit per todo (1-5), no commit for todo 6 (integration). Commits follow conventional commits with `feat(landing):` and `fix(landing):` prefixes.

## Success criteria

1. Landing hero shows framed Muninn raven as centerpiece over full Nordic scene with live demo card overlay
2. 5 vertical snap sections navigate via scroll or nav bar
3. Scene zooms into forest with per-section atmosphere changes as user progresses
4. Login page (/entrar) framed by cave arch with warm torch glow
5. All text is larger and more readable (13-15px body, 15-17px headings)
6. All motion respects prefers-reduced-motion
7. Build passes, no new errors
