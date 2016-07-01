/*
 * Specific event handlers for mouse interactions on our buttons
 *
 */

import { redrawBoard, redrawButton, redrawScore } from "./board";
import { startPlayingSound, stopPlayingSound, resetPlayingSound } from "./sound";
import { State, CanvasButton, buttonToNote, resetState } from "./state";
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
    state.score = "--";
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

    eventLog("Click", "StartButton", "starting tune");

    resetTune(state);
    extendTune(state);
    playTune(state, 0);

    redrawButton(state, "StrictButton");

}

/** Handle a mouseDown event on a note Button given that power is on */
export function handleNoteDown(state: State, b: CanvasButton): void {

  if (state.notesMatched !== null) {

    eventLog("Down", "b", "note down during replay");

    state.depressed = b;
    eventLog("Down", b, "redrew as depressed");
    redrawButton(state, b);

    if (buttonToNote(b) === state.tune[state.notesMatched]) {
      startPlayingSound(state.audio, buttonToNote(b));
    }

  } else {

    eventLog("Down", "b", "note down outside replay, ignored");

  }

}

/** Handle a mouseDown event given that state.depressed is a note button and power is on) */
export function handleUpFromNote(state: State): void {

  eventLog("Up", undefined, "from note, stops sound ");
  state.depressed = null;
  stopPlayingSound(state.audio);

}

