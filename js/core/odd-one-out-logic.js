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

export function createRound(blueprint, random = Math.random) {
  if (!blueprint || blueprint.matches.length < 3 || blueprint.intruders.length < 1) {
    throw new Error("Odd One Out blueprint needs at least three matches and one intruder.");
  }

  const matches = shuffle(blueprint.matches, random).slice(0, 3);
  const oddChoice = shuffle(blueprint.intruders, random)[0];
  if (matches.some((choice) => choice.toLowerCase() === oddChoice.toLowerCase())) {
    throw new Error(`Odd One Out blueprint '${blueprint.id}' contains an overlapping choice.`);
  }

  return {
    blueprintId: blueprint.id,
    difficulty: blueprint.difficulty,
    choices: shuffle([...matches, oddChoice], random),
    oddChoice,
    explanation: blueprint.explanation(oddChoice)
  };
}

export function chooseRound(blueprints, setting = "mixed", recentBlueprintIds = [], random = Math.random) {
  const difficulty = chooseDifficulty(setting, random);
  const eligible = blueprints.filter((blueprint) => blueprint.difficulty === difficulty);
  const unseen = eligible.filter((blueprint) => !recentBlueprintIds.includes(blueprint.id));
  const candidates = unseen.length ? unseen : eligible;
  if (!candidates.length) throw new Error(`No Odd One Out rounds are available for difficulty ${difficulty}.`);
  return createRound(shuffle(candidates, random)[0], random);
}
