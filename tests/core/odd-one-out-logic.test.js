import test from "node:test";
import assert from "node:assert/strict";
import { ODD_ONE_OUT_BLUEPRINTS, ODD_ONE_OUT_FAMILY_TARGETS } from "../../data/odd-one-out-knowledge.js";
import { chooseDifficulty, chooseRound, createRound } from "../../js/core/odd-one-out-logic.js";

const deterministicRandom = () => 0;

test("Odd One Out blueprints have valid reviewed relationship pools", () => {
  assert.ok(ODD_ONE_OUT_BLUEPRINTS.length >= 12);
  assert.ok(ODD_ONE_OUT_BLUEPRINTS.every((blueprint) => blueprint.difficulty === 2 || blueprint.difficulty === 3));
  assert.ok(ODD_ONE_OUT_BLUEPRINTS.every((blueprint) => blueprint.family in ODD_ONE_OUT_FAMILY_TARGETS));
  assert.ok(ODD_ONE_OUT_BLUEPRINTS.every((blueprint) => blueprint.matches.length >= 3));
  assert.ok(ODD_ONE_OUT_BLUEPRINTS.every((blueprint) => blueprint.intruders.length >= 1));
  assert.ok(ODD_ONE_OUT_BLUEPRINTS.every((blueprint) => {
    const matches = new Set(blueprint.matches.map((word) => word.toLowerCase()));
    return blueprint.intruders.every((word) => !matches.has(word.toLowerCase()));
  }));
});

test("a generated round contains three matches, one intruder, and an explanation", () => {
  const blueprint = ODD_ONE_OUT_BLUEPRINTS.find(({ id }) => id === "mammals-and-fish");
  const round = createRound(blueprint, deterministicRandom);

  assert.equal(round.choices.length, 4);
  assert.equal(round.choices.filter((choice) => choice === round.oddChoice).length, 1);
  assert.equal(round.family, blueprint.family);
  assert.ok(round.explanation.includes(round.oddChoice));
  assert.ok(round.choices.filter((choice) => choice !== round.oddChoice).every((choice) => blueprint.matches.includes(choice)));
});

test("difficulty selection has only Medium and Hard, with Mixed weighted toward Medium", () => {
  assert.equal(chooseDifficulty("medium", deterministicRandom), 2);
  assert.equal(chooseDifficulty("hard", deterministicRandom), 3);
  assert.equal(chooseDifficulty("mixed", deterministicRandom), 2);
  assert.equal(chooseDifficulty("mixed", () => 0.9), 3);
});

test("round selection honors difficulty and avoids recent relationships and families when possible", () => {
  const medium = chooseRound(ODD_ONE_OUT_BLUEPRINTS, "medium", ["mammals-and-fish"], deterministicRandom, ["animals"]);
  const hard = chooseRound(ODD_ONE_OUT_BLUEPRINTS, "hard", [], deterministicRandom);

  assert.equal(medium.difficulty, 2);
  assert.notEqual(medium.blueprintId, "mammals-and-fish");
  assert.notEqual(medium.family, "animals");
  assert.equal(hard.difficulty, 3);
});
