/**
 * Pure validation helpers for the future Pokémon Odd One Out content pool.
 *
 * These helpers deliberately have no route, DOM, or API dependency. They make
 * content review enforceable before Pokémon terms can reach a player-facing
 * procedural round.
 */

const ALLOWED_FAMILIARITIES = new Set(["general", "deep"]);
const ALLOWED_REVIEW_STATUSES = new Set(["approved", "rejected"]);

export function normalizePokemonOddOneOutLabel(label = "") {
  return label.trim().toLocaleLowerCase("en").replace(/[^a-z0-9]+/g, " ").trim();
}

function valueFor(record, field) {
  if (field in record) return record[field];
  return record.facts?.[field];
}

function distinctCount(records, field) {
  return new Set(records.map((record) => JSON.stringify(valueFor(record, field)))).size;
}

function matchesRelation(value, operator, relationValue) {
  if (operator === "includes") return Array.isArray(value) && value.includes(relationValue);
  return value === relationValue;
}

/**
 * Returns a visible word pattern that would make three labels mechanically
 * solvable (for example, "Ball" in Poké Ball / Great Ball / Ultra Ball), or
 * null when no such three-label pattern is found.
 */
export function findSurfaceGiveaway(labels = []) {
  const tokenCounts = new Map();

  for (const label of labels) {
    const uniqueTokens = new Set(normalizePokemonOddOneOutLabel(label).split(" ").filter((token) => token.length >= 4));
    for (const token of uniqueTokens) tokenCounts.set(token, (tokenCounts.get(token) ?? 0) + 1);
  }

  for (const [token, count] of tokenCounts) {
    if (count >= 3 && count < labels.length) return token;
  }
  return null;
}

/** Returns curation errors rather than throwing, so batch review can report all issues at once. */
export function validatePokemonOddOneOutRecord(record = {}) {
  const errors = [];

  if (!record.id) errors.push("missing id");
  if (!record.label?.trim()) errors.push("missing display label");
  if (!record.kind) errors.push("missing kind");
  if (record.mainSeries !== true) errors.push("term is not marked main-series eligible");
  if (record.modernRule !== "current-main-series") errors.push("term is not verified for the current main-series rule");
  if (!ALLOWED_FAMILIARITIES.has(record.familiarity)) errors.push("missing or invalid familiarity");
  if (record.displayReviewed !== true) errors.push("display has not been reviewed");
  if (!ALLOWED_REVIEW_STATUSES.has(record.reviewStatus)) errors.push("missing or invalid review status");
  if (!record.sources?.primary) errors.push("missing primary source");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.sources?.verifiedAt ?? "")) errors.push("missing verified date");
  if (!record.facts || typeof record.facts !== "object") errors.push("missing reviewed facts");

  return errors;
}

/**
 * Validates one reviewed four-card candidate against an approved blueprint.
 * `relationValue` is deliberately supplied per candidate: for example, one
 * fixed-power round might use 90 while another uses 60.
 */
export function validatePokemonOddOneOutCandidate({ blueprint, terms = [], oddTermId, relationValue, explanation } = {}) {
  const errors = [];

  if (!blueprint?.id) return ["missing blueprint"];
  if (terms.length !== 4) errors.push("a round needs exactly four terms");

  const labels = terms.map((term) => term.label ?? "");
  const normalizedLabels = labels.map(normalizePokemonOddOneOutLabel);
  if (new Set(normalizedLabels).size !== labels.length) errors.push("round contains duplicate visible labels");

  const giveaway = findSurfaceGiveaway(labels);
  if (giveaway) errors.push(`surface giveaway '${giveaway}' appears in three labels`);

  for (const term of terms) {
    for (const error of validatePokemonOddOneOutRecord(term)) errors.push(`${term.id ?? "unknown term"}: ${error}`);
  }

  const oddTerm = terms.find((term) => term.id === oddTermId);
  if (!oddTerm) errors.push("round is missing its declared odd term");

  if (!explanation) {
    errors.push("round is missing its reviewed explanation");
  } else {
    const lines = explanation.split("\n");
    if (lines.length !== 2 || !lines[0].startsWith(`${oddTerm?.label ?? ""} is `) || !lines[0].endsWith(".") || !/^The others are .+\.$/.test(lines[1] ?? "")) {
      errors.push("explanation must use the approved two-line format");
    }
  }

  const matches = terms.filter((term) => term.id !== oddTermId);
  const relation = blueprint.relation;
  if (relation && terms.length === 4 && oddTerm) {
    const matchingCount = matches.filter((term) =>
      matchesRelation(valueFor(term, relation.field), relation.operator, relationValue)
    ).length;
    if (matchingCount !== 3) errors.push(`matching terms do not all satisfy '${relation.field}'`);
    if (matchesRelation(valueFor(oddTerm, relation.field), relation.operator, relationValue)) {
      errors.push(`odd term also satisfies '${relation.field}'`);
    }
  }

  for (const attribute of blueprint.protectedAttributes ?? []) {
    if (matches.length !== 3) continue;
    if (matches.some((term) => valueFor(term, attribute.field) === undefined)) {
      errors.push(`matching terms lack protected attribute '${attribute.field}'`);
      continue;
    }
    if (distinctCount(matches, attribute.field) < attribute.minimumDistinctMatches) {
      errors.push(`protected attribute '${attribute.field}' is not varied enough across matching terms`);
    }
  }

  return errors;
}
