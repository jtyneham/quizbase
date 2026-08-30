/**
 * Default DOM/CSS renderer for Odd One Out.
 *
 * It implements the visual-renderer contract in
 * odd-one-out-visual-renderer.js. It never decides which round is selected,
 * which choice is correct, how difficulty works, or when haptics fire.
 */
const EXIT_DURATION = 110;
const ENTER_DURATION = 190;

function requiredElement(root, selector) {
  const element = root.querySelector(selector);
  if (!element) throw new Error(`Odd One Out DOM renderer could not find '${selector}'.`);
  return element;
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export function createOddOneOutDomRenderer({ root }) {
  const cards = requiredElement(root, "#oddOneOutCards");
  const feedback = requiredElement(root, "#oddOneOutFeedback");
  const primaryAction = requiredElement(root, "#oddOneOutNextButton");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let generateHandler = null;

  function bindPrimaryAction(onGenerate) {
    generateHandler = onGenerate;
    primaryAction.addEventListener("click", generateHandler);
  }

  function setPrimaryAction({ label, disabled = false }) {
    primaryAction.textContent = label;
    primaryAction.disabled = disabled;
  }

  function setFeedback(message = "", state = "") {
    feedback.textContent = message;
    feedback.dataset.state = state;
  }

  function renderRound({ round, onChoose }) {
    cards.classList.remove("resolved", "set-leaving", "set-entering");
    feedback.classList.remove("set-leaving");
    setFeedback();
    cards.replaceChildren(...round.choices.map((choice) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "odd-one-out-card";
      button.dataset.choice = choice;
      button.dataset.ui = "odd-one-out-choice";
      button.textContent = choice;
      button.setAttribute("aria-label", `Choose ${choice}`);
      button.addEventListener("click", () => onChoose(choice));
      return button;
    }));
  }

  function resolveRound({ choice, oddChoice, explanation, correct }) {
    [...cards.querySelectorAll(".odd-one-out-card")].forEach((button) => {
      button.disabled = true;
      if (button.dataset.choice === oddChoice) button.classList.add("correct");
      else if (button.dataset.choice === choice) button.classList.add("wrong");
    });
    setFeedback(explanation, correct ? "correct" : "wrong");
    if (!prefersReducedMotion) cards.classList.add("resolved");
  }

  async function playRoundExit() {
    if (prefersReducedMotion) return;
    cards.classList.add("set-leaving");
    feedback.classList.add("set-leaving");
    await wait(EXIT_DURATION);
  }

  async function playRoundEnter() {
    if (prefersReducedMotion) return;
    cards.classList.add("set-entering");
    await wait(ENTER_DURATION);
    cards.classList.remove("set-entering");
  }

  function destroy() {
    if (generateHandler) primaryAction.removeEventListener("click", generateHandler);
    generateHandler = null;
    cards.replaceChildren();
    setFeedback();
  }

  return {
    prefersReducedMotion,
    bindPrimaryAction,
    setPrimaryAction,
    renderRound,
    resolveRound,
    playRoundExit,
    playRoundEnter,
    destroy
  };
}
