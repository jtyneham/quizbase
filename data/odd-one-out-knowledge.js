/**
 * General-knowledge relationship blueprints for Odd One Out.
 *
 * A blueprint is deliberately more structured than a word list: the engine
 * picks three matching terms plus one reviewed near-miss. The relationship is
 * revealed only after a player taps, keeping a round quick but satisfying.
 *
 * Do not add fandom-specific or specialist material here. Difficulty comes
 * from the distinction between related concepts, not niche knowledge.
 * Medium should be broadly answerable at a glance; Hard may use a closer
 * distinction, but every term must still be recognisable General Knowledge.
 * Prefer at least five matches and five intruders so a relationship stays
 * fresh beyond its explanation.
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
  "sport-and-games": { medium: 3, hard: 3 },
  "food-and-drink": { medium: 3, hard: 2 },
  "technology-and-inventions": { medium: 3, hard: 2 },
  "entertainment-and-media": { medium: 3, hard: 2 },
  "history-and-civilization": { medium: 3, hard: 2 },
  "government-and-society": { medium: 3, hard: 2 },
  "mythology-and-folklore": { medium: 3, hard: 2 },
  "mathematics-and-logic": { medium: 3, hard: 2 },
  "plants-and-natural-world": { medium: 3, hard: 2 }
};

export const ODD_ONE_OUT_BLUEPRINTS = [
  {
    id: "mammals-and-fish",
    family: "animals",
    difficulty: 2,
    matches: ["Dolphin", "Whale", "Seal", "Otter", "Bat", "Elephant", "Horse", "Tiger"],
    intruders: ["Shark", "Salmon", "Tuna", "Cod", "Trout"],
    explanation: (odd) => `${odd} is a fish.\nThe others are mammals.`
  },
  {
    id: "string-instruments",
    family: "arts-and-culture",
    difficulty: 2,
    matches: ["Violin", "Cello", "Harp", "Guitar", "Double Bass", "Banjo", "Mandolin"],
    intruders: ["Trumpet", "Flute", "Clarinet", "Trombone", "Saxophone"],
    explanation: (odd) => `${odd} is a wind instrument.\nThe others are string instruments.`
  },
  {
    id: "european-capitals",
    family: "geography",
    difficulty: 2,
    matches: ["Paris", "Rome", "Madrid", "Lisbon", "Vienna", "Berlin", "Athens", "Dublin"],
    intruders: ["Toronto", "Sydney", "New York", "Chicago", "Rio de Janeiro"],
    explanation: (odd) => `${odd} is not a European capital.\nThe others are European capitals.`
  },
  {
    id: "classical-composers",
    family: "arts-and-culture",
    difficulty: 2,
    matches: ["Mozart", "Beethoven", "Bach", "Chopin", "Vivaldi", "Tchaikovsky", "Handel"],
    intruders: ["Monet", "Picasso", "Van Gogh", "Rembrandt", "Kahlo"],
    explanation: (odd) => `${odd} is a painter.\nThe others are classical composers.`
  },
  {
    id: "us-brands",
    family: "brands-and-business",
    difficulty: 2,
    matches: ["Apple", "Nike", "Coca-Cola", "Ford", "McDonalds", "Levis"],
    intruders: ["Sony", "Toyota", "IKEA", "Samsung", "Nintendo"],
    explanation: (odd) => `${odd} was not founded in the United States.\nThe others are American brands.`
  },
  {
    id: "japanese-brands",
    family: "brands-and-business",
    difficulty: 2,
    matches: ["Toyota", "Honda", "Nintendo", "Sony", "Mitsubishi", "Uniqlo"],
    intruders: ["IKEA", "Samsung", "Adidas", "Lego", "Ferrari"],
    explanation: (odd) => `${odd} was not founded in Japan.\nThe others are Japanese brands.`
  },
  {
    id: "reptiles-and-amphibians",
    family: "animals",
    difficulty: 2,
    matches: ["Lizard", "Turtle", "Crocodile", "Snake", "Iguana", "Chameleon"],
    intruders: ["Frog", "Toad", "Newt", "Salamander"],
    explanation: (odd) => `${odd} is an amphibian.\nThe others are reptiles.`
  },
  {
    id: "metal-elements",
    family: "science-and-space",
    difficulty: 2,
    matches: ["Iron", "Copper", "Gold", "Silver", "Nickel", "Aluminium", "Zinc"],
    intruders: ["Oxygen", "Carbon", "Sulfur", "Helium"],
    explanation: (odd) => `${odd} is not a metal.\nThe others are metals.`
  },
  {
    id: "world-oceans",
    family: "geography",
    difficulty: 2,
    matches: ["Atlantic", "Pacific", "Indian", "Arctic", "Southern"],
    intruders: ["Mediterranean", "Caribbean", "Baltic", "Black Sea"],
    explanation: (odd) => `${odd} is a sea.\nThe others are oceans.`
  },
  {
    id: "human-organs",
    family: "human-body-and-health",
    difficulty: 2,
    matches: ["Heart", "Liver", "Lung", "Kidney", "Brain", "Stomach"],
    intruders: ["Femur", "Skull", "Rib", "Spine", "Pelvis"],
    explanation: (odd) => `${odd} is a bone.\nThe others are organs.`
  },
  {
    id: "days-of-week",
    family: "time-language-and-symbols",
    difficulty: 2,
    matches: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    intruders: ["January", "March", "June", "October"],
    explanation: (odd) => `${odd} is a month.\nThe others are days of the week.`
  },
  {
    id: "chemical-symbols",
    family: "science-and-space",
    difficulty: 2,
    matches: ["Hydrogen", "Oxygen", "Nitrogen", "Carbon", "Helium", "Neon"],
    intruders: ["Granite", "Quartz", "Marble", "Sandstone"],
    explanation: (odd) => `${odd} is a rock or mineral.\nThe others are chemical elements.`
  },
  {
    id: "major-planets",
    family: "science-and-space",
    difficulty: 3,
    matches: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"],
    intruders: ["Pluto", "Ceres", "Eris", "Haumea", "Makemake"],
    explanation: (odd) => `${odd} is a dwarf planet.\nThe others are planets.`
  },
  {
    id: "mammals-and-birds",
    family: "animals",
    difficulty: 3,
    matches: ["Dolphin", "Whale", "Bat", "Otter", "Seal", "Kangaroo", "Giraffe"],
    intruders: ["Eagle", "Penguin", "Owl", "Sparrow", "Flamingo"],
    explanation: (odd) => `${odd} is a bird.\nThe others are mammals.`
  },
  {
    id: "capital-cities",
    family: "geography",
    difficulty: 3,
    matches: ["Canberra", "Ottawa", "Brasilia", "Ankara", "Wellington", "Bern", "Abuja"],
    intruders: ["Sydney", "Toronto", "Istanbul", "Auckland", "Zurich"],
    explanation: (odd) => `${odd} is not that country's capital.\nThe others are national capitals.`
  },
  {
    id: "roman-numerals",
    family: "time-language-and-symbols",
    difficulty: 3,
    matches: ["I", "V", "X", "L", "C", "D", "M"],
    intruders: ["A", "B", "E", "G", "N"],
    explanation: (odd) => `${odd} is not a Roman numeral.\nThe others are Roman numerals.`
  },
  {
    id: "nordic-countries",
    family: "geography",
    difficulty: 3,
    matches: ["Denmark", "Finland", "Iceland", "Norway", "Sweden"],
    intruders: ["Estonia", "Germany", "Poland", "Scotland"],
    explanation: (odd) => `${odd} is not a Nordic country.\nThe others are Nordic countries.`
  },
  {
    id: "renewable-energy",
    family: "energy-environment-and-nature",
    difficulty: 3,
    matches: ["Solar", "Wind", "Hydro", "Geothermal", "Tidal"],
    intruders: ["Coal", "Diesel", "Petrol", "Natural Gas"],
    explanation: (odd) => `${odd} is not a renewable energy source.\nThe others are renewable energy sources.`
  },
  {
    id: "eu-currency",
    family: "geography",
    difficulty: 3,
    matches: ["France", "Germany", "Italy", "Spain", "Portugal", "Ireland", "Austria"],
    intruders: ["Sweden", "Denmark", "Poland", "Hungary"],
    explanation: (odd) => `${odd} does not use the euro.\nThe others are euro-using countries.`
  },
  {
    id: "coffee-drinks-and-teas",
    family: "everyday-life",
    difficulty: 2,
    matches: ["Espresso", "Cappuccino", "Latte", "Americano", "Mocha"],
    intruders: ["Earl Grey", "Oolong", "Darjeeling", "Sencha", "Matcha"],
    explanation: (odd) => `${odd} is tea.\nThe others are coffee drinks.`
  },
  {
    id: "citrus-fruits",
    family: "everyday-life",
    difficulty: 2,
    matches: ["Orange", "Lemon", "Lime", "Grapefruit", "Mandarin", "Clementine"],
    intruders: ["Strawberry", "Raspberry", "Blueberry", "Blackberry", "Cranberry"],
    explanation: (odd) => `${odd} is not a citrus fruit.\nThe others are citrus fruits.`
  },
  {
    id: "common-fabrics",
    family: "everyday-life",
    difficulty: 2,
    matches: ["Cotton", "Linen", "Silk", "Wool", "Denim", "Velvet"],
    intruders: ["Leather", "Rubber", "Plastic", "Glass", "Metal"],
    explanation: (odd) => `${odd} is not a fabric.\nThe others are fabrics.`
  },
  {
    id: "land-transport",
    family: "everyday-life",
    difficulty: 2,
    matches: ["Car", "Bus", "Train", "Bicycle", "Motorcycle", "Tram"],
    intruders: ["Canoe", "Ferry", "Sailboat", "Kayak", "Yacht"],
    explanation: (odd) => `${odd} is a water vehicle.\nThe others are land transport.`
  },
  {
    id: "racket-sports",
    family: "sport-and-games",
    difficulty: 2,
    matches: ["Tennis", "Badminton", "Squash", "Pickleball", "Table Tennis"],
    intruders: ["Golf", "Baseball", "Cricket", "Hockey", "Archery"],
    explanation: (odd) => `${odd} is not a racket sport.\nThe others are racket sports.`
  },
  {
    id: "winter-sports",
    family: "sport-and-games",
    difficulty: 2,
    matches: ["Skiing", "Snowboarding", "Curling", "Bobsleigh", "Luge", "Biathlon"],
    intruders: ["Surfing", "Sailing", "Cycling", "Golf", "Tennis"],
    explanation: (odd) => `${odd} is not a winter sport.\nThe others are winter sports.`
  },
  {
    id: "board-games-and-card-games",
    family: "sport-and-games",
    difficulty: 2,
    matches: ["Chess", "Checkers", "Backgammon", "Monopoly", "Scrabble", "Risk", "Clue"],
    intruders: ["Poker", "Bridge", "Blackjack", "Baccarat", "Rummy"],
    explanation: (odd) => `${odd} is a card game.\nThe others are board games.`
  },
  {
    id: "vitamins-and-minerals",
    family: "human-body-and-health",
    difficulty: 2,
    matches: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D", "Vitamin E", "Vitamin K"],
    intruders: ["Iron", "Calcium", "Zinc", "Potassium", "Magnesium"],
    explanation: (odd) => `${odd} is a mineral.\nThe others are vitamins.`
  },
  {
    id: "impressionist-painters",
    family: "arts-and-culture",
    difficulty: 3,
    matches: ["Monet", "Renoir", "Degas", "Pissarro", "Sisley", "Morisot"],
    intruders: ["Picasso", "Dalí", "Kahlo", "Warhol", "Pollock"],
    explanation: (odd) => `${odd} is not associated with Impressionism.\nThe others are Impressionist painters.`
  },
  {
    id: "shakespeare-plays",
    family: "arts-and-culture",
    difficulty: 3,
    matches: ["Hamlet", "Macbeth", "Othello", "King Lear", "The Tempest", "Julius Caesar"],
    intruders: ["Oliver Twist", "Jane Eyre", "Great Expectations", "Frankenstein", "Wuthering Heights"],
    explanation: (odd) => `${odd} is a novel, not a Shakespeare play.\nThe others are Shakespeare plays.`
  },
  {
    id: "famous-ballets",
    family: "arts-and-culture",
    difficulty: 3,
    matches: ["Swan Lake", "The Nutcracker", "The Sleeping Beauty", "Giselle", "Coppélia", "Don Quixote"],
    intruders: ["Carmen", "La Traviata", "The Magic Flute", "Aida", "Tosca"],
    explanation: (odd) => `${odd} is an opera.\nThe others are ballets.`
  },
  {
    id: "german-car-brands",
    family: "brands-and-business",
    difficulty: 3,
    matches: ["BMW", "Mercedes-Benz", "Audi", "Porsche", "Volkswagen", "Opel"],
    intruders: ["Ferrari", "Fiat", "Lamborghini", "Alfa Romeo", "Maserati"],
    explanation: (odd) => `${odd} is an Italian car brand.\nThe others are German car brands.`
  },
  {
    id: "video-and-music-streaming",
    family: "brands-and-business",
    difficulty: 3,
    matches: ["Netflix", "Disney+", "Hulu", "Max", "Prime Video", "Apple TV+"],
    intruders: ["Spotify", "Apple Music", "Deezer", "Tidal", "SoundCloud"],
    explanation: (odd) => `${odd} is primarily a music-streaming service.\nThe others are video-streaming services.`
  },
  {
    id: "weather-instruments",
    family: "energy-environment-and-nature",
    difficulty: 2,
    matches: ["Barometer", "Thermometer", "Anemometer", "Rain Gauge", "Hygrometer", "Weather Vane"],
    intruders: ["Compass", "Stopwatch", "Ruler", "Protractor", "Calculator"],
    explanation: (odd) => `${odd} is not used to measure weather conditions.\nThe others are weather instruments.`
  },
  {
    id: "greenhouse-gases",
    family: "energy-environment-and-nature",
    difficulty: 3,
    matches: ["Carbon Dioxide", "Methane", "Nitrous Oxide", "Water Vapour", "Ozone"],
    intruders: ["Nitrogen", "Oxygen", "Argon", "Helium", "Neon"],
    explanation: (odd) => `${odd} is not a greenhouse gas.\nThe others are greenhouse gases.`
  },
  {
    id: "pasta-shapes-and-breads",
    family: "food-and-drink",
    difficulty: 2,
    matches: ["Spaghetti", "Penne", "Fusilli", "Farfalle", "Rigatoni", "Tagliatelle"],
    intruders: ["Bagel", "Croissant", "Pretzel", "Brioche", "Sourdough"],
    explanation: (odd) => `${odd} is bread or pastry.\nThe others are pasta shapes.`
  },
  {
    id: "cooking-oils-and-vinegars",
    family: "food-and-drink",
    difficulty: 2,
    matches: ["Olive Oil", "Sunflower Oil", "Sesame Oil", "Canola Oil", "Coconut Oil"],
    intruders: ["Balsamic Vinegar", "Apple Cider Vinegar", "Rice Vinegar", "Malt Vinegar", "White Wine Vinegar"],
    explanation: (odd) => `${odd} is vinegar.\nThe others are cooking oils.`
  },
  {
    id: "legumes-and-grains",
    family: "food-and-drink",
    difficulty: 3,
    matches: ["Chickpea", "Lentil", "Black Bean", "Kidney Bean", "Split Pea", "Peanut"],
    intruders: ["Rice", "Oats", "Wheat", "Barley", "Quinoa"],
    explanation: (odd) => `${odd} is a grain.\nThe others are legumes.`
  },
  {
    id: "computer-input-devices",
    family: "technology-and-inventions",
    difficulty: 2,
    matches: ["Keyboard", "Mouse", "Scanner", "Microphone", "Webcam", "Trackpad"],
    intruders: ["Monitor", "Printer", "Speaker", "Projector", "Headphones"],
    explanation: (odd) => `${odd} is an output device.\nThe others are input devices.`
  },
  {
    id: "web-browsers-and-search-engines",
    family: "technology-and-inventions",
    difficulty: 2,
    matches: ["Chrome", "Firefox", "Safari", "Edge", "Opera", "Brave"],
    intruders: ["Google", "Bing", "Yahoo", "DuckDuckGo", "Baidu"],
    explanation: (odd) => `${odd} is a search engine.\nThe others are web browsers.`
  },
  {
    id: "image-and-audio-file-formats",
    family: "technology-and-inventions",
    difficulty: 3,
    matches: ["JPEG", "PNG", "GIF", "SVG", "WebP"],
    intruders: ["MP3", "WAV", "AAC", "FLAC", "OGG"],
    explanation: (odd) => `${odd} is an audio format.\nThe others are image formats.`
  },
  {
    id: "film-directors-and-actors",
    family: "entertainment-and-media",
    difficulty: 2,
    matches: ["Spielberg", "Nolan", "Scorsese", "Tarantino", "Bigelow", "Gerwig"],
    intruders: ["Streep", "DiCaprio", "Washington", "Johansson", "Pitt"],
    explanation: (odd) => `${odd} is an actor.\nThe others are film directors.`
  },
  {
    id: "bands-and-solo-artists",
    family: "entertainment-and-media",
    difficulty: 2,
    matches: ["The Beatles", "Queen", "ABBA", "U2", "Coldplay", "Nirvana"],
    intruders: ["Beyoncé", "Adele", "Madonna", "Prince", "Rihanna"],
    explanation: (odd) => `${odd} is a solo artist.\nThe others are bands.`
  },
  {
    id: "fictional-detectives-and-authors",
    family: "entertainment-and-media",
    difficulty: 3,
    matches: ["Sherlock Holmes", "Hercule Poirot", "Miss Marple", "Columbo", "Nancy Drew"],
    intruders: ["Agatha Christie", "Arthur Conan Doyle", "Raymond Chandler", "P. D. James", "Dashiell Hammett"],
    explanation: (odd) => `${odd} is an author.\nThe others are fictional detectives.`
  },
  {
    id: "ancient-wonders-and-modern-landmarks",
    family: "history-and-civilization",
    difficulty: 2,
    matches: ["Great Pyramid", "Hanging Gardens", "Temple of Artemis", "Statue of Zeus", "Colossus of Rhodes", "Lighthouse of Alexandria"],
    intruders: ["Eiffel Tower", "Big Ben", "Statue of Liberty", "Sydney Opera House", "Golden Gate Bridge"],
    explanation: (odd) => `${odd} is a modern landmark.\nThe others are ancient wonders.`
  },
  {
    id: "historical-eras-and-empires",
    family: "history-and-civilization",
    difficulty: 2,
    matches: ["Renaissance", "Enlightenment", "Middle Ages", "Victorian Era", "Industrial Revolution"],
    intruders: ["Roman Empire", "Ottoman Empire", "Persian Empire", "Mongol Empire", "Aztec Empire"],
    explanation: (odd) => `${odd} is an empire.\nThe others are historical eras.`
  },
  {
    id: "roman-emperors-and-greek-philosophers",
    family: "history-and-civilization",
    difficulty: 3,
    matches: ["Augustus", "Nero", "Hadrian", "Claudius", "Marcus Aurelius"],
    intruders: ["Socrates", "Plato", "Aristotle", "Epicurus", "Pythagoras"],
    explanation: (odd) => `${odd} was a Greek philosopher.\nThe others are Roman emperors.`
  },
  {
    id: "tableware-and-cookware",
    family: "everyday-life",
    difficulty: 3,
    matches: ["Plate", "Bowl", "Mug", "Glass", "Saucer", "Serving Dish"],
    intruders: ["Saucepan", "Frying Pan", "Wok", "Stockpot", "Casserole Dish"],
    explanation: (odd) => `${odd} is cookware.\nThe others are tableware.`
  },
  {
    id: "tennis-grand-slams-and-other-tournaments",
    family: "sport-and-games",
    difficulty: 3,
    matches: ["Australian Open", "French Open", "Wimbledon", "US Open"],
    intruders: ["Indian Wells", "Miami Open", "Davis Cup", "ATP Finals", "Laver Cup"],
    explanation: (odd) => `${odd} is not a tennis Grand Slam.\nThe others are tennis Grand Slam tournaments.`
  },
  {
    id: "upper-and-lower-limb-bones",
    family: "human-body-and-health",
    difficulty: 3,
    matches: ["Humerus", "Radius", "Ulna", "Scapula", "Clavicle"],
    intruders: ["Femur", "Tibia", "Fibula", "Patella", "Talus"],
    explanation: (odd) => `${odd} is a lower-limb bone.\nThe others are upper-limb bones.`
  },
  {
    id: "big-cats-and-canines",
    family: "animals",
    difficulty: 2,
    matches: ["Lion", "Tiger", "Leopard", "Jaguar", "Cheetah", "Cougar"],
    intruders: ["Wolf", "Fox", "Coyote", "Jackal", "Dingo"],
    explanation: (odd) => `${odd} is a canine.\nThe others are big cats.`
  },
  {
    id: "insects-and-arachnids",
    family: "animals",
    difficulty: 2,
    matches: ["Butterfly", "Beetle", "Ant", "Bee", "Dragonfly", "Grasshopper"],
    intruders: ["Spider", "Scorpion", "Tick", "Mite", "Tarantula"],
    explanation: (odd) => `${odd} is an arachnid.\nThe others are insects.`
  },
  {
    id: "marsupials-and-rodents",
    family: "animals",
    difficulty: 3,
    matches: ["Kangaroo", "Koala", "Wombat", "Tasmanian Devil", "Possum"],
    intruders: ["Rat", "Squirrel", "Beaver", "Hamster", "Guinea Pig"],
    explanation: (odd) => `${odd} is a rodent.\nThe others are marsupials.`
  },
  {
    id: "noble-gases-and-other-elements",
    family: "science-and-space",
    difficulty: 2,
    matches: ["Helium", "Neon", "Argon", "Krypton", "Xenon", "Radon"],
    intruders: ["Oxygen", "Nitrogen", "Carbon", "Chlorine", "Sulfur"],
    explanation: (odd) => `${odd} is not a noble gas.\nThe others are noble gases.`
  },
  {
    id: "scientific-disciplines-and-humanities",
    family: "science-and-space",
    difficulty: 2,
    matches: ["Biology", "Chemistry", "Physics", "Astronomy", "Geology"],
    intruders: ["History", "Literature", "Art", "Music", "Philosophy"],
    explanation: (odd) => `${odd} is a humanities subject.\nThe others are scientific disciplines.`
  },
  {
    id: "natural-satellites-and-dwarf-planets",
    family: "science-and-space",
    difficulty: 3,
    matches: ["Moon", "Europa", "Titan", "Ganymede", "Callisto", "Enceladus"],
    intruders: ["Pluto", "Ceres", "Eris", "Haumea", "Makemake"],
    explanation: (odd) => `${odd} is a dwarf planet.\nThe others are natural satellites.`
  },
  {
    id: "punctuation-and-mathematical-symbols",
    family: "time-language-and-symbols",
    difficulty: 2,
    matches: ["Question Mark", "Exclamation Mark", "Comma", "Semicolon", "Colon", "Apostrophe"],
    intruders: ["Plus Sign", "Equals Sign", "Percent Sign", "Division Sign", "Multiplication Sign"],
    explanation: (odd) => `${odd} is a mathematical symbol.\nThe others are punctuation marks.`
  },
  {
    id: "romance-and-germanic-languages",
    family: "time-language-and-symbols",
    difficulty: 3,
    matches: ["Spanish", "French", "Italian", "Portuguese", "Romanian"],
    intruders: ["English", "German", "Dutch", "Swedish", "Danish"],
    explanation: (odd) => `${odd} is a Germanic language.\nThe others are Romance languages.`
  },
  {
    id: "sense-organs-and-internal-organs",
    family: "human-body-and-health",
    difficulty: 2,
    matches: ["Eye", "Ear", "Nose", "Tongue", "Skin"],
    intruders: ["Heart", "Lung", "Liver", "Kidney", "Stomach"],
    explanation: (odd) => `${odd} is an internal organ.\nThe others are sense organs.`
  },
  {
    id: "tooth-types-and-bones",
    family: "human-body-and-health",
    difficulty: 3,
    matches: ["Incisor", "Canine", "Molar", "Premolar", "Wisdom Tooth"],
    intruders: ["Femur", "Tibia", "Radius", "Ulna", "Clavicle"],
    explanation: (odd) => `${odd} is a bone.\nThe others are types of teeth.`
  },
  {
    id: "trees-and-flowers",
    family: "plants-and-natural-world",
    difficulty: 2,
    matches: ["Oak", "Maple", "Pine", "Birch", "Willow"],
    intruders: ["Rose", "Tulip", "Lily", "Daffodil", "Orchid"],
    explanation: (odd) => `${odd} is a flower.\nThe others are trees.`
  },
  {
    id: "precipitation-and-weather-conditions",
    family: "energy-environment-and-nature",
    difficulty: 3,
    matches: ["Rain", "Snow", "Sleet", "Hail", "Drizzle"],
    intruders: ["Fog", "Mist", "Dew", "Frost", "Humidity"],
    explanation: (odd) => `${odd} is not precipitation.\nThe others are forms of precipitation.`
  },
  {
    id: "herbs-and-spices",
    family: "food-and-drink",
    difficulty: 3,
    matches: ["Basil", "Parsley", "Oregano", "Thyme", "Rosemary", "Dill"],
    intruders: ["Cumin", "Paprika", "Turmeric", "Cinnamon", "Nutmeg"],
    explanation: (odd) => `${odd} is a spice.\nThe others are herbs.`
  },
  {
    id: "operating-systems-and-applications",
    family: "technology-and-inventions",
    difficulty: 3,
    matches: ["Windows", "macOS", "Linux", "Android", "iOS", "ChromeOS"],
    intruders: ["Word", "Excel", "PowerPoint", "Photoshop", "Zoom"],
    explanation: (odd) => `${odd} is an application.\nThe others are operating systems.`
  },
  {
    id: "animated-films-and-live-action-films",
    family: "entertainment-and-media",
    difficulty: 2,
    matches: ["Toy Story", "Shrek", "Frozen", "Moana", "Coco", "Spirited Away"],
    intruders: ["Titanic", "Inception", "Gladiator", "The Godfather", "Jurassic Park"],
    explanation: (odd) => `${odd} is a live-action film.\nThe others are animated films.`
  },
  {
    id: "british-monarchs-and-us-presidents",
    family: "history-and-civilization",
    difficulty: 3,
    matches: ["Elizabeth II", "Victoria", "Henry VIII", "George VI", "William IV"],
    intruders: ["Washington", "Lincoln", "Jefferson", "Roosevelt", "Obama"],
    explanation: (odd) => `${odd} was a US president.\nThe others are British monarchs.`
  },
  {
    id: "elected-offices-and-hereditary-titles",
    family: "government-and-society",
    difficulty: 2,
    matches: ["President", "Senator", "Mayor", "Governor", "Councillor", "Member of Parliament"],
    intruders: ["King", "Queen", "Prince", "Duke", "Baron"],
    explanation: (odd) => `${odd} is a hereditary title.\nThe others are political offices.`
  },
  {
    id: "election-and-court-terms",
    family: "government-and-society",
    difficulty: 2,
    matches: ["Ballot", "Candidate", "Constituency", "Referendum", "Manifesto", "Polling Station"],
    intruders: ["Verdict", "Jury", "Appeal", "Defendant", "Witness"],
    explanation: (odd) => `${odd} is a courtroom term.\nThe others are election terms.`
  },
  {
    id: "intergovernmental-organizations-and-ngos",
    family: "government-and-society",
    difficulty: 3,
    matches: ["United Nations", "NATO", "World Health Organization", "African Union", "ASEAN"],
    intruders: ["Greenpeace", "Amnesty International", "Doctors Without Borders", "Human Rights Watch", "Oxfam"],
    explanation: (odd) => `${odd} is a non-governmental organization.\nThe others are intergovernmental organizations.`
  },
  {
    id: "greek-and-norse-gods",
    family: "mythology-and-folklore",
    difficulty: 2,
    matches: ["Zeus", "Hera", "Athena", "Apollo", "Artemis", "Poseidon"],
    intruders: ["Odin", "Thor", "Loki", "Freya", "Heimdall"],
    explanation: (odd) => `${odd} is a Norse god.\nThe others are Greek gods.`
  },
  {
    id: "mythical-creatures-and-fairy-tale-characters",
    family: "mythology-and-folklore",
    difficulty: 2,
    matches: ["Dragon", "Phoenix", "Unicorn", "Griffin", "Kraken", "Cyclops"],
    intruders: ["Cinderella", "Snow White", "Rapunzel", "Pinocchio", "Rumpelstiltskin"],
    explanation: (odd) => `${odd} is a fairy-tale character.\nThe others are mythical creatures.`
  },
  {
    id: "roman-and-greek-gods",
    family: "mythology-and-folklore",
    difficulty: 3,
    matches: ["Jupiter", "Juno", "Mars", "Venus", "Mercury"],
    intruders: ["Zeus", "Hera", "Ares", "Aphrodite", "Hermes"],
    explanation: (odd) => `${odd} is a Greek god.\nThe others are Roman gods.`
  },
  {
    id: "plane-shapes-and-solids",
    family: "mathematics-and-logic",
    difficulty: 2,
    matches: ["Triangle", "Square", "Pentagon", "Hexagon", "Octagon"],
    intruders: ["Sphere", "Cone", "Cylinder", "Cube", "Pyramid"],
    explanation: (odd) => `${odd} is a three-dimensional solid.\nThe others are plane shapes.`
  },
  {
    id: "length-and-mass-units",
    family: "mathematics-and-logic",
    difficulty: 2,
    matches: ["Kilometre", "Metre", "Centimetre", "Millimetre", "Micrometre"],
    intruders: ["Kilogram", "Gram", "Milligram", "Tonne", "Pound"],
    explanation: (odd) => `${odd} is a unit of mass.\nThe others are units of length.`
  },
  {
    id: "square-and-cube-numbers",
    family: "mathematics-and-logic",
    difficulty: 3,
    matches: ["4", "9", "16", "25", "36"],
    intruders: ["8", "27", "64", "125", "216"],
    explanation: (odd) => `${odd} is a cube number.\nThe others are square numbers.`
  },
  {
    id: "deciduous-and-evergreen-trees",
    family: "plants-and-natural-world",
    difficulty: 2,
    matches: ["Oak", "Maple", "Birch", "Willow", "Beech", "Aspen"],
    intruders: ["Pine", "Spruce", "Fir", "Cedar", "Yew"],
    explanation: (odd) => `${odd} is an evergreen tree.\nThe others are deciduous trees.`
  },
  {
    id: "fungi-and-plants",
    family: "plants-and-natural-world",
    difficulty: 2,
    matches: ["Portobello", "Shiitake", "Chanterelle", "Morel", "Oyster Mushroom"],
    intruders: ["Rose", "Fern", "Moss", "Pine", "Cactus"],
    explanation: (odd) => `${odd} is a plant.\nThe others are fungi.`
  },
  {
    id: "conifers-and-flowering-trees",
    family: "plants-and-natural-world",
    difficulty: 3,
    matches: ["Pine", "Spruce", "Fir", "Cedar", "Yew"],
    intruders: ["Oak", "Maple", "Magnolia", "Cherry", "Apple"],
    explanation: (odd) => `${odd} is a flowering tree.\nThe others are conifers.`
  },
  {
    id: "athletics-and-swimming-events",
    family: "sport-and-games",
    difficulty: 2,
    matches: ["100 Metres", "200 Metres", "400 Metres", "Marathon", "Hurdles", "Long Jump"],
    intruders: ["Freestyle", "Butterfly", "Backstroke", "Breaststroke", "Medley"],
    explanation: (odd) => `${odd} is a swimming event.\nThe others are athletics events.`
  },
  {
    id: "golf-and-tennis-terms",
    family: "sport-and-games",
    difficulty: 3,
    matches: ["Birdie", "Eagle", "Bogey", "Par", "Fairway"],
    intruders: ["Tiebreak", "Deuce", "Love", "Serve", "Volley"],
    explanation: (odd) => `${odd} is a tennis term.\nThe others are golf terms.`
  },
  {
    id: "kitchen-and-laundry-appliances",
    family: "everyday-life",
    difficulty: 3,
    matches: ["Kettle", "Toaster", "Blender", "Microwave", "Food Processor"],
    intruders: ["Washing Machine", "Tumble Dryer", "Vacuum Cleaner", "Steam Mop", "Carpet Cleaner"],
    explanation: (odd) => `${odd} is a laundry or cleaning appliance.\nThe others are kitchen appliances.`
  },
  {
    id: "sportswear-and-luxury-fashion-brands",
    family: "brands-and-business",
    difficulty: 2,
    matches: ["Nike", "Adidas", "Puma", "Under Armour", "ASICS"],
    intruders: ["Gucci", "Prada", "Chanel", "Burberry", "Dior"],
    explanation: (odd) => `${odd} is a luxury fashion brand.\nThe others are sportswear brands.`
  },
  {
    id: "film-and-music-awards",
    family: "entertainment-and-media",
    difficulty: 3,
    matches: ["Oscar", "BAFTA", "Palme d'Or", "Golden Lion", "Golden Bear"],
    intruders: ["Grammy", "Brit Award", "MTV Video Music Award", "Billboard Music Award", "Juno Award"],
    explanation: (odd) => `${odd} is a music award.\nThe others are film awards.`
  }
];
