import { ODD_ONE_OUT_BLUEPRINTS } from "../../data/odd-one-out-knowledge.js";
import { chooseRound } from "./odd-one-out-logic.js";
import { bindFullscreenButton } from "./ui.js";

const INITIALISED_ROOTS = new WeakSet();
const RECENT_BLUEPRINT_LIMIT = 6;
const SUCCESS_HAPTIC = [22, 35, 48];
const ERROR_HAPTIC = [82, 32, 82];

/**
 * Shared-screen, quickfire Odd One Out game.
 *
 * There is deliberately no timer, score, player setup, or topic picker.
 * Players self-organise around the device, tap an answer, read the short
 * explanation, then explicitly request the next generated set.
 */
export function initOddOneOut(root, app) {
  if (INITIALISED_ROOTS.has(root)) return;
  INITIALISED_ROOTS.add(root);

  const cards = root.querySelector("#oddOneOutCards");
  const feedback = root.querySelector("#oddOneOutFeedback");
  const prompt = root.querySelector("#oddOneOutPrompt");
  const nextButton = root.querySelector("#oddOneOutNextButton");
  const difficultyButtons = [...root.querySelectorAll("[data-difficulty]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let setting = "mixed";
  let currentRound = null;
  let answered = false;
  let isChangingSet = false;
  let recentBlueprintIds = [];

  function setDifficulty(nextSetting) {
    setting = nextSetting;
    difficultyButtons.forEach((button) => {
      const active = button.dataset.difficulty === setting;
      button.setAttribute("aria-pressed", String(active));
      button.classList.toggle("active", active);
    });
  }

  function setFeedback(message, state = "") {
    feedback.textContent = message;
    feedback.dataset.state = state;
  }

  function renderRound(round) {
    currentRound = round;
    answered = false;
    prompt.textContent = "Odd One Out";
    setFeedback("");
    cards.replaceChildren(...round.choices.map((choice) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "odd-one-out-card";
      button.textContent = choice;
      button.dataset.choice = choice;
      button.setAttribute("aria-label", `Choose ${choice}`);
      button.addEventListener("click", () => answer(choice));
      return button;
    }));
    nextButton.textContent = "Next Set";
  }

  function answer(choice) {
    if (!currentRound || answered) return;
    answered = true;
    const correct = choice === currentRound.oddChoice;
    const buttons = [...cards.querySelectorAll(".odd-one-out-card")];

    buttons.forEach((button) => {
      button.disabled = true;
      if (button.dataset.choice === currentRound.oddChoice) button.classList.add("correct");
      else if (button.dataset.choice === choice) button.classList.add("wrong");
    });

    if (correct) {
      app.haptic?.(SUCCESS_HAPTIC);
      setFeedback(currentRound.explanation, "correct");
    } else {
      app.haptic?.(ERROR_HAPTIC);
      setFeedback(currentRound.explanation, "wrong");
    }

    if (!reducedMotion) cards.classList.add("resolved");
  }

  function generateSet() {
    if (isChangingSet) return;
    const round = chooseRound(ODD_ONE_OUT_BLUEPRINTS, setting, recentBlueprintIds);
    recentBlueprintIds = [...recentBlueprintIds, round.blueprintId].slice(-RECENT_BLUEPRINT_LIMIT);

    const showRound = () => {
      cards.classList.remove("resolved", "set-leaving");
      feedback.classList.remove("set-leaving");
      renderRound(round);
    };

    if (reducedMotion) {
      showRound();
      return;
    }

    // The first set gets the same entrance as every later set, but has no
    // outgoing cards or explanation to animate away.
    if (!currentRound) {
      showRound();
      cards.classList.add("set-entering");
      window.setTimeout(() => cards.classList.remove("set-entering"), 190);
      return;
    }

    isChangingSet = true;
    nextButton.disabled = true;
    cards.classList.add("set-leaving");
    feedback.classList.add("set-leaving");

    window.setTimeout(() => {
      showRound();
      cards.classList.add("set-entering");

      window.setTimeout(() => {
        cards.classList.remove("set-entering");
        nextButton.disabled = false;
        isChangingSet = false;
      }, 190);
    }, 110);
  }

  bindFullscreenButton({
    button: root.querySelector("#oddOneOutFullscreenButton"),
    icon: root.querySelector("#oddOneOutFullscreenIcon"),
    label: root.querySelector("#oddOneOutFullscreenLabel"),
    app
  });
  root.querySelector("#oddOneOutHomeButton").addEventListener("click", () => {
    app.haptic?.(12);
    app.showHome();
  });
  difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => setDifficulty(button.dataset.difficulty));
  });
  nextButton.addEventListener("click", generateSet);
  setDifficulty(setting);
}
