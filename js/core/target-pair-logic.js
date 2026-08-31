/** Pure procedural logic for Number Play's Target Pair mode. */

const ADDITION = {
  id: "addition",
  symbol: "+",
  describe: "addition"
};

const MULTIPLICATION = {
  id: "multiplication",
  symbol: "×",
  describe: "multiplication"
};

export const TARGET_PAIR_OPERATIONS = [ADDITION, MULTIPLICATION];

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

function evaluate(left, right, operation) {
  return operation.id === ADDITION.id ? left + right : left * right;
}

export function findTargetPairSolutions(values, target, operation) {
  const solutions = [];
  for (let left = 0; left < values.length; left += 1) {
    for (let right = left + 1; right < values.length; right += 1) {
      if (evaluate(values[left], values[right], operation) === target) {
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

function createOperationRound(operation, random) {
  const minimum = operation.id === ADDITION.id ? 3 : 2;
  const maximum = operation.id === ADDITION.id ? 18 : 12;
  let first = randomInteger(minimum, maximum, random);
  let second = randomInteger(minimum, maximum, random);
  while (second === first) second = randomInteger(minimum, maximum, random);

  const target = evaluate(first, second, operation);
  const candidateMaximum = operation.id === ADDITION.id ? 30 : 18;
  const candidates = Array.from({ length: candidateMaximum - 1 }, (_, index) => index + 2);
  const values = addSafeDecoys([first, second], target, operation, candidates, random);

  if (values.length !== 4) throw new Error("Target Pair could not create four non-ambiguous choices.");
  return {
    operation,
    target,
    values: shuffleTargetPairValues(values, random),
    solution: [first, second]
  };
}

export function targetPairRoundKey(round) {
  return [round.operation.id, round.target, ...[...round.values].sort((left, right) => left - right)].join(":");
}

/**
 * Produces a round with exactly one unordered pair that reaches the target.
 * Recent keys are optional and prevent a short session from seeing the same
 * visible quartet again immediately.
 */
export function createTargetPairRound(random = Math.random, recentKeys = []) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const operation = random() < 0.65 ? ADDITION : MULTIPLICATION;
    const round = createOperationRound(operation, random);
    if (recentKeys.includes(targetPairRoundKey(round))) continue;
    const errors = validateTargetPairRound(round);
    if (!errors.length) return round;
  }
  throw new Error("Target Pair could not create a fresh valid round.");
}

export function validateTargetPairRound(round = {}) {
  const errors = [];
  if (!TARGET_PAIR_OPERATIONS.includes(round.operation)) errors.push("unknown operation");
  if (!Number.isInteger(round.target)) errors.push("target must be an integer");
  if (!Array.isArray(round.values) || round.values.length !== 4) errors.push("round needs four values");
  if (new Set(round.values).size !== round.values.length) errors.push("round has duplicate visible values");
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
  const [left, right] = [...round.solution].sort((first, second) => first - second);
  return `${left} ${round.operation.symbol} ${right} = ${round.target}.`;
}
