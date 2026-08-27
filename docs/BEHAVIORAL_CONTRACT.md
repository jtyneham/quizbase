# Current behavioral contract for the v2 rewrite

This document records behavior to preserve from the current application. It describes outcomes, not the legacy implementation.

## Application shell

- The Home screen exposes five games: Missing Word, Missing Word - Pokémon, Hangman, Hangman - Pokémon, and Random Letter.
- Every game can return Home without reloading the page.
- Every game can enter and exit fullscreen where the browser supports it.
- Fullscreen labels and accessibility state reflect the actual fullscreen state.
- Haptics are optional enhancement and must never be required for an action.
- Keyboard shortcuts act only on the active screen.

## Missing Word family

- Standard and Pokémon variants share rules but use separate data/configuration.
- Phases are empty, generating, masked, and revealed.
- Next chooses an eligible, non-recent word and creates a mask.
- A second action during generation requests an early stop and settles to the predetermined result.
- Reveal displays every masked character without shifting the word unexpectedly.
- Mixed difficulty chooses medium or hard rounds; explicit Medium and Hard modes remain available.
- Medium and hard modes use distinct vocabulary eligibility, masking ratios, endpoint tendencies, and maximum blank runs.
- Every word segment should retain at least one visible letter where possible.
- Repeated appearances of a word should prefer a different mask.
- Topic selection supports one, many, or all topics and clearly reports an empty result pool.
- Recent history prevents immediate repetition and resets safely when it exhausts a filtered pool.
- Reduced-motion users receive the final state without slot-reel motion.

## Hangman family

- A new round selects an answer from the active pool and avoids immediately repeating the current answer when possible.
- Alphabetic characters begin hidden; spaces and punctuation are structurally visible.
- Correct guesses reveal every occurrence of that letter and do not add a miss.
- Incorrect guesses add one miss and cannot be counted repeatedly.
- Six misses cause a loss; all answer letters are then revealed.
- Revealing every playable letter causes a win.
- Solve mode accepts a complete answer, supports spaces and deletion, and can be cancelled.
- An incorrect complete solution adds one miss rather than immediately losing, unless it is the sixth miss.
- New Word uses a short confirmation state while a round is active.
- Starting a round fully resets guessed-key visuals, misses, messages, solve state, and artwork stages.
- Topic changes start a valid new round.
- The standard variant supports a curated Random pool and category selection.
- The Pokémon variant preserves its intended default topic selection and supports its complete topic taxonomy.
- Accented Pokémon letters normalize to playable A-Z input while the original glyph remains rendered.
- Every answer blank remains visible and countable when the answer wraps to multiple lines.
- On constrained screens, artwork shrinks before word, status, controls, or keyboard become unreadable.

## Random Letter

- Generate chooses a weighted random letter.
- Q, X, Y, and Z occur at half the weight of ordinary letters.
- Only one generation sequence runs at a time.
- The base presentation may choose among slot, flip, tunnel, and wheel reveals.
- Reduced-motion users receive the selected letter directly.
- The letter card and Generate control both start generation.
- Space can start generation when focus is not inside an interactive control.
- Ideas can be shown or hidden.
- The base Ideas presentation contains four independently moving topic rows.
- Decorative ticker work should pause while its screen is inactive in v2.

## Required adversarial fixtures

- A Hangman answer guaranteed to occupy two or more rows on a narrow phone.
- A Hangman answer containing spaces, apostrophes, punctuation, and accented letters.
- Hangman states at zero through six misses.
- Hangman solve mode with a long buffer.
- Missing Word with two, three, and twenty letters.
- Missing Word with multiple words and punctuation.
- Empty topic-filter results.
- Long topic labels in open selectors.
- Every selector open at narrow portrait width.
- Every success, warning, error, disabled, generating, revealed, win, and loss state.

## Equivalence policy

Intentional v2 changes may improve routing, cleanup, accessibility, responsiveness, and deterministic testing. A game-rule change requires an explicit decision and a dedicated test; it must not happen accidentally as part of presentation work.

## Intentional v2 improvements

- Hash routes restore on refresh and use normal browser history.
- Screen teardown removes global listeners and subscriptions.
- Random Letter decorative work exists only while its view is mounted.
- Standard and Pokémon siblings use shared engines instead of duplicated logic.
- Pokémon Missing Word starts from the meaningful `Pokemon All Names` topic rather than an empty unusable selection.
- Hangman may scroll as a final small-viewport fallback instead of clipping required gameplay content.
