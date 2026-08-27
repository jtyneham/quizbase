import { initRandomLetter } from "./games/rngl.js";
import { createFullscreenService, haptic } from "./core/device.js";

const screens={
  home:document.getElementById("homeScreen"),
  rngl:document.getElementById("rnglScreen"),
  missingword:document.getElementById("missingWordScreen"),
  missingwordpokemon:document.getElementById("missingWordPokemonScreen"),
  hangman:document.getElementById("hangmanScreen"),
  hangmanpokemon:document.getElementById("hangmanPokemonScreen")
};
const fullscreenService=createFullscreenService();
let current="home";
let missingWordLoaded=false;
let missingWordPokemonLoaded=false;
let hangmanLoaded=false;
let hangmanPokemonLoaded=false;

const api={
  haptic,isFullscreen:fullscreenService.isFullscreen,toggleFullscreen:fullscreenService.toggle,
  onFullscreenChange(fn){return fullscreenService.onChange(fn)},
  showHome(){showScreen("home")},
  isScreenActive(name){return current===name}
};

function showScreen(name){
  Object.values(screens).forEach(screen=>screen.classList.remove("active"));
  screens[name].classList.add("active");
  current=name;
  history.replaceState(null,"",name==="home"?location.pathname:`#${name}`);
}

async function openTile(tile){
  const file=tile.dataset.file;
  haptic(18);

  if(file==="rngl.html"){
    initRandomLetter(screens.rngl,api);
    showScreen("rngl");
    return;
  }

  if(file==="missingword.html"){
    if(!missingWordLoaded){
      const module=await import("./games/missing-word.js");
      module.registerMissingWord(api);
      missingWordLoaded=true;
    }
    showScreen("missingword");
    return;
  }

  if(file==="missingwordpokemon.html"){
    if(!missingWordPokemonLoaded){
      const module=await import("./games/missing-word-pokemon.js");
      module.registerMissingWordPokemon(api);
      missingWordPokemonLoaded=true;
    }
    showScreen("missingwordpokemon");
    return;
  }

  if(file==="hangman1.html"){
    if(!hangmanLoaded){
      const module=await import("./games/hangman.js");
      module.registerHangman(api);
      hangmanLoaded=true;
    }
    showScreen("hangman");
    return;
  }


  if(file==="hangmanpokemon.html"){
    if(!hangmanPokemonLoaded){
      const module=await import("./games/hangman-pokemon.js");
      module.registerHangmanPokemon(api);
      hangmanPokemonLoaded=true;
    }
    showScreen("hangmanpokemon");
    return;
  }
}

document.querySelectorAll(".app-tile").forEach(tile=>{
  tile.addEventListener("pointerdown",()=>tile.classList.add("pressed"));
  ["pointerup","pointercancel","pointerleave"].forEach(evt=>tile.addEventListener(evt,()=>tile.classList.remove("pressed")));
  tile.addEventListener("click",()=>openTile(tile));
});


window.addEventListener("popstate",()=>showScreen("home"));
