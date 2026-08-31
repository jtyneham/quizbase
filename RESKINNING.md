# Quizbase Reskinning Guide

Quizbase is a functional base for visual-language reconstruction. A reskin may radically change composition and presentation while preserving the games' behavior contracts.

## Source-of-truth rule

- `data/` is content/data source of truth.
- `js/core/*-data-curator.js` owns player-facing data corrections without
  mutating the reusable raw files.
- `js/core/` owns shared game behavior.
- `js/games/` should stay thin configuration wrappers.
- `css/theme.css` is the first-stop visual contract.
- `data-ui` attributes are stable semantic presentation hooks.

A reskin is not required to keep the default vertical launcher, current component geometry, or current arrangement of controls. Preserve what an element *does*, not where the default skin happens to put it. The launcher may become cards, a list, a diegetic menu, a radial selector, or an entirely custom scene.

## Content and curation boundaries

Raw pools in `data/` are intentionally preserved as broad reusable source
material. Player-facing cleanup happens at runtime:

- `js/core/missing-word-data-curator.js` removes unreachable answers and
  topic-specific fragments, then applies the explicit General vocabulary;
- `js/core/general-word-pool.js` defines the deliberate, broadly accessible
  default vocabulary shared by Missing Word General and Hangman General;
- `js/core/hangman-data-curator.js` removes duplicate/context-free Hangman
  answers and exposes a reliable primary category.

For a reskin, create a small, documented curator/configuration layer when its
content rules differ. Do not rewrite the raw pool merely to make a themed
variant work. A dedicated game data file is preferable when a theme needs
different factual content rather than a correction to the base pool.

### Dedicated topic modules

`data/business-money-words.js`, `data/comics-words.js`, and
`data/manga-anime-words.js` are reference patterns for topics added after the
original pools: each is a single curated source, with a 100-word easy/medium
core used by both standard games and a 20-word Missing Word-only Hard layer.
Their integration helpers rehome matching legacy entries so an answer has one
player-facing specialist topic. They deliberately never become part of either
game's **General** default.

The editorial boundaries are explicit: **Comics** means comic-origin stories,
characters, creators, and publishers—not generic format labels or Japanese
manga/anime. **Manga & Anime** means Japanese-origin series, characters,
distinctive demographics/genres, and lingo—not generic cross-media genres,
western comics, or gaming-first properties.

Use the same pattern for future subjects whose content needs independent
editorial rules: keep the vocabulary, difficulty decisions, game-specific
subset, and integration/rehome logic together in one named data module.

## Recommended workflow

1. Inspect the current product and understand all six game flows before styling.
2. Accumulate the complete reference set before implementation.
3. Reverse-engineer the reference system: core rules, recurring patterns, contextual treatments, decorative motifs, redundant evidence, and unsuitable transplants.
4. Override semantic tokens first.
5. Use semantic `data-ui` hooks for structural treatments that tokens cannot express.
6. Change component markup only when the new visual language genuinely requires a different composition.
7. Keep game logic and datasets unchanged unless a functional change is explicitly requested.
8. Validate every affected state on phone portrait, phone landscape, tablet portrait, and desktop.
9. Run `npm test` after changes.

For visual work, also run `npm run test:e2e`. The browser gate covers direct
links, topic overlays, Missing Word generation/reveal, Hangman solve mode, the
keyboard, Random Letter Ideas, Odd One Out answer feedback, fullscreen
controls, and viewport overflow.

## Theme tokens and Shadow DOM

`css/theme.css` defines the public `--qb-*` theme variables on `:root`. CSS custom properties inherit through Shadow DOM hosts, so Missing Word and Hangman components can consume the same global theme without piercing their Shadow DOM.

This is intentional: do not copy a complete reskin stylesheet independently into every Shadow DOM.

Tokens are semantic rather than screen-specific. Main groups are:

- typography: `--qb-font-*`;
- surfaces: `--qb-color-page`, `--qb-color-surface`, `--qb-color-surface-subtle`, overlay;
- text/lines: `--qb-color-text*`, `--qb-color-line*`;
- accent/state: accent, reveal, success, danger, generating, focus;
- geometry: card/control/pill radii and utility-control size;
- effects: card/control/game shadows;
- motion: durations/easing;
- component contracts: picker, keyboard, ticker, and Hangman artwork tokens.

A source-game reskin can replace these values centrally, for example:

```css
:root {
  --qb-color-page: #101214;
  --qb-color-surface: rgba(20, 24, 30, .82);
  --qb-color-text: #f4f0e8;
  --qb-color-accent: #d4473f;
  --qb-radius-card: 0;
  --qb-shadow-card: none;
}
```

