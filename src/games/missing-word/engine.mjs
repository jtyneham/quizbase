import { createRandomSource } from "../../core/random.mjs";

export const DEFAULT_MISSING_WORD_CONFIG = Object.freeze({
  minLetters: 2,
  maxLetters: 20,
  maxWords: 3,
  recentLimit: 20,
  mixedMediumChance: 0.65,
  profiles: {
    medium: { blankRatio: 0.42, preserveFirstChance: 0.72, preserveLastChance: 0.72, maxBlankRun: 2 },
    hard: { blankRatio: 0.58, preserveFirstChance: 0.22, preserveLastChance: 0.22, maxBlankRun: 3 }
  }
});

const isLetter = (character) => /[A-Z]/.test(character);
const letterCount = (value) => [...value].filter((character) => /[A-Za-z]/.test(character)).length;
const wordCount = (value) => value.trim().split(/\s+/).filter(Boolean).length;

function letterGroups(word) {
  const groups = [];
  let group = [];
  [...word].forEach((character, index) => {
    if (isLetter(character)) group.push(index);
    else if (group.length) { groups.push(group); group = []; }
  });
  if (group.length) groups.push(group);
  return groups;
}

function longestRun(chosen, groups) {
  let longest = 0;
  for (const group of groups) {
    let run = 0;
    for (const index of group) {
      run = chosen.has(index) ? run + 1 : 0;
      longest = Math.max(longest, run);
    }
  }
  return longest;
}

export class MissingWordEngine {
  constructor({ entries, defaultTopics = [], allTopics = false, random = Math.random, config = {} }) {
    this.entries = entries;
    this.random = createRandomSource(random);
    this.config = { ...DEFAULT_MISSING_WORD_CONFIG, ...config, profiles: { ...DEFAULT_MISSING_WORD_CONFIG.profiles, ...config.profiles } };
    this.state = {
      phase: "empty",
      difficulty: "mixed",
      roundDifficulty: "medium",
      selectedTopics: new Set(defaultTopics),
      allTopics,
      word: "",
      mask: [],
      message: ""
    };
    this.recent = [];
    this.previousMasks = new Map();
  }

  setDifficulty(difficulty) {
    if (!["mixed", "medium", "hard"].includes(difficulty)) return;
    this.state.difficulty = difficulty;
  }

  setTopics(topics, allTopics = false) {
    this.state.selectedTopics = new Set(topics);
    this.state.allTopics = allTopics || this.state.selectedTopics.size === 0;
  }

  eligibleEntries(roundDifficulty = this.state.roundDifficulty) {
    return this.entries.filter((entry) => {
      const word = entry.word.toLowerCase();
      const validLength = letterCount(word) >= this.config.minLetters &&
        letterCount(word) <= this.config.maxLetters && wordCount(word) <= this.config.maxWords;
      const difficultyAllowed = roundDifficulty === "medium" ? entry.difficulty <= 2 : entry.difficulty <= 3;
      const topicAllowed = this.state.allTopics || entry.topics.some((topic) => this.state.selectedTopics.has(topic));
      return validLength && difficultyAllowed && topicAllowed && !this.recent.includes(word);
    });
  }

  chooseDifficulty() {
    if (this.state.difficulty !== "mixed") return this.state.difficulty;
    return this.random.float() < this.config.mixedMediumChance ? "medium" : "hard";
  }

  weightedChoice(pool, difficulty) {
    const weights = difficulty === "medium" ? { 1: 0.45, 2: 0.55, 3: 0 } : { 1: 0.20, 2: 0.45, 3: 0.35 };
    const total = pool.reduce((sum, entry) => sum + (weights[entry.difficulty] || 0), 0);
    if (!total) return this.random.pick(pool);
    let roll = this.random.float() * total;
    for (const entry of pool) {
      roll -= weights[entry.difficulty] || 0;
      if (roll <= 0) return entry;
    }
    return pool.at(-1);
  }

  createMask(word, difficulty) {
    const profile = this.config.profiles[difficulty];
    const indexes = [...word].map((character, index) => isLetter(character) ? index : null).filter((index) => index !== null);
    const desired = Math.max(1, Math.min(Math.round(indexes.length * profile.blankRatio), Math.max(1, indexes.length - 1)));
    const groups = letterGroups(word);
    const first = indexes[0];
    const last = indexes.at(-1);
    let best = [];
    let bestScore = -Infinity;

    for (let attempt = 0; attempt < 80; attempt += 1) {
      const preferred = indexes.filter((index) => {
        if (index === first && this.random.float() < profile.preserveFirstChance) return false;
        if (index === last && this.random.float() < profile.preserveLastChance) return false;
        return true;
      });
      const candidates = preferred.length >= desired ? preferred : indexes;
      const choice = this.random.shuffle(candidates).slice(0, desired);
      const chosen = new Set(choice);
      if (!groups.every((group) => group.some((index) => !chosen.has(index)))) continue;
      const run = longestRun(chosen, groups);
      if (run > profile.maxBlankRun) continue;
      const signature = [...choice].sort((a, b) => a - b).join(",");
      let score = this.random.float() + (signature !== this.previousMasks.get(word) ? 2 : 0);
      if (difficulty === "hard") score += (chosen.has(first) ? 0.35 : 0) + (chosen.has(last) ? 0.35 : 0) + (run >= 2 ? 0.45 : 0);
      if (score > bestScore) { bestScore = score; best = choice; }
    }

    if (!best.length) best = this.random.shuffle(indexes).slice(0, desired);
    best.sort((a, b) => a - b);
    this.previousMasks.set(word, best.join(","));
    const chosen = new Set(best);
    return [...word].map((character, index) => isLetter(character) && chosen.has(index));
  }

  next() {
    const difficulty = this.chooseDifficulty();
    let pool = this.eligibleEntries(difficulty);
    if (!pool.length) { this.recent.length = 0; pool = this.eligibleEntries(difficulty); }
    if (!pool.length) {
      Object.assign(this.state, { phase: "empty", word: "", mask: [], message: "No matching words" });
      return this.snapshot();
    }
    const entry = this.weightedChoice(pool, difficulty);
    const word = entry.word.toUpperCase();
    const mask = this.createMask(word, difficulty);
    this.recent.push(word.toLowerCase());
    while (this.recent.length > this.config.recentLimit) this.recent.shift();
    Object.assign(this.state, { phase: "masked", roundDifficulty: difficulty, word, mask, message: "" });
    return this.snapshot();
  }

  reveal() {
    if (this.state.phase === "masked") this.state.phase = "revealed";
    return this.snapshot();
  }

  snapshot() {
    return { ...this.state, selectedTopics: [...this.state.selectedTopics], mask: [...this.state.mask] };
  }
}
