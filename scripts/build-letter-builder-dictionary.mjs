import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const sourcePath = process.argv[2];
if (!sourcePath) throw new Error("Usage: node scripts/build-letter-builder-dictionary.mjs <SCOWL word-list file>");

// SCOWL's usage labels catch most unsuitable entries. This small exact-match
// layer keeps Quizbase's family setting conservative where source labels vary.
const BLOCKED_WORDS = new Set([
  "anal", "anus", "arse", "arses", "ass", "asses", "bastard", "bastards",
  "bitch", "bitches", "boob", "boobs", "brothel", "brothels", "cock", "cocks",
  "condom", "condoms", "crap", "craps", "cunt", "cunts", "damn", "damned",
  "damning", "dick", "dicks", "erect", "erection", "erotic", "erotica", "fag",
  "fags", "faggot", "faggots", "fuck", "fucked", "fucker", "fuckers", "fucking",
  "fucks", "genital", "genitals", "gyp", "gypped", "gypping", "gyps", "hell",
  "hooker", "hookers", "orgasm", "orgasms", "penis", "penises", "piss", "pissed",
  "pisses", "pissing", "porn", "porno", "prostitute", "prostitutes", "pussies",
  "pussy", "semen", "sex", "sexy", "shit", "shits", "shitty", "slut", "sluts",
  "sperm", "testicle", "testicles", "tit", "tits", "vagina", "vaginas", "vibrator",
  "vulva", "vulvas", "wank", "wanker", "wankers", "wanking", "whore", "whores"
]);

const source = await readFile(resolve(sourcePath), "utf8");
const words = [...new Set(source.split(/\r?\n/)
  .map((word) => word.trim())
  // Lowercase-only removes SCOWL proper names; ASCII keeps tiles unambiguous.
  // SCOWL's /! suffix marks every requested offensive/vulgar usage class.
  .filter((word) => /^[a-z]{3,9}$/.test(word) && !BLOCKED_WORDS.has(word)))]
  .sort((first, second) => first.length - second.length || first.localeCompare(second));

const output = `/*\n * Generated from SCOWL rel-2026.02.25, size 40, British spelling B,\n * variant level 1. Proper names, non-ASCII entries, abbreviations/special\n * categories, marked vulgar/offensive entries, and Quizbase's family-safety\n * blocklist are excluded.\n * See vendor/SCOWL-LICENSE.txt.\n */\nconst LETTER_BUILDER_WORD_TEXT = \`${words.join("\\n")}\`;\n\nexport const LETTER_BUILDER_WORDS = Object.freeze(LETTER_BUILDER_WORD_TEXT.split("\\n"));\n`;

await writeFile(resolve("data/letter-builder-words.js"), output, "utf8");
console.log(`Wrote ${words.length} Letter Builder words.`);