Do not turn every numeric CSS value into a token. Tokens should represent decisions a visual-language reconstruction is likely to change across multiple components. Local layout math can remain local.

## Semantic hooks

Important presentation roles carry `data-ui` attributes. These are preferred reskin hooks because class names can still describe implementation details.

Common roles include:

- `app-shell`
- `home-screen`
- `game-launcher`
- `game-launch`
- `game-launch-surface`
- `game-launch-label`
- `game-root`
- `game-toolbar`
- `utility-actions`
- `home-action`
- `fullscreen-action`
- `primary-action`
- `secondary-action`
- `difficulty-control`
- `topic-picker`
- `topic-picker-trigger`
- `overlay`
- `overlay-panel`
- `game-primary-surface`
- `answer-display`
- `status-counter`
- `status-detail`
- `solve-panel`
- `game-keyboard`
- `game-artwork`
- `supporting-panel`

Inside Shadow DOM, reskin rules that need structural changes belong in the component stylesheet or a stylesheet imported by it. Global selectors cannot cross the Shadow boundary; inherited `--qb-*` tokens can.

## What is safe to change

Visual work may change, when appropriate:

- launcher composition;
- backgrounds and layering;
- typography;
- spacing and alignment;
- component geometry;
- borders, shadows, transparency, textures and gradients;
- button/picker/dialog presentation;
- icons and decorative motifs;
- Hangman artwork presentation;
- animation timing/presentation when the interaction contract remains intact;
- responsive composition.

A reskin may use cards, lists, terminals, diegetic panels, abstract navigation, or another composition entirely. Do not preserve the default layout merely because it exists.

## Behavior contracts to preserve

Unless the product explicitly changes, preserve:

### App
- all six routes and Home navigation, including direct hash links and browser Back/Forward;
- fullscreen enter/exit and icon state;
- haptics where supported;
- no accidental page scrolling.

### Missing Word siblings
- topic selection and all/none semantics;
- difficulty behavior;
- masking and word selection;
- reel/slot generation animation;
- ability to accelerate/stop generation where supported;
- reveal behavior and round lifecycle.

### Hangman siblings
- six-miss round lifecycle;
- correct/wrong/repeated guesses;
- keyboard state and reset;
- Solve Word, Cancel, caret/input behavior;
- New Word and confirmation behavior;
- win/loss presentation state;
- topic filtering;
- visible multiline answer slots;
- gallows progression.

Hangman topic selection is shared through
`js/core/hangman-topic-picker.js`. Keep its selection, General-mode, Apply,
Cancel, and outside-dismiss contracts when changing the picker presentation.

The standard Hangman game exposes the curated default as **General**; this is
not an unbounded random selection. Pokémon Hangman has no General default and
uses its dedicated Pokémon topic collection.

Hangman artwork state is isolated in `js/core/hangman-artwork.js`. The default
renderer is a small PixiJS scene mounted in `#hangmanPixiStage`; it receives
only `reset()` and `render(missCount)` calls from the game engine. A reskin may
replace that adapter with SVG, Canvas, Rive, or another Pixi scene, provided it
keeps those two methods. The rules engine does not depend on drawing
coordinates, element IDs, or a stickman design.

Hangman interface feedback is separately isolated in
`js/core/hangman-visual-effects.js`. Its default DOM/CSS adapter handles key
presses, key popups, correct/wrong guess feedback, and win/loss presentation.
A creative reskin may replace that adapter while preserving the engine's
gameplay events. The Pixi artwork honours `prefers-reduced-motion`: normal
players retain sketching limbs, while reduced-motion users see each state
immediately.

## Routing contract

`js/app.js` owns route resolution.  Keep game screens addressable by their
canonical hashes when changing the launcher or app shell:

- `#rngl`
- `#missingword`
- `#missingwordpokemon`
- `#hangman`
- `#hangmanpokemon`
- `#odd-one-out`

Older human-readable hashes remain accepted as aliases.  A visual reskin may
replace launcher markup, but launch controls must call the app navigation API
or provide the matching `data-file` value so direct links, Home, and browser
history continue to work.

## Missing Word UI boundaries

The two Missing Word variants deliberately share presentation structure as
well as gameplay behavior:

- `js/core/missing-word-template.js` — static Shadow DOM markup and stable
  `data-ui` hooks;
- `js/core/missing-word-topic-picker.js` — topic picker interaction and
  selection state;
