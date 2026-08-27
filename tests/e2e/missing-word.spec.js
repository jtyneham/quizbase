import { test, expect } from "@playwright/test";
import { openGame } from "./helpers.js";

const variants = [
  { name: "Missing Word", screen: "missingWordScreen" },
  { name: "Missing Word - Pokemon", screen: "missingWordPokemonScreen" },
];

for (const variant of variants) {
  test.describe(variant.name, () => {
    test("generates, changes difficulty, and uses topic picker", async ({ page }) => {
      const screen = await openGame(page, variant);
      const action = screen.locator('[data-ui="primary-action"]');
      await action.click();
      await expect(screen.locator("#wordDisplay")).not.toHaveClass(/empty/);

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


    test("real Next Word and word-card cycle never gets stuck", async ({ page }) => {
      const screen = await openGame(page, variant);
      const action = screen.locator("#actionButton");
      const card = screen.locator("#wordCard");
      const display = screen.locator("#wordDisplay");

      await expect(action).toHaveText("Next Word");
      await action.click();
      await expect(action).toHaveText("Reveal", { timeout: 3000 });
      await expect(action).not.toBeDisabled();
      await expect(display).not.toContainText("No matching words");
      await expect(display.locator(".slot").first()).toBeVisible();

      await card.click();
      await expect(action).toHaveText("Next Word", { timeout: 1500 });
      await expect(action).not.toBeDisabled();

      await action.click();
      await expect(action).toHaveText("Reveal", { timeout: 3000 });
      await expect(action).not.toBeDisabled();
      await expect(display.locator(".slot").first()).toBeVisible();
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
