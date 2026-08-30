import test from "node:test";
import assert from "node:assert/strict";
import {
  POKEMON_ODD_ONE_OUT_BLUEPRINTS,
  POKEMON_ODD_ONE_OUT_FAMILY_TARGETS
} from "../../data/odd-one-out-pokemon-knowledge.js";
import {
  findSurfaceGiveaway,
  validatePokemonOddOneOutCandidate,
  validatePokemonOddOneOutRecord
} from "../../js/core/pokemon-odd-one-out-validator.js";

function reviewedTerm(id, label, facts = {}) {
  return {
    id,
    label,
    kind: "move",
    mainSeries: true,
    modernRule: "current-main-series",
    familiarity: "general",
    displayReviewed: true,
    reviewStatus: "approved",
    sources: { primary: "pokeapi", crossChecks: ["pokemon-db"], verifiedAt: "2026-08-30" },
    facts
  };
}

test("Pokémon Odd One Out blueprint contract stays internally complete", () => {
  assert.equal(POKEMON_ODD_ONE_OUT_BLUEPRINTS.length, 19);
  assert.equal(new Set(POKEMON_ODD_ONE_OUT_BLUEPRINTS.map((blueprint) => blueprint.id)).size, POKEMON_ODD_ONE_OUT_BLUEPRINTS.length);
  assert.ok(POKEMON_ODD_ONE_OUT_BLUEPRINTS.every((blueprint) => blueprint.family in POKEMON_ODD_ONE_OUT_FAMILY_TARGETS));
  assert.ok(POKEMON_ODD_ONE_OUT_BLUEPRINTS.every((blueprint) => ["medium", "hard"].includes(blueprint.difficulty)));
  assert.ok(POKEMON_ODD_ONE_OUT_BLUEPRINTS.every((blueprint) => blueprint.relation?.field && blueprint.relation?.operator));
  assert.ok(POKEMON_ODD_ONE_OUT_BLUEPRINTS.every((blueprint) => blueprint.protectedAttributes?.length));
});

test("a reviewed record requires main-series scope, provenance, review, and player-fit metadata", () => {
  const valid = reviewedTerm("move-aurora-strike", "Aurora Strike", { type: "ice" });
  assert.deepEqual(validatePokemonOddOneOutRecord(valid), []);

  const invalid = { ...valid, mainSeries: false, sources: { primary: "pokeapi" }, displayReviewed: false };
  assert.deepEqual(validatePokemonOddOneOutRecord(invalid), [
    "term is not marked main-series eligible",
    "display has not been reviewed",
    "missing verified date"
  ]);
});

test("surface giveaway detection rejects three labels with a conspicuous shared word", () => {
  assert.equal(findSurfaceGiveaway(["Poke Ball", "Great Ball", "Ultra Ball", "Potion"]), "ball");
  assert.equal(findSurfaceGiveaway(["Pecha Berry", "Cheri Berry", "Rawst Berry", "Oran Berry"]), null);
});

test("candidate validation accepts one intended relationship with mixed protected traits", () => {
  const blueprint = POKEMON_ODD_ONE_OUT_BLUEPRINTS.find(({ id }) => id === "fixed-base-power");
  const terms = [
    reviewedTerm("move-aurora-strike", "Aurora Strike", { type: "ice", damageClass: "special", fixedBasePower: 90, effectGroup: "direct" }),
    reviewedTerm("move-stone-rush", "Stone Rush", { type: "rock", damageClass: "physical", fixedBasePower: 90, effectGroup: "recoil" }),
    reviewedTerm("move-volt-slash", "Volt Slash", { type: "electric", damageClass: "physical", fixedBasePower: 90, effectGroup: "priority" }),
    reviewedTerm("move-tidal-blast", "Tidal Blast", { type: "water", damageClass: "special", fixedBasePower: 100, effectGroup: "spread" })
  ];

  assert.deepEqual(validatePokemonOddOneOutCandidate({
    blueprint,
    terms,
    oddTermId: "move-tidal-blast",
    relationValue: 90,
    explanation: "Tidal Blast is a 100-power Move.\nThe others are 90-power Moves."
  }), []);
});

test("candidate validation rejects a competing protected three-versus-one pattern", () => {
  const blueprint = POKEMON_ODD_ONE_OUT_BLUEPRINTS.find(({ id }) => id === "fixed-base-power");
  const terms = [
    reviewedTerm("move-fire-one", "Ember One", { type: "fire", damageClass: "special", fixedBasePower: 90, effectGroup: "direct" }),
    reviewedTerm("move-fire-two", "Flame Two", { type: "fire", damageClass: "physical", fixedBasePower: 90, effectGroup: "recoil" }),
    reviewedTerm("move-fire-three", "Blaze Three", { type: "fire", damageClass: "physical", fixedBasePower: 90, effectGroup: "priority" }),
    reviewedTerm("move-water-one", "Tidal One", { type: "water", damageClass: "special", fixedBasePower: 100, effectGroup: "spread" })
  ];

  const errors = validatePokemonOddOneOutCandidate({
    blueprint,
    terms,
    oddTermId: "move-water-one",
    relationValue: 90,
    explanation: "Tidal One is a 100-power Move.\nThe others are 90-power Moves."
  });

  assert.ok(errors.includes("protected attribute 'type' is not varied enough across matching terms"));
});

test("candidate validation enforces the approved two-line explanation format", () => {
  const blueprint = POKEMON_ODD_ONE_OUT_BLUEPRINTS.find(({ id }) => id === "fixed-base-power");
  const terms = [
    reviewedTerm("move-one", "Aurora Strike", { type: "ice", damageClass: "special", fixedBasePower: 90, effectGroup: "direct" }),
    reviewedTerm("move-two", "Stone Rush", { type: "rock", damageClass: "physical", fixedBasePower: 90, effectGroup: "recoil" }),
    reviewedTerm("move-three", "Volt Slash", { type: "electric", damageClass: "physical", fixedBasePower: 90, effectGroup: "priority" }),
    reviewedTerm("move-four", "Tidal Blast", { type: "water", damageClass: "special", fixedBasePower: 100, effectGroup: "spread" })
  ];

  const errors = validatePokemonOddOneOutCandidate({
    blueprint,
    terms,
    oddTermId: "move-four",
    relationValue: 90,
    explanation: "Tidal Blast has a different power."
  });

  assert.ok(errors.includes("explanation must use the approved two-line format"));
});
