/**
 * Default DOM/SVG reveal renderer for Random Letter.
 *
 * The game engine supplies a final letter; this adapter owns only the four
 * decorative reveal effects. A future Pixi renderer can use the same contract:
 * `play({ finalLetter })`, `reset()`, and `destroy()`.
 */
export function createRandomLetterDomRevealRenderer({
  letterElement, letterCard, tunnelLayer, wheelScene, wheelLayout,
  wheelVisual, wheelSpinner, wheelWinner, randomDisplayLetter, reducedMotion,
}) {
  const timing = { reveal: 1150, pop: 360, flipCount: 5, tunnelPasses: 5, wheelTurns: 5, wheelHold: 110, wheelTravel: 300 };
  let wheelRotation = 0;
  const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));
  const polar = (cx, cy, radius, degrees) => {
    const angle = (degrees - 90) * Math.PI / 180;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  };
  const wedgePath = (cx, cy, radius, start, end) => {
    const first = polar(cx, cy, radius, end); const last = polar(cx, cy, radius, start);
    return `M ${cx} ${cy} L ${first.x} ${first.y} A ${radius} ${radius} 0 ${end - start <= 180 ? 0 : 1} 0 ${last.x} ${last.y} Z`;
  };

  function buildWheel() {
    const svg = "http://www.w3.org/2000/svg"; const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; const segment = 360 / alphabet.length;
    wheelSpinner.replaceChildren();
    alphabet.split("").forEach((letter, index) => {
      const start = index * segment - segment / 2; const point = polar(150, 150, 108, index * segment);
      const wedge = document.createElementNS(svg, "path"); wedge.setAttribute("d", wedgePath(150, 150, 138, start, start + segment));
      wedge.setAttribute("fill", index % 2 ? "var(--wheel-wedge-alt, #dfe5ec)" : "var(--wheel-wedge, #edf1f5)"); wedge.setAttribute("stroke", "var(--wheel-line, #ffffff)"); wedge.setAttribute("stroke-width", "1.4");
      const text = document.createElementNS(svg, "text"); text.setAttribute("x", point.x); text.setAttribute("y", point.y); text.setAttribute("text-anchor", "middle"); text.setAttribute("dominant-baseline", "middle"); text.setAttribute("fill", "var(--wheel-text, #26303d)"); text.setAttribute("font-size", "14"); text.setAttribute("font-weight", "800"); text.setAttribute("font-family", "var(--wheel-font, Inter, system-ui, sans-serif)"); text.setAttribute("transform", `rotate(${index * segment} ${point.x} ${point.y})`); text.textContent = letter;
      wheelSpinner.append(wedge, text);
    });
    const rim = document.createElementNS(svg, "circle"); rim.setAttribute("cx", "150"); rim.setAttribute("cy", "150"); rim.setAttribute("r", "138"); rim.setAttribute("fill", "none"); rim.setAttribute("stroke", "var(--wheel-rim, #cfd7e1)"); rim.setAttribute("stroke-width", "3"); wheelSpinner.appendChild(rim);
  }

  function reset() {
    letterElement.hidden = false; letterElement.className = "letter"; letterElement.style.transform = ""; letterElement.style.opacity = "";
    tunnelLayer.className = "tunnel-layer"; tunnelLayer.textContent = ""; wheelScene.classList.remove("visible"); wheelScene.setAttribute("aria-hidden", "true"); wheelVisual.classList.remove("greyed");
    wheelWinner.style.display = "none"; wheelWinner.textContent = ""; wheelWinner.getAnimations().forEach((animation) => animation.cancel()); wheelSpinner.getAnimations().forEach((animation) => animation.cancel()); wheelSpinner.style.transform = `rotate(${wheelRotation}deg)`;
  }
  async function pop(finalLetter) { letterElement.hidden = false; letterElement.textContent = finalLetter; letterElement.classList.remove("pop"); void letterElement.offsetWidth; letterElement.classList.add("pop"); await wait(timing.pop); letterElement.classList.remove("pop"); }
  async function slot(finalLetter) { for (const delay of [45,45,50,55,60,70,80,95,115,140,175,220]) { letterElement.textContent = randomDisplayLetter(); await wait(delay); } await pop(finalLetter); }
  async function flip(finalLetter) { for (let index = 0; index < timing.flipCount; index += 1) { letterElement.className = "letter"; void letterElement.offsetWidth; letterElement.classList.add("flip-step"); await wait(timing.reveal / timing.flipCount / 2); letterElement.textContent = randomDisplayLetter(); await wait(timing.reveal / timing.flipCount / 2); } letterElement.classList.remove("flip-step"); await pop(finalLetter); }
  async function tunnel(finalLetter) { letterElement.hidden = true; for (let index = 0; index < timing.tunnelPasses; index += 1) { tunnelLayer.textContent = randomDisplayLetter(); tunnelLayer.className = "tunnel-layer"; void tunnelLayer.offsetWidth; tunnelLayer.classList.add("tunnel-run"); await wait(timing.reveal / timing.tunnelPasses); } tunnelLayer.className = "tunnel-layer"; await pop(finalLetter); }
  async function wheel(finalLetter) {
    letterElement.hidden = true; wheelScene.classList.add("visible"); wheelScene.setAttribute("aria-hidden", "false"); wheelVisual.classList.remove("greyed");
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; const selected = alphabet.indexOf(finalLetter) * (360 / alphabet.length); const normalized = ((wheelRotation % 360) + 360) % 360; let delta = timing.wheelTurns * 360 - selected - normalized; while (delta < timing.wheelTurns * 360) delta += 360; const target = wheelRotation + delta;
    const spin = wheelSpinner.animate([{ transform: `rotate(${wheelRotation}deg)` }, { transform: `rotate(${target}deg)` }], { duration: timing.reveal - timing.wheelHold - timing.wheelTravel, easing: "cubic-bezier(0.10, 0.66, 0.08, 1)", fill: "forwards" }); await spin.finished; wheelRotation = target; wheelSpinner.style.transform = `rotate(${wheelRotation}deg)`; spin.cancel(); await wait(timing.wheelHold);
    const box = wheelLayout.getBoundingClientRect(); const startSize = Math.max(12, box.width * .046); const scale = parseFloat(getComputedStyle(letterElement).fontSize) / startSize; const travel = box.height / 2 - box.height * .087;
    wheelWinner.textContent = finalLetter; wheelWinner.style.display = "grid"; wheelWinner.style.fontSize = `${startSize}px`; wheelWinner.style.opacity = "1"; wheelWinner.style.transform = "translate(-50%, -50%) scale(1)"; wheelVisual.classList.add("greyed");
    const reveal = wheelWinner.animate([{transform:"translate(-50%, -50%) scale(1)",opacity:1},{transform:`translate(-50%, calc(-50% + ${travel}px)) scale(${scale})`,opacity:1,offset:.455},{transform:`translate(-50%, calc(-50% + ${travel}px)) scale(${scale*1.13})`,opacity:1,offset:.735},{transform:`translate(-50%, calc(-50% + ${travel}px)) scale(${scale})`,opacity:1}], {duration:timing.wheelTravel+timing.pop,easing:"linear",fill:"forwards"}); await reveal.finished; wheelScene.classList.remove("visible"); wheelScene.setAttribute("aria-hidden","true"); wheelWinner.style.display="none"; reveal.cancel(); letterElement.hidden=false; letterElement.textContent=finalLetter;
  }
  const effects = [slot, flip, tunnel, wheel];
  buildWheel(); wheelSpinner.style.transform = "rotate(0deg)";
  return { async play({ finalLetter }) { reset(); if (reducedMotion) { letterElement.textContent = finalLetter; return; } await effects[Math.floor(Math.random() * effects.length)](finalLetter); }, reset, destroy() { reset(); } };
}
