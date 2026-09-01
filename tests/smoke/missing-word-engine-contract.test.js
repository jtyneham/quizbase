import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");

test("Missing Word keeps a swappable visual-renderer contract", () => {
  const engine = fs.readFileSync(
    path.join(root, "js/core/missing-word-engine.js"),
    "utf8"
  );
  const domRenderer = fs.readFileSync(
    path.join(root, "js/core/missing-word-dom-renderer.js"),
    "utf8"
  );
  const rendererContract = fs.readFileSync(
    path.join(root, "js/core/missing-word-visual-renderer.js"),
    "utf8"
  );

  assert.match(
    domRenderer,
    /import\s*\{\s*countLetters\s*\}\s*from\s*["']\.\/missing-word-utils\.js["']/,
    "countLetters must be explicitly imported by the DOM visual renderer"
  );
  assert.match(rendererContract, /registerMissingWordVisualRenderer/);
  assert.match(rendererContract, /createMissingWordVisualRenderer/);
  assert.match(domRenderer, /return \{ renderRound, playGeneration, settleGeneration, reveal, destroy \}/);
  assert.match(engine, /createMissingWordVisualRenderer/);
  assert.match(engine, /renderer\.playGeneration/);
  assert.match(engine, /renderer\.settleGeneration/);
});

test("Missing Word keeps multi-word answers visually separated", () => {
  for (const stylesheet of ["missing-word.css", "missing-word-pokemon.css"]) {
    const css = fs.readFileSync(path.join(root, "css", stylesheet), "utf8");
    assert.match(css, /\.slot\.structural\.space\s*\{[\s\S]*?width:\s*0\.9em\s*!important;[\s\S]*?min-width:\s*0\.9em;/);
  }
});
