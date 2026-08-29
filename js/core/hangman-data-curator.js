/**
 * Player-facing cleanup for the legacy Hangman dataset.
 *
 * The source file is deliberately retained unchanged as an importable archive.
 * Its old subcategories were generated incorrectly and are not trustworthy, so
 * this curator produces the authoritative pool used by the game instead.
 */
const UNSUITABLE_STANDALONE_ANSWERS = new Set([
  // Activities: isolated fragments rather than satisfying answers.
  "CARD", "COIN", "GAMES", "STAMPS",
  // History: meaningful only with missing context.
  "PACT", "RACE",
  // Sports: generic equipment, locations, actions, or roles with no sport.
  "ARENA", "BALL", "BAT", "BATTER", "CATCHER", "CORNER", "COURT", "DEFENDER",
  "GOAL", "MEDAL", "NET", "PITCH", "POOL", "REFEREE", "RUN", "SERVE", "SHOT",
  "STADIUM", "TRACK", "TROPHY", "UMPIRE", "VOLLEY"
]);

function canonicalAnswer(answer) {
  return answer.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/**
 * Returns an answer pool with one spelling per answer and no context-free
 * fragments. A subcategory equal to the main category is intentional: it is
 * truthful, stable metadata until a future reskin introduces a reviewed,
 * player-facing subcategory taxonomy.
 */
export function curateHangmanDatabase(entries) {
  const seenAnswers = new Set();

  return entries.flatMap((entry) => {
    const canonical = canonicalAnswer(entry.answer);
    if (UNSUITABLE_STANDALONE_ANSWERS.has(entry.answer) || seenAnswers.has(canonical)) {
      return [];
    }

    seenAnswers.add(canonical);
    return [{
      ...entry,
      subcategory: entry.category
    }];
  });
}

export function isCuratedHangmanAnswer(entry) {
  return !UNSUITABLE_STANDALONE_ANSWERS.has(entry.answer);
}
