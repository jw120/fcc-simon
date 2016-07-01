/*
 * Specific event handlers for mouse interactions on our buttons
 *
 */

import { redrawButton } from "./board";
import { startPlayingSound, stopPlayingSound } from "./sound";
import { State, CanvasButton, buttonToNote } from "./state";
import { resetTune, extendTune, playTune } from "./tune";
import { eventLog } from "./utils";

/** Handle a click on the power button */
export function handlePowerClick(state: State): void {

  // TODO Full reset of state ? Stop any sound?

  eventLog("Click", "PowerButton", "redrew");

  state.power = !state.power;
  redrawButton(state, "PowerButton");
  redrawButton(state, "StrictButton");
  if (!state.power) {
    state.depressed = null;
    stopPlayingSound(state.audio);
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

