import test from "node:test";
import assert from "node:assert/strict";
import { bindOutsideDismiss } from "../../js/core/ui.js";

function node(name, parent = null) {
  return { name, contains(target) { for (let cur = target; cur; cur = cur.parent) if (cur === this) return true; return false; }, parent };
}

test("outside dismiss ignores clicks inside the owner and opener", () => {
  let click;
  const root = { addEventListener(type, fn) { if (type === "click") click = fn; }, removeEventListener() {} };
  const owner = node("sheet");
  const inside = node("chip", owner);
  const opener = node("button");
  const outside = node("page");
  let dismissals = 0;
  bindOutsideDismiss(root, owner, () => { dismissals += 1; }, opener);
  click({ target: inside });
  click({ target: opener });
  assert.equal(dismissals, 0);
  click({ target: outside });
  assert.equal(dismissals, 1);
});

test("outside dismiss respects composed path when clicked child is re-rendered", () => {
  let click;
  const root = { addEventListener(type, fn) { if (type === "click") click = fn; }, removeEventListener() {} };
  const owner = node("sheet");
  const detachedChip = node("chip");
  let dismissals = 0;
  bindOutsideDismiss(root, owner, () => { dismissals += 1; });
  click({ target: detachedChip, composedPath: () => [detachedChip, owner, root] });
  assert.equal(dismissals, 0);
});
