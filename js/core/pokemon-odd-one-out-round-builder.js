import { validatePokemonOddOneOutCandidate } from "./pokemon-odd-one-out-validator.js";

function combinations(values, size) {
  if (size === 0) return [[]];
  if (values.length < size) return [];

  return values.flatMap((value, index) =>
    combinations(values.slice(index + 1), size - 1).map((tail) => [value, ...tail])
  );
}

/**
 * Converts approved Pokémon relationship pools into regular Odd One Out
 * blueprints. Data stays declarative: this builder is the only place that
 * creates a four-card set, and every candidate must pass the Pokémon
 * validation matrix before the shared game engine may select it.
 */
export function buildPokemonOddOneOutRoundBlueprints({ contracts = [], terms = [], pools = [] } = {}) {
  const termsById = new Map(terms.map((term) => [term.id, term]));
  const contractsById = new Map(contracts.map((contract) => [contract.id, contract]));
  const blueprints = [];
  const rejectedCandidates = [];

  for (const pool of pools) {
    const contract = contractsById.get(pool.blueprintId);
    const matchingTerms = pool.matchingTermIds.map((id) => termsById.get(id));
    const intruderTerms = pool.intruderTermIds.map((id) => termsById.get(id));

    if (!contract || matchingTerms.some((term) => !term) || intruderTerms.some((term) => !term)) {
      throw new Error(`Pokémon Odd One Out pool '${pool.id}' references incomplete reviewed data.`);
    }

    const candidatesBeforePool = blueprints.length;
    for (const matches of combinations(matchingTerms, 3)) {
      for (const oddTerm of intruderTerms) {
        const explanation = `${oddTerm.label} is ${pool.oddDescription}.\nThe others are ${pool.matchDescription}.`;
        const errors = validatePokemonOddOneOutCandidate({
          blueprint: contract,
          terms: [...matches, oddTerm],
          oddTermId: oddTerm.id,
          relationValue: pool.relationValue,
          explanation
        });
        const candidateId = `${pool.id}:${matches.map((term) => term.id).join("+")}:${oddTerm.id}`;

        if (errors.length) {
          rejectedCandidates.push({ id: candidateId, poolId: pool.id, errors });
          continue;
        }

        blueprints.push({
          id: candidateId,
          // Every combination of a relationship shares one cooldown, so a
          // rapid session cannot receive the same idea with a new quartet.
          cooldownId: contract.id,
          family: contract.family,
          difficulty: contract.difficulty === "hard" ? 3 : 2,
          matches: matches.map((term) => term.label),
          intruders: [oddTerm.label],
          explanation: () => explanation
        });
      }
    }

    if (blueprints.length === candidatesBeforePool) {
      throw new Error(`Pokémon Odd One Out pool '${pool.id}' has no valid reviewed candidates.`);
    }
  }

  return { blueprints, rejectedCandidates };
}
