import { Lifecycle } from "../../core/lifecycle.mjs";
import { createUtilityBar } from "../../components/utility-bar.mjs";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function hangmanArtwork() {
  return `<svg class="hangman-art" viewBox="0 0 300 220" aria-label="Hangman drawing">
    <path class="scaffold" d="M30 207h110M55 207V18h145v30M200 48v22"/>
    <circle data-stage="1" cx="200" cy="88" r="18"/>
    <path data-stage="2" d="M200 106v50"/>
    <path data-stage="3" d="M200 120l-34 27"/>
    <path data-stage="4" d="M200 120l34 27"/>
    <path data-stage="5" d="M200 156l-28 40"/>
    <path data-stage="6" d="M200 156l28 40"/>
  </svg>`;
}

export function createHangmanView({ title, engine, topics, applyTopics, app }) {
  const lifecycle = new Lifecycle();
  const screen = document.createElement("section");
  screen.className = "screen game-screen hangman-screen";
  screen.innerHTML = `<div class="hangman-layout">
    <div data-region="toolbar"></div>
    <div class="hangman-subbar"><button type="button" class="secondary-control" data-action="topics">Topics <span data-topic-count></span></button><output class="miss-counter"></output></div>
    <section class="hangman-word" aria-label="Word"><div class="hangman-slots" aria-live="polite"></div></section>
    <section class="hangman-artwork">${hangmanArtwork()}</section>
    <section class="hangman-feedback"><div><span class="feedback-label">Misses</span><div class="miss-list"></div></div><p class="game-message" role="status"></p></section>
    <section class="solve-region">
      <div class="solve-box" hidden><input type="text" aria-label="Full answer" autocomplete="off"><button type="button" data-action="submit-solve">Submit</button><button type="button" data-action="cancel-solve">Cancel</button></div>
      <div class="round-actions"><button type="button" class="secondary-action" data-action="solve">Solve Word</button><button type="button" class="primary-action" data-action="new">New Word</button></div>
    </section>
    <div class="keyboard" aria-label="Letter keyboard"></div>
    <dialog class="topic-dialog"><form method="dialog"><header><h2>Topics</h2><button value="cancel" aria-label="Close">×</button></header><div class="dialog-topics"></div><footer><button value="cancel">Cancel</button><button value="apply" class="primary-action">Apply</button></footer></form></dialog>
  </div>`;

  const toolbar = createUtilityBar({ title, onHome: app.home, fullscreen: app.fullscreen });
  screen.querySelector('[data-region="toolbar"]').append(toolbar.element);
  lifecycle.add(toolbar.destroy);
  const slots = screen.querySelector(".hangman-slots");
  const keyboard = screen.querySelector(".keyboard");
  const solveBox = screen.querySelector(".solve-box");
  const solveInput = solveBox.querySelector("input");
  const dialog = screen.querySelector("dialog");
  const topicContainer = screen.querySelector(".dialog-topics");
  const newButton = screen.querySelector('[data-action="new"]');
  let confirmNew = false;
  let confirmTimer;
  let selectedTopics = new Set(topics.defaultSelection);

  for (const letter of LETTERS) {
    const key = document.createElement("button");
    key.type = "button";
    key.className = "key";
    key.dataset.letter = letter;
    key.textContent = letter;
    lifecycle.listen(key, "click", () => render(engine.guess(letter)));
    keyboard.append(key);
  }

  function renderTopicOptions() {
    topicContainer.replaceChildren();
    for (const topic of topics.values) {
      const label = document.createElement("label");
      label.className = "topic-option";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = topic;
      input.checked = selectedTopics.has(topic);
      label.append(input, document.createTextNode(topic));
      topicContainer.append(label);
    }
  }

  function render(state = engine.snapshot()) {
    slots.replaceChildren();
    for (const item of state.characters) {
      const slot = document.createElement("span");
      if (!item.playable) {
        slot.className = item.character === " " ? "hangman-space" : "hangman-punctuation";
        slot.textContent = item.character;
      } else {
        slot.className = "hangman-letter";
        slot.textContent = item.revealed ? item.character : "";
      }
      slots.append(slot);
    }
    screen.querySelector(".miss-counter").textContent = `${state.wrongCount} / ${state.maxMisses} misses`;
    screen.querySelector(".miss-list").textContent = state.misses.length ? state.misses.join(" · ") : "—";
    screen.querySelector(".game-message").textContent = state.message;
    screen.querySelectorAll("[data-stage]").forEach((part) => part.classList.toggle("is-visible", Number(part.dataset.stage) <= state.wrongCount));
    keyboard.querySelectorAll(".key").forEach((key) => {
      const used = state.guessed.includes(key.dataset.letter) || state.misses.includes(key.dataset.letter);
      key.disabled = state.phase !== "playing" || used;
      key.classList.toggle("is-correct", state.guessed.includes(key.dataset.letter));
      key.classList.toggle("is-wrong", state.misses.includes(key.dataset.letter));
    });
    const solving = state.phase === "solving";
    solveBox.hidden = !solving;
    screen.querySelector(".round-actions").hidden = solving;
    screen.querySelector('[data-action="solve"]').hidden = !["playing"].includes(state.phase);
    if (solving && document.activeElement !== solveInput) { solveInput.value = state.solveBuffer; solveInput.focus(); }
    if (["won", "lost"].includes(state.phase)) { newButton.textContent = "New Word"; confirmNew = false; }
  }

  lifecycle.listen(screen.querySelector('[data-action="solve"]'), "click", () => render(engine.enterSolve()));
  lifecycle.listen(screen.querySelector('[data-action="cancel-solve"]'), "click", () => render(engine.cancelSolve()));
  lifecycle.listen(screen.querySelector('[data-action="submit-solve"]'), "click", () => { engine.editSolve(solveInput.value); render(engine.submitSolve()); });
  lifecycle.listen(solveInput, "input", () => engine.editSolve(solveInput.value));
  lifecycle.listen(solveInput, "keydown", (event) => { if (event.key === "Enter") { event.preventDefault(); engine.editSolve(solveInput.value); render(engine.submitSolve()); } });
  lifecycle.listen(newButton, "click", () => {
    const state = engine.snapshot();
    if (!["playing", "solving"].includes(state.phase) || confirmNew) { window.clearTimeout(confirmTimer); confirmNew = false; newButton.textContent = "New Word"; render(engine.start()); return; }
    confirmNew = true; newButton.textContent = "New Word?";
    confirmTimer = window.setTimeout(() => { confirmNew = false; newButton.textContent = "New Word"; }, 2200);
  });
  lifecycle.add(() => window.clearTimeout(confirmTimer));
  lifecycle.listen(screen.querySelector('[data-action="topics"]'), "click", () => { renderTopicOptions(); dialog.showModal(); });
  lifecycle.listen(dialog, "close", () => {
    if (dialog.returnValue !== "apply") return;
    selectedTopics = new Set([...topicContainer.querySelectorAll("input:checked")].map((input) => input.value));
    if (!selectedTopics.size) selectedTopics = new Set(topics.defaultSelection);
    applyTopics(engine, selectedTopics);
    screen.querySelector("[data-topic-count]").textContent = selectedTopics.size === 1 ? [...selectedTopics][0] : selectedTopics.size;
    render(engine.start());
  });
  lifecycle.listen(window, "keydown", (event) => {
    if (event.target.closest("input,button") || dialog.open) return;
    if (/^[a-z]$/i.test(event.key)) render(engine.guess(event.key));
  });
  screen.querySelector("[data-topic-count]").textContent = selectedTopics.size === 1 ? [...selectedTopics][0] : selectedTopics.size;
  render(engine.start());
  return { element: screen, destroy: () => lifecycle.clear() };
}
