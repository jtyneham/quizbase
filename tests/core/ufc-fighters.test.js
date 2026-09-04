import test from "node:test";
import assert from "node:assert/strict";
import { GAME_DATABASE } from "../../data/hangman-words.js";
import { UFC_FIGHTERS_TOPIC, UFC_FIGHTERS_WORDS, withUfcFightersHangmanPool } from "../../data/ufc-fighters.js";
import { canonicalTopicWord } from "../../data/topic-pool-utils.js";
import { curateHangmanDatabase } from "../../js/core/hangman-data-curator.js";

test("UFC Fighters is a distinct, playable Hangman topic", () => {
  const canonicalAnswers = UFC_FIGHTERS_WORDS.map(([answer]) => canonicalTopicWord(answer));
  assert.equal(UFC_FIGHTERS_WORDS.length, 168);
  assert.equal(new Set(canonicalAnswers).size, UFC_FIGHTERS_WORDS.length);

  const pool = curateHangmanDatabase(withUfcFightersHangmanPool(GAME_DATABASE));
  const fighters = pool.filter((entry) => entry.category === UFC_FIGHTERS_TOPIC);
  assert.equal(fighters.length, UFC_FIGHTERS_WORDS.length);
  assert.ok(fighters.every((entry) => entry.subcategory === UFC_FIGHTERS_TOPIC));
  assert.ok(fighters.every((entry) => /^[A-Z .'-]+$/.test(entry.answer)));
});
