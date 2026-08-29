/**
 * Curated vocabulary for the standard Business & Money topic.
 *
 * The first 100 entries are fair for both games. The final 20 are Missing
 * Word-only Hard entries: Hangman has no difficulty selector, so it should
 * not surface the specialist economics layer.
 */
export const BUSINESS_MONEY_WORDS = [
  // Easy: daily money and familiar commerce.
  ["bank", 1], ["budget", 1], ["cash", 1], ["coin", 1], ["money", 1],
  ["price", 1], ["cost", 1], ["sale", 1], ["discount", 1], ["receipt", 1],
  ["income", 1], ["salary", 1], ["wage", 1], ["savings", 1], ["loan", 1],
  ["debt", 1], ["tax", 1], ["bill", 1], ["payment", 1], ["purchase", 1],
  ["refund", 1], ["profit", 1], ["loss", 1], ["customer", 1], ["business", 1],
  ["company", 1], ["earnings", 1], ["finance", 1], ["shop", 1], ["store", 1],
  ["market", 1], ["product", 1], ["service", 1], ["account", 1], ["balance", 1],
  ["currency", 1], ["credit", 1], ["debit", 1], ["deposit", 1], ["withdrawal", 1],
  ["rent", 1], ["insurance", 1], ["commerce", 1], ["trade", 1], ["order", 1],

  // Medium: familiar business and economic vocabulary.
  ["advertising", 2], ["bank account", 2], ["bank statement", 2], ["cash flow", 2],
  ["credit card", 2], ["credit score", 2], ["debit card", 2], ["exchange rate", 2],
  ["expense", 2], ["invoice", 2], ["interest", 2], ["interest rate", 2],
  ["investment", 2], ["mortgage", 2], ["overdraft", 2], ["pension", 2],
  ["premium", 2], ["revenue", 2], ["stock market", 2], ["tax return", 2],
  ["transaction", 2], ["wholesale", 2], ["retail", 2], ["ledger", 2],
  ["supply chain", 2], ["demand", 2], ["economy", 2], ["inflation", 2],
  ["recession", 2], ["dividend", 2], ["capital", 2], ["asset", 2],
  ["liability", 2], ["ownership", 2], ["business plan", 2], ["merger", 2],
  ["acquisition", 2], ["franchise", 2], ["startup", 2], ["corporation", 2],
  ["negotiation", 2], ["marketing", 2], ["marketplace", 2], ["consumer", 2],
  ["competition", 2], ["commission", 2], ["subscription", 2], ["royalty", 2],
  ["turnover", 2], ["break-even", 2], ["profit margin", 2], ["annual report", 2],
  ["market share", 2], ["supply", 2], ["contract", 2],

  // Hard: Missing Word-only economics and finance concepts.
  ["bankruptcy", 3], ["depreciation", 3], ["liquidity", 3], ["solvency", 3],
  ["collateral", 3], ["equity", 3], ["portfolio", 3], ["fiscal policy", 3],
  ["monetary policy", 3], ["gross domestic product", 3], ["unemployment", 3],
  ["tariff", 3], ["deficit", 3], ["surplus", 3], ["opportunity cost", 3],
  ["purchasing power", 3], ["market value", 3], ["consumer price index", 3],
  ["economic growth", 3], ["supply and demand", 3]
];

export const BUSINESS_MONEY_TOPIC = "Business & Money";

export const BUSINESS_MONEY_HANGMAN_WORDS = BUSINESS_MONEY_WORDS
  .filter(([, difficulty]) => difficulty <= 2);

function canonicalWord(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

const BUSINESS_MONEY_BY_CANONICAL_WORD = new Map(
  BUSINESS_MONEY_WORDS.map(([word, difficulty]) => [canonicalWord(word), { word, difficulty }])
);

/**
 * Rehomes matching legacy entries under Business & Money and appends the
 * vocabulary that the original source did not contain. Grammar metadata is
 * deliberately kept only as Nouns; no previous specialist topic is retained.
 */
export function withBusinessMoneyMissingWordPool(entries) {
  const found = new Set();
  const updated = entries.map((entry) => {
    const definition = BUSINESS_MONEY_BY_CANONICAL_WORD.get(canonicalWord(entry.word));
    if (!definition) return entry;
    found.add(definition.word);
    return {
      ...entry,
      word: definition.word,
      difficulty: definition.difficulty,
      topics: [BUSINESS_MONEY_TOPIC, "Nouns"]
    };
  });

  BUSINESS_MONEY_WORDS.forEach(([word, difficulty]) => {
    if (!found.has(word)) {
      updated.push({ word, difficulty, topics: [BUSINESS_MONEY_TOPIC, "Nouns"] });
    }
  });

  return updated;
}

/**
 * Rehomes legacy duplicates before Hangman curation, then supplies the shared
 * easy/medium vocabulary. This keeps each answer in one player-facing topic.
 */
export function withBusinessMoneyHangmanPool(entries) {
  const businessAnswers = new Set(
    BUSINESS_MONEY_HANGMAN_WORDS.map(([word]) => canonicalWord(word))
  );
  const retained = entries.filter((entry) => !businessAnswers.has(canonicalWord(entry.answer)));
  const additions = BUSINESS_MONEY_HANGMAN_WORDS.map(([answer]) => ({
    answer: answer.toUpperCase(),
    category: BUSINESS_MONEY_TOPIC,
    subcategory: BUSINESS_MONEY_TOPIC,
    difficulty: "normal"
  }));
  return [...retained, ...additions];
}
