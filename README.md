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