- `js/core/missing-word-visual-renderer.js` — renderer registry and the
  swappable visual-renderer contract;
- `js/core/missing-word-dom-renderer.js` — default accessible DOM slot layout,
  reel generation, static fallback rendering, and reveal animation;
- `js/core/missing-word-engine.js` — round state, word choice, masking, and
  event wiring.

Changing the template for a creative layout is supported. Preserve the element
IDs/data hooks consumed by the engine, or update the engine and its regression
tests in the same change.

The default DOM renderer is selected with `visualRenderer: "dom"`. A reskin
that needs canvas effects can register a separate renderer (for example a Pixi
module) with `registerMissingWordVisualRenderer(name, factory)`, then pass its
name as `visualRenderer`. It must implement `renderRound`, `playGeneration`,
`settleGeneration`, `reveal`, and `destroy`; it must never own word selection,
masking, or button/round state.

### Random Letter

Random Letter separates its rules/lifecycle (`js/core/random-letter-engine.js`)
from its reveal medium. The default four effects are in
`js/core/random-letter-reveal-renderer.js`; a themed Pixi implementation can
register through `registerRandomLetterVisualRenderer(name, factory)` in
`js/core/random-letter-visual-renderer.js`. A renderer implements
`play({ finalLetter })`, `reset()`, and `destroy()` and must not choose the
letter or control button state. The Ideas ticker has `start`, `stop`, and
`destroy` lifecycle methods and remains paused while hidden.

- random generation behavior and animation modes;
- Ideas toggle and ticker behavior;
- generation interruption/acceleration behavior where present.

### Odd One Out

Odd One Out is a shared-screen General Knowledge game. It intentionally has
no topic picker, timer, score, player setup, or automated turn system. A
session begins with **Generate Set**; after an answer, **Next Set** generates
another reviewed four-choice round. Tapping a choice resolves immediately:
the true intruder turns green, a wrong tap turns red, and the short
relationship explanation appears below. Correct and wrong answers use distinct
haptic patterns where the device supports vibration.

`data/odd-one-out-knowledge.js` contains relationship blueprints, not a loose
word list. Each blueprint supplies a family, matching pool, reviewed near-miss
pool, explanation template, and either Medium (`2`) or Hard (`3`) difficulty.
`ODD_ONE_OUT_FAMILY_TARGETS` is the content-expansion plan: keep the pool in
broad General Knowledge families, meet the documented Medium/Hard targets, and
do not add niche fandom material simply to raise difficulty. `js/core/odd-one-out-logic.js`
selects three matches plus one near-miss, shuffles choices, applies the Mixed
weighting, and avoids both recent relationships and recent families whenever
the eligible pool permits it. A reskin can replace visuals and feedback
animation, but must preserve those round, answer, and next-set contracts.

`tests/core/odd-one-out-long-session.test.js` generates 800 real rounds in
each difficulty setting. It is the permanent regression gate for the current
relationship, family, and visible-label cooldowns: do not weaken it merely to
make an undersized future content pool pass.

Odd One Out uses the same presentation boundary as the other games:

- `js/core/odd-one-out-engine.js` owns the round lifecycle, 65/35 Mixed
  difficulty weighting, twelve-recent-blueprint cooldown, nine-recent-family
  cooldown, three-recent-visible-set label cooldown, correctness, and haptics;
- `js/core/odd-one-out-logic.js` is the pure, testable round generator;
- `js/core/odd-one-out-visual-renderer.js` is the renderer registry;
- `js/core/odd-one-out-dom-renderer.js` is the default DOM/CSS card,
  explanation, and set-transition renderer;
- `css/odd-one-out.css` is only the default visual language and responsive
  play-field composition.

The default renderer receives a reviewed round and an answer callback, then
draws choices and feedback. It does not select words, decide correctness,
manage cooldowns, or trigger haptics. A reskin can register a themed renderer
with `registerOddOneOutVisualRenderer(name, factory)` and select it through
`initOddOneOut(root, app, { visualRenderer: name })`. Its renderer implements
`bindPrimaryAction`, `setPrimaryAction`, `renderRound`, `resolveRound`,
`playRoundExit`, `playRoundEnter`, and `destroy`. This is the intended route
for a fully canvas, PixiJS, SVG, Rive, or otherwise non-card-based treatment;
do not fork the gameplay engine simply to change the visual medium.

### Number Play

