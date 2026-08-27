import { POKEMON_WORDS } from "../../data/missing-word-pokemon-words.js";
import { bindFullscreenButton } from "../core/ui.js";
import { bindOutsideDismiss } from "../core/ui.js";
import { POKEMON_TOPICS } from "../core/pokemon-topics.js";

let appAPI;

const templateHTML = `<div class="hangman-root">
<div class="app">
  <main class="game-card" id="gameCard">
    <div class="status-row">
      <div class="status-actions"><button class="home-button" id="homeButton" type="button" aria-label="Back to Home" title="Home">Home</button><button class="fullscreen-btn" id="fullscreenBtn" type="button" aria-label="Toggle fullscreen" title="Fullscreen">⛶</button></div>
      <button class="topics-btn" id="topicsBtn" type="button">Topics <span id="topicsCount">1</span></button>
<span class="tries-text" id="triesText">0 / 6 misses</span>
    </div>

    <div class="hangman-wrap">
      <svg class="hangman" viewBox="0 0 300 240" preserveAspectRatio="xMidYMid meet" aria-label="Hangman drawing">
        <defs>
          <linearGradient id="woodMain" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#6f451f"/>
            <stop offset="45%" stop-color="#9a6735"/>
            <stop offset="100%" stop-color="#5a3518"/>
          </linearGradient>
          <linearGradient id="woodLight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#b7834f"/>
            <stop offset="50%" stop-color="#d0a06a"/>
            <stop offset="100%" stop-color="#8a5b2d"/>
          </linearGradient>
          <linearGradient id="woodDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#5b3518"/>
            <stop offset="100%" stop-color="#3f2410"/>
          </linearGradient>
          <linearGradient id="ropeGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#d8aa57"/>
            <stop offset="50%" stop-color="#b97c2b"/>
            <stop offset="100%" stop-color="#875516"/>
          </linearGradient>
        </defs>

        <!-- wooden scaffold -->
        <rect class="wood-piece wood-main" x="48" y="18" width="174" height="22" rx="1.2"/>
        <rect class="wood-piece wood-main" x="65" y="38" width="22" height="198" rx="1.2"/>

        <!-- stabilizer feet -->
        <rect class="wood-piece wood-dark" x="44" y="224" width="28" height="12" rx="1"/>
        <rect class="wood-piece wood-dark" x="80" y="224" width="28" height="12" rx="1"/>

        <!-- diagonal support braces -->
        <line class="wood-brace wood-light" x1="84" y1="86" x2="128" y2="40"/>
        <line class="wood-brace wood-dark-line" x1="84" y1="116" x2="157" y2="40"/>

        <!-- subtle wood grain -->
        <line class="wood-grain" x1="58" y1="27" x2="118" y2="27"/>
        <line class="wood-grain" x1="137" y1="31" x2="203" y2="31"/>
        <line class="wood-grain" x1="75" y1="58" x2="75" y2="112"/>
        <line class="wood-grain" x1="78" y1="142" x2="78" y2="206"/>

        <!-- rope stem -->
        <line class="rope-under" x1="205" y1="40" x2="205" y2="68"/>
        <line class="rope-main" x1="205" y1="40" x2="205" y2="68"/>

        <!-- compact wrapped knot -->
        <rect class="rope-knot-under" x="197" y="66" width="16" height="11" rx="3.5"/>
        <rect class="rope-knot-main" x="198.5" y="67.5" width="13" height="8" rx="3"/>
        <line class="rope-wrap" x1="200" y1="70" x2="210" y2="70"/>
        <line class="rope-wrap" x1="199.5" y1="73.5" x2="210.5" y2="73.5"/>

        <!-- rear noose sides: behind head -->
        <path class="rope-under noose-rear" d="M199 76 C195 83 194 93 196 103"/>
        <path class="rope-main noose-rear" d="M199 76 C195 83 194 93 196 103"/>
        <path class="rope-under noose-rear" d="M211 76 C215 83 216 93 214 103"/>
        <path class="rope-main noose-rear" d="M211 76 C215 83 216 93 214 103"/>

        <!-- rope texture on stem -->
        <line class="rope-texture" x1="201" y1="46" x2="209" y2="49"/>
        <line class="rope-texture" x1="201" y1="54" x2="209" y2="57"/>
        <line class="rope-texture" x1="201" y1="62" x2="209" y2="65"/>

        <!-- six mistakes: stylized illustrated figure, each part draws itself -->
        <!-- 1: slightly organic head instead of a perfect geometric circle -->
        <path class="stage body-head draw-part" id="s1"
              pathLength="100"
              d="M205 74
                 C216 74 224 81 223 92
                 C223 103 216 110 205 110
                 C194 110 187 103 187 92
                 C187 81 194 74 205 74 Z"/>
        <!-- Game-over eyes: sketched only at 6/6 misses -->
        <g class="dead-eyes" aria-hidden="true">
          <path class="dead-eye eye-left" pathLength="100"
                d="M195.5 86.5 L201 92 M201 86.5 L195.5 92"/>
          <path class="dead-eye eye-right" pathLength="100"
                d="M209 86.5 L214.5 92 M214.5 86.5 L209 92"/>
        </g>

        <!-- 2: subtly tapered/curved torso -->
        <path class="stage body-core draw-part" id="s2"
              pathLength="100"
              d="M205 110 C204 123 204 140 205 156"/>

        <!-- 3–4: arms with a slight natural bend -->
        <path class="stage body-limb draw-part" id="s3"
              pathLength="100"
              d="M204 122 C194 127 185 135 176 144"/>
        <path class="stage body-limb draw-part" id="s4"
              pathLength="100"
              d="M206 122 C216 127 225 135 234 144"/>

        <!-- 5–6: legs with a subtle outward curve -->
        <path class="stage body-limb draw-part" id="s5"
              pathLength="100"
              d="M204 155 C196 166 190 181 183 195"/>
        <path class="stage body-limb draw-part" id="s6"
              pathLength="100"
              d="M206 155 C214 166 220 181 227 195"/>

        <!-- front collar of noose: visible around neck after head appears -->
        <path class="noose-front-under" d="M196 103 C198 111 201 114 205 115 C209 114 212 111 214 103"/>
        <path class="noose-front-main" d="M196 103 C198 111 201 114 205 115 C209 114 212 111 214 103"/>

        <!-- tiny rope texture on front collar -->
        <path class="rope-texture front-texture" d="M199 108 L202 110"/>
        <path class="rope-texture front-texture" d="M208 110 L211 108"/>
      </svg>
    </div>

    <section class="word-zone" id="wordZone" title="Tap here to type a letter">
      <div class="slots" id="slots"></div>
    </section>

    <div class="feedback-zone">
      <div class="misses">
        <div class="misses-label">Misses</div>
        <div class="misses-list" id="missesList">—</div>
      </div>
      <div class="message" id="message"></div>
    </div>

    <div class="solve-panel">
      <div class="solve-ui" id="solveUi">
        <div class="solve-display" id="solveDisplay" role="textbox" aria-label="Full answer">
          <span class="solve-entry">
            <span class="solve-text" id="solveText"></span><span class="solve-caret" aria-hidden="true"></span>
          </span>
        </div>
        <button class="solve-cancel-btn" id="solveCancelBtn" type="button">Cancel</button>
      </div>
    </div>

    <div>
      <div class="controls">
        <button class="btn btn-secondary" id="solveBtn">Solve Word</button>
        <button class="btn btn-primary" id="newWordBtn">New Word</button>
      </div>
      
    </div>

    <div class="custom-keyboard" id="customKeyboard">
      <div class="kb-row">
        <button class="kb-key letter-key" data-key="Q">Q</button><button class="kb-key letter-key" data-key="W">W</button><button class="kb-key letter-key" data-key="E">E</button><button class="kb-key letter-key" data-key="R">R</button><button class="kb-key letter-key" data-key="T">T</button><button class="kb-key letter-key" data-key="Y">Y</button><button class="kb-key letter-key" data-key="U">U</button><button class="kb-key letter-key" data-key="I">I</button><button class="kb-key letter-key" data-key="O">O</button><button class="kb-key letter-key" data-key="P">P</button>
      </div>
      <div class="kb-row kb-middle">
        <button class="kb-key letter-key" data-key="A">A</button><button class="kb-key letter-key" data-key="S">S</button><button class="kb-key letter-key" data-key="D">D</button><button class="kb-key letter-key" data-key="F">F</button><button class="kb-key letter-key" data-key="G">G</button><button class="kb-key letter-key" data-key="H">H</button><button class="kb-key letter-key" data-key="J">J</button><button class="kb-key letter-key" data-key="K">K</button><button class="kb-key letter-key" data-key="L">L</button>
      </div>
      <div class="kb-row">
        <button class="kb-key letter-key" data-key="Z">Z</button><button class="kb-key letter-key" data-key="X">X</button><button class="kb-key letter-key" data-key="C">C</button><button class="kb-key letter-key" data-key="V">V</button><button class="kb-key letter-key" data-key="B">B</button><button class="kb-key letter-key" data-key="N">N</button><button class="kb-key letter-key" data-key="M">M</button><button class="kb-key special-key" data-key="BACKSPACE" aria-label="Backspace">
      <svg class="key-icon backspace-icon" viewBox="0 0 48 32" aria-hidden="true">
        <path d="M18 5H42C44 5 45 6 45 8V24C45 26 44 27 42 27H18L5 16Z"/>
        <path class="icon-detail" d="M24 11L34 21M34 11L24 21"/>
      </svg>
    </button>
      </div>
      <div class="kb-row kb-bottom">
        <button class="kb-key special-key space-key" data-key="SPACE" aria-label="Space"></button>
        <button class="kb-key special-key enter-key" data-key="ENTER" aria-label="Enter">
      <svg class="key-icon enter-icon" viewBox="0 0 48 32" aria-hidden="true">
        <path d="M39 6V15C39 18 37 20 34 20H11"/>
        <path d="M18 13L11 20L18 27"/>
      </svg>
    </button>
      </div>
    </div>

  </main>
</div>

<div class="topics-overlay" id="topicsOverlay" aria-hidden="true"><div class="topics-sheet">
<div class="topics-sheet-head"><div><div class="topics-title">Choose Topics</div><div class="topics-subtitle">Select one or more categories</div></div><button class="topics-close" id="topicsClose" type="button">×</button></div>
<div class="topics-actions-row"><button class="topics-mini-btn" id="selectAllTopics" type="button">All Topics</button><button class="topics-mini-btn" id="clearTopics" type="button">Clear</button></div>
<div class="topics-grid" id="topicsGrid"></div>
<div class="topics-footer"><button class="btn btn-ghost" id="cancelTopics" type="button">Cancel</button><button class="btn btn-primary" id="applyTopics" type="button">Apply</button></div>
</div></div>
</div>`;

