# Quizbase selectable reskin brief

Status: reference set declared complete. Theme name: **Automata** (working name inferred from the sole accepted reference archive). Implementation authorized.

## Scope and authority

Read the supplied “Visual Language Reconstruction — General Project Instruction.md” and local `RESKINNING.md`. The latter governs implementation details. Keep Classic selectable and add one whole-app theme through a top-right Home `Themes` picker. Persist the choice across visits, including direct game links. Do not duplicate routes, engines, or datasets.

## Inspected implementation boundaries

- `index.html` contains Home and game hosts; `js/app.js` owns lazy loading, navigation, history, and eight game routes: Random Letter, Missing Word (General/Pokémon), Hangman (General/Pokémon), Number Play, and Odd One Out (General/Pokémon).
- `css/theme.css` supplies shared semantic `--qb-*` tokens. Preserve its current values as Classic; use scoped theme overrides and stable `data-ui` hooks first.
- Missing Word and Hangman consume inherited tokens inside Shadow DOM. Structural styling must respect that boundary.
- Missing Word, Random Letter, and Odd One Out expose renderer registries; Hangman separates artwork and visual effects. Use those adapters only if the references justify changing the rendering medium. Keep rules and lifecycle ownership in existing engines.
- Number Play retains its shared mode shell and isolated views/rules. Include every available mode in visual validation.
- `js/themes.js` now owns the Classic/Automata registry, early application, persisted `quizbase.theme` selection, safe Classic fallback, and cross-tab updates. The native Home select preserves keyboard and assistive-technology semantics. Host attributes carry structural theme selection into existing Shadow DOM components.

## Visual grammar and assets

Sole accepted source: `Game UI Database - Nier_ Automata.zip`, 89 JPEGs including repeated crops and composite thumbnails. The mistakenly supplied `quizsty-nier-reskin-v6.zip` is excluded; none of its code or designs may be used.

Reviewed all 89 images in contact sheets and enlarged representative menu and controls screens. Core evidence: parchment/olive neutrals, dark charcoal text, square geometry, fine rules, broad negative space, widely spaced sans-serif headings, flat translucent rows, dark inverse selection, and pale inset information panels. Recurring: thin parallel rails, subtle grid texture, restrained technical linework, compact square status markers, and dark panel headers. Dialogs use pale opaque bodies with dark title bands. Gameplay HUDs demonstrate subdued overlays; those are contextual, not a reason to transplant maps or combat UI. Title art, characters, emblems, exact decorative edge patterns, controller legends, and fictional system diagnostics are unsuitable production assets. Thumbnails largely repeat the full screenshots. Static references do not establish animation timing.

Translation: an original parchment-and-charcoal Quizbase interface, framed answer surfaces, flat square controls, inverse primary/selected states, subtle grid background, restrained rules, and a clear game-selection heading. Keep the existing information and interactions; introduce no fictional status content. Use DOM/CSS throughout; the existing artwork renderer remains appropriate.

Production assets: original CSS only, plus the existing Quizbase icons and artwork. No new images or fonts were added. The reference JPEGs remain outside the repository and are not shipped.

## UX constraints and trade-offs

Prioritize shared-screen legibility, strong contrast, primary actions, safe tap targets, and visible answer areas. Decoration must yield on constrained screens. Preserve gameplay, data, Home/history, fullscreen, haptics, picker semantics, keyboard/focus accessibility, reduced motion, and no-scroll gameplay. Preserve clear multi-word answer separation. Explained trade-offs before implementation: enlarge text and controls relative to the source UI; keep green/red correctness feedback and text/symbol cues; lower texture contrast; omit signature ornamental borders and proprietary imagery. Preserve existing functional animation lifecycles and reduced-motion behavior.

## Validation plan and results

After implementation run `npm test` and `npm run test:e2e`, without weakening tests. Verify both themes, persistence, direct links, and all eight routes plus available Number Play modes and important interaction states. Inspect phone portrait, phone landscape, tablet portrait, and desktop for overflow, overlap, safe areas, contrast, readability, and controls.

Playwright now exercises Classic and Automata at desktop, phone portrait, tablet portrait, and phone landscape. New tests cover saved choice, direct routes, history, live Home switching, unknown values, unavailable storage, picker placement, keyboard containment, and topic-footer visibility. An existing substring-based answer assertion now uses the exact accessible choice name, avoiding Tennis/Table Tennis ambiguity without weakening the assertion.

Implementation: `css/themes/automata/` groups theme tokens and shared component treatments; `css/theme-picker.css` reserves Home picker space. `css/compact-landscape.css` corrects short-screen geometry in both skins: side-by-side keyboard or answer information, visible Generate/Next controls, and a bounded topic panel. Classic retains its palette, components, and normal portrait/desktop composition. `js/core/`, `js/games/`, and `data/` are unchanged.

Visual evidence: 132 Automata state screenshots (including 16 deterministic Hangman win/loss checks) and 116 Classic state screenshots at 390×844, 844×390, 800×1280, and 1280×800, covering Home, eight routes, both available Number Play modes, answers, solve states, pickers, and Ideas. Evidence is in local ignored `.visual-qa/`; regenerate with `node scripts/capture-themes.mjs`. Topic lists intentionally scroll within their panels. Contrast checks: main text 8.10:1, primary action 8.63:1, muted text 4.94:1, success 4.97:1, danger 5.26:1.

Automated results: `npm test` passed all 83 tests; `npm run test:e2e -- --workers=2` passed all 448 browser checks (eight theme/viewport projects). The separate win/loss audit verified correct Solve submission, six-miss loss, answer feedback, and visible New Word actions for both Hangman editions at all four sizes. `git diff --check` passed. No regression assertion was weakened.

Deliberate limitations: native theme-picker popup appearance follows the browser/OS; touch/fullscreen checks are browser emulation rather than physical device testing; haptic delivery cannot be judged on this computer. No copied branding, characters, artwork, distinctive ornamental border, or new renderer. Number Machine and Number Gap remain unavailable as specified by the existing mode registry.
