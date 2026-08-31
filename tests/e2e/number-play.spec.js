import { test, expect } from "@playwright/test";
import { openGame } from "./helpers.js";

test("Number Play launches as a chooser and Target Pair runs inside its persistent mode shell", async ({ page }) => {
  const screen = await openGame(page, { name: "Number Play" });
  const picker = screen.locator("#numberPlayModeButton");
  const launchOptions = screen.locator("#numberPlayLaunchOptions button");

  await expect(picker).toContainText("Choose a game");
  await expect(launchOptions).toHaveCount(4);
  const hardDifficulty = screen.getByRole("button", { name: "Hard", exact: true });
  await expect(hardDifficulty).toHaveAttribute("aria-pressed", "false");
  await hardDifficulty.click();
  await expect(hardDifficulty).toHaveAttribute("aria-pressed", "true");
  await expect(screen.getByRole("button", { name: /Target Pair/ })).toBeEnabled();
  await expect(screen.getByRole("button", { name: /Number Machine/ })).toBeDisabled();

  await screen.getByRole("button", { name: /Target Pair/ }).click();
  await expect(picker).toContainText("Target Pair");
  await expect(screen.locator("#numberPlayLaunch")).toBeHidden();
  await expect(screen.locator("#targetPairOperator")).toBeEmpty();
  const action = screen.locator("#numberPlayAction");
  await expect(action).toHaveText("Generate Set");
  await action.click();
  const cards = screen.locator(".number-play-number-card");
  await expect(cards).toHaveCount(4);
  await expect(screen.locator(".target-pair-instruction")).toContainText("Operator:");
  await expect(screen.locator("#targetPairOperator")).not.toBeEmpty();
  await expect(action).toHaveText("Next Set");

  await cards.nth(0).click();
  await cards.nth(1).click();
  await expect(screen.locator("#targetPairFeedback")).not.toBeEmpty();

  await picker.click();
  await expect(screen.locator("#numberPlayModeMenu")).toBeVisible();
  await expect(screen.locator('#numberPlayModeMenu [data-mode="target-pair"]')).toHaveAttribute("aria-current", "true");
});
