import test from "node:test";
import assert from "node:assert/strict";
import {
  chooseNumberGapDifficulty,
  createNumberGapRound,
  findNumberGapSolutions,
  NUMBER_GAP_TYPES,
  numberGapExplanation,
  numberGapRoundKey,
  validateNumberGapRound
} from "../../js/core/number-gap-logic.js";

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

test("Number Gap creates four distinct values with one unambiguous pair", () => {
  const random = seededRandom(22);
  const seenTypes = new Set();
  for (let turn = 0; turn < 2_000; turn += 1) {
    const round = createNumberGapRound(random);
    assert.deepEqual(validateNumberGapRound(round), []);
    assert.equal(findNumberGapSolutions(round.values, round.type).length, 1);
    assert.match(numberGapExplanation(round), / are \d+ apart\.$/);
    seenTypes.add(round.type.id);
  }
  assert.deepEqual(seenTypes, new Set(Object.values(NUMBER_GAP_TYPES).map((type) => type.id)));
});

test("Number Gap difficulty selects Medium, Hard, or the documented Mixed weighting", () => {
  const mediumRandom = seededRandom(321);
  const hardRandom = seededRandom(654);
  for (let turn = 0; turn < 300; turn += 1) {
    assert.equal(chooseNumberGapDifficulty("medium", mediumRandom), 2);
    assert.equal(chooseNumberGapDifficulty("hard", hardRandom), 3);
    assert.equal(createNumberGapRound(mediumRandom, [], "medium").difficulty, 2);
    assert.equal(createNumberGapRound(hardRandom, [], "hard").difficulty, 3);
  }
  assert.equal(chooseNumberGapDifficulty("mixed", () => 0.64), 2);
  assert.equal(chooseNumberGapDifficulty("mixed", () => 0.65), 3);
});

test("Number Gap avoids recent visible quartets during a short session", () => {
  const random = seededRandom(87);
  let recentKeys = [];
  for (let turn = 0; turn < 500; turn += 1) {
    const round = createNumberGapRound(random, recentKeys);
    const key = numberGapRoundKey(round);
    assert.ok(!recentKeys.includes(key), `reused ${key} too soon`);
    recentKeys = [...recentKeys, key].slice(-8);
  }
});
