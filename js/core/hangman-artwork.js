import { Application, Container, Graphics } from "pixi.js";

/**
 * Pixi artwork adapter for Hangman.
 *
 * Game code only relies on `reset()` and `render(missCount)`. This keeps a
 * future reskin free to replace this renderer with SVG, Canvas, Rive, or a
 * completely different Pixi scene without touching the rules engine.
 */

// These are the reference illustration's native proportions. Keeping this
// coordinate system makes future visual adjustments direct and predictable.
const ART_WIDTH = 452;
const ART_HEIGHT = 557;
const INK = 0x111111;
const STROKE_WIDTH = 6;
const STAGE_DURATION_MS = 220;
const DEATH_EYES_DELAY_MS = 80;

// Each entry after the head is one line segment: torso, arms, then legs.
const LIMBS = [
  [370, 220, 370, 300],
  [370, 238, 315, 278],
  [370, 238, 425, 278],
  [370, 300, 327, 378],
  [370, 300, 413, 378],
];

function drawLine(graphics, x1, y1, x2, y2, progress = 1) {
  const endX = x1 + (x2 - x1) * progress;
  const endY = y1 + (y2 - y1) * progress;
  graphics.moveTo(x1, y1).lineTo(endX, endY).stroke({
    color: INK,
    width: STROKE_WIDTH,
    cap: "round",
    join: "round",
  });
}

function drawStaticGallows(graphics) {
  // Exact construction of the supplied reference: a stepped base, a hollow
  // post that shares its outer edge with the boxed beam, and a two-line brace
  // which ends on the beam's underside rather than crossing its face.
  drawLine(graphics, 30, 509, 30, 483);
  drawLine(graphics, 30, 483, 198, 483);
  drawLine(graphics, 198, 483, 198, 509);
  drawLine(graphics, 198, 509, 30, 509);

  drawLine(graphics, 54, 483, 54, 459);
  drawLine(graphics, 54, 459, 174, 459);
  drawLine(graphics, 174, 459, 174, 483);

  drawLine(graphics, 101, 459, 101, 27);
  drawLine(graphics, 101, 27, 394, 27);
  drawLine(graphics, 394, 27, 394, 51);
  drawLine(graphics, 394, 51, 126, 51);
  drawLine(graphics, 126, 51, 126, 459);

  drawLine(graphics, 126, 98, 172, 51);
  drawLine(graphics, 126, 128, 218, 51);
  drawLine(graphics, 369, 51, 369, 133);
}

function drawHead(graphics, progress) {
  const start = -Math.PI / 2;
  graphics.arc(370, 176, 43, start, start + Math.PI * 2 * progress).stroke({
    color: INK,
    width: STROKE_WIDTH,
    cap: "round",
    join: "round",
  });
}

function drawDeathEyes(graphics) {
  const eyeSize = 4;
  for (const centerX of [353, 387]) {
    drawLine(graphics, centerX - eyeSize, 168 - eyeSize, centerX + eyeSize, 168 + eyeSize);
    drawLine(graphics, centerX + eyeSize, 168 - eyeSize, centerX - eyeSize, 168 + eyeSize);
  }
}

/**
 * Creates one responsive Pixi canvas inside a Hangman component's shadow DOM.
 * The original SVG remains visible only while Pixi is initializing, so a
 * transient module-loading failure never leaves the game without artwork.
 */
export function createHangmanArtwork(root) {
  const host = root.querySelector("#hangmanPixiStage");
  const fallbackSvg = root.querySelector(".hangman");
  let app;
  let scene;
  let graphics;
  let misses = 0;
  let completedMisses = 0;
  let activeStage = 0;
  let stageProgress = 1;
  let showDeathEyes = false;
  let tickerCallback;
  let deathEyesTimer;

  function layout() {
    if (!app || !scene) return;
    const scale = Math.min(app.renderer.width / ART_WIDTH, app.renderer.height / ART_HEIGHT);
    scene.scale.set(scale);
    scene.x = (app.renderer.width - ART_WIDTH * scale) / 2;
    scene.y = (app.renderer.height - ART_HEIGHT * scale) / 2;
  }

  function draw() {
    if (!graphics) return;
    graphics.clear();
    drawStaticGallows(graphics);

    for (let stage = 1; stage <= misses; stage += 1) {
      const progress = stage === activeStage ? stageProgress : 1;
      if (stage === 1) drawHead(graphics, progress);
      else {
        const [x1, y1, x2, y2] = LIMBS[stage - 2];
        drawLine(graphics, x1, y1, x2, y2, progress);
      }
    }

    if (showDeathEyes) drawDeathEyes(graphics);
  }

  function stopStageAnimation() {
    if (app && tickerCallback) app.ticker.remove(tickerCallback);
    tickerCallback = undefined;
  }

  function animateNextStage(stage) {
    stopStageAnimation();
    activeStage = stage;
    stageProgress = 0;
    tickerCallback = (ticker) => {
      stageProgress = Math.min(1, stageProgress + ticker.deltaMS / STAGE_DURATION_MS);
      draw();
      if (stageProgress < 1) return;

      stopStageAnimation();
      completedMisses = stage;
      activeStage = 0;
      if (stage === 6) {
        deathEyesTimer = window.setTimeout(() => {
          showDeathEyes = true;
          draw();
        }, DEATH_EYES_DELAY_MS);
      }
    };
    app.ticker.add(tickerCallback);
    draw();
  }

  async function initialise() {
    if (!host) return;

    app = new Application();
    await app.init({ backgroundAlpha: 0, antialias: true });
    app.canvas.setAttribute("aria-hidden", "true");
    host.appendChild(app.canvas);

    scene = new Container();
    graphics = new Graphics();
    scene.addChild(graphics);
    app.stage.addChild(scene);
    // Keeping the renderer's bitmap exactly equal to the responsive host avoids
    // a canvas overflowing into the word and keyboard rows on wide layouts.
    const resizeCanvas = () => {
      app.renderer.resize(host.clientWidth, host.clientHeight);
      layout();
    };
    new ResizeObserver(resizeCanvas).observe(host);
    resizeCanvas();

    // Hide the legacy SVG only after the first usable Pixi draw.
    fallbackSvg?.setAttribute("aria-hidden", "true");
    if (fallbackSvg) fallbackSvg.style.display = "none";
    draw();
  }

  // Hangman can render before Pixi has finished loading; state is retained and
  // drawn as soon as the canvas is ready.
  void initialise();

  return {
    reset() {
      window.clearTimeout(deathEyesTimer);
      stopStageAnimation();
      misses = 0;
      completedMisses = 0;
      activeStage = 0;
      stageProgress = 1;
      showDeathEyes = false;
      draw();
    },

    render(nextMisses) {
      const safeMisses = Math.max(0, Math.min(6, Number(nextMisses) || 0));
      const isNewMiss = safeMisses > completedMisses && !activeStage;
      misses = safeMisses;

      if (isNewMiss && app) animateNextStage(safeMisses);
      else draw();
    },
  };
}
