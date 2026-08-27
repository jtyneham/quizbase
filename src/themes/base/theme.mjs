import { createHomeView } from "../../screens/home/default-view.mjs";
import { createMissingWordView } from "../../games/missing-word/default-view.mjs";
import { createHangmanView } from "../../games/hangman/default-view.mjs";
import { createRandomLetterView } from "../../games/random-letter/default-view.mjs";

// A theme can replace any factory here. State engines and routing do not depend
// on the base DOM, so alternate visual languages may fully recompose screens.
export const baseTheme = Object.freeze({
  id: "base",
  views: {
    home: createHomeView,
    missingWord: createMissingWordView,
    hangman: createHangmanView,
    randomLetter: createRandomLetterView
  }
});
