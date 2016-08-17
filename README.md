# FreeCodeCamp Simon Game

Implementation of the [Simon](https://en.wikipedia.org/wiki/Simon_(game)) electronic game. Implemented in
TypeScript with lots of callbacks.

Hosted at [jw120.github.io](https://jw120.github.io)

## TODO

  + Check still works on Chrome
  + Convert to using timeouts instead of .stop(time) so works on Mac Safari
  + Test on iPhone
  + Does gain work?
  + Test and correct notes

## Note notes

From [Wikipedia](https://en.wikipedia.org/wiki/Simon_(game)), Notes are

* E-note (blue, lower right);  329.628
* C-sharp-note (yellow, lower left); 277.183
* A-note (red, upper right). 440
* E-note (green, upper left, an octave lower than blue); 164.814

## Terminology

* The *tune* is the sequence of notes that the player has to match
* The tune is *played* by the Simon game and then *replayed* by the player

## Behaviour (and implementation note)

### Initial power-off state

* Power button active (implented in `event/makeClickHandler` and `handlers/handlePowerClick`)
* All other buttons inactive (ensured in the three top-level handlers in `event`)
* Score is blank (part of `state/resetState`)

### Powering off

* Move to inital powered off state (in `handlers/handlePowerClick`)
* Kill any sound that is playing (by `sound/resetPlayingSound` called from `event/handlePowerClick`)
* Stop any tune that is playing (by `sound/resetPlayingSound` called from `event/handlePowerClick`)

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

  + Failure triggered if player waits too long (in `replay-timeout/setReplayTimeout`)


