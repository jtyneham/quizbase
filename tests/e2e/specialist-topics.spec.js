import { test, expect } from "@playwright/test";
import { openGame } from "./helpers.js";

// These are intentionally player-facing browser checks, complementing the
// data-contract tests: a future data or config edit must not strand a curated
// specialist topic outside a picker or leave it unable to start a round.
const specialistTopics = ["Business & Money", "Comics", "Manga & Anime"];

for (const topic of specialistTopics) {
  test(`${topic} is selectable and playable in Missing Word`, async ({ page }) => {
    const screen = await openGame(page, { name: "Missing Word" });
    const trigger = screen.locator('[data-ui="topic-picker-trigger"]');

    await trigger.click();
    await expect(screen.getByRole("button", { name: topic, exact: true })).toBeVisible();
    await screen.locator("#topicClearButton").click();
    await screen.getByRole("button", { name: topic, exact: true }).click();
    await screen.locator("#topicDoneButton").click();
    await expect(trigger).toContainText(topic);

    const action = screen.locator('[data-ui="primary-action"]');
    await action.click();
    await expect(action).toHaveText("Reveal", { timeout: 4000 });
    await expect(screen.locator("#wordDisplay .slot").first()).toBeVisible();
  });

  test(`${topic} is selectable and playable in Hangman`, async ({ page }) => {
    const screen = await openGame(page, { name: "Hangman" });
    const trigger = screen.locator('[data-ui="topic-picker-trigger"]');

    await trigger.click();
    await expect(screen.getByRole("button", { name: topic, exact: true })).toBeVisible();
    await screen.locator("#clearTopics").click();
    await screen.getByRole("button", { name: topic, exact: true }).click();
    await screen.locator("#applyTopics").click();
    await expect(screen.locator("#slots .letter-slot").first()).toBeVisible();
  });
}
