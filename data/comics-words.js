import { withCuratedHangmanTopic, withCuratedMissingWordTopic } from "./topic-pool-utils.js";

/**
 * Comics is about comic-origin stories, characters, creators, and publishers.
 * It deliberately excludes generic format vocabulary (for example, "comic
 * book"), Japanese manga/anime, and screen-first properties.
 */
export const COMICS_TOPIC = "Comics";

export const COMICS_WORDS = [
  // Easy: globally recognisable characters, teams, and strips.
  ["Batman", 1], ["Superman", 1], ["Wonder Woman", 1], ["Spider-Man", 1], ["Iron Man", 1],
  ["Hulk", 1], ["Thor", 1], ["Captain America", 1], ["Black Panther", 1], ["Wolverine", 1],
  ["Joker", 1], ["Harley Quinn", 1], ["Deadpool", 1], ["Aquaman", 1], ["Flash", 1],
  ["Green Lantern", 1], ["X-Men", 1], ["Avengers", 1], ["Fantastic Four", 1], ["Justice League", 1],
  ["Daredevil", 1], ["Catwoman", 1], ["Robin", 1], ["Venom", 1], ["Thanos", 1],
  ["Loki", 1], ["Hellboy", 1], ["Watchmen", 1], ["Tintin", 1], ["Asterix", 1],
  ["Obelix", 1], ["Garfield", 1], ["Peanuts", 1], ["Snoopy", 1], ["Calvin", 1],
  ["Hobbes", 1], ["Archie", 1], ["Jughead", 1], ["The Phantom", 1], ["Spawn", 1],
  ["Invincible", 1], ["Judge Dredd", 1], ["The Walking Dead", 1], ["The Punisher", 1], ["Blade", 1],

  // Medium: established titles, supporting characters, publishers, creators.
  ["Marvel Comics", 2], ["DC Comics", 2], ["Stan Lee", 2], ["Jack Kirby", 2], ["Alan Moore", 2],
  ["Frank Miller", 2], ["Neil Gaiman", 2], ["Will Eisner", 2], ["Image Comics", 2], ["Dark Horse", 2],
  ["Vertigo", 2], ["Sandman", 2], ["V for Vendetta", 2], ["Sin City", 2], ["Saga", 2],
  ["The Crow", 2], ["Hellblazer", 2], ["Swamp Thing", 2], ["Teen Titans", 2], ["Green Arrow", 2],
  ["Doctor Doom", 2], ["Lex Luthor", 2], ["Riddler", 2], ["Penguin", 2], ["Two-Face", 2],
  ["Magneto", 2], ["Mystique", 2], ["Silver Surfer", 2], ["Moon Knight", 2], ["Ms Marvel", 2],
  ["Shazam", 2], ["Elektra", 2], ["Black Widow", 2], ["Luke Cage", 2], ["Nightwing", 2],
  ["Guardians of the Galaxy", 2], ["Doctor Strange", 2], ["Supergirl", 2], ["Batgirl", 2], ["Kamandi", 2],
  ["Maus", 2], ["Persepolis", 2], ["Bone", 2], ["Fables", 2], ["Y the Last Man", 2],
  ["The Authority", 2], ["Usagi Yojimbo", 2], ["Scott Pilgrim", 2], ["Dilbert", 2], ["The Far Side", 2],
  ["Dennis the Menace", 2], ["Lucky Luke", 2], ["Corto Maltese", 2], ["The Umbrella Academy", 2], ["Locke and Key", 2],

  // Hard: acclaimed creators and specialist comic titles.
  ["Art Spiegelman", 3], ["Brian K Vaughan", 3], ["Grant Morrison", 3], ["Chris Claremont", 3], ["Marjane Satrapi", 3],
  ["Moebius", 3], ["Hergé", 3], ["Love and Rockets", 3], ["Transmetropolitan", 3], ["100 Bullets", 3],
  ["The Dark Knight Returns", 3], ["Crisis on Infinite Earths", 3], ["The League of Extraordinary Gentlemen", 3], ["Preacher", 3], ["The Invisibles", 3],
  ["Planetary", 3], ["Black Hammer", 3], ["The Question", 3], ["Concrete", 3], ["Strangers in Paradise", 3]
];

export const COMICS_HANGMAN_WORDS = COMICS_WORDS.filter(([, difficulty]) => difficulty <= 2);

export function withComicsMissingWordPool(entries) {
  return withCuratedMissingWordTopic(entries, { topic: COMICS_TOPIC, words: COMICS_WORDS });
}

export function withComicsHangmanPool(entries) {
  return withCuratedHangmanTopic(entries, { topic: COMICS_TOPIC, words: COMICS_HANGMAN_WORDS });
}
