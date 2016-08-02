


Callback madness

## TODO

* Canvas

  + DONE Can we shift the origin?
  + DONE Use light/dark versions
  + DONE Pixel decode
  + DONE Callbacks
  + DONE Match to window size
  + DONE Re-draw on window resize
  + DONE Add central buttons
  + DONE Rename drawNoteButton, and DRY

  + TODO De-pixelate switch label text?
  + TODO Use brighter green? (Put boardColors into separate file)

* Sound

  + DONE Test whether Start -> 3 random notes works

  + TODO Does gain work?
  + TODO Check correct notes
  + TODO Add timeout? Is there an event for mousing off page? (mouseup onto document?) Use mouseout?

* Logic

  + DONE Extent click decoder to cope with all buttons
  + DONE Handlers to make all buttons light up
    - DONE Notes on mouse down/up (put a "depressed" field into State)
    - DONE Swithches toggle on click
    - DONE Tidy switch re-rendering - border and text (make separate function to draw Button trim which does black ring and text)
  + DONE Add sounds

  + TODO Work through behaviour list below

* Code

 + DONE Document all modules - how to make module documentation not merge with first function?
 + DONE Sort out packaging/webpack etc
 * DONE Use nicer import format namespace and default?
 * DONE Everything in milliseconds (and document that for all functions that take sounds)
 * DONE Frequencies (notes and failure) in constants module

## Note notes

From [Wikipedia](https://en.wikipedia.org/wiki/Simon_(game)), Notes are

E-note (blue, lower right);  329.628  (was 659.255)
C-sharp-note (yellow, lower left); 277.183 (was 554.365)
A-note (red, upper right). 440
E-note (green, upper left, an octave lower than blue); 164.814 (was 329.628)

## Terminology

* Tune the sequence of notes that the player has to match
* The tune is *played* by the Simon game and then *replayed* by the player

## Behaviour (and implementation note)

### Initial power-off state

* Power button active (implented in `event/makeClickHandler` and `handlers/handlePowerClick`)
* All other buttons inactive (ensured in the three top-level handlers in `event`)
* Score blank (part of `state/resetState`)

### Powering off

* Move to inital powered off state (in `handlers/handlePowerClick`)
* Killing any sound that is playing (by `sound/resetPlayingSound` called from `event/handlePowerClick`)
* Stopping any tune that is playing (by `sound/resetPlayingSound` called from `event/handlePowerClick`)

### Powering on

* Score changes to `"--"` (in `handlers/handlePowerClick`)
* Start and strict Buttons become active (ensured in `event/makeClickHandler`)

### Pressing Start

* Score flashes off/on/off/on/pause (in `handlers/handleStartClick`)
* Start tune play back with single note (in `handlers/handleStartClick)

### Tune playing

* Notes play with gaps and lighting up notes as they play (in `tune/playTune`)
* Ignore note presses and clicks until tune finished (in `handlers/handleNoteDown`)

### Tune playback phase

* Correct note

  + Mouse down on correct note starts note playing and lights up note (in `handlers/handleNoteDown`)
  + Mouse up on correct note ends note playing and unlights note (in `handlers/handleNoteUp`)
  + Timeout while playing note ends note playing and unlights note (in `handlers/handleNoteDown`)
  + On ending final note, pause and extend the tune (in `handlers/endPlayingNote`)
  + Handle 20 note win condition (in `handlers/endPlayingNote`)

* Wrong note

  + Mouse down triggers raspberry  and flashing !! in score with note pressed being lit until raspberry ends (in `handlers/handleNoteDown`)
  + If non-strict mode: Then pause, play current tune again and continue (in `handlers/handleNoteDown`)
  + If strict mode: pause and start a new length-1 tune and continue (in `handlers/handleNoteDown`)

* Timeout

  + TODO


