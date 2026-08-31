import test from "node:test";
import assert from "node:assert/strict";
import {
  createTargetPairRound,
  findTargetPairSolutions,
  TARGET_PAIR_OPERATIONS,
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
  const seenOperations = new Set();
  for (let turn = 0; turn < 2_000; turn += 1) {
    const round = createTargetPairRound(random);
    assert.deepEqual(validateTargetPairRound(round), []);
    assert.equal(findTargetPairSolutions(round.values, round.target, round.operation).length, 1);
    assert.match(targetPairExplanation(round), new RegExp(`= ${round.target}\\.$`));
    seenOperations.add(round.operation.id);
  }
  assert.deepEqual(seenOperations, new Set(TARGET_PAIR_OPERATIONS.map((operation) => operation.id)));
});

test("Target Pair avoids recent visible quartets and operators during a short session", () => {
  const random = seededRandom(84);
  let history = { recentKeys: [], recentOperationIds: [] };
  for (let turn = 0; turn < 500; turn += 1) {
    const round = createTargetPairRound(random, history);
    const key = targetPairRoundKey(round);
    assert.ok(!history.recentKeys.includes(key), `reused ${key} too soon`);
    assert.ok(!history.recentOperationIds.includes(round.operation.id), `reused ${round.operation.id} too soon`);
    history = {
      recentKeys: [...history.recentKeys, key].slice(-8),
      recentOperationIds: [...history.recentOperationIds, round.operation.id].slice(-2)
    };
  }
});
