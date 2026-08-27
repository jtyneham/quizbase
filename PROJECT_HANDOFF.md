# Quizbase — Project Handoff

## Mission

Quizbase is a five-game web app used as a reusable base for highly creative game-themed reskins. The five games are Missing Word, Missing Word Pokémon, Hangman, Hangman Pokémon, and Random Letter.

The project must become easier to modify, test, and reskin without sacrificing established gameplay. The intended strategy is a **gradual refactor** of the restored original application, not an untested full rewrite.

Future reskins are deliberately not constrained to the current five-card home or to any fixed layout. A reskin can use cards, a text list, an abstract screen, a terminal, or a completely different navigation composition. Preserve behavior contracts and semantic hooks, not a particular presentation.

## Repository map

- `index.html` — home screen and Random Letter markup.
- `js/app.js` — routes, screen switching, lazy loading, shared app API.
- `js/games/rngl.js` — Random Letter logic and animations.
- `js/games/missing-word.js` — Missing Word custom element.
- `js/games/missing-word-pokemon.js` — Pokémon Missing Word custom element.
- `js/games/hangman.js` — Hangman custom element.
- `js/games/hangman-pokemon.js` — Pokémon Hangman custom element.
- `css/` — game-specific stylesheets.
- `data/` — word and topic data. Treat this as source of truth.
- `assets/` — shared SVG control assets.
- `tests/` — early pure-logic test coverage.

The four games other than Random Letter use Shadow DOM. Global CSS cannot style internal controls in those games. A shared visual system therefore needs either a component stylesheet loaded within each Shadow DOM, CSS variables/tokens inherited into components, or an intentional style-injection approach.

Routes are `#random-letter`, `#missing-word`, `#missing-word-pokemon`, `#hangman`, and `#hangman-pokemon`.

## Work completed

### Shared device and fullscreen behavior

`js/core/device.js` centralizes haptics and fullscreen support, including WebKit fallback and fullscreen state subscriptions. `js/app.js` now exposes this functionality via the shared app API.

`js/core/ui.js` provides:

- `bindFullscreenButton(...)` for fullscreen interaction, accessible label/title, enter/exit icon updates, and listener cleanup.
- `bindOutsideDismiss(...)` for popup dismissal with an ignored opener control.

All five games use the fullscreen binding.

### Shared Missing Word utilities

`js/core/missing-word-utils.js` shares pure helpers between the two Missing Word games:

- random integer choice;
- random item choice;
- letter counting;
- word counting.

This is intentionally only a first extraction. Mask creation, word selection, topic handling, rounds, reveal behavior, and animation still have substantial duplication. Continue in small, tested units.

### Shared Pokémon topics

`js/core/pokemon-topics.js` defines the one required order used by both Pokémon games:

1. Pokémon All Names
2. Gen 1–9
3. Final Evolutions
4. Moves + Abilities
5. Moves
6. Abilities
7. Types

### Initial tests

- `tests/core/missing-word-utils.test.js`
- `tests/core/pokemon-topics.test.js`

They use Node's built-in test runner. The local shell previously lacked Node on PATH. Add a minimal `package.json`, an explicit test script, and a reliable preview command before depending on these tests in a normal development workflow.

### Shared utility controls

Supplied assets were added:

- `assets/home.svg`
- `assets/fullscreen.svg`
- `assets/fullscreen-exit.svg`

The intended standard is now:

- icon-only Home, accessible name `Back to Home`;
- icon-only Fullscreen, immediately to the right of Home;
- visible size of 44px / `2.75rem` at the mobile preview size;
- fullscreen enters/exits using the supplied paired icons;
- no visible “Fullscreen” label;
- screen-specific selectors (Difficulty/Ideas) remain on the opposite side.

The non-Hangman screens use an explicit `.utility-actions` wrapper for the Home/Fullscreen group. This replaced the older centered/fullscreen positioning approach. Do not solve future layout problems by appending a stronger override on top of conflicting older rules; change/remove the obsolete owner rule and test the screen.

### Browser validation already performed

The in-app browser was used to inspect Missing Word, Missing Word Pokémon, and Random Letter after the utility control cleanup. The control group appeared at top-left with adjacent icon-only controls, and Pokémon Missing Word switched to the supplied exit icon when fullscreen state was triggered.

## Previous bugs and lessons learned

### Keep gameplay intact while changing visuals

Visual work can break functional flow. Test topic selection, random/all/none states, difficulty, word masking, reveal, animation cancellation, Home, fullscreen, Hangman keyboard, solve mode, win/loss, and screen navigation after relevant changes.

### Shared engines should replace duplicated game logic