function initializeHangmanPokemon(root, app) {
  const TOPICS = POKEMON_TOPICS;
  const slots = root.getElementById("slots");
  const missesList = root.getElementById("missesList");
  const triesText = root.getElementById("triesText");
  const message = root.getElementById("message");
  const solveBtn = root.getElementById("solveBtn");
  const newWordBtn = root.getElementById("newWordBtn");
  const fullscreenBtn = root.getElementById("fullscreenBtn");
  const gameCard = root.getElementById("gameCard");
  const keyboard = root.getElementById("customKeyboard");
  const solveDisplay = root.getElementById("solveDisplay");
  const solveUi = root.getElementById("solveUi");
  const solveText = root.getElementById("solveText");
  const solveCancelBtn = root.getElementById("solveCancelBtn");
  const topicsBtn=root.getElementById("topicsBtn"), topicsCount=root.getElementById("topicsCount"),
    topicsOverlay=root.getElementById("topicsOverlay"), topicsGrid=root.getElementById("topicsGrid"),
    topicsClose=root.getElementById("topicsClose"), selectAllTopics=root.getElementById("selectAllTopics"),
    clearTopics=root.getElementById("clearTopics"), cancelTopics=root.getElementById("cancelTopics"),
    applyTopics=root.getElementById("applyTopics");

  let answer="", guessed=new Set(), misses=[], wrongCount=0;
  let active=false, solveMode=false, solveBuffer="", confirmNewWord=false, confirmTimer=null;
  let selectedTopics=new Set(["Pokemon All Names"]), draftTopics=new Set(["Pokemon All Names"]);

  let backspaceHoldTimer=null;
  let backspaceRepeatTimer=null;
  let backspaceHoldActive=false;
  let backspaceConsumedClick=false;
  const KEY_HAPTIC_MS = 6;
  const ENTER_HAPTIC_MS = 8;
  const KEY_POPUP_MS = 105;

  function vibrate(p){ if("vibrate" in navigator) navigator.vibrate(p); }

  function showKeyPopup(key, value){
    if(!/^[A-Z]$/.test(value)) return;

    key.querySelector(".key-popup")?.remove();

    const popup=document.createElement("span");
    popup.className="key-popup";
    popup.textContent=value;
    key.appendChild(popup);

    setTimeout(()=>{
      popup.classList.add("hide");
      setTimeout(()=>popup.remove(),80);
    },KEY_POPUP_MS);
  }
  function flashWrong(){
    gameCard.classList.remove("wrong-flash","solve-active"); void gameCard.offsetWidth;
    gameCard.classList.add("wrong-flash");
    setTimeout(()=>gameCard.classList.remove("wrong-flash"),320);
  }
  function pulseCorrect(letter){
    const hits=[...slots.querySelectorAll(`.letter-slot[data-letter="${letter}"]`)];
    hits.forEach(el=>{el.classList.remove("correct-hit");void el.offsetWidth;el.classList.add("correct-hit");});
    setTimeout(()=>hits.forEach(el=>el.classList.remove("correct-hit")),360);
  }
  function getActivePool(){
    return POKEMON_WORDS.filter(entry =>
      entry.topics.some(topic => selectedTopics.has(topic))
    );
  }

  function pickWord(){
    const pool=getActivePool();
    if(!pool.length) return "";

    let index=Math.floor(Math.random()*pool.length);
    let next=pool[index].word.toUpperCase();

    if(pool.length>1 && next===answer){
      index=(index+1)%pool.length;
      next=pool[index].word.toUpperCase();
    }
    return next;
  }

  function renderTopicChoices(){
    topicsGrid.innerHTML="";

    TOPICS.forEach(topic=>{
      const button=document.createElement("button");
      button.type="button";
      button.className="topic-chip";
      button.textContent=topic;
      button.classList.toggle("selected",draftTopics.has(topic));
      button.addEventListener("click",()=>{
        if(draftTopics.has(topic)) draftTopics.delete(topic);
        else draftTopics.add(topic);
        renderTopicChoices();
      });
      topicsGrid.appendChild(button);
    });
  }

  function updateTopicsLabel(){
    if(selectedTopics.size===TOPICS.length) topicsCount.textContent="All";
    else topicsCount.textContent=selectedTopics.size;
  }

  function openTopics(){
    draftTopics=new Set(selectedTopics);
    renderTopicChoices();
    topicsOverlay.classList.add("open");
    topicsOverlay.setAttribute("aria-hidden","false");
  }

  function closeTopics(){
    topicsOverlay.classList.remove("open");
    topicsOverlay.setAttribute("aria-hidden","true");
  }

  function applyTopicSelection(){
    if(!draftTopics.size) return;
    selectedTopics=new Set(draftTopics);
    updateTopicsLabel();
    closeTopics();
    startRound();
  }

  function resetKeys(){
    keyboard.querySelectorAll(".letter-key").forEach(key=>{
      key.classList.remove("used","guessed-correct","guessed-wrong","key-pressed");
      key.querySelector(".key-popup")?.remove();
    });
  }

  function startRound(){
    answer=pickWord(); guessed=new Set(); misses=[]; wrongCount=0; active=true;
    root.querySelectorAll(".draw-part").forEach(part=>part.classList.remove("drawn"));
    solveMode=false; solveBuffer=""; confirmNewWord=false; clearTimeout(confirmTimer);
    slots.classList.remove("win","loss"); gameCard.classList.remove("wrong-flash");
    triesText.classList.remove("warning");
    newWordBtn.textContent="New Word"; newWordBtn.className="btn btn-primary"; newWordBtn.style.display=""; newWordBtn.hidden=false;
    solveBtn.style.display=""; solveUi.classList.remove("open"); solveText.textContent="";
    keyboard.classList.remove("solve-mode"); message.className="message"; message.textContent="";
    resetKeys(); render();
  }

  function normalizePlayableChar(ch){
    const base=(ch||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase();
    return /^[A-Z]$/.test(base) ? base : "";
  }

  function normalizePlayableAnswer(str){
    return [...str].map(ch=>{
      const normalized=normalizePlayableChar(ch);
      return normalized || ch;
    }).join("");
  }

  function uniqueLetters(s){
    return [...new Set([...s].map(normalizePlayableChar).filter(Boolean))];
  }
  function render(){
    slots.innerHTML="";
    for(const ch of answer){
      const el=document.createElement("span");
      if(ch===" ") el.className="space-slot";
      else if(normalizePlayableChar(ch)){
        const playable=normalizePlayableChar(ch);
        el.className="letter-slot";
        el.dataset.letter=playable;
        el.textContent=guessed.has(playable)?ch:"";
      }
      else {el.className="punct";el.textContent=ch;}
      slots.appendChild(el);
    }
    missesList.textContent=misses.length?misses.join(" · "):"";
    triesText.textContent=`${wrongCount} / 6 misses`;
    triesText.classList.toggle("warning",wrongCount>=4);
    for(let i=1;i<=6;i++) root.getElementById("s"+i)?.classList.toggle("show",i<=wrongCount);
    root.querySelector(".hangman")?.classList.toggle("head-revealed", wrongCount >= 1);
    root.querySelector(".hangman")?.classList.toggle("game-over", wrongCount >= 6);
  }
  root.querySelectorAll(".draw-part").forEach(part=>{
    part.addEventListener("animationend",()=>{
      if(part.classList.contains("show")) part.classList.add("drawn");
    });
  });

  function solved(){ return uniqueLetters(answer).every(l=>guessed.has(l)); }
  function finishWin(){
    uniqueLetters(answer).forEach(l=>guessed.add(l)); active=false; solveMode=false;
    solveBtn.style.display="none"; solveUi.classList.remove("open"); keyboard.classList.remove("solve-mode"); gameCard.classList.remove("solve-active");
    newWordBtn.hidden=false;
    message.className="message success"; message.textContent="Correct."; slots.classList.add("win");
    vibrate([45,35,70]); render();
  }
  function finishLoss(){
    uniqueLetters(answer).forEach(l=>guessed.add(l)); active=false; solveMode=false;
    solveBtn.style.display="none"; solveUi.classList.remove("open"); keyboard.classList.remove("solve-mode"); gameCard.classList.remove("solve-active");
    newWordBtn.hidden=false;
    message.className="message danger"; message.textContent=`The answer was ${answer}.`;
    slots.classList.add("loss"); vibrate([120,60,120]); flashWrong(); render();
  }
  function wrongGuess(text){
    wrongCount++; vibrate(90); flashWrong(); render();
    if(wrongCount>=6) finishLoss(); else {message.className="message";message.textContent=text;}
  }
  function guessLetter(letter){
    if(!active||solveMode||guessed.has(letter)||misses.includes(letter)) return;
    const key=keyboard.querySelector(`[data-key="${letter}"]`);
    if(normalizePlayableAnswer(answer).includes(letter)){
      guessed.add(letter); key?.classList.add("guessed-correct","used"); render(); pulseCorrect(letter);
      if(solved()) finishWin();
    } else {
      misses.push(letter); key?.classList.add("guessed-wrong","used"); wrongGuess(`${letter} is not in the word.`);
    }
  }
  function updateSolve(){
    solveText.textContent=solveBuffer;
  }

  function enterSolve(){
    if(!active) return;
    solveMode=true;
    solveBuffer="";
    keyboard.classList.add("solve-mode");
    solveUi.classList.add("open");
    solveBtn.style.display="none";
    newWordBtn.hidden=true;
    message.textContent="";
    updateSolve();
  }

  function leaveSolve(){
    stopBackspaceHold();
    solveMode=false;
    solveBuffer="";
    keyboard.classList.remove("solve-mode");
    solveUi.classList.remove("open");
    solveBtn.style.display="";
    newWordBtn.hidden=false;
    message.textContent="";
  }

  function submitSolve(){
    const attempt=solveBuffer.trim().replace(/\s+/g," ").toUpperCase();
    if(!attempt) return;
    if(attempt===normalizePlayableAnswer(answer)) finishWin(); else { leaveSolve(); wrongGuess("Wrong solution. One miss added."); }
  }


  function deleteOneSolveChar(){
    if(!solveMode || !solveBuffer) return;
    solveBuffer=solveBuffer.slice(0,-1);
    updateSolve();
  }

  function stopBackspaceHold(){
    clearTimeout(backspaceHoldTimer);
    clearInterval(backspaceRepeatTimer);
    backspaceHoldTimer=null;
    backspaceRepeatTimer=null;
    backspaceHoldActive=false;
  }

  const backspaceKey=keyboard.querySelector('[data-key="BACKSPACE"]');

  backspaceKey?.addEventListener("pointerdown",e=>{
    if(!active || !solveMode) return;

    e.preventDefault();
    backspaceConsumedClick=false;
    backspaceHoldActive=true;

    /* Smartphone-like behavior: one immediate deletion, then repeat after a pause. */
    vibrate(KEY_HAPTIC_MS);
    deleteOneSolveChar();

    backspaceHoldTimer=setTimeout(()=>{
      if(!backspaceHoldActive) return;
      backspaceConsumedClick=true;

      backspaceRepeatTimer=setInterval(()=>{
        if(!backspaceHoldActive || !solveMode || !solveBuffer){
          stopBackspaceHold();
          return;
        }
        deleteOneSolveChar();
      },70);
    },360);
  });

  ["pointerup","pointercancel","pointerleave"].forEach(type=>{
    backspaceKey?.addEventListener(type,()=>{
      stopBackspaceHold();
    });
  });

  keyboard.addEventListener("click",e=>{
    const key=e.target.closest(".kb-key");
    if(!key||!active) return;

    const v=key.dataset.key;

    /* Short, crisp haptic pulse closer to a phone keyboard tap. */
    vibrate(v==="ENTER" ? ENTER_HAPTIC_MS : KEY_HAPTIC_MS);

    key.classList.remove("key-pressed");
    void key.offsetWidth;
    key.classList.add("key-pressed");
    setTimeout(()=>key.classList.remove("key-pressed"),82);

    showKeyPopup(key,v);

    if(!solveMode){
      if(/^[A-Z]$/.test(v)) guessLetter(v);
      /* Backspace, Space and Enter intentionally do nothing here. */
      return;
    }

    if(/^[A-Z]$/.test(v)) solveBuffer+=v;
    else if(v==="SPACE" && solveBuffer && !solveBuffer.endsWith(" ")) solveBuffer+=" ";
    else if(v==="BACKSPACE"){
      if(backspaceConsumedClick){
        backspaceConsumedClick=false;
        return;
      }
      /* Fallback for browsers that dispatch click without pointerdown. */
      deleteOneSolveChar();
      return;
    }
    else if(v==="ENTER"){
      submitSolve();
      return;
    }

    updateSolve();
  });

  solveBtn.addEventListener("click",enterSolve);
  solveCancelBtn.addEventListener("click",leaveSolve);
  newWordBtn.addEventListener("click",()=>{
    if(!active){ startRound(); return; }
    if(!confirmNewWord){
      confirmNewWord=true; newWordBtn.textContent="New Word?"; newWordBtn.className="btn btn-danger";
      clearTimeout(confirmTimer);
      confirmTimer=setTimeout(()=>{confirmNewWord=false;newWordBtn.textContent="New Word";newWordBtn.className="btn btn-primary";},2200);
      return;
    }
    startRound();
  });

  topicsBtn.addEventListener("click",openTopics);
  topicsClose.addEventListener("click",closeTopics);
  cancelTopics.addEventListener("click",closeTopics);
  selectAllTopics.addEventListener("click",()=>{
    draftTopics=new Set(TOPICS);
    renderTopicChoices();
  });
  clearTopics.addEventListener("click",()=>{
    draftTopics.clear();
    renderTopicChoices();
  });
  applyTopics.addEventListener("click",applyTopicSelection);
  topicsOverlay.addEventListener("click",event=>{
    if(event.target===topicsOverlay) closeTopics();
  });
  bindOutsideDismiss(root, topicsOverlay, () => {
    if (topicsOverlay.classList.contains("open")) closeTopics();
  });

  bindFullscreenButton({ button: fullscreenBtn, app });

  root.getElementById("homeButton").addEventListener("click", () => {
    app.haptic(12);
    closeTopics();
    app.showHome();
  });

  updateTopicsLabel();
  startRound();
}

class QuizHangmanPokemon extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({ mode: "open" });
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/hangman-pokemon.css";
    const wrapper = document.createElement("div");
    wrapper.innerHTML = templateHTML;
    root.append(link, wrapper);
    initializeHangmanPokemon(root, appAPI);
  }
}

export function registerHangmanPokemon(app) {
  appAPI = app;
  if (!customElements.get("quiz-hangman-pokemon")) {
    customElements.define("quiz-hangman-pokemon", QuizHangmanPokemon);
  }
}
