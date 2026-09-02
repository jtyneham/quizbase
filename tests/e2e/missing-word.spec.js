import { test, expect } from "@playwright/test";
import { openGame } from "./helpers.js";

const variants = [
  { name: "Missing Word", screen: "missingWordScreen" },
  { name: "Missing Word - Pokemon", screen: "missingWordPokemonScreen" },
];

test("Missing Word switches editions from its compact header picker", async ({ page }) => {
  const generalScreen = await openGame(page, { name: "Missing Word", screen: "missingWordScreen" });
  const trigger = generalScreen.locator('[data-ui="edition-picker-trigger"]');

  await expect(trigger).toHaveAttribute("aria-label", "Edition: Missing Word");
  await trigger.click();
  await expect(generalScreen.locator('[data-ui="edition-picker-panel"]')).toBeVisible();
  await generalScreen.getByRole("menuitem", { name: "Missing Word Pokemon" }).click();

  const pokemonScreen = page.locator("#missingWordPokemonScreen");
  await expect(pokemonScreen).toHaveClass(/active/);
  await expect(page).toHaveURL(/#missingwordpokemon$/);
  await expect(pokemonScreen.locator('[data-ui="edition-picker-trigger"]'))
    .toHaveAttribute("aria-label", "Edition: Missing Word Pokemon");
});

for (const variant of variants) {
  test.describe(variant.name, () => {
    test("generates, changes difficulty, and uses topic picker", async ({ page }) => {
      const screen = await openGame(page, variant);
      const action = screen.locator('[data-ui="primary-action"]');
      await action.click();
      await expect(action).toHaveText("Reveal", { timeout: 4000 });
      await expect(action).not.toHaveClass(/generating/);
      await expect(screen.locator("#wordDisplay")).not.toHaveClass(/empty/);
      await expect(screen.locator("#wordDisplay .slot").first()).toBeVisible();

      // A second tap during the reel animation is allowed to fast-forward it;
      // it must never leave the primary action grey or permanently busy.
      await action.click();
      await action.click();
      await expect(action).toHaveText("Reveal", { timeout: 4000 });
      await expect(action).not.toHaveClass(/generating/);

      // Human play path: reveal from the card, then generate another round.
      await screen.locator("#wordCard").click();
      await expect(action).toHaveText("Next Word");
      await action.click();
      await expect(action).toHaveText("Reveal", { timeout: 4000 });
      await expect(action).not.toHaveClass(/generating/);

      const hard = screen.getByRole("button", { name: "Hard", exact: true });
      await hard.click();
      await expect(hard).toHaveClass(/active/);

      const trigger = screen.locator('[data-ui="topic-picker-trigger"]');
      await trigger.click();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(screen.locator('[data-ui="overlay-panel"]')).toBeVisible();

      await screen.locator("#topicClearButton").click();
      await screen.locator("#topicDoneButton").click();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    test("topic picker dismisses on outside click and can reopen", async ({ page }) => {
      const screen = await openGame(page, variant);
      const trigger = screen.locator('[data-ui="topic-picker-trigger"]');
      await trigger.click();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await screen.locator('[data-ui="game-toolbar"]').click({ position: { x: 2, y: 2 } });
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await trigger.click();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  });
}
