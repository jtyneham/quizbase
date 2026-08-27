import { GAME_DATABASE, RANDOM_POOL } from "../../data/hangman-words.js";
import { bindFullscreenButton } from "../core/ui.js";
import { bindOutsideDismiss } from "../core/ui.js";

let appAPI;

const templateHTML = `<div class="hangman-root">
<div class="app">
  <main class="game-card" id="gameCard">
    <div class="status-row">
      <div class="status-actions"><button class="home-button" id="homeButton" type="button" aria-label="Back to Home" title="Home">Home</button><button class="fullscreen-btn" id="fullscreenBtn" type="button" aria-label="Toggle fullscreen" title="Fullscreen">⛶</button></div>
<button class="topics-btn" id="topicsBtn" type="button">Topics <span id="topicsCount">All</span></button>
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
<div class="topics-sheet-head"><div><div class="topics-title">Choose Topics</div><div class="topics-subtitle">Select one or more categories</div></div><button class="topics-close" id="topicsClose">×</button></div>
<div class="topics-actions-row"><button class="topics-mini-btn" id="selectAllTopics">All Topics</button><button class="topics-mini-btn" id="clearTopics">Clear</button></div>
<div class="topics-grid" id="topicsGrid"></div>
<div class="topics-footer"><button class="btn btn-ghost" id="cancelTopics">Cancel</button><button class="btn btn-primary" id="applyTopics">Apply</button></div>
</div></div>
</div>`;

