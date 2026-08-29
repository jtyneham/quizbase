import { withCuratedHangmanTopic, withCuratedMissingWordTopic } from "./topic-pool-utils.js";

/**
 * Manga & Anime covers Japanese-origin series, characters, distinctive
 * demographics/genres, and lingo. Generic cross-media genres, western comics,
 * and gaming-first properties are intentionally outside this topic.
 */
export const MANGA_ANIME_TOPIC = "Manga & Anime";

export const MANGA_ANIME_WORDS = [
  // Easy: widely known series, characters, and landmark films.
  ["Naruto", 1], ["Sasuke Uchiha", 1], ["Dragon Ball", 1], ["Goku", 1], ["Vegeta", 1],
  ["One Piece", 1], ["Monkey D Luffy", 1], ["Roronoa Zoro", 1], ["Sailor Moon", 1], ["Attack on Titan", 1],
  ["Eren Yeager", 1], ["Mikasa Ackerman", 1], ["Demon Slayer", 1], ["Tanjiro Kamado", 1], ["Nezuko Kamado", 1],
  ["Jujutsu Kaisen", 1], ["Yuji Itadori", 1], ["Satoru Gojo", 1], ["My Hero Academia", 1], ["Izuku Midoriya", 1],
  ["Katsuki Bakugo", 1], ["Death Note", 1], ["Light Yagami", 1], ["Fullmetal Alchemist", 1], ["Edward Elric", 1],
  ["Studio Ghibli", 1], ["Spirited Away", 1], ["My Neighbor Totoro", 1], ["Totoro", 1], ["Howl's Moving Castle", 1],
  ["Princess Mononoke", 1], ["Kiki's Delivery Service", 1], ["Neon Genesis Evangelion", 1], ["Cowboy Bebop", 1], ["Spike Spiegel", 1],
  ["Bleach", 1], ["Ichigo Kurosaki", 1], ["Hunter x Hunter", 1], ["Gon Freecss", 1], ["Inuyasha", 1],
  ["Cardcaptor Sakura", 1], ["JoJo's Bizarre Adventure", 1], ["Chainsaw Man", 1], ["Frieren", 1], ["Haikyu!!", 1],

  // Medium: distinctive anime/manga vocabulary plus famous supporting names.
  ["kodomo", 2], ["shonen", 2], ["shojo", 2], ["seinen", 2], ["josei", 2],
  ["isekai", 2], ["mecha", 2], ["magical girl", 2], ["chibi", 2], ["kaiju", 2],
  ["yaoi", 2], ["yuri", 2], ["harem", 2], ["reverse harem", 2], ["idol anime", 2],
  ["spokon", 2], ["iyashikei", 2], ["gekiga", 2], ["gag manga", 2], ["otaku", 2],
  ["mangaka", 2], ["seiyuu", 2], ["light novel", 2], ["doujinshi", 2], ["Kakashi Hatake", 2],
  ["Itachi Uchiha", 2], ["Levi Ackerman", 2], ["Rukia Kuchiki", 2], ["Sailor Mercury", 2], ["Chihiro Ogino", 2],
  ["Kenshin Himura", 2], ["Kagome Higurashi", 2], ["Mob Psycho 100", 2], ["Reigen Arataka", 2], ["Jotaro Kujo", 2],
  ["Kira Yoshikage", 2], ["Denji", 2], ["Maomao", 2], ["Nausicaa", 2], ["Astro Boy", 2],
  ["Osamu Tezuka", 2], ["Hayao Miyazaki", 2], ["Makoto Shinkai", 2], ["Kyoto Animation", 2], ["Madhouse Studio", 2],
  ["MAPPA", 2], ["Sunrise Studio", 2], ["Trigun", 2], ["Berserk", 2], ["Vash the Stampede", 2],
  ["Sakura Kinomoto", 2], ["Yusuke Urameshi", 2], ["Slam Dunk", 2], ["Fruits Basket", 2], ["Ouran High School Host Club", 2],

  // Hard: respected creators/studios and more niche characters/terms.
  ["Rumiko Takahashi", 3], ["Naoki Urasawa", 3], ["CLAMP", 3], ["Satoshi Kon", 3], ["Masaaki Yuasa", 3],
  ["Mamoru Hosoda", 3], ["Production IG", 3], ["Studio Trigger", 3], ["Studio Bones", 3], ["Shaft Studio", 3],
  ["Yoshihiro Togashi", 3], ["Hiromu Arakawa", 3], ["Nana Osaki", 3], ["Shinji Ikari", 3], ["Rei Ayanami", 3],
  ["Motoko Kusanagi", 3], ["Kino's Journey", 3], ["Mushishi", 3], ["Monogatari", 3], ["Sakuga", 3]
];

export const MANGA_ANIME_HANGMAN_WORDS = MANGA_ANIME_WORDS.filter(([, difficulty]) => difficulty <= 2);

export function withMangaAnimeMissingWordPool(entries) {
  return withCuratedMissingWordTopic(entries, { topic: MANGA_ANIME_TOPIC, words: MANGA_ANIME_WORDS });
}

export function withMangaAnimeHangmanPool(entries) {
  return withCuratedHangmanTopic(entries, { topic: MANGA_ANIME_TOPIC, words: MANGA_ANIME_HANGMAN_WORDS });
}
