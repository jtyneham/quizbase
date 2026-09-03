import test from "node:test";
import assert from "node:assert/strict";
import {
  answerCooldownLimit,
  isCorrectGuess,
  isSolved,
  normalizePlayableAnswer,
  normalizePlayableChar,
  normalizeSolveAttempt,
  pickDifferent,
  pickWithAnswerCooldown,
  uniquePlayableLetters,
} from "../../js/core/hangman-logic.js";

test("normalizes accented playable letters without destroying punctuation", () => {
  assert.equal(normalizePlayableChar("é"), "E");
  assert.equal(normalizePlayableAnswer("Flabébé"), "FLABEBE");
  assert.equal(normalizePlayableAnswer("Ho-Oh"), "HO-OH");
});

test("extracts unique playable letters from multiword and punctuated answers", () => {
  assert.deepEqual(uniquePlayableLetters("MR. MIME"), ["M", "R", "I", "E"]);
});

test("correct guesses and solved state work for normalized answers", () => {
  assert.equal(isCorrectGuess("Flabébé", "E"), true);
  assert.equal(isCorrectGuess("Pikachu", "Z"), false);
  const guessed = new Set(uniquePlayableLetters("Ho-Oh"));
  assert.equal(isSolved("Ho-Oh", guessed), true);
});

test("solve attempts collapse whitespace and normalize accents", () => {
  assert.equal(normalizeSolveAttempt("  flabébé  "), "FLABEBE");
  assert.equal(normalizeSolveAttempt("mr.   mime"), "MR. MIME");
});

test("pickDifferent avoids immediately repeating an answer when possible", () => {
  const originalRandom = Math.random;
  Math.random = () => 0;
  try {
    assert.equal(pickDifferent(["A", "B"], "A"), "B");
    assert.equal(pickDifferent(["A"], "A"), "A");
    assert.equal(pickDifferent([], "A"), "");
  } finally {
    Math.random = originalRandom;
  }
});

test("Hangman answer cooldown keeps recent answers out while preserving a safe pool reserve", () => {
  assert.equal(answerCooldownLimit(79), 30);
  assert.equal(answerCooldownLimit(7), 3);

  const pool = Array.from({ length: 79 }, (_, index) => `ANSWER ${index + 1}`);
  const recent = [];
  for (let turn = 0; turn < 60; turn += 1) {
    const answer = pickWithAnswerCooldown(pool, recent, value => value, () => 0);
    assert.equal(recent.includes(answer), false, `${answer} repeated during its cooldown`);
    recent.push(answer);
    recent.splice(0, Math.max(0, recent.length - answerCooldownLimit(pool.length)));
  }
});
