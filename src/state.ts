
import { getContext2D } from "./utils";


export type canvasButton =
  "BlueButton" | "YellowButton" | "GreenButton" | "RedButton" | "StartButton" | "StrictButton" | "PowerButton";


/** Define the global state that will be shared between modules */
export interface State {

  // Graphics
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  scale: number | undefined;
  depressed: canvasButton | null;

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
    depressed: null,
    power: false,
    strict: false
  };

}
