/*
 * Draw the board
 *
 */

import { State, CanvasButton } from "./state";
import {
  fillCentredRectangle, fillCentredCircle, fillCentredCircleCleanAlpha,
  fillNoteButtonShapeCleanAlpha, centredText
} from "./canvas";
import {
  blackStripeWidth, centralButtonRadius, centralButtonRingRadius,
  outerBorderOutsideRadius, outerBorderInsideRadius,
  innerBorderOutsideRadius, innerBorderInsideRadius
} from "./boardDimensions";

const centralBackgroundColour: string = "silver";

// Alpha values to fill notes
const normalNoteAlpha: number = 0.75;
const brightNoteAlpha: number = 1;

// Alpha values for switches
const offSwitchAlpha: number = 0.5;
const onSwitchAlpha: number = 1;

/** Draw the Simon board on the canvas */
export function redrawBoard(state: State): void {

  // Draw the borders
  fillCentredCircle(state.context, 0, 0, outerBorderOutsideRadius, "black");
  fillCentredRectangle(state.context, 0, 0, blackStripeWidth, outerBorderOutsideRadius + outerBorderInsideRadius, "black");
  fillCentredRectangle(state.context, 0, 0, outerBorderOutsideRadius + outerBorderInsideRadius, blackStripeWidth, "black");
  fillCentredCircle(state.context, 0, 0, innerBorderOutsideRadius, "black");
  fillCentredCircle(state.context,  0, 0, innerBorderInsideRadius, centralBackgroundColour);

  // Draw the labels for the control buttons
  centredText(state.context, - 0.5 * innerBorderInsideRadius, innerBorderInsideRadius * 0.6, "POWER", "3px sans-serif");
  centredText(state.context,    0  * innerBorderInsideRadius, innerBorderInsideRadius * 0.6, "START", "3px sans-serif");
  centredText(state.context, + 0.5 * innerBorderInsideRadius, innerBorderInsideRadius * 0.6, "STRICT", "3px sans-serif");

  // Draw the rings around the control buttons
  fillCentredCircle(state.context, - 0.5 * innerBorderInsideRadius, innerBorderInsideRadius * 0.3,  centralButtonRingRadius, "black");
  fillCentredCircle(state.context,   0   * innerBorderInsideRadius, innerBorderInsideRadius * 0.3,  centralButtonRingRadius, "black");
  fillCentredCircle(state.context, + 0.5 * innerBorderInsideRadius, innerBorderInsideRadius * 0.3,  centralButtonRingRadius, "black");

  // Draw control buttons
  redrawButton(state, "StartButton");
  redrawButton(state, "PowerButton");
  redrawButton(state, "StrictButton");

  // Draw the note buttons
  redrawButton(state, "BlueButton");
  redrawButton(state, "YellowButton");
  redrawButton(state, "GreenButton");
  redrawButton(state, "RedButton");

  // Add the score
  redrawScore(state);

}

/** Redraw a button based on its current state */
export function redrawButton(state: State, b: CanvasButton): void {

  switch (b) {

    case "BlueButton":
    fillNoteButtonShapeCleanAlpha(
        state.context, 0,
        innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2,
        "black", "blue", state.depressed === b ? brightNoteAlpha : normalNoteAlpha);
      break;

    case "YellowButton":
    fillNoteButtonShapeCleanAlpha(
        state.context, 1,
        innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2,
        "black", "yellow", state.depressed === b ? brightNoteAlpha : normalNoteAlpha);
      break;

    case "GreenButton":
    fillNoteButtonShapeCleanAlpha(
        state.context, 2,
        innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2,
        "black", "green", state.depressed === b ? brightNoteAlpha : normalNoteAlpha);
      break;

    case "RedButton":
    fillNoteButtonShapeCleanAlpha(
        state.context, 3,
        innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2,
        "black", "red", state.depressed === b ? brightNoteAlpha : normalNoteAlpha);
      break;

    case "PowerButton":
      fillCentredCircleCleanAlpha(
        state.context,
        - 0.5 * innerBorderInsideRadius, innerBorderInsideRadius * 0.3,  centralButtonRadius,
        "black", "green", state.power ? onSwitchAlpha : offSwitchAlpha);
      break;

    case "StartButton":
      fillCentredCircleCleanAlpha(
        state.context,
        0 * innerBorderInsideRadius, innerBorderInsideRadius * 0.3,  centralButtonRadius,
        "black", "red", offSwitchAlpha);
      break;

    case "StrictButton":
      fillCentredCircleCleanAlpha(
        state.context,
        + 0.5  * innerBorderInsideRadius, innerBorderInsideRadius * 0.3,  centralButtonRadius,
        "black", "yellow", state.strict && state.power ? onSwitchAlpha : offSwitchAlpha);
      break;

    default:
      throw Error("Unknown button type in drawButton: " + b);

  }

}

export function redrawScore(state: State): void {

  let show: string;
  switch (state.score) {
    case "Blank":
      show = "";
      break;
    case "Dashes":
      show = "--";
      break;
    default:
      show = (state.score >= 0 && state.score <= 9) ? "0" + state.score : state.score.toString();
  }

  fillCentredRectangle(
    state.context,
    0, -0.3 * innerBorderInsideRadius, 1.4 * innerBorderInsideRadius, 0.7 * innerBorderInsideRadius,
    centralBackgroundColour);
  centredText(state.context, 0, - 0.3 * innerBorderInsideRadius, show, "20px sans-serif");

}

