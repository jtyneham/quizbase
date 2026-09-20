import { LETTER_BUILDER_WORDS } from "../../data/letter-builder-words.js";
import { PersistentLetterBags, fillRandomLetters, findBestWords, isVowel } from "./letter-builder-logic.js";
import { bindFullscreenButton } from "./ui.js";

const INITIALISED_ROOTS = new WeakSet();
const ROUND_SECONDS = 30;

const TEMPLATE = `
  <div class="letter-builder-app" data-ui="game-root">
    <header class="letter-builder-topbar" data-ui="game-toolbar">
      <div class="letter-builder-utilities" data-ui="utility-actions">
        <button id="letterBuilderHomeButton" class="letter-builder-utility" data-ui="home-action" type="button" aria-label="Back to Home" title="Home">
          <img src="assets/home.svg" alt="" aria-hidden="true">
        </button>
        <button id="letterBuilderFullscreenButton" class="letter-builder-utility" data-ui="fullscreen-action" type="button" aria-label="Enter fullscreen" title="Fullscreen">
          <img id="letterBuilderFullscreenIcon" src="assets/fullscreen.svg" alt="" aria-hidden="true">
          <span class="visually-hidden" id="letterBuilderFullscreenLabel">Fullscreen</span>
        </button>
      </div>

      <div class="letter-builder-heading">
        <strong>Letter Builder</strong>
        <span>Build the longest word</span>
      </div>

      <div class="letter-builder-mode" data-ui="option-control" role="group" aria-label="Round mode">
        <button type="button" data-letter-mode="timed" aria-pressed="true">Timed</button>
        <button type="button" data-letter-mode="relaxed" aria-pressed="false">Relaxed</button>
      </div>
    </header>

    <main class="letter-builder-main">
      <section class="letter-builder-board" aria-label="Letter Builder round">
        <div class="letter-builder-roundline">
          <span id="letterBuilderRoundLabel">Round 1 · Choose nine letters</span>
        </div>

        <div id="letterBuilderTiles" class="letter-builder-tiles" data-ui="game-primary-surface" aria-label="Selected letters" aria-live="polite"></div>

        <div class="letter-builder-status">
          <div id="letterBuilderTimer" class="letter-builder-timer" data-ui="status-counter" aria-label="30 seconds">30</div>
          <div class="letter-builder-status-copy">
            <strong id="letterBuilderStatusTitle">Choose your letters</strong>
            <span id="letterBuilderStatusDetail">Pick vowels and consonants, or fill the remaining slots automatically.</span>
          </div>
        </div>

        <div class="letter-builder-pickers" aria-label="Choose letters">
          <button id="letterBuilderVowelButton" type="button" data-letter-type="vowel"><span>Vowel</span><small id="letterBuilderVowelCount">0 selected</small></button>
          <button id="letterBuilderConsonantButton" type="button" data-letter-type="consonant"><span>Consonant</span><small id="letterBuilderConsonantCount">0 selected</small></button>
          <button id="letterBuilderRandomButton" type="button"><span>Random Fill</span><small>Complete the row</small></button>
        </div>

        <div class="letter-builder-actions">
          <button id="letterBuilderPrimaryButton" class="letter-builder-primary" data-ui="primary-action" type="button" disabled>Start 30 Seconds</button>
          <button id="letterBuilderRevealButton" class="letter-builder-secondary" data-ui="secondary-action" type="button" disabled>Reveal Words</button>
        </div>

        <div id="letterBuilderResults" class="letter-builder-results" data-ui="supporting-panel" aria-live="polite" hidden>
          <strong id="letterBuilderResultTitle"></strong>
          <div id="letterBuilderWordList" class="letter-builder-word-list"></div>
          <span id="letterBuilderResultDetail"></span>
        </div>
      </section>
    </main>
  </div>`;

function required(root, selector) {
  const element = root.querySelector(selector);
  if (!element) throw new Error(`Letter Builder could not find '${selector}'.`);
  return element;
}

