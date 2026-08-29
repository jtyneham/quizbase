import test from "node:test";
import assert from "node:assert/strict";
import { WORDS } from "../../data/missing-word-words.js";
import { GAME_DATABASE } from "../../data/hangman-words.js";
import {
  GENERAL_TERMS,
  isGeneralHangmanEntry,
  withCuratedGeneralTopic
} from "../../js/core/general-word-pool.js";
import { curateHangmanDatabase } from "../../js/core/hangman-data-curator.js";

test("General defaults use an explicit, specialist-free vocabulary", () => {
  const specialistTerms = ["acer", "amaterasu", "aim reticle", "and", "be"];
  specialistTerms.forEach((term) => assert.equal(GENERAL_TERMS.has(term), false));
  assert.ok(GENERAL_TERMS.has("apple"));
  assert.ok(GENERAL_TERMS.has("elephant"));
  assert.ok(GENERAL_TERMS.has("chair"));
});

test("curated General replaces the old broad Missing Word tag", () => {
  const curated = withCuratedGeneralTopic(WORDS);
  assert.ok(curated.find((entry) => entry.word === "apple")?.topics.includes("General"));
  assert.equal(curated.find((entry) => entry.word === "aim reticle")?.topics.includes("General"), false);
  assert.equal(curated.find((entry) => entry.word === "and")?.topics.includes("General"), false);
});

test("Hangman General only includes explicitly curated answers", () => {
  const featured = GAME_DATABASE.filter(isGeneralHangmanEntry);
  assert.ok(featured.length >= 180);
  assert.ok(featured.every((entry) => GENERAL_TERMS.has(entry.answer.toLowerCase())));
  assert.equal(featured.some((entry) => entry.answer === "SHOT"), false);
});

test("Hangman curation removes duplicate spellings and context-free fragments", () => {
  const curated = curateHangmanDatabase(GAME_DATABASE);
  const canonical = (answer) => answer.replace(/[^A-Z0-9]/g, "");
  const answers = curated.map((entry) => canonical(entry.answer));

  assert.equal(new Set(answers).size, answers.length);
  assert.equal(curated.some((entry) => entry.answer === "SHOT"), false);
  assert.equal(curated.some((entry) => entry.answer === "SMART WATCH"), false);
  assert.equal(curated.every((entry) => entry.subcategory === entry.category), true);
});
