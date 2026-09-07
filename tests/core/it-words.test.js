import test from "node:test";
import assert from "node:assert/strict";
import { GAME_DATABASE } from "../../data/hangman-words.js";
import { WORDS } from "../../data/missing-word-words.js";
import { IT_TOPIC, IT_WORDS, withItHangmanPool, withItMissingWordPool } from "../../data/it-words.js";
import { canonicalTopicWord } from "../../data/topic-pool-utils.js";
import { curateHangmanDatabase } from "../../js/core/hangman-data-curator.js";
import { curateMissingWordPool, finalizeMissingWordPool } from "../../js/core/missing-word-data-curator.js";

test("IT is a curated standalone topic in Missing Word and Hangman", () => {
  const canonicalAnswers = IT_WORDS.map(([answer]) => canonicalTopicWord(answer));
  const byDifficulty = Object.groupBy(IT_WORDS, ([, difficulty]) => difficulty);
  assert.equal(IT_WORDS.length, 200);
  assert.equal(new Set(canonicalAnswers).size, IT_WORDS.length);
  assert.deepEqual(
    { easy: byDifficulty[1].length, medium: byDifficulty[2].length, hard: byDifficulty[3].length },
    { easy: 60, medium: 100, hard: 40 }
  );

  const missingPool = finalizeMissingWordPool(withItMissingWordPool(curateMissingWordPool(WORDS)));
  const missingIt = missingPool.filter((entry) => entry.topics.includes(IT_TOPIC));
  assert.equal(missingIt.length, IT_WORDS.length);
  assert.ok(missingPool.every((entry) => !entry.topics.includes("IT & Technology")));
  assert.ok(missingIt.every((entry) => !entry.topics.includes("General")));

  const hangmanPool = curateHangmanDatabase(withItHangmanPool(GAME_DATABASE));
  const hangmanIt = hangmanPool.filter((entry) => entry.category === IT_TOPIC);
  assert.equal(hangmanIt.length, IT_WORDS.length);
  assert.ok(hangmanIt.every((entry) => entry.subcategory === IT_TOPIC));
});
