import { initLetterBuilder as initializeLetterBuilder } from "../core/letter-builder-engine.js";

// Thin route wrapper: rules, bags, solver, and lifecycle stay in the shared core.
export function initLetterBuilder(root, app) {
  initializeLetterBuilder(root, app);
}
