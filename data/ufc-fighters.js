import { withCuratedHangmanTopic } from "./topic-pool-utils.js";

/**
 * A deliberately timeless UFC topic: every entry is a fighter who has
 * competed in the promotion.  It avoids rankings, divisions, nicknames and
 * event-specific wording, which would make a Hangman answer date quickly.
 */
export const UFC_FIGHTERS_TOPIC = "UFC Fighters";

export const UFC_FIGHTERS_WORDS = [
  // Familiar names: a welcoming core for mixed groups.
  ["Conor McGregor", 1], ["Jon Jones", 1], ["Khabib Nurmagomedov", 1], ["Ronda Rousey", 1],
  ["Anderson Silva", 1], ["Georges St-Pierre", 1], ["Israel Adesanya", 1], ["Amanda Nunes", 1],
  ["Dustin Poirier", 1], ["Nate Diaz", 1], ["Nick Diaz", 1], ["Charles Oliveira", 1],
  ["Max Holloway", 1], ["Justin Gaethje", 1], ["Daniel Cormier", 1], ["Stipe Miocic", 1],
  ["Francis Ngannou", 1], ["Alex Pereira", 1], ["Jorge Masvidal", 1], ["Tony Ferguson", 1],
  ["Brock Lesnar", 1], ["Chuck Liddell", 1], ["Randy Couture", 1], ["Tito Ortiz", 1],
  ["BJ Penn", 1], ["Jose Aldo", 1], ["Dominick Cruz", 1], ["Demetrious Johnson", 1],
  ["Valentina Shevchenko", 1], ["Zhang Weili", 1], ["Holly Holm", 1], ["Miesha Tate", 1],
  ["Rose Namajunas", 1], ["Joanna Jedrzejczyk", 1], ["Paige VanZant", 1], ["Cain Velasquez", 1],
  ["Junior Dos Santos", 1], ["Alistair Overeem", 1], ["Vitor Belfort", 1], ["Lyoto Machida", 1],
  ["Forrest Griffin", 1], ["Quinton Jackson", 1], ["Rashad Evans", 1], ["Anthony Pettis", 1],
  ["Donald Cerrone", 1], ["Urijah Faber", 1], ["Henry Cejudo", 1], ["Sean O'Malley", 1],
  ["Petr Yan", 1], ["Merab Dvalishvili", 1], ["Sean Strickland", 1], ["Dricus Du Plessis", 1],
  ["Khamzat Chimaev", 1], ["Tom Aspinall", 1], ["Leon Edwards", 1], ["Kamaru Usman", 1],
  ["Colby Covington", 1], ["Gilbert Burns", 1], ["Shavkat Rakhmonov", 1], ["Islam Makhachev", 1],
  ["Ilia Topuria", 1], ["Robert Whittaker", 1], ["Paulo Costa", 1], ["Michael Bisping", 1],
  ["Chris Weidman", 1], ["Jiri Prochazka", 1], ["Glover Teixeira", 1], ["Jan Blachowicz", 1],
  ["Jamahal Hill", 1], ["Kayla Harrison", 1], ["Raquel Pennington", 1], ["Julianna Pena", 1],
  ["Alexa Grasso", 1], ["Manon Fiorot", 1], ["Brandon Moreno", 1], ["Deiveson Figueiredo", 1],
  ["Stephen Thompson", 1], ["Kevin Holland", 1], ["Paddy Pimblett", 1], ["Dan Hooker", 1],

  // Deeper cuts: still notable UFC competitors, but rewarding for regular fans.
  ["Rich Franklin", 2], ["Matt Hughes", 2], ["Frank Shamrock", 2], ["Ken Shamrock", 2],
  ["Mark Coleman", 2], ["Dan Severn", 2], ["Bas Rutten", 2], ["Mauricio Rua", 2],
  ["Wanderlei Silva", 2], ["Mirko Cro Cop", 2], ["Antonio Nogueira", 2], ["Fabricio Werdum", 2],
  ["Mark Hunt", 2], ["Roy Nelson", 2], ["Frank Mir", 2], ["Shane Carwin", 2],
  ["Brendan Schaub", 2], ["Travis Browne", 2], ["Curtis Blaydes", 2], ["Ciryl Gane", 2],
  ["Sergei Pavlovich", 2], ["Alexander Volkov", 2], ["Tai Tuivasa", 2], ["Derrick Lewis", 2],
  ["Magomed Ankalaev", 2], ["Khalil Rountree", 2], ["Corey Anderson", 2], ["Anthony Smith", 2],
  ["Volkan Oezdemir", 2], ["Ovince Saint Preux", 2], ["Thiago Santos", 2], ["Johnny Walker", 2],
  ["Yair Rodriguez", 2], ["Brian Ortega", 2], ["Alexander Volkanovski", 2], ["Brian Kelleher", 2],
  ["Chan Sung Jung", 2], ["Cub Swanson", 2], ["Frankie Edgar", 2], ["Ricardo Lamas", 2],
  ["Marlon Vera", 2], ["Cory Sandhagen", 2], ["Rob Font", 2], ["Aljamain Sterling", 2],
  ["Pedro Munhoz", 2], ["Jimmie Rivera", 2], ["Raphael Assuncao", 2], ["T.J. Dillashaw", 2],
  ["Renan Barao", 2], ["William Gomis", 2], ["Beneil Dariush", 2], ["Rafael Fiziev", 2],
  ["Mateusz Gamrot", 2], ["Arman Tsarukyan", 2], ["Dan Ige", 2], ["Josh Emmett", 2],
  ["Edson Barboza", 2], ["Bobby Green", 2], ["Grant Dawson", 2], ["Renato Moicano", 2],
  ["Michael Chandler", 2], ["Rafael dos Anjos", 2], ["Carlos Condit", 2], ["Robbie Lawler", 2],
  ["Johny Hendricks", 2], ["Tyron Woodley", 2], ["Belal Muhammad", 2], ["Jack Della Maddalena", 2],
  ["Ian Machado Garry", 2], ["Vicente Luque", 2], ["Geoff Neal", 2], ["Neil Magny", 2],
  ["Jared Cannonier", 2], ["Marvin Vettori", 2], ["Derek Brunson", 2], ["Kelvin Gastelum", 2],
  ["Roman Dolidze", 2], ["Nassourdine Imavov", 2], ["Tatiana Suarez", 2], ["Carla Esparza", 2],
  ["Jessica Andrade", 2], ["Michelle Waterson", 2], ["Maycee Barber", 2], ["Erin Blanchfield", 2],
  ["Katlyn Cerminara", 2], ["Jessica Eye", 2], ["Lauren Murphy", 2], ["Germaine de Randamie", 2]
];

export function withUfcFightersHangmanPool(entries) {
  return withCuratedHangmanTopic(entries, { topic: UFC_FIGHTERS_TOPIC, words: UFC_FIGHTERS_WORDS });
}
