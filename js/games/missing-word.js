import { WORDS } from "../../data/missing-word-words.js";
import { bindFullscreenButton } from "../core/ui.js";
import { randomInteger, chooseRandom, countLetters, countWords } from "../core/missing-word-utils.js";

const templateHTML = `
  <div class="app">
    <header class="topbar">
      <button id="homeButton" class="home-button" type="button" aria-label="Back to Home" title="Home">
        <span>Home</span>
      </button>

      <button
        id="fullscreenButton"
        class="fullscreen-button"
        type="button"
        aria-label="Enter fullscreen"
        title="Fullscreen"
      >
        <svg id="fullscreenIcon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 3H3v5"></path>
          <path d="M16 3h5v5"></path>
          <path d="M21 16v5h-5"></path>
          <path d="M3 16v5h5"></path>
        </svg>
        <span id="fullscreenLabel">Fullscreen</span>
      </button>

      <div class="difficulty-control" aria-label="Difficulty">
        <button
          type="button"
          class="active"
          data-level="mixed"
          aria-pressed="true"
        >
          Mixed
        </button>
        <button
          type="button"
          data-level="2"
          aria-pressed="false"
        >
          Medium
        </button>
        <button
          type="button"
          data-level="3"
          aria-pressed="false"
        >
          Hard
        </button>
      </div>
    </header>

    <main class="main">
      <section class="game" aria-label="Guess the missing word">
        <div class="topic-picker" id="topicPicker">
          <button
            class="topic-picker-button"
            id="topicPickerButton"
            type="button"
            aria-expanded="false"
          >
            <span class="topic-label" id="topicLabel">Topic: General</span>
            <span class="topic-chevron">▼</span>
          </button>

          <div class="topic-panel" id="topicPanel">
            <input
              class="topic-search"
              id="topicSearch"
              type="search"
              placeholder="Search topics..."
              autocomplete="off"
            />

            <div class="topic-all-row">
              <span>All Topics</span>
              <button id="topicAllButton" type="button">Use All</button>
            </div>

            <div class="topic-list" id="topicList"></div>

            <div class="topic-panel-footer">
              <button class="topic-clear" id="topicClearButton" type="button">
                Clear
              </button>
              <button class="topic-done" id="topicDoneButton" type="button">
                Done
              </button>
            </div>
          </div>
        </div>

        <div class="word-card" id="wordCard" aria-live="polite" role="button" tabindex="0" aria-label="Game action">
          <div id="wordDisplay" class="word-display empty"></div>
        </div>

        <button id="actionButton" class="action-button" type="button">
          Next Word
        </button>
      </section>
    </main>
  </div>

  `;
let appAPI = null;

