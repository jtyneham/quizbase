/**
 * Shared integration helpers for deliberately curated specialist topics.
 *
 * A topic owns every matching answer it contributes. That prevents the same
 * answer from appearing under an unrelated legacy category or General mode.
 */
export function canonicalTopicWord(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function withCuratedMissingWordTopic(entries, { topic, words, grammarTopics = ["Nouns"] }) {
  const definitions = new Map(
    words.map(([word, difficulty]) => [canonicalTopicWord(word), { word, difficulty }])
  );
  const found = new Set();

  const updated = entries.map((entry) => {
    const definition = definitions.get(canonicalTopicWord(entry.word));
    if (!definition) return entry;
    found.add(definition.word);
    return {
      ...entry,
      word: definition.word,
      difficulty: definition.difficulty,
      topics: [topic, ...grammarTopics]
    };
  });

  words.forEach(([word, difficulty]) => {
    if (!found.has(word)) {
      updated.push({ word, difficulty, topics: [topic, ...grammarTopics] });
    }
  });

  return updated;
}

export function withCuratedHangmanTopic(entries, { topic, words }) {
  const answers = new Set(words.map(([word]) => canonicalTopicWord(word)));
  const retained = entries.filter((entry) => !answers.has(canonicalTopicWord(entry.answer)));
  const additions = words.map(([answer]) => ({
    answer: answer.toUpperCase(),
    category: topic,
    subcategory: topic,
    difficulty: "normal"
  }));
  return [...retained, ...additions];
}
