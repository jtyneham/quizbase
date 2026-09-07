import test from "node:test";
import assert from "node:assert/strict";
import { GAME_DATABASE } from "../../data/hangman-words.js";
import { WORDS } from "../../data/missing-word-words.js";
import {
  FOOTBALL_PLAYERS_TOPIC,
  FOOTBALL_PLAYERS_MISSING_WORDS,
  FOOTBALL_PLAYERS_WORDS,
  withFootballPlayersHangmanPool,
  withFootballPlayersMissingWordPool
} from "../../data/football-players.js";
import { canonicalTopicWord } from "../../data/topic-pool-utils.js";
import { curateHangmanDatabase } from "../../js/core/hangman-data-curator.js";
import { curateMissingWordPool, finalizeMissingWordPool } from "../../js/core/missing-word-data-curator.js";

test("Football Players is a distinct, difficulty-balanced topic for both word games", () => {
  const canonicalAnswers = FOOTBALL_PLAYERS_WORDS.map(([answer]) => canonicalTopicWord(answer));
  const byDifficulty = Object.groupBy(FOOTBALL_PLAYERS_WORDS, ([, difficulty]) => difficulty);

  assert.equal(FOOTBALL_PLAYERS_WORDS.length, 150);
  assert.equal(new Set(canonicalAnswers).size, FOOTBALL_PLAYERS_WORDS.length);
  assert.deepEqual(
    { easy: byDifficulty[1].length, medium: byDifficulty[2].length, hard: byDifficulty[3].length },
    { easy: 60, medium: 60, hard: 30 }
  );
  assert.ok(FOOTBALL_PLAYERS_WORDS.every(([answer]) => answer.trim().includes(" ")));
  assert.equal(FOOTBALL_PLAYERS_MISSING_WORDS.length, 149);
  assert.ok(!FOOTBALL_PLAYERS_WORDS.some(([answer]) => [
    "Alex Morgan", "Megan Rapinoe", "Mia Hamm", "Marta Vieira da Silva",
    "Aitana Bonmati", "Alexia Putellas", "Sam Kerr", "Ada Hegerberg",
    "Christine Sinclair", "Abby Wambach", "Lucy Bronze", "Hope Solo",
    "Wendie Renard", "Caroline Graham Hansen", "Pernille Harder", "Homare Sawa", "Sun Wen"
  ].includes(answer)));
  assert.ok(FOOTBALL_PLAYERS_MISSING_WORDS.every(([answer]) => {
    const letterCount = (answer.match(/[A-Za-z]/g) ?? []).length;
    const wordCount = answer.trim().split(/\s+/).length;
    return letterCount <= 20 && wordCount <= 3;
  }));

  const hangmanPool = curateHangmanDatabase(withFootballPlayersHangmanPool(GAME_DATABASE));
  const hangmanPlayers = hangmanPool.filter((entry) => entry.category === FOOTBALL_PLAYERS_TOPIC);
  assert.equal(hangmanPlayers.length, FOOTBALL_PLAYERS_WORDS.length);
  assert.ok(hangmanPlayers.every((entry) => entry.subcategory === FOOTBALL_PLAYERS_TOPIC));
  assert.ok(hangmanPlayers.every((entry) => /^[A-Z .'-]+$/.test(entry.answer)));

  const missingWordPool = finalizeMissingWordPool(
    withFootballPlayersMissingWordPool(curateMissingWordPool(WORDS))
  );
  const missingWordPlayers = missingWordPool.filter((entry) => entry.topics.includes(FOOTBALL_PLAYERS_TOPIC));
  assert.equal(missingWordPlayers.length, FOOTBALL_PLAYERS_MISSING_WORDS.length);
  assert.ok(missingWordPlayers.every((entry) => !entry.topics.includes("General")));
});
