const root = document.querySelector("#preview");

function section(title, description = "") {
  const wrapper = document.createElement("section");
  wrapper.className = "preview-section";
  wrapper.innerHTML = `<header><h2>${title}</h2><p>${description}</p></header>`;
  root.append(wrapper);
  return wrapper;
}

const intro = document.createElement("header");
intro.className = "preview-header";
intro.innerHTML = `<p class="preview-kicker">Quizbase v2</p><h1>Reskin state preview</h1><p>Deterministic visual fixtures for ordinary, hidden, adverse, and responsive states. This page is a coverage aid, not a required theme layout.</p><a href="index.html">Open application</a>`;
root.append(intro);

const controls = section("Shared utilities", "Check visual ownership, touch targets, specificity, and narrow-width composition.");
controls.innerHTML += `<div class="preview-surface"><header class="utility-bar"><div class="utility-bar__start"><button class="utility-control">Home</button></div><div class="utility-bar__center"><div class="utility-bar__title">Long contextual game title</div></div><div class="utility-bar__end"><button class="utility-control utility-control--fullscreen"><svg viewBox="0 0 24 24"><path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5"/></svg><span>Fullscreen</span></button></div></header></div>`;

const word = section("Missing Word", "Masked, revealed, disabled, and long-content treatments.");
word.innerHTML += `<div class="preview-grid"><div class="preview-surface"><div class="word-card"><span class="word-slots"><span class="word-slot">R</span><span class="word-slot is-blank"></span><span class="word-slot">S</span><span class="word-slot is-blank"></span><span class="word-slot">I</span><span class="word-slot">N</span><span class="word-slot">N</span><span class="word-slot is-blank"></span></span></div><button class="primary-action is-reveal">Reveal</button></div><div class="preview-surface"><div class="word-card"><span class="word-slots">EXTRAORDINARY VISUAL LANGUAGE</span></div><button class="primary-action" disabled>Generating</button></div></div>`;

const hangman = section("Hangman adversarial states", "Resize this page narrowly: all blanks in the two-line fixture must remain visible and countable.");
const phrase = "CASTLEVANIA SYMPHONY OF THE NIGHT";
const slots = [...phrase].map((character) => character === " " ? `<span class="hangman-space"></span>` : `<span class="hangman-letter"></span>`).join("");
hangman.innerHTML += `<div class="preview-grid"><div class="preview-surface"><div class="hangman-slots preview-long-answer">${slots}</div><p class="game-message">Two-line answer fixture</p></div><div class="preview-surface"><div class="hangman-feedback"><div><span class="feedback-label">Misses</span><div class="miss-list">Q · X · Z · V · J</div></div><p class="game-message">Wrong solution. One miss added.</p></div><div class="keyboard preview-keyboard">${"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter, index) => `<button class="key ${index < 4 ? "is-wrong" : index < 7 ? "is-correct" : ""}" ${index < 7 ? "disabled" : ""}>${letter}</button>`).join("")}</div></div></div>`;

const states = section("Semantic states", "Themes should assign roles rather than leaking colors from a previous skin.");
states.innerHTML += `<div class="preview-state-row"><button class="primary-action">Primary</button><button class="secondary-action">Secondary</button><p class="game-message">Neutral information</p><p class="game-message preview-success">Correct.</p><p class="game-message preview-danger">The answer was …</p></div>`;
