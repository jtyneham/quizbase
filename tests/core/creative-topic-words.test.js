import test from "node:test";
import assert from "node:assert/strict";
import { WORDS } from "../../data/missing-word-words.js";
import { GAME_DATABASE } from "../../data/hangman-words.js";
import { COMICS_HANGMAN_WORDS, COMICS_TOPIC, COMICS_WORDS, withComicsHangmanPool, withComicsMissingWordPool } from "../../data/comics-words.js";
import { MANGA_ANIME_HANGMAN_WORDS, MANGA_ANIME_TOPIC, MANGA_ANIME_WORDS, withMangaAnimeHangmanPool, withMangaAnimeMissingWordPool } from "../../data/manga-anime-words.js";
import { curateHangmanDatabase } from "../../js/core/hangman-data-curator.js";
import { curateMissingWordPool } from "../../js/core/missing-word-data-curator.js";

const TOPICS = [
  [COMICS_TOPIC, COMICS_WORDS, COMICS_HANGMAN_WORDS, withComicsMissingWordPool, withComicsHangmanPool],
  [MANGA_ANIME_TOPIC, MANGA_ANIME_WORDS, MANGA_ANIME_HANGMAN_WORDS, withMangaAnimeMissingWordPool, withMangaAnimeHangmanPool]
];

for (const [topic, words, hangmanWords, integrateMissingWord, integrateHangman] of TOPICS) {
  test(`${topic} keeps a fair shared core and Missing Word-only Hard layer`, () => {
    const byDifficulty = Object.groupBy(words, ([, difficulty]) => difficulty);
    assert.equal(words.length, 120);
    assert.equal(byDifficulty[1].length, 45);
    assert.equal(byDifficulty[2].length, 55);
    assert.equal(byDifficulty[3].length, 20);
    assert.equal(hangmanWords.length, 100);
    assert.ok(hangmanWords.every(([, difficulty]) => difficulty <= 2));
  });

  test(`${topic} owns matching legacy answers and stays out of General`, () => {
    const missingPool = integrateMissingWord(curateMissingWordPool(WORDS));
    const missingEntries = missingPool.filter((entry) => entry.topics.includes(topic));
    assert.equal(missingEntries.length, 120);
    assert.ok(missingEntries.every((entry) => !entry.topics.includes("General")));

    const hangmanPool = curateHangmanDatabase(integrateHangman(GAME_DATABASE));
    const hangmanEntries = hangmanPool.filter((entry) => entry.category === topic);
    assert.equal(hangmanEntries.length, 100);
    assert.ok(hangmanEntries.every((entry) => entry.subcategory === topic));
  });
}
