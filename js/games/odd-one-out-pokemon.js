import { createPokemonOddOneOutPilotBlueprints } from "../../data/odd-one-out-pokemon-knowledge.js";
import { initOddOneOut } from "../core/odd-one-out-engine.js";

// This edition deliberately reuses the shared Odd One Out lifecycle, haptics,
// feedback, renderer boundary, and cooldowns. Only reviewed Pokémon data and
// local element selectors differ. Expand the pilot pool before treating this
// as a complete edition.
export function initPokemonOddOneOut(root, app) {
  initOddOneOut(root, app, {
    blueprints: createPokemonOddOneOutPilotBlueprints(),
    controls: {
      fullscreenButton: "#oddOneOutPokemonFullscreenButton",
      fullscreenIcon: "#oddOneOutPokemonFullscreenIcon",
      fullscreenLabel: "#oddOneOutPokemonFullscreenLabel",
      homeButton: "#oddOneOutPokemonHomeButton"
    },
    visualRendererConfig: {
      selectors: {
        cards: "#oddOneOutPokemonCards",
        feedback: "#oddOneOutPokemonFeedback",
        primaryAction: "#oddOneOutPokemonNextButton"
      }
    }
  });
}
