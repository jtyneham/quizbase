import { test, expect } from "@playwright/test";
import { assertNoPageOverflow, openGame } from "./helpers.js";

test("Letter Builder supports selection, timed play, reveal, and consecutive rounds", async ({ page }) => {
  const screen = await openGame(page, { name: "Letter Builder" });
  const tiles = screen.locator(".letter-builder-tile:not(.empty)");
  const primary = screen.locator("#letterBuilderPrimaryButton");
  const reveal = screen.locator("#letterBuilderRevealButton");

  await expect(tiles).toHaveCount(0);
  await screen.locator("#letterBuilderVowelButton").click();
  await screen.locator("#letterBuilderConsonantButton").click();
  await expect(tiles).toHaveCount(2);
  await screen.locator("#letterBuilderRandomButton").click();
  await expect(tiles).toHaveCount(9);
  await expect(primary).toBeEnabled();

  await primary.click();
  await expect(primary).toHaveText("End Round");
  await expect(screen.getByRole("button", { name: "Relaxed", exact: true })).toBeDisabled();
  await primary.click();
  await expect(reveal).toBeEnabled();
  await reveal.click();
  await expect(screen.locator("#letterBuilderResults")).toBeVisible();
  await expect(screen.locator("#letterBuilderWordList span").first()).toBeVisible();

  const relaxed = screen.getByRole("button", { name: "Relaxed", exact: true });
  await expect(relaxed).toBeEnabled();
  await relaxed.click();
  await expect(relaxed).toHaveAttribute("aria-pressed", "true");
  await expect(screen.locator("#letterBuilderStatusDetail")).toContainText("Next round: Relaxed");

  await primary.click();
  await expect(tiles).toHaveCount(0);
  await expect(screen.locator("#letterBuilderRoundLabel")).toContainText("Round 2");
  await screen.locator("#letterBuilderRandomButton").click();
  await expect(primary).toHaveText("Start Round");
  await primary.click();
  await expect(screen.locator("#letterBuilderTimer")).toHaveText("∞");
  await assertNoPageOverflow(page);
});

test("Letter Builder relaxed mode and keyboard shortcuts remain playable", async ({ page }) => {
  const screen = await openGame(page, { name: "Letter Builder" });
  await screen.getByRole("button", { name: "Relaxed", exact: true }).click();
  await page.keyboard.press("v");
  await page.keyboard.press("c");
  await page.keyboard.press("r");
  await expect(screen.locator(".letter-builder-tile:not(.empty)")).toHaveCount(9);
  await page.keyboard.press("Space");
  await expect(screen.locator("#letterBuilderTimer")).toHaveText("∞");
  await expect(screen.locator("#letterBuilderPrimaryButton")).toHaveText("End Round");
  await assertNoPageOverflow(page);
});
