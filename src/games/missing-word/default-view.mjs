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
              <label class="search-field"><span class="sr-only">Search topics</span><input type="search" placeholder="Search topics…"></label>
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

  const toolbar = createUtilityBar({ title, onHome: app.home, fullscreen: app.fullscreen });
  screen.querySelector('[data-region="toolbar"]').append(toolbar.element);
  lifecycle.add(toolbar.destroy);
  const slots = screen.querySelector(".word-slots");
  const primary = screen.querySelector('[data-action="primary"]');
  const message = screen.querySelector(".game-message");
  const details = screen.querySelector(".topic-picker");
  const options = screen.querySelector(".topic-options");
  const search = screen.querySelector('input[type="search"]');
  const topicLabel = screen.querySelector("[data-topic-label]");
  let pendingTopics = new Set(engine.snapshot().selectedTopics);
  let pendingAll = engine.snapshot().allTopics;

  function renderTopics() {
    const query = search.value.trim().toLowerCase();
    options.replaceChildren();
    for (const topic of topics.filter((value) => value.toLowerCase().includes(query))) {
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

  function render(state = engine.snapshot()) {
    slots.replaceChildren();
    if (!state.word) slots.textContent = "?";
    else [...state.word].forEach((character, index) => {
      const slot = document.createElement("span");
      slot.className = /[A-Z]/.test(character) ? "word-slot" : character === " " ? "word-space" : "word-punctuation";
      if (state.mask[index] && state.phase === "masked") { slot.classList.add("is-blank"); slot.textContent = ""; }
      else slot.textContent = character;
      slots.append(slot);
    });
    primary.textContent = state.phase === "masked" ? "Reveal" : "Next Word";
    primary.classList.toggle("is-reveal", state.phase === "masked");
    message.textContent = state.message;
    topicLabel.textContent = state.allTopics ? "All Topics" : state.selectedTopics.length === 1 ? state.selectedTopics[0] : `${state.selectedTopics.length} Topics`;
    screen.querySelectorAll("[data-difficulty]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.difficulty === state.difficulty)));
  }

  async function act() {
    const state = engine.snapshot();
    if (state.phase === "masked") render(engine.reveal());
    else {
      primary.disabled = true;
      screen.classList.add("is-generating");
      const next = engine.next();
      render(next);
      if (!app.reducedMotion && next.word) await new Promise((resolve) => setTimeout(resolve, 320));
      screen.classList.remove("is-generating");
      primary.disabled = false;
    }
  }

  lifecycle.listen(primary, "click", act);
  lifecycle.listen(screen.querySelector('[data-action="word"]'), "click", act);
  screen.querySelectorAll("[data-difficulty]").forEach((button) => lifecycle.listen(button, "click", () => { engine.setDifficulty(button.dataset.difficulty); render(); }));
  lifecycle.listen(search, "input", renderTopics);
  lifecycle.listen(screen.querySelector('[data-action="all"]'), "click", () => { pendingTopics.clear(); pendingAll = true; renderTopics(); });
  lifecycle.listen(screen.querySelector('[data-action="done"]'), "click", () => { engine.setTopics(pendingTopics, pendingAll); details.open = false; render(); });
  lifecycle.listen(details, "toggle", () => { if (details.open) { const state = engine.snapshot(); pendingTopics = new Set(state.selectedTopics); pendingAll = state.allTopics; renderTopics(); } });
  lifecycle.listen(window, "keydown", (event) => { if (event.code === "Space" && !event.target.closest("button,input,summary")) { event.preventDefault(); act(); } });
  renderTopics();
  render();
  return { element: screen, destroy: () => lifecycle.clear() };
}
