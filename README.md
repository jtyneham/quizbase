# Quizbase

Quizbase is the reusable functional base for five browser quiz games: Missing Word, Missing Word Pokémon, Hangman, Hangman Pokémon, and Random Letter. It is a static GitHub Pages app with modular game code and data.

## Development

Requirements: Node.js 20 or newer.

```bash
npm run dev
```

The preview server starts at `http://localhost:8000` by default. Set `PORT` to use another port.

## Tests

```bash
npm test
```

The test suite uses Node's built-in test runner and has no third-party dependencies. Current coverage protects shared Missing Word utilities and selection/masking logic, Pokémon topic order, device/fullscreen behavior, outside-dismiss behavior, the five-screen app shell, shared utility assets, Home navigation hooks, and the Hangman multiline layout contract.

## Project direction

Quizbase is refactored gradually. Preserve established gameplay while extracting shared logic in small, tested units. The current presentation is not a reskinning contract: future themes may replace the home layout and visual composition completely while keeping behavior contracts and semantic hooks stable. Missing Word and Missing Word Pokémon now share one configurable engine (`js/core/missing-word-engine.js`) while their datasets, topic configuration, routes, and styles remain separate wrappers.

## Shared Hangman architecture

Hangman and Hangman Pokémon now share `js/core/hangman-engine.js` for the Shadow DOM template, round lifecycle, guessing, solve mode, custom keyboard behavior, New Word flow, topic-picker lifecycle, drawing state, Home/fullscreen controls, and interaction feedback. Pure answer/guess normalization and solved-state helpers live in `js/core/hangman-logic.js` and are covered by Node tests.

The game modules in `js/games/` are thin configuration/data wrappers. General Hangman keeps its Random mode and category dataset; Hangman Pokémon keeps its Pokémon topic order/filtering and accented-name normalization. Shared Hangman visuals live in `css/hangman-shared.css`, with the two game stylesheets acting as theme entry points so future reskins can diverge them without forking gameplay logic.

## Reskin architecture

Quizbase now exposes a semantic visual contract for future reskins:

- `css/theme.css` contains inherited `--qb-*` design tokens for global surfaces, typography, state colors, geometry, effects, motion, pickers, keyboards, ticker treatment, and Hangman artwork.
- Major presentation roles expose stable `data-ui` attributes such as `game-root`, `game-toolbar`, `home-action`, `primary-action`, `topic-picker`, `overlay-panel`, and `game-keyboard`.
- The custom-element games continue to use Shadow DOM. Theme variables inherit through the hosts, while structural Shadow-DOM changes remain in component styles.
- `RESKINNING.md` documents the supported extension points, behavior contracts, responsive/accessibility requirements, and regression checklist.

The default theme intentionally preserves Quizbase's existing appearance. A reskin should normally override semantic tokens first and use semantic hooks only where a new visual language requires structural treatment.

## Browser regression tests

Quizbase also has Playwright end-to-end coverage that drives the real app in Chromium.

First-time setup after cloning:

```bash
npm install
npx playwright install chromium
```

Run the browser suite across desktop, phone portrait, and tablet portrait:

```bash
npm run test:e2e
```

For a quicker desktop-only pass:

```bash
npm run test:e2e:desktop
```

Run the fast Node tests followed by the browser suite:

```bash
npm run test:all
```

The browser suite covers all five launcher routes and Home navigation, Missing Word generation/difficulty/topic-picker flows, Hangman keyboard/Solve/New Word/topic-picker flows, repeated Random Letter generation, fullscreen controls, and viewport overflow checks. Playwright traces and screenshots are retained for failed runs under ignored test-output folders.
