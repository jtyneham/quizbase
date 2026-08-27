import { bindFullscreenButton } from "./ui.js";
import { countLetters } from "./missing-word-utils.js";
import { filterWordPool, weightedWordChoice, blankCountFor, wordLetterGroups, longestBlankRun, eachWordKeepsVisibleLetter } from "./missing-word-logic.js";
import { createMissingWordTopicPicker } from "./missing-word-topic-picker.js";
import { missingWordTemplate } from "./missing-word-template.js";
function initializeGame(root, app, config) {
    const { wordPool, topics: configuredTopics, screenId, topicMode = "general", initialTopics = ["General"] } = config;

    // Shared Missing Word engine. Game-specific data/topic behavior is injected by the wrapper.
    const GAME_CONFIG = {
      wordLength: {
        minLetters: 2,
        maxLetters: 20,
        maxWords: 3
      },

      masking: {
        profiles: {
          medium: {
            blankRatio: 0.42,
            preserveFirstChance: 0.72,
            preserveLastChance: 0.72,
            maxBlankRun: 2
          },
          hard: {
            blankRatio: 0.58,
            preserveFirstChance: 0.22,
            preserveLastChance: 0.22,
            maxBlankRun: 3
          }
        }
      },

      animation: {
        nextWordDuration: 1500,
        frameInterval: 55,
        revealDuration: 240
      },

      history: {
        recentWordLimit: 20
      },

      difficulty: {
        enabled: true,
        activeLevel: "mixed",
        mixedWeights: {
          medium: 0.65,
          hard: 0.35
        }
      }
    };

    

    const fullscreenButton = root.getElementById("fullscreenButton");
    const fullscreenIcon = root.getElementById("fullscreenIcon");
    const fullscreenLabel = root.getElementById("fullscreenLabel");
    const wordDisplay = root.getElementById("wordDisplay");
    const actionButton = root.getElementById("actionButton");
    const wordCard = root.getElementById("wordCard");
    const difficultyButtons = [
      ...root.querySelectorAll(".difficulty-control button")
    ];
    const TOPICS = configuredTopics;
    const topicPicker = createMissingWordTopicPicker({
      root,
      topics: TOPICS,
      mode: topicMode,
      initialTopics
    });

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const recentWords = [];
    const previousMasks = new Map();

    let gameState = "empty";
    let currentRoundDifficulty = "medium";
    let currentWord = "";
    let currentMask = [];
    let isAnimating = false;
    let activeReelAnimations = [];
    let generationStopRequested = false;
    let finishGeneration = null;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function pickRoundDifficulty() {
      if (GAME_CONFIG.difficulty.activeLevel !== "mixed") {
        return GAME_CONFIG.difficulty.activeLevel === 2
          ? "medium"
          : "hard";
      }

      return Math.random() < GAME_CONFIG.difficulty.mixedWeights.medium
        ? "medium"
        : "hard";
    }

    function filteredWordPool(roundDifficulty = currentRoundDifficulty) {
      const { selectedTopics, allTopicsMode } = topicPicker.getState();
      return filterWordPool({
        wordPool,
        roundDifficulty,
        gameConfig: GAME_CONFIG,
        recentWords,
        allTopicsMode,
        selectedTopics
      });
    }

    function chooseWord() {
      let pool = filteredWordPool(currentRoundDifficulty);

      if (pool.length === 0) {
        recentWords.splice(0, recentWords.length);
        pool = filteredWordPool(currentRoundDifficulty);
      }

      if (pool.length === 0) {
        return null;
      }

      const picked = weightedWordChoice(pool, currentRoundDifficulty);
      return picked.word.toUpperCase();
    }

    function createMask(word, roundDifficulty = currentRoundDifficulty) {
      const profile = GAME_CONFIG.masking.profiles[roundDifficulty];

      const letterIndexes = [...word]
        .map((character, index) => (
          /[A-Z]/.test(character) ? index : null
        ))
        .filter((index) => index !== null);

      const groups = wordLetterGroups(word);
      const desiredBlanks = blankCountFor(
        letterIndexes.length,
        profile
      );

      const firstLetterIndex = letterIndexes[0];
      const lastLetterIndex = letterIndexes[letterIndexes.length - 1];

      let bestChoice = [];
      let bestScore = -Infinity;

      // Generate many candidate masks and keep the best one.
      // This avoids predictable blank positions while enforcing difficulty rules.
      for (let attempt = 0; attempt < 80; attempt += 1) {
        const pool = [...letterIndexes];

        const filtered = pool.filter((index) => {
          if (
            index === firstLetterIndex &&
            Math.random() < profile.preserveFirstChance
          ) {
            return false;
          }

          if (
            index === lastLetterIndex &&
            Math.random() < profile.preserveLastChance
          ) {
            return false;
          }

          return true;
        });

        const candidates =
          filtered.length >= desiredBlanks ? filtered : pool;

        const chosen = [...candidates]
          .sort(() => Math.random() - 0.5)
          .slice(0, desiredBlanks);

        const chosenSet = new Set(chosen);

        if (!eachWordKeepsVisibleLetter(chosenSet, groups)) {
          continue;
        }

        const run = longestBlankRun(chosenSet, groups);

        if (run > profile.maxBlankRun) {
          continue;
        }

        const signature = [...chosen].sort((a, b) => a - b).join(",");
        const previous = previousMasks.get(word);

        let score = Math.random();

        if (signature !== previous) score += 2;

        // Medium tolerates some adjacency.
        if (roundDifficulty === "medium" && run === 2) {
          score += 0.25;
        }

        // Hard rewards less predictable masks and occasional blank clusters.
        if (roundDifficulty === "hard") {
          if (chosenSet.has(firstLetterIndex)) score += 0.35;
          if (chosenSet.has(lastLetterIndex)) score += 0.35;
          if (run >= 2) score += 0.45;
        }

        if (score > bestScore) {
          bestScore = score;
          bestChoice = [...chosen];
        }
      }

      // Safe fallback if all candidate masks were rejected.
      if (bestChoice.length === 0) {
        bestChoice = [...letterIndexes]
          .sort(() => Math.random() - 0.5)
          .slice(0, desiredBlanks);
      }

      bestChoice.sort((a, b) => a - b);
      previousMasks.set(word, bestChoice.join(","));

      const chosenSet = new Set(bestChoice);

      return [...word].map((character, index) =>
        /[A-Z]/.test(character) && chosenSet.has(index)
      );
    }

    function slotFontSize(wordLength) {
      if (wordLength <= 4) return "clamp(4.6rem, 16vw, 8rem)";
      if (wordLength <= 7) return "clamp(3.4rem, 11vw, 6.2rem)";
      if (wordLength <= 10) return "clamp(2.65rem, 8vw, 4.8rem)";
      if (wordLength <= 14) return "clamp(2.1rem, 6vw, 3.7rem)";
      return "clamp(1.65rem, 4.8vw, 3rem)";
    }

    function shuffledAlphabet() {
      const letters = [...alphabet];

      for (let index = letters.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [letters[index], letters[randomIndex]] = [
          letters[randomIndex],
          letters[index]
        ];
      }

      return letters;
    }

    function createReelSequence(finalCharacter, slotIndex) {
      const sequence = [];
      const cycles = 4;

      // Each slot receives independently shuffled cycles, so adjacent reels
      // show different letters while spinning.
      for (let cycle = 0; cycle < cycles; cycle += 1) {
        const cycleLetters = shuffledAlphabet();

        // Rotate each shuffled cycle again by a slot-specific random offset.
        const offset =
          (slotIndex * 5 + Math.floor(Math.random() * alphabet.length)) %
          alphabet.length;

        sequence.push(
          ...cycleLetters.slice(offset),
          ...cycleLetters.slice(0, offset)
        );
      }

      // The final cell is always the actual target character.
      sequence.push(finalCharacter);
      return sequence;
    }

    function measureCharacterWidth(character, fontSize) {
      const measure = document.createElement("span");
      measure.className = "measure-character";
      measure.style.setProperty("--slot-size", fontSize);
      measure.style.fontSize = fontSize;
      measure.style.fontWeight = "700";
      measure.textContent = character;

      wordDisplay.appendChild(measure);
      const width = measure.getBoundingClientRect().width;
      measure.remove();

      // This is the logical layout width only.
      // The reel window itself is wider and centered over this slot, so glyphs
      // can paint beyond the advance box without changing letter spacing.
      return Math.max(Math.ceil(width), 10);
    }

    function createSpinningSlots(word, mask) {
      wordDisplay.replaceChildren();
      wordDisplay.classList.remove("empty");

      const fontSize = slotFontSize(countLetters(word));

      return [...word].map((character, index) => {
        const slot = document.createElement("span");
        slot.className = "slot";
        slot.style.setProperty("--slot-size", fontSize);
        slot.style.fontSize = fontSize;

        if (!/[A-Z]/.test(character)) {
          slot.classList.add("structural");

          if (character === " ") {
            slot.classList.add("space");
            slot.textContent = "";
          } else if (character === "-") {
            slot.classList.add("hyphen");
            slot.textContent = "–";
          } else {
            slot.textContent = character;
          }

          wordDisplay.appendChild(slot);

          return {
            slot,
            reelStrip: null,
            finalIndex: null,
            isBlank: false,
            isStructural: true,
            character
          };
        }

        if (mask[index]) {
          slot.classList.add("blank");
          slot.style.width = "var(--blank-slot-width)";
          wordDisplay.appendChild(slot);

          return {
            slot,
            reelStrip: null,
            finalIndex: null,
            isBlank: true,
            isStructural: false,
            character
          };
        }

        const slotWidth = measureCharacterWidth(character, fontSize);
        slot.style.width = `${slotWidth}px`;

        const reelWindow = document.createElement("span");
        reelWindow.className = "reel-window";

        const reelStrip = document.createElement("span");
        reelStrip.className = "reel-strip";

        const sequence = createReelSequence(character, index);

        sequence.forEach((reelCharacter) => {
          const cell = document.createElement("span");
          cell.className = "reel-cell";
          cell.textContent = reelCharacter;
          reelStrip.appendChild(cell);
        });

        reelWindow.appendChild(reelStrip);
        slot.appendChild(reelWindow);
        wordDisplay.appendChild(slot);

        return {
          slot,
          reelStrip,
          finalIndex: sequence.length - 1,
          isBlank: false,
          isStructural: false,
          character
        };
      });
    }

    function settleSlot(slot, character) {
      slot.replaceChildren();
      slot.textContent = character;
      slot.classList.add("settled");
    }

    function wait(milliseconds) {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }

    function settleGenerationReels() {
      activeReelAnimations.forEach(({ reelStrip, finalOffset }) => {
        if (!reelStrip) return;
        reelStrip.style.transition = "none";
        reelStrip.style.transform = `translateY(${finalOffset}em)`;
      });
      activeReelAnimations = [];
    }

    function stopCurrentGeneration() {
      if (gameState !== "generating") return;
      generationStopRequested = true;
      settleGenerationReels();
      finishGeneration?.();
    }

    function renderMaskedWordStatic(word, mask) {
      wordDisplay.replaceChildren();
      wordDisplay.classList.remove("empty");
      const fontSize = slotFontSize(countLetters(word));

      [...word].forEach((character, index) => {
        const slot = document.createElement("span");
        slot.className = "slot";
        slot.style.setProperty("--slot-size", fontSize);
        slot.style.fontSize = fontSize;

        if (!/[A-Z]/.test(character)) {
          slot.classList.add("structural");
          if (character === " ") slot.classList.add("space");
          else if (character === "-") { slot.classList.add("hyphen"); slot.textContent = "–"; }
          else slot.textContent = character;
        } else if (mask[index]) {
          slot.classList.add("blank");
          slot.style.width = "var(--blank-slot-width)";
        } else {
          slot.textContent = character;
          slot.classList.add("settled");
        }

        wordDisplay.appendChild(slot);
      });
    }

    async function animateNextWord(word, mask) {
      let reels;
      try {
        reels = createSpinningSlots(word, mask);
      } catch (error) {
        console.error("Missing Word reel rendering failed; using static fallback.", error);
        renderMaskedWordStatic(word, mask);
        return;
      }

      const duration = GAME_CONFIG.animation.nextWordDuration;
      const cellHeight = 1.12;
      generationStopRequested = false;
      activeReelAnimations = reels
        .filter(({ isBlank, isStructural }) => !isBlank && !isStructural)
        .map(({ reelStrip, finalIndex }) => ({
          reelStrip,
          finalOffset: -(finalIndex * cellHeight)
        }));

      if (prefersReducedMotion || activeReelAnimations.length === 0) {
        settleGenerationReels();
        return;
      }

      // Generation completion is timer-owned rather than Animation.finished-owned.
      // This keeps real browser/device interaction deterministic while the reel
      // movement remains a purely visual CSS transition.
      await new Promise((resolve) => {
        let done = false;
        let timer = 0;
        const finish = () => {
          if (done) return;
          done = true;
          window.clearTimeout(timer);
          settleGenerationReels();
          if (finishGeneration === finish) finishGeneration = null;
          resolve();
        };
        finishGeneration = finish;

        activeReelAnimations.forEach(({ reelStrip, finalOffset }, index) => {
          reelStrip.style.transition = `transform ${duration}ms cubic-bezier(0.10, 0.70, 0.14, 1)`;
          // Force the initial transform to be committed before moving the reel.
          void reelStrip.offsetHeight;
          const stagger = Math.min(index * 12, 72);
          window.setTimeout(() => {
            if (!done && reelStrip.isConnected) {
              reelStrip.style.transform = `translateY(${finalOffset}em)`;
            }
          }, stagger);
        });

        timer = window.setTimeout(finish, duration + 120);
      });
    }

    async function revealWord() {
      const slots = [...wordDisplay.querySelectorAll(".slot")];
      const newlyRevealed = [];

      slots.forEach((slot, index) => {
        if (!slot.classList.contains("blank")) {
          return;
        }

        // Keep the blank slot's existing fixed width during reveal.
        // Only swap the visual content so the entire word stays perfectly still.
        slot.classList.remove("blank");
        slot.classList.add("revealed-fixed");

        const reelWindow = document.createElement("span");
        reelWindow.className = "reel-window";

        const reelStrip = document.createElement("span");
        reelStrip.className = "reel-strip";

        const cell = document.createElement("span");
        cell.className = "reel-cell";
        cell.textContent = currentWord[index];

        reelStrip.appendChild(cell);
        reelWindow.appendChild(reelStrip);
        slot.replaceChildren(reelWindow);

        newlyRevealed.push(slot);
      });

      if (!prefersReducedMotion && newlyRevealed.length > 0) {
        void wordDisplay.offsetWidth;

        newlyRevealed.forEach((slot) => {
          slot.classList.add("revealed");
        });

        await wait(GAME_CONFIG.animation.revealDuration);

        newlyRevealed.forEach((slot) => {
          slot.classList.remove("revealed");
        });
      }

      gameState = "revealed";
      actionButton.textContent = "Next Word";
      actionButton.classList.remove("reveal-mode");
    }

    async function nextWord() {
      actionButton.classList.remove("reveal-mode");

      currentRoundDifficulty = pickRoundDifficulty();
      currentWord = chooseWord();

      if (!currentWord) {
        wordDisplay.replaceChildren();
        wordDisplay.classList.remove("empty");
        wordDisplay.textContent = "No matching words";
        gameState = "empty";
        actionButton.textContent = "Next Word";
        return;
      }

      currentMask = createMask(currentWord, currentRoundDifficulty);
      recentWords.push(currentWord.toLowerCase());
      while (recentWords.length > GAME_CONFIG.history.recentWordLimit) {
        recentWords.shift();
      }

      gameState = "generating";
      // The reel animation is decorative. A browser can interrupt its timing
      // during a page lifecycle change, so a round must never depend on the
      // animation promise alone to become playable.
      let animationSettled = false;
      const generation = animateNextWord(currentWord, currentMask)
        .then(() => {
          animationSettled = true;
        })
        .catch((error) => {
          console.warn("Missing Word generation animation failed.", error);
        });

      await Promise.race([
        generation,
        wait(GAME_CONFIG.animation.nextWordDuration + 500)
      ]);

      if (!animationSettled) {
        finishGeneration?.();
        settleGenerationReels();
        renderMaskedWordStatic(currentWord, currentMask);
      }

      gameState = "masked";
      actionButton.textContent = "Reveal";
      actionButton.classList.add("reveal-mode");
    }

    async function handleAction() {
      if (isAnimating) {
        if (gameState === "generating") stopCurrentGeneration();
        return;
      }

      isAnimating = true;
      actionButton.classList.remove("press");
      void actionButton.offsetWidth;
      actionButton.classList.add("press");

      try {
        if (gameState === "masked") {
          actionButton.disabled = true;
          await revealWord();
        } else {
          actionButton.disabled = false;
          actionButton.classList.add("generating");
          await nextWord();
        }
      } catch (error) {
        console.error("Missing Word action failed.", error);
        // Never leave the game visually or logically locked. If a word was
        // already selected, show the playable masked round without animation.
        if (currentWord && currentMask.length) {
          renderMaskedWordStatic(currentWord, currentMask);
          gameState = "masked";
          actionButton.textContent = "Reveal";
          actionButton.classList.add("reveal-mode");
        } else {
          gameState = "empty";
          actionButton.textContent = "Next Word";
        }
      } finally {
        finishGeneration = null;
        actionButton.classList.remove("generating", "press");
        actionButton.disabled = false;
        isAnimating = false;
      }
    }

    function setDifficulty(level) {
      GAME_CONFIG.difficulty.activeLevel =
        level === "mixed" ? "mixed" : Number(level);

      difficultyButtons.forEach((button) => {
        const active = button.dataset.level === String(level);
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    }

    difficultyButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setDifficulty(button.dataset.level);
      });
    });

    bindFullscreenButton({ button: fullscreenButton, icon: fullscreenIcon, label: fullscreenLabel, app });

    root.getElementById("homeButton").addEventListener("click", () => {
      app.haptic(12);
      topicPicker.close();
      app.showHome();
    });


    actionButton.addEventListener("click", handleAction);

    wordCard.addEventListener("click", () => {
      handleAction();
    });

    wordCard.addEventListener("keydown", (event) => {
      if (event.code === "Enter" || event.code === "Space") {
        event.preventDefault();
        handleAction();
      }
    });

    window.addEventListener("keydown", (event) => {
      if (!app.isScreenActive(screenId)) return;
      if (
        event.code === "Space" &&
        event.target.tagName !== "BUTTON"
      ) {
        event.preventDefault();
        handleAction();
      }
    });

  
}

export function registerMissingWordGame({
  app,
  elementName,
  stylesheet,
  screenId,
  wordPool,
  topics,
  initialTopics = ["General"],
  topicMode = "general"
}) {
  if (customElements.get(elementName)) return;

  class QuizMissingWordGame extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({mode:"open"});
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = stylesheet;
      const wrapper = document.createElement("div");
      wrapper.innerHTML = missingWordTemplate;
      root.append(link, wrapper);
      initializeGame(root, app, { wordPool, topics, screenId, initialTopics, topicMode });
    }
  }

  customElements.define(elementName, QuizMissingWordGame);
}
