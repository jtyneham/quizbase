import test from "node:test";
import assert from "node:assert/strict";
import {
  createTargetPairRound,
  findTargetPairSolutions,
  targetPairExplanation,
  targetPairRoundKey,
  validateTargetPairRound
} from "../../js/core/target-pair-logic.js";

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

test("Target Pair creates four distinct values with exactly one valid answer", () => {
  const random = seededRandom(42);
  for (let turn = 0; turn < 2_000; turn += 1) {
    const round = createTargetPairRound(random);
    assert.deepEqual(validateTargetPairRound(round), []);
    assert.equal(findTargetPairSolutions(round.values, round.target, round.operation).length, 1);
    assert.match(targetPairExplanation(round), new RegExp(`= ${round.target}\\.$`));
  }
});

test("Target Pair avoids visible quartet repeats during a short session", () => {
  const random = seededRandom(84);
  let recentKeys = [];
  for (let turn = 0; turn < 500; turn += 1) {
    const round = createTargetPairRound(random, recentKeys);
    const key = targetPairRoundKey(round);
    assert.ok(!recentKeys.includes(key), `reused ${key} too soon`);
    recentKeys = [...recentKeys, key].slice(-3);
  }
});
