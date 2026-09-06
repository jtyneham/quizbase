import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

// Repeatable visual review evidence, separate from Playwright's cleaned results.
const theme = process.env.QA_THEME || "automata";
const output = theme === "classic" ? ".visual-qa/classic" : ".visual-qa";
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const measurements = [];
const sizes = { phone: [390, 844], landscape: [844, 390], tablet: [800, 1280], desktop: [1280, 800] };
const routes = ["", "missingword", "missingwordpokemon", "hangman", "hangmanpokemon", "rngl", "number-play", "odd-one-out", "odd-one-out-pokemon"];
try {
  for (const [size, [width, height]] of Object.entries(sizes)) {
    if (process.env.QA_SIZE && process.env.QA_SIZE !== size) continue;
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
    await page.goto("http://127.0.0.1:8000");
    await page.locator("#themeSelect").selectOption(theme);
    async function capture(name) {
      await page.waitForTimeout(250); // Capture settled visual states, not a CSS transition frame.
      await page.screenshot({ path: `${output}/${size}-${name}.png` });
      const controls = await page.locator('.screen.active button:visible').evaluateAll(elements => elements.map(e => {
        const r = e.getBoundingClientRect();
        return { id: e.id, text: e.textContent.trim().slice(0, 25), x: r.x, y: r.y, w: r.width, h: r.height };
      }));
      measurements.push({ size, name, width, height, outside: controls.filter(r => r.x < -1 || r.y < -1 || r.x + r.w > width + 1 || r.y + r.h > height + 1) });
    }
    for (const route of routes) {
      await page.goto(`http://127.0.0.1:8000/${route ? `#${route}` : ""}`);
      if (route) await page.locator('.screen.active [data-ui="game-root"]').waitFor();
      await page.waitForTimeout(350); // Allow linked Shadow DOM styles to finish loading.
      await capture(route || "home");
      const screen = page.locator('.screen.active');
      if (route.startsWith("missingword")) {
        const action = screen.locator('[data-ui="primary-action"]');
        await action.click();
        await page.waitForTimeout(1500);
        await capture(`${route}-generated`);
        await action.click();
        await capture(`${route}-revealed`);
        await screen.locator('[data-ui="topic-picker-trigger"]').click();
        await capture(`${route}-topics`);
      } else if (route.startsWith("hangman")) {
        await screen.locator('#solveBtn').click();
        await screen.locator('#solveUi.open').waitFor();
        await capture(`${route}-solve`);
        await screen.locator('#solveCancelBtn').click();
        await screen.locator('[data-ui="topic-picker-trigger"]').click();
        await capture(`${route}-topics`);
      } else if (route === "rngl") {
        await screen.locator('[data-ui="primary-action"]').click();
        await page.waitForTimeout(1800);
        await screen.locator('.ideas-control').click();
        await capture('rngl-ideas');
      } else if (route.startsWith("odd-one-out")) {
        await screen.locator('[data-ui="primary-action"]').click();
        await screen.locator('.odd-one-out-card').first().waitFor();
        await capture(`${route}-round`);
        await screen.locator('.odd-one-out-card').first().click();
        await capture(`${route}-answer`);
      } else if (route === "number-play") {
        await screen.getByRole('button', { name: /Target Pair Tap/ }).click();
        await screen.locator('#numberPlayAction').click();
        await capture('target-pair');
        const cards = screen.locator('.number-play-number-card:visible');
        await cards.nth(0).click(); await cards.nth(1).click();
        await capture('target-pair-answer');
        await screen.locator('#numberPlayModeButton').click();
        await capture('number-modes');
        await screen.locator('#numberPlayModeMenu [data-mode="number-detective"]').click();
        await screen.locator('#numberDetectiveAction').click();
        await capture('odd-number-out');
        await screen.locator('#numberDetectiveChoices button').first().click();
        await capture('odd-number-out-answer');
      }
    }
    await page.close();
  }
} finally {
  await writeFile(`${output}/measurements.json`, JSON.stringify(measurements, null, 2));
  await browser.close();
}
console.log(`${measurements.length} screenshots captured; ${measurements.filter(m => m.outside.length).length} states with out-of-viewport controls.`);