function initializeHangman(root, app) {
  const TOPICS = [...new Set(GAME_DATABASE.map(e=>e.category))];
  const RANDOM_POOL = ["JOGGING","COLORING","PICNICKING","ANTIQUING","CARD GAMES","BAKING","CARPENTRY","ACTING","GENEALOGY","SONG WRITING","SIGHTSEEING","SINGING","TASTING","CALLIGRAPHY","DRAWING","WRITING","MARTIAL ARTS","BIRDWATCHING","KITE FLYING","GEOCACHING","BLOGGING","ROCK CLIMBING","CANDLE MAKING","HUNTING","PROGRAMMING","WOOD CARVING","POTTERY","SNORKELING","BLACK MAMBA","MANTA RAY","OSTRICH","ORCA","CORAL","TIGER","MITE","SPERM WHALE","BEAR","FRUIT FLY","SKINK","ALBATROSS","MOSASAURUS","JACKAL","HAWK","BLACK WIDOW","CONDOR","HEDGEHOG","ANTEATER","COBRA","ARMADILLO","NIGHTINGALE","NAUTILUS","PUFFIN","PUFFERFISH","SEAGULL","ARCHAEOPTERYX","GORILLA","FRIENDSHIP","CUISINE","PHILOSOPHY","UNIVERSITY","PRESIDENT","IMAM","CARNIVAL","EQUALITY","CHRISTIANITY","PUBLISHING","VOLUNTEERING","CHARITY","TRANSPORT","TEMPLE","CITIZENSHIP","GOVERNMENT","GENERATION","BIRTHDAY","HOLIDAY","ACCENT","JUSTICE","CENSUS","CAMPAIGN","TREATY","POLITICS","SOCIETY","MINISTER","BUSINESS","TOMATO SOUP","CORNBREAD","COOKIE","EGGPLANT","BISCUIT","CHOCOLATE","CILANTRO","PAELLA","PANCAKE","UDON","CAESAR SALAD","POMEGRANATE","ICED TEA","PASSION FRUIT","RADISH","NOODLE SOUP","PAPRIKA","PANNA COTTA","BIRTHDAY CAKE","DOUGHNUT","WAFFLE","FLATBREAD","CORN FLAKES","SAGE","SAUSAGE","BLUEBERRY","CINNAMON","AVOCADO","BETWEEN","ACCEPT","ENCOURAGE","MAGICAL","DIRECTION","POWERFUL","DETAIL","NEVER","NEAT","DEEP","REPEAT","DISCUSS","PERHAPS","CLEAN","LEAVE","SURPRISE","HOPEFUL","STRENGTH","CONFIDENT","SHORT","CONTACT","VISIT","HELPFUL","SICK","HARM","FORGIVE","SOMETIMES","HABIT","GHANA","BOLIVIA","SPAIN","MOUNTAINS","MADRID","ISTANBUL","RIVER","RED SEA","GULF","KILIMANJARO","MOJAVE","SUPERIOR","GREENLAND","SAUDI ARABIA","VOLCANO","ISRAEL","SYDNEY","MISSISSIPPI","LIBYA","TUNISIA","NEW YORK","SHANGHAI","WARSAW","NETHERLANDS","DUBLIN","ASIA","MEXICO CITY","DUNE","HASTINGS","MAGNA CARTA","KNIGHT","HENRY VIII","ALEXANDER","MACHU PICCHU","WORLD WAR ONE","PLATO","WILD WEST","CHARLEMAGNE","RACE","TELEGRAPH","PACT","ANCIENT","CLEOPATRA","VIKING","COMPASS","SILK ROAD","BATTLE","ROMAN EMPIRE","MICHELANGELO","MONGOL EMPIRE","PEARL HARBOR","CONQUISTADOR","MONARCHY","STEAM","RAMSES","MARCO POLO","PAINT BRUSH","TOOL BOX","CHAIR","HAMMER","MIXING BOWL","PILLOW","MICROWAVE","LOCK","PHONE","PENCIL","CARPET","PHONE CHARGER","BASKET","BROOM","BAKING TRAY","PICTURE","SINK","TRASH BAG","SLOW COOKER","FORK","PURSE","LIGHT SWITCH","SAUCE PAN","STOVE","TUMBLE DRYER","SUNGLASSES","ROCKING CHAIR","COFFEE TABLE","SWEAT","SKIN","UPPER ARM","HEART","VEIN","TASTE","BALANCE","APPENDIX","NEURON","LYMPH","RETINA","PALM","SPINE","TENDON","TONGUE","INTESTINE","HAIR","SKELETAL","DIGESTIVE","JOINT","LITTLE FINGER","SPINAL COLUMN","HEAD","TEETH","FINGERPRINT","BREATHING","MOUTH","INDEX FINGER","BUTCHER","BAKER","SURGEON","CARPENTER","DEVELOPER","PHARMACIST","PSYCHOLOGIST","BANKER","DIRECTOR","MUSICIAN","WORKER","ENGINEER","CARDIOLOGIST","SALESPERSON","CONDUCTOR","PHOTOGRAPHER","MANAGER","PROSECUTOR","LAWYER","COACH","ZOOKEEPER","BRICKLAYER","WAITER","ROOFER","ATTENDANT","DANCER","BARTENDER","ORTHODONTIST","RAMBO","SHERLOCK","SPIRITED AWAY","THE REVENANT","BLACK PANTHER","COCO","ENCANTO","COWBOY BEBOP","MODERN FAMILY","CLUELESS","NARCOS","ALADDIN","THE BATMAN","MONEY HEIST","POINT BREAK","SCARFACE","SEINFELD","MIAMI VICE","BRAVEHEART","TERMINATOR 2","ONE PUNCH MAN","INCEPTION","FARGO","DESPICABLE ME","GREASE","DOCTOR WHO","SOUTH PARK","ARCANE","ERHU","ACCORDION","VIOLIN","ZITHER","HARMONICA","PIANO","DOUBLE BASS","RECORDER","SNARE","BASSOON","SYNTHESIZER","GONG","CLAVES","BONGOS","LUTE","SHAMISEN","DIDGERIDOO","HURDY GURDY","STEEL DRUM","TAMBOURINE","XYLOPHONE","TROMBONE","WOODBLOCK","DJEMBE","VIBRAPHONE","PICCOLO","MELODICA","CHIMES","DOMOVOI","CHIMERA","DIONYSUS","CAMELOT","ODYSSEUS","KRAKEN","ORACLE","PERSEPHONE","TENGU","POLTERGEIST","SHIVA","SERPENT","FENRIR","CERNUNNOS","HYDRA","SUSANOO","JORMUNGANDR","IZANAGI","MOTHMAN","HEPHAESTUS","PHOENIX","SKINWALKER","BRIGID","HANUMAN","GRIFFIN","MANTICORE","GRAIL","ANUBIS","WIND","RAINBOW","TIDE","HAIL","BOULDER","MOSS","GEYSER","AURORA","LOTUS","SAND","ICEBERG","WOODLAND","CRYSTAL","ECLIPSE","WILDFIRE","GORGE","WETLAND","DROUGHT","COAST","BREEZE","MARBLE","HILL","TORNADO","BLOSSOM","SHORE","THUNDERSTORM","AVALANCHE","CREEK","BACTERIA","CALCULUS","MAGMA","LASER","DIAMETER","JOULE","GEOMETRY","CHEMISTRY","VOLT","PROBABILITY","GOLD","WATT","ELEMENT","NUCLEUS","MAGNETISM","COMPOUND","TECTONICS","CARBON","GRAVITY","VOLTAGE","CIRCUIT","CIRCLE","PRESSURE","ACID","SECOND","SODIUM","DATA","THEORY","DIAMONDS","STAND BY ME","START ME UP","LAST NITE","JUST DANCE","SEPTEMBER","IMAGINE","DILEMMA","HERE I GO AGAIN","ROAR","VOGUE","ROYALS","DO I WANNA KNOW","LET IT BE","PARANOID","THE GAMBLER","YOUR SONG","DANCING QUEEN","WAKE ME UP","TINY DANCER","SOMEBODY ELSE","CRAZY TRAIN","STAYIN' ALIVE","IN DA CLUB","HEAVEN","BLEEDING LOVE","UNWRITTEN","THE SCIENTIST","URANUS","VOYAGER","RIGEL","COSMONAUT","QUASAR","SOLAR SYSTEM","INGENUITY","SATELLITE","ASTRONAUT","LIGHT YEAR","METEOR","PERSEVERANCE","OORT CLOUD","GALAXY","SPACE STATION","NEW HORIZONS","VENUS","SOLAR FLARE","CASSINI","COSMOS","CURIOSITY","LAUNCH PAD","RELATIVITY","BLACK HOLE","SUPERNOVA","PLANET","EVENT HORIZON","APOLLO","JUDO","PENTATHLON","LONG JUMP","VOLLEYBALL","WORLD RECORD","CATCHER","DIVING","DISCUS","MATCH POINT","DEFENDER","MOTORSPORT","CURLING","FREE THROW","CANOEING","FINISH LINE","BASEBALL","ROAD CYCLING","SHOT","BILLIARDS","BOULDERING","BIKING","GOLF","YELLOW CARD","GREEN JACKET","SKI JUMPING","SERVE","HOME PLATE","FORMULA ONE","SOCIAL MEDIA","MESSAGE","CHARGER","TABLET","SERVER","UPLOAD","DATABASE","LINUX","WEB PAGE","KEYBOARD","MODEM","BARCODE","SMARTWATCH","PORT","FLASH DRIVE","MOTHERBOARD","SMART WATCH","ETHERNET","HYPERLINK","HOME PAGE","CONSOLE","SETTINGS","PROGRAM","DOWNLOAD","MOUSE","NETWORK CABLE","COMPUTER","DOMAIN","CRIBBAGE","PICK UP STICKS","GAME OF GOOSE","MONOPOLY","GUESS WHO","LEAPFROG","STRATEGO","RUMMY","HIDE AND SEEK","SOLITAIRE","TICKET TO RIDE","FOX AND GEESE","PARCHEESI","TEXAS HOLD'EM","BRIDGE","PICTIONARY","AIR HOCKEY","REVERSI","CANASTA","OTHELLO","FIVE CARD DRAW","SPINNING TOP","BLACKJACK","SUDOKU","PANDEMIC","BATTLESHIP","BOCCE","EUCHRE","MOUNTAIN BIKE","TRACTOR","SPEED BOAT","BULLET TRAIN","ELEVATOR","CABIN","TOUR BUS","TRUCK","ELECTRIC BOAT","SLEIGH","LIMOUSINE","BRAKE","SUBWAY TRAIN","SAILING BOAT","PLATFORM","SAIL","PEDAL","LIFEBOAT","CONVERTIBLE","PICKUP TRUCK","MAST","AMBULANCE","YACHT","TAXI RANK","FISHING BOAT","RUNWAY","CANOE","WAGON","DESTINY 2","UNCHARTED 2","GUILTY GEAR","MARIO KART","THE WITCHER","FALLOUT 2","CYBERPUNK 2077","BAYONETTA","DEATHLOOP","DISCO ELYSIUM","ROBLOX","SOULCALIBUR"];
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
  const topicsBtn=root.getElementById("topicsBtn"),topicsCount=root.getElementById("topicsCount"),topicsOverlay=root.getElementById("topicsOverlay"),topicsGrid=root.getElementById("topicsGrid"),topicsClose=root.getElementById("topicsClose"),selectAllTopics=root.getElementById("selectAllTopics"),clearTopics=root.getElementById("clearTopics"),cancelTopics=root.getElementById("cancelTopics"),applyTopics=root.getElementById("applyTopics");

  let answer="", guessed=new Set(), misses=[], wrongCount=0;
  let active=false, solveMode=false, solveBuffer="", confirmNewWord=false, confirmTimer=null;
  let selectedTopics=new Set(),draftTopics=new Set(), randomMode=true, draftRandomMode=true;

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
    if(randomMode){
      const allowed=new Set(RANDOM_POOL);
      return GAME_DATABASE.filter(e=>allowed.has(e.answer));
    }
    return GAME_DATABASE.filter(e=>selectedTopics.has(e.category));
  }
  function pickWord(){
    const p=getActivePool();
    if(!p.length) return "";
    let n=p[Math.floor(Math.random()*p.length)].answer;
    if(p.length>1&&n===answer){
      let i=p.findIndex(e=>e.answer===n);
      n=p[(i+1)%p.length].answer;
    }
    return n;
  }
  function resetKeys(){
    keyboard.querySelectorAll(".letter-key").forEach(k=>k.classList.remove("used","guessed-correct","guessed-wrong"));
  }
  function renderTopicChoices(){
    topicsGrid.innerHTML="";

    const randomButton=document.createElement("button");
    randomButton.type="button";
    randomButton.className="topic-chip random-topic";
    randomButton.textContent="Random";
    randomButton.classList.toggle("selected",draftRandomMode);
    randomButton.addEventListener("click",()=>{
      draftRandomMode=true;
      draftTopics.clear();
      renderTopicChoices();
    });
    topicsGrid.appendChild(randomButton);

    TOPICS.forEach(topic=>{
      const b=document.createElement("button");
      b.type="button";
      b.className="topic-chip";
      b.textContent=topic;
      b.classList.toggle("selected",!draftRandomMode && draftTopics.has(topic));
      b.addEventListener("click",()=>{
        draftRandomMode=false;
        if(draftTopics.has(topic)) draftTopics.delete(topic);
        else draftTopics.add(topic);
        renderTopicChoices();
      });
      topicsGrid.appendChild(b);
    });
  }

  function updateTopicsLabel(){
    if(randomMode) topicsCount.textContent="Random";
    else if(selectedTopics.size===TOPICS.length) topicsCount.textContent="All";
    else topicsCount.textContent=selectedTopics.size;
  }

  function openTopics(){
    draftTopics=new Set(selectedTopics);
    draftRandomMode=randomMode;
    renderTopicChoices();
    topicsOverlay.classList.add("open");
    topicsOverlay.setAttribute("aria-hidden","false");
  }

  function closeTopics(){
    topicsOverlay.classList.remove("open");
    topicsOverlay.setAttribute("aria-hidden","true");
  }

  function applyTopicSelection(){
    randomMode=draftRandomMode;
    selectedTopics=new Set(draftTopics);
    updateTopicsLabel();
    closeTopics();
    if(randomMode || selectedTopics.size) startRound();
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
  function uniqueLetters(s){ return [...new Set(s.replace(/[^A-Z]/g,""))]; }
  function render(){
    slots.innerHTML="";
    for(const ch of answer){
      const el=document.createElement("span");
      if(ch===" ") el.className="space-slot";
      else if(/[A-Z]/.test(ch)){el.className="letter-slot";el.dataset.letter=ch;el.textContent=guessed.has(ch)?ch:"";}
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
    if(answer.includes(letter)){
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
    if(attempt===answer) finishWin(); else { leaveSolve(); wrongGuess("Wrong solution. One miss added."); }
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
  topicsBtn.addEventListener("click",openTopics);topicsClose.addEventListener("click",closeTopics);cancelTopics.addEventListener("click",closeTopics);
  selectAllTopics.addEventListener("click",()=>{draftRandomMode=false;draftTopics=new Set(TOPICS);renderTopicChoices();});
  clearTopics.addEventListener("click",()=>{draftRandomMode=false;draftTopics.clear();renderTopicChoices();});
  applyTopics.addEventListener("click",applyTopicSelection);
  topicsOverlay.addEventListener("click",e=>{if(e.target===topicsOverlay)closeTopics();});
  bindOutsideDismiss(root, topicsOverlay, () => {
    if (topicsOverlay.classList.contains("open")) closeTopics();
  }, topicsBtn);


  bindFullscreenButton({ button: fullscreenBtn, app });

  root.getElementById("homeButton").addEventListener("click", () => {
    app.haptic(12);
    closeTopics();
    app.showHome();
  });

  updateTopicsLabel();
  startRound();
}

class QuizHangman extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({ mode: "open" });
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "css/hangman.css";
    const wrapper = document.createElement("div");
    wrapper.innerHTML = templateHTML;
    root.append(link, wrapper);
    initializeHangman(root, appAPI);
  }
}

export function registerHangman(app) {
  appAPI = app;
  if (!customElements.get("quiz-hangman")) {
    customElements.define("quiz-hangman", QuizHangman);
  }
}
