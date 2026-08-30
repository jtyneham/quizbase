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
    facts: { type: "electric", damageClass: "special", fixedBasePower: 90 }
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
    facts: {
      typeCount: 1,
      primaryType: "water",
      evolutionFamily: "eevee",
      evolutionMethod: "stone",
      introductionGeneration: 1
    }
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

function approvedFirstBatchTerm({ id, label, kind, facts, primary, crossCheck }) {
  return {
    id,
    label,
    kind,
    mainSeries: true,
    modernRule: "current-main-series",
    familiarity: "general",
    displayReviewed: true,
    reviewStatus: "approved",
    sources: {
      primary,
      crossChecks: [crossCheck],
      verifiedAt: "2026-08-30"
    },
    facts
  };
}

/**
 * First playable expansion batch. These are deliberately broad, familiar
 * concepts; deeper mechanics remain reserved for a later Hard pass. Every
 * fact below is static reviewed data, never a runtime request to PokeAPI.
 */
export const POKEMON_ODD_ONE_OUT_FIRST_BATCH_TERMS = [
  approvedFirstBatchTerm({
    id: "move-will-o-wisp", label: "Will-O-Wisp", kind: "move",
    facts: { type: "fire", damageClass: "status", effectGroup: "burn" },
    primary: "https://pokeapi.co/api/v2/move/will-o-wisp/", crossCheck: "https://pokemondb.net/move/will-o-wisp"
  }),
  approvedFirstBatchTerm({
    id: "move-thunder-wave", label: "Thunder Wave", kind: "move",
    facts: { type: "electric", damageClass: "status", effectGroup: "paralysis" },
    primary: "https://pokeapi.co/api/v2/move/thunder-wave/", crossCheck: "https://pokemondb.net/move/thunder-wave"
  }),
  approvedFirstBatchTerm({
    id: "move-leech-seed", label: "Leech Seed", kind: "move",
    facts: { type: "grass", damageClass: "status", effectGroup: "residual-drain" },
    primary: "https://pokeapi.co/api/v2/move/leech-seed/", crossCheck: "https://pokemondb.net/move/leech-seed"
  }),
  approvedFirstBatchTerm({
    id: "move-spark", label: "Spark", kind: "move",
    facts: { type: "electric", damageClass: "physical", fixedBasePower: 65, effectGroup: "paralysis-chance" },
    primary: "https://pokeapi.co/api/v2/move/spark/", crossCheck: "https://pokemondb.net/move/spark"
  }),
  approvedFirstBatchTerm({
    id: "move-discharge", label: "Discharge", kind: "move",
    facts: { type: "electric", damageClass: "special", fixedBasePower: 80, effectGroup: "paralysis-chance" },
    primary: "https://pokeapi.co/api/v2/move/discharge/", crossCheck: "https://pokemondb.net/move/discharge"
  }),
  approvedFirstBatchTerm({
    id: "move-wild-charge", label: "Wild Charge", kind: "move",
    facts: { type: "electric", damageClass: "physical", fixedBasePower: 90, effectGroup: "recoil" },
    primary: "https://pokeapi.co/api/v2/move/wild-charge/", crossCheck: "https://pokemondb.net/move/wild-charge"
  }),
  approvedFirstBatchTerm({
    id: "move-surf", label: "Surf", kind: "move",
    facts: { type: "water", damageClass: "special", fixedBasePower: 90, effectGroup: "direct" },
    primary: "https://pokeapi.co/api/v2/move/surf/", crossCheck: "https://pokemondb.net/move/surf"
  }),
  approvedFirstBatchTerm({
    id: "move-sand-attack", label: "Sand Attack", kind: "move",
    facts: { type: "ground", damageClass: "status", effectGroup: "accuracy-lowering" },
    primary: "https://pokeapi.co/api/v2/move/sand-attack/", crossCheck: "https://pokemondb.net/move/sand-attack"
  }),
  approvedFirstBatchTerm({
    id: "move-octazooka", label: "Octazooka", kind: "move",
    facts: { type: "water", damageClass: "special", fixedBasePower: 65, effectGroup: "accuracy-lowering" },
    primary: "https://pokeapi.co/api/v2/move/octazooka/", crossCheck: "https://pokemondb.net/move/octazooka"
  }),
  approvedFirstBatchTerm({
    id: "move-mirror-shot", label: "Mirror Shot", kind: "move",
    facts: { type: "steel", damageClass: "special", fixedBasePower: 65, effectGroup: "accuracy-lowering" },
    primary: "https://pokeapi.co/api/v2/move/mirror-shot/", crossCheck: "https://pokemondb.net/move/mirror-shot"
  }),
  approvedFirstBatchTerm({
    id: "move-acid-spray", label: "Acid Spray", kind: "move",
    facts: { type: "poison", damageClass: "special", fixedBasePower: 40, effectGroup: "special-defense-lowering" },
    primary: "https://pokeapi.co/api/v2/move/acid-spray/", crossCheck: "https://pokemondb.net/move/acid-spray"
  }),
  approvedFirstBatchTerm({
    id: "species-meganium", label: "Meganium", kind: "species",
    facts: { typeCount: 1, primaryType: "grass", evolutionFamily: "chikorita", introductionGeneration: 2 },
    primary: "https://pokeapi.co/api/v2/pokemon/meganium/", crossCheck: "https://pokemondb.net/pokedex/meganium"
  }),
  approvedFirstBatchTerm({
    id: "species-sceptile", label: "Sceptile", kind: "species",
    facts: { typeCount: 1, primaryType: "grass", evolutionFamily: "treecko", introductionGeneration: 3 },
    primary: "https://pokeapi.co/api/v2/pokemon/sceptile/", crossCheck: "https://pokemondb.net/pokedex/sceptile"
  }),
  approvedFirstBatchTerm({
    id: "species-serperior", label: "Serperior", kind: "species",
    facts: { typeCount: 1, primaryType: "grass", evolutionFamily: "snivy", introductionGeneration: 5 },
    primary: "https://pokeapi.co/api/v2/pokemon/serperior/", crossCheck: "https://pokemondb.net/pokedex/serperior"
  }),
  approvedFirstBatchTerm({
    id: "species-venusaur", label: "Venusaur", kind: "species",
    facts: { typeCount: 2, primaryType: "grass", evolutionFamily: "bulbasaur", introductionGeneration: 1 },
    primary: "https://pokeapi.co/api/v2/pokemon/venusaur/", crossCheck: "https://pokemondb.net/pokedex/venusaur"
  }),
  approvedFirstBatchTerm({
    id: "species-pichu", label: "Pichu", kind: "species",
    facts: { speciesClass: "baby", evolutionFamily: "pikachu", introductionGeneration: 2 },
    primary: "https://pokeapi.co/api/v2/pokemon/pichu/", crossCheck: "https://pokemondb.net/pokedex/pichu"
  }),
  approvedFirstBatchTerm({
    id: "species-cleffa", label: "Cleffa", kind: "species",
    facts: { speciesClass: "baby", evolutionFamily: "clefairy", introductionGeneration: 2 },
    primary: "https://pokeapi.co/api/v2/pokemon/cleffa/", crossCheck: "https://pokemondb.net/pokedex/cleffa"
  }),
  approvedFirstBatchTerm({
    id: "species-riolu", label: "Riolu", kind: "species",
    facts: { speciesClass: "baby", evolutionFamily: "lucario", introductionGeneration: 4 },
    primary: "https://pokeapi.co/api/v2/pokemon/riolu/", crossCheck: "https://pokemondb.net/pokedex/riolu"
  }),
  approvedFirstBatchTerm({
    id: "species-pikachu", label: "Pikachu", kind: "species",
    facts: { speciesClass: "regular", evolutionFamily: "pikachu", introductionGeneration: 1 },
    primary: "https://pokeapi.co/api/v2/pokemon/pikachu/", crossCheck: "https://pokemondb.net/pokedex/pikachu"
  }),
  approvedFirstBatchTerm({
    id: "species-ninetales", label: "Ninetales", kind: "species",
    facts: { primaryType: "fire", evolutionFamily: "vulpix", evolutionMethod: "stone", introductionGeneration: 1 },
    primary: "https://pokeapi.co/api/v2/pokemon/ninetales/", crossCheck: "https://pokemondb.net/pokedex/ninetales"
  }),
  approvedFirstBatchTerm({
    id: "species-victreebel", label: "Victreebel", kind: "species",
    facts: { primaryType: "grass", evolutionFamily: "bellsprout", evolutionMethod: "stone", introductionGeneration: 1 },
    primary: "https://pokeapi.co/api/v2/pokemon/victreebel/", crossCheck: "https://pokemondb.net/pokedex/victreebel"
  }),
  approvedFirstBatchTerm({
    id: "species-charmeleon", label: "Charmeleon", kind: "species",
    facts: { primaryType: "fire", evolutionFamily: "charmander", evolutionMethod: "level", introductionGeneration: 1 },
    primary: "https://pokeapi.co/api/v2/pokemon/charmeleon/", crossCheck: "https://pokemondb.net/pokedex/charmeleon"
  }),
  approvedFirstBatchTerm({
    id: "type-fire", label: "Fire", kind: "type",
    facts: { weakToType: ["water", "ground", "rock"], typeCategory: "fire" },
    primary: "https://pokeapi.co/api/v2/type/fire/", crossCheck: "https://pokemondb.net/type/fire"
  }),
  approvedFirstBatchTerm({
    id: "type-electric", label: "Electric", kind: "type",
    facts: { weakToType: ["ground"], typeCategory: "electric" },
    primary: "https://pokeapi.co/api/v2/type/electric/", crossCheck: "https://pokemondb.net/type/electric"
  }),
  approvedFirstBatchTerm({
    id: "type-poison", label: "Poison", kind: "type",
    facts: { weakToType: ["ground", "psychic"], typeCategory: "poison" },
    primary: "https://pokeapi.co/api/v2/type/poison/", crossCheck: "https://pokemondb.net/type/poison"
  }),
  approvedFirstBatchTerm({
    id: "type-flying", label: "Flying", kind: "type",
    facts: { weakToType: ["electric", "ice", "rock"], typeCategory: "flying" },
    primary: "https://pokeapi.co/api/v2/type/flying/", crossCheck: "https://pokemondb.net/type/flying"
  })
];

