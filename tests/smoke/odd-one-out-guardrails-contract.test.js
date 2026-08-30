import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Odd One Out keeps its long-session relationship and family cooldowns", async () => {
  const source = await readFile(
    new URL("../../js/core/odd-one-out-engine.js", import.meta.url),
    "utf8"
  );

  assert.match(source, /RECENT_BLUEPRINT_LIMIT = 12/);
  assert.match(source, /RECENT_FAMILY_LIMIT = 9/);
  assert.match(source, /RECENT_VISIBLE_SET_LIMIT = 3/);
});
