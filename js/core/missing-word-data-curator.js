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

/**
 * Terms which are valid English words but are not fair answers in the listed
 * specialist topic without an omitted companion word.  For example, `cord`
 * is a word, but it is not a Human Body answer unless the player is expected
 * to infer “spinal cord”.  Keep these corrections here rather than altering
 * the raw, reusable source dataset.
 *
 * This is the first specialist-audit batch: living world, sciences, culture,
 * sports, and game entertainment.  The second batch covers the remaining
 * practical/everyday topics.
 */
const TOPIC_REMOVALS = new Map([
  ["Animals", new Set(["african", "zoology"])],
  ["Food & Drink", new Set([
    "green", "grilled", "hot", "iced", "mashed", "roast", "scrambled",
    "sparkling", "white"
  ])],
  ["Geography", new Set([
    "barrier", "black", "dead", "english", "great", "indian", "mount"
  ])],
  ["Nature", new Set(["hot", "photosynthesis", "stratosphere"])],
  ["Space", new Set([
    "belt", "black", "body", "capsule", "celestial", "cosmic", "dust",
    "dwarf", "flare", "gas", "giant", "hole", "international", "landing",
    "lunar", "milky", "orbital", "outer", "planetary", "red", "ring",
    "shooting", "solar", "station", "system", "way"
  ])],
  ["Science", new Set([
    "atomic", "chemical", "data scientist", "federation", "method",
    "periodic", "reaction", "scientific", "solar", "table"
  ])],
  ["Human Body", new Set(["blade", "cage", "cord", "spinal", "stem"])],
  ["Medicine", new Set([
    "aid", "care", "cold", "first", "general", "intensive", "medical",
    "operating", "pressure", "room", "scan", "test"
  ])],
  ["History", new Set([
    "age", "ages", "cold", "dark", "french", "great", "iron", "middle",
    "road", "stone", "war", "world"
  ])],
  ["Sports", new Set([
    "beach", "field", "figure", "formula", "games", "ice", "jumping",
    "one", "rock", "running shoes", "ski", "sport", "stadium", "track"
  ])],
  // These are generic qualifiers, not usable Games answers by themselves.
  ["Games", new Set(["bad", "best", "good", "new", "open", "true", "weak"])],
  ["Music", new Set(["grand"])],
  // Second specialist-audit batch: practical and everyday subjects.
  ["Books & Literature", new Set(["science", "short"])],
  ["People & Professions", new Set(["police"])],
  ["Vehicles", new Set([
    "armored", "cable", "cargo", "cruise", "delivery", "dirt", "dump",
    "electric", "fire", "formula", "freight", "garbage", "mountain", "one",
    "police", "racing", "school", "ski", "sports"
  ])],
  ["Household", new Set([
    "air", "backyard", "bedside", "board", "cleaner", "coffee", "control",
    "cutting", "dressing", "frying", "hair", "home", "ironing", "machine",
    "paper", "remote", "washing"
  ])],
  ["Clothing", new Set([
    "ankle", "baseball", "bow", "cargo", "dressing", "high", "polo", "winter"
  ])],
  ["Tools", new Set([
    "adjustable", "allen", "angle", "box", "garden", "hand", "hex", "hook",
    "measuring", "phillips", "power", "spirit", "utility"
  ])],
  ["Buildings & Places", new Set([
    "art", "bus", "fire", "gas", "grocery", "movie", "parking", "police",
    "post", "railway", "shopping", "sports", "station", "train", "water"
  ])],
  ["Everyday Objects", new Set([
    "ballpoint", "band", "credit", "drinking", "frying", "lunch", "mobile",
    "shopping", "sticky"
  ])],
  ["Brands", new Set(["burger", "king"])],
  // These are not standalone English verb/adjective answers in this base pool.
  ["Verbs", new Set(["pomegranate"])],
  ["Adjectives", new Set([
    "bake", "bulldog", "iguana", "jackal", "montreal", "ostrich", "portugal", "starfish"
  ])]
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
    const candidateTopics = TOPIC_OVERRIDES.get(entry.word) ?? entry.topics;
    const topics = candidateTopics.filter((topic) => !TOPIC_REMOVALS.get(topic)?.has(entry.word));
    return [{ ...entry, topics }];
  });

  return withCuratedGeneralTopic(corrected);
}
