import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../../${path}`, import.meta.url), "utf8");

test("Odd One Out keeps gameplay separate from its replaceable visual renderer", async () => {
  const [engine, boundary, domRenderer] = await Promise.all([
    read("js/core/odd-one-out-engine.js"),
    read("js/core/odd-one-out-visual-renderer.js"),
    read("js/core/odd-one-out-dom-renderer.js")
  ]);

  assert.match(engine, /createOddOneOutVisualRenderer/);
  assert.match(engine, /renderer\.resolveRound/);
  assert.match(engine, /renderer\.playRoundExit/);
  assert.match(boundary, /registerOddOneOutVisualRenderer/);
  assert.match(boundary, /createOddOneOutDomRenderer/);
  assert.match(domRenderer, /renderRound/);
  assert.match(domRenderer, /resolveRound/);
  assert.match(domRenderer, /playRoundEnter/);
});
