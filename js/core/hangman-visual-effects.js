/**
 * Default DOM/CSS feedback adapter for Hangman.
 *
 * Rules code emits intent (correct guess, wrong guess, key press, round end)
 * instead of knowing which classes or popup elements realise that feedback.
 * A reskin can replace this adapter while retaining the game engine.
 */
export function createHangmanVisualEffects({ gameCard, slots, keyboard }) {
  function replayClass(element, className, duration) {
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
    window.setTimeout(() => element.classList.remove(className), duration);
  }

  function showKeyPopup(key, value) {
    if (!/^[A-Z]$/.test(value)) return;
    key.querySelector(".key-popup")?.remove();
    const popup = document.createElement("span");
    popup.className = "key-popup";
    popup.textContent = value;
    key.appendChild(popup);
    window.setTimeout(() => {
      popup.classList.add("hide");
      window.setTimeout(() => popup.remove(), 80);
    }, 105);
  }

  return {
    reset() {
      gameCard.classList.remove("wrong-flash");
      slots.classList.remove("win", "loss");
      keyboard.querySelectorAll(".letter-key").forEach((key) => {
        key.classList.remove("used", "guessed-correct", "guessed-wrong", "key-pressed");
        key.querySelector(".key-popup")?.remove();
      });
    },
    keyPressed({ key, value }) {
      replayClass(key, "key-pressed", 82);
      showKeyPopup(key, value);
    },
    guessMarked({ key, correct }) {
      key?.classList.add("used", correct ? "guessed-correct" : "guessed-wrong");
    },
    correctGuess({ letter }) {
      slots.querySelectorAll(`.letter-slot[data-letter="${letter}"]`).forEach((slot) => {
        replayClass(slot, "correct-hit", 360);
      });
    },
    wrongGuess() {
      replayClass(gameCard, "wrong-flash", 320);
    },
    roundEnded({ result }) {
      slots.classList.add(result === "win" ? "win" : "loss");
    },
  };
}
