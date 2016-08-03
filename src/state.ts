/*
 * Define the games shared state and related initialization, types and conversions
 *
 */

import constants from "./constants";
import { AudioState, newAudioState } from "./sound";
import { assertNever, getContext2D } from "./utils";

/** Buttons on the Simon board */
export type CanvasButton =
  "BlueButton" | "YellowButton" | "GreenButton" | "RedButton" | "StartButton" | "StrictButton" | "PowerButton";

/** Notes that can be played and be part of tunes */
export type Note =
  "BlueNote" | "GreenNote" | "YellowNote" | "RedNote";

/** Values that can be sent for display on the scoreboard */
export type Score =
  number | "Blank" | "Dashes" | "Plings" | "Win";

/** Global state that will be shared between modules */
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

  // Game logic
  tune: Note[]; //
  notesMatched: number | null; // gives number of next note in tune expected, or null if not expecting notes
  id: number; // Incremented each time a new tune starts

  // Switches
  power: boolean;
  strict: boolean;

}

/** Create a new initial state or reset the given state (e.g. at start or power off )*/
export function resetState(oldState?: State): State {

  let newCanvas: HTMLCanvasElement = (oldState && oldState.canvas) || document.getElementById("board") as HTMLCanvasElement;

  let newState: State = {
    canvas: newCanvas,
    context: (oldState && oldState.context) || getContext2D(newCanvas),
    scale: undefined,
    depressed: null,
    playing: null,
    score: "Blank",

    audio: (oldState && oldState.audio) || newAudioState(),

    tune: [],
    notesMatched: null,
    id: (oldState && oldState.id) ? oldState.id++ : 0,

    power: false,
    strict: false
  };

  updateScale(newState);

  return newState;

}

/** Modify state to reflect canvas and window size */
export function updateScale(state: State): void {

  // We set the canvas to fill most of the available window
  state.canvas.width = window.innerWidth - constants.window.widthReserved;
  state.canvas.height = window.innerHeight - constants.window.heightReserved;

  // We transform the canvas so a square with coordinates (-100, -100) to (100, 100)
  // appears as the largest centred squate that will fit on the canvas
  state.scale = Math.min(state.canvas.width, state.canvas.height) / (2 * constants.boardDimensions.canvasSize);
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
    case "StartButton":
    case "PowerButton":
    case "StrictButton":
      throw Error("Bad button type in buttonToNote:" + b);
    default:
      assertNever(b); // TS Compiler will throw an error if above cases are not exhaustive
      throw Error("Unknown button in buttonToNote:" + b);
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
      assertNever(n); // TS Compiler will throw an error if above cases are not exhaustive
      throw Error("Bad note in noteToButton:" + n);
  }

}
