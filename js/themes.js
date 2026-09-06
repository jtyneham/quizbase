// Apply before the first paint, including direct links and lazily loaded games.
// This small registry is the only source of selectable theme names and IDs.
(() => {
  const themes = [
    { id: "classic", name: "Classic", browserColor: "#eeeeee" },
    { id: "dark", name: "Dark", browserColor: "#14171d" },
    { id: "automata", name: "Automata", browserColor: "#d6d3bd" },
  ];
  const storageKey = "quizbase.theme";
  const hosts = "quiz-missing-word, quiz-missing-word-pokemon, quiz-hangman, quiz-hangman-pokemon";
  const resolve = id => themes.find(theme => theme.id === id) || themes[0];
  let saved;
  try { saved = localStorage.getItem(storageKey); } catch { /* Storage is optional. */ }
  let current = resolve(saved);

  function apply(theme) {
    current = theme;
    document.documentElement.dataset.theme = theme.id;
    // Host attributes let shared component CSS style inside Shadow DOM without
    // duplicating styles or relying on :host-context browser support.
    document.querySelectorAll(hosts).forEach(host => { host.dataset.theme = theme.id; });
    document.querySelector('[data-ui="browser-theme"]')?.setAttribute("content", theme.browserColor);
    const select = document.getElementById("themeSelect");
    if (select) select.value = theme.id;
  }
  apply(current);

  document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("themeSelect");
    for (const theme of themes) select.add(new Option(theme.name, theme.id));
    apply(current);
    select.addEventListener("change", () => {
      apply(resolve(select.value));
      try { localStorage.setItem(storageKey, current.id); } catch { /* Keep the session choice. */ }
    });
    window.addEventListener("storage", event => {
      if (event.key === storageKey || event.key === null) apply(resolve(event.newValue));
    });
  }, { once: true });
})();
