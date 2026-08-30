import { createOddOneOutDomRenderer } from "./odd-one-out-dom-renderer.js";

/**
 * Public visual boundary for Odd One Out.
 *
 * The game engine owns round selection, difficulty, cooldowns, answer
 * correctness, and haptics. A renderer owns only the presentation of supplied
 * choices and feedback. This lets a reskin replace the default DOM/CSS cards
 * with SVG, PixiJS, Canvas, Rive, or a radically different DOM layout without
 * duplicating the reviewed game rules.
 *
 * Required renderer methods:
 * - bindPrimaryAction(onGenerate)
 * - setPrimaryAction({ label, disabled })
 * - renderRound({ round, onChoose })
 * - resolveRound({ choice, oddChoice, explanation, correct })
 * - playRoundExit() -> Promise<void>
 * - playRoundEnter() -> Promise<void>
 * - destroy()
 *
 * Renderers also expose `prefersReducedMotion` so the engine can retain the
 * same accessible lifecycle without knowing how a renderer creates motion.
 */
const rendererFactories = new Map([
  ["dom", createOddOneOutDomRenderer]
]);

/** Registers an optional Odd One Out renderer supplied by a reskin. */
export function registerOddOneOutVisualRenderer(name, factory) {
  if (typeof name !== "string" || !name.trim()) {
    throw new TypeError("Odd One Out renderer names must be non-empty strings.");
  }
  if (typeof factory !== "function") {
    throw new TypeError("An Odd One Out renderer factory must be a function.");
  }
  rendererFactories.set(name, factory);
}

/** Creates the selected renderer; Quizbase uses the DOM/CSS renderer by default. */
export function createOddOneOutVisualRenderer({ type = "dom", ...options } = {}) {
  const factory = rendererFactories.get(type);
  if (!factory) throw new Error(`Unknown Odd One Out visual renderer: ${type}`);
  return factory(options);
}
