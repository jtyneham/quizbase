import { POKEMON_WORDS } from "../../data/missing-word-pokemon-words.js";
import { POKEMON_TOPICS } from "../core/pokemon-topics.js";
import { registerMissingWordGame } from "../core/missing-word-engine.js";

const EDITIONS = [
  { id: "general", name: "Missing Word", icon: "assets/missing-word.svg", screenId: "missingword" },
  { id: "pokemon", name: "Missing Word Pokemon", icon: "assets/missing-word-pokemon.svg", screenId: "missingwordpokemon" }
];

export function registerMissingWordPokemon(app) {
  registerMissingWordGame({
    app,
    elementName: "quiz-missing-word-pokemon",
    stylesheet: "css/missing-word-pokemon.css",
    screenId: "missingwordpokemon",
    wordPool: POKEMON_WORDS,
    topics: POKEMON_TOPICS,
    initialTopics: [],
    topicMode: "pokemon",
    editions: EDITIONS,
    editionId: "pokemon"
  });
}
