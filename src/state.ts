/*
 * Define the games shared state and related initialization, types and conversions
 *
 */

import { AudioState, newAudioState } from "./sound";
import { getContext2D } from "./utils";

export type CanvasButton =
  "BlueButton" | "YellowButton" | "GreenButton" | "RedButton" | "StartButton" | "StrictButton" | "PowerButton";

export type Note =
  "BlueNote" | "GreenNote" | "YellowNote" | "RedNote";

export type Score =
  number | "Blank" | "Dashes";

/** Define the global state that will be shared between modules */
export interface State {

  // Graphics
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  scale: number | undefined;
  depressed: CanvasButton | null;
  score: Score; // To appear in the score window

  // Sound
  audio: AudioState;

  // Tune logic
  tune: Note[]; //
  notesMatched: number | null; // gives number of next note in tune expected, or null if not expecting notes

  // Switches
  power: boolean;
  strict: boolean;

}

/** Create a new initial state or reset the given state (e.g. at start or power off )*/
export function resetState(state?: State): State {

  state = state || {} as State;

  state.canvas = state.canvas || document.getElementById("board") as HTMLCanvasElement;
  state.context = state.context || getContext2D(state.canvas);
  state.scale = undefined;
  state.depressed = null;
  state.score = "Blank";

  state.audio = state.audio || newAudioState();

  state.tune = [];
  state.notesMatched = null;

  state.power = false;
  state.strict = false;

  return state;

}

/** Helper function to convert between Buttons and Notes */
export function buttonToNote(b: CanvasButton): Note {

  switch (b) {
    case "BlueButton":
      return "BlueNote";
    case "YellowButton":
      return "GreenNote";
    case "GreenButton":
      return "YellowNote";
    case "RedButton":
      return "RedNote";
    default:
      throw Error("Bad button in buttonToNote:" + b);
  }

}
