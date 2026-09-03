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
 * Canonical display spellings for the two duplicate concepts found in the
 * player-facing pool.  Each keeps the union of its genuinely relevant tags.
 */
const ENTRY_OVERRIDES = new Map([
  ["packet loss", {
    difficulty: 3,
    topics: ["Games", "Video Games", "IT & Technology", "Nouns"]
  }],
  ["toolbox", {
    difficulty: 1,
    topics: ["Tools", "Everyday Objects", "Nouns"]
  }]
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
  ["Games", new Set([
    // Generic fragments that need a companion (for example, Game Boy,
    // health bar, cloud gaming, or a skill tree) are not fair answers here.
    "angle", "artificial", "badge", "bar", "barrel", "basic", "box", "boy",
    "button", "cap", "cast", "chain", "channel", "click", "cloud", "code",
    "compass", "core", "couch", "cube", "daily", "data", "dialogue", "duo",
    "early", "egg", "energy", "escape", "extra", "file", "final", "flag",
    "frame", "free", "global", "grand", "gun", "heavy", "hero", "hide",
    "high", "hill", "history", "hunter", "icon", "input", "invisible", "iron",
    "kit", "light", "lock", "log", "manual", "marker", "master", "mouse",
    "multiple", "music", "network", "novel", "number", "object", "packet",
    "payload", "personal", "physical", "physics", "power", "probability", "profile",
    "quick", "radial", "room", "safe", "screen", "secret", "setting", "space",
    "special", "stack", "stash", "station", "sudden", "system", "tag", "title",
    "track", "tree", "video", "virtual", "war", "wheel",
    "bad", "best", "good", "new", "open", "true", "weak"
  ])],
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
  ["Verbs", new Set(["not", "pomegranate"])],
  ["Adjectives", new Set([
    "bake", "bulldog", "iguana", "jackal", "montreal", "ostrich", "portugal", "starfish"
  ])]
]);

const OMITTED_ANSWERS = new Set([
  // Not a quiz answer by itself, and incorrectly tagged as Sports and Games.
  "and",
  // Both are unreachable under Missing Word's documented maximums.
  "declaration of independence",
  "lord of the rings",
  // Duplicate spellings are consolidated through ENTRY_OVERRIDES above.
  "packetloss",
  "tool box"
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
    const override = ENTRY_OVERRIDES.get(entry.word);
    const candidateTopics = override?.topics ?? TOPIC_OVERRIDES.get(entry.word) ?? entry.topics;
    const topics = candidateTopics.filter((topic) => !TOPIC_REMOVALS.get(topic)?.has(entry.word));
    return [{ ...entry, difficulty: override?.difficulty ?? entry.difficulty, topics }];
  });

  return withCuratedGeneralTopic(corrected).filter((entry) => entry.topics.length > 0);
}

function canonicalWord(word) {
  return String(word)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Applies Missing Word's actual display limits after every specialist topic
 * has been integrated.  Keeping this separate lets those shared topic lists
 * remain available to Hangman, whose renderer supports longer answers.
 */
export function finalizeMissingWordPool(entries, { maxLetters = 20, maxWords = 3 } = {}) {
  const seenWords = new Set();

  return entries.flatMap((entry) => {
    const letterCount = (entry.word.match(/[A-Za-z]/g) ?? []).length;
    const wordCount = entry.word.trim().split(/\s+/).filter(Boolean).length;
    const canonical = canonicalWord(entry.word);
    if (
      entry.topics.length === 0 ||
      letterCount < 2 ||
      letterCount > maxLetters ||
      wordCount > maxWords ||
      seenWords.has(canonical)
    ) {
      return [];
    }

    seenWords.add(canonical);
    return [entry];
  });
}
