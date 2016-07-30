/*
 * Provides event handlers and handle top-level common parts of event logic (filter for power on and do redraws of
 * any previously depressed buttons)
 *
 */

import { redrawButton } from "./board";
import { State, CanvasButton } from "./state";
import { dist, eventLog } from "./utils";
import {
  handlePowerClick, handleStrictClick, handleStartClick, handleNoteDown, handleUpFromNote
} from "./handlers";

import {
  blackStripeWidth, centralButtonRadius,
  outerBorderInsideRadius, innerBorderOutsideRadius, innerBorderInsideRadius
} from "./boardDimensions";

/** Return a callback function to handle clicks on our canvas */
export function makeCanvasClickHandler(state: State): ((e: MouseEvent) => void) {

  return (event: MouseEvent) => {

    let clicked: CanvasButton | null = findCanvasButton(scaledCoords(state, event.pageX, event.pageY));

    // log("Click at", event.pageX, event.pageY, ":", clicked);

    if (state.power) {

      switch (clicked) {
        case "PowerButton":
          handlePowerClick(state);
          break;
        case "StrictButton":
            handleStrictClick(state);
          break;
        case "StartButton":
          handleStartClick(state);
          break;
        default:
          eventLog("Click", clicked, "ignored");
      }

    } else {

      if (clicked === "PowerButton") {

        handlePowerClick(state);

      } else {

        eventLog("Click", clicked, "ignored as power off");

      }

    }

    clearDepressed(state, clicked);

  };

}

/** Return a callback function to handle mouse down events on our canvas */
export function makeCanvasMouseDownHandler(state: State): ((e: MouseEvent) => void) {

  return (event: MouseEvent) => {

    if (state.power) {

      let down: CanvasButton | null = findCanvasButton(scaledCoords(state, event.pageX, event.pageY));

      if (down) {
        switch (down) {
          case "RedButton":
          case "YellowButton":
          case "BlueButton":
          case "GreenButton":
            handleNoteDown(state, down);
            break;
          default:
            eventLog("Down", down, "ignored");
            // do nothing
        }
      }

      clearDepressed(state, down);

    }

  };

}

/** Return a callback function to handle mouse down events on our canvas */
export function makeCanvasMouseUpHandler(state: State): ((e: MouseEvent) => void) {

  return (event: MouseEvent) => {

    if (state.power) {

      switch (state.depressed) {
        case "RedButton":
        case "YellowButton":
        case "BlueButton":
        case "GreenButton":
          handleUpFromNote(state);
          break;
        default:
          eventLog("Up", "", "ignored");
            // do nothing
      }

      clearDepressed(state, null);

    }

  };

}

/** Helper function to turn cliks in our normalized coordinates to buttons  */
function findCanvasButton(coords: [number, number]): CanvasButton | null {

  // log("Find called with", coords);

  let x: number = coords[0];
  let y: number = coords[1];

  let r: number = Math.sqrt(x * x + y * y);

  // // log("finding", x.toFixed(2), ",", y.toFixed(2), ", r=", r.toFixed(2));

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

  // log("Scaling with", state.canvas.offsetLeft, state.canvas.height, state.scale);

  // Pixel coordinates of click relative to canvas
  let pixelX: number = pageX - state.canvas.offsetLeft;
  let pixelY: number = pageY - state.canvas.offsetTop;

  // Coordinates on our -100..100 system
  let x: number = (pixelX - state.canvas.width / 2) / state.scale;
  let y: number = (pixelY - state.canvas.height / 2) / state.scale;

  return [x, y];

}


/** Helper function to handle an old depressed button, does nothing if old depressed button is the same as the one as the given button */
function clearDepressed(state: State, newButton: CanvasButton | null): void {

    let oldDepressed: CanvasButton | null = state.depressed;
    if (oldDepressed && oldDepressed !== newButton) {
      // log("redrew old depressed", oldDepressed);
      redrawButton(state, oldDepressed);
    }

}
