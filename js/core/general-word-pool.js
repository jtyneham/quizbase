/**
 * The shared, deliberately small default vocabulary for Quizbase.
 *
 * “General” means familiar, standalone words that work without specialist
 * knowledge or a category prompt. Topic-specific pools remain untouched; this
 * list only controls what a player receives when they first open a game.
 *
 * Keep this list explicit. Do not derive it from broad category tags: those
 * tags intentionally contain specialist content for players who opt into it.
 */
export const GENERAL_TERMS = new Set([
  "reading", "writing", "drawing", "singing", "dancing", "acting", "cooking",
  "baking", "gardening", "hiking", "camping", "fishing", "jogging", "yoga",
  "meditation", "knitting", "sewing", "photography", "traveling", "picnicking",
  "barbecuing", "blogging", "carpentry", "pottery", "origami",
  "lion", "tiger", "elephant", "giraffe", "zebra", "gorilla", "monkey", "panda",
  "koala", "kangaroo", "bear", "wolf", "fox", "rabbit", "deer", "horse", "dog",
  "cat", "dolphin", "whale", "shark", "eagle", "hawk", "owl", "penguin",
  "butterfly", "bee", "spider", "frog", "turtle", "snake",
  "apple", "banana", "orange", "grape", "strawberry", "blueberry", "watermelon",
  "bread", "cheese", "butter", "milk", "coffee", "tea", "juice", "soup", "salad",
  "pizza", "sandwich", "cookie", "cake", "chocolate", "pancake", "egg", "rice",
  "pasta", "potato", "tomato", "onion", "carrot", "cucumber", "avocado",
  "chair", "table", "bed", "lamp", "door", "window", "mirror", "clock", "phone",
  "book", "pencil", "pen", "bag", "basket", "broom", "pillow", "carpet", "fork",
  "spoon", "plate", "cup", "bottle", "key", "lock", "hammer", "scissors",
  "toothbrush", "towel", "blanket", "refrigerator", "microwave", "oven", "sink",
  "bathtub", "head", "hair", "eye", "ear", "nose", "mouth", "teeth", "tongue",
  "hand", "finger", "arm", "leg", "foot", "heart", "skin", "bone",
  "doctor", "nurse", "teacher", "baker", "chef", "farmer", "artist", "musician",
  "dancer", "driver", "builder", "lawyer", "firefighter", "manager", "waiter",
  "beach", "forest", "river", "lake", "mountain", "hill", "island", "tree", "flower",
  "grass", "leaf", "rain", "snow", "wind", "cloud", "rainbow", "thunder", "ice",
  "volcano", "bicycle", "motorcycle", "car", "bus", "train", "truck", "boat",
  "airplane", "taxi", "football", "soccer", "basketball", "baseball", "tennis",
  "badminton", "golf", "hockey", "swimming", "running", "cycling", "boxing", "karate",
  "volleyball", "skiing", "helmet", "shirt", "jacket", "shoes", "boots", "socks",
  "dress", "hat", "glasses", "airport", "station", "bridge", "road", "kitchen",
  "bathroom", "bedroom", "garden", "library", "school", "hospital", "office", "shop",
  "restaurant", "bank", "bakery", "park", "playground", "animal", "fruit", "vegetable",
  "breakfast", "lunch", "dinner", "family", "friend", "baby", "child", "mother",
  "father", "sister", "brother", "happy", "sad", "angry", "tired", "hungry", "thirsty",
  "clean", "dirty", "bright", "dark", "hot", "cold", "big", "small", "fast", "slow",
  "open", "close", "begin", "finish", "answer", "question", "music", "movie", "story",
  "game", "toy", "ball"
]);

export function isGeneralTerm(value) {
  return GENERAL_TERMS.has(String(value).toLowerCase());
}

/**
 * Reassigns the existing broad General tag at runtime without changing any
 * specialist topic data. The game sees General only on curated entries.
 */
export function withCuratedGeneralTopic(entries) {
  return entries.map((entry) => {
    const topics = entry.topics.filter((topic) => topic !== "General");
    if (isGeneralTerm(entry.word)) topics.unshift("General");
    return { ...entry, topics };
  });
}

export function isGeneralHangmanEntry(entry) {
  return isGeneralTerm(entry.answer);
}
