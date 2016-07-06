/*
 * Manage playing the tune for the player to follow
 *
 */

import { Note, State, noteToButton } from "./state";
import { startPlayingSound } from "./sound";
import { redrawButton } from "./board"

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

  let oldPlaying: Note | null = state.playing;
  state.playing = null;

  if (oldPlaying) {
    redrawButton(state, noteToButton(oldPlaying));
  }

  if (i < state.tune.length) {

    let nextNote: Note = state.tune[i];

    startPlayingSound(state.audio, nextNote, tuneNoteDuration, () => playTune(state, i + 1));
    state.playing = nextNote;
    redrawButton(state, noteToButton(nextNote));

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
