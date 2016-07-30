/*
 * Manage playing the tune for the player to follow
 *
 */

import { Note, State, noteToButton } from "./state";
import { startPlayingSound } from "./sound";
import { redrawButton } from "./board";
import { tuneNoteDuration, tuneGapDuration } from "./boardDimensions";
import { stepLog } from "./utils";


/** Reset the current tune (e.g., after pressing Start button) */
export function resetTune(state: State): void {

  state.tune = [];

}

export function extendTune(state: State): void {

 state.tune.push(randomNote());
 state.score = state.tune.length;

}

export function playTune(state: State, i: number): void {

  stepLog("Play" + i, "starting");


  if (i < state.tune.length) {

    let nextNote: Note = state.tune[i];

    state.playing = nextNote;
    state.notesMatched = null;
    redrawButton(state, noteToButton(nextNote));

    startPlayingSound(state.audio, nextNote, tuneNoteDuration, () => {

      state.playing = null;
      redrawButton(state, noteToButton(nextNote));

      setTimeout(() => playTune(state, i + 1), i < state.tune.length - 1 ? tuneGapDuration : 0);

    });

  } else {

    stepLog("Play", "finished, notesMatched to zero");
    state.notesMatched = 0;

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
