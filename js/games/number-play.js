import { NUMBER_PLAY_MODES, NUMBER_PLAY_MODE_BY_ID } from "../../data/number-play-modes.js";
import { createNumberDetectiveRound, numberDetectiveRoundKey } from "../core/number-detective-logic.js";
import { createNumberGapRound, numberGapExplanation, numberGapRoundKey } from "../core/number-gap-logic.js";
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
  const numberGap = required(root, "#numberPlayNumberGap");
  const numberGapDirection = required(root, "#numberGapDirection");
  const numberGapInstruction = required(root, "#numberGapInstruction");
  const numberGapChoices = required(root, "#numberGapChoices");
  const numberGapFeedback = required(root, "#numberGapFeedback");
  const numberGapAction = required(root, "#numberGapAction");
  const numberDetective = required(root, "#numberPlayNumberDetective");
  const numberDetectiveChoices = required(root, "#numberDetectiveChoices");
  const numberDetectiveFeedback = required(root, "#numberDetectiveFeedback");
  const numberDetectiveAction = required(root, "#numberDetectiveAction");
  const difficultyButtons = [...root.querySelectorAll("[data-number-play-difficulty]")];
  let activeModeId = null;
  let currentRound = null;
  let activeRoundUi = null;
  let selectedValues = [];
  let answered = false;
  let recentRoundKeys = [];
  let recentOperationIds = [];
  let recentNumberGapKeys = [];
  let currentNumberDetectiveRound = null;
  let numberDetectiveAnswered = false;
  let recentNumberDetectiveKeys = [];
  let recentNumberDetectivePatternIds = [];
  let difficultySetting = "mixed";

  function setDifficulty(nextSetting) {
    difficultySetting = nextSetting;
    difficultyButtons.forEach((button) => {
      const active = button.dataset.numberPlayDifficulty === difficultySetting;
      button.setAttribute("aria-pressed", String(active));
      button.classList.toggle("active", active);
    });
  }

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
    activeRoundUi = null;
    selectedValues = [];
    answered = false;
    modeLabel.textContent = "Choose a game";
    targetValue.textContent = "—";
    targetOperator.textContent = "";
    numberGapDirection.textContent = "—";
    numberGapInstruction.textContent = "Tap two numbers.";
    currentNumberDetectiveRound = null;
    numberDetectiveAnswered = false;
    numberDetectiveChoices.replaceChildren();
    numberDetectiveFeedback.textContent = "";
    numberDetectiveFeedback.dataset.state = "";
    launch.hidden = false;
    targetPair.hidden = true;
    numberGap.hidden = true;
    numberDetective.hidden = true;
    action.hidden = true;
    numberGapAction.hidden = true;
    numberDetectiveAction.hidden = true;
    renderModeLists();
  }

  function renderTwoChoiceRound(round, ui) {
    currentRound = round;
    activeRoundUi = ui;
    selectedValues = [];
    answered = false;
    ui.feedback.textContent = "";
    ui.feedback.dataset.state = "";
    ui.choices.classList.remove("resolved", "set-entering");
    ui.choices.replaceChildren(...round.values.map((value) => {
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
      ui.choices.classList.add("set-entering");
      window.setTimeout(() => ui.choices.classList.remove("set-entering"), 200);
    }
  }

  function renderTargetPairRound(round) {
    targetValue.textContent = String(round.target);
    targetOperator.textContent = round.operation.symbol;
    renderTwoChoiceRound(round, { choices, feedback, explain: targetPairExplanation });
  }

  function renderNumberGapRound(round) {
    numberGapDirection.textContent = round.type.label;
    numberGapInstruction.textContent = round.type.instruction;
    renderTwoChoiceRound(round, { choices: numberGapChoices, feedback: numberGapFeedback, explain: numberGapExplanation });
  }

  function updateChoiceStates() {
    if (!activeRoundUi) return;
    [...activeRoundUi.choices.querySelectorAll(".number-play-number-card")].forEach((button) => {
      button.classList.toggle("selected", selectedValues.includes(Number(button.dataset.value)));
    });
  }

  function resolveRound(correct) {
    answered = true;
    const solution = new Set(currentRound.solution);
    [...activeRoundUi.choices.querySelectorAll(".number-play-number-card")].forEach((button) => {
      const value = Number(button.dataset.value);
      button.disabled = true;
      if (solution.has(value)) button.classList.add("correct");
      else if (selectedValues.includes(value)) button.classList.add("wrong");
    });
    activeRoundUi.choices.classList.add("resolved");
    activeRoundUi.feedback.textContent = activeRoundUi.explain(currentRound);
    activeRoundUi.feedback.dataset.state = correct ? "correct" : "wrong";
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
    const round = createTargetPairRound(Math.random, { recentKeys: recentRoundKeys, recentOperationIds }, difficultySetting);
    // At a five-to-ten-second shared-screen pace, these histories prevent the
    // next few sets from feeling like the same arithmetic question again.
    recentRoundKeys = [...recentRoundKeys, targetPairRoundKey(round)].slice(-8);
    recentOperationIds = [...recentOperationIds, round.operation.id].slice(-2);
    renderTargetPairRound(round);
    action.textContent = "Next Set";
  }

  function generateNumberGap() {
    const round = createNumberGapRound(Math.random, recentNumberGapKeys, difficultySetting);
    // The cards are fast to answer together, so do not let the same visible
    // quartet recur during a short shared-screen session.
    recentNumberGapKeys = [...recentNumberGapKeys, numberGapRoundKey(round)].slice(-8);
    renderNumberGapRound(round);
    numberGapAction.textContent = "Next Set";
  }

  function renderNumberDetectiveRound(round) {
    currentNumberDetectiveRound = round;
    numberDetectiveAnswered = false;
    numberDetectiveFeedback.textContent = "";
    numberDetectiveFeedback.dataset.state = "";
    numberDetectiveChoices.classList.remove("resolved", "set-entering");
    numberDetectiveChoices.replaceChildren(...round.values.map((value) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "number-play-number-card";
      button.dataset.value = String(value);
      button.dataset.ui = "number-play-choice";
      button.textContent = String(value);
      button.setAttribute("aria-label", `Choose ${value}`);
      button.addEventListener("click", () => chooseNumberDetectiveValue(value));
      return button;
    }));
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      numberDetectiveChoices.classList.add("set-entering");
      window.setTimeout(() => numberDetectiveChoices.classList.remove("set-entering"), 200);
    }
  }

  function chooseNumberDetectiveValue(value) {
    if (!currentNumberDetectiveRound || numberDetectiveAnswered) return;
    numberDetectiveAnswered = true;
    const correct = value === currentNumberDetectiveRound.oddValue;
    [...numberDetectiveChoices.querySelectorAll(".number-play-number-card")].forEach((button) => {
      const cardValue = Number(button.dataset.value);
      button.disabled = true;
      if (cardValue === currentNumberDetectiveRound.oddValue) button.classList.add("correct");
      else if (cardValue === value) button.classList.add("wrong");
    });
    numberDetectiveChoices.classList.add("resolved");
    numberDetectiveFeedback.textContent = currentNumberDetectiveRound.explanation;
    numberDetectiveFeedback.dataset.state = correct ? "correct" : "wrong";
    app.haptic?.(correct ? SUCCESS_HAPTIC : ERROR_HAPTIC);
  }

  function generateNumberDetective() {
    const round = createNumberDetectiveRound(Math.random, {
      recentKeys: recentNumberDetectiveKeys,
      recentPatternIds: recentNumberDetectivePatternIds
    }, difficultySetting);
    // Keep both the exact four-number set and the underlying pattern fresh.
    recentNumberDetectiveKeys = [...recentNumberDetectiveKeys, numberDetectiveRoundKey(round)].slice(-8);
    recentNumberDetectivePatternIds = [...recentNumberDetectivePatternIds, round.pattern.id].slice(-2);
    renderNumberDetectiveRound(round);
    numberDetectiveAction.textContent = "Next Set";
  }

  function selectMode(modeId) {
    const mode = NUMBER_PLAY_MODE_BY_ID.get(modeId);
    if (!mode?.available) return;
    activeModeId = mode.id;
    modeLabel.textContent = mode.name;
    setMenuOpen(false);
    renderModeLists();
    launch.hidden = true;
    const isTargetPair = mode.id === "target-pair";
    const isNumberGap = mode.id === "number-gap";
    const isNumberDetective = mode.id === "number-detective";
    targetPair.hidden = !isTargetPair;
    numberGap.hidden = !isNumberGap;
    numberDetective.hidden = !isNumberDetective;
    action.hidden = !isTargetPair;
    numberGapAction.hidden = !isNumberGap;
    numberDetectiveAction.hidden = !isNumberDetective;
    currentRound = null;
    activeRoundUi = null;
    selectedValues = [];
    answered = false;
    feedback.textContent = "";
    feedback.dataset.state = "";
    choices.replaceChildren();
    numberGapFeedback.textContent = "";
    numberGapFeedback.dataset.state = "";
    numberGapChoices.replaceChildren();
    targetValue.textContent = "—";
    targetOperator.textContent = "";
    numberGapDirection.textContent = "—";
    numberGapInstruction.textContent = "Tap two numbers.";
    action.textContent = "Generate Set";
    numberGapAction.textContent = "Generate Set";
    currentNumberDetectiveRound = null;
    numberDetectiveAnswered = false;
    numberDetectiveChoices.replaceChildren();
    numberDetectiveFeedback.textContent = "";
    numberDetectiveFeedback.dataset.state = "";
    numberDetectiveAction.textContent = "Generate Set";
  }

  modeButton.addEventListener("click", () => setMenuOpen(modeMenu.hidden));
  action.addEventListener("click", generateTargetPair);
  numberGapAction.addEventListener("click", generateNumberGap);
  numberDetectiveAction.addEventListener("click", generateNumberDetective);
  difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => setDifficulty(button.dataset.numberPlayDifficulty));
  });
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
  setDifficulty(difficultySetting);
  showLaunch();
}
