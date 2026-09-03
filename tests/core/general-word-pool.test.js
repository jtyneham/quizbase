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
import { curateMissingWordPool, finalizeMissingWordPool } from "../../js/core/missing-word-data-curator.js";

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
  ["SHOT", "THE", "WALL", "1917"].forEach((answer) => {
    assert.equal(curated.some((entry) => entry.answer === answer), false);
  });
  assert.equal(curated.some((entry) => entry.answer === "SMART WATCH"), false);
  assert.equal(curated.every((entry) => entry.subcategory === entry.category), true);
});

test("Missing Word curation removes unreachable and cross-topic noise", () => {
  const curated = curateMissingWordPool(WORDS);
  const find = (word) => curated.find((entry) => entry.word === word);

  assert.equal(find("and"), undefined);
  assert.equal(find("declaration of independence"), undefined);
  assert.equal(find("lord of the rings"), undefined);
  assert.equal(curated.some((entry) => entry.topics.includes("Pokemon")), false);
  assert.deepEqual(find("fire")?.topics, ["General", "Nature", "Nouns", "Verbs"]);
  assert.deepEqual(find("table")?.topics, ["General", "Household", "Everyday Objects", "Nouns"]);
});

test("Missing Word specialist audit removes incomplete contextual answers only", () => {
  const curated = curateMissingWordPool(WORDS);
  const find = (word) => curated.find((entry) => entry.word === word);

  assert.equal(find("spinal")?.topics.includes("Human Body"), false);
  assert.equal(find("black")?.topics.includes("Space"), false);
  assert.equal(find("black")?.topics.includes("Geography"), false);
  assert.equal(find("federation")?.topics.includes("Science"), false);
  assert.equal(find("bad")?.topics.includes("Games"), false);
  assert.ok(find("elephant")?.topics.includes("Animals"));
  assert.ok(find("astronaut")?.topics.includes("Space"));
  assert.ok(find("guitar")?.topics.includes("Music"));
});

test("Missing Word practical-topic audit removes fragments without thinning valid pools", () => {
  const curated = curateMissingWordPool(WORDS);
  const find = (word) => curated.find((entry) => entry.word === word);

  assert.equal(find("cargo")?.topics.includes("Vehicles"), false);
  assert.equal(find("bedside")?.topics.includes("Household"), false);
  assert.equal(find("ballpoint")?.topics.includes("Everyday Objects"), false);
  assert.equal(find("burger")?.topics.includes("Brands"), false);
  assert.equal(find("pomegranate")?.topics.includes("Verbs") ?? false, false);
  assert.equal(find("iguana")?.topics.includes("Adjectives"), false);
  assert.ok(find("submarine")?.topics.includes("Vehicles"));
  assert.ok(find("toaster")?.topics.includes("Household"));
  assert.ok(find("screwdriver")?.topics.includes("Tools"));
  assert.ok(find("restaurant")?.topics.includes("Buildings & Places"));
  assert.ok(find("umbrella")?.topics.includes("Everyday Objects"));
});

test("Missing Word curation keeps only fair topic answers and canonical display spellings", () => {
  const curated = curateMissingWordPool(WORDS);
  const find = (word) => curated.find((entry) => entry.word === word);

  ["packetloss", "tool box", "bake", "pomegranate", "not"].forEach((word) => {
    assert.equal(find(word), undefined, `${word} should not remain in the topic pool`);
  });
  assert.deepEqual(find("packet loss")?.topics, ["Games", "Video Games", "IT & Technology", "Nouns"]);
  assert.deepEqual(find("toolbox"), {
    word: "toolbox",
    difficulty: 1,
    topics: ["Tools", "Everyday Objects", "Nouns"]
  });
  ["bar", "boy", "cloud", "data", "tree"].forEach((word) => {
    assert.equal(find(word)?.topics.includes("Games"), false, `${word} is not a standalone Games answer`);
  });
});

test("Missing Word finalization enforces its renderer limits after specialist integration", () => {
  const finalized = finalizeMissingWordPool([
    { word: "Guardians of the Galaxy", difficulty: 2, topics: ["Comics", "Nouns"] },
    { word: "Neon Genesis Evangelion", difficulty: 1, topics: ["Manga & Anime", "Nouns"] },
    { word: "Batman", difficulty: 1, topics: ["Comics", "Nouns"] }
  ]);

  assert.deepEqual(finalized.map((entry) => entry.word), ["Batman"]);
});
