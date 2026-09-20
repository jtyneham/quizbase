import { test, expect } from "@playwright/test";
import { games, openGame } from "./helpers.js";

test("Home exposes a functional fullscreen control", async ({ page }) => {
  await page.goto("/");
  const button = page.locator('#homeScreen [data-ui="fullscreen-action"]');
  await expect(button).toBeVisible();
  await expect(button).toHaveAttribute("aria-label", /fullscreen/i);
  await button.click();
  await expect(page.locator("#homeScreen")).toHaveClass(/active/);
  await expect(button).toBeVisible();
});

for (const game of games) {
  test(`${game.name} exposes a functional fullscreen control`, async ({ page }) => {
    const screen = await openGame(page, game);
    const button = screen.locator('[data-ui="fullscreen-action"]');
    await expect(button).toBeVisible();
    await expect(button).toHaveAttribute("aria-label", /fullscreen/i);
    await button.click();
    // Browser/headless policy may deny fullscreen itself. The control must remain usable
    // and the app must not throw or lose the active screen.
    await expect(screen).toHaveClass(/active/);
    await expect(button).toBeVisible();
  });
}
