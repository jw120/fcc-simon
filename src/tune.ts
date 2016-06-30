/* Handle logic for playing the tune for the player to follow */

/*

Press start button
  Call resetTune()
    tune <- []
    currentNote = undefined;
  Call extendTune()
    tune <- tune ++ R1
    Call playNote(0);
      startNote R0
      onEnd of play(call playNote(1));

*/


import { Note, State } from "./state";
import { startPlayingSound } from "./sound";

/** Duration of each note when we play the tune (in seconds) */
const tuneNoteDuration: number = 1;

/** Reset the current tune (e.g., after pressing Start button) */
export function resetTune(state: State): void {

  state.tune = [];

}

export function extendTune(state: State): void {

  state.tune.push(randomNote());

}

export function playTune(state: State, i: number): void {

  if (i < state.tune.length) {
    startPlayingSound(state.audio, state.tune[i], tuneNoteDuration, () => playTune(state, i + 1));
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
