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

/**
 * Small, deliberately hand-reviewed pilot. It proves that the contract can
 * describe terms from several families without yet exposing a Pokémon edition
 * to players. Add future terms only after the same source and fairness review.
 */
export const POKEMON_ODD_ONE_OUT_PILOT_TERMS = [
  {
    id: "move-thunderbolt",
    label: "Thunderbolt",
    kind: "move",
    mainSeries: true,
    modernRule: "current-main-series",
    familiarity: "general",
    displayReviewed: true,
    reviewStatus: "approved",
    sources: {
      primary: "https://pokeapi.co/api/v2/move/thunderbolt/",
      crossChecks: ["https://pokemondb.net/move/thunderbolt"],
      verifiedAt: "2026-08-30"
    },
    facts: { type: "electric", damageClass: "special" }
  },
  {
    id: "move-earthquake",
    label: "Earthquake",
    kind: "move",
    mainSeries: true,
    modernRule: "current-main-series",
    familiarity: "general",
    displayReviewed: true,
    reviewStatus: "approved",
    sources: {
      primary: "https://pokeapi.co/api/v2/move/earthquake/",
      crossChecks: ["https://pokemondb.net/move/earthquake"],
      verifiedAt: "2026-08-30"
    },
    facts: { type: "ground", damageClass: "physical" }
  },
  {
    id: "move-calm-mind",
    label: "Calm Mind",
    kind: "move",
    mainSeries: true,
    modernRule: "current-main-series",
    familiarity: "general",
    displayReviewed: true,
    reviewStatus: "approved",
    sources: {
      primary: "https://pokeapi.co/api/v2/move/calm-mind/",
      crossChecks: ["https://pokemondb.net/move/calm-mind"],
      verifiedAt: "2026-08-30"
    },
    facts: { type: "psychic", damageClass: "status" }
  },
  {
    id: "ability-competitive",
    label: "Competitive",
    kind: "ability",
    mainSeries: true,
    modernRule: "current-main-series",
    familiarity: "deep",
    displayReviewed: true,
    reviewStatus: "approved",
    sources: {
      primary: "https://pokeapi.co/api/v2/ability/competitive/",
      crossChecks: ["https://pokemondb.net/ability/competitive"],
      verifiedAt: "2026-08-30"
    },
    facts: { introductionGeneration: 6 }
  },
  {
    id: "species-blastoise",
    label: "Blastoise",
    kind: "species",
    mainSeries: true,
    modernRule: "current-main-series",
    familiarity: "general",
    displayReviewed: true,
    reviewStatus: "approved",
    sources: {
      primary: "https://pokeapi.co/api/v2/pokemon/blastoise/",
      crossChecks: ["https://pokemondb.net/pokedex/blastoise"],
      verifiedAt: "2026-08-30"
    },
    facts: { typeCount: 1, primaryType: "water", evolutionFamily: "squirtle", introductionGeneration: 1 }
  },
  {
    id: "species-vaporeon",
    label: "Vaporeon",
    kind: "species",
    mainSeries: true,
    modernRule: "current-main-series",
    familiarity: "general",
    displayReviewed: true,
    reviewStatus: "approved",
    sources: {
      primary: "https://pokeapi.co/api/v2/pokemon/vaporeon/",
      crossChecks: ["https://pokemondb.net/pokedex/vaporeon"],
      verifiedAt: "2026-08-30"
    },
    facts: { typeCount: 1, primaryType: "water", evolutionFamily: "eevee", introductionGeneration: 1 }
  },
  {
    id: "species-milotic",
    label: "Milotic",
    kind: "species",
    mainSeries: true,
    modernRule: "current-main-series",
    familiarity: "general",
    displayReviewed: true,
    reviewStatus: "approved",
    sources: {
      primary: "https://pokeapi.co/api/v2/pokemon/milotic/",
      crossChecks: ["https://pokemondb.net/pokedex/milotic"],
      verifiedAt: "2026-08-30"
    },
    facts: { typeCount: 1, primaryType: "water", evolutionFamily: "feebas", introductionGeneration: 3 }
  },
  {
    id: "species-swampert",
    label: "Swampert",
    kind: "species",
    mainSeries: true,
    modernRule: "current-main-series",
    familiarity: "general",
    displayReviewed: true,
    reviewStatus: "approved",
    sources: {
      primary: "https://pokeapi.co/api/v2/pokemon/swampert/",
      crossChecks: ["https://pokemondb.net/pokedex/swampert"],
      verifiedAt: "2026-08-30"
    },
    facts: { typeCount: 2, primaryType: "water", evolutionFamily: "mudkip", introductionGeneration: 3 }
  },
  {
    id: "condition-burn",
    label: "Burn",
    kind: "battle-condition",
    mainSeries: true,
    modernRule: "current-main-series",
    familiarity: "general",
    displayReviewed: true,
    reviewStatus: "approved",
    sources: {
      primary: "https://pokeapi.co/api/v2/move-ailment/burn/",
      crossChecks: ["https://bulbapedia.bulbagarden.net/wiki/Status_condition"],
      verifiedAt: "2026-08-30"
    },
    facts: { conditionClass: "major", conditionEffect: "damage-and-attack-reduction" }
  },
  {
    id: "condition-poison",
    label: "Poison",
    kind: "battle-condition",
    mainSeries: true,
    modernRule: "current-main-series",
    familiarity: "general",
    displayReviewed: true,
    reviewStatus: "approved",
    sources: {
      primary: "https://pokeapi.co/api/v2/move-ailment/poison/",
      crossChecks: ["https://bulbapedia.bulbagarden.net/wiki/Status_condition"],
      verifiedAt: "2026-08-30"
    },
    facts: { conditionClass: "major", conditionEffect: "residual-damage" }
  },
  {
    id: "condition-paralysis",
    label: "Paralysis",
    kind: "battle-condition",
    mainSeries: true,
    modernRule: "current-main-series",
    familiarity: "general",
    displayReviewed: true,
    reviewStatus: "approved",
    sources: {
      primary: "https://pokeapi.co/api/v2/move-ailment/paralysis/",
      crossChecks: ["https://bulbapedia.bulbagarden.net/wiki/Status_condition"],
      verifiedAt: "2026-08-30"
    },
    facts: { conditionClass: "major", conditionEffect: "speed-reduction-and-action-failure" }
  },
  {
    id: "condition-confusion",
    label: "Confusion",
    kind: "battle-condition",
    mainSeries: true,
    modernRule: "current-main-series",
    familiarity: "general",
    displayReviewed: true,
    reviewStatus: "approved",
    sources: {
      primary: "https://pokeapi.co/api/v2/move-ailment/confusion/",
      crossChecks: ["https://bulbapedia.bulbagarden.net/wiki/Status_condition"],
      verifiedAt: "2026-08-30"
    },
    facts: { conditionClass: "volatile", conditionEffect: "self-damage-risk" }
  },
  {
    id: "item-pecha-berry",
    label: "Pecha Berry",
    kind: "item",
    mainSeries: true,
    modernRule: "current-main-series",
    familiarity: "general",
    displayReviewed: true,
    reviewStatus: "approved",
    sources: {
      primary: "https://pokeapi.co/api/v2/item/pecha-berry/",
      crossChecks: ["https://pokemondb.net/item/pecha-berry"],
      verifiedAt: "2026-08-30"
    },
    facts: { itemEffectGroup: "status-cure", curedCondition: "poison" }
  },
  {
    id: "item-cheri-berry",
    label: "Cheri Berry",
    kind: "item",
    mainSeries: true,
    modernRule: "current-main-series",
    familiarity: "general",
    displayReviewed: true,
    reviewStatus: "approved",
    sources: {
      primary: "https://pokeapi.co/api/v2/item/cheri-berry/",
      crossChecks: ["https://pokemondb.net/item/cheri-berry"],
      verifiedAt: "2026-08-30"
    },
    facts: { itemEffectGroup: "status-cure", curedCondition: "paralysis" }
  },
  {
    id: "item-rawst-berry",
    label: "Rawst Berry",
    kind: "item",
    mainSeries: true,
    modernRule: "current-main-series",
    familiarity: "general",
    displayReviewed: true,
    reviewStatus: "approved",
    sources: {
      primary: "https://pokeapi.co/api/v2/item/rawst-berry/",
      crossChecks: ["https://pokemondb.net/item/rawst-berry"],
      verifiedAt: "2026-08-30"
    },
    facts: { itemEffectGroup: "status-cure", curedCondition: "burn" }
  },
  {
    id: "item-oran-berry",
    label: "Oran Berry",
    kind: "item",
    mainSeries: true,
    modernRule: "current-main-series",
    familiarity: "general",
    displayReviewed: true,
    reviewStatus: "approved",
    sources: {
      primary: "https://pokeapi.co/api/v2/item/oran-berry/",
      crossChecks: ["https://pokemondb.net/item/oran-berry"],
      verifiedAt: "2026-08-30"
    },
    facts: { itemEffectGroup: "hp-recovery" }
  }
];

