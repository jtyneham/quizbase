import { test, expect } from "@playwright/test";
import { openGame } from "./helpers.js";

test("Odd One Out switches editions from its compact header picker", async ({ page }) => {
  const generalScreen = await openGame(page, { name: "Odd One Out" });
  const trigger = generalScreen.locator('[data-ui="edition-picker-trigger"]');

  await expect(trigger).toHaveAttribute("aria-label", "Edition: Odd One Out");
  await trigger.click();
  await expect(generalScreen.locator('[data-ui="edition-picker-panel"]')).toBeVisible();
  await generalScreen.getByRole("menuitem", { name: "Odd One Out Pokemon" }).click();

  const pokemonScreen = page.locator("#oddOneOutPokemonScreen");
  await expect(pokemonScreen).toHaveClass(/active/);
  await expect(pokemonScreen.locator('[data-ui="edition-picker-trigger"]'))
    .toHaveAttribute("aria-label", "Edition: Odd One Out Pokemon");
});

test("Odd One Out generates a reviewed set and resolves correct and wrong picks", async ({ page }) => {
  const screen = await openGame(page, { name: "Odd One Out" });
  const next = screen.locator("#oddOneOutNextButton");
  const cards = screen.locator(".odd-one-out-card");

  await expect(next).toHaveText("Generate Set");
  await expect(screen.locator("#oddOneOutPrompt")).toHaveCount(0);
  await next.click();
  await expect(cards).toHaveCount(4);
  await expect(next).toHaveText("Next Set");

  const values = await cards.allTextContents();
  await cards.first().click();
  await expect(cards.filter({ hasText: values[0] })).toHaveClass(/correct|wrong/);
  const feedback = screen.locator("#oddOneOutFeedback");
  await expect(feedback).not.toBeEmpty();
  await expect(feedback).not.toContainText(/Correct\.|Not quite\./);
  await expect(cards).toHaveCount(4);

  await next.click();
  await expect(cards).toHaveCount(4);
  await expect(screen.locator("#oddOneOutFeedback")).toBeEmpty();
});

test("Odd One Out offers Mixed, Medium, and Hard only", async ({ page }) => {
  const screen = await openGame(page, { name: "Odd One Out" });
  const difficulty = screen.locator(".odd-one-out-difficulty");

  await expect(difficulty.getByRole("button")).toHaveCount(3);
  await expect(difficulty.getByRole("button", { name: "Mixed" })).toHaveAttribute("aria-pressed", "true");
  await difficulty.getByRole("button", { name: "Hard" }).click();
  await expect(difficulty.getByRole("button", { name: "Hard" })).toHaveAttribute("aria-pressed", "true");
});
