import assert from "node:assert/strict";
import test from "node:test";
import { createSeededRandom } from "../src/core/random.mjs";
import { MissingWordEngine } from "../src/games/missing-word/engine.mjs";
import { HangmanEngine, normalizePlayableAnswer, playableLetters } from "../src/games/hangman/engine.mjs";
import { RandomLetterEngine, WEIGHTED_LETTERS } from "../src/games/random-letter/engine.mjs";
import { createRouter } from "../src/app/router.mjs";

const missingEntries = [
  { word: "testing", difficulty: 1, topics: ["General"] },
  { word: "mobile layout", difficulty: 2, topics: ["General", "Technology"] },
  { word: "extraordinary", difficulty: 3, topics: ["Hard"] }
];

test("Missing Word filters topics and difficulty", () => {
  const engine = new MissingWordEngine({ entries: missingEntries, defaultTopics: ["Technology"], random: createSeededRandom(2) });
  engine.setDifficulty("medium");
  const state = engine.next();
  assert.equal(state.word, "MOBILE LAYOUT");
  assert.equal(state.phase, "masked");
});

test("Missing Word masks letters but preserves one visible letter per segment", () => {
  const engine = new MissingWordEngine({ entries: missingEntries, defaultTopics: ["General"], random: createSeededRandom(9) });
  engine.setDifficulty("hard");
  const state = engine.next();
  assert.ok(state.mask.some(Boolean));
  const segments = state.word.split(" ");
  let offset = 0;
  for (const segment of segments) {
    const segmentMask = state.mask.slice(offset, offset + segment.length);
    assert.ok(segmentMask.some((masked) => !masked));
    offset += segment.length + 1;
  }
});

test("Missing Word reveal preserves the answer and changes only phase", () => {
  const engine = new MissingWordEngine({ entries: missingEntries, defaultTopics: ["General"], random: createSeededRandom(4) });
  const before = engine.next();
  const after = engine.reveal();
  assert.equal(after.word, before.word);
  assert.deepEqual(after.mask, before.mask);
  assert.equal(after.phase, "revealed");
});

test("Hangman handles accents and punctuation", () => {
  assert.equal(normalizePlayableAnswer("FLABÉBÉ"), "FLABEBE");
  assert.deepEqual(playableLetters("MR. MIME"), ["M", "R", "I", "E"]);
});

test("Hangman wins after all unique playable letters are guessed", () => {
  const engine = new HangmanEngine({ entries: ["ABBA"], getAnswer: (entry) => entry, random: createSeededRandom(1) });
  engine.start();
  engine.guess("a");
  const state = engine.guess("b");
  assert.equal(state.phase, "won");
  assert.ok(state.characters.every((character) => character.revealed));
});

test("Hangman ignores repeated misses and loses on the sixth unique miss", () => {
  const engine = new HangmanEngine({ entries: ["A"], getAnswer: (entry) => entry });
  engine.start();
  engine.guess("B");
  engine.guess("B");
  for (const letter of ["C", "D", "E", "F", "G"]) engine.guess(letter);
  const state = engine.snapshot();
  assert.equal(state.wrongCount, 6);
  assert.equal(state.phase, "lost");
});

test("Hangman wrong full solution consumes one miss and exits solve mode", () => {
  const engine = new HangmanEngine({ entries: ["ANSWER"], getAnswer: (entry) => entry });
  engine.start();
  engine.enterSolve();
  engine.editSolve("wrong");
  const state = engine.submitSolve();
  assert.equal(state.phase, "playing");
  assert.equal(state.wrongCount, 1);
});

test("Hangman start fully resets prior round state", () => {
  const engine = new HangmanEngine({ entries: ["ONE", "TWO"], getAnswer: (entry) => entry, random: createSeededRandom(3) });
  engine.start();
  engine.guess("Z");
  const state = engine.start();
  assert.equal(state.phase, "playing");
  assert.equal(state.wrongCount, 0);
  assert.deepEqual(state.guessed, []);
  assert.equal(state.solveBuffer, "");
});

test("Random Letter uses the expected weighted pool", () => {
  assert.equal(WEIGHTED_LETTERS.filter((letter) => letter === "A").length, 2);
  assert.equal(WEIGHTED_LETTERS.filter((letter) => letter === "Q").length, 1);
  const engine = new RandomLetterEngine({ random: createSeededRandom(7) });
  const state = engine.generate();
  assert.match(state.letter, /^[A-Z]$/);
  assert.equal(state.phase, "revealed");
});

test("Router restores hashes and uses browser history", () => {
  const listeners = new Map();
  const calls = [];
  const windowRef = {
    location: { hash: "#/hangman", pathname: "/quiz/", search: "" },
    history: {
      pushState(state, title, url) { calls.push(["push", state, url]); windowRef.location.hash = url.startsWith("#") ? url : ""; },
      replaceState(state, title, url) { calls.push(["replace", state, url]); windowRef.location.hash = url.startsWith("#") ? url : ""; }
    },
    addEventListener(type, listener) { listeners.set(type, listener); },
    removeEventListener(type) { listeners.delete(type); }
  };
  const router = createRouter({ routes: ["home", "hangman", "random-letter"], windowRef });
  assert.equal(router.current, "hangman");
  router.go("random-letter");
  assert.deepEqual(calls.at(-1), ["push", { route: "random-letter" }, "#/random-letter"]);
  router.go("home");
  assert.equal(calls.at(-1)[2], "/quiz/");
  router.destroy();
  assert.equal(listeners.size, 0);
});
