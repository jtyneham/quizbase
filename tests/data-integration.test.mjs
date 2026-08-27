import assert from "node:assert/strict";
import test from "node:test";
import { WORDS } from "../data/missing-word-words.js";
import { POKEMON_WORDS } from "../data/missing-word-pokemon-words.js";
import { GAME_DATABASE, RANDOM_POOL } from "../data/hangman-words.js";
import { topics } from "../data/rngl-topics.js";
import { MissingWordEngine } from "../src/games/missing-word/engine.mjs";
import { HangmanEngine } from "../src/games/hangman/engine.mjs";
import { createSeededRandom } from "../src/core/random.mjs";

test("production data exports all required pools", () => {
  assert.ok(WORDS.length > 7_000);
  assert.ok(POKEMON_WORDS.length > 2_000);
  assert.ok(GAME_DATABASE.length > 4_000);
  assert.ok(RANDOM_POOL.length >= 500);
  assert.ok(topics.length > 400);
});

test("general Missing Word default can produce a round", () => {
  const engine = new MissingWordEngine({ entries: WORDS, defaultTopics: ["General"], random: createSeededRandom(12) });
  assert.equal(engine.next().phase, "masked");
});

test("Pokémon Missing Word default can produce a round", () => {
  const engine = new MissingWordEngine({ entries: POKEMON_WORDS, defaultTopics: ["Pokemon All Names"], random: createSeededRandom(13) });
  assert.equal(engine.next().phase, "masked");
});

test("general and Pokémon Hangman filters produce playable rounds", () => {
  const randomAnswers = new Set(RANDOM_POOL);
  const general = new HangmanEngine({ entries: GAME_DATABASE, filter: (entry) => randomAnswers.has(entry.answer), random: createSeededRandom(3) });
  const pokemon = new HangmanEngine({ entries: POKEMON_WORDS, getAnswer: (entry) => entry.word, filter: (entry) => entry.topics.includes("Pokemon All Names"), random: createSeededRandom(4) });
  assert.equal(general.start().phase, "playing");
  assert.equal(pokemon.start().phase, "playing");
});
