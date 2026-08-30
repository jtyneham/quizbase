import {
  POKEMON_ODD_ONE_OUT_BLUEPRINTS,
  POKEMON_ODD_ONE_OUT_ACTIVE_POOLS,
  POKEMON_ODD_ONE_OUT_ACTIVE_TERMS
} from "../../data/odd-one-out-pokemon-knowledge.js";
import { initOddOneOut } from "../core/odd-one-out-engine.js";
import { buildPokemonOddOneOutRoundBlueprints } from "../core/pokemon-odd-one-out-round-builder.js";

// This edition deliberately reuses the shared Odd One Out lifecycle, haptics,
// feedback, renderer boundary, and cooldowns. Only reviewed Pokémon data and
// local element selectors differ. Expand the pilot pool before treating this
// as a complete edition.
export function initPokemonOddOneOut(root, app) {
  const { blueprints } = buildPokemonOddOneOutRoundBlueprints({
    contracts: POKEMON_ODD_ONE_OUT_BLUEPRINTS,
    terms: POKEMON_ODD_ONE_OUT_ACTIVE_TERMS,
    pools: POKEMON_ODD_ONE_OUT_ACTIVE_POOLS
  });

  initOddOneOut(root, app, {
    blueprints,
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
