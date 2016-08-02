/*
 * Draw the board
 *
 */

import { State, CanvasButton, buttonToNote } from "./state";
import {
  fillCentredRectangle, fillCentredCircle, fillCentredCircleCleanAlpha,
  fillNoteButtonShapeCleanAlpha, centredText
} from "./canvas";

import constants, { BoardDimensions } from "./constants";
const dim: BoardDimensions = constants.boardDimensions;

/** Draw the Simon board on the canvas */
export function redrawBoard(state: State): void {

  // Draw the borders
  fillCentredCircle(state.context,
    0, 0, dim.outerBorderOutsideRadius, constants.colours.stripe);
  fillCentredRectangle(state.context,
    0, 0, dim.stripeWidth, dim.outerBorderOutsideRadius + dim.outerBorderInsideRadius, constants.colours.stripe);
  fillCentredRectangle(state.context,
    0, 0, dim.outerBorderOutsideRadius + dim.outerBorderInsideRadius, dim.stripeWidth, constants.colours.stripe);
  fillCentredCircle(state.context,
    0, 0, dim.innerBorderOutsideRadius, constants.colours.stripe);
  fillCentredCircle(state.context,
    0, 0, dim.innerBorderInsideRadius, constants.colours.centralBackground);

  // Draw the labels for the control buttons
  centredText(state.context,
    - 0.5 * dim.innerBorderInsideRadius, dim.innerBorderInsideRadius * 0.6, "POWER", constants.fonts.buttonLabels);
  centredText(state.context,
       0  * dim.innerBorderInsideRadius, dim.innerBorderInsideRadius * 0.6, "START", constants.fonts.buttonLabels);
  centredText(state.context,
    + 0.5 * dim.innerBorderInsideRadius, dim.innerBorderInsideRadius * 0.6, "STRICT", constants.fonts.buttonLabels);

  // Draw the rings around the control buttons
  fillCentredCircle(state.context,
    - 0.5 * dim.innerBorderInsideRadius, dim.innerBorderInsideRadius * 0.3,  dim.centralButtonRingRadius, constants.colours.buttonRing);
  fillCentredCircle(state.context,
      0   * dim.innerBorderInsideRadius, dim.innerBorderInsideRadius * 0.3,  dim.centralButtonRingRadius, constants.colours.buttonRing);
  fillCentredCircle(state.context,
    + 0.5 * dim.innerBorderInsideRadius, dim.innerBorderInsideRadius * 0.3,  dim.centralButtonRingRadius, constants.colours.buttonRing);

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
        dim.innerBorderOutsideRadius, dim.outerBorderInsideRadius, dim.stripeWidth / 2,
        constants.colours.stripe, constants.colours.blueNote,
        state.depressed === b || state.playing === buttonToNote(b) ? constants.alphas.brightNote : constants.alphas.normalNote);
      break;

    case "YellowButton":
    fillNoteButtonShapeCleanAlpha(
        state.context, 1,
        dim.innerBorderOutsideRadius, dim.outerBorderInsideRadius, dim.stripeWidth / 2,
        constants.colours.stripe, constants.colours.yellowNote,
        state.depressed === b || state.playing === buttonToNote(b) ? constants.alphas.brightNote : constants.alphas.normalNote);
      break;

    case "GreenButton":
    fillNoteButtonShapeCleanAlpha(
        state.context, 2,
        dim.innerBorderOutsideRadius, dim.outerBorderInsideRadius, dim.stripeWidth / 2,
        constants.colours.stripe, constants.colours.greenNote,
        state.depressed === b || state.playing === buttonToNote(b) ? constants.alphas.brightNote : constants.alphas.normalNote);
      break;

    case "RedButton":
    fillNoteButtonShapeCleanAlpha(
        state.context, 3,
        dim.innerBorderOutsideRadius, dim.outerBorderInsideRadius, dim.stripeWidth / 2,
        constants.colours.stripe, constants.colours.redNote,
        state.depressed === b || state.playing === buttonToNote(b) ? constants.alphas.brightNote : constants.alphas.normalNote);
      break;

    case "PowerButton":
      fillCentredCircleCleanAlpha(
        state.context,
        - 0.5 * dim.innerBorderInsideRadius, dim.innerBorderInsideRadius * 0.3,  dim.centralButtonRadius,
        constants.colours.buttonRing, constants.colours.powerButton,
        state.power ? constants.alphas.onSwitch : constants.alphas.offSwitch);
      break;

    case "StartButton":
      fillCentredCircleCleanAlpha(
        state.context,
        0 * dim.innerBorderInsideRadius, dim.innerBorderInsideRadius * 0.3,  dim.centralButtonRadius,
        constants.colours.buttonRing, constants.colours.startButton,
        constants.alphas.offSwitch);
      break;

    case "StrictButton":
      fillCentredCircleCleanAlpha(
        state.context,
        + 0.5  * dim.innerBorderInsideRadius, dim.innerBorderInsideRadius * 0.3,  dim.centralButtonRadius,
        constants.colours.buttonRing, constants.colours.strictButton,
        state.strict && state.power ? constants.alphas.onSwitch : constants.alphas.offSwitch);
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
    case "Plings":
      show = "!!";
      break;
    default:
      show = (state.score >= 0 && state.score <= 9) ? "0" + state.score : state.score.toString();
  }

  fillCentredRectangle(
    state.context,
    0, -0.3 * dim.innerBorderInsideRadius, 1.4 * dim.innerBorderInsideRadius, 0.7 * dim.innerBorderInsideRadius,
    constants.colours.centralBackground);
  centredText(state.context, 0, - 0.3 * dim.innerBorderInsideRadius, show, constants.fonts.score);

}

