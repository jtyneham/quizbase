import test from "node:test";
import assert from "node:assert/strict";
import { ODD_ONE_OUT_BLUEPRINTS } from "../../data/odd-one-out-knowledge.js";
import { chooseRound } from "../../js/core/odd-one-out-logic.js";

const BLUEPRINT_COOLDOWN = 12;
const FAMILY_COOLDOWN = 9;
const VISIBLE_SET_COOLDOWN = 3;
const SESSION_LENGTH = 800;

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function normalizedChoices(choiceSets) {
  return new Set(choiceSets.flat().map((choice) => choice.toLowerCase()));
}

test("Odd One Out preserves long-session cooldowns without fallback", () => {
  for (const [setting, seed] of [["mixed", 101], ["medium", 102], ["hard", 103]]) {
    const random = seededRandom(seed);
    let recentBlueprintIds = [];
    let recentFamilies = [];
    let recentChoiceSets = [];

    for (let turn = 1; turn <= SESSION_LENGTH; turn += 1) {
      const round = chooseRound(
        ODD_ONE_OUT_BLUEPRINTS,
        setting,
        recentBlueprintIds,
        random,
        recentFamilies,
        recentChoiceSets
      );
      const visibleLabels = normalizedChoices(recentChoiceSets);

      assert.ok(
        !recentBlueprintIds.includes(round.blueprintId),
        `${setting} reused blueprint '${round.blueprintId}' on turn ${turn}`
      );
      assert.ok(
        !recentFamilies.includes(round.family),
        `${setting} reused family '${round.family}' on turn ${turn}`
      );
      assert.ok(
        round.choices.every((choice) => !visibleLabels.has(choice.toLowerCase())),
        `${setting} reused a visible label on turn ${turn}`
      );

      recentBlueprintIds = [...recentBlueprintIds, round.blueprintId].slice(-BLUEPRINT_COOLDOWN);
      recentFamilies = [...recentFamilies, round.family].slice(-FAMILY_COOLDOWN);
      recentChoiceSets = [...recentChoiceSets, round.choices].slice(-VISIBLE_SET_COOLDOWN);
    }
  }
});
