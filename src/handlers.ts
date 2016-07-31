/*
 * Specific event handlers for mouse interactions on our buttons
 *
 */

import { redrawBoard, redrawButton, redrawScore } from "./board";
import { flashDelay, finalFlashDelay, maxReplayNoteDuration, afterFailureDuration, afterReplayDuration } from "./boardDimensions";
import { startPlayingSound, stopPlayingSound, resetPlayingSound, playFailureSound } from "./sound";
import { State, Score, CanvasButton, buttonToNote, resetState } from "./state";
import { resetTune, extendTune, playTune } from "./tune";
import { eventLog } from "./utils";

/** Handle a click on the power button */
export function handlePowerClick(state: State): void {

  eventLog("Click", "PowerButton", "redrew");

  if (state.power) { // Powering down - reset and redraw everything

    resetPlayingSound(state.audio);
    resetState(state);
    redrawBoard(state);

  } else { // We are powering on

    state.power = true;
    state.score = "Dashes";
    redrawScore(state);
    redrawButton(state, "PowerButton");

  }

}

/** Handle a click on the strict button (with power on) */
export function handleStrictClick(state: State): void {

  eventLog("Click", "StrictButton", "redrew");

  state.strict = !state.strict;

  redrawButton(state, "StrictButton");

}

/** Handle a click on the start button (with power on) */
export function handleStartClick(state: State): void {

    eventLog("Click", "StartButton", "start sequence beginning");
    newRound(state);

}

/** Handle a mouseDown event on a note Button given that power is on */
export function handleNoteDown(state: State, b: CanvasButton): void {

  if (state.notesMatched !== null) { // if we are in replay mode

    eventLog("Down", "b", "note down during replay phase");

    state.depressed = b;
    eventLog("Down", b, "redrew as depressed");
    redrawButton(state, b);

    if (buttonToNote(b) === state.tune[state.notesMatched]) { // Correct note

      startPlayingSound(state.audio, buttonToNote(b), maxReplayNoteDuration, () => endPlayingNote(state));

    } else { // Wrong note

      playFailureSound(state.audio, () => { // Play failure then clear the note button
        state.depressed = null;
        redrawButton(state, b);
      });

      state.notesMatched = null;
      flashScore(state, "Plings", 3, () => { // Flash failure method

        setTimeout( // Pause and then...
          () => {
            if (state.strict) { // Go back to beginning of the round if we are in strict mode

              newRound(state);

            } else { // Start replay again if non-strict

              state.score = state.tune.length;
              redrawScore(state);
              playTune(state, 0);
              state.notesMatched = 0;

            }
          },
          afterFailureDuration
        );

      } );

    }

  } else {

    eventLog("Down", "b", "note down outside replay, ignored");

  }

}

/** Handle a mouseDown event given that state.depressed is a note button and power is on) */
export function handleUpFromNote(state: State): void {

  eventLog("Up", undefined, "from note, stops sound ");
  stopPlayingSound(state.audio);
  if (state.depressed !== null) {
    endPlayingNote(state);
  }

}

/* Update score in X/blank/X/blank sequence, calling next step after delay and then final callback*/
function flashScore(state: State, x: Score, n: number, finalCb: ((s: State) => void)): void {

  state.score = n % 2 ? "Blank" : x;
  redrawScore(state);

  if (n > 0) {

    setTimeout(() => flashScore(state, x, n - 1, finalCb), flashDelay);

  } else {

    setTimeout(() => finalCb(state), finalFlashDelay);

  }

}


/** Helper function to unlight playing note and */
function endPlayingNote(state: State): void {

  if (state.depressed !== null && state.notesMatched !== null) {

    const oldPlaying: CanvasButton = state.depressed;
    state.depressed = null;
    redrawButton(state, oldPlaying);

    state.notesMatched = state.notesMatched + 1;
    if (state.notesMatched >= state.tune.length) {
      setTimeout(
        () => {
          extendTune(state);
          redrawScore(state);
          playTune(state, 0);
        },
        afterReplayDuration
      );
    }

  }

}


/** Helper function to start a new round */
function newRound(state: State): void {

      flashScore(state, "Dashes", 3, () => {

        resetTune(state);
        extendTune(state);

        redrawScore(state);
        playTune(state, 0);

    });

}