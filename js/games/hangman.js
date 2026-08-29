import { GAME_DATABASE } from "../../data/hangman-words.js";
import { defineHangmanElement } from "../core/hangman-engine.js";
import { isGeneralHangmanEntry } from "../core/general-word-pool.js";
import { curateHangmanDatabase } from "../core/hangman-data-curator.js";

export function registerHangman(app) {
  const wordPool = curateHangmanDatabase(GAME_DATABASE);
  const topics = [...new Set(wordPool.map(entry => entry.category))];
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
        ? wordPool.filter(isGeneralHangmanEntry)
        : wordPool.filter(entry => selectedTopics.has(entry.category)),
    },
  });
}
