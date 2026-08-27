/** Shared, layout-agnostic UI bindings used by the game screens. */
export function bindFullscreenButton({ button, icon, label, app, hapticMs = 12 }) {
  if (!button || !app) return () => {};

  const enterIcon = '<path d="M3 8V3h5"></path><path d="M16 3h5v5"></path><path d="M21 16v5h-5"></path><path d="M8 21H3v-5"></path>';
  const exitIcon = '<path d="M8 3v5H3"></path><path d="M16 8h5V3"></path><path d="M21 16h-5v5"></path><path d="M8 16H3v5"></path>';

  const update = (active = app.isFullscreen()) => {
    const text = active ? "Exit fullscreen" : "Fullscreen";
    button.setAttribute("aria-label", text);
    button.title = text;
    if (label) label.textContent = text;
    if (icon) icon.innerHTML = active ? exitIcon : enterIcon;
  };
  const onClick = async () => {
    if (hapticMs && app.haptic) app.haptic(hapticMs);
    await app.toggleFullscreen();
  };

  button.addEventListener("click", onClick);
  const unsubscribe = app.onFullscreenChange(update);
  update();
  return () => {
    button.removeEventListener("click", onClick);
    unsubscribe?.();
  };
}

