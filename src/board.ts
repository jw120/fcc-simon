/** Draw the board and decode clicks on the board */

import { centredFilledRectangle, centredFilledCircle, outlinedFilledCircle, drawNoteButton, centredText } from "./canvas";
import { State, canvasButton } from "./state";
import {
  blackStripeWidth, centralButtonRadius,
  outerBorderOutsideRadius, outerBorderInsideRadius,
  innerBorderOutsideRadius, innerBorderInsideRadius
} from "./boardDimensions";

const centralBackgroundColour: string = "silver";

// Alpha values to fill notes
const normalNoteAlpha: number = 0.75;
const brightNoteAlpha: number = 1;

// Alpha values for switches
const offSwitchAlpha: number = 0.25;
const onSwitchAlpha: number = 1;

/** Draw the Simon board on the canvas */
export function drawBoard(state: State): void {

  // Draw the borders
  centredFilledCircle(state.context, outerBorderOutsideRadius, "black");
  centredFilledRectangle(state.context, blackStripeWidth, outerBorderOutsideRadius + outerBorderInsideRadius, "black");
  centredFilledRectangle(state.context, outerBorderOutsideRadius + outerBorderInsideRadius, blackStripeWidth, "black");
  centredFilledCircle(state.context, innerBorderOutsideRadius, "black");
  centredFilledCircle(state.context,  innerBorderInsideRadius, centralBackgroundColour);

  // Draw control buttons
  drawButton(state, "StartButton");
  drawButton(state, "PowerButton");
  drawButton(state, "StrictButton");

  // Draw the note buttons
  drawButton(state, "BlueButton");
  drawButton(state, "YellowButton");
  drawButton(state, "GreenButton");
  drawButton(state, "RedButton");

  // Add the score
  centredText(state.context, 0, - 0.3 * innerBorderInsideRadius, "0", "20px sans-serif");

}

/** Helper function to (re)draw a button */
export function drawButton(state: State, b: canvasButton): void {

  switch (b) {

    case "BlueButton":
      drawNoteButton(
        state.context, 0,
        innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2,
        "black", 1);
      drawNoteButton(
        state.context, 0,
        innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2,
        "blue", state.depressed === b ? brightNoteAlpha : normalNoteAlpha);
      break;

    case "YellowButton":
      drawNoteButton(
        state.context, 1,
        innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2,
        "black", 1);
      drawNoteButton(
        state.context, 1,
        innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2,
        "yellow", state.depressed === b ? brightNoteAlpha : normalNoteAlpha);
      break;

    case "GreenButton":
      drawNoteButton(
        state.context, 2,
        innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2,
        "black", 1);
      drawNoteButton(
        state.context, 2,
        innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2,
        "green", state.depressed === b ? brightNoteAlpha : normalNoteAlpha);
      break;

    case "RedButton":
      drawNoteButton(
        state.context, 3,
        innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2,
        "black", 1);
      drawNoteButton(
        state.context, 3,
        innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2,
        "red", state.depressed === b ? brightNoteAlpha : normalNoteAlpha);
      break;

    case "PowerButton":
      outlinedFilledCircle(
        state.context,
        - 0.5 * innerBorderInsideRadius, innerBorderInsideRadius * 0.3,  centralButtonRadius,
        centralBackgroundColour, 1);
      outlinedFilledCircle(
        state.context,
        - 0.5 * innerBorderInsideRadius, innerBorderInsideRadius * 0.3,  centralButtonRadius,
        "green", state.power ? onSwitchAlpha : offSwitchAlpha);
      centredText(
        state.context,
        - 0.5 * innerBorderInsideRadius, innerBorderInsideRadius * 0.59,
        "POWER", "3px sans-serif");
      break;

    case "StartButton":
      outlinedFilledCircle(
        state.context,
        0 * innerBorderInsideRadius, innerBorderInsideRadius * 0.3,  centralButtonRadius,
        centralBackgroundColour, 1);
      outlinedFilledCircle(
        state.context,
        0 * innerBorderInsideRadius, innerBorderInsideRadius * 0.3,  centralButtonRadius,
        "red", offSwitchAlpha);
      centredText(
        state.context,
        0 * innerBorderInsideRadius, innerBorderInsideRadius * 0.59,
        "START", "3px sans-serif");
      break;

    case "StrictButton":
      outlinedFilledCircle(
        state.context,
        + 0.5 * innerBorderInsideRadius, innerBorderInsideRadius * 0.3,  centralButtonRadius,
        centralBackgroundColour, 1);
      outlinedFilledCircle(
        state.context,
        + 0.5  * innerBorderInsideRadius, innerBorderInsideRadius * 0.3,  centralButtonRadius,
        "yellow", state.strict ? onSwitchAlpha : offSwitchAlpha);
      centredText(
        state.context,
        + 0.5 * innerBorderInsideRadius, innerBorderInsideRadius * 0.59,
        "STRICT", "3px sans-serif");
      break;

    default:
      throw Error("Unknown button type in drawButton: " + b);

  }

}



