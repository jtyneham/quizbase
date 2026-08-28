import { createMissingWordDomRenderer } from "./missing-word-dom-renderer.js";

/**
 * Public visual boundary for Missing Word.
 *
 * The engine owns the selected word, mask, button state, and round lifecycle.
 * A visual renderer only draws a supplied round and may animate it. This makes
 * the default DOM/CSS reels replaceable by a Pixi, SVG, or themed renderer
 * without duplicating gameplay logic.
 *
 * Required renderer methods:
 * - renderRound({ word, mask })
 * - playGeneration({ word, mask, duration }) -> Promise<void>
 * - settleGeneration()
 * - reveal({ word, duration }) -> Promise<void>
 * - destroy()
 */
const rendererFactories = new Map([
  ["dom", createMissingWordDomRenderer],
]);

/** Registers an optional renderer supplied by a reskin, such as Pixi. */
export function registerMissingWordVisualRenderer(name, factory) {
  if (typeof name !== "string" || !name.trim()) {
    throw new TypeError("Missing Word renderer names must be non-empty strings.");
  }
  if (typeof factory !== "function") {
    throw new TypeError("A Missing Word renderer factory must be a function.");
  }
  rendererFactories.set(name, factory);
}

/** Creates the selected visual renderer; Quizbase uses the DOM renderer by default. */
export function createMissingWordVisualRenderer({ type = "dom", ...options }) {
  const factory = rendererFactories.get(type);
  if (!factory) {
    throw new Error(`Unknown Missing Word visual renderer: ${type}`);
  }
  return factory(options);
}
