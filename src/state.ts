import { AudioState, newAudioState } from "./sound";
import { getContext2D } from "./utils";


export type CanvasButton =
  "BlueButton" | "YellowButton" | "GreenButton" | "RedButton" | "StartButton" | "StrictButton" | "PowerButton";


/** Define the global state that will be shared between modules */
export interface State {

  // Graphics
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  scale: number | undefined;
  depressed: CanvasButton | null;

  // Sound
  audio: AudioState;

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
    depressed: null,
    power: false,
    strict: false
  };

}