The Missing Word siblings should eventually share one configurable engine. The Hangman siblings should do the same. Keep data, topic order, visual styling, and optional presentation effects configurable—not forked source files.

### Known Hangman multiline defect

Long/multi-word Hangman answers can wrap while the second line of blanks is hidden. Current layout constraints use `overflow: hidden` around the game card, word zone, and slots. Required behavior:

- slots wrap to multiple lines visibly;
- the word area reserves at least two lines;
- gallows/artwork yields space before word blanks do;
- test short, long, multiword, and punctuation answers on phone portrait, landscape, tablet, and desktop.

### Mobile first is independent validation

Relative values alone do not guarantee a responsive app. Use flex/grid/clamp/minmax/safe-area support when useful and validate separately on phone portrait, phone landscape, tablet portrait, and desktop. Do not let fullscreen logos, topic pickers, difficulty controls, or navigation overlap.

### Topic pickers must dismiss naturally

Pickers should close via outside click/tap in addition to Done/Cancel/X. A previous implementation caused Hangman pickers to open then immediately close because the opener button was treated as an outside click; this was fixed by excluding the trigger. Re-test open, apply, cancel, outside close, and reopen after any picker changes.

### Animations are product behavior

Missing Word's reel/slot behavior and Random Letter's multiple random generation animations are intentional. Preserve the ability to accelerate/stop generation if present. Do not replace these with a static update during refactoring unless the product explicitly changes.

### Reskinning must remain free

The eventual `RESKINNING.md` should document behavior contracts, data/configuration boundaries, semantic hooks, accessibility, responsive requirements, and test checklists. It must not say a reskin has to use five cards, a centered picker, a particular grid, or any fixed page layout.

## Recommended continuation order

1. Add `package.json`, a dependable local preview script, and `npm test`.
2. Add smoke tests for all five routes, Home, fullscreen enter/exit state, and topic picker behavior.
3. Extract Missing Word pure selection/masking logic with tests, then shared round state, then DOM rendering contracts.
4. Fix multiline Hangman blanks before or during a shared Hangman engine refactor.
5. Extract shared Hangman guessing, solve mode, keyboard, round state, and topic behavior.
6. Establish semantic theme tokens and a Shadow-DOM-compatible shared styling strategy.
7. Write `RESKINNING.md` once the extension points are stable.

## Current stopping point

The repository remains mostly the restored original app plus targeted shared extractions. The latest completed work is the shared icon-only Home/Fullscreen control treatment, with live browser inspection. The gradual refactor is not complete.

Before continuing, inspect `git status`, start the preview, visit all five routes, and test the current behavior rather than assuming an inherited change works in every game.

## Continuation update — development foundation and Hangman multiline fix

The recommended foundation batch has now been completed:

- Added a minimal `package.json` with `npm run dev` and `npm test`; no framework, bundler, or runtime dependency was introduced.
- Added `scripts/serve.js`, a dependency-free static preview server for the GitHub Pages-style app.
- Expanded Node test coverage for shared fullscreen/haptic behavior, outside-dismiss behavior, all five app screens/routes, Home hooks, shared utility assets, and the Hangman multiline layout contract.
- Fixed the known multiline Hangman defect in both Hangman variants. The answer area now reserves at least two visible slot rows, wrapped slots are not clipped, and portrait/keyboard-open layouts give answer blanks priority by reducing the gallows allocation before shrinking the word area.
- Updated `README.md` with the development and test workflow.

The next major phase should still be the Missing Word shared-engine refactor. Keep it incremental: extract pure selection/masking behavior with tests first, then round state, then DOM/rendering contracts. Do not begin the Hangman engine merge until the Missing Word extraction pattern is proven and the multiline behavior remains protected by tests.


## Continuation update — shared Missing Word engine

The Missing Word sibling refactor has now reached its first stable shared-engine milestone:

- `js/core/missing-word-engine.js` now owns the common Missing Word UI/controller, round flow, reel/reveal animation lifecycle, difficulty behavior, topic-picker wiring, Home/fullscreen behavior, and Shadow DOM setup.
- `js/games/missing-word.js` and `js/games/missing-word-pokemon.js` are now thin configuration/data wrappers instead of duplicated ~30k-line-equivalent controllers. Their separate CSS files and datasets remain independent.
- General Missing Word preserves its default `General` topic and legacy empty-selection-means-all behavior. Pokémon Missing Word preserves its distinct `None` versus explicit `All` topic state and shared Pokémon topic order.
- `js/core/missing-word-logic.js` extracts testable pure selection/masking helpers: pool filtering, difficulty eligibility, weighted selection, blank-count calculation, word grouping, blank-run measurement, and visible-letter validation.
- Tests were expanded to protect topic/difficulty/recent-word filtering, all-topic behavior, weighted selection boundaries, multi-word mask grouping, blank-run constraints, and wrapper-to-engine registration.
- The full Node suite passes after the refactor.

