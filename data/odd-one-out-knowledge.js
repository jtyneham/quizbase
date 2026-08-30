/**
 * General-knowledge relationship blueprints for Odd One Out.
 *
 * A blueprint is deliberately more structured than a word list: the engine
 * picks three matching terms plus one reviewed near-miss. The relationship is
 * revealed only after a player taps, keeping a round quick but satisfying.
 *
 * Do not add fandom-specific or specialist material here. Difficulty comes
 * from the distinction between related concepts, not niche knowledge.
 */
export const ODD_ONE_OUT_FAMILY_TARGETS = {
  animals: { medium: 5, hard: 3 },
  "arts-and-culture": { medium: 4, hard: 3 },
  geography: { medium: 5, hard: 3 },
  "brands-and-business": { medium: 4, hard: 2 },
  "science-and-space": { medium: 5, hard: 3 },
  "human-body-and-health": { medium: 3, hard: 2 },
  "time-language-and-symbols": { medium: 3, hard: 2 },
  "energy-environment-and-nature": { medium: 3, hard: 2 },
  "everyday-life": { medium: 4, hard: 3 },
  "sport-and-games": { medium: 3, hard: 3 }
};

export const ODD_ONE_OUT_BLUEPRINTS = [
  {
    id: "mammals-and-fish",
    family: "animals",
    difficulty: 2,
    matches: ["Dolphin", "Whale", "Seal", "Otter", "Bat", "Elephant", "Horse", "Tiger"],
    intruders: ["Shark", "Salmon", "Tuna", "Cod", "Trout"],
    explanation: (odd) => `${odd} is a fish. The other choices are mammals.`
  },
  {
    id: "string-instruments",
    family: "arts-and-culture",
    difficulty: 2,
    matches: ["Violin", "Cello", "Harp", "Guitar", "Double Bass", "Banjo", "Mandolin"],
    intruders: ["Trumpet", "Flute", "Clarinet", "Trombone", "Saxophone"],
    explanation: (odd) => `${odd} is a wind instrument. The other choices are string instruments.`
  },
  {
    id: "european-capitals",
    family: "geography",
    difficulty: 2,
    matches: ["Paris", "Rome", "Madrid", "Lisbon", "Vienna", "Berlin", "Athens", "Dublin"],
    intruders: ["Toronto", "Sydney", "New York", "Chicago", "Rio de Janeiro"],
    explanation: (odd) => `${odd} is not a European capital. The other choices are European capitals.`
  },
  {
    id: "classical-composers",
    family: "arts-and-culture",
    difficulty: 2,
    matches: ["Mozart", "Beethoven", "Bach", "Chopin", "Vivaldi", "Tchaikovsky", "Handel"],
    intruders: ["Monet", "Picasso", "Van Gogh", "Rembrandt", "Kahlo"],
    explanation: (odd) => `${odd} is a painter. The other choices are classical composers.`
  },
  {
    id: "us-brands",
    family: "brands-and-business",
    difficulty: 2,
    matches: ["Apple", "Nike", "Coca-Cola", "Ford", "McDonalds", "Levis"],
    intruders: ["Sony", "Toyota", "IKEA", "Samsung", "Nintendo"],
    explanation: (odd) => `${odd} was not founded in the United States. The other brands were.`
  },
  {
    id: "japanese-brands",
    family: "brands-and-business",
    difficulty: 2,
    matches: ["Toyota", "Honda", "Nintendo", "Sony", "Mitsubishi", "Uniqlo"],
    intruders: ["IKEA", "Samsung", "Adidas", "Lego", "Ferrari"],
    explanation: (odd) => `${odd} was not founded in Japan. The other brands were.`
  },
  {
    id: "reptiles-and-amphibians",
    family: "animals",
    difficulty: 2,
    matches: ["Lizard", "Turtle", "Crocodile", "Snake", "Iguana", "Chameleon"],
    intruders: ["Frog", "Toad", "Newt", "Salamander"],
    explanation: (odd) => `${odd} is an amphibian. The other choices are reptiles.`
  },
  {
    id: "metal-elements",
    family: "science-and-space",
    difficulty: 2,
    matches: ["Iron", "Copper", "Gold", "Silver", "Nickel", "Aluminium", "Zinc"],
    intruders: ["Oxygen", "Carbon", "Sulfur", "Helium"],
    explanation: (odd) => `${odd} is not a metal. The other choices are metals.`
  },
  {
    id: "world-oceans",
    family: "geography",
    difficulty: 2,
    matches: ["Atlantic", "Pacific", "Indian", "Arctic", "Southern"],
    intruders: ["Mediterranean", "Caribbean", "Baltic", "Black Sea"],
    explanation: (odd) => `${odd} is a sea. The other choices are oceans.`
  },
  {
    id: "human-organs",
    family: "human-body-and-health",
    difficulty: 2,
    matches: ["Heart", "Liver", "Lung", "Kidney", "Brain", "Stomach"],
    intruders: ["Femur", "Skull", "Rib", "Spine", "Pelvis"],
    explanation: (odd) => `${odd} is a bone. The other choices are organs.`
  },
  {
    id: "days-of-week",
    family: "time-language-and-symbols",
    difficulty: 2,
    matches: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    intruders: ["January", "March", "June", "October"],
    explanation: (odd) => `${odd} is a month. The other choices are days of the week.`
  },
  {
    id: "chemical-symbols",
    family: "science-and-space",
    difficulty: 2,
    matches: ["Hydrogen", "Oxygen", "Nitrogen", "Carbon", "Helium", "Neon"],
    intruders: ["Granite", "Quartz", "Marble", "Sandstone"],
    explanation: (odd) => `${odd} is a rock or mineral. The other choices are chemical elements.`
  },
  {
    id: "major-planets",
    family: "science-and-space",
    difficulty: 3,
    matches: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
    intruders: ["Pluto", "Ceres", "Eris", "Haumea", "Makemake"],
    explanation: (odd) => `${odd} is a dwarf planet. The other choices are planets.`
  },
  {
    id: "mammals-and-birds",
    family: "animals",
    difficulty: 3,
    matches: ["Dolphin", "Whale", "Bat", "Otter", "Seal", "Kangaroo", "Giraffe"],
    intruders: ["Eagle", "Penguin", "Owl", "Sparrow", "Flamingo"],
    explanation: (odd) => `${odd} is a bird. The other choices are mammals.`
  },
  {
    id: "capital-cities",
    family: "geography",
    difficulty: 3,
    matches: ["Canberra", "Ottawa", "Brasilia", "Ankara", "Wellington", "Bern", "Abuja"],
    intruders: ["Sydney", "Toronto", "Istanbul", "Auckland", "Zurich"],
    explanation: (odd) => `${odd} is not that country's capital. The other choices are national capitals.`
  },
  {
    id: "roman-numerals",
    family: "time-language-and-symbols",
    difficulty: 3,
    matches: ["I", "V", "X", "L", "C", "D", "M"],
    intruders: ["A", "B", "E", "G", "N"],
    explanation: (odd) => `${odd} is not a Roman numeral. The other choices are Roman numerals.`
  },
  {
    id: "nordic-countries",
    family: "geography",
    difficulty: 3,
    matches: ["Denmark", "Finland", "Iceland", "Norway", "Sweden"],
    intruders: ["Estonia", "Germany", "Poland", "Scotland"],
    explanation: (odd) => `${odd} is not a Nordic country. The other choices are Nordic countries.`
  },
  {
    id: "renewable-energy",
    family: "energy-environment-and-nature",
    difficulty: 3,
    matches: ["Solar", "Wind", "Hydro", "Geothermal", "Tidal"],
    intruders: ["Coal", "Diesel", "Petrol", "Natural Gas"],
    explanation: (odd) => `${odd} is not a renewable energy source. The other choices are renewable energy sources.`
  },
  {
    id: "eu-currency",
    family: "geography",
    difficulty: 3,
    matches: ["France", "Germany", "Italy", "Spain", "Portugal", "Ireland", "Austria"],
    intruders: ["Sweden", "Denmark", "Poland", "Hungary"],
    explanation: (odd) => `${odd} does not use the euro. The other countries do.`
  }
];