/**
 * Reviewed pilot rounds. They are data-review fixtures, not a player pool.
 * A future integration can only promote a candidate after the validator and
 * expanded playtesting accept it.
 */
export const POKEMON_ODD_ONE_OUT_PILOT_ROUNDS = [
  {
    id: "pilot-moves-and-abilities-01",
    blueprintId: "moves-and-abilities",
    termIds: ["move-thunderbolt", "move-earthquake", "move-calm-mind", "ability-competitive"],
    oddTermId: "ability-competitive",
    relationValue: "move",
    explanation: "Competitive is an Ability.\nThe others are Moves."
  },
  {
    id: "pilot-pure-and-dual-type-species-01",
    blueprintId: "pure-and-dual-type-species",
    termIds: ["species-blastoise", "species-vaporeon", "species-milotic", "species-swampert"],
    oddTermId: "species-swampert",
    relationValue: 1,
    explanation: "Swampert is dual-typed.\nThe others are pure Water-type Pokémon."
  },
  {
    id: "pilot-major-and-volatile-conditions-01",
    blueprintId: "major-and-volatile-conditions",
    termIds: ["condition-burn", "condition-poison", "condition-paralysis", "condition-confusion"],
    oddTermId: "condition-confusion",
    relationValue: "major",
    explanation: "Confusion is a volatile condition.\nThe others are major status conditions."
  },
  {
    id: "pilot-status-curing-berries-01",
    blueprintId: "status-curing-berries",
    termIds: ["item-pecha-berry", "item-cheri-berry", "item-rawst-berry", "item-oran-berry"],
    oddTermId: "item-oran-berry",
    relationValue: "status-cure",
    explanation: "Oran Berry is an HP-restoring Berry.\nThe others are status-curing Berries."
  }
];
