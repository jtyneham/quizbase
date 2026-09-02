import { test, expect } from "@playwright/test";
import { openGame } from "./helpers.js";

const variants = [
  { name: "Hangman", screen: "hangmanScreen" },
  { name: "Hangman - Pokemon", screen: "hangmanPokemonScreen" },
];

test("Hangman switches editions from its compact header picker", async ({ page }) => {
  const generalScreen = await openGame(page, { name: "Hangman" });
  const trigger = generalScreen.locator('[data-ui="edition-picker-trigger"]');

  await expect(trigger).toHaveAttribute("aria-label", "Edition: Hangman");
  await trigger.click();
  await expect(generalScreen.locator('[data-ui="edition-picker-panel"]')).toBeVisible();
  const pokemonOption = generalScreen.getByRole("menuitem", { name: "Hangman Pokemon" });
  await expect(pokemonOption).toBeVisible();
  await pokemonOption.click();

  const pokemonScreen = page.locator("#hangmanPokemonScreen");
  await expect(pokemonScreen).toHaveClass(/active/);
  await expect(pokemonScreen.locator('[data-ui="edition-picker-trigger"]'))
    .toHaveAttribute("aria-label", "Edition: Hangman Pokemon");
});

for (const variant of variants) {
  test.describe(variant.name, () => {
    test("keyboard guess, Solve/Cancel, and New Word remain functional", async ({ page }) => {
      const screen = await openGame(page, variant);
      const slots = screen.locator("#slots");
      await expect(slots.locator(".letter-slot").first()).toBeVisible();

      const q = screen.locator('.letter-key[data-key="Q"]');
      await q.click();
      await expect(q).toHaveClass(/used/);

      await screen.locator("#solveBtn").click();
      await expect(screen.locator("#solveUi")).toHaveClass(/open/);
      await screen.locator("#solveCancelBtn").click();
      await expect(screen.locator("#solveUi")).not.toHaveClass(/open/);

      const newWord = screen.locator("#newWordBtn");
      await newWord.click();
      await expect(newWord).toHaveText("New Word?");
      await newWord.click();
      await expect(newWord).toHaveText("New Word");
      await expect(slots.locator(".letter-slot").first()).toBeVisible();
      await expect(q).not.toHaveClass(/used/);
    });

    test("topic picker applies, cancels, dismisses outside, and reopens", async ({ page }) => {
      const screen = await openGame(page, variant);
      const trigger = screen.locator('[data-ui="topic-picker-trigger"]');
      const overlay = screen.locator('[data-ui="overlay"]');

      await trigger.click();
      await expect(overlay).toHaveAttribute("aria-hidden", "false");
      await screen.locator("#cancelTopics").click();
      await expect(overlay).toHaveAttribute("aria-hidden", "true");

      await trigger.click();
      await screen.locator("#selectAllTopics").click();
      await screen.locator("#applyTopics").click();
      await expect(overlay).toHaveAttribute("aria-hidden", "true");

      await trigger.click();
      await overlay.click({ position: { x: 2, y: 2 } });
      await expect(overlay).toHaveAttribute("aria-hidden", "true");
      await trigger.click();
      await expect(overlay).toHaveAttribute("aria-hidden", "false");
    });
  });
}
