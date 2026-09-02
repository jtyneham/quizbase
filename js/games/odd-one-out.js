import { initOddOneOut } from "../core/odd-one-out-engine.js";

const EDITIONS = [
  { id: "general", name: "Odd One Out", icon: "assets/odd-one-out.svg", screenId: "oddoneout" },
  { id: "pokemon", name: "Odd One Out Pokemon", icon: "assets/odd-one-out-pokemon.svg", screenId: "oddoneoutpokemon" }
];

// Thin wrapper: a reskin can replace the visual treatment without changing
// routing or the reviewed General Knowledge relationship pool.
export function initGeneralOddOneOut(root, app) {
  initOddOneOut(root, app, {
    editions: EDITIONS,
    editionId: "general",
    editionPickerPrefix: "oddOneOut"
  });
}