function approvedHardBatchTerm({ id, label, kind, facts, primary, crossCheck }) {
  return approvedFirstBatchTerm({ id, label, kind, facts, primary, crossCheck });
}

/**
 * Hard adds deeper but stable game mechanics. It never relies on story, a
 * particular map, or generation-specific trivia; each pool still needs one
 * unambiguous 3-versus-1 answer under the shared validator.
 */
export const POKEMON_ODD_ONE_OUT_HARD_BATCH_TERMS = [
  approvedHardBatchTerm({
    id: "move-shadow-ball", label: "Shadow Ball", kind: "move",
    facts: { type: "ghost", damageClass: "special", fixedBasePower: 80, effectGroup: "special-defense-chance" },
    primary: "https://pokeapi.co/api/v2/move/shadow-ball/", crossCheck: "https://pokemondb.net/move/shadow-ball"
  }),
  approvedHardBatchTerm({
    id: "move-crunch", label: "Crunch", kind: "move",
    facts: { type: "dark", damageClass: "physical", fixedBasePower: 80, effectGroup: "defense-chance" },
    primary: "https://pokeapi.co/api/v2/move/crunch/", crossCheck: "https://pokemondb.net/move/crunch"
  }),
  approvedHardBatchTerm({
    id: "move-flash-cannon", label: "Flash Cannon", kind: "move",
    facts: { type: "steel", damageClass: "special", fixedBasePower: 80, effectGroup: "special-defense-chance" },
    primary: "https://pokeapi.co/api/v2/move/flash-cannon/", crossCheck: "https://pokemondb.net/move/flash-cannon"
  }),
  approvedHardBatchTerm({
    id: "move-air-slash", label: "Air Slash", kind: "move",
    facts: { type: "flying", damageClass: "special", fixedBasePower: 75, effectGroup: "flinch-chance" },
    primary: "https://pokeapi.co/api/v2/move/air-slash/", crossCheck: "https://pokemondb.net/move/air-slash"
  }),
  approvedHardBatchTerm({
    id: "move-extreme-speed", label: "Extreme Speed", kind: "move",
    facts: { type: "normal", damageClass: "physical", fixedBasePower: 80, priorityClass: "positive", effectGroup: "direct" },
    primary: "https://pokeapi.co/api/v2/move/extreme-speed/", crossCheck: "https://pokemondb.net/move/extreme-speed"
  }),
  approvedHardBatchTerm({
    id: "move-aqua-jet", label: "Aqua Jet", kind: "move",
    facts: { type: "water", damageClass: "physical", fixedBasePower: 40, priorityClass: "positive", effectGroup: "direct" },
    primary: "https://pokeapi.co/api/v2/move/aqua-jet/", crossCheck: "https://pokemondb.net/move/aqua-jet"
  }),
  approvedHardBatchTerm({
    id: "move-bullet-punch", label: "Bullet Punch", kind: "move",
    facts: { type: "steel", damageClass: "physical", fixedBasePower: 40, priorityClass: "positive", effectGroup: "direct" },
    primary: "https://pokeapi.co/api/v2/move/bullet-punch/", crossCheck: "https://pokemondb.net/move/bullet-punch"
  }),
  approvedHardBatchTerm({
    id: "move-tackle", label: "Tackle", kind: "move",
    facts: { type: "normal", damageClass: "physical", fixedBasePower: 40, priorityClass: "normal", effectGroup: "direct" },
    primary: "https://pokeapi.co/api/v2/move/tackle/", crossCheck: "https://pokemondb.net/move/tackle"
  }),
  approvedHardBatchTerm({
    id: "ability-levitate", label: "Levitate", kind: "ability",
    facts: { effectGroup: "type-immunity", blockedType: "ground", introductionGeneration: 3 },
    primary: "https://pokeapi.co/api/v2/ability/levitate/", crossCheck: "https://pokemondb.net/ability/levitate"
  }),
  approvedHardBatchTerm({
    id: "ability-water-absorb", label: "Water Absorb", kind: "ability",
    facts: { effectGroup: "type-immunity", blockedType: "water", introductionGeneration: 3 },
    primary: "https://pokeapi.co/api/v2/ability/water-absorb/", crossCheck: "https://pokemondb.net/ability/water-absorb"
  }),
  approvedHardBatchTerm({
    id: "ability-sap-sipper", label: "Sap Sipper", kind: "ability",
    facts: { effectGroup: "type-immunity", blockedType: "grass", introductionGeneration: 5 },
    primary: "https://pokeapi.co/api/v2/ability/sap-sipper/", crossCheck: "https://pokemondb.net/ability/sap-sipper"
  }),
  approvedHardBatchTerm({
    id: "ability-intimidate", label: "Intimidate", kind: "ability",
    facts: { effectGroup: "attack-lowering", introductionGeneration: 3 },
    primary: "https://pokeapi.co/api/v2/ability/intimidate/", crossCheck: "https://pokemondb.net/ability/intimidate"
  }),
  approvedHardBatchTerm({
    id: "ability-static", label: "Static", kind: "ability",
    facts: { effectGroup: "contact-punishment", contactEffect: "paralysis", introductionGeneration: 3 },
    primary: "https://pokeapi.co/api/v2/ability/static/", crossCheck: "https://pokemondb.net/ability/static"
  }),
  approvedHardBatchTerm({
    id: "ability-flame-body", label: "Flame Body", kind: "ability",
    facts: { effectGroup: "contact-punishment", contactEffect: "burn", introductionGeneration: 3 },
    primary: "https://pokeapi.co/api/v2/ability/flame-body/", crossCheck: "https://pokemondb.net/ability/flame-body"
  }),
  approvedHardBatchTerm({
    id: "ability-iron-barbs", label: "Iron Barbs", kind: "ability",
    facts: { effectGroup: "contact-punishment", contactEffect: "damage", introductionGeneration: 5 },
    primary: "https://pokeapi.co/api/v2/ability/iron-barbs/", crossCheck: "https://pokemondb.net/ability/iron-barbs"
  }),
  approvedHardBatchTerm({
    id: "species-dratini", label: "Dratini", kind: "species",
    facts: { evolutionStage: "base", typeKey: "dragon", introductionGeneration: 1 },
    primary: "https://pokeapi.co/api/v2/pokemon/dratini/", crossCheck: "https://pokemondb.net/pokedex/dratini"
  }),
  approvedHardBatchTerm({
    id: "species-beldum", label: "Beldum", kind: "species",
    facts: { evolutionStage: "base", typeKey: "steel-psychic", introductionGeneration: 3 },
    primary: "https://pokeapi.co/api/v2/pokemon/beldum/", crossCheck: "https://pokemondb.net/pokedex/beldum"
  }),
  approvedHardBatchTerm({
    id: "species-gible", label: "Gible", kind: "species",
    facts: { evolutionStage: "base", typeKey: "dragon-ground", introductionGeneration: 4 },
    primary: "https://pokeapi.co/api/v2/pokemon/gible/", crossCheck: "https://pokemondb.net/pokedex/gible"
  }),
  approvedHardBatchTerm({
    id: "species-dragonair", label: "Dragonair", kind: "species",
    facts: { evolutionStage: "middle", typeKey: "dragon", introductionGeneration: 1 },
    primary: "https://pokeapi.co/api/v2/pokemon/dragonair/", crossCheck: "https://pokemondb.net/pokedex/dragonair"
  }),
  approvedHardBatchTerm({
    id: "item-lum-berry", label: "Lum Berry", kind: "item",
    facts: { itemEffectGroup: "status-cure", curedCondition: "all-major-conditions" },
    primary: "https://pokeapi.co/api/v2/item/lum-berry/", crossCheck: "https://pokemondb.net/item/lum-berry"
  }),
  approvedHardBatchTerm({
    id: "item-chesto-berry", label: "Chesto Berry", kind: "item",
    facts: { itemEffectGroup: "status-cure", curedCondition: "sleep" },
    primary: "https://pokeapi.co/api/v2/item/chesto-berry/", crossCheck: "https://pokemondb.net/item/chesto-berry"
  }),
  approvedHardBatchTerm({
    id: "item-sitrus-berry", label: "Sitrus Berry", kind: "item",
    facts: { itemEffectGroup: "hp-recovery" },
    primary: "https://pokeapi.co/api/v2/item/sitrus-berry/", crossCheck: "https://pokemondb.net/item/sitrus-berry"
  })
];

