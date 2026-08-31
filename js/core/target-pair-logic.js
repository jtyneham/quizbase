/**
 * Pure procedural logic for Number Play's Target Pair mode.
 *
 * Target Pair intentionally uses familiar, integer-only arithmetic. Its four
 * operations give a broad stream of fast rounds without turning the game into
 * a calculation exercise or relying on a hand-authored data pool.
 */

const ADDITION = { id: "addition", symbol: "+" };
const SUBTRACTION = { id: "subtraction", symbol: "−" };
const MULTIPLICATION = { id: "multiplication", symbol: "×" };
const DIVISION = { id: "division", symbol: "÷" };

export const TARGET_PAIR_OPERATIONS = [ADDITION, SUBTRACTION, MULTIPLICATION, DIVISION];
export const TARGET_PAIR_DIFFICULTIES = { medium: 2, hard: 3 };
export const TARGET_PAIR_MIXED_MEDIUM_WEIGHT = 0.65;
const MAX_ATTEMPTS = 160;

function randomInteger(minimum, maximum, random) {
  return minimum + Math.floor(random() * (maximum - minimum + 1));
}

export function shuffleTargetPairValues(values, random = Math.random) {
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }
  return shuffled;
}

/**
 * Treats a visible pair as unordered. For subtraction and division, the
 * larger number is always read first, which is both natural for players and
 * avoids a card's shuffled screen position changing the arithmetic result.
 */
function evaluatePair(first, second, operation) {
  const lower = Math.min(first, second);
  const higher = Math.max(first, second);
  if (operation.id === ADDITION.id) return first + second;
  if (operation.id === MULTIPLICATION.id) return first * second;
  if (operation.id === SUBTRACTION.id) return higher - lower;
  return higher % lower === 0 ? higher / lower : null;
}

export function findTargetPairSolutions(values, target, operation) {
  const solutions = [];
  for (let left = 0; left < values.length; left += 1) {
    for (let right = left + 1; right < values.length; right += 1) {
      if (evaluatePair(values[left], values[right], operation) === target) {
        solutions.push([values[left], values[right]]);
      }
    }
  }
  return solutions;
}

function addSafeDecoys(values, target, operation, candidates, random) {
  const result = [...values];
  for (const candidate of shuffleTargetPairValues(candidates, random)) {
    if (result.length === 4) break;
    if (result.includes(candidate)) continue;
    const proposed = [...result, candidate];
    if (findTargetPairSolutions(proposed, target, operation).length === 1) result.push(candidate);
  }
  return result;
}

export function chooseTargetPairDifficulty(setting, random = Math.random) {
  if (setting === "hard") return TARGET_PAIR_DIFFICULTIES.hard;
  if (setting === "medium") return TARGET_PAIR_DIFFICULTIES.medium;
  return random() < TARGET_PAIR_MIXED_MEDIUM_WEIGHT
    ? TARGET_PAIR_DIFFICULTIES.medium
    : TARGET_PAIR_DIFFICULTIES.hard;
}

function createAdditionOperands(difficulty, random) {
  const first = randomInteger(5, difficulty === 2 ? 24 : 45, random);
  let second = randomInteger(3, difficulty === 2 ? 20 : 38, random);
  while (second === first) second = randomInteger(3, difficulty === 2 ? 20 : 38, random);
  return [first, second];
}

function createSubtractionOperands(difficulty, random) {
  const lower = randomInteger(2, difficulty === 2 ? 16 : 34, random);
  const higher = randomInteger(lower + 3, difficulty === 2 ? 42 : 65, random);
  return [higher, lower];
}

function createMultiplicationOperands(difficulty, random) {
  const first = randomInteger(2, difficulty === 2 ? 9 : 14, random);
  let second = randomInteger(3, difficulty === 2 ? 10 : 15, random);
  while (second === first) second = randomInteger(3, difficulty === 2 ? 10 : 15, random);
  return [first, second];
}

function createDivisionOperands(difficulty, random) {
  const divisor = randomInteger(2, difficulty === 2 ? 8 : 12, random);
  const quotient = randomInteger(2, difficulty === 2 ? 10 : 14, random);
  return [divisor * quotient, divisor];
}

function operandsFor(operation, difficulty, random) {
  if (operation.id === ADDITION.id) return createAdditionOperands(difficulty, random);
  if (operation.id === SUBTRACTION.id) return createSubtractionOperands(difficulty, random);
  if (operation.id === MULTIPLICATION.id) return createMultiplicationOperands(difficulty, random);
  return createDivisionOperands(difficulty, random);
}

