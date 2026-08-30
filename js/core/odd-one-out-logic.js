/** Pure, testable round selection for the procedural Odd One Out dataset. */
export const MIXED_MEDIUM_WEIGHT = 0.65;

export function shuffle(values, random = Math.random) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

export function chooseDifficulty(setting, random = Math.random) {
  if (setting === "medium") return 2;
  if (setting === "hard") return 3;
  return random() < MIXED_MEDIUM_WEIGHT ? 2 : 3;
}

function normalizeChoices(choices = []) {
  return new Set([...choices].map((choice) => choice.toLowerCase()));
}

function relationshipId(blueprint) {
  return blueprint.cooldownId ?? blueprint.id;
}

function canCreateRound(blueprint, excludedChoices) {
  const matches = blueprint.matches.filter((choice) => !excludedChoices.has(choice.toLowerCase()));
  const intruders = blueprint.intruders.filter((choice) => !excludedChoices.has(choice.toLowerCase()));
  return matches.length >= 3 && intruders.length >= 1;
}

function groupByRelationship(blueprints) {
  const groups = new Map();
  for (const blueprint of blueprints) {
    const id = relationshipId(blueprint);
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push(blueprint);
  }
  return [...groups.values()];
}

function chooseBlueprintFromRelationships(blueprints, random, excludedChoices = null) {
  const groups = groupByRelationship(blueprints)
    .map((variants) => excludedChoices
      ? variants.filter((blueprint) => canCreateRound(blueprint, excludedChoices))
      : variants)
    .filter((variants) => variants.length);

  if (!groups.length) return null;
  // A relationship gets one draw regardless of how many valid quartets its
  // bank can produce. Only after that do we choose a concrete combination.
  const variants = shuffle(groups, random)[0];
  return shuffle(variants, random)[0];
}

export function createRound(blueprint, random = Math.random, excludedChoices = []) {
  if (!blueprint || blueprint.matches.length < 3 || blueprint.intruders.length < 1) {
    throw new Error("Odd One Out blueprint needs at least three matches and one intruder.");
  }

  const excluded = normalizeChoices(excludedChoices);
  if (!canCreateRound(blueprint, excluded)) {
    throw new Error(`Odd One Out blueprint '${blueprint.id}' cannot avoid the recent visible labels.`);
  }

  const matches = shuffle(
    blueprint.matches.filter((choice) => !excluded.has(choice.toLowerCase())),
    random
  ).slice(0, 3);
  const oddChoice = shuffle(
    blueprint.intruders.filter((choice) => !excluded.has(choice.toLowerCase())),
    random
  )[0];
  if (matches.some((choice) => choice.toLowerCase() === oddChoice.toLowerCase())) {
    throw new Error(`Odd One Out blueprint '${blueprint.id}' contains an overlapping choice.`);
  }

  return {
    // `blueprintId` is the relationship cooldown key. A procedural source
    // may expose several valid card combinations for one relationship.
    blueprintId: relationshipId(blueprint),
    candidateId: blueprint.id,
    family: blueprint.family,
    difficulty: blueprint.difficulty,
    choices: shuffle([...matches, oddChoice], random),
    oddChoice,
    explanation: blueprint.explanation(oddChoice)
  };
}

export function chooseRound(
  blueprints,
  setting = "mixed",
  recentBlueprintIds = [],
  random = Math.random,
  recentFamilies = [],
  recentChoiceSets = []
) {
  const difficulty = chooseDifficulty(setting, random);
  const eligible = blueprints.filter((blueprint) => blueprint.difficulty === difficulty);
  const unseen = eligible.filter((blueprint) => !recentBlueprintIds.includes(relationshipId(blueprint)));
  const familyFresh = unseen.filter((blueprint) => !recentFamilies.includes(blueprint.family));
  const excludedChoices = normalizeChoices(recentChoiceSets.flat());

  // Prefer a fresh relationship from a fresh family and three-set-visible-label
  // cooldown. Relationship groups—not individual combinations—are sampled
  // uniformly, so a large curated bank never crowds out smaller relationships.
  // If the pool is too small, relax family avoidance first, then blueprint
  // avoidance, and only finally visible-label avoidance.
  for (const candidates of [familyFresh, unseen, eligible]) {
    const blueprint = chooseBlueprintFromRelationships(candidates, random, excludedChoices);
    if (blueprint) return createRound(blueprint, random, excludedChoices);
  }

  if (!eligible.length) throw new Error(`No Odd One Out rounds are available for difficulty ${difficulty}.`);
  return createRound(chooseBlueprintFromRelationships(eligible, random), random);
}
