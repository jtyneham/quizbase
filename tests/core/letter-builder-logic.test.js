import test from "node:test";
import assert from "node:assert/strict";
import {
  LETTER_BUILDER_DISTRIBUTIONS,
  PersistentLetterBags,
  canBuildWord,
  fillRandomLetters,
  findBestWords,
  multisetLetterOverlap
} from "../../js/core/letter-builder-logic.js";
import { LETTER_BUILDER_WORDS } from "../../data/letter-builder-words.js";

const constantRandom = (value) => () => value;

test("weighted bags draw without replacement and refill only after exhaustion", () => {
  const bags = new PersistentLetterBags(constantRandom(0), {
    vowel: { A: 2, E: 1 },
    consonant: { T: 1 }
  });
  const firstBag = [bags.draw("vowel"), bags.draw("vowel"), bags.draw("vowel")].sort();
  assert.deepEqual(firstBag, ["A", "A", "E"]);
  assert.equal(bags.remaining("vowel"), 0);
  assert.match(bags.draw("vowel"), /^[AE]$/);
  assert.equal(Object.values(LETTER_BUILDER_DISTRIBUTIONS.vowel).reduce((sum, count) => sum + count, 0), 67);
});

test("random fill completes nine letters with a playable vowel balance", () => {
  const bags = new PersistentLetterBags(constantRandom(0.2));
  const letters = fillRandomLetters({ letters: ["T", "S"], bags, random: constantRandom(0.2) });
  const vowels = letters.filter((letter) => "AEIOU".includes(letter));
  assert.equal(letters.length, 9);
  assert.ok(vowels.length >= 3 && vowels.length <= 5);
});

test("letter multisets and solver respect duplicate tile counts", () => {
  assert.equal(multisetLetterOverlap(["A", "A", "T"], ["A", "T", "T"]), 2);
  assert.equal(canBuildWord("rate", ["R", "A", "T", "E"]), true);
  assert.equal(canBuildWord("letter", ["L", "E", "T", "R"]), false);

  const solution = findBestWords(["rat", "rate", "tear", "treat", "tare"], ["T", "R", "E", "A"]);
  assert.equal(solution.longestLength, 4);
  assert.deepEqual(solution.words, ["rate", "tare", "tear"]);
});

test("the final draw avoids an extremely similar consecutive set when possible", () => {
  const bags = new PersistentLetterBags(constantRandom(0), {
    vowel: { A: 1 },
    consonant: { T: 1, Z: 1 }
  });
  bags.bags.consonant = ["Z", "T"];
  const chosen = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const previousRound = [...chosen, "T"];
  assert.equal(bags.draw("consonant", { chosen, previousRound }), "Z");
});

test("the bundled dictionary stays lowercase, tile-sized, and family-safe", () => {
  assert.ok(LETTER_BUILDER_WORDS.length > 30_000);
  assert.equal(new Set(LETTER_BUILDER_WORDS).size, LETTER_BUILDER_WORDS.length);
  assert.ok(LETTER_BUILDER_WORDS.every((word) => /^[a-z]{3,9}$/.test(word)));
  for (const blocked of ["arse", "faggot", "fuck", "porn", "shit", "vagina"]) {
    assert.equal(LETTER_BUILDER_WORDS.includes(blocked), false, `${blocked} must be excluded`);
  }
});

test("revealed short words favour recognisable standalone vocabulary", () => {
  for (const unclear of ["col", "etc", "non", "qua", "sec", "sup"]) {
    assert.equal(LETTER_BUILDER_WORDS.includes(unclear), false, `${unclear} must be excluded`);
  }
  for (const familiar of ["cog", "con", "cot", "got", "not", "ton", "tot"]) {
    assert.equal(LETTER_BUILDER_WORDS.includes(familiar), true, `${familiar} should remain playable`);
  }

  const screenshotRound = findBestWords(LETTER_BUILDER_WORDS, ["T", "O", "N", "C", "C", "T", "N", "G", "M"]);
  assert.deepEqual(screenshotRound.words, ["cog", "con", "cot", "got", "not", "ton", "tot"]);
});
