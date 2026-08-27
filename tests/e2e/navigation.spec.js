import { test, expect } from "@playwright/test";
import { assertNoPageOverflow, games, openGame } from "./helpers.js";

test.describe("launcher and navigation", () => {
  for (const game of games) {
    test(`${game.name} opens and returns Home`, async ({ page }) => {
      const screen = await openGame(page, game);
      await assertNoPageOverflow(page);
      await screen.locator('[data-ui="home-action"]').click();
      await expect(page.locator("#homeScreen")).toHaveClass(/active/);
      await expect(page).not.toHaveURL(/#/);
      await assertNoPageOverflow(page);
    });
  }
});