/**
 * Additional reviewed members for existing relationships. These are banks,
 * not fixed questions: the shared builder chooses every valid trio/intruder
 * combination and the validation matrix excludes any unfair quartet.
 */
export const POKEMON_ODD_ONE_OUT_COMBINATORIAL_TERMS = [
  approvedFirstBatchTerm({
    id: "move-flamethrower", label: "Flamethrower", kind: "move",
    facts: { type: "fire", damageClass: "special", fixedBasePower: 90, effectGroup: "burn-chance" },
    primary: "https://pokeapi.co/api/v2/move/flamethrower/", crossCheck: "https://pokemondb.net/move/flamethrower"
  }),
  approvedFirstBatchTerm({
    id: "move-close-combat", label: "Close Combat", kind: "move",
    facts: { type: "fighting", damageClass: "physical", fixedBasePower: 120, effectGroup: "self-defense-drop" },
    primary: "https://pokeapi.co/api/v2/move/close-combat/", crossCheck: "https://pokemondb.net/move/close-combat"
  }),
  approvedFirstBatchTerm({
    id: "move-recover", label: "Recover", kind: "move",
    facts: { type: "normal", damageClass: "status", effectGroup: "hp-recovery" },
    primary: "https://pokeapi.co/api/v2/move/recover/", crossCheck: "https://pokemondb.net/move/recover"
  }),
  approvedFirstBatchTerm({
    id: "move-thunder-punch", label: "Thunder Punch", kind: "move",
    facts: { type: "electric", damageClass: "physical", fixedBasePower: 75, effectGroup: "paralysis-chance" },
    primary: "https://pokeapi.co/api/v2/move/thunder-punch/", crossCheck: "https://pokemondb.net/move/thunder-punch"
  }),
  approvedFirstBatchTerm({
    id: "move-sucker-punch", label: "Sucker Punch", kind: "move",
    facts: { type: "dark", damageClass: "physical", fixedBasePower: 70, priorityClass: "positive", effectGroup: "conditional-direct" },
    primary: "https://pokeapi.co/api/v2/move/sucker-punch/", crossCheck: "https://pokemondb.net/move/sucker-punch"
  }),
  approvedFirstBatchTerm({
    id: "move-mach-punch", label: "Mach Punch", kind: "move",
    facts: { type: "fighting", damageClass: "physical", fixedBasePower: 40, priorityClass: "positive", effectGroup: "direct" },
    primary: "https://pokeapi.co/api/v2/move/mach-punch/", crossCheck: "https://pokemondb.net/move/mach-punch"
  }),
  approvedFirstBatchTerm({
    id: "move-slash", label: "Slash", kind: "move",
    facts: { type: "normal", damageClass: "physical", fixedBasePower: 70, priorityClass: "normal", effectGroup: "high-critical-hit" },
    primary: "https://pokeapi.co/api/v2/move/slash/", crossCheck: "https://pokemondb.net/move/slash"
  }),
  approvedFirstBatchTerm({
    id: "condition-sleep", label: "Sleep", kind: "battle-condition",
    facts: { conditionClass: "major", conditionEffect: "sleep-action-prevention" },
    primary: "https://pokeapi.co/api/v2/move-ailment/sleep/", crossCheck: "https://bulbapedia.bulbagarden.net/wiki/Status_condition"
  }),
  approvedFirstBatchTerm({
    id: "condition-freeze", label: "Freeze", kind: "battle-condition",
    facts: { conditionClass: "major", conditionEffect: "freeze-action-prevention" },
    primary: "https://pokeapi.co/api/v2/move-ailment/freeze/", crossCheck: "https://bulbapedia.bulbagarden.net/wiki/Status_condition"
  }),
  approvedFirstBatchTerm({
    id: "condition-infatuation", label: "Infatuation", kind: "battle-condition",
    facts: { conditionClass: "volatile", conditionEffect: "infatuation-action-prevention" },
    primary: "https://pokeapi.co/api/v2/move-ailment/infatuation/", crossCheck: "https://bulbapedia.bulbagarden.net/wiki/Status_condition"
  }),
  approvedHardBatchTerm({
    id: "ability-flash-fire", label: "Flash Fire", kind: "ability",
    facts: { effectGroup: "type-immunity", blockedType: "fire", introductionGeneration: 3 },
    primary: "https://pokeapi.co/api/v2/ability/flash-fire/", crossCheck: "https://pokemondb.net/ability/flash-fire"
  }),
  approvedHardBatchTerm({
    id: "ability-motor-drive", label: "Motor Drive", kind: "ability",
    facts: { effectGroup: "type-immunity", blockedType: "electric", introductionGeneration: 4 },
    primary: "https://pokeapi.co/api/v2/ability/motor-drive/", crossCheck: "https://pokemondb.net/ability/motor-drive"
  }),
  approvedFirstBatchTerm({
    id: "type-rock", label: "Rock", kind: "type",
    facts: { weakToType: ["water", "grass", "fighting", "ground", "steel"], typeCategory: "rock" },
    primary: "https://pokeapi.co/api/v2/type/rock/", crossCheck: "https://pokemondb.net/type/rock"
  }),
  approvedFirstBatchTerm({
    id: "type-grass", label: "Grass", kind: "type",
    facts: { weakToType: ["fire", "ice", "poison", "flying", "bug"], typeCategory: "grass" },
    primary: "https://pokeapi.co/api/v2/type/grass/", crossCheck: "https://pokemondb.net/type/grass"
  })
];

