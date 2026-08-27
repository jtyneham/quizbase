import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");

test("Missing Word shared engine imports countLetters used by its renderer", () => {
  const engine = fs.readFileSync(
    path.join(root, "js/core/missing-word-engine.js"),
    "utf8"
  );

  assert.match(
    engine,
    /import\s*\{\s*countLetters\s*\}\s*from\s*["']\.\/missing-word-utils\.js["']/,
    "countLetters must be explicitly imported by the shared Missing Word engine"
  );
});
