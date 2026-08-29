import { withCuratedGeneralTopic } from "./general-word-pool.js";

/**
 * Corrections found during the specialist-topic audit.
 *
 * Each override keeps only the categories in which the bare answer itself is
 * a fair quiz answer. Contextual phrases (for example, "electric car") belong
 * in a reskin-specific pool instead of making "electric" a vehicle answer.
 */
const TOPIC_OVERRIDES = new Map([
  ["american", ["Nouns"]],
  ["arts", ["Nouns"]],
  ["electric", ["Nouns", "Adjectives"]],
  ["fire", ["Nature", "Nouns", "Verbs"]],
  ["mountain", ["Geography", "Nature", "Nouns"]],
  ["table", ["Household", "Everyday Objects", "Nouns"]],
  ["water", ["Food & Drink", "Nature", "Nouns"]]
]);

const OMITTED_ANSWERS = new Set([
  // Not a quiz answer by itself, and incorrectly tagged as Sports and Games.
  "and",
  // Both are unreachable under Missing Word's documented maximums.
  "declaration of independence",
  "lord of the rings"
]);

/**
 * Produces the player-facing Missing Word pool from the preserved raw source.
 * It removes unreachable/noisy entries, fixes audited cross-topic mistakes,
 * then applies the explicit General vocabulary last.
 */
export function curateMissingWordPool(entries) {
  const corrected = entries.flatMap((entry) => {
    // Pokémon belongs exclusively to the dedicated Pokémon Missing Word game.
    if (OMITTED_ANSWERS.has(entry.word) || entry.topics.includes("Pokemon")) return [];
    const topics = TOPIC_OVERRIDES.get(entry.word) ?? entry.topics;
    return [{ ...entry, topics }];
  });

  return withCuratedGeneralTopic(corrected);
}
