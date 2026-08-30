/**
 * Design-time data contract for the future Pokémon Odd One Out edition.
 *
 * This is deliberately not connected to a route or the player-facing Odd One
 * Out pool yet. It describes the approved curation structure so Pokémon data
 * can be reviewed and tested before any themed game is introduced.
 *
 * Source policy: use PokeAPI for structured candidate data, then cross-check
 * nuanced facts against a reputable Pokémon reference. Ship only the static,
 * reviewed result; the game must never call an external Pokémon API at runtime.
 */

export const POKEMON_ODD_ONE_OUT_DATA_VERSION = 1;

export const POKEMON_ODD_ONE_OUT_FAMILY_TARGETS = {
  "battle-moves": { medium: 4, hard: 5 },
  "ability-mechanics": { medium: 1, hard: 3 },
  "species-typing": { medium: 2, hard: 1 },
  "species-classification": { medium: 1, hard: 2 },
  "evolution-mechanics": { medium: 2, hard: 2 },
  "type-matchups": { medium: 2, hard: 1 },
  "status-and-battle-conditions": { medium: 2, hard: 1 },
  "berries-and-items": { medium: 1, hard: 2 }
};

/**
 * A future curation record has this shape:
 *
 * {
 *   id: "move-thunderbolt",
 *   label: "Thunderbolt",
 *   kind: "move",
 *   mainSeries: true,
 *   modernRule: "current-main-series",
 *   familiarity: "general", // or "deep"
 *   displayReviewed: true,
 *   reviewStatus: "approved",
 *   sources: {
 *     primary: "pokeapi",
 *     crossChecks: ["pokemon-db"],
 *     verifiedAt: "2026-08-30"
 *   },
 *   facts: {
 *     type: "electric",
 *     damageClass: "special",
 *     fixedBasePower: 90
 *   }
 * }
 *
 * `facts` contains only the fields a reviewed term needs. A blueprint's
 * `relation.field` and `protectedAttributes` state which facts matter for a
 * given relationship. This keeps the content explicit and avoids inferring
 * player-facing answers from a loose, unreviewed Pokémon dump.
 */

