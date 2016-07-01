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

/** Define the global state that will be shared between modules */
export interface State {

  // Graphics
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  scale: number | undefined;
  depressed: CanvasButton | null;

  // Sound
  audio: AudioState;

  // Tune logic
  tune: Note[]; //
  notesMatched: number | null; // gives number of next note in tune expected, or null if not expecting notes

  // Switches
  power: boolean;
  strict: boolean;

}

/** Set up the initial state */
export function initialState(): State {

  let canvas: HTMLCanvasElement = document.getElementById("board") as HTMLCanvasElement;

  return {
    canvas,
    context: getContext2D(canvas),
    scale: undefined,
    audio: newAudioState(),
    tune: [],
    notesMatched: null,
    depressed: null,
    power: false,
    strict: false
  };

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
