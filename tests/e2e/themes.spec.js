import { test, expect } from "@playwright/test";
import { games, assertNoPageOverflow } from "./helpers.js";

test("theme choice survives routes, reload, history, and a return to Classic", async ({ page }) => {
  await page.goto("/");
  const picker = page.getByRole("combobox", { name: "Themes" });
  await expect(picker.locator("option")).toHaveText(["Classic", "Automata"]);
  await picker.selectOption("automata");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "automata");
  for (const game of games) {
    await page.goto(`/${game.hash}`);
    const root = page.locator(`#${game.screen} [data-ui="game-root"]`);
    await expect(root).toBeVisible();
    await expect(root).toHaveCSS("background-color", "rgb(214, 211, 189)");
    await root.locator('[data-ui="home-action"]').click();
    await expect(picker).toHaveValue("automata");
    await assertNoPageOverflow(page);
  }
  await page.getByRole("button", { name: /^Missing Word/ }).click();
  await expect(page.locator("#missingWordScreen")).toHaveClass(/active/);
  await expect(page).toHaveURL(/#missingword$/);
  await page.goBack();
  await expect(picker).toBeVisible();
  await page.goForward();
  await expect(page.locator("#missingWordScreen")).toHaveClass(/active/);
  await page.locator('#missingWordScreen [data-ui="home-action"]').click();
  await picker.selectOption("classic");
  await page.reload();
  await expect(picker).toHaveValue("classic");
  await page.goto("/#missingword");
  await expect(page.locator('quiz-missing-word')).toHaveAttribute("data-theme", "classic");
  await expect(page.locator('#missingWordScreen #wordCard')).toHaveCSS("background-color", "rgb(255, 255, 255)");
});

test("unknown saved themes and unavailable storage fall back safely", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("quizbase.theme", "not-a-theme"));
  await page.reload();
  await expect(page.getByRole("combobox", { name: "Themes" })).toHaveValue("classic");
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Disabled", "SecurityError"); } });
  });
  await page.reload();
  const picker = page.getByRole("combobox", { name: "Themes" });
  await expect(picker).toHaveValue("classic");
  await picker.selectOption("automata");
  await page.getByRole("button", { name: /^Hangman/ }).click();
  await expect(page.locator('#hangmanScreen [data-ui="game-root"]')).toHaveCSS("background-color", "rgb(214, 211, 189)");
});

test("Home theme picker and launch controls fit without intersecting", async ({ page }) => {
  await page.goto("/");
  const picker = await page.locator('[data-ui="theme-picker"]').boundingBox();
  const controls = page.locator('[data-ui="game-launch"]');
  for (const control of await controls.all()) {
    const box = await control.boundingBox();
    expect(box.y).toBeGreaterThanOrEqual(picker.y + picker.height);
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.y + box.height).toBeLessThanOrEqual(page.viewportSize().height);
  }
});

test("game actions and the entire Hangman keyboard remain on screen", async ({ page }) => {
  for (const game of games) {
    await page.goto(`/${game.hash}`);
    const screen = page.locator(`#${game.screen}`);
    await expect(screen.locator('[data-ui="game-root"]')).toBeVisible();
    if (game.hash === "#number-play") {
      await screen.getByRole("button", { name: /Target Pair Tap/ }).click();
      await screen.locator("#numberPlayAction").click();
    }
    if (game.hash.includes("hangman")) {
      await expect(screen.locator('[data-key="ENTER"]')).toBeInViewport({ ratio: 1 });
      await screen.locator("#solveBtn").click();
      await expect(screen.locator("#solveCancelBtn")).toBeInViewport({ ratio: 1 });
      await expect(screen.locator('[data-key="ENTER"]')).toBeInViewport({ ratio: 1 });
      await screen.locator("#solveCancelBtn").click();
    }
    if (game.hash.startsWith("#missingword")) {
      await screen.locator('[data-ui="topic-picker-trigger"]').click();
      await expect(screen.locator("#topicClearButton")).toBeInViewport({ ratio: 1 });
      await expect(screen.locator("#topicDoneButton")).toBeInViewport({ ratio: 1 });
      await screen.locator("#topicDoneButton").click();
    }
    for (const control of await screen.locator('[data-ui="home-action"], [data-ui="fullscreen-action"], [data-ui="primary-action"]:visible').all()) {
      await expect(control).toBeInViewport({ ratio: 1 });
    }
  }
});
