import { topics } from "../../data/rngl-topics.js";
import { bindFullscreenButton } from "./ui.js";
import { createRandomLetterTicker } from "./random-letter-ticker.js";
import { createRandomLetterVisualRenderer } from "./random-letter-visual-renderer.js";

const INITIALISED_ROOTS = new WeakSet();
const REGULAR_LETTERS = "ABCDEFGHIJKLMNOPRSTUVW".split("");
const WEIGHTED_LETTERS = [...REGULAR_LETTERS, ...REGULAR_LETTERS, "Q", "X", "Y", "Z"];

/**
 * Random Letter rules and lifecycle. Visual reveal effects are injected through
 * the renderer contract, so themed builds do not need to rewrite this module.
 */
export function initRandomLetter(root, app, { visualRenderer = "dom", revealConfig } = {}) {
  if (INITIALISED_ROOTS.has(root)) return;
  INITIALISED_ROOTS.add(root);

  const letterElement = root.querySelector("#letter");
  const letterCard = root.querySelector("#letterCard");
  const generateButton = root.querySelector("#generateButton");
  const fullscreenButton = root.querySelector("#fullscreenButton");
  const fullscreenIcon = root.querySelector("#fullscreenIcon");
  const fullscreenLabel = root.querySelector("#fullscreenLabel");
  const ideasToggle = root.querySelector("#ideasToggle");
  const tickerShell = root.querySelector("#tickerShell");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const randomDisplayLetter = () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
  const chooseLetter = () => WEIGHTED_LETTERS[Math.floor(Math.random() * WEIGHTED_LETTERS.length)];

  const reveal = createRandomLetterVisualRenderer({
    type: visualRenderer,
    root,
    letterElement,
    randomDisplayLetter,
    reducedMotion,
    config: revealConfig,
  });
  const ticker = createRandomLetterTicker({ root, topics });
  let generating = false;

  function setIdeasVisible(visible) {
    tickerShell.classList.toggle("visible", visible);
    tickerShell.setAttribute("aria-hidden", String(!visible));
    if (visible) ticker.start();
    else ticker.stop();
  }

  async function generateLetter() {
    if (generating) return;
    generating = true;
    generateButton.disabled = true;
    letterCard.disabled = true;
    generateButton.classList.remove("press");
    void generateButton.offsetWidth;
    generateButton.classList.add("press", "generating");

    try {
      await reveal.play({ finalLetter: chooseLetter() });
    } finally {
      generateButton.disabled = false;
      letterCard.disabled = false;
      generateButton.classList.remove("press", "generating");
      generating = false;
    }
  }

  bindFullscreenButton({ button: fullscreenButton, icon: fullscreenIcon, label: fullscreenLabel, app });
  root.querySelector("#rnglHomeButton").addEventListener("click", () => { app.haptic(12); app.showHome(); });
  ideasToggle.addEventListener("change", () => setIdeasVisible(ideasToggle.checked));
  generateButton.addEventListener("click", generateLetter);
  letterCard.addEventListener("click", generateLetter);
  window.addEventListener("keydown", (event) => {
    if (event.code === "Space" && event.target.tagName !== "INPUT" && event.target.tagName !== "BUTTON") {
      event.preventDefault();
      generateLetter();
    }
  });

  setIdeasVisible(ideasToggle.checked);

  // Exposed only for component teardown or a host application replacing this
  // static screen. Normal hash navigation reuses the already-initialised root.
  return () => {
    reveal.destroy();
    ticker.destroy();
    INITIALISED_ROOTS.delete(root);
  };
}
