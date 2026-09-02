import {
  POKEMON_ODD_ONE_OUT_BLUEPRINTS,
  POKEMON_ODD_ONE_OUT_ACTIVE_POOLS,
  POKEMON_ODD_ONE_OUT_ACTIVE_TERMS
} from "../../data/odd-one-out-pokemon-knowledge.js";
import { initOddOneOut } from "../core/odd-one-out-engine.js";
import { buildPokemonOddOneOutRoundBlueprints } from "../core/pokemon-odd-one-out-round-builder.js";

const EDITIONS = [
  { id: "general", name: "Odd One Out", icon: "assets/odd-one-out.svg", screenId: "oddoneout" },
  { id: "pokemon", name: "Odd One Out Pokemon", icon: "assets/odd-one-out-pokemon.svg", screenId: "oddoneoutpokemon" }
];

// This edition deliberately reuses the shared Odd One Out lifecycle, haptics,
// feedback, renderer boundary, and cooldowns. Only reviewed Pokémon data and
// local element selectors differ. Grow it by adding reviewed relationship
// contracts and pools; the game never fetches unreviewed Pokémon data at runtime.
export function initPokemonOddOneOut(root, app) {
  const { blueprints } = buildPokemonOddOneOutRoundBlueprints({
    contracts: POKEMON_ODD_ONE_OUT_BLUEPRINTS,
    terms: POKEMON_ODD_ONE_OUT_ACTIVE_TERMS,
    pools: POKEMON_ODD_ONE_OUT_ACTIVE_POOLS
  });

  initOddOneOut(root, app, {
    blueprints,
    // Medium and Hard each have fourteen reviewed relationships. Keeping the
    // last eight ensures either mode always has a fresh relationship to choose;
    // label protection remains the same three generated sets as General OOO.
    cooldownLimits: { relationships: 8, families: 4, visibleSets: 3 },
    editions: EDITIONS,
    editionId: "pokemon",
    editionPickerPrefix: "oddOneOutPokemon",
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
