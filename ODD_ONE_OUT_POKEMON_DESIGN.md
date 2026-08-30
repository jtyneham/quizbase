# Odd One Out — Pokémon Edition Design

**Status:** Design in progress. This document is a content and validation
contract, not an implementation request. Do not add a game route, launcher
entry, icon, or player-facing Pokémon data until the blueprint and validation
work is approved.

## Product boundary

Pokémon Odd One Out is a future sibling of the standard Odd One Out game. A
group sees four terms, identifies the one that does not belong, taps it, then
receives a short explanation before continuing.

- Use main-series Pokémon game knowledge only.
- Include only game mechanics and factual game data: species, types, Moves,
  Abilities, items, evolutions, and battle concepts.
- Exclude anime, films, NPCs, city names, plot, and flavour-text trivia.
- Reuse the established Odd One Out engine, feedback, haptics, cooldowns, and
  renderer contract when the edition is eventually integrated.
- Keep Pokémon data in a dedicated reviewed module; never fetch an API while a
  player is using the game.

## Editorial rules

1. Every round has exactly one genuinely defensible odd answer.
2. The answer must follow from the intended Pokémon fact, rather than visible
   wording, a shared prefix/suffix, or simple process of elimination.
3. Reject a set if it has a second obvious three-versus-one relationship.
4. Use current, stable main-series behaviour. Omit generation- or
   version-sensitive facts unless the intended rule explicitly identifies the
   applicable modern game rule.
5. Medium uses broadly recognisable Pokémon game knowledge. Hard can use
   deeper mechanics and less-famous terms, but must remain explainable at a
   glance rather than merely obscure.
6. Explanations stay concise and use the established two-line format:
   `<intruder> is X.\nThe others are Y.`

## Source policy

PokeAPI is the primary structured source for extracting and validating
candidates. Cross-check any potentially ambiguous fact against a reputable
Pokémon reference, preferably an official Pokémon source where it covers the
fact, otherwise Bulbapedia and/or Pokémon Database.

Do not ship a relationship until it is reviewed. Record a primary source,
cross-check source when needed, and verification date in curation records. If
sources conflict or the intended current-game fact is unclear, omit it.

## Provisional families and blueprints

These are design candidates, not player-facing content. Each requires a
reviewed pool and a blueprint-specific anti-overlap rule before it can enter
the game.

| Family | Blueprint | Intended three-versus-one rule | Difficulty |
| --- | --- | --- | --- |
| Battle Moves | Moves vs Abilities | Three Moves; one Ability | Medium |
| Battle Moves | Damaging vs status Moves | Three status Moves; one damaging Move | Medium |
| Battle Moves | Move type | Three Moves of one type; one of another | Medium |
| Battle Moves | Damage class | Three physical Moves; one special Move, or vice versa | Hard |
| Battle Moves | Fixed base power | Three damaging Moves have one fixed modern base-power value; one does not | Hard |
| Ability Mechanics | Type-immunity Abilities | Three Abilities negate/absorb one attack type; one does not | Hard |
| Species & Evolution | Pure versus dual type | Three species are pure members of a type; one is a dual-type member of it | Medium |
| Species & Evolution | Evolution stage | Three are final pseudo-legendary evolutions; one is a middle evolution | Hard |
| Species & Evolution | Evolution trigger | Three species use one evolution method; one uses another | Medium |
| Items & Evolution | Evolution-enabling held items | Three held items can enable evolution; one cannot | Hard |

The initial set is deliberately Move-heavy. Before implementation, expand the
other families so normal play does not become a sequence of move questions.

## Validation matrix

Every reviewed term must carry enough metadata for the engine and tests to
prove the intended relationship and reject competing ones.

| Area | Required metadata or check |
| --- | --- |
| Identity | Canonical ID, display label, normalised label |
| Scope | Main-series eligibility, introduction generation, modern-rule status |
| Provenance | Primary source, optional cross-check source, verified date |
| Player fit | Familiarity (`general` or `deep`), display-length review, accessibility label |
| Intended rule | Blueprint ID, matching property/value, intruder property/value |
| Relevant traits | Kind, type, damage class, fixed base power, effect group, evolution stage/trigger, item category, battle-effect group as applicable |
| Surface checks | Common stem, prefix, suffix, or visible category-word detection |
| Competition checks | Protected attributes that must not form another obvious three-versus-one split |
| Explanation | Approved two-line explanation wording |
| Review trail | Approved/rejected status and a concrete rejection reason |

### Automatic rejection rules

Reject a candidate round if it has any of the following:

- duplicate visible labels after normalisation;
- an ineligible/non-main-series term;
- an undefined, variable, or version-sensitive fact for the selected
  blueprint;
- a surface giveaway such as three labels sharing `Ball`, `Stone`, or an
  equivalent conspicuous name pattern;
- more than one plausible three-versus-one split across protected attributes;
- an explanation that needs caveats, exceptions, or more than two short lines;
- a label that cannot be displayed cleanly on the four-card mobile layout.

### Blueprint-specific examples

For **fixed base power**, the intended property is `fixedBasePower`. A valid
round has exactly three terms with one reviewed power value and one with a
different value. Its matching trio must be mixed enough in type, damage class,
effect group, and name pattern that power is the only obvious answer.

For **evolution stage**, selecting three final pseudo-legendary evolutions and
one middle evolution is not enough by itself. The terms must also avoid a
second shortcut such as three Dragon-types versus one non-Dragon-type.

## Curation workflow

1. Approve a blueprint and its protected attributes.
2. Extract candidate terms from PokeAPI; filter to the product boundary.
3. Cross-check any nuanced or version-sensitive candidate.
4. Assemble candidate rounds and run automatic matrix checks.
5. Manually review fairness, wording, familiarity, and explanation clarity.
6. Preserve rejected candidates with a reason, so bad patterns are not
   reconsidered accidentally.
7. Add only approved static data and tests to the future game module.

## Deferred product decisions

- No topic picker.
- A familiarity control such as `Broad | General | Deep` remains a separate,
  deferred whole-game idea in `ROADMAP.md`; it is not the same as difficulty.
- Launcher icon concept: use the usual four-choice motif, enlarging the
  lower-right circle and rendering it as a simplified Poké Ball.
