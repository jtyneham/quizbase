export function normalizePlayableChar(ch) {
  const base = (ch || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  return /^[A-Z]$/.test(base) ? base : "";
}

export function normalizePlayableAnswer(value) {
  return [...String(value || "")].map(ch => normalizePlayableChar(ch) || ch).join("");
}

export function uniquePlayableLetters(value) {
  return [...new Set([...String(value || "")].map(normalizePlayableChar).filter(Boolean))];
}

export function isSolved(answer, guessed) {
  return uniquePlayableLetters(answer).every(letter => guessed.has(letter));
}

export function isCorrectGuess(answer, letter) {
  return normalizePlayableAnswer(answer).includes(String(letter || "").toUpperCase());
}

export function normalizeSolveAttempt(value) {
  return normalizePlayableAnswer(String(value || "").trim().replace(/\s+/g, " ").toUpperCase());
}

/**
 * Draws without replacement for one active topic setup. Once every answer in
 * that setup has appeared, it starts a newly shuffled cycle on the next draw.
 */
export function pickWithAnswerDeck(pool, usedAnswers = new Set(), getAnswer = value => value, random = Math.random) {
  if (!pool.length) return { value: null, usedAnswers: new Set(), recycled: false };

  const used = new Set([...usedAnswers].map(normalizePlayableAnswer));
  const unseen = pool.filter((entry) => !used.has(normalizePlayableAnswer(getAnswer(entry))));
  const recycled = unseen.length === 0;
  const choices = recycled ? pool : unseen;
  const value = choices[Math.floor(random() * choices.length)];
  const nextUsed = recycled ? new Set() : used;
  nextUsed.add(normalizePlayableAnswer(getAnswer(value)));

  return { value, usedAnswers: nextUsed, recycled };
}
