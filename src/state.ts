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
  number | "Blank" | "Dashes" | "Plings";

/** Define the global state that will be shared between modules */
export interface State {

  // Graphics
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  scale: number | undefined;
  depressed: CanvasButton | null;
  playing: Note | null;
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
  state.playing = null;
  state.score = "Blank";

  state.audio = state.audio || newAudioState();

  state.tune = [];
  state.notesMatched = null;

  state.power = false;
  state.strict = false;

  updateScale(state);

  return state;

}

/** Modify state to reflect canvas and window size */
export function updateScale(state: State): void {

  // We set the canvas to fill most of the available window
  state.canvas.width = window.innerWidth - 20;
  state.canvas.height = window.innerHeight - 100; // Allow space for footer

  // We transform the canvas so a square with coordinates (-100, -100) to (100, 100)
  // appears as the largest centred squate that will fit on the canvas
  const canvasMax: number = 100;
  state.scale = Math.min(state.canvas.width, state.canvas.height) / (2 * canvasMax);
  state.context.transform(state.scale, 0, 0, state.scale, state.canvas.width / 2, state.canvas.height / 2);

}


/** Helper function to convert between Buttons and Notes */
export function buttonToNote(b: CanvasButton): Note {

  switch (b) {
    case "BlueButton":
      return "BlueNote";
    case "YellowButton":
      return "YellowNote";
    case "GreenButton":
      return "GreenNote";
    case "RedButton":
      return "RedNote";
    default:
      throw Error("Bad button in buttonToNote:" + b);
  }

}

/** Helper function to convert between Notes and Buttons */
export function noteToButton(n: Note): CanvasButton {

  switch (n) {
    case "BlueNote":
      return "BlueButton";
    case "YellowNote":
      return "YellowButton";
    case "GreenNote":
      return "GreenButton";
    case "RedNote":
      return "RedButton";
    default:
      throw Error("Bad note in noteToButton:" + n);
  }

}
