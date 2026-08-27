import { createRandomSource } from "../../core/random.mjs";

export function normalizePlayableCharacter(character) {
  const normalized = (character || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  return /^[A-Z]$/.test(normalized) ? normalized : "";
}

export function normalizePlayableAnswer(answer) {
  return [...answer].map((character) => normalizePlayableCharacter(character) || character).join("");
}

export function playableLetters(answer) {
  return [...new Set([...answer].map(normalizePlayableCharacter).filter(Boolean))];
}

export class HangmanEngine {
  constructor({ entries, getAnswer = (entry) => entry.answer, filter = () => true, random = Math.random, maxMisses = 6 }) {
    this.entries = entries;
    this.getAnswer = getAnswer;
    this.filter = filter;
    this.random = createRandomSource(random);
    this.maxMisses = maxMisses;
    this.state = { phase: "idle", answer: "", guessed: new Set(), misses: [], message: "", solveBuffer: "" };
  }

  setFilter(filter) { this.filter = filter; }

  start() {
    const pool = this.entries.filter(this.filter);
    if (!pool.length) {
      Object.assign(this.state, { phase: "idle", answer: "", message: "No matching words" });
      return this.snapshot();
    }
    let answer = this.getAnswer(this.random.pick(pool)).toUpperCase();
    if (pool.length > 1 && answer === this.state.answer) {
      const index = pool.findIndex((entry) => this.getAnswer(entry).toUpperCase() === answer);
      answer = this.getAnswer(pool[(index + 1) % pool.length]).toUpperCase();
    }
    this.state = { phase: "playing", answer, guessed: new Set(), misses: [], message: "", solveBuffer: "" };
    return this.snapshot();
  }

  guess(letter) {
    if (this.state.phase !== "playing") return this.snapshot();
    const playable = normalizePlayableCharacter(letter);
    if (!playable || this.state.guessed.has(playable) || this.state.misses.includes(playable)) return this.snapshot();
    if (normalizePlayableAnswer(this.state.answer).includes(playable)) {
      this.state.guessed.add(playable);
      this.state.message = "";
      if (playableLetters(this.state.answer).every((value) => this.state.guessed.has(value))) this.finish("won");
    } else {
      this.state.misses.push(playable);
      this.state.message = `${playable} is not in the word.`;
      if (this.state.misses.length >= this.maxMisses) this.finish("lost");
    }
    return this.snapshot();
  }

  enterSolve() {
    if (this.state.phase === "playing") { this.state.phase = "solving"; this.state.solveBuffer = ""; this.state.message = ""; }
    return this.snapshot();
  }

  editSolve(value) {
    if (this.state.phase === "solving") this.state.solveBuffer = value.toUpperCase();
    return this.snapshot();
  }

  cancelSolve() {
    if (this.state.phase === "solving") { this.state.phase = "playing"; this.state.solveBuffer = ""; }
    return this.snapshot();
  }

  submitSolve() {
    if (this.state.phase !== "solving") return this.snapshot();
    const attempt = this.state.solveBuffer.trim().replace(/\s+/g, " ").toUpperCase();
    if (!attempt) return this.snapshot();
    if (attempt === normalizePlayableAnswer(this.state.answer)) this.finish("won");
    else {
      this.state.phase = "playing";
      this.state.solveBuffer = "";
      this.state.misses.push("WORD");
      this.state.message = "Wrong solution. One miss added.";
      if (this.state.misses.length >= this.maxMisses) this.finish("lost");
    }
    return this.snapshot();
  }

  finish(phase) {
    this.state.phase = phase;
    for (const letter of playableLetters(this.state.answer)) this.state.guessed.add(letter);
    this.state.message = phase === "won" ? "Correct." : `The answer was ${this.state.answer}.`;
  }

  snapshot() {
    return {
      ...this.state,
      guessed: [...this.state.guessed],
      misses: [...this.state.misses],
      wrongCount: this.state.misses.length,
      maxMisses: this.maxMisses,
      characters: [...this.state.answer].map((character) => ({
        character,
        playable: normalizePlayableCharacter(character),
        revealed: !normalizePlayableCharacter(character) || this.state.guessed.has(normalizePlayableCharacter(character))
      }))
    };
  }
}
