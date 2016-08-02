/*
 * Specific event handlers for mouse interactions on our buttons
 *
 */

import { redrawBoard, redrawButton, redrawScore } from "./board";
import constants from "./constants";
import { startPlayingSound, stopPlayingSound, resetPlayingSound, playFailureSound } from "./sound";
import { State, Score, CanvasButton, buttonToNote, resetState } from "./state";
import { resetTune, extendTune, playTune } from "./tune";
import { eventLog, timeout } from "./utils";

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

      startPlayingSound(state.audio, buttonToNote(b), constants.durations.replayNoteTimeout, () => endPlayingNote(state));

    } else { // Wrong note

      playFailureSound(state.audio, () => { // Play failure then clear the note button
        state.depressed = null;
        redrawButton(state, b);
      });

      state.notesMatched = null;
      flashScore(state, "Plings", 3, () => { // Flash failure

        timeout(constants.durations.afterFailure,   () => { // Pause and then...

          if (state.strict) { // Go back to beginning of the round if we are in strict mode

            newRound(state);

          } else { // Start replay again if non-strict

            state.score = state.tune.length;
            redrawScore(state);
            playTune(state, 0);
            state.notesMatched = 0;

          }
        });

      });

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

    timeout(constants.durations.flash, () => flashScore(state, x, n - 1, finalCb));

  } else {

    timeout(constants.durations.finalFlash, () => finalCb(state));

  }

}


/** Helper function to unlight playing note and */
function endPlayingNote(state: State): void {

  if (state.notesMatched !== null) {
    if (state.depressed !== null) { // combining these two conditions confuses the Typescript null checker

      const oldPlaying: CanvasButton = state.depressed;
      state.depressed = null;
      redrawButton(state, oldPlaying);

      state.notesMatched = state.notesMatched + 1;

      if (state.notesMatched >= state.tune.length) {

        if (state.notesMatched >= constants.game.winCondition) {

          flashScore(state, "Win", 3, () => { // Flash success

            timeout(constants.durations.afterFailure,   () => newRound(state));


          });

        } else {

          timeout(constants.durations.afterReplay, () => {
            extendTune(state);
            redrawScore(state);
            playTune(state, 0);

          });
        }
      }

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
