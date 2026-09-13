import { withCuratedHangmanTopic, withCuratedMissingWordTopic } from "./topic-pool-utils.js";

export const CITIES_TOPIC = "Cities";

/**
 * A globally distributed city pool using familiar English display names.
 * Difficulty reflects recognition/spelling challenge rather than city size.
 */
export const CITIES_WORDS = [
  // Widely recognised international cities.
  ["London", 1], ["Paris", 1], ["New York", 1], ["Los Angeles", 1], ["Chicago", 1],
  ["Toronto", 1], ["Vancouver", 1], ["Mexico City", 1], ["Rio de Janeiro", 1], ["Sao Paulo", 1],
  ["Buenos Aires", 1], ["Madrid", 1], ["Barcelona", 1], ["Rome", 1], ["Milan", 1],
  ["Berlin", 1], ["Amsterdam", 1], ["Brussels", 1], ["Vienna", 1], ["Athens", 1],
  ["Moscow", 1], ["Istanbul", 1], ["Cairo", 1], ["Cape Town", 1], ["Johannesburg", 1],
  ["Dubai", 1], ["Jerusalem", 1], ["Mumbai", 1], ["Delhi", 1], ["Bangkok", 1],
  ["Singapore", 1], ["Hong Kong", 1], ["Beijing", 1], ["Shanghai", 1], ["Tokyo", 1],
  ["Kyoto", 1], ["Seoul", 1], ["Sydney", 1], ["Melbourne", 1], ["Auckland", 1],

  // Major regional centres and capitals.
  ["Edinburgh", 2], ["Dublin", 2], ["Lisbon", 2], ["Prague", 2], ["Budapest", 2],
  ["Warsaw", 2], ["Copenhagen", 2], ["Stockholm", 2], ["Oslo", 2], ["Helsinki", 2],
  ["Reykjavik", 2], ["Zurich", 2], ["Geneva", 2], ["Munich", 2], ["Venice", 2],
  ["Florence", 2], ["Naples", 2], ["Seville", 2], ["Valencia", 2], ["Porto", 2],
  ["Bucharest", 2], ["Belgrade", 2], ["Zagreb", 2], ["Sarajevo", 2], ["Sofia", 2],
  ["Kyiv", 2], ["Tbilisi", 2], ["Marrakesh", 2], ["Casablanca", 2], ["Nairobi", 2],
  ["Lagos", 2], ["Accra", 2], ["Addis Ababa", 2], ["Doha", 2], ["Abu Dhabi", 2],
  ["Riyadh", 2], ["Tehran", 2], ["Karachi", 2], ["Kolkata", 2], ["Bengaluru", 2],

  // Less immediate names reserved for harder Missing Word rounds.
  ["Ljubljana", 3], ["Bratislava", 3], ["Chisinau", 3], ["Podgorica", 3], ["Skopje", 3],
  ["Tallinn", 3], ["Riga", 3], ["Vilnius", 3], ["Tirana", 3], ["Yerevan", 3],
  ["Baku", 3], ["Astana", 3], ["Bishkek", 3], ["Dushanbe", 3], ["Tashkent", 3],
  ["Ulaanbaatar", 3], ["Kathmandu", 3], ["Thimphu", 3], ["Vientiane", 3], ["Phnom Penh", 3],
  ["Bandar Seri Begawan", 3], ["Dili", 3], ["Port Moresby", 3], ["Suva", 3], ["Nuku'alofa", 3],
  ["Antananarivo", 3], ["Ouagadougou", 3], ["Nouakchott", 3], ["Gaborone", 3], ["Windhoek", 3],
  ["Maputo", 3], ["Lilongwe", 3], ["Lusaka", 3], ["Kigali", 3], ["Kampala", 3],
  ["Paramaribo", 3], ["Georgetown", 3], ["Asuncion", 3], ["Montevideo", 3], ["La Paz", 3]
];

export function withCitiesMissingWordPool(entries) {
  return withCuratedMissingWordTopic(entries, { topic: CITIES_TOPIC, words: CITIES_WORDS });
}

export function withCitiesHangmanPool(entries) {
  return withCuratedHangmanTopic(entries, { topic: CITIES_TOPIC, words: CITIES_WORDS });
}
