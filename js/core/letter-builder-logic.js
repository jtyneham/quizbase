export const LETTER_BUILDER_VOWELS = new Set(["A", "E", "I", "O", "U"]);

export const LETTER_BUILDER_DISTRIBUTIONS = {
  vowel: { A: 15, E: 21, I: 13, O: 13, U: 5 },
  consonant: {
    B: 2, C: 3, D: 6, F: 2, G: 3, H: 2, J: 1, K: 1, L: 5, M: 4,
    N: 8, P: 4, Q: 1, R: 9, S: 9, T: 9, V: 1, W: 1, X: 1, Y: 1, Z: 1
  }
};

export function shuffleLetters(values, random = Math.random) {
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled;
}

function expandDistribution(distribution) {
  return Object.entries(distribution).flatMap(([letter, count]) => Array(count).fill(letter));
}

export function multisetLetterOverlap(first = [], second = []) {
  const remaining = new Map();
  second.forEach((letter) => remaining.set(letter, (remaining.get(letter) || 0) + 1));
  return first.reduce((total, letter) => {
    const available = remaining.get(letter) || 0;
    if (!available) return total;
    remaining.set(letter, available - 1);
    return total + 1;
  }, 0);
}

/**
 * Session-scoped weighted bags. Drawn tiles stay out of circulation until a
 * bag is exhausted, so consecutive rounds vary naturally without suppressing
 * useful common letters.
 */
export class PersistentLetterBags {
  constructor(random = Math.random, distributions = LETTER_BUILDER_DISTRIBUTIONS) {
    this.random = random;
    this.distributions = distributions;
    this.bags = { vowel: [], consonant: [] };
  }

  refill(type) {
    this.bags[type] = shuffleLetters(expandDistribution(this.distributions[type]), this.random);
  }

  draw(type, { chosen = [], previousRound = [], maxOverlap = 6 } = {}) {
    if (!this.bags[type]?.length) this.refill(type);
    let candidate = this.bags[type].pop();

    // Only the final tile can make a whole set feel repeated. Cycle past a
    // near-duplicate when the bag has alternatives, without discarding tiles.
    if (chosen.length === 8 && previousRound.length === 9) {
      const deferred = [];
      while (
        this.bags[type].length &&
        multisetLetterOverlap([...chosen, candidate], previousRound) > maxOverlap &&
        deferred.length < 12
      ) {
        deferred.push(candidate);
        candidate = this.bags[type].pop();
      }
      this.bags[type].unshift(...deferred);
    }

    return candidate;
  }

  remaining(type) {
    return this.bags[type]?.length || 0;
  }
}

export function isVowel(letter) {
  return LETTER_BUILDER_VOWELS.has(String(letter).toUpperCase());
}

export function fillRandomLetters({
  letters = [],
  bags,
  previousRound = [],
  target = 9,
  random = Math.random
}) {
  const filled = [...letters];
  const vowelCount = () => filled.filter(isVowel).length;
  const remaining = target - filled.length;
  const preferredVowels = random() < 0.65 ? 3 : 4;
  const desiredVowels = Math.min(5, Math.max(vowelCount(), Math.min(preferredVowels, vowelCount() + remaining)));

  while (filled.length < target) {
    const slotsLeft = target - filled.length;
    const vowelsNeeded = Math.max(0, desiredVowels - vowelCount());
    const type = vowelsNeeded >= slotsLeft || (vowelsNeeded > 0 && random() < vowelsNeeded / slotsLeft)
      ? "vowel"
      : "consonant";
    filled.push(bags.draw(type, { chosen: filled, previousRound }));
  }

  return filled;
}

export function letterCounts(value) {
  return [...String(value).toUpperCase()].reduce((counts, letter) => {
    if (/^[A-Z]$/.test(letter)) counts.set(letter, (counts.get(letter) || 0) + 1);
    return counts;
  }, new Map());
}

export function canBuildWord(word, letters) {
  const available = letterCounts(Array.isArray(letters) ? letters.join("") : letters);
  for (const [letter, count] of letterCounts(word)) {
    if ((available.get(letter) || 0) < count) return false;
  }
  return /^[A-Za-z]+$/.test(word) && word.length >= 3;
}

export function findBestWords(words, letters, { limit = 12, minimumLength = 3 } = {}) {
  const candidates = words
    .filter((word) => word.length >= minimumLength && canBuildWord(word, letters))
    .sort((first, second) => second.length - first.length || first.localeCompare(second));
  const longestLength = candidates[0]?.length || 0;
  return {
    longestLength,
    words: candidates.filter((word) => word.length === longestLength).slice(0, limit),
    totalAtLongestLength: candidates.filter((word) => word.length === longestLength).length
  };
}
