/**
 * Number Play's mode registry is the single source for the launch chooser and
 * the persistent in-game mode picker. A mode may be registered before its
 * game logic ships, but unavailable modes remain visibly disabled rather than
 * pretending to launch a game that does not exist yet.
 */
export const NUMBER_PLAY_MODES = [
  {
    id: "target-pair",
    name: "Target Pair",
    description: "Tap two numbers that make the target.",
    available: true
  },
  {
    id: "number-machine",
    name: "Number Machine",
    description: "Follow the operations and choose the output.",
    available: false
  },
  {
    id: "number-gap",
    name: "Number Gap",
    description: "Find the largest or smallest difference.",
    available: false
  },
  {
    id: "number-detective",
    name: "Odd Number Out",
    description: "Find the number that breaks the rule.",
    available: true
  }
];

export const NUMBER_PLAY_MODE_BY_ID = new Map(NUMBER_PLAY_MODES.map((mode) => [mode.id, mode]));