export const POKEMON_ODD_ONE_OUT_ACTIVE_TERMS = [
  ...POKEMON_ODD_ONE_OUT_PILOT_TERMS,
  ...POKEMON_ODD_ONE_OUT_FIRST_BATCH_TERMS,
  ...POKEMON_ODD_ONE_OUT_HARD_BATCH_TERMS,
  ...POKEMON_ODD_ONE_OUT_COMBINATORIAL_TERMS
];

/**
 * Reviewed pilot relationship pools. The builder combines three matching
 * terms with an approved intruder, then lets the validation matrix decide
 * whether that four-card candidate is eligible for play. Future pools can
 * safely grow beyond these initial 3-versus-1 examples without copying round
 * objects or game logic into this data file.
 */
export const POKEMON_ODD_ONE_OUT_PILOT_POOLS = [
  {
    id: "pilot-moves-and-abilities",
    blueprintId: "moves-and-abilities",
    matchingTermIds: ["move-thunderbolt", "move-earthquake", "move-calm-mind", "move-flamethrower", "move-close-combat", "move-recover"],
    intruderTermIds: ["ability-competitive", "ability-levitate", "ability-intimidate"],
    relationValue: "move",
    oddDescription: "an Ability",
    matchDescription: "Moves"
  },
  {
    id: "pilot-pure-and-dual-type-species",
    blueprintId: "pure-and-dual-type-species",
    matchingTermIds: ["species-blastoise", "species-vaporeon", "species-milotic", "species-meganium", "species-sceptile", "species-serperior"],
    intruderTermIds: ["species-swampert", "species-venusaur"],
    relationValue: 1,
    oddDescription: "dual-typed",
    matchDescription: "pure-type Pokémon"
  },
  {
    id: "pilot-major-and-volatile-conditions",
    blueprintId: "major-and-volatile-conditions",
    matchingTermIds: ["condition-burn", "condition-poison", "condition-paralysis", "condition-sleep", "condition-freeze"],
    intruderTermIds: ["condition-confusion", "condition-infatuation"],
    relationValue: "major",
    oddDescription: "a volatile condition",
    matchDescription: "major status conditions"
  },
  {
    id: "pilot-status-curing-berries",
    blueprintId: "status-curing-berries",
    matchingTermIds: ["item-pecha-berry", "item-cheri-berry", "item-rawst-berry", "item-lum-berry", "item-chesto-berry"],
    intruderTermIds: ["item-oran-berry", "item-sitrus-berry"],
    relationValue: "status-cure",
    oddDescription: "an HP-restoring Berry",
    matchDescription: "status-curing Berries"
  }
];

