/*
 * Manage playing the tune for the player to follow
 *
 */

import { redrawButton } from "./board";
import constants from "./constants";
import { setReplayTimeout } from "./replay-timeout";
import { startPlayingSound } from "./sound";
import { Note, State, noteToButton } from "./state";
import { stepLog, timeout } from "./utils";

/** Reset the current tune (e.g., after pressing Start button) */
export function resetTune(state: State): void {

  state.tune = [];

}

/** Add a random note to the tune */
export function extendTune(state: State): void {

 state.tune.push(randomNote());
 state.score = state.tune.length;

}

/** Play the tunye starting from the given note (calls itself recursively to iterate over the whole tune) */
export function playTune(state: State, i: number): void {

  stepLog("Play" + i, "starting");

  // Incremenent id whenever we start playing a new tune
  if (i === 0) {
    state.id = state.id + 1;
  }

  if (i < state.tune.length) { // if we still have notes to play

    let nextNote: Note = state.tune[i];

    state.playing = nextNote;
    state.notesMatched = null;
    redrawButton(state, noteToButton(nextNote));

    startPlayingSound(state.audio, nextNote, constants.durations.tuneNote, () => {

      state.playing = null;
      redrawButton(state, noteToButton(nextNote));

      timeout(i < state.tune.length - 1 ? constants.durations.tuneGap : null, () => playTune(state, i + 1), );

    });

  } else { // tune finished

    stepLog("Play", "finished, notesMatched to zero");
    state.notesMatched = 0;
    setReplayTimeout(state);

  }


}

/** Helper function to return a random note */
function randomNote(): Note {

  switch (Math.floor(Math.random() * 4)) {
    case 0: return "BlueNote";
    case 1: return "YellowNote";
    case 2: return "GreenNote";
    case 3: return "RedNote";
    default: throw Error("Unknown note in randomNote");
  }

}
