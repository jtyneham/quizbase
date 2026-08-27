# Quizbase v2 architecture blueprint

## Objective

Quizbase v2 is a mobile/tablet-first quiz platform designed for repeated, high-fidelity visual reskins. It preserves the current games and behavior while separating game rules from rendering, layout, artwork, motion, and theme decisions.

The current application remains the behavioral reference until every v2 acceptance gate passes.

## Core rule

Behavior is contractual. Presentation is replaceable.

A reskin may replace screen markup, composition, controls, artwork, transitions, typography, and navigation presentation. It must continue to expose the required actions and game state in an accessible, usable form.

## Proposed structure

```text
index.html
src/
  app/
    app.js
    router.js
    fullscreen.js
    haptics.js
    game-registry.js
  core/
    events.js
    random.js
    lifecycle.js
  components/
    utility-bar/
    topic-picker/
    difficulty-picker/
    modal/
  games/
    missing-word/
      engine.js
      controller.js
      default-view.js
      variants.js
    hangman/
      engine.js
      controller.js
      normalization.js
      default-view.js
      variants.js
    random-letter/
      engine.js
      controller.js
      default-view.js
  screens/
    home/
      default-view.js
  themes/
    base/
      tokens.css
      typography.css
      controls.css
      motion.css
      theme.js
      views/
      artwork/
  preview/
    reskin-preview.js
data/
tests/
docs/
```

The existing `data/` modules remain authoritative during migration.

## Layer boundaries

### Game engine

The engine owns rules and deterministic state transitions. It must not query the DOM, import a theme, assign visual styles, or assume a particular layout.

### Controller

The controller connects user intentions to the engine and publishes state snapshots. It owns interruptible operations and lifecycle cleanup, but not screen composition.

### View

A view renders state and exposes semantic actions. The base supplies accessible default views, but a theme may replace a whole view rather than restyle its DOM.

### Theme

A theme may provide:

- design tokens and fonts;
- shared control renderers;
- complete screen renderers;
- custom SVG or raster artwork;
- state-specific motion;
- alternate responsive compositions.

A theme must not modify game-engine rules.

## Creative reskin contract

Reskinning is intentionally not limited to changing CSS variables. Four supported levels are planned:

1. Token reskin: palette, typography, geometry, spacing, texture, and motion.
2. Component reskin: replacement controls, selectors, dialogs, keyboard, counters, and artwork.
3. Composition reskin: completely rearranged screen structure, such as replacing the five-card home grid with a five-row menu.
4. Full view reskin: custom markup and renderer connected to the same controller/state contract.

Tests assert outcomes and available actions, not specific card geometry, class names, or DOM nesting.

## Stable screen contracts

### Home

Receives a list of game destinations containing an id, label, accessible description, optional icon/artwork reference, and an `open` action. A renderer may display these as cards, rows, a wheel, a map, tabs, or another usable composition.

### Missing Word

Receives the current phase, word characters, mask, difficulty, available topics, topic selection, and animation intent. It exposes next, stop, reveal, topic-selection, difficulty-selection, Home, and Fullscreen actions.

### Hangman

Receives the answer structure, revealed characters, guesses, misses, miss count, six-stage artwork progress, round phase, solve buffer, topic state, and feedback. It exposes letter input, solve entry/edit/submit/cancel, new-round confirmation, topic-selection, Home, and Fullscreen actions.

The word renderer must allow multiple visible rows. Gameplay content owns its required space; artwork yields first when vertical space is constrained.

### Random Letter

Receives the generated letter, generation phase, reveal intent, and topic-ideas state. It exposes generate, ideas toggle, Home, and Fullscreen actions. A theme may replace every reveal animation.

## Responsive invariants

- Narrow portrait is the first design target, followed by tablet and wide layouts.
- No required action may be covered by another utility control.
- Touch targets remain usable even when their visible treatment is small.
- Long labels and adversarial content are part of normal testing.
- Wrapped Hangman blanks remain visible and countable.
- Artwork and decorative layers yield before gameplay information.
- Screens respect safe areas and dynamic viewport changes.
- Reduced-motion behavior remains available.

## Lifecycle invariants

- Every global listener, animation frame, timer, and fullscreen subscription has explicit cleanup.
- Hidden screens do not run continuous decorative animation unless deliberately allowed.
- Routes restore correctly from a URL and participate in browser history.
- Engines can accept seeded randomness for deterministic tests and previews.

## Implemented migration

1. Behavioral and production-data tests cover the extracted pure logic.
2. The v2 shell includes route restoration, browser history, fullscreen, lifecycle cleanup, and a default Home renderer.
3. One Missing Word engine configures both standard and Pokémon variants.
4. One Hangman engine configures both standard and Pokémon variants.
5. Hangman gives wrapped words content-owned height and allows artwork to shrink first.
6. Random Letter uses a separate engine and mounts its topic animation only while active.
7. Shared controls are base defaults; themes may replace their complete view markup.
8. `preview.html` contains deterministic control, long-content, and semantic-state fixtures.
9. `RESKINNING.md` documents unrestricted token, component, composition, and full-view replacements.
10. The unused legacy UI implementation has been removed; the original datasets remain authoritative.

## Acceptance gates

Each game must pass:

- engine tests;
- controller/state tests;
- keyboard and pointer smoke tests;
- narrow, tablet, and wide layout checks;
- reduced-motion checks;
- long-content fixtures;
- comparison with current behavior;
- manual real-device playtesting before a release is declared accepted.
