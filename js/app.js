import { initRandomLetter } from "./games/rngl.js";

const screens={
  home:document.getElementById("homeScreen"),
  rngl:document.getElementById("rnglScreen"),
  missingword:document.getElementById("missingWordScreen"),
  missingwordpokemon:document.getElementById("missingWordPokemonScreen"),
  hangman:document.getElementById("hangmanScreen"),
  placeholder:document.getElementById("placeholderScreen")
};
const fullscreenCallbacks=new Set();
let current="home";
let missingWordLoaded=false;
let missingWordPokemonLoaded=false;
let hangmanLoaded=false;

function haptic(ms=14){if("vibrate" in navigator)navigator.vibrate(ms)}
function isFullscreen(){return Boolean(document.fullscreenElement||document.webkitFullscreenElement)}
async function toggleFullscreen(){
  try{
    if(isFullscreen()){
      if(document.exitFullscreen)await document.exitFullscreen();
      else if(document.webkitExitFullscreen)document.webkitExitFullscreen();
    }else{
      const root=document.documentElement;
      if(root.requestFullscreen)await root.requestFullscreen({navigationUI:"hide"});
      else if(root.webkitRequestFullscreen)root.webkitRequestFullscreen();
    }
  }catch(err){console.warn(err)}
}
function notifyFullscreen(){fullscreenCallbacks.forEach(fn=>fn())}
document.addEventListener("fullscreenchange",notifyFullscreen);
document.addEventListener("webkitfullscreenchange",notifyFullscreen);

const api={
  haptic,isFullscreen,toggleFullscreen,
  onFullscreenChange(fn){fullscreenCallbacks.add(fn);return()=>fullscreenCallbacks.delete(fn)},
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
  const name=tile.dataset.name||"Game";
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

  document.getElementById("placeholderTitle").textContent=name;
  showScreen("placeholder");
}

document.querySelectorAll(".app-tile").forEach(tile=>{
  tile.addEventListener("pointerdown",()=>tile.classList.add("pressed"));
  ["pointerup","pointercancel","pointerleave"].forEach(evt=>tile.addEventListener(evt,()=>tile.classList.remove("pressed")));
  tile.addEventListener("click",()=>openTile(tile));
});

document.getElementById("placeholderHomeButton").addEventListener("click",()=>{
  haptic(12);showScreen("home");
});

window.addEventListener("popstate",()=>showScreen("home"));
