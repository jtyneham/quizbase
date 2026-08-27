import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../../${path}`, import.meta.url), "utf8");

for (const path of ["css/hangman.css", "css/hangman-pokemon.css"]) {
  test(`${path} preserves a visible multiline answer area`, async () => {
    const css = await read(path);
    assert.match(css, /\.word-zone\{\s*min-height:clamp\(4\.9rem,14svh,6\.8rem\);[\s\S]*?overflow:visible;/);
    assert.match(css, /\.slots\{[\s\S]*?flex-wrap:wrap;[\s\S]*?overflow:visible;/);
    assert.match(css, /grid-template-rows:auto minmax\(0,24svh\) minmax\(5\.1rem,14svh\)/);
  });
}
