const ICONS = {
  "missing-word": `<path d="M8 31h14m8 0h14m8 0h14m8 0h14"/><text x="48" y="40">?</text>`,
  "missing-word-pokemon": `<circle cx="48" cy="32" r="24"/><path d="M24 32h48"/><circle cx="48" cy="32" r="7"/><text x="48" y="43">?</text>`,
  hangman: `<path d="M14 58h36M22 58V8h32v12M54 20v7"/><circle cx="54" cy="34" r="6"/><path d="M54 40v11m0-8-8 5m8-5 8 5m-8 3-6 8m6-8 6 8"/>`,
  "hangman-pokemon": `<path d="M14 58h36M22 58V8h32v12M54 20v7"/><circle cx="54" cy="39" r="11"/><path d="M43 39h22"/><circle cx="54" cy="39" r="3"/>`,
  "random-letter": `<rect x="19" y="8" width="42" height="48" rx="6"/><text x="40" y="42">A</text>`
};

export function createHomeView({ destinations }) {
  const screen = document.createElement("main");
  screen.className = "screen home-screen";
  screen.setAttribute("aria-label", "Quiz games");
  const list = document.createElement("div");
  list.className = "game-destinations";

  for (const destination of destinations) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "game-destination";
    button.dataset.game = destination.id;
    button.setAttribute("aria-label", destination.label);
    button.innerHTML = `<span class="game-destination__art"><svg viewBox="0 0 80 68" aria-hidden="true">${ICONS[destination.id] || ""}</svg></span><span class="game-destination__label">${destination.label}</span>`;
    button.addEventListener("click", destination.open);
    list.append(button);
  }
  screen.append(list);
  return { element: screen, destroy() {} };
}
