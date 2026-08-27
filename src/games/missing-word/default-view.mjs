import { Lifecycle } from "../../core/lifecycle.mjs";
import { createUtilityBar } from "../../components/utility-bar.mjs";

export function createMissingWordView({ title, engine, topics, app }) {
  const lifecycle = new Lifecycle();
  const screen = document.createElement("section");
  screen.className = "screen game-screen missing-word-screen";
  screen.innerHTML = `
    <div class="missing-word-layout">
      <div data-region="toolbar"></div>
      <main class="missing-word-main">
        <div class="selector-row">
          <details class="topic-picker">
            <summary><span data-topic-label>Topics</span><span aria-hidden="true">▾</span></summary>
            <div class="topic-panel">
              <div class="topic-options"></div>
              <div class="topic-actions"><button type="button" data-action="all">Use all</button><button type="button" data-action="done">Done</button></div>
            </div>
          </details>
          <div class="segmented-control" aria-label="Difficulty">
            <button type="button" data-difficulty="mixed">Mixed</button>
            <button type="button" data-difficulty="medium">Medium</button>
            <button type="button" data-difficulty="hard">Hard</button>
          </div>
        </div>
        <button class="word-card" type="button" data-action="word" aria-label="Game action"><span class="word-slots" aria-live="polite"></span></button>
        <button class="primary-action" type="button" data-action="primary">Next Word</button>
        <p class="game-message" role="status"></p>
      </main>
    </div>`;

  const topicPicker = screen.querySelector(".topic-picker");
  const difficulty = screen.querySelector(".segmented-control");
  const toolbar = createUtilityBar({ onHome: app.home, fullscreen: app.fullscreen, center: topicPicker, trailing: difficulty });
  screen.querySelector('[data-region="toolbar"]').append(toolbar.element);
  screen.querySelector(".selector-row").remove();
  lifecycle.add(toolbar.destroy);
  const slots = screen.querySelector(".word-slots");
  const primary = screen.querySelector('[data-action="primary"]');
  const message = screen.querySelector(".game-message");
  const options = screen.querySelector(".topic-options");
  const topicLabel = screen.querySelector("[data-topic-label]");
  let pendingTopics = new Set(engine.snapshot().selectedTopics);
  let pendingAll = engine.snapshot().allTopics;
  let generationRunning = false;
  let generationTimer = null;
  let reelTimer = null;
  const reelAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function renderTopics() {
    options.replaceChildren();
    for (const topic of topics) {
      const option = document.createElement("label");
      option.className = "topic-option";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = !pendingAll && pendingTopics.has(topic);
      checkbox.addEventListener("change", () => {
        pendingAll = false;
        checkbox.checked ? pendingTopics.add(topic) : pendingTopics.delete(topic);
      });
      option.append(checkbox, document.createTextNode(topic));
      options.append(option);
    }
  }

  function render(state = engine.snapshot(), { spinning = false } = {}) {
    slots.replaceChildren();
    if (!state.word) slots.textContent = "?";
    else [...state.word].forEach((character, index) => {
      const slot = document.createElement("span");
      slot.className = /[A-Z]/.test(character) ? "word-slot" : character === " " ? "word-space" : "word-punctuation";
      if (state.mask[index] && state.phase === "masked") { slot.classList.add("is-blank"); slot.textContent = ""; }
      else {
        slot.textContent = character;
        if (spinning && !state.mask[index]) {
          slot.classList.add("is-reeling");
          slot.textContent = "X";
        }
      }
      slots.append(slot);
    });
    primary.textContent = state.phase === "masked" ? "Reveal" : "Next Word";
    primary.classList.toggle("is-reveal", state.phase === "masked");
    message.textContent = state.message;
    topicLabel.textContent = state.allTopics ? "All Topics" : state.selectedTopics.length === 1 ? state.selectedTopics[0] : `${state.selectedTopics.length} Topics`;
    screen.querySelectorAll("[data-difficulty]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.difficulty === state.difficulty)));
  }

  async function act() {
    if (generationRunning) {
      generationRunning = false;
      window.clearTimeout(generationTimer);
      window.clearInterval(reelTimer);
      screen.classList.remove("is-generating");
      render(engine.snapshot());
      primary.disabled = false;
      return;
    }
    const state = engine.snapshot();
    if (state.phase === "masked") {
      screen.classList.add("is-revealing");
      await new Promise((resolve) => setTimeout(resolve, app.reducedMotion ? 0 : 180));
      render(engine.reveal());
      screen.classList.remove("is-revealing");
    }
    else {
      primary.disabled = true;
      screen.classList.add("is-generating");
      const next = engine.next();
      generationRunning = true;
      render(next, { spinning: !app.reducedMotion });
      if (!app.reducedMotion) {
        reelTimer = window.setInterval(() => {
          screen.querySelectorAll(".word-slot.is-reeling").forEach((slot) => {
            slot.textContent = reelAlphabet[Math.floor(Math.random() * reelAlphabet.length)];
          });
        }, 68);
      }
      await new Promise((resolve) => {
        generationTimer = window.setTimeout(resolve, app.reducedMotion ? 0 : 1150);
      });
      if (!generationRunning) return;
      generationRunning = false;
      window.clearInterval(reelTimer);
      render(next);
      screen.classList.remove("is-generating");
      primary.disabled = false;
    }
  }

  lifecycle.listen(primary, "click", act);
  lifecycle.listen(screen.querySelector('[data-action="word"]'), "click", act);
  screen.querySelectorAll("[data-difficulty]").forEach((button) => lifecycle.listen(button, "click", () => { engine.setDifficulty(button.dataset.difficulty); render(); }));
  lifecycle.listen(screen.querySelector('[data-action="all"]'), "click", () => { pendingTopics.clear(); pendingAll = true; renderTopics(); });
  lifecycle.listen(screen.querySelector('[data-action="done"]'), "click", () => { engine.setTopics(pendingTopics, pendingAll); topicPicker.open = false; render(); });
  lifecycle.listen(topicPicker, "toggle", () => { if (topicPicker.open) { const state = engine.snapshot(); pendingTopics = new Set(state.selectedTopics); pendingAll = state.allTopics; renderTopics(); } });
  lifecycle.listen(document, "pointerdown", (event) => { if (topicPicker.open && !topicPicker.contains(event.target)) topicPicker.open = false; });
  lifecycle.add(() => window.clearTimeout(generationTimer));
  lifecycle.add(() => window.clearInterval(reelTimer));
  lifecycle.listen(window, "keydown", (event) => { if (event.code === "Space" && !event.target.closest("button,input,summary")) { event.preventDefault(); act(); } });
  renderTopics();
  render();
  return { element: screen, destroy: () => lifecycle.clear() };
}
