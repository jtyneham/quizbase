import { test, expect } from "@playwright/test";
import { openGame } from "./helpers.js";

const PILOT_LABELS = new Set([
  "Thunderbolt", "Earthquake", "Calm Mind", "Competitive",
  "Blastoise", "Vaporeon", "Milotic", "Swampert",
  "Burn", "Poison", "Paralysis", "Confusion",
  "Pecha Berry", "Cheri Berry", "Rawst Berry", "Oran Berry"
]);

test("Pokémon Odd One Out reuses the shared quickfire flow with its reviewed pilot data", async ({ page }) => {
  const screen = await openGame(page, { name: "Odd One Out - Pokemon" });
  const next = screen.locator("#oddOneOutPokemonNextButton");
  const cards = screen.locator(".odd-one-out-card");

  await expect(next).toHaveText("Generate Set");
  await next.click();
  await expect(cards).toHaveCount(4);

  for (const label of await cards.allTextContents()) {
    expect(PILOT_LABELS.has(label)).toBeTruthy();
  }

  await cards.first().click();
  await expect(screen.locator("#oddOneOutPokemonFeedback")).not.toBeEmpty();
  await expect(next).toHaveText("Next Set");
});
