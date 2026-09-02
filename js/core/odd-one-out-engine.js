import { ODD_ONE_OUT_BLUEPRINTS } from "../../data/odd-one-out-knowledge.js";
import { chooseRound } from "./odd-one-out-logic.js";
import { bindFullscreenButton } from "./ui.js";
import { createOddOneOutVisualRenderer } from "./odd-one-out-visual-renderer.js";
import { createEditionPicker } from "./edition-picker.js";

const INITIALISED_ROOTS = new WeakSet();
// The 18-family pool keeps fast shared-screen sessions fresh: the same
// relationship stays away for 12 later sets and its wider family for 9.
const RECENT_BLUEPRINT_LIMIT = 12;
const RECENT_FAMILY_LIMIT = 9;
const RECENT_VISIBLE_SET_LIMIT = 3;
const SUCCESS_HAPTIC = [22, 35, 48];
const ERROR_HAPTIC = [82, 32, 82];

/**
 * Shared-screen, quickfire Odd One Out game.
 *
 * There is deliberately no timer, score, player setup, or topic picker.
 * Players self-organise around the device, tap an answer, read the short
 * explanation, then explicitly request the next generated set.
 */
export function initOddOneOut(root, app, {
  visualRenderer = "dom",
  visualRendererConfig = {},
  blueprints = ODD_ONE_OUT_BLUEPRINTS,
  // An edition may have fewer relationships than the general pool. Let it
  // shorten its history safely instead of exhausting every eligible idea and
  // falling back to an immediate repeat. These are round counts, never time.
  cooldownLimits = {},
  editions = [],
  editionId,
  editionPickerPrefix = "",
  controls = {
    fullscreenButton: "#oddOneOutFullscreenButton",
    fullscreenIcon: "#oddOneOutFullscreenIcon",
    fullscreenLabel: "#oddOneOutFullscreenLabel",
    homeButton: "#oddOneOutHomeButton"
  }
} = {}) {
  if (INITIALISED_ROOTS.has(root)) return;
  INITIALISED_ROOTS.add(root);

  const difficultyButtons = [...root.querySelectorAll("[data-difficulty]")];
  const cooldowns = {
    relationships: RECENT_BLUEPRINT_LIMIT,
    families: RECENT_FAMILY_LIMIT,
    visibleSets: RECENT_VISIBLE_SET_LIMIT,
    ...cooldownLimits
  };
  const renderer = createOddOneOutVisualRenderer({
    ...visualRendererConfig,
    type: visualRenderer,
    root
  });
  const editionPicker = editions.length ? createEditionPicker({
    root,
    editions,
    activeEditionId: editionId,
    idPrefix: editionPickerPrefix,
    onChoose: (edition) => {
      app.haptic?.(12);
      void app.openGame(edition.screenId);
    }
  }) : null;
  let setting = "mixed";
  let currentRound = null;
  let answered = false;
  let isChangingSet = false;
  let recentBlueprintIds = [];
  let recentFamilies = [];
  let recentChoiceSets = [];

  function setDifficulty(nextSetting) {
    setting = nextSetting;
    difficultyButtons.forEach((button) => {
      const active = button.dataset.difficulty === setting;
      button.setAttribute("aria-pressed", String(active));
      button.classList.toggle("active", active);
    });
  }

  function renderRound(round) {
    currentRound = round;
    answered = false;
    renderer.renderRound({ round, onChoose: answer });
  }

  function answer(choice) {
    if (!currentRound || answered) return;
    answered = true;
    const correct = choice === currentRound.oddChoice;
    if (correct) {
      app.haptic?.(SUCCESS_HAPTIC);
    } else {
      app.haptic?.(ERROR_HAPTIC);
    }
    renderer.resolveRound({
      choice,
      oddChoice: currentRound.oddChoice,
      explanation: currentRound.explanation,
      correct
    });
  }

  async function generateSet() {
    if (isChangingSet) return;
    isChangingSet = true;
    renderer.setPrimaryAction({ label: currentRound ? "Next Set" : "Generate Set", disabled: true });
    const round = chooseRound(
      blueprints,
      setting,
      recentBlueprintIds,
      Math.random,
      recentFamilies,
      recentChoiceSets
    );
    recentBlueprintIds = [...recentBlueprintIds, round.blueprintId].slice(-cooldowns.relationships);
    recentFamilies = [...recentFamilies, round.family].slice(-cooldowns.families);
    recentChoiceSets = [...recentChoiceSets, round.choices].slice(-cooldowns.visibleSets);

    // A renderer decides how a set enters or leaves. The engine retains the
    // lifecycle lock, so a themed animation cannot generate duplicate rounds.
    if (currentRound) await renderer.playRoundExit();
    renderRound(round);
    renderer.setPrimaryAction({ label: "Next Set", disabled: true });
    await renderer.playRoundEnter();
    renderer.setPrimaryAction({ label: "Next Set", disabled: false });
    isChangingSet = false;
  }

  bindFullscreenButton({
    button: root.querySelector(controls.fullscreenButton),
    icon: root.querySelector(controls.fullscreenIcon),
    label: root.querySelector(controls.fullscreenLabel),
    app
  });
  root.querySelector(controls.homeButton).addEventListener("click", () => {
    app.haptic?.(12);
    editionPicker?.close();
    app.showHome();
  });
  difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => setDifficulty(button.dataset.difficulty));
  });
  renderer.bindPrimaryAction(generateSet);
  setDifficulty(setting);
}
