import { GAME_DATABASE } from "../../data/hangman-words.js";
import { defineHangmanElement } from "../core/hangman-engine.js";
import { isGeneralHangmanEntry } from "../core/general-word-pool.js";
import { curateHangmanDatabase } from "../core/hangman-data-curator.js";
import { BUSINESS_MONEY_TOPIC, withBusinessMoneyHangmanPool } from "../../data/business-money-words.js";
import { COMICS_TOPIC, withComicsHangmanPool } from "../../data/comics-words.js";
import { MANGA_ANIME_TOPIC, withMangaAnimeHangmanPool } from "../../data/manga-anime-words.js";
import { UFC_FIGHTERS_TOPIC, withUfcFightersHangmanPool } from "../../data/ufc-fighters.js";

const SPECIALIST_TOPICS = new Set([BUSINESS_MONEY_TOPIC, COMICS_TOPIC, MANGA_ANIME_TOPIC, UFC_FIGHTERS_TOPIC]);
const EDITIONS = [
  { id: "general", name: "Hangman", icon: "assets/hangman.svg", screenId: "hangman" },
  { id: "pokemon", name: "Hangman Pokemon", icon: "assets/hangman-pokemon.svg", screenId: "hangmanpokemon" }
];

export function registerHangman(app) {
  const wordPool = curateHangmanDatabase(
    withUfcFightersHangmanPool(
      withMangaAnimeHangmanPool(
        withComicsHangmanPool(
          withBusinessMoneyHangmanPool(GAME_DATABASE)
        )
      )
    )
  );
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
        ? wordPool.filter((entry) => !SPECIALIST_TOPICS.has(entry.category) && isGeneralHangmanEntry(entry))
        : wordPool.filter(entry => selectedTopics.has(entry.category)),
      editions: EDITIONS,
      editionId: "general"
    },
  });
}
