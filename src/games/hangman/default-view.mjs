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
    <section class="hangman-artwork">${hangmanArtwork()}</section>
    <section class="hangman-word" aria-label="Word"><div class="hangman-slots" aria-live="polite"></div></section>
    <section class="hangman-feedback"><div><span class="feedback-label">Misses</span><div class="miss-list"></div></div><p class="game-message" role="status"></p></section>
    <section class="solve-region">
      <div class="solve-box" hidden><input type="text" aria-label="Full answer" autocomplete="off"><button type="button" data-action="cancel-solve">Cancel</button></div>
      <div class="round-actions"><button type="button" class="secondary-action" data-action="solve">Solve Word</button><button type="button" class="primary-action" data-action="new">New Word</button></div>
    </section>
    <div class="keyboard" aria-label="Letter keyboard"></div>
    <dialog class="topic-dialog"><form method="dialog"><header><h2>Topics</h2><button value="cancel" aria-label="Close">×</button></header><div class="dialog-topics"></div><footer><button value="cancel">Cancel</button><button value="apply" class="primary-action">Apply</button></footer></form></dialog>
  </div>`;

  const topicButton = screen.querySelector('[data-action="topics"]');
  const toolbar = createUtilityBar({ onHome: app.home, fullscreen: app.fullscreen, center: topicButton });
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

  const keyRows = [
    LETTERS.slice(0, 10),
    LETTERS.slice(10, 19),
    LETTERS.slice(19),
    ["SPACE", "BACKSPACE", "ENTER"]
  ];
  for (const rowLetters of keyRows) {
    const row = document.createElement("div");
    row.className = "keyboard-row";
    for (const letter of rowLetters) {
      const key = document.createElement("button");
      key.type = "button";
      key.className = `key key--${letter.toLowerCase()}`;
      key.dataset.letter = letter;
      key.textContent = letter === "BACKSPACE" ? "⌫" : letter === "SPACE" ? "" : letter === "ENTER" ? "↵" : letter;
      lifecycle.listen(key, "click", () => {
        const state = engine.snapshot();
        if (letter === "ENTER" && state.phase === "solving") render(engine.submitSolve());
        else if (letter === "BACKSPACE" && state.phase === "solving") {
          engine.editSolve(state.solveBuffer.slice(0, -1));
          render();
        } else if (letter === "SPACE" && state.phase === "solving" && state.solveBuffer && !state.solveBuffer.endsWith(" ")) {
          engine.editSolve(`${state.solveBuffer} `);
          render();
        } else if (/^[A-Z]$/.test(letter) && state.phase === "solving") {
          engine.editSolve(`${state.solveBuffer}${letter}`);
          render();
        } else if (/^[A-Z]$/.test(letter)) render(engine.guess(letter));
      });
      row.append(key);
    }
    keyboard.append(row);
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
    screen.querySelector(".game-message").textContent = (["won", "lost"].includes(state.phase) || state.message.startsWith("Wrong solution")) ? state.message : "";
    screen.querySelectorAll("[data-stage]").forEach((part) => part.classList.toggle("is-visible", Number(part.dataset.stage) <= state.wrongCount));
    keyboard.querySelectorAll(".key").forEach((key) => {
      const used = state.guessed.includes(key.dataset.letter) || state.misses.includes(key.dataset.letter);
      const special = ["SPACE", "BACKSPACE", "ENTER"].includes(key.dataset.letter);
      key.disabled = special ? state.phase !== "solving" : state.phase !== "playing" || used;
      key.classList.toggle("is-correct", state.guessed.includes(key.dataset.letter));
      key.classList.toggle("is-wrong", state.misses.includes(key.dataset.letter));
    });
    const solving = state.phase === "solving";
    solveBox.hidden = !solving;
    screen.querySelector(".round-actions").hidden = solving;
    screen.querySelector('[data-action="solve"]').hidden = !["playing"].includes(state.phase);
    if (solving) solveInput.value = state.solveBuffer;
    if (["won", "lost"].includes(state.phase)) { newButton.textContent = "New Word"; confirmNew = false; }
  }

  lifecycle.listen(screen.querySelector('[data-action="solve"]'), "click", () => render(engine.enterSolve()));
  lifecycle.listen(screen.querySelector('[data-action="cancel-solve"]'), "click", () => render(engine.cancelSolve()));
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
  lifecycle.listen(document, "pointerdown", (event) => { if (dialog.open && event.target === dialog) dialog.close("cancel"); });
  lifecycle.listen(dialog, "click", (event) => { if (event.target === dialog) dialog.close("cancel"); });
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