function candidateRangeFor(operation, difficulty) {
  if (operation.id === MULTIPLICATION.id) return [2, difficulty === 2 ? 12 : 18];
  if (operation.id === DIVISION.id) return [2, difficulty === 2 ? 45 : 72];
  return [2, difficulty === 2 ? 42 : 68];
}

function createOperationRound(operation, difficulty, random) {
  const solution = operandsFor(operation, difficulty, random);
  const target = evaluatePair(solution[0], solution[1], operation);
  const [minimum, maximum] = candidateRangeFor(operation, difficulty);
  const candidates = Array.from({ length: maximum - minimum + 1 }, (_, index) => index + minimum);
  const values = addSafeDecoys(solution, target, operation, candidates, random);

  if (values.length !== 4) throw new Error("Target Pair could not create four non-ambiguous choices.");
  return {
    operation,
    difficulty,
    target,
    values: shuffleTargetPairValues(values, random),
    solution
  };
}

export function targetPairRoundKey(round) {
  return [round.operation.id, round.target, ...[...round.values].sort((left, right) => left - right)].join(":");
}

function normaliseHistory(history) {
  // Accept the original array form so small integrations can keep using it.
  if (Array.isArray(history)) return { recentKeys: history, recentOperationIds: [] };
  return {
    recentKeys: history?.recentKeys ?? [],
    recentOperationIds: history?.recentOperationIds ?? []
  };
}

function chooseOperation(random, recentOperationIds) {
  const recent = new Set(recentOperationIds);
  const freshOperations = TARGET_PAIR_OPERATIONS.filter((operation) => !recent.has(operation.id));
  const candidates = freshOperations.length ? freshOperations : TARGET_PAIR_OPERATIONS;
  return candidates[Math.floor(random() * candidates.length)];
}

/**
 * Produces a round with exactly one unordered pair that reaches the target.
 * A session can supply recent exact visual keys and operation IDs. The game
 * layer keeps those short histories; this pure generator only enforces them.
 */
export function createTargetPairRound(random = Math.random, history = [], setting = "mixed") {
  const { recentKeys, recentOperationIds } = normaliseHistory(history);
  const difficulty = chooseTargetPairDifficulty(setting, random);
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const operation = chooseOperation(random, recentOperationIds);
    const round = createOperationRound(operation, difficulty, random);
    if (recentKeys.includes(targetPairRoundKey(round))) continue;
    const errors = validateTargetPairRound(round);
    if (!errors.length) return round;
  }
  throw new Error("Target Pair could not create a fresh valid round.");
}

export function validateTargetPairRound(round = {}) {
  const errors = [];
  if (!TARGET_PAIR_OPERATIONS.includes(round.operation)) errors.push("unknown operation");
  if (![TARGET_PAIR_DIFFICULTIES.medium, TARGET_PAIR_DIFFICULTIES.hard].includes(round.difficulty)) errors.push("unknown difficulty");
  if (!Number.isInteger(round.target) || round.target < 1) errors.push("target must be a positive integer");
  if (!Array.isArray(round.values) || round.values.length !== 4) errors.push("round needs four values");
  if (Array.isArray(round.values) && round.values.some((value) => !Number.isInteger(value) || value < 1)) errors.push("round values must be positive integers");
  if (new Set(round.values ?? []).size !== (round.values ?? []).length) errors.push("round has duplicate visible values");
  if (!Array.isArray(round.solution) || round.solution.length !== 2) errors.push("round needs a two-number solution");

  if (!errors.length) {
    const solutions = findTargetPairSolutions(round.values, round.target, round.operation);
    if (solutions.length !== 1) errors.push("round needs exactly one valid pair");
    const solutionKey = [...round.solution].sort((left, right) => left - right).join(":");
    const generatedKey = solutions[0]?.slice().sort((left, right) => left - right).join(":");
    if (solutionKey !== generatedKey) errors.push("declared solution does not match the valid pair");
  }
  return errors;
}

export function targetPairExplanation(round) {
  const [first, second] = round.operation.id === ADDITION.id || round.operation.id === MULTIPLICATION.id
    ? [...round.solution].sort((left, right) => left - right)
    : [...round.solution].sort((left, right) => right - left);
  return `${first} ${round.operation.symbol} ${second} = ${round.target}.`;
}