export const POKEMON_ODD_ONE_OUT_FIRST_BATCH_POOLS = [
  {
    id: "status-moves-and-damaging-move",
    blueprintId: "damaging-and-status-moves",
    matchingTermIds: ["move-will-o-wisp", "move-thunder-wave", "move-leech-seed"],
    intruderTermIds: ["move-thunderbolt"],
    relationValue: "status",
    oddDescription: "a damaging Move",
    matchDescription: "status Moves"
  },
  {
    id: "electric-moves-and-water-move",
    blueprintId: "same-type-moves",
    matchingTermIds: ["move-spark", "move-discharge", "move-wild-charge", "move-thunderbolt", "move-thunder-punch"],
    intruderTermIds: ["move-surf", "move-flamethrower"],
    relationValue: "electric",
    oddDescription: "not an Electric-type Move",
    matchDescription: "Electric-type Moves"
  },
  {
    id: "accuracy-lowering-moves",
    blueprintId: "accuracy-lowering-moves",
    matchingTermIds: ["move-sand-attack", "move-octazooka", "move-mirror-shot"],
    intruderTermIds: ["move-acid-spray"],
    relationValue: "accuracy-lowering",
    oddDescription: "a Special Defense-lowering Move",
    matchDescription: "accuracy-lowering Moves"
  },
  {
    id: "baby-pokemon-and-regular-species",
    blueprintId: "baby-pokemon-classification",
    matchingTermIds: ["species-pichu", "species-cleffa", "species-riolu"],
    intruderTermIds: ["species-pikachu"],
    relationValue: "baby",
    oddDescription: "not a baby Pokémon",
    matchDescription: "baby Pokémon"
  },
  {
    id: "stone-evolution-and-level-evolution",
    blueprintId: "evolution-method",
    matchingTermIds: ["species-vaporeon", "species-ninetales", "species-victreebel"],
    intruderTermIds: ["species-charmeleon"],
    relationValue: "stone",
    oddDescription: "a Pokémon that evolves by level",
    matchDescription: "Pokémon that evolve with Evolution Stones"
  },
  {
    id: "ground-weak-and-ground-immune-types",
    blueprintId: "type-weaknesses",
    matchingTermIds: ["type-fire", "type-electric", "type-poison", "type-rock"],
    intruderTermIds: ["type-flying", "type-grass"],
    relationValue: "ground",
    oddDescription: "not weak to Ground",
    matchDescription: "weak to Ground"
  }
];

