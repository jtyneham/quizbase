import { WORDS } from "../../data/missing-word-words.js";
import { registerMissingWordGame } from "../core/missing-word-engine.js";
import { curateMissingWordPool } from "../core/missing-word-data-curator.js";

const TOPICS = ["General", "Animals", "Food & Drink", "Geography", "Nature", "Space", "Science", "Human Body", "Medicine", "History", "Mythology", "Sports", "Games", "Video Games", "Movies & TV", "Music", "Books & Literature", "People & Professions", "IT & Technology", "Vehicles", "Household", "Clothing", "Tools", "Buildings & Places", "Everyday Objects", "Brands", "Nouns", "Verbs", "Adjectives"];

export function registerMissingWord(app) {
  registerMissingWordGame({
    app,
    elementName: "quiz-missing-word",
    stylesheet: "css/missing-word.css",
    screenId: "missingword",
    // General is intentionally a curated default, while the full data remains
    // available through each specialist topic.
    wordPool: curateMissingWordPool(WORDS),
    topics: TOPICS,
    initialTopics: ["General"],
    topicMode: "general"
  });
}
