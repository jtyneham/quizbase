import { test, expect } from "@playwright/test";
import { openGame } from "./helpers.js";

const variants = [
  { name: "Hangman", screen: "hangmanScreen" },
  { name: "Hangman - Pokemon", screen: "hangmanPokemonScreen" },
];

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
      // Exercise the real topic chips. They re-render themselves on click; the
      // picker must remain open and support multiple selections.
      const chips = screen.locator("#topicsGrid .topic-chip").filter({ hasNotText: "Random" });
      const firstChip = chips.nth(0);
      const secondChip = chips.nth(1);
      await firstChip.click();
      await expect(overlay).toHaveAttribute("aria-hidden", "false");
      await expect(screen.locator("#topicsGrid .topic-chip.selected")).toHaveCount(1);
      await secondChip.click();
      await expect(overlay).toHaveAttribute("aria-hidden", "false");
      await expect(screen.locator("#topicsGrid .topic-chip.selected")).toHaveCount(2);
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
