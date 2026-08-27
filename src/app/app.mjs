import { createRouter } from "./router.mjs";
import { createFullscreenService } from "./fullscreen.mjs";
import { MissingWordEngine } from "../games/missing-word/engine.mjs";
import { HangmanEngine } from "../games/hangman/engine.mjs";
import { RandomLetterEngine } from "../games/random-letter/engine.mjs";
import { baseTheme } from "../themes/base/theme.mjs";
import { WORDS } from "../../data/missing-word-words.js";
import { POKEMON_WORDS } from "../../data/missing-word-pokemon-words.js";
import { GAME_DATABASE, RANDOM_POOL } from "../../data/hangman-words.js";
import { topics as randomLetterTopics } from "../../data/rngl-topics.js";

const root = document.querySelector("#app");
const theme = baseTheme;
const fullscreen = createFullscreenService();
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const haptic = (duration = 12) => navigator.vibrate?.(duration);

const routes = ["home", "missing-word", "missing-word-pokemon", "hangman", "hangman-pokemon", "random-letter"];
const router = createRouter({ routes });
let activeView;

const app = {
  fullscreen,
  reducedMotion,
  home: () => { haptic(); router.go("home"); }
};

const generalMissingTopics = [...new Set(WORDS.flatMap((entry) => entry.topics))];
const pokemonTopics = [...new Set(POKEMON_WORDS.flatMap((entry) => entry.topics))];
const generalHangmanTopics = [...new Set(GAME_DATABASE.map((entry) => entry.category))];
const randomAnswers = new Set(RANDOM_POOL);

function missingWord(variant) {
  const pokemon = variant === "pokemon";
  const entries = pokemon ? POKEMON_WORDS : WORDS;
  const engine = new MissingWordEngine({
    entries,
    defaultTopics: pokemon ? ["Pokemon All Names"] : ["General"],
    allTopics: false
  });
  return theme.views.missingWord({
    title: pokemon ? "Missing Word — Pokémon" : "Missing Word",
    engine,
    topics: pokemon ? pokemonTopics : generalMissingTopics,
    app
  });
}

function generalHangman() {
  const engine = new HangmanEngine({ entries: GAME_DATABASE });
  const topics = { values: ["Random", ...generalHangmanTopics], defaultSelection: ["Random"] };
  const applyTopics = (target, selected) => {
    target.setFilter(selected.has("Random")
      ? (entry) => randomAnswers.has(entry.answer)
      : (entry) => selected.has(entry.category));
  };
  applyTopics(engine, new Set(topics.defaultSelection));
  return theme.views.hangman({ title: "Hangman", engine, topics, applyTopics, app });
}

function pokemonHangman() {
  const engine = new HangmanEngine({ entries: POKEMON_WORDS, getAnswer: (entry) => entry.word });
  const topics = { values: pokemonTopics, defaultSelection: ["Pokemon All Names"] };
  const applyTopics = (target, selected) => target.setFilter((entry) => entry.topics.some((topic) => selected.has(topic)));
  applyTopics(engine, new Set(topics.defaultSelection));
  return theme.views.hangman({ title: "Hangman — Pokémon", engine, topics, applyTopics, app });
}

function randomLetter() {
  return theme.views.randomLetter({ engine: new RandomLetterEngine(), topics: randomLetterTopics, app });
}

const destinations = [
  { id: "missing-word", label: "Missing Word" },
  { id: "missing-word-pokemon", label: "Missing Word — Pokémon" },
  { id: "hangman", label: "Hangman" },
  { id: "hangman-pokemon", label: "Hangman — Pokémon" },
  { id: "random-letter", label: "Random Letter" }
].map((destination) => ({ ...destination, open: () => { haptic(18); router.go(destination.id); } }));

const factories = {
  home: () => theme.views.home({ destinations }),
  "missing-word": () => missingWord("general"),
  "missing-word-pokemon": () => missingWord("pokemon"),
  hangman: generalHangman,
  "hangman-pokemon": pokemonHangman,
  "random-letter": randomLetter
};

router.subscribe((route) => {
  activeView?.destroy();
  root.replaceChildren();
  activeView = factories[route]();
  root.append(activeView.element);
  document.title = route === "home" ? "Quizbase" : `Quizbase — ${destinations.find((item) => item.id === route)?.label || route}`;
  activeView.element.querySelector("button, [tabindex]")?.focus({ preventScroll: true });
});