export const POKEMON_ODD_ONE_OUT_HARD_BATCH_POOLS = [
  {
    id: "eighty-power-moves-and-seventy-five-power-move",
    blueprintId: "fixed-base-power",
    matchingTermIds: ["move-shadow-ball", "move-crunch", "move-flash-cannon"],
    intruderTermIds: ["move-air-slash"],
    relationValue: 80,
    oddDescription: "a 75-power Move",
    matchDescription: "80-power Moves"
  },
  {
    id: "positive-priority-moves-and-normal-priority-move",
    blueprintId: "positive-priority-moves",
    matchingTermIds: ["move-extreme-speed", "move-aqua-jet", "move-bullet-punch", "move-sucker-punch", "move-mach-punch"],
    intruderTermIds: ["move-tackle", "move-slash"],
    relationValue: "positive",
    oddDescription: "a normal-priority Move",
    matchDescription: "positive-priority Moves"
  },
  {
    id: "type-immunity-abilities-and-stat-lowering-ability",
    blueprintId: "type-immunity-abilities",
    matchingTermIds: ["ability-levitate", "ability-water-absorb", "ability-sap-sipper", "ability-flash-fire", "ability-motor-drive"],
    intruderTermIds: ["ability-intimidate", "ability-static"],
    relationValue: "type-immunity",
    oddDescription: "a stat-lowering Ability",
    matchDescription: "Abilities that block a type"
  },
  {
    id: "contact-punishing-abilities-and-type-immunity-ability",
    blueprintId: "contact-punishing-abilities",
    matchingTermIds: ["ability-static", "ability-flame-body", "ability-iron-barbs"],
    intruderTermIds: ["ability-levitate"],
    relationValue: "contact-punishment",
    oddDescription: "an Ability that blocks Ground-type Moves",
    matchDescription: "Abilities that punish contact"
  },
  {
    id: "base-stage-pseudo-legendaries-and-middle-stage",
    blueprintId: "pseudo-legendary-evolution-stage",
    matchingTermIds: ["species-dratini", "species-beldum", "species-gible"],
    intruderTermIds: ["species-dragonair"],
    relationValue: "base",
    oddDescription: "a middle-stage Pokémon",
    matchDescription: "first-stage pseudo-legendary Pokémon"
  },
];

/** The live pilot draws only from this reviewed, validation-gated batch. */
export const POKEMON_ODD_ONE_OUT_ACTIVE_POOLS = [
  ...POKEMON_ODD_ONE_OUT_PILOT_POOLS,
  ...POKEMON_ODD_ONE_OUT_FIRST_BATCH_POOLS,
  ...POKEMON_ODD_ONE_OUT_HARD_BATCH_POOLS
];