### Next recommended phase

Do not immediately rewrite the Hangman siblings. First perform a real browser/device regression pass on both Missing Word variants, especially generation interruption, reveal, topic Apply/Clear/All semantics, difficulty changes, Home, fullscreen, and multi-word animation. Once that shared-engine pattern is visually validated, use the same gradual approach for Hangman: extract pure guessing/round logic with tests first, then keyboard/solve/topic behavior, and only then consolidate DOM/controller code.

## Continuation update — shared Hangman engine

The Hangman sibling refactor has reached the same shared-engine milestone as Missing Word:

- `js/core/hangman-engine.js` now owns the common Hangman Shadow DOM template and controller: round lifecycle, guesses/misses, six-stage drawing state, win/loss, New Word confirmation/reset, Solve Now/Cancel, custom keyboard behavior including backspace hold, topic-picker lifecycle, Home/fullscreen wiring, and interaction feedback.
- `js/core/hangman-logic.js` contains pure/testable answer normalization, unique-letter extraction, correct-guess/solved checks, solve-attempt normalization, and non-repeating selection.
- `js/games/hangman.js` is now a thin general-game configuration wrapper. It preserves the existing category list and special Random pool behavior.
- `js/games/hangman-pokemon.js` is now a thin Pokémon configuration wrapper. It preserves `POKEMON_TOPICS`, the default `Pokemon All Names` selection, topic intersection filtering, and accent-normalized guessing/solving for names such as Flabébé.
- The duplicated Hangman styles were consolidated into `css/hangman-shared.css`. `css/hangman.css` and `css/hangman-pokemon.css` remain separate theme entry points that import the shared baseline, allowing future reskins to override either variant without forking the functional engine.
- The multiline answer-area fix is now tested against the shared stylesheet rather than duplicated CSS files.
- The Node suite now includes pure Hangman regression coverage for accented letters, punctuation/multi-word answers, correct/incorrect guess semantics, solved state, solve normalization, and immediate-repeat avoidance. The full suite passes.

### Next recommended phase

The major sibling-engine duplication is now removed: both Missing Word variants share one engine and both Hangman variants share one engine. The next large phase should establish semantic theme tokens and a deliberate Shadow-DOM-compatible styling contract, then document those stable extension points in `RESKINNING.md`. Before visual architecture work, perform real-device/browser playtests of both Hangman variants, especially New Word, six-miss loss, Solve Now/Cancel, backspace hold, topic Apply/Clear/All, Pokémon accented names, Home/fullscreen, and long/multi-line answers.

## Latest work — semantic reskin architecture

Quizbase now has a dedicated visual extension layer rather than requiring future reskins to hunt through unrelated hard-coded styles.

- `css/theme.css` defines inherited `--qb-*` semantic tokens for typography, surfaces, text/lines, accent/state, geometry, effects, motion, pickers, Hangman keyboard, Random Letter ticker, and Hangman artwork.
- Existing component variables now resolve to these semantic tokens where they represent reusable visual decisions. This preserves the current default appearance while giving future skins a central override surface.
- CSS custom properties are intentionally used as the cross-Shadow-DOM theming mechanism. Global selectors still cannot pierce the four custom-element Shadow DOMs.
- Major presentation roles now expose stable `data-ui` hooks across the launcher, Random Letter, shared Missing Word engine, and shared Hangman engine. These hooks describe semantic roles rather than current layout positions.
- Added `RESKINNING.md` as the extension contract. It explicitly permits radical launcher/screen recomposition while protecting gameplay, data, accessibility, responsive behavior, animations, and interaction contracts.
- Added `tests/smoke/theme-contract.test.js` to protect stylesheet load order, core token availability, Shadow-DOM token consumption, and semantic hooks.
- Test suite now has 29 passing tests.

### Reskin architecture lesson

Do not make future skins by forking shared engines or by appending increasingly strong CSS overrides. Prefer, in order: semantic token overrides, semantic `data-ui` hooks, component-level presentation styles, and only then intentional markup changes when the target visual language genuinely requires a different composition. Keep behavior engines and visual reconstruction separate.

### Recommended continuation

The major shared-engine and reskin-extension foundations are now in place. Before further architectural refactoring, do a real-device regression pass of all five games. After that, the next useful engineering batch is to expand browser-level smoke coverage around actual interaction flows (route switching, Home, fullscreen state, pickers, round starts/resets) and then address any remaining hard-coded visual fragments discovered during the first real reskin rather than tokenizing values speculatively.
