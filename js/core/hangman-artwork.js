/**
 * The visual contract between Hangman gameplay and any gallows artwork.
 * A replacement illustration only needs six `.draw-part` stages plus the
 * optional `.hangman` host used for head/game-over states.
 */
export function createHangmanArtwork(root) {
  const drawing = root.querySelector(".hangman");
  const stages = [...root.querySelectorAll(".draw-part")];

  stages.forEach((stage) => {
    stage.addEventListener("animationend", () => {
      if (stage.classList.contains("show")) stage.classList.add("drawn");
    });
  });

  function reset() {
    stages.forEach((stage) => stage.classList.remove("drawn", "show"));
    drawing?.classList.remove("head-revealed", "game-over");
  }

  function render(misses) {
    stages.forEach((stage, index) => {
      stage.classList.toggle("show", index < misses);
    });
    drawing?.classList.toggle("head-revealed", misses >= 1);
    drawing?.classList.toggle("game-over", misses >= 6);
  }

  return { render, reset };
}
