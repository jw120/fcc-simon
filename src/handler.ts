import { redrawButton } from "./board";
import { startPlayingSound, stopPlayingSound } from "./sound";
import { State, CanvasButton, buttonToNote } from "./state";
import { resetTune, extendTune, playTune } from "./tune";
import { dist } from "./utils";
import {
  blackStripeWidth, centralButtonRadius,
  outerBorderInsideRadius, innerBorderOutsideRadius, innerBorderInsideRadius
} from "./boardDimensions";

/** Should we log events to console.log */
const eventLogging: boolean = true;

/** Helper function to generates a callback function to handle clicks on our canvas */
export function makeCanvasClickHandler(state: State): ((e: MouseEvent) => void) {

  return (event: MouseEvent) => {

    let clicked: CanvasButton | null = findCanvasButton(scaledCoords(state, event.pageX, event.pageY));

    switch (clicked) {
      case "PowerButton":
        eventLog("Click", clicked, "redrew");
        state.power = !state.power;
        redrawButton(state, "PowerButton");
        redrawButton(state, "StrictButton");
        if (!state.power) {
          state.depressed = null;
          stopPlayingSound(state.audio);
        }
        break;
      case "StrictButton":
        eventLog("Click", clicked, "redrew");
        state.strict = !state.strict;
        redrawButton(state, "StrictButton");
        break;
      case "StartButton":
        eventLog("Click", clicked, "starting tune");
        resetTune(state);
        extendTune(state);
        extendTune(state);
        extendTune(state);
        playTune(state, 0);
        redrawButton(state, "StrictButton");
        break;
      default:
        eventLog("Click", clicked, "ignored");
    }

  };

}

/** Helper function to generates a callback function to handle mouse down events on our canvas */
export function makeCanvasMouseDownHandler(state: State): ((e: MouseEvent) => void) {

  return (event: MouseEvent) => {

    let oldDepressed: CanvasButton | null = state.depressed;

    let down: CanvasButton | null = findCanvasButton(scaledCoords(state, event.pageX, event.pageY));

    if (down) {
      switch (down) {
        case "RedButton":
        case "YellowButton":
        case "BlueButton":
        case "GreenButton":
          state.depressed = down;
          eventLog("Down", down, "redrew as depressed");
          redrawButton(state, down);
          startPlayingSound(state.audio, buttonToNote(down));
          break;
        default:
          eventLog("Down", down, "ignored");
          // do nothing
      }
    }

    if (oldDepressed && oldDepressed !== down) {
      eventLog("Down", down, "redrew old depressed " + oldDepressed);
      redrawButton(state, oldDepressed);
    }

  };

}

/** Helper function to generates a callback function to handle mouse down events on our canvas */
export function makeCanvasMouseUpHandler(state: State): ((e: MouseEvent) => void) {

  return (event: MouseEvent) => {

    if (state.depressed) {
      let oldDepressed: CanvasButton = state.depressed;
      eventLog("Up", undefined, "triggered redraw of old depressed " + oldDepressed);
      state.depressed = null;
      redrawButton(state, oldDepressed);
    } else {
      eventLog("Up", undefined, "ignored");
    }
    stopPlayingSound(state.audio);


  };

}


/** Helper function to turn cliks in our normalized coordinates to buttons  */
function findCanvasButton(coords: [number, number]): CanvasButton | null {

  let x: number = coords[0];
  let y: number = coords[1];

  let r: number = Math.sqrt(x * x + y * y);

  if (r > innerBorderOutsideRadius && r < outerBorderInsideRadius) {

    if (Math.abs(x) > blackStripeWidth / 2 && Math.abs(y) > blackStripeWidth / 2) {

      let theta: number = Math.atan2(y, x);
      if (theta > Math.PI / 2 ) {
        return "YellowButton";
      } else if (theta > 0) {
        return "BlueButton";
      } else if (theta < - Math.PI / 2) {
        return "GreenButton";
      } else {
        return "RedButton";
      }
    }
  }

  if (r < innerBorderInsideRadius) {

    if (dist(x, y, - 0.5 * innerBorderInsideRadius, innerBorderInsideRadius * 0.3) < centralButtonRadius) {
      return "PowerButton";
    }
    if (dist(x, y, 0 * innerBorderInsideRadius, innerBorderInsideRadius * 0.3) < centralButtonRadius) {
      return "StartButton";
    }
    if (dist(x, y, + 0.5 * innerBorderInsideRadius, innerBorderInsideRadius * 0.3) < centralButtonRadius) {
      return "StrictButton";
    }

  }

  return null;

}


/** Helper function to return scaled coordinates */
function scaledCoords(state: State, pageX: number, pageY: number): [number, number] {

  // Pixel coordinates of click relative to canvas
  let pixelX: number = pageX - state.canvas.offsetLeft;
  let pixelY: number = pageY - state.canvas.offsetTop;

  // Coordinates on our -100..100 system
  let x: number = (pixelX - state.canvas.width / 2) / state.scale;
  let y: number = (pixelY - state.canvas.height / 2) / state.scale;

  // console.log("Window innerSize", window.innerWidth, window.innerHeight);
  // console.log("Canvas", state.canvas.width, state.canvas.height);
  // console.log("Click at", pixelX, pixelY, "or", x, y);

  return [x, y];

}

/** Helper function to log click event and how we handle it to console */
function eventLog(triggerName: string | undefined | null, target: string | undefined | null, action: string): void {

  if (eventLogging) {
    console.log(padTo(triggerName, 6), padTo(target, 12), ":", action);
  }

}

/** Right-pad the string with spaces to reach the given length */
function padTo(s: string | undefined | null, n: number): string {

  if (s === null) {
    s = "null";
  } else if (s === undefined) {
    s = "undefined";
  }

  let pad: number = n - s.length;
  return pad > 0 ? s + "                ".substr(0, pad) : s;

}
