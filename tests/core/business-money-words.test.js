import test from "node:test";
import assert from "node:assert/strict";
import { WORDS } from "../../data/missing-word-words.js";
import { GAME_DATABASE } from "../../data/hangman-words.js";
import {
  BUSINESS_MONEY_HANGMAN_WORDS,
  BUSINESS_MONEY_TOPIC,
  BUSINESS_MONEY_WORDS,
  withBusinessMoneyHangmanPool,
  withBusinessMoneyMissingWordPool
} from "../../data/business-money-words.js";
import { curateHangmanDatabase } from "../../js/core/hangman-data-curator.js";
import { curateMissingWordPool } from "../../js/core/missing-word-data-curator.js";

test("Business & Money has the documented shared and Missing Word-only layers", () => {
  const byDifficulty = Object.groupBy(BUSINESS_MONEY_WORDS, ([, difficulty]) => difficulty);

  assert.equal(BUSINESS_MONEY_WORDS.length, 120);
  assert.equal(byDifficulty[1].length, 45);
  assert.equal(byDifficulty[2].length, 55);
  assert.equal(byDifficulty[3].length, 20);
  assert.equal(BUSINESS_MONEY_HANGMAN_WORDS.length, 100);
  assert.ok(BUSINESS_MONEY_HANGMAN_WORDS.every(([, difficulty]) => difficulty <= 2));
});

test("Business & Money rehomes legacy answers without polluting General", () => {
  const missingPool = withBusinessMoneyMissingWordPool(curateMissingWordPool(WORDS));
  const findMissing = (word) => missingPool.find((entry) => entry.word === word);

  assert.equal(missingPool.filter((entry) => entry.topics.includes(BUSINESS_MONEY_TOPIC)).length, 120);
  assert.deepEqual(findMissing("bank")?.topics, [BUSINESS_MONEY_TOPIC, "Nouns"]);
  assert.equal(findMissing("bank")?.topics.includes("General"), false);
  assert.equal(findMissing("bankruptcy")?.difficulty, 3);

  const hangmanPool = curateHangmanDatabase(withBusinessMoneyHangmanPool(GAME_DATABASE));
  const businessEntries = hangmanPool.filter((entry) => entry.category === BUSINESS_MONEY_TOPIC);
  assert.equal(businessEntries.length, 100);
  assert.ok(businessEntries.some((entry) => entry.answer === "COIN"));
  assert.equal(businessEntries.some((entry) => entry.answer === "BANKRUPTCY"), false);
});
