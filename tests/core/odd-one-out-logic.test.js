import test from "node:test";
import assert from "node:assert/strict";
import { ODD_ONE_OUT_BLUEPRINTS, ODD_ONE_OUT_FAMILY_TARGETS } from "../../data/odd-one-out-knowledge.js";
import { chooseDifficulty, chooseRound, createRound } from "../../js/core/odd-one-out-logic.js";

const deterministicRandom = () => 0;

test("Odd One Out blueprints have valid reviewed relationship pools", () => {
  assert.ok(ODD_ONE_OUT_BLUEPRINTS.length >= 90);
  assert.ok(ODD_ONE_OUT_BLUEPRINTS.every((blueprint) => blueprint.difficulty === 2 || blueprint.difficulty === 3));
  assert.ok(ODD_ONE_OUT_BLUEPRINTS.every((blueprint) => blueprint.family in ODD_ONE_OUT_FAMILY_TARGETS));
  assert.deepEqual(
    new Set(ODD_ONE_OUT_BLUEPRINTS.map((blueprint) => blueprint.family)),
    new Set(Object.keys(ODD_ONE_OUT_FAMILY_TARGETS))
  );
  assert.ok(ODD_ONE_OUT_BLUEPRINTS.every((blueprint) => blueprint.matches.length >= 3));
  assert.ok(ODD_ONE_OUT_BLUEPRINTS.every((blueprint) => blueprint.intruders.length >= 1));
  assert.ok(ODD_ONE_OUT_BLUEPRINTS.every((blueprint) => {
    const matches = new Set(blueprint.matches.map((word) => word.toLowerCase()));
    return blueprint.intruders.every((word) => !matches.has(word.toLowerCase()));
  }));
  assert.ok(ODD_ONE_OUT_BLUEPRINTS.every((blueprint) =>
    blueprint.intruders.every((odd) => /\nThe others are .+\.$/.test(blueprint.explanation(odd)))
  ));
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

test("round selection cools down a whole relationship when it has several candidate combinations", () => {
  const blueprints = [
    {
      id: "same-relationship-candidate-a",
      cooldownId: "shared-relationship",
      family: "first",
      difficulty: 2,
      matches: ["Oak", "Birch", "Maple"],
      intruders: ["Salmon"],
      explanation: () => ""
    },
    {
      id: "same-relationship-candidate-b",
      cooldownId: "shared-relationship",
      family: "first",
      difficulty: 2,
      matches: ["Pine", "Willow", "Cedar"],
      intruders: ["Trout"],
      explanation: () => ""
    },
    {
      id: "fresh-relationship",
      family: "second",
      difficulty: 2,
      matches: ["Mercury", "Venus", "Mars"],
      intruders: ["Tulip"],
      explanation: () => ""
    }
  ];

  const round = chooseRound(blueprints, "medium", ["shared-relationship"], deterministicRandom);

  assert.equal(round.candidateId, "fresh-relationship");
  assert.equal(round.blueprintId, "fresh-relationship");
});

test("round selection gives each relationship equal weight despite uneven combination banks", () => {
  const blueprints = [
    ...Array.from({ length: 40 }, (_, index) => ({
      id: `dense-${index}`,
      cooldownId: "dense-relationship",
      family: "first",
      difficulty: 2,
      matches: [`Oak ${index}`, `Birch ${index}`, `Maple ${index}`],
      intruders: [`Salmon ${index}`],
      explanation: () => ""
    })),
    {
      id: "small",
      cooldownId: "small-relationship",
      family: "second",
      difficulty: 2,
      matches: ["Mercury", "Venus", "Mars"],
      intruders: ["Tulip"],
      explanation: () => ""
    }
  ];
  let state = 123456789;
  const random = () => {
    state = (state * 48271) % 2147483647;
    return state / 2147483647;
  };
  let smallRelationshipCount = 0;

  for (let index = 0; index < 500; index += 1) {
    if (chooseRound(blueprints, "medium", [], random).blueprintId === "small-relationship") {
      smallRelationshipCount += 1;
    }
  }

  assert.ok(smallRelationshipCount > 190 && smallRelationshipCount < 310, smallRelationshipCount);
});

test("round selection avoids labels shown in the previous visible sets when possible", () => {
  const blueprints = [
    {
      id: "blocked-by-labels",
      family: "first",
      difficulty: 2,
      matches: ["Dolphin", "Whale", "Seal"],
      intruders: ["Shark"],
      explanation: () => ""
    },
    {
      id: "label-fresh",
      family: "second",
      difficulty: 2,
      matches: ["Maple", "Birch", "Willow"],
      intruders: ["Pine"],
      explanation: () => ""
    }
  ];
  const recentChoiceSets = [["Dolphin", "Whale", "Seal", "Shark"]];
  const round = chooseRound(blueprints, "medium", [], deterministicRandom, [], recentChoiceSets);

  assert.equal(round.blueprintId, "label-fresh");
  assert.ok(round.choices.every((choice) => !recentChoiceSets.flat().includes(choice)));
});
