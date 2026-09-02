import test from "node:test";
import assert from "node:assert/strict";
import {
  chooseNumberDetectiveDifficulty,
  createNumberDetectiveRound,
  NUMBER_DETECTIVE_PATTERNS,
  numberDetectiveRoundKey,
  validateNumberDetectiveRound
} from "../../js/core/number-detective-logic.js";

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

test("Odd Number Out creates four numbers with one defensible intruder", () => {
  const random = seededRandom(12);
  const seenPatterns = new Set();
  for (let turn = 0; turn < 2_000; turn += 1) {
    const round = createNumberDetectiveRound(random);
    assert.deepEqual(validateNumberDetectiveRound(round), []);
    assert.equal(round.values.filter((value) => round.pattern.matches(value, round)).length, 3);
    assert.equal(round.pattern.matches(round.oddValue, round), false);
    seenPatterns.add(round.pattern.id);
  }
  assert.deepEqual(seenPatterns, new Set(NUMBER_DETECTIVE_PATTERNS.map((pattern) => pattern.id)));
});

test("Odd Number Out difficulty selects Medium, Hard, or the documented Mixed weighting", () => {
  const mediumRandom = seededRandom(135);
  const hardRandom = seededRandom(246);
  for (let turn = 0; turn < 300; turn += 1) {
    assert.equal(chooseNumberDetectiveDifficulty("medium", mediumRandom), 2);
    assert.equal(chooseNumberDetectiveDifficulty("hard", hardRandom), 3);
    assert.equal(createNumberDetectiveRound(mediumRandom, {}, "medium").difficulty, 2);
    assert.equal(createNumberDetectiveRound(hardRandom, {}, "hard").difficulty, 3);
  }
  assert.equal(chooseNumberDetectiveDifficulty("mixed", () => 0.64), 2);
  assert.equal(chooseNumberDetectiveDifficulty("mixed", () => 0.65), 3);
});

test("Odd Number Out avoids recent visual sets and patterns during a short session", () => {
  const random = seededRandom(93);
  let history = { recentKeys: [], recentPatternIds: [] };
  for (let turn = 0; turn < 500; turn += 1) {
    const round = createNumberDetectiveRound(random, history);
    const key = numberDetectiveRoundKey(round);
    assert.ok(!history.recentKeys.includes(key), `reused ${key} too soon`);
    assert.ok(!history.recentPatternIds.includes(round.pattern.id), `reused ${round.pattern.id} too soon`);
    history = {
      recentKeys: [...history.recentKeys, key].slice(-8),
      recentPatternIds: [...history.recentPatternIds, round.pattern.id].slice(-2)
    };
  }
});
