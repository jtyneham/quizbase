import { test, expect } from "@playwright/test";
import { openGame } from "./helpers.js";

test("Random Letter generates repeatedly and Ideas remains interactive", async ({ page }) => {
  const screen = await openGame(page, { name: "Random Letter", screen: "rnglScreen" });
  const generate = screen.locator("#generateButton");
  const letter = screen.locator("#letter");
  await generate.click();
  await expect(letter).toHaveText(/[A-Z]/);
  await generate.click();
  await expect(letter).toHaveText(/[A-Z]/);

  const ideas = screen.locator("#ideasToggle");
  await ideas.check();
  await expect(ideas).toBeChecked();
  await ideas.uncheck();
  await expect(ideas).not.toBeChecked();
});