export function initLetterBuilder(root, app, { words = LETTER_BUILDER_WORDS, random = Math.random } = {}) {
  if (INITIALISED_ROOTS.has(root)) return;
  INITIALISED_ROOTS.add(root);
  root.innerHTML = TEMPLATE;

  const tiles = required(root, "#letterBuilderTiles");
  const timer = required(root, "#letterBuilderTimer");
  const roundLabel = required(root, "#letterBuilderRoundLabel");
  const statusTitle = required(root, "#letterBuilderStatusTitle");
  const statusDetail = required(root, "#letterBuilderStatusDetail");
  const vowelButton = required(root, "#letterBuilderVowelButton");
  const consonantButton = required(root, "#letterBuilderConsonantButton");
  const randomButton = required(root, "#letterBuilderRandomButton");
  const vowelCount = required(root, "#letterBuilderVowelCount");
  const consonantCount = required(root, "#letterBuilderConsonantCount");
  const primaryButton = required(root, "#letterBuilderPrimaryButton");
  const revealButton = required(root, "#letterBuilderRevealButton");
  const results = required(root, "#letterBuilderResults");
  const resultTitle = required(root, "#letterBuilderResultTitle");
  const wordList = required(root, "#letterBuilderWordList");
  const resultDetail = required(root, "#letterBuilderResultDetail");
  const modeButtons = [...root.querySelectorAll("[data-letter-mode]")];
  const bags = new PersistentLetterBags(random);

  let roundNumber = 1;
  let mode = "timed";
  let stage = "selecting";
  let letters = [];
  let previousRound = [];
  let remainingSeconds = ROUND_SECONDS;
  let deadline = 0;
  let timerId = null;

  function stopTimer() {
    if (timerId !== null) window.clearInterval(timerId);
    timerId = null;
  }

  function renderTiles() {
    const slots = Array.from({ length: 9 }, (_, index) => {
      const slot = document.createElement("span");
      const letter = letters[index];
      slot.className = `letter-builder-tile${letter ? "" : " empty"}`;
      slot.textContent = letter || "";
      slot.setAttribute("aria-label", letter ? `Letter ${index + 1}: ${letter}` : `Letter ${index + 1}: empty`);
      return slot;
    });
    tiles.replaceChildren(...slots);
  }

  function render() {
    const selectedVowels = letters.filter(isVowel).length;
    const selectedConsonants = letters.length - selectedVowels;
    const choosing = stage === "selecting";
    const ready = stage === "ready";
    const running = stage === "running";
    const finished = stage === "finished";
    const revealed = stage === "revealed";

    renderTiles();
    roundLabel.textContent = `Round ${roundNumber} · ${letters.length}/9 letters · ${selectedVowels} vowels · ${selectedConsonants} consonants`;
    vowelCount.textContent = `${selectedVowels} selected`;
    consonantCount.textContent = `${selectedConsonants} selected`;
    vowelButton.disabled = !choosing || letters.length >= 9;
    consonantButton.disabled = !choosing || letters.length >= 9;
    randomButton.disabled = !choosing || letters.length >= 9;
    modeButtons.forEach((button) => {
      button.disabled = running || finished || revealed;
      button.setAttribute("aria-pressed", String(button.dataset.letterMode === mode));
    });

    timer.textContent = mode === "relaxed" ? "∞" : String(remainingSeconds);
    timer.setAttribute("aria-label", mode === "relaxed" ? "Untimed round" : `${remainingSeconds} seconds`);
    timer.classList.toggle("warning", running && mode === "timed" && remainingSeconds <= 5);

    if (choosing) {
      statusTitle.textContent = "Choose your letters";
      statusDetail.textContent = "Pick vowels and consonants, or fill the remaining slots automatically.";
      primaryButton.textContent = mode === "timed" ? "Start 30 Seconds" : "Start Round";
      primaryButton.disabled = true;
    } else if (ready) {
      statusTitle.textContent = "Letters ready";
      statusDetail.textContent = "Start when everyone is ready. Keep answers private.";
      primaryButton.textContent = mode === "timed" ? "Start 30 Seconds" : "Start Round";
      primaryButton.disabled = false;
    } else if (running) {
      statusTitle.textContent = "Find your longest word";
      statusDetail.textContent = mode === "timed" ? "The round ends when the clock reaches zero." : "Take as long as the group needs.";
      primaryButton.textContent = "End Round";
      primaryButton.disabled = false;
    } else if (finished) {
      statusTitle.textContent = mode === "timed" && remainingSeconds === 0 ? "Time is up" : "Round ended";
      statusDetail.textContent = "Compare answers, then reveal the best available words.";
      primaryButton.textContent = "Next Round";
      primaryButton.disabled = false;
    } else {
      statusTitle.textContent = "Best words revealed";
      statusDetail.textContent = "Ready for another set?";
      primaryButton.textContent = "Next Round";
      primaryButton.disabled = false;
    }

    revealButton.disabled = !finished;
    revealButton.textContent = revealed ? "Words Revealed" : "Reveal Words";
    results.hidden = !revealed;
  }

  function addLetter(type) {
    if (stage !== "selecting" || letters.length >= 9) return;
    letters = [...letters, bags.draw(type, { chosen: letters, previousRound })];
    app.haptic?.(10);
    if (letters.length === 9) stage = "ready";
    render();
  }

  function randomFill() {
    if (stage !== "selecting" || letters.length >= 9) return;
    letters = fillRandomLetters({ letters, bags, previousRound, random });
    stage = "ready";
    app.haptic?.([10, 28, 10]);
    render();
  }

  function finishRound() {
    if (stage !== "running") return;
    stopTimer();
    stage = "finished";
    app.haptic?.([30, 45, 70]);
    render();
  }

  function tick() {
    const nextRemaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    if (nextRemaining !== remainingSeconds) {
      remainingSeconds = nextRemaining;
      if (remainingSeconds === 5) app.haptic?.(22);
      render();
    }
    if (remainingSeconds <= 0) finishRound();
  }

  function startRound() {
    if (stage !== "ready") return;
    stage = "running";
    results.hidden = true;
    if (mode === "timed") {
      remainingSeconds = ROUND_SECONDS;
      deadline = Date.now() + ROUND_SECONDS * 1000;
      timerId = window.setInterval(tick, 200);
    }
    app.haptic?.(18);
    render();
  }

  function revealWords() {
    if (stage !== "finished") return;
    const solution = findBestWords(words, letters);
    resultTitle.textContent = solution.longestLength
      ? `${solution.longestLength}-letter ${solution.totalAtLongestLength === 1 ? "solution" : "solutions"}`
      : "No solution found";
    wordList.replaceChildren(...solution.words.map((word) => {
      const chip = document.createElement("span");
      chip.textContent = word.toUpperCase();
      return chip;
    }));
    resultDetail.textContent = !solution.longestLength
      ? "Try a different letter mix next round."
      : solution.totalAtLongestLength > solution.words.length
        ? `Showing ${solution.words.length} of ${solution.totalAtLongestLength} longest words.`
        : `${solution.totalAtLongestLength} longest ${solution.totalAtLongestLength === 1 ? "word" : "words"} found.`;
    stage = "revealed";
    app.haptic?.([16, 24, 16]);
    render();
  }

  function nextRound() {
    if (stage !== "finished" && stage !== "revealed") return;
    previousRound = [...letters];
    letters = [];
    roundNumber += 1;
    remainingSeconds = ROUND_SECONDS;
    stage = "selecting";
    wordList.replaceChildren();
    render();
  }

  function handlePrimaryAction() {
    if (stage === "ready") startRound();
    else if (stage === "running") finishRound();
    else if (stage === "finished" || stage === "revealed") nextRound();
  }

  vowelButton.addEventListener("click", () => addLetter("vowel"));
  consonantButton.addEventListener("click", () => addLetter("consonant"));
  randomButton.addEventListener("click", randomFill);
  primaryButton.addEventListener("click", handlePrimaryAction);
  revealButton.addEventListener("click", revealWords);
  modeButtons.forEach((button) => button.addEventListener("click", () => {
    if (stage !== "selecting" && stage !== "ready") return;
    mode = button.dataset.letterMode;
    remainingSeconds = ROUND_SECONDS;
    render();
  }));

  required(root, "#letterBuilderHomeButton").addEventListener("click", () => {
    if (stage === "running") finishRound();
    app.haptic?.(12);
    app.showHome();
  });
  bindFullscreenButton({
    button: required(root, "#letterBuilderFullscreenButton"),
    icon: required(root, "#letterBuilderFullscreenIcon"),
    label: required(root, "#letterBuilderFullscreenLabel"),
    app
  });

  window.addEventListener("keydown", (event) => {
    if (!app.isScreenActive?.("letterbuilder") || event.repeat || /INPUT|SELECT|TEXTAREA/.test(event.target.tagName)) return;
    if (event.key.toLowerCase() === "v") addLetter("vowel");
    else if (event.key.toLowerCase() === "c") addLetter("consonant");
    else if (event.key.toLowerCase() === "r") randomFill();
    else if (event.code === "Space" && stage === "ready") {
      event.preventDefault();
      startRound();
    }
  });

  render();
}
