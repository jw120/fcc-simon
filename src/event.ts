/*
 * Provides event handlers for top-level event logic (detect which button, filter for power on and do redraws of
 * any previously depressed buttons etc). Actual handling of valid events passed to functions from handlers.ts
 *
 */

import { redrawButton } from "./board";
import constants, { BoardDimensions } from "./constants";
import { handlePowerClick, handleStrictClick, handleStartClick, handleNoteDown, handleUpFromNote } from "./handlers";
import { State, CanvasButton } from "./state";
import { assertNever, dist, eventLog } from "./utils";

/** Shortcut to constants.boardDimensions to reduce verbosity */
const dim: BoardDimensions = constants.boardDimensions;

/** Callback function that handles clicks on the canvas */
export function canvasClickHandler(state: State, event: MouseEvent): void {

  let clicked: CanvasButton | null = findCanvasButton(scaledCoords(state, event.pageX, event.pageY));

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

      // Clicks on note buttons are ignored (we instead handle mouse up/down)
      case "BlueButton":
      case "RedButton":
      case "YellowButton":
      case "GreenButton":
        eventLog("Click", clicked, "ignored click on note button");
        break;

      case null:
        eventLog("Click", clicked, "ignored null click");
        break;
      default:
        assertNever(clicked); // TS Compiler will throw an error if above cases are not exhaustive
    }

  } else { // power is off

    if (clicked === "PowerButton") {

      handlePowerClick(state);

    } else {

      eventLog("Click", clicked, "ignored as power off");

    }

  }

  clearDepressed(state, clicked); // if we have a stray note lit up, unlight it

}

/** Callback function to handle mouse down events on our canvas */
export function canvasMouseDownHandler(state: State, event: MouseEvent): void {

  if (state.power) { // ignore all mouse downs if power is off

    let down: CanvasButton | null = findCanvasButton(scaledCoords(state, event.pageX, event.pageY));

    switch (down) {
      case "RedButton":
      case "YellowButton":
      case "BlueButton":
      case "GreenButton":
        handleNoteDown(state, down);
        break;
      case "StartButton":
      case "StrictButton":
      case "PowerButton":
      case null:
        eventLog("Down", down, "ignored down on control/null button");
        clearDepressed(state, down); // if we have a stray note lit up, unlight it
        break;
      default:
        assertNever(down); // Compiler will throw a type error if cases are not exhaustive
    }

  }

}

/** Return a callback function to handle mouseup and mouseout events on our canvas */
export function canvasMouseUpOrOutHandler(state: State, event: MouseEvent): void {

    if (state.power) {  // ignore all mouse ups if power is off

      switch (state.depressed) {
        case "RedButton":
        case "YellowButton":
        case "BlueButton":
        case "GreenButton":
          handleUpFromNote(state);
          break;

        case "StartButton":
        case "StrictButton":
        case "PowerButton":
        case null:
          eventLog("Up", "", "ignored from " + state.depressed);
          break;
        default:
          assertNever(state.depressed); // Compiler will throw a type error if cases are not exhaustive
      }

    }

}

/** Helper function to turn clicks in our normalized coordinates to buttons  */
function findCanvasButton(coords: [number, number]): CanvasButton | null {

  let x: number = coords[0];
  let y: number = coords[1];
  let r: number = Math.sqrt(x * x + y * y);

  if (r > dim.innerBorderOutsideRadius && r < dim.outerBorderInsideRadius) {

    if (Math.abs(x) > dim.stripeWidth / 2 && Math.abs(y) > dim.stripeWidth / 2) {

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

  if (r < dim.innerBorderInsideRadius) {

    if (dist(x, y, - 0.5 * dim.innerBorderInsideRadius, dim.innerBorderInsideRadius * 0.3) < dim.centralButtonRadius) {
      return "PowerButton";
    }
    if (dist(x, y, 0 * dim.innerBorderInsideRadius, dim.innerBorderInsideRadius * 0.3) < dim.centralButtonRadius) {
      return "StartButton";
    }
    if (dist(x, y, + 0.5 * dim.innerBorderInsideRadius, dim.innerBorderInsideRadius * 0.3) < dim.centralButtonRadius) {
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

  return [x, y];

}


/** Helper function to handle an old depressed button, does nothing if old depressed button is the same as the one as the given button */
function clearDepressed(state: State, newButton: CanvasButton | null): void {

    let oldDepressed: CanvasButton | null = state.depressed;
    if (oldDepressed && oldDepressed !== newButton) {
      redrawButton(state, oldDepressed);
    }

}
