/**
 * Pure procedural rules for Number Gap.
 *
 * Each round contains four distinct positive integers and one unambiguous
 * two-card answer: either the widest or the closest numerical pair. The
 * displayed order is deliberately shuffled, so spotting the pair—not reading
 * a sorted list—is the game.
 */

export const NUMBER_GAP_TYPES = {
  largest: { id: "largest", label: "LARGEST GAP", instruction: "Tap the two numbers furthest apart." },
  smallest: { id: "smallest", label: "SMALLEST GAP", instruction: "Tap the two closest numbers." }
};

export const NUMBER_GAP_DIFFICULTIES = { medium: 2, hard: 3 };
export const NUMBER_GAP_MIXED_MEDIUM_WEIGHT = 0.65;
const MAX_ATTEMPTS = 160;

function randomInteger(minimum, maximum, random) {
  return minimum + Math.floor(random() * (maximum - minimum + 1));
}

export function shuffleNumberGapValues(values, random = Math.random) {
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }
  return shuffled;
}

export function chooseNumberGapDifficulty(setting, random = Math.random) {
  if (setting === "hard") return NUMBER_GAP_DIFFICULTIES.hard;
  if (setting === "medium") return NUMBER_GAP_DIFFICULTIES.medium;
  return random() < NUMBER_GAP_MIXED_MEDIUM_WEIGHT
    ? NUMBER_GAP_DIFFICULTIES.medium
    : NUMBER_GAP_DIFFICULTIES.hard;
}

function allPairs(values) {
  const pairs = [];
  for (let left = 0; left < values.length; left += 1) {
    for (let right = left + 1; right < values.length; right += 1) {
      pairs.push({ values: [values[left], values[right]], gap: Math.abs(values[left] - values[right]) });
    }
  }
  return pairs;
}

export function findNumberGapSolutions(values, type) {
  const pairs = allPairs(values);
  if (!pairs.length) return [];
  const targetGap = type.id === NUMBER_GAP_TYPES.largest.id
    ? Math.max(...pairs.map((pair) => pair.gap))
    : Math.min(...pairs.map((pair) => pair.gap));
  return pairs.filter((pair) => pair.gap === targetGap).map((pair) => pair.values);
}

function chooseType(difficulty) {
  // The widest gap is an approachable first pattern; closest-pair comparisons
  // become the harder variant when the values are not ordered on screen.
  return difficulty === NUMBER_GAP_DIFFICULTIES.medium
    ? NUMBER_GAP_TYPES.largest
    : NUMBER_GAP_TYPES.smallest;
}

function createValues(difficulty, random) {
  const [minimum, maximum] = difficulty === NUMBER_GAP_DIFFICULTIES.medium
    ? [1, 55]
    : [12, 125];
  const values = new Set();
  while (values.size < 4) values.add(randomInteger(minimum, maximum, random));
  return [...values];
}

export function numberGapRoundKey(round) {
  return [round.type.id, ...[...round.values].sort((left, right) => left - right)].join(":");
}

/**
 * Builds a fresh four-card Number Gap round. The unique-solution check matters
 * especially for smallest-gap rounds, where evenly spaced values could
 * otherwise produce a tie.
 */
export function createNumberGapRound(random = Math.random, recentKeys = [], setting = "mixed") {
  const difficulty = chooseNumberGapDifficulty(setting, random);
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const type = chooseType(difficulty);
    const values = createValues(difficulty, random);
    const solutions = findNumberGapSolutions(values, type);
    if (solutions.length !== 1) continue;
    const round = { type, difficulty, values: shuffleNumberGapValues(values, random), solution: solutions[0] };
    if (recentKeys.includes(numberGapRoundKey(round))) continue;
    if (!validateNumberGapRound(round).length) return round;
  }
  throw new Error("Number Gap could not create a fresh valid round.");
}

export function validateNumberGapRound(round = {}) {
  const errors = [];
  if (!Object.values(NUMBER_GAP_TYPES).includes(round.type)) errors.push("unknown gap type");
  if (![NUMBER_GAP_DIFFICULTIES.medium, NUMBER_GAP_DIFFICULTIES.hard].includes(round.difficulty)) errors.push("unknown difficulty");
  if (!Array.isArray(round.values) || round.values.length !== 4) errors.push("round needs four values");
  if (Array.isArray(round.values) && round.values.some((value) => !Number.isInteger(value) || value < 1)) errors.push("round values must be positive integers");
  if (new Set(round.values ?? []).size !== (round.values ?? []).length) errors.push("round has duplicate visible values");
  if (!Array.isArray(round.solution) || round.solution.length !== 2) errors.push("round needs a two-number solution");

  if (!errors.length) {
    const solutions = findNumberGapSolutions(round.values, round.type);
    if (solutions.length !== 1) errors.push("round needs exactly one valid pair");
    const declared = [...round.solution].sort((left, right) => left - right).join(":");
    const generated = [...solutions[0]].sort((left, right) => left - right).join(":");
    if (declared !== generated) errors.push("declared solution does not match the valid pair");
  }
  return errors;
}

export function numberGapExplanation(round) {
  const [lower, higher] = [...round.solution].sort((left, right) => left - right);
  return `${higher} and ${lower} are ${higher - lower} apart.`;
}