Number Play is a small multi-game shell rather than a single game. It starts
without a selected mode: the central launcher and the persistent top-bar mode
picker both render from `data/number-play-modes.js`. Keep that registry as the
single source of truth for the visible mode name, short rule description, and
availability state. A future mode should be added there, then implemented as a
small pure logic module plus an isolated view in `js/games/number-play.js`; do
not create a second route or duplicate the shared Home/fullscreen/picker code.

The first mode, Target Pair, separates its procedural round rules from its
presentation. `js/core/target-pair-logic.js` creates and validates one unique
four-number pair for the shown target and avoids recent visible quartets.
`js/games/number-play.js` owns selection, answer feedback, haptics, and the
mode shell, while `css/number-play.css` contains the default mobile/tablet
visual language. A reskin may replace the target card, number tiles, picker,
launcher, and feedback treatment freely, but must retain the launch state,
mode-switch contract, two-number answer selection, and Generate/Next action.
If a future Number Play mode needs a canvas/Pixi treatment, extract only that
mode's view into a renderer adapter; keep the mode rules and round state pure.

## Topic picker contract

Topic pickers must support their existing apply/cancel/clear/all behavior and dismiss naturally by outside click/tap where implemented. The opener control must be excluded from outside-dismiss handling so opening a picker does not immediately close it.

A reskin can radically alter picker presentation, but should preserve those interaction semantics.

## Responsive contract

Mobile-first means independent validation, not merely relative CSS units.

Validate at least:

- phone portrait;
- phone landscape;
- tablet portrait;
- desktop.

Protect large tap targets, safe areas, readable text, visible answer blanks, non-overlapping utility controls, and no-scroll gameplay. When space is constrained, decorative/artwork regions should generally yield before essential game information or controls.

## Accessibility contract

Preserve accessible names and interaction semantics when replacing visual controls. Icon-only Home and Fullscreen controls still require their accessible labels. Maintain keyboard/focus behavior where it already exists. Do not remove focus indication without replacing it with an equally clear treatment.

## Reference-driven visual reconstruction

Do not mechanically map every reference screenshot to a component. Extract the visual grammar first. A reference may reveal a useful palette, hierarchy, geometry, texture, transition, or motif without requiring a literal counterpart in Quizbase.

For each candidate reference element, consider distinctiveness, recurrence, system relevance, recognition value, applicability, coherence, redundancy, context dependence, usability, and artificiality.

The objective is maximum authenticity with good design judgment, not maximum reference density.

## Regression checklist

After meaningful reskin work:

- run `npm test`;
- launch all six routes;
- Home out of every game;
- enter and exit fullscreen;
- open/apply/cancel/outside-dismiss topic pickers;
- exercise Missing Word topic/difficulty/generate/reveal flows;
- exercise Hangman guesses, misses, win, loss, Solve Word, Cancel, New Word and keyboard reset;
- test short, long, multiword and punctuation Hangman answers;
- exercise Random Letter generation and Ideas/ticker behavior;
- generate and resolve correct/wrong Odd One Out rounds, then request a next set;
- inspect phone portrait, phone landscape, tablet portrait and desktop;
- check that no old visual-language fragments remain accidentally after the reskin.

## Architecture guardrail

Do not fork shared engines to make a visual variant. Missing Word siblings share one engine; Hangman siblings share one engine. Keep game-specific data/configuration and visual entry points configurable around those engines.

If a reskin seems to require gameplay-engine duplication, first look for a semantic hook, theme token, configuration option, or component-level presentation extension instead.

## Automated browser regression gate

A reskin is not complete just because it looks correct. Run the real-browser regression suite after meaningful visual or structural work:

```bash
npm test
npm run test:e2e
```

`npm run test:e2e` uses Playwright to exercise the actual app at desktop, phone-portrait, and tablet-portrait sizes. It protects the behaviors most likely to be broken by aggressive visual reconstruction: launcher routing, Home, fullscreen controls, topic pickers, Missing Word generation/difficulty, Hangman keyboard/Solve/New Word, Random Letter generation, Odd One Out generation/answer feedback, and page-level no-scroll behavior.

Semantic `data-ui` hooks are deliberately used by the browser suite where possible. Preserve those hooks even when a reskin completely changes layout or appearance. Do not make tests depend on decorative class names merely to satisfy a theme.

If a reskin intentionally changes a behavior contract, update the corresponding test deliberately. Do not weaken or delete a failing regression test simply because a new layout made the old selector inconvenient.

For first-time Playwright setup after cloning:

```bash
npm install
npx playwright install chromium
```

Failed Playwright runs retain traces/screenshots so layout and interaction regressions can be inspected rather than guessed at.
