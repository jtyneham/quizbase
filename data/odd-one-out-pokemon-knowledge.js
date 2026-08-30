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

export const POKEMON_ODD_ONE_OUT_ACTIVE_TERMS = [
  ...POKEMON_ODD_ONE_OUT_PILOT_TERMS,
  ...POKEMON_ODD_ONE_OUT_FIRST_BATCH_TERMS
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
    matchingTermIds: ["move-thunderbolt", "move-earthquake", "move-calm-mind"],
    intruderTermIds: ["ability-competitive"],
    relationValue: "move",
    oddDescription: "an Ability",
    matchDescription: "Moves"
  },
  {
    id: "pilot-pure-and-dual-type-species",
    blueprintId: "pure-and-dual-type-species",
    matchingTermIds: ["species-blastoise", "species-vaporeon", "species-milotic"],
    intruderTermIds: ["species-swampert"],
    relationValue: 1,
    oddDescription: "dual-typed",
    matchDescription: "pure Water-type Pokémon"
  },
  {
    id: "pilot-major-and-volatile-conditions",
    blueprintId: "major-and-volatile-conditions",
    matchingTermIds: ["condition-burn", "condition-poison", "condition-paralysis"],
    intruderTermIds: ["condition-confusion"],
    relationValue: "major",
    oddDescription: "a volatile condition",
    matchDescription: "major status conditions"
  },
  {
    id: "pilot-status-curing-berries",
    blueprintId: "status-curing-berries",
    matchingTermIds: ["item-pecha-berry", "item-cheri-berry", "item-rawst-berry"],
    intruderTermIds: ["item-oran-berry"],
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
    matchingTermIds: ["move-spark", "move-discharge", "move-wild-charge"],
    intruderTermIds: ["move-surf"],
    relationValue: "electric",
    oddDescription: "a Water-type Move",
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
    id: "pure-grass-and-dual-grass-species",
    blueprintId: "pure-and-dual-type-species",
    matchingTermIds: ["species-meganium", "species-sceptile", "species-serperior"],
    intruderTermIds: ["species-venusaur"],
    relationValue: 1,
    oddDescription: "dual-typed",
    matchDescription: "pure Grass-type Pokémon"
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
    matchingTermIds: ["type-fire", "type-electric", "type-poison"],
    intruderTermIds: ["type-flying"],
    relationValue: "ground",
    oddDescription: "not weak to Ground",
    matchDescription: "weak to Ground"
  }
];

/** The live pilot draws only from this reviewed, validation-gated batch. */
export const POKEMON_ODD_ONE_OUT_ACTIVE_POOLS = [
  ...POKEMON_ODD_ONE_OUT_PILOT_POOLS,
  ...POKEMON_ODD_ONE_OUT_FIRST_BATCH_POOLS
];
