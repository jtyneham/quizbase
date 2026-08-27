import { createRandomSource } from "../../core/random.mjs";

const REGULAR = "ABCDEFGHIJKLMNOPRSTUVW".split("");
const RARE = ["Q", "X", "Y", "Z"];
export const WEIGHTED_LETTERS = [...REGULAR, ...REGULAR, ...RARE];
export const REVEALS = ["slot", "multi-flip", "zoom-tunnel", "letter-wheel"];

export class RandomLetterEngine {
  constructor({ random = Math.random } = {}) {
    this.random = createRandomSource(random);
    this.state = { phase: "idle", letter: "A", reveal: "slot", ideasVisible: false };
  }

  generate() {
    this.state = { ...this.state, phase: "revealed", letter: this.random.pick(WEIGHTED_LETTERS), reveal: this.random.pick(REVEALS) };
    return this.snapshot();
  }

  toggleIdeas(force) {
    this.state.ideasVisible = typeof force === "boolean" ? force : !this.state.ideasVisible;
    return this.snapshot();
  }

  snapshot() { return { ...this.state }; }
}