export const POKEMON_ODD_ONE_OUT_BLUEPRINTS = [
  {
    id: "moves-and-abilities",
    family: "battle-moves",
    difficulty: "medium",
    relation: { field: "kind", operator: "equals" },
    protectedAttributes: [
      { field: "type", minimumDistinctMatches: 3 },
      { field: "damageClass", minimumDistinctMatches: 2 }
    ]
  },
  {
    id: "damaging-and-status-moves",
    family: "battle-moves",
    difficulty: "medium",
    relation: { field: "damageClass", operator: "equals" },
    protectedAttributes: [
      { field: "type", minimumDistinctMatches: 3 },
      { field: "effectGroup", minimumDistinctMatches: 2 }
    ]
  },
  {
    id: "same-type-moves",
    family: "battle-moves",
    difficulty: "medium",
    relation: { field: "type", operator: "equals" },
    protectedAttributes: [
      { field: "damageClass", minimumDistinctMatches: 2 },
      { field: "fixedBasePower", minimumDistinctMatches: 2 }
    ]
  },
  {
    id: "move-damage-class",
    family: "battle-moves",
    difficulty: "hard",
    relation: { field: "damageClass", operator: "equals" },
    protectedAttributes: [
      { field: "type", minimumDistinctMatches: 3 },
      { field: "fixedBasePower", minimumDistinctMatches: 2 }
    ]
  },
  {
    id: "fixed-base-power",
    family: "battle-moves",
    difficulty: "hard",
    relation: { field: "fixedBasePower", operator: "equals" },
    protectedAttributes: [
      { field: "type", minimumDistinctMatches: 3 },
      { field: "damageClass", minimumDistinctMatches: 2 },
      { field: "effectGroup", minimumDistinctMatches: 2 }
    ],
    restrictions: ["fixed-power-damaging-moves-only"]
  },
  {
    id: "positive-priority-moves",
    family: "battle-moves",
    difficulty: "hard",
    relation: { field: "priorityClass", operator: "equals" },
    protectedAttributes: [
      { field: "type", minimumDistinctMatches: 3 },
      { field: "fixedBasePower", minimumDistinctMatches: 2 }
    ]
  },
  {
    id: "accuracy-lowering-moves",
    family: "battle-moves",
    difficulty: "medium",
    relation: { field: "effectGroup", operator: "equals" },
    protectedAttributes: [
      { field: "type", minimumDistinctMatches: 3 },
      { field: "damageClass", minimumDistinctMatches: 2 }
    ]
  },
  {
    id: "type-immunity-abilities",
    family: "ability-mechanics",
    difficulty: "hard",
    relation: { field: "effectGroup", operator: "equals" },
    protectedAttributes: [
      { field: "blockedType", minimumDistinctMatches: 3 },
      { field: "introductionGeneration", minimumDistinctMatches: 2 }
    ]
  },
  {
    id: "status-prevention-abilities",
    family: "ability-mechanics",
    difficulty: "hard",
    relation: { field: "effectGroup", operator: "equals" },
    protectedAttributes: [
      { field: "blockedCondition", minimumDistinctMatches: 3 },
      { field: "introductionGeneration", minimumDistinctMatches: 2 }
    ]
  },
  {
    id: "contact-punishing-abilities",
    family: "ability-mechanics",
    difficulty: "hard",
    relation: { field: "effectGroup", operator: "equals" },
    protectedAttributes: [
      { field: "contactEffect", minimumDistinctMatches: 3 },
      { field: "introductionGeneration", minimumDistinctMatches: 2 }
    ]
  },
  {
    id: "pure-and-dual-type-species",
    family: "species-typing",
    difficulty: "medium",
    relation: { field: "typeCount", operator: "equals" },
    protectedAttributes: [
      { field: "primaryType", minimumDistinctMatches: 1 },
      { field: "evolutionFamily", minimumDistinctMatches: 3 },
      { field: "introductionGeneration", minimumDistinctMatches: 2 }
    ]
  },
  {
    id: "baby-pokemon-classification",
    family: "species-classification",
    difficulty: "medium",
    relation: { field: "speciesClass", operator: "equals" },
    protectedAttributes: [
      { field: "evolutionFamily", minimumDistinctMatches: 3 },
      { field: "introductionGeneration", minimumDistinctMatches: 2 }
    ]
  },
  {
    id: "pseudo-legendary-evolution-stage",
    family: "species-classification",
    difficulty: "hard",
    relation: { field: "evolutionStage", operator: "equals" },
    protectedAttributes: [
      { field: "typeKey", minimumDistinctMatches: 3 },
      { field: "introductionGeneration", minimumDistinctMatches: 2 }
    ]
  },
  {
    id: "evolution-method",
    family: "evolution-mechanics",
    difficulty: "medium",
    relation: { field: "evolutionMethod", operator: "equals" },
    protectedAttributes: [
      { field: "primaryType", minimumDistinctMatches: 3 },
      { field: "evolutionFamily", minimumDistinctMatches: 3 }
    ]
  },
  {
    id: "branched-evolution-lines",
    family: "evolution-mechanics",
    difficulty: "hard",
    relation: { field: "evolutionLineShape", operator: "equals" },
    protectedAttributes: [
      { field: "primaryType", minimumDistinctMatches: 3 },
      { field: "introductionGeneration", minimumDistinctMatches: 2 }
    ]
  },
  {
    id: "type-weaknesses",
    family: "type-matchups",
    difficulty: "medium",
    relation: { field: "weakToType", operator: "includes" },
    protectedAttributes: [
      { field: "typeCategory", minimumDistinctMatches: 3 }
    ]
  },
  {
    id: "major-and-volatile-conditions",
    family: "status-and-battle-conditions",
    difficulty: "medium",
    relation: { field: "conditionClass", operator: "equals" },
    protectedAttributes: [
      { field: "conditionEffect", minimumDistinctMatches: 3 }
    ]
  },
  {
    id: "evolution-enabling-held-items",
    family: "berries-and-items",
    difficulty: "hard",
    relation: { field: "evolutionItem", operator: "equals" },
    protectedAttributes: [
      { field: "itemEffectGroup", minimumDistinctMatches: 3 },
      { field: "evolutionMethod", minimumDistinctMatches: 2 }
    ]
  },
  {
    id: "status-curing-berries",
    family: "berries-and-items",
    difficulty: "hard",
    relation: { field: "itemEffectGroup", operator: "equals" },
    protectedAttributes: [
      { field: "curedCondition", minimumDistinctMatches: 3 }
    ]
  }
];