function initializeGame(root, app) {

    // Missing Word v0.986 General Beta — adds curated General casual-play pool and makes it the default.
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
    const topicPicker = root.getElementById("topicPicker");
    const topicPickerButton = root.getElementById("topicPickerButton");
    const topicPanel = root.getElementById("topicPanel");
    const topicLabel = root.getElementById("topicLabel");
    const topicSearch = root.getElementById("topicSearch");
    const topicList = root.getElementById("topicList");
    const topicAllButton = root.getElementById("topicAllButton");
    const topicClearButton = root.getElementById("topicClearButton");
    const topicDoneButton = root.getElementById("topicDoneButton");

    const TOPICS = ["General", "Animals", "Food & Drink", "Geography", "Nature", "Space", "Science", "Human Body", "Medicine", "History", "Mythology", "Sports", "Games", "Video Games", "Pokemon", "Movies & TV", "Music", "Books & Literature", "People & Professions", "IT & Technology", "Vehicles", "Household", "Clothing", "Tools", "Buildings & Places", "Everyday Objects", "Brands", "Nouns", "Verbs", "Adjectives"];
    let selectedTopics = new Set(["General"]);
    let pendingTopics = new Set(["General"]);
    let allTopicsMode = false;

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

    function wordAllowedForRound(entry, roundDifficulty) {
      if (!GAME_CONFIG.difficulty.enabled) return true;

      if (roundDifficulty === "medium") {
        return entry.difficulty <= 2;
      }

      // Hard mode deliberately uses the entire vocabulary range.
      // Difficulty comes from harder masking as well as vocabulary.
      return entry.difficulty <= 3;
    }

    function filteredWordPool(roundDifficulty = currentRoundDifficulty) {
      return WORDS.filter((entry) => {
        const normalized = entry.word.toLowerCase();
        const letterCount = countLetters(normalized);

        const validLength =
          letterCount >= GAME_CONFIG.wordLength.minLetters &&
          letterCount <= GAME_CONFIG.wordLength.maxLetters &&
          countWords(normalized) <= GAME_CONFIG.wordLength.maxWords;

        const notRecent = !recentWords.includes(normalized);

        const allowedByDifficulty =
          wordAllowedForRound(entry, roundDifficulty);

        const allowedByTopic =
          allTopicsMode ||
          entry.topics.some((topic) => selectedTopics.has(topic));

        return (
          validLength &&
          notRecent &&
          allowedByDifficulty &&
          allowedByTopic
        );
      });
    }

    function weightedWordChoice(pool, roundDifficulty) {
      if (pool.length === 0) return null;

      const weightsByRound = {
        medium: { 1: 0.45, 2: 0.55, 3: 0 },
        hard: { 1: 0.20, 2: 0.45, 3: 0.35 }
      };

      const weights = weightsByRound[roundDifficulty];
      const weighted = pool.map((entry) => ({
        entry,
        weight: weights[entry.difficulty] || 0
      }));

      const total = weighted.reduce((sum, item) => sum + item.weight, 0);

      if (total <= 0) {
        return chooseRandom(pool);
      }

      let roll = Math.random() * total;

      for (const item of weighted) {
        roll -= item.weight;
        if (roll <= 0) return item.entry;
      }

      return weighted[weighted.length - 1].entry;
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

    function blankCountFor(length, roundDifficulty) {
      const profile = GAME_CONFIG.masking.profiles[roundDifficulty];
      const target = Math.round(length * profile.blankRatio);

      return Math.max(
        1,
        Math.min(target, Math.max(1, length - 1))
      );
    }

    function wordLetterGroups(word) {
      const groups = [];
      let current = [];

      [...word].forEach((character, index) => {
        if (/[A-Z]/.test(character)) {
          current.push(index);
        } else if (current.length > 0) {
          groups.push(current);
          current = [];
        }
      });

      if (current.length > 0) groups.push(current);
      return groups;
    }

    function longestBlankRun(chosenSet, groups) {
      let longest = 0;

      groups.forEach((group) => {
        let run = 0;

        group.forEach((index) => {
          if (chosenSet.has(index)) {
            run += 1;
            longest = Math.max(longest, run);
          } else {
            run = 0;
          }
        });
      });

      return longest;
    }

    function eachWordKeepsVisibleLetter(chosenSet, groups) {
      return groups.every((group) =>
        group.some((index) => !chosenSet.has(index))
      );
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
        roundDifficulty
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

    function stopCurrentGeneration() {
      if (gameState !== "generating" || activeReelAnimations.length === 0) {
        return;
      }

      generationStopRequested = true;

      const stopDuration = 100;

      activeReelAnimations.forEach(({ animation, reelStrip, finalOffset }) => {
        // Freeze the reel exactly where it is at the moment of the tap.
        const currentTransform = window.getComputedStyle(reelStrip).transform;
        animation.cancel();

        reelStrip.style.transform = currentTransform;

        // Then brake very quickly into the already-determined final letter.
        const stopAnimation = reelStrip.animate(
          [
            { transform: currentTransform },
            { transform: `translateY(${finalOffset}em)` }
          ],
          {
            duration: stopDuration,
            easing: "cubic-bezier(0.15, 0.85, 0.25, 1)",
            fill: "forwards"
          }
        );

        stopAnimation.finished
          .then(() => {
            reelStrip.style.transform = `translateY(${finalOffset}em)`;
            stopAnimation.cancel();
          })
          .catch(() => {});
      });

      activeReelAnimations = [];
    }

    async function animateNextWord(word, mask) {
      const reels = createSpinningSlots(word, mask);
      const duration = GAME_CONFIG.animation.nextWordDuration;
      const cellHeight = 1.12;

      generationStopRequested = false;
      activeReelAnimations = [];

      if (prefersReducedMotion) {
        reels.forEach(({ reelStrip, finalIndex, isBlank, isStructural }) => {
          if (isBlank || isStructural) return;
          reelStrip.style.transform =
            `translateY(-${finalIndex * cellHeight}em)`;
        });
        return;
      }

      const animations = reels
        .filter(({ isBlank, isStructural }) => !isBlank && !isStructural)
        .map(({ reelStrip, finalIndex }, index) => {
          const finalOffset = -(finalIndex * cellHeight);
          const middleBias = 0.50 + (index % 3) * 0.015;

          const animation = reelStrip.animate(
            [
              {
                transform: "translateY(0)",
                offset: 0
              },
              {
                transform: `translateY(${finalOffset * 0.58}em)`,
                offset: middleBias
              },
              {
                transform: `translateY(${finalOffset * 0.88}em)`,
                offset: 0.84
              },
              {
                transform: `translateY(${finalOffset}em)`,
                offset: 1
              }
            ],
            {
              duration,
              easing: "cubic-bezier(0.10, 0.70, 0.14, 1)",
              fill: "forwards"
            }
          );

          const record = {
            animation,
            reelStrip,
            finalOffset
          };

          activeReelAnimations.push(record);

          return animation.finished
            .then(() => {
              reelStrip.style.transform = `translateY(${finalOffset}em)`;
              animation.cancel();
            })
            .catch(() => {
              // Cancellation is expected when the player stops generation early.
              if (generationStopRequested) {
                reelStrip.style.transform = `translateY(${finalOffset}em)`;
              }
            });
        });

      await Promise.all(animations);
      activeReelAnimations = [];
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
        actionButton.textContent = "Next Word";
        actionButton.classList.remove("generating");
        return;
      }

      currentMask = createMask(currentWord, currentRoundDifficulty);

      recentWords.push(currentWord.toLowerCase());

      while (
        recentWords.length > GAME_CONFIG.history.recentWordLimit
      ) {
        recentWords.shift();
      }

      gameState = "generating";
      await animateNextWord(currentWord, currentMask);

      gameState = "masked";
      actionButton.textContent = "Reveal";
      actionButton.classList.add("reveal-mode");
    }

    async function handleAction() {
      // While the slot reels are spinning, the same controls become "stop".
      if (isAnimating) {
        if (gameState === "generating") {
          stopCurrentGeneration();
        }
        return;
      }

      isAnimating = true;
      actionButton.classList.remove("press");
      void actionButton.offsetWidth;
      actionButton.classList.add("press");

      if (gameState === "masked") {
        // Reveal itself is intentionally non-interruptible.
        actionButton.disabled = true;
        await revealWord();
        actionButton.disabled = false;
      } else {
        // Keep the button enabled during generation so a second tap can stop it.
        actionButton.disabled = false;
        actionButton.classList.add("generating");
        await nextWord();
        actionButton.classList.remove("generating");
      }

      actionButton.classList.remove("press");
      actionButton.disabled = false;
      isAnimating = false;
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

    function renderTopicOptions() {
      const query = topicSearch.value.trim().toLowerCase();
      topicList.replaceChildren();

      TOPICS
        .filter((topic) => topic.toLowerCase().includes(query))
        .forEach((topic) => {
          const option = document.createElement("button");
          option.type = "button";
          option.className =
            "topic-option" +
            (pendingTopics.has(topic) ? " selected" : "");

          const checkbox = document.createElement("span");
          checkbox.className = "topic-checkbox";

          const text = document.createElement("span");
          text.textContent = topic;

          option.append(checkbox, text);

          option.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (pendingTopics.has(topic)) {
              pendingTopics.delete(topic);
            } else {
              pendingTopics.add(topic);
            }

            renderTopicOptions();
            topicPicker.classList.add("open");
          });

          topicList.appendChild(option);
        });
    }

    function updateTopicLabel() {
      if (allTopicsMode || selectedTopics.size === 0) {
        topicLabel.textContent = "Topic: All Topics";
      } else if (selectedTopics.size === 1) {
        topicLabel.textContent =
          "Topic: " + [...selectedTopics][0];
      } else {
        topicLabel.textContent =
          "Topics: " + selectedTopics.size + " selected";
      }
    }

    function setTopicPanelOpen(open) {
      topicPicker.classList.toggle("open", open);
      topicPickerButton.setAttribute("aria-expanded", String(open));

      if (open) {
        pendingTopics = new Set(
          allTopicsMode ? [] : selectedTopics
        );
        renderTopicOptions();

        // Do not auto-focus the search field.
        // On mobile this would immediately summon the keyboard.
      }
    }

    function playTapFeedback(button) {
      button.classList.remove("tap-feedback");
      void button.offsetWidth;
      button.classList.add("tap-feedback");

      window.setTimeout(() => {
        button.classList.remove("tap-feedback");
      }, 150);
    }

    topicPickerButton.addEventListener("click", () => {
      setTopicPanelOpen(!topicPicker.classList.contains("open"));
    });

    topicPanel.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    topicAllButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      playTapFeedback(topicAllButton);
      pendingTopics.clear();
      renderTopicOptions();
    });

    topicClearButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      playTapFeedback(topicClearButton);
      pendingTopics.clear();
      renderTopicOptions();
    });

    topicDoneButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      playTapFeedback(topicDoneButton);

      selectedTopics = new Set(pendingTopics);
      allTopicsMode = selectedTopics.size === 0;

      updateTopicLabel();
      topicSearch.value = "";

      // Let the press feedback register before the panel closes.
      window.setTimeout(() => {
        setTopicPanelOpen(false);
      }, 90);
    });

    topicSearch.addEventListener("input", renderTopicOptions);

    root.addEventListener("click", (event) => {
      if (!topicPicker.contains(event.target)) {
        setTopicPanelOpen(false);
      }
    });

    bindFullscreenButton({ button: fullscreenButton, icon: fullscreenIcon, label: fullscreenLabel, app });

    root.getElementById("homeButton").addEventListener("click", () => {
      app.haptic(12);
      setTopicPanelOpen(false);
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
      if (!app.isScreenActive("missingword")) return;
      if (
        event.code === "Space" &&
        event.target.tagName !== "BUTTON"
      ) {
        event.preventDefault();
        handleAction();
      }
    });

  
}

class QuizMissingWord extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({mode:"open"});
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/missing-word.css";
    const wrapper = document.createElement("div");
    wrapper.innerHTML = templateHTML;
    root.append(link, wrapper);
    initializeGame(root, appAPI);
  }
}

export function registerMissingWord(app) {
  appAPI = app;
  if (!customElements.get("quiz-missing-word")) {
    customElements.define("quiz-missing-word", QuizMissingWord);
  }
}
