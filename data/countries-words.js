import { withCuratedHangmanTopic, withCuratedMissingWordTopic } from "./topic-pool-utils.js";

export const COUNTRIES_TOPIC = "Countries";

/**
 * A broad international pool using current, player-friendly English short
 * names. Difficulty reflects recognition/spelling challenge, not importance.
 */
export const COUNTRIES_WORDS = [
  // Highly familiar country names.
  ["United States", 1], ["Canada", 1], ["Mexico", 1], ["Brazil", 1], ["Argentina", 1],
  ["United Kingdom", 1], ["Ireland", 1], ["France", 1], ["Spain", 1], ["Portugal", 1],
  ["Germany", 1], ["Italy", 1], ["Netherlands", 1], ["Belgium", 1], ["Switzerland", 1],
  ["Austria", 1], ["Greece", 1], ["Poland", 1], ["Sweden", 1], ["Norway", 1],
  ["Finland", 1], ["Denmark", 1], ["Ukraine", 1], ["Russia", 1], ["Turkiye", 1],
  ["Egypt", 1], ["South Africa", 1], ["Nigeria", 1], ["Kenya", 1], ["Morocco", 1],
  ["Saudi Arabia", 1], ["United Arab Emirates", 1], ["Israel", 1], ["Iran", 1], ["India", 1],
  ["Pakistan", 1], ["China", 1], ["Japan", 1], ["South Korea", 1], ["Australia", 1],

  // Familiar regional names with moderately challenging spelling.
  ["New Zealand", 2], ["Chile", 2], ["Colombia", 2], ["Peru", 2], ["Venezuela", 2],
  ["Uruguay", 2], ["Ecuador", 2], ["Bolivia", 2], ["Paraguay", 2], ["Costa Rica", 2],
  ["Cuba", 2], ["Jamaica", 2], ["Iceland", 2], ["Czechia", 2], ["Slovakia", 2],
  ["Hungary", 2], ["Romania", 2], ["Bulgaria", 2], ["Croatia", 2], ["Serbia", 2],
  ["Albania", 2], ["Georgia", 2], ["Armenia", 2], ["Kazakhstan", 2], ["Uzbekistan", 2],
  ["Afghanistan", 2], ["Bangladesh", 2], ["Sri Lanka", 2], ["Nepal", 2], ["Thailand", 2],
  ["Vietnam", 2], ["Malaysia", 2], ["Indonesia", 2], ["Philippines", 2], ["Singapore", 2],
  ["Mongolia", 2], ["Jordan", 2], ["Lebanon", 2], ["Iraq", 2], ["Syria", 2],

  // Smaller states and less familiar names for harder rounds.
  ["Andorra", 3], ["Liechtenstein", 3], ["Luxembourg", 3], ["San Marino", 3], ["Malta", 3],
  ["Montenegro", 3], ["Moldova", 3], ["Estonia", 3], ["Latvia", 3], ["Lithuania", 3],
  ["Azerbaijan", 3], ["Kyrgyzstan", 3], ["Tajikistan", 3], ["Turkmenistan", 3], ["Bhutan", 3],
  ["Cambodia", 3], ["Laos", 3], ["Brunei", 3], ["Timor-Leste", 3], ["Papua New Guinea", 3],
  ["Fiji", 3], ["Samoa", 3], ["Tonga", 3], ["Vanuatu", 3], ["Kiribati", 3],
  ["Botswana", 3], ["Namibia", 3], ["Mozambique", 3], ["Madagascar", 3], ["Mauritius", 3],
  ["Seychelles", 3], ["Rwanda", 3], ["Burundi", 3], ["Lesotho", 3], ["Eswatini", 3],
  ["Suriname", 3], ["Guyana", 3], ["Belize", 3], ["Dominica", 3], ["Saint Lucia", 3]
];

export function withCountriesMissingWordPool(entries) {
  return withCuratedMissingWordTopic(entries, { topic: COUNTRIES_TOPIC, words: COUNTRIES_WORDS });
}

export function withCountriesHangmanPool(entries) {
  return withCuratedHangmanTopic(entries, { topic: COUNTRIES_TOPIC, words: COUNTRIES_WORDS });
}
