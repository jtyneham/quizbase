import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Hangman engine delegates interface feedback to its visual-effects adapter", async () => {
  const [engine, effects] = await Promise.all([
    readFile(new URL("../../js/core/hangman-engine.js", import.meta.url), "utf8"),
    readFile(new URL("../../js/core/hangman-visual-effects.js", import.meta.url), "utf8"),
  ]);

  assert.match(engine, /createHangmanVisualEffects/);
  assert.match(engine, /effects\.correctGuess/);
  assert.match(engine, /effects\.wrongGuess/);
  assert.match(engine, /effects\.keyPressed/);
  assert.match(effects, /roundEnded\(/);
});
