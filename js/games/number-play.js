import { NUMBER_PLAY_MODES, NUMBER_PLAY_MODE_BY_ID } from "../../data/number-play-modes.js";
import { createTargetPairRound, targetPairExplanation, targetPairRoundKey } from "../core/target-pair-logic.js";
import { bindFullscreenButton, bindOutsideDismiss } from "../core/ui.js";

const INITIALISED_ROOTS = new WeakSet();
const SUCCESS_HAPTIC = [22, 35, 48];
const ERROR_HAPTIC = [82, 32, 82];

function required(root, selector) {
  const element = root.querySelector(selector);
  if (!element) throw new Error(`Number Play could not find '${selector}'.`);
  return element;
}

function modeOption(mode, { compact = false, active = false, onChoose }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = compact ? "number-play-mode-option" : "number-play-launch-option";
  button.dataset.mode = mode.id;
  button.dataset.ui = compact ? "number-play-mode-option" : "number-play-mode-launch";
  if (compact) button.setAttribute("role", "menuitem");
  button.disabled = !mode.available;
  button.setAttribute("aria-current", active ? "true" : "false");
  button.innerHTML = `<strong>${mode.name}</strong><span>${mode.description}</span>${mode.available ? "" : '<em>Coming next</em>'}`;
  if (mode.available) button.addEventListener("click", () => onChoose(mode.id));
  return button;
}

/**
 * Shared Number Play shell. Mode metadata controls both the launch chooser and
 * the persistent picker; individual mode logic only owns its own playfield.
 */
export function initNumberPlay(root, app) {
  if (INITIALISED_ROOTS.has(root)) return;
  INITIALISED_ROOTS.add(root);

  const modeButton = required(root, "#numberPlayModeButton");
  const modeLabel = required(root, "#numberPlayModeLabel");
  const modeMenu = required(root, "#numberPlayModeMenu");
  const launch = required(root, "#numberPlayLaunch");
  const launchOptions = required(root, "#numberPlayLaunchOptions");
  const targetPair = required(root, "#numberPlayTargetPair");
  const targetValue = required(root, "#targetPairTarget");
  const targetOperator = required(root, "#targetPairOperator");
  const choices = required(root, "#targetPairChoices");
  const feedback = required(root, "#targetPairFeedback");
  const action = required(root, "#numberPlayAction");
  let activeModeId = null;
  let currentRound = null;
  let selectedValues = [];
  let answered = false;
  let recentRoundKeys = [];

  function setMenuOpen(open) {
    modeMenu.hidden = !open;
    modeButton.setAttribute("aria-expanded", String(open));
  }

  function renderModeLists() {
    modeMenu.replaceChildren(...NUMBER_PLAY_MODES.map((mode) => modeOption(mode, {
      compact: true,
      active: mode.id === activeModeId,
      onChoose: selectMode
    })));
    launchOptions.replaceChildren(...NUMBER_PLAY_MODES.map((mode) => modeOption(mode, {
      active: false,
      onChoose: selectMode
    })));
  }

  function showLaunch() {
    activeModeId = null;
    currentRound = null;
    selectedValues = [];
    answered = false;
    modeLabel.textContent = "Choose a game";
    targetValue.textContent = "—";
    targetOperator.textContent = "";
    launch.hidden = false;
    targetPair.hidden = true;
    action.hidden = true;
    renderModeLists();
  }

  function renderTargetPairRound(round) {
    currentRound = round;
    selectedValues = [];
    answered = false;
    targetValue.textContent = String(round.target);
    targetOperator.textContent = round.operation.symbol;
    feedback.textContent = "";
    feedback.dataset.state = "";
    choices.classList.remove("resolved", "set-entering");
    choices.replaceChildren(...round.values.map((value) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "number-play-number-card";
      button.dataset.value = String(value);
      button.dataset.ui = "number-play-choice";
      button.textContent = String(value);
      button.setAttribute("aria-label", `Choose ${value}`);
      button.addEventListener("click", () => chooseValue(value));
      return button;
    }));
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      choices.classList.add("set-entering");
      window.setTimeout(() => choices.classList.remove("set-entering"), 200);
    }
  }

  function updateChoiceStates() {
    [...choices.querySelectorAll(".number-play-number-card")].forEach((button) => {
      button.classList.toggle("selected", selectedValues.includes(Number(button.dataset.value)));
    });
  }

  function resolveRound(correct) {
    answered = true;
    const solution = new Set(currentRound.solution);
    [...choices.querySelectorAll(".number-play-number-card")].forEach((button) => {
      const value = Number(button.dataset.value);
      button.disabled = true;
      if (solution.has(value)) button.classList.add("correct");
      else if (selectedValues.includes(value)) button.classList.add("wrong");
    });
    choices.classList.add("resolved");
    feedback.textContent = targetPairExplanation(currentRound);
    feedback.dataset.state = correct ? "correct" : "wrong";
    app.haptic?.(correct ? SUCCESS_HAPTIC : ERROR_HAPTIC);
  }

  function chooseValue(value) {
    if (!currentRound || answered) return;
    if (selectedValues.includes(value)) {
      selectedValues = selectedValues.filter((selected) => selected !== value);
      updateChoiceStates();
      return;
    }
    if (selectedValues.length === 2) return;
    selectedValues = [...selectedValues, value];
    updateChoiceStates();
    if (selectedValues.length !== 2) return;
    const correct = currentRound.solution.every((solutionValue) => selectedValues.includes(solutionValue));
    resolveRound(correct);
  }

  function generateTargetPair() {
    const round = createTargetPairRound(Math.random, recentRoundKeys);
    recentRoundKeys = [...recentRoundKeys, targetPairRoundKey(round)].slice(-3);
    renderTargetPairRound(round);
    action.textContent = "Next Set";
  }

  function selectMode(modeId) {
    const mode = NUMBER_PLAY_MODE_BY_ID.get(modeId);
    if (!mode?.available) return;
    activeModeId = mode.id;
    modeLabel.textContent = mode.name;
    setMenuOpen(false);
    renderModeLists();
    launch.hidden = true;
    targetPair.hidden = mode.id !== "target-pair";
    action.hidden = mode.id !== "target-pair";
    currentRound = null;
    selectedValues = [];
    answered = false;
    feedback.textContent = "";
    feedback.dataset.state = "";
    choices.replaceChildren();
    targetValue.textContent = "—";
    targetOperator.textContent = "";
    action.textContent = "Generate Set";
  }

  modeButton.addEventListener("click", () => setMenuOpen(modeMenu.hidden));
  action.addEventListener("click", generateTargetPair);
  required(root, "#numberPlayHomeButton").addEventListener("click", () => {
    app.haptic?.(12);
    app.showHome();
  });
  bindFullscreenButton({
    button: required(root, "#numberPlayFullscreenButton"),
    icon: required(root, "#numberPlayFullscreenIcon"),
    label: required(root, "#numberPlayFullscreenLabel"),
    app
  });
  bindOutsideDismiss(root, modeMenu, () => setMenuOpen(false), [modeButton]);
  showLaunch();
}
