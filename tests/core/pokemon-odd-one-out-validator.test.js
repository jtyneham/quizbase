import test from "node:test";
import assert from "node:assert/strict";
import {
  POKEMON_ODD_ONE_OUT_BLUEPRINTS,
  POKEMON_ODD_ONE_OUT_FAMILY_TARGETS,
  POKEMON_ODD_ONE_OUT_ACTIVE_POOLS,
  POKEMON_ODD_ONE_OUT_ACTIVE_TERMS,
  POKEMON_ODD_ONE_OUT_FIRST_BATCH_POOLS,
  POKEMON_ODD_ONE_OUT_HARD_BATCH_POOLS,
  POKEMON_ODD_ONE_OUT_FINAL_RELATIONSHIP_POOLS,
} from "../../data/odd-one-out-pokemon-knowledge.js";
import { buildPokemonOddOneOutRoundBlueprints } from "../../js/core/pokemon-odd-one-out-round-builder.js";
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

test("the reviewed Pokémon content banks build many validated shared-engine combinations", () => {
  const { blueprints, rejectedCandidates } = buildPokemonOddOneOutRoundBlueprints({
    contracts: POKEMON_ODD_ONE_OUT_BLUEPRINTS,
    terms: POKEMON_ODD_ONE_OUT_ACTIVE_TERMS,
    pools: POKEMON_ODD_ONE_OUT_ACTIVE_POOLS
  });

  assert.ok(blueprints.length > POKEMON_ODD_ONE_OUT_ACTIVE_POOLS.length);
  assert.equal(POKEMON_ODD_ONE_OUT_FIRST_BATCH_POOLS.length, 6);
  assert.equal(POKEMON_ODD_ONE_OUT_HARD_BATCH_POOLS.length, 5);
  assert.equal(POKEMON_ODD_ONE_OUT_FINAL_RELATIONSHIP_POOLS.length, 4);
  assert.deepEqual(
    new Set(POKEMON_ODD_ONE_OUT_ACTIVE_POOLS.map((pool) => pool.blueprintId)),
    new Set(POKEMON_ODD_ONE_OUT_BLUEPRINTS.map((blueprint) => blueprint.id))
  );
  // Expanded banks intentionally contain some structurally plausible but
  // unfair trios. They must be reported here and never promoted to play.
  assert.ok(rejectedCandidates.length > 0);
  assert.ok(rejectedCandidates.every((candidate) => candidate.errors.length > 0));
  assert.ok(blueprints.every((blueprint) => blueprint.matches.length === 3 && blueprint.intruders.length === 1));
  assert.ok(blueprints.every((blueprint) => [2, 3].includes(blueprint.difficulty)));
  assert.ok(blueprints.every((blueprint) => blueprint.cooldownId));
  assert.ok(blueprints.every((blueprint) => /\nThe others are .+\.$/.test(blueprint.explanation())));
});

test("the pool builder generates every valid reviewed 3-versus-1 combination", () => {
  const contract = {
    id: "test-kind",
    family: "battle-moves",
    difficulty: "medium",
    relation: { field: "kind", operator: "equals" },
    protectedAttributes: []
  };
  const terms = [
    reviewedTerm("move-one", "Aurora Strike"),
    reviewedTerm("move-two", "Stone Rush"),
    reviewedTerm("move-three", "Tidal Blast"),
    reviewedTerm("move-four", "Volt Slash"),
    { ...reviewedTerm("ability-one", "Competitive"), kind: "ability" },
    { ...reviewedTerm("ability-two", "Levitate"), kind: "ability" }
  ];
  const { blueprints } = buildPokemonOddOneOutRoundBlueprints({
    contracts: [contract],
    terms,
    pools: [{
      id: "test-pool",
      blueprintId: contract.id,
      matchingTermIds: ["move-one", "move-two", "move-three", "move-four"],
      intruderTermIds: ["ability-one", "ability-two"],
      relationValue: "move",
      oddDescription: "an Ability",
      matchDescription: "Moves"
    }]
  });

  assert.equal(blueprints.length, 8);
  assert.ok(blueprints.every((blueprint) => blueprint.cooldownId === contract.id));
});
