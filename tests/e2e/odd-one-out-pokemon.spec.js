import { test, expect } from "@playwright/test";
import { POKEMON_ODD_ONE_OUT_ACTIVE_TERMS } from "../../data/odd-one-out-pokemon-knowledge.js";
import { openGame } from "./helpers.js";

const ACTIVE_LABELS = new Set(POKEMON_ODD_ONE_OUT_ACTIVE_TERMS.map(({ label }) => label));

test("Pokémon Odd One Out reuses the shared quickfire flow with its reviewed data", async ({ page }) => {
  const screen = await openGame(page, { name: "Odd One Out - Pokemon" });
  const next = screen.locator("#oddOneOutPokemonNextButton");
  const cards = screen.locator(".odd-one-out-card");

  await expect(next).toHaveText("Generate Set");
  await next.click();
  await expect(cards).toHaveCount(4);

  for (const label of await cards.allTextContents()) {
    expect(ACTIVE_LABELS.has(label)).toBeTruthy();
  }

  await cards.first().click();
  await expect(screen.locator("#oddOneOutPokemonFeedback")).not.toBeEmpty();
  await expect(next).toHaveText("Next Set");
});
