import test from "node:test";
import assert from "node:assert/strict";
import { GAME_DATABASE } from "../../data/hangman-words.js";
import { WORDS } from "../../data/missing-word-words.js";
import { UFC_FIGHTERS_TOPIC, UFC_FIGHTERS_WORDS, withUfcFightersHangmanPool, withUfcFightersMissingWordPool } from "../../data/ufc-fighters.js";
import { canonicalTopicWord } from "../../data/topic-pool-utils.js";
import { curateHangmanDatabase } from "../../js/core/hangman-data-curator.js";
import { curateMissingWordPool, finalizeMissingWordPool } from "../../js/core/missing-word-data-curator.js";

test("UFC Fighters is a distinct, playable Hangman topic", () => {
  const canonicalAnswers = UFC_FIGHTERS_WORDS.map(([answer]) => canonicalTopicWord(answer));
  assert.equal(UFC_FIGHTERS_WORDS.length, 168);
  assert.equal(new Set(canonicalAnswers).size, UFC_FIGHTERS_WORDS.length);

  const hangmanPool = curateHangmanDatabase(withUfcFightersHangmanPool(GAME_DATABASE));
  const hangmanFighters = hangmanPool.filter((entry) => entry.category === UFC_FIGHTERS_TOPIC);
  assert.equal(hangmanFighters.length, UFC_FIGHTERS_WORDS.length);
  assert.ok(hangmanFighters.every((entry) => entry.subcategory === UFC_FIGHTERS_TOPIC));
  assert.ok(hangmanFighters.every((entry) => /^[A-Z .'-]+$/.test(entry.answer)));

  const missingWordPool = finalizeMissingWordPool(withUfcFightersMissingWordPool(curateMissingWordPool(WORDS)));
  const missingWordFighters = missingWordPool.filter((entry) => entry.topics.includes(UFC_FIGHTERS_TOPIC));
  assert.equal(missingWordFighters.length, UFC_FIGHTERS_WORDS.length);
  assert.ok(missingWordFighters.every((entry) => !entry.topics.includes("General")));
  assert.equal(missingWordFighters.filter((entry) => entry.difficulty === 3).length, 30);
});
