/*
 * Functions to (re)draw the board and the score
 *
 */

import { fillCentredRectangle, fillCentredCircle, fillCentredCircleCleanAlpha, fillNoteButtonShapeCleanAlpha, centredText } from "./canvas";
import constants, { BoardDimensions, Colours } from "./constants";
import { State, CanvasButton, buttonToNote } from "./state";
import { assertNever } from "./utils";

/** Shortcut to constants.boardDimensions to reduce verbosity */
const dim: BoardDimensions = constants.boardDimensions;

/** Shortcut to constants.colours to reduce verbosity */
const col: Colours = constants.colours;

/** Draw the Simon board on the canvas */
export function redrawBoard(state: State): void {

  // Draw the borders
  fillCentredCircle(state.context, 0, 0, dim.outerBorderOutsideRadius, col.stripe);
  fillCentredRectangle(state.context, 0, 0, dim.stripeWidth, dim.outerBorderOutsideRadius + dim.outerBorderInsideRadius, col.stripe);
  fillCentredRectangle(state.context, 0, 0, dim.outerBorderOutsideRadius + dim.outerBorderInsideRadius, dim.stripeWidth, col.stripe);
  fillCentredCircle(state.context, 0, 0, dim.innerBorderOutsideRadius, col.stripe);
  fillCentredCircle(state.context, 0, 0, dim.innerBorderInsideRadius, col.centralBackground);

  // Draw the labels for the control buttons
  centredText(state.context, - 0.5 * dim.innerBorderInsideRadius, dim.innerBorderInsideRadius * 0.6, "POWER", constants.fonts.buttonLabels);
  centredText(state.context,    0  * dim.innerBorderInsideRadius, dim.innerBorderInsideRadius * 0.6, "START", constants.fonts.buttonLabels);
  centredText(state.context, + 0.5 * dim.innerBorderInsideRadius, dim.innerBorderInsideRadius * 0.6, "STRICT", constants.fonts.buttonLabels);

  // Draw the rings around the control buttons
  fillCentredCircle(state.context, - 0.5 * dim.innerBorderInsideRadius, dim.innerBorderInsideRadius * 0.3,  dim.centralButtonRingRadius, col.buttonRing);
  fillCentredCircle(state.context,    0   * dim.innerBorderInsideRadius, dim.innerBorderInsideRadius * 0.3,  dim.centralButtonRingRadius, col.buttonRing);
  fillCentredCircle(state.context, + 0.5 * dim.innerBorderInsideRadius, dim.innerBorderInsideRadius * 0.3,  dim.centralButtonRingRadius, col.buttonRing);

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
        state.context, 0, dim.innerBorderOutsideRadius, dim.outerBorderInsideRadius, dim.stripeWidth / 2,
        col.stripe, col.blueNote,
        state.depressed === b || state.playing === buttonToNote(b) ? constants.alphas.brightNote : constants.alphas.normalNote);
      break;

    case "YellowButton":
    fillNoteButtonShapeCleanAlpha(
        state.context, 1, dim.innerBorderOutsideRadius, dim.outerBorderInsideRadius, dim.stripeWidth / 2,
        col.stripe, col.yellowNote,
        state.depressed === b || state.playing === buttonToNote(b) ? constants.alphas.brightNote : constants.alphas.normalNote);
      break;

    case "GreenButton":
    fillNoteButtonShapeCleanAlpha(
        state.context, 2, dim.innerBorderOutsideRadius, dim.outerBorderInsideRadius, dim.stripeWidth / 2,
        col.stripe, col.greenNote,
        state.depressed === b || state.playing === buttonToNote(b) ? constants.alphas.brightNote : constants.alphas.normalNote);
      break;

    case "RedButton":
    fillNoteButtonShapeCleanAlpha(
        state.context, 3, dim.innerBorderOutsideRadius, dim.outerBorderInsideRadius, dim.stripeWidth / 2,
        col.stripe, col.redNote,
        state.depressed === b || state.playing === buttonToNote(b) ? constants.alphas.brightNote : constants.alphas.normalNote);
      break;

    case "PowerButton":
      fillCentredCircleCleanAlpha(
        state.context, - 0.5 * dim.innerBorderInsideRadius, dim.innerBorderInsideRadius * 0.3,  dim.centralButtonRadius,
        col.buttonRing, col.powerButton,
        state.power ? constants.alphas.onSwitch : constants.alphas.offSwitch);
      break;

    case "StartButton":
      fillCentredCircleCleanAlpha(
        state.context, 0 * dim.innerBorderInsideRadius, dim.innerBorderInsideRadius * 0.3,  dim.centralButtonRadius,
        col.buttonRing, col.startButton,
        constants.alphas.offSwitch);
      break;

    case "StrictButton":
      fillCentredCircleCleanAlpha(
        state.context, + 0.5  * dim.innerBorderInsideRadius, dim.innerBorderInsideRadius * 0.3,  dim.centralButtonRadius,
        col.buttonRing, col.strictButton,
        state.strict && state.power ? constants.alphas.onSwitch : constants.alphas.offSwitch);
      break;

    default:
      assertNever(b); // TS Compiler will throw an error if above cases are not exhaustive
      throw Error("Unknown button type in drawButton: " + b);

  }

}

export function redrawScore(state: State): void {

  let show: string;
  if (state.score === "Blank") {
      show = "";
  } else if (state.score === "Dashes") {
      show = "--";
  } else if (state.score === "Plings") {
      show = "!!";
  } else if (state.score === "Win") {
      show = "WIN";
  } else if (typeof state.score === "number") {
      show = (state.score >= 0 && state.score <= 9) ? "0" + state.score : state.score.toString();
  } else {
      throw Error("Bad score in redrawScore:" + state.score);
  }

  fillCentredRectangle(
    state.context,
    0, -0.3 * dim.innerBorderInsideRadius, 1.4 * dim.innerBorderInsideRadius, 0.7 * dim.innerBorderInsideRadius,
    col.centralBackground);
  centredText(state.context, 0, - 0.3 * dim.innerBorderInsideRadius, show, constants.fonts.score);

}


// export function redrawScore(state: State): void {

//   let show: string;
//   switch (state.score) {
//     case "Blank":
//       show = "";
//       break;
//     case "Dashes":
//       show = "--";
//       break;
//     case "Plings":
//       show = "!!";
//       break;
//     case "Win":
//       show = "WIN";
//       break;
//     default:
//       if (typeof state.score === "number") {
//         show = (state.score >= 0 && state.score <= 9) ? "0" + state.score : state.score.toString();
//       } else {
//           assertNever(state.score); // TS Compiler will throw an error if above cases are not exhaustive
//       }
//   }
