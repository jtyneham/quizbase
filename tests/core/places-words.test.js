import test from "node:test";
import assert from "node:assert/strict";
import { GAME_DATABASE } from "../../data/hangman-words.js";
import { WORDS } from "../../data/missing-word-words.js";
import { CITIES_TOPIC, CITIES_WORDS, withCitiesHangmanPool, withCitiesMissingWordPool } from "../../data/cities-words.js";
import { COUNTRIES_TOPIC, COUNTRIES_WORDS, withCountriesHangmanPool, withCountriesMissingWordPool } from "../../data/countries-words.js";
import { canonicalTopicWord } from "../../data/topic-pool-utils.js";
import { curateHangmanDatabase } from "../../js/core/hangman-data-curator.js";
import { curateMissingWordPool, finalizeMissingWordPool } from "../../js/core/missing-word-data-curator.js";

const TOPICS = [
  [CITIES_TOPIC, CITIES_WORDS, withCitiesMissingWordPool, withCitiesHangmanPool],
  [COUNTRIES_TOPIC, COUNTRIES_WORDS, withCountriesMissingWordPool, withCountriesHangmanPool]
];

for (const [topic, words, addToMissingWord, addToHangman] of TOPICS) {
  test(`${topic} is a distinct, balanced topic for both word games`, () => {
    const canonicalAnswers = words.map(([answer]) => canonicalTopicWord(answer));
    const byDifficulty = Object.groupBy(words, ([, difficulty]) => difficulty);

    assert.equal(words.length, 120);
    assert.equal(new Set(canonicalAnswers).size, words.length);
    assert.deepEqual(
      { easy: byDifficulty[1].length, medium: byDifficulty[2].length, hard: byDifficulty[3].length },
      { easy: 40, medium: 40, hard: 40 }
    );

    const missingPool = finalizeMissingWordPool(addToMissingWord(curateMissingWordPool(WORDS)));
    const missingEntries = missingPool.filter((entry) => entry.topics.includes(topic));
    assert.equal(missingEntries.length, words.length);
    assert.ok(missingEntries.every((entry) => !entry.topics.includes("General")));
    assert.ok(missingEntries.every((entry) => !entry.topics.includes("Geography")));

    const hangmanPool = curateHangmanDatabase(addToHangman(GAME_DATABASE));
    const hangmanEntries = hangmanPool.filter((entry) => entry.category === topic);
    assert.equal(hangmanEntries.length, words.length);
    assert.ok(hangmanEntries.every((entry) => entry.subcategory === topic));
  });
}
