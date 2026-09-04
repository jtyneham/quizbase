import test from "node:test";
import assert from "node:assert/strict";
import {
  isCorrectGuess,
  isSolved,
  normalizePlayableAnswer,
  normalizePlayableChar,
  normalizeSolveAttempt,
  pickWithAnswerDeck,
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

test("Hangman answer deck exhausts an active topic before it recycles", () => {
  const pool = ["A", "B", "C"];
  let usedAnswers = new Set();
  const drawn = [];

  for (let turn = 0; turn < pool.length; turn += 1) {
    const result = pickWithAnswerDeck(pool, usedAnswers, (value) => value, () => 0);
    drawn.push(result.value);
    usedAnswers = result.usedAnswers;
    assert.equal(result.recycled, false);
  }

  assert.equal(new Set(drawn).size, pool.length);
  const next = pickWithAnswerDeck(pool, usedAnswers, (value) => value, () => 0);
  assert.equal(next.recycled, true);
  assert.equal(next.value, "A");
  assert.deepEqual([...next.usedAnswers], ["A"]);
});
