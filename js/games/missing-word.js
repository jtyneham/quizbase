import { WORDS } from "../../data/missing-word-words.js";
import { registerMissingWordGame } from "../core/missing-word-engine.js";
import { curateMissingWordPool } from "../core/missing-word-data-curator.js";
import { withBusinessMoneyMissingWordPool } from "../../data/business-money-words.js";
import { withComicsMissingWordPool } from "../../data/comics-words.js";
import { withMangaAnimeMissingWordPool } from "../../data/manga-anime-words.js";

const TOPICS = ["General", "Animals", "Food & Drink", "Geography", "Nature", "Space", "Science", "Human Body", "Medicine", "History", "Mythology", "Sports", "Games", "Video Games", "Movies & TV", "Music", "Books & Literature", "Comics", "Manga & Anime", "People & Professions", "IT & Technology", "Business & Money", "Vehicles", "Household", "Clothing", "Tools", "Buildings & Places", "Everyday Objects", "Brands", "Nouns", "Verbs", "Adjectives"];
const EDITIONS = [
  { id: "general", name: "Missing Word", icon: "assets/missing-word.svg", screenId: "missingword" },
  { id: "pokemon", name: "Missing Word Pokemon", icon: "assets/missing-word-pokemon.svg", screenId: "missingwordpokemon" }
];

export function registerMissingWord(app) {
  registerMissingWordGame({
    app,
    elementName: "quiz-missing-word",
    stylesheet: "css/missing-word.css",
    screenId: "missingword",
    // General is intentionally a curated default, while the full data remains
    // available through each specialist topic.
    wordPool: withMangaAnimeMissingWordPool(
      withComicsMissingWordPool(
        withBusinessMoneyMissingWordPool(curateMissingWordPool(WORDS))
      )
    ),
    topics: TOPICS,
    initialTopics: ["General"],
    topicMode: "general",
    editions: EDITIONS,
    editionId: "general"
  });
}
