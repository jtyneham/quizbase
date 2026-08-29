import { GAME_DATABASE } from "../../data/hangman-words.js";
import { defineHangmanElement } from "../core/hangman-engine.js";
import { isGeneralHangmanEntry } from "../core/general-word-pool.js";

export function registerHangman(app) {
  const topics = [...new Set(GAME_DATABASE.map(entry => entry.category))];
  defineHangmanElement({
    tagName: "quiz-hangman",
    stylesheet: "css/hangman.css",
    app,
    config: {
      topics,
      featuredMode: true,
      featuredModeLabel: "General",
      initialTopics: [],
      getAnswer: entry => entry.answer,
      getPool: ({ selectedTopics, featuredMode }) => featuredMode
        ? GAME_DATABASE.filter(isGeneralHangmanEntry)
        : GAME_DATABASE.filter(entry => selectedTopics.has(entry.category)),
    },
  });
}
