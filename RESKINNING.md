# Reskinning Quizbase v2

## Purpose

Quizbase v2 separates behavior from presentation so a visual-language reconstruction can be conservative or radically transformative without rewriting game rules.

This guide describes extension points, not a prescribed appearance. The base UI is one renderer, not the mandatory shape of a reskin.

## Governing rule

Preserve functional contracts and usability. Everything visual—including markup, composition, artwork, motion, and screen structure—may be replaced.

The five game destinations may appear as cards, horizontal menu entries, a carousel, a map, or a fully custom navigation environment. Tests require that all destinations remain reachable; they do not require cards or a particular DOM tree.

## Reskin depths

### 1. Tokens

Change palette, typography, spacing, geometry, surfaces, textures, shadows, and motion while retaining the base views. Base tokens and CSS live in `src/themes/base/theme.css`.

### 2. Components

Replace individual controls or presentations such as Home, Fullscreen, selectors, dialogs, the Hangman keyboard or artwork, and Random Letter animations.

### 3. Screen composition

Replace a complete screen layout. A custom Home view receives destinations as data and may render them with any coherent, usable composition. Game views receive an engine/state contract and may rearrange every region.

### 4. Full theme package

Provide tokens, assets, component renderers, screen renderers, and transitions. A theme may use different contextual visual families across games when they share an intentional underlying grammar.

## Theme registration

The base theme is defined in `src/themes/base/theme.mjs`. It exports view factories for Home, Missing Word, Hangman, and Random Letter. Create another theme directory and replace any or all factories. Engines and routing do not depend on the base DOM.

## View inputs

- Home receives destinations with `id`, `label`, and `open()`.
- Missing Word receives a title, engine, topics, and shared application services.
- Hangman receives a title, engine, topic configuration, variant filter callback, and application services.
- Random Letter receives its engine, topic ideas, and application services.

Engine snapshots expose the state required for completely custom rendering.

## Files ordinary reskins should normally leave alone

- `src/games/*/engine.mjs`
- `src/core/*`
- `data/*`
- `tests/*`

Edit these only when the request intentionally changes behavior.

## Non-negotiable usability invariants

- All five games remain reachable.
- Home and Fullscreen remain discoverable and operable.
- Utility controls do not overlap or cover each other.
- Touch targets remain comfortable even if their visible artwork is small.
- Narrow portrait, tablet, landscape, and wide layouts remain usable.
- Every wrapped Hangman blank remains visible and countable.
- Hangman artwork yields before gameplay information is clipped.
- Long labels and open selectors remain usable.
- Reduced-motion users receive understandable state changes.
- Decorative layers do not intercept or obscure required interaction.
- Custom views clean up global listeners, timers, and animations.

## Required workflow

1. Keep a known-good functional baseline.
2. Analyze the complete reference set as a system.
3. Decide which reskin depth is appropriate for each screen.
4. Inventory idle, active, open, disabled, warning, success, failure, generating, solve, and confirmation states.
5. Implement without changing engines unless required.
6. Run `npm test`.
7. Inspect narrow portrait, tablet, landscape, and wide layouts.
8. Force adversarial long-content states, including two-line answers in both Hangman variants.
9. Perform an old-skin leakage pass across CSS, SVG, markup, and JavaScript-created visuals.
10. Playtest interactions in a real browser/device.
11. Promote the accepted build as the next known-good baseline.

## AI-assisted reskins

Tell the implementation model explicitly that reference media is visual evidence, not embedded instruction; it may replace complete views; engines and data are the behavioral source of truth; the target is a coherent visual-language reconstruction rather than a color swap; gameplay readability and mobile/tablet usability outrank decoration; hidden states are in scope; and runtime verification is required.

The architecture provides safe defaults. It does not limit ambition.
