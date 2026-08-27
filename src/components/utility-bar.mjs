const ENTER_PATH = "M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5";
const EXIT_PATH = "M9 3v6H3M15 3v6h6M21 15h-6v6M3 15h6v6";

export function createUtilityBar({ onHome, fullscreen, center, trailing } = {}) {
  const bar = document.createElement("header");
  bar.className = "utility-bar";
  bar.innerHTML = `
    <div class="utility-bar__start"></div>
    <div class="utility-bar__center"></div>
    <div class="utility-bar__end"></div>
  `;

  const home = document.createElement("button");
  home.type = "button";
  home.className = "utility-control utility-control--home";
  home.textContent = "Home";
  home.setAttribute("aria-label", "Back to Home");
  home.addEventListener("click", onHome);
  bar.querySelector(".utility-bar__start").append(home);

  if (center) bar.querySelector(".utility-bar__center").append(center);

  const fullscreenButton = document.createElement("button");
  fullscreenButton.type = "button";
  fullscreenButton.className = "utility-control utility-control--fullscreen";
  fullscreenButton.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path/></svg>`;
  const update = (active) => {
    fullscreenButton.setAttribute("aria-label", active ? "Exit fullscreen" : "Enter fullscreen");
    fullscreenButton.querySelector("path").setAttribute("d", active ? EXIT_PATH : ENTER_PATH);
  };
  fullscreenButton.addEventListener("click", () => fullscreen.toggle());
  const unsubscribe = fullscreen.subscribe(update);
  bar.querySelector(".utility-bar__start").append(fullscreenButton);
  if (trailing) bar.querySelector(".utility-bar__end").append(trailing);

  return { element: bar, destroy: unsubscribe };
}
