/**
 * Pure round builder for Number Detective.
 *
 * The mode deliberately uses reviewed mathematical memberships rather than
 * arbitrary sequences: exactly three values satisfy one named rule and the
 * fourth demonstrably does not. That keeps every reveal defensible.
 */

export const NUMBER_DETECTIVE_DIFFICULTIES = { medium: 2, hard: 3 };
export const NUMBER_DETECTIVE_MIXED_MEDIUM_WEIGHT = 0.65;
const MAX_ATTEMPTS = 160;

function randomInteger(minimum, maximum, random) {
  return minimum + Math.floor(random() * (maximum - minimum + 1));
}

export function shuffleNumberDetectiveValues(values, random = Math.random) {
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }
  return shuffled;
}

function pickDistinct(values, count, random) {
  return shuffleNumberDetectiveValues(values, random).slice(0, count);
}

function isPerfectSquare(value) {
  return Number.isInteger(Math.sqrt(value));
}

function isPowerOfTwo(value) {
  return value > 0 && (value & (value - 1)) === 0;
}

function isPrime(value) {
  if (value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function isTriangular(value) {
  return isPerfectSquare((8 * value) + 1);
}

function membershipRound(random, { members, matches, oddMinimum, oddMaximum, explanation }) {
  const matchingValues = pickDistinct(members, 3, random);
  const oddCandidates = Array.from(
    { length: oddMaximum - oddMinimum + 1 },
    (_, index) => index + oddMinimum
  ).filter((value) => !matches(value) && !matchingValues.includes(value));
  const oddValue = oddCandidates[Math.floor(random() * oddCandidates.length)];
  return {
    values: shuffleNumberDetectiveValues([...matchingValues, oddValue], random),
    oddValue,
    explanation: explanation(oddValue)
  };
}

function multipleRound(random) {
  const base = randomInteger(3, 9, random);
  const start = randomInteger(2, 5, random);
  const step = randomInteger(1, 2, random);
  const matchingValues = [start, start + step, start + (step * 2)].map((factor) => factor * base);
  const oddCandidates = Array.from({ length: 70 }, (_, index) => index + 3)
    .filter((value) => value % base !== 0 && !matchingValues.includes(value));
  const oddValue = oddCandidates[Math.floor(random() * oddCandidates.length)];
  return {
    base,
    values: shuffleNumberDetectiveValues([...matchingValues, oddValue], random),
    oddValue,
    explanation: `${oddValue} is not a multiple of ${base}. The others are.`
  };
}

const FIBONACCI = [5, 8, 13, 21, 34, 55, 89];
const TRIANGULAR = [3, 6, 10, 15, 21, 28, 36, 45, 55, 66];
const CUBES = [8, 27, 64, 125];

export const NUMBER_DETECTIVE_PATTERNS = [
  {
    id: "multiples",
    difficulty: NUMBER_DETECTIVE_DIFFICULTIES.medium,
    matches: (value, round) => value % round.base === 0,
    create: multipleRound
  },
  {
    id: "perfect-squares",
    difficulty: NUMBER_DETECTIVE_DIFFICULTIES.medium,
    matches: isPerfectSquare,
    create: (random) => membershipRound(random, {
      members: [4, 9, 16, 25, 36, 49, 64, 81, 100],
      matches: isPerfectSquare,
      oddMinimum: 3,
      oddMaximum: 100,
      explanation: (oddValue) => `${oddValue} is not a perfect square. The others are.`
    })
  },
  {
    id: "powers-of-two",
    difficulty: NUMBER_DETECTIVE_DIFFICULTIES.medium,
    matches: isPowerOfTwo,
    create: (random) => membershipRound(random, {
      members: [4, 8, 16, 32, 64, 128],
      matches: isPowerOfTwo,
      oddMinimum: 3,
      oddMaximum: 130,
      explanation: (oddValue) => `${oddValue} is not a power of two. The others are.`
    })
  },
  {
    id: "prime-numbers",
    difficulty: NUMBER_DETECTIVE_DIFFICULTIES.hard,
    matches: isPrime,
    create: (random) => membershipRound(random, {
      members: [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97],
      matches: isPrime,
      oddMinimum: 10,
      oddMaximum: 99,
      explanation: (oddValue) => `${oddValue} is not prime. The others are.`
    })
  },
  {
    id: "fibonacci-numbers",
    difficulty: NUMBER_DETECTIVE_DIFFICULTIES.hard,
    matches: (value) => FIBONACCI.includes(value),
    create: (random) => membershipRound(random, {
      members: FIBONACCI,
      matches: (value) => FIBONACCI.includes(value),
      oddMinimum: 5,
      oddMaximum: 89,
      explanation: (oddValue) => `${oddValue} is not a Fibonacci number. The others are.`
    })
  },
  {
    id: "triangular-numbers",
    difficulty: NUMBER_DETECTIVE_DIFFICULTIES.hard,
    matches: isTriangular,
    create: (random) => membershipRound(random, {
      members: TRIANGULAR,
      matches: isTriangular,
      oddMinimum: 3,
      oddMaximum: 70,
      explanation: (oddValue) => `${oddValue} is not a triangular number. The others are.`
    })
  },
  {
    id: "perfect-cubes",
    difficulty: NUMBER_DETECTIVE_DIFFICULTIES.hard,
    matches: (value) => CUBES.includes(value),
    create: (random) => membershipRound(random, {
      members: CUBES,
      matches: (value) => CUBES.includes(value),
      oddMinimum: 8,
      oddMaximum: 125,
      explanation: (oddValue) => `${oddValue} is not a perfect cube. The others are.`
    })
  }
];

export function chooseNumberDetectiveDifficulty(setting, random = Math.random) {
  if (setting === "hard") return NUMBER_DETECTIVE_DIFFICULTIES.hard;
  if (setting === "medium") return NUMBER_DETECTIVE_DIFFICULTIES.medium;
  return random() < NUMBER_DETECTIVE_MIXED_MEDIUM_WEIGHT
    ? NUMBER_DETECTIVE_DIFFICULTIES.medium
    : NUMBER_DETECTIVE_DIFFICULTIES.hard;
}

function choosePattern(difficulty, random, recentPatternIds) {
  const candidates = NUMBER_DETECTIVE_PATTERNS.filter((pattern) => pattern.difficulty === difficulty);
  const recent = new Set(recentPatternIds);
  const fresh = candidates.filter((pattern) => !recent.has(pattern.id));
  const pool = fresh.length ? fresh : candidates;
  return pool[Math.floor(random() * pool.length)];
}

export function numberDetectiveRoundKey(round) {
  return [round.pattern.id, ...[...round.values].sort((left, right) => left - right)].join(":");
}

export function createNumberDetectiveRound(random = Math.random, history = {}, setting = "mixed") {
  const recentKeys = Array.isArray(history) ? history : history.recentKeys ?? [];
  const recentPatternIds = Array.isArray(history) ? [] : history.recentPatternIds ?? [];
  const difficulty = chooseNumberDetectiveDifficulty(setting, random);
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const pattern = choosePattern(difficulty, random, recentPatternIds);
    const round = { ...pattern.create(random), pattern, difficulty };
    if (recentKeys.includes(numberDetectiveRoundKey(round))) continue;
    if (!validateNumberDetectiveRound(round).length) return round;
  }
  throw new Error("Number Detective could not create a fresh valid round.");
}

export function validateNumberDetectiveRound(round = {}) {
  const errors = [];
  if (!NUMBER_DETECTIVE_PATTERNS.includes(round.pattern)) errors.push("unknown pattern");
  if (![NUMBER_DETECTIVE_DIFFICULTIES.medium, NUMBER_DETECTIVE_DIFFICULTIES.hard].includes(round.difficulty)) errors.push("unknown difficulty");
  if (!Array.isArray(round.values) || round.values.length !== 4) errors.push("round needs four values");
  if (Array.isArray(round.values) && round.values.some((value) => !Number.isInteger(value) || value < 1)) errors.push("round values must be positive integers");
  if (new Set(round.values ?? []).size !== (round.values ?? []).length) errors.push("round has duplicate visible values");
  if (!Number.isInteger(round.oddValue) || !(round.values ?? []).includes(round.oddValue)) errors.push("round needs a visible odd value");
  if (typeof round.explanation !== "string" || !round.explanation.trim()) errors.push("round needs an explanation");

  if (!errors.length) {
    const matching = round.values.filter((value) => round.pattern.matches(value, round));
    if (matching.length !== 3) errors.push("exactly three values must follow the pattern");
    if (round.pattern.matches(round.oddValue, round)) errors.push("declared odd value follows the pattern");
    const inferredOddValues = round.values.filter((value) => !round.pattern.matches(value, round));
    if (inferredOddValues.length !== 1 || inferredOddValues[0] !== round.oddValue) errors.push("declared odd value is not unique");
  }
  return errors;
}
