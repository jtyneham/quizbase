import { createRandomLetterDomRevealRenderer } from "./random-letter-reveal-renderer.js";

/** Public Random Letter reveal boundary. Pixi reskins register here, not in the game engine. */
const factories = new Map([["dom", createRandomLetterDomRevealRenderer]]);

export function registerRandomLetterVisualRenderer(name, factory) {
  if (typeof name !== "string" || !name.trim()) throw new TypeError("Renderer name must be a non-empty string.");
  if (typeof factory !== "function") throw new TypeError("Renderer factory must be a function.");
  factories.set(name, factory);
}

export function createRandomLetterVisualRenderer({ type = "dom", root, letterElement, randomDisplayLetter, reducedMotion, config } = {}) {
  const factory = factories.get(type);
  if (!factory) throw new Error(`Unknown Random Letter visual renderer: ${type}`);
  return factory({
    letterElement,
    letterCard: root.querySelector("#letterCard"),
    tunnelLayer: root.querySelector("#tunnelLayer"),
    wheelScene: root.querySelector("#wheelScene"),
    wheelLayout: root.querySelector("#wheelLayout"),
    wheelVisual: root.querySelector("#wheelVisual"),
    wheelSpinner: root.querySelector("#wheelSpinner"),
    wheelWinner: root.querySelector("#wheelWinner"),
    randomDisplayLetter,
    reducedMotion,
    ...config,
  });
}
