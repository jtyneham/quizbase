/**
 * Play-first prompt bank for Random Letter.
 *
 * A group agrees on one prompt, generates a letter, then races to name a
 * fitting answer. These are deliberately broad, familiar categories rather
 * than an exhaustive catalogue: a prompt needs quick, defensible answers for
 * a shared-screen party game.
 */
export const topicGroups = [
  {
    family: "Everyday",
    topics: [
      "Things in a Kitchen", "Things in a Bathroom", "Things in a Bedroom",
      "Things in a Living Room", "Things in a Garden", "Things in a Garage",
      "Things in a Supermarket", "Things in a School", "Things in an Office",
      "Things You Wear", "Things You Carry in a Bag", "Things You Take on Holiday"
    ]
  },
  {
    family: "Food & Drink",
    topics: [
      "Food", "Drinks", "Fruit", "Vegetables", "Desserts", "Snacks",
      "Breakfast Foods", "Fast Food Chains", "Pizza Toppings", "Ice Cream Flavors",
      "Cocktails", "Things You Can Bake"
    ]
  },
  {
    family: "Animals & Nature",
    topics: [
      "Animals", "Pets", "Farm Animals", "Zoo Animals", "Sea Creatures", "Birds",
      "Insects", "Flowers", "Trees", "Weather", "Things in Space", "Natural Disasters"
    ]
  },
  {
    family: "Places & Travel",
    topics: [
      "Countries", "Capital Cities", "Cities", "Islands", "Rivers", "Mountains",
      "Famous Landmarks", "Places to Visit on Holiday", "Things at an Airport",
      "Things at the Beach", "Things on a Map", "Things You Find in a Hotel"
    ]
  },
  {
    family: "People & Culture",
    topics: [
      "First Names", "Jobs", "Famous People", "Actors", "Musicians", "Athletes",
      "Fictional Characters", "Superheroes", "Historical Figures", "Scientists", "Artists",
      "YouTubers & Streamers"
    ]
  },
  {
    family: "Entertainment",
    topics: [
      "Movies", "TV Shows", "Book Titles", "Song Titles", "Bands", "Video Games",
      "Board Games", "Card Games", "Comic Characters", "Cartoon Characters",
      "Anime Characters", "Pokémon"
    ]
  },
  {
    family: "Sport & Movement",
    topics: [
      "Sports", "Olympic Sports", "Football Teams", "Football Players",
      "Sports Equipment", "Martial Arts", "Exercises", "Things at a Gym", "Vehicles",
      "Car Brands", "Things with Wheels", "Things That Fly"
    ]
  },
  {
    family: "Playful Prompts",
    topics: [
      "Hobbies", "Things That Make Noise", "Things That Are Round", "Things That Are Soft",
      "Things That Are Cold", "Things That Are Expensive", "Things You Can Open",
      "Things You Can Recycle", "Things You Can Build", "Things You Can Collect",
      "Things with Buttons", "Things with Screens"
    ]
  }
];

export const topics = topicGroups.flatMap(group => group.topics);
export const allTopics = topicGroups.flatMap(group =>
  group.topics.map(topic => ({ name: topic, family: group.family }))
);
