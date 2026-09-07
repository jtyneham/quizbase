import { withCuratedHangmanTopic, withCuratedMissingWordTopic } from "./topic-pool-utils.js";

/**
 * An international men's association-football pool spanning eras and regions.
 * Entries are names only, so the topic does not
 * become stale when clubs, squads or rankings change. Every name contains at
 * least two words. The Missing Word export below applies that renderer's
 * stricter length limits without compromising real display names.
 */
export const FOOTBALL_PLAYERS_TOPIC = "Football Players";

export const FOOTBALL_PLAYERS_WORDS = [
  // Widely recognisable players: the accessible Mixed/Medium core.
  ["Lionel Messi", 1], ["Cristiano Ronaldo", 1], ["Neymar Junior", 1], ["Kylian Mbappe", 1],
  ["Erling Haaland", 1], ["Mohamed Salah", 1], ["Kevin De Bruyne", 1], ["Robert Lewandowski", 1],
  ["Luka Modric", 1], ["Karim Benzema", 1], ["Harry Kane", 1], ["Jude Bellingham", 1],
  ["Vinicius Junior", 1], ["Lamine Yamal", 1], ["Antoine Griezmann", 1], ["Luis Suarez", 1],
  ["Sergio Ramos", 1], ["Manuel Neuer", 1], ["Gianluigi Buffon", 1], ["Zlatan Ibrahimovic", 1],
  ["Ronaldinho Gaucho", 1], ["Ronaldo Nazario", 1], ["Diego Maradona", 1], ["Zinedine Zidane", 1],
  ["David Beckham", 1], ["Wayne Rooney", 1], ["Thierry Henry", 1], ["Andres Iniesta", 1],
  ["Xavi Hernandez", 1], ["Gerard Pique", 1], ["Carles Puyol", 1], ["Iker Casillas", 1],
  ["Paolo Maldini", 1], ["Andrea Pirlo", 1], ["Francesco Totti", 1], ["Alessandro Del Piero", 1],
  ["Roberto Carlos", 1], ["Marco van Basten", 1], ["Johan Cruyff", 1], ["Franz Beckenbauer", 1],
  ["Gerd Muller", 1], ["Thomas Muller", 1], ["Didier Drogba", 1], ["Samuel Eto'o", 1],
  ["Sadio Mane", 1], ["Son Heung-min", 1], ["Virgil van Dijk", 1], ["Gareth Bale", 1],
  ["Alan Shearer", 1], ["Sergio Aguero", 1], ["Carlos Tevez", 1], ["Marcelo Vieira", 1],
  ["Dani Alves", 1], ["Peter Schmeichel", 1], ["Petr Cech", 1], ["Oliver Kahn", 1],
  ["Rio Ferdinand", 1], ["Steven Gerrard", 1], ["Frank Lampard", 1], ["Paul Scholes", 1],

  // Familiar to football followers, with longer and less immediately obvious names.
  ["Rodri Hernandez", 2], ["Bernardo Silva", 2], ["Bruno Fernandes", 2], ["Bukayo Saka", 2],
  ["Phil Foden", 2], ["Cole Palmer", 2], ["Declan Rice", 2], ["Jamal Musiala", 2],
  ["Florian Wirtz", 2], ["Joshua Kimmich", 2], ["Toni Kroos", 2], ["Ilkay Gundogan", 2],
  ["Marc-Andre ter Stegen", 2], ["Thibaut Courtois", 2], ["Jan Oblak", 2], ["Alisson Becker", 2],
  ["Ederson Moraes", 2], ["Trent Alexander-Arnold", 2], ["Andrew Robertson", 2], ["Ruben Dias", 2],
  ["Antonio Rudiger", 2], ["Marquinhos Correa", 2], ["Achraf Hakimi", 2], ["Theo Hernandez", 2],
  ["Federico Valverde", 2], ["Lautaro Martinez", 2], ["Julian Alvarez", 2], ["Paulo Dybala", 2],
  ["Angel Di Maria", 2], ["Enzo Fernandez", 2], ["Alexis Mac Allister", 2], ["Gabriel Martinelli", 2],
  ["Gabriel Jesus", 2], ["Victor Osimhen", 2], ["Khvicha Kvaratskhelia", 2], ["Rafael Leao", 2],
  ["Joao Felix", 2], ["Joao Cancelo", 2], ["Bruno Guimaraes", 2], ["Martin Odegaard", 2],
  ["Christian Eriksen", 2], ["Pierre-Emerick Aubameyang", 2], ["Riyad Mahrez", 2], ["N'Golo Kante", 2],
  ["Mesut Ozil", 2], ["Robin van Persie", 2], ["Arjen Robben", 2], ["Wesley Sneijder", 2],
  ["Clarence Seedorf", 2], ["Patrick Vieira", 2], ["Claude Makelele", 2], ["Luis Figo", 2],
  ["Raul Gonzalez", 2], ["Fernando Torres", 2], ["David Villa", 2], ["Cesc Fabregas", 2],
  ["Juan Mata", 2], ["David Silva", 2], ["Xabi Alonso", 2], ["Javier Mascherano", 2],

  // Historic and international deeper cuts reserved for Missing Word Hard.
  ["Hristo Stoichkov", 3], ["Gheorghe Hagi", 3], ["Pavel Nedved", 3], ["Andriy Shevchenko", 3],
  ["George Weah", 3], ["Jay-Jay Okocha", 3], ["Nwankwo Kanu", 3], ["Michael Essien", 3],
  ["Abedi Pele", 3], ["Roger Milla", 3], ["Rabah Madjer", 3], ["Ali Daei", 3],
  ["Park Ji-sung", 3], ["Shunsuke Nakamura", 3], ["Tim Cahill", 3], ["Hidetoshi Nakata", 3],
  ["Carlos Valderrama", 3], ["Juan Roman Riquelme", 3], ["Gabriel Batistuta", 3], ["Hernan Crespo", 3],
  ["Javier Zanetti", 3], ["Lilian Thuram", 3], ["Marcel Desailly", 3], ["Fabio Cannavaro", 3],
  ["Alessandro Nesta", 3], ["Roberto Baggio", 3], ["Matthias Sammer", 3], ["Davor Suker", 3],
  ["Enzo Francescoli", 3], ["Dragan Stojkovic", 3]
];

export const FOOTBALL_PLAYERS_MISSING_WORDS = FOOTBALL_PLAYERS_WORDS.filter(([answer]) => {
  const letterCount = (answer.match(/[A-Za-z]/g) ?? []).length;
  const wordCount = answer.trim().split(/\s+/).length;
  return letterCount <= 20 && wordCount <= 3;
});

export function withFootballPlayersMissingWordPool(entries) {
  return withCuratedMissingWordTopic(entries, {
    topic: FOOTBALL_PLAYERS_TOPIC,
    words: FOOTBALL_PLAYERS_MISSING_WORDS
  });
}

export function withFootballPlayersHangmanPool(entries) {
  return withCuratedHangmanTopic(entries, {
    topic: FOOTBALL_PLAYERS_TOPIC,
    words: FOOTBALL_PLAYERS_WORDS
  });
}
