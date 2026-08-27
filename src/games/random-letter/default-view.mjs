import { Lifecycle } from "../../core/lifecycle.mjs";
import { createUtilityBar } from "../../components/utility-bar.mjs";

export function createRandomLetterView({ engine, topics, app }) {
  const lifecycle = new Lifecycle();
  const screen = document.createElement("section");
  screen.className = "screen game-screen random-letter-screen";
  screen.innerHTML = `<div class="random-letter-layout"><div data-region="toolbar"></div><main class="random-letter-main"><button class="letter-card" type="button" aria-label="Generate a random letter"><span class="generated-letter" aria-live="polite">A</span></button><button class="primary-action" data-action="generate">Generate</button><label class="ideas-toggle"><span>Ideas</span><input type="checkbox"><span class="switch" aria-hidden="true"></span></label></main><aside class="ideas-panel" hidden aria-label="Topic ideas"><div class="ideas-track"></div></aside></div>`;
  const toolbar = createUtilityBar({ title: "Random Letter", onHome: app.home, fullscreen: app.fullscreen });
  screen.querySelector('[data-region="toolbar"]').append(toolbar.element);
  lifecycle.add(toolbar.destroy);
  const letter = screen.querySelector(".generated-letter");
  const ideas = screen.querySelector(".ideas-panel");
  const track = screen.querySelector(".ideas-track");
  const generate = screen.querySelector('[data-action="generate"]');
  track.textContent = [...topics, ...topics].join("  •  ");

  async function run() {
    generate.disabled = true;
    const state = engine.generate();
    letter.dataset.reveal = state.reveal;
    if (!app.reducedMotion) {
      letter.classList.remove("is-revealing");
      void letter.offsetWidth;
      letter.classList.add("is-revealing");
      await new Promise((resolve) => setTimeout(resolve, 420));
    }
    letter.textContent = state.letter;
    generate.disabled = false;
  }
  lifecycle.listen(generate, "click", run);
  lifecycle.listen(screen.querySelector(".letter-card"), "click", run);
  lifecycle.listen(screen.querySelector(".ideas-toggle input"), "change", (event) => {
    const state = engine.toggleIdeas(event.target.checked);
    ideas.hidden = !state.ideasVisible;
    screen.querySelector(".random-letter-layout").classList.toggle("has-ideas", state.ideasVisible);
  });
  lifecycle.listen(window, "keydown", (event) => { if (event.code === "Space" && !event.target.closest("button,input")) { event.preventDefault(); run(); } });
  return { element: screen, destroy: () => lifecycle.clear() };
}
