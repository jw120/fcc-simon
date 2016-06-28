/** Draw the board and decode clicks on the board */

import { centredFilledRectangle, centredFilledCircle, outlinedFilledCircle, drawNoteButton, centredText } from "./canvas";

type canvasButton =
  "BlueButton" | "YellowButton" | "GreenButton" | "RedButton" |
  "StartButton" | "StrictButton" | "PowerButton";

// Sizes of the parts of the SImon board
const blackStripeWidth: number = 10;
const outerBorderOutsideRadius: number = 100;
const outerBorderInsideRadius: number = outerBorderOutsideRadius - blackStripeWidth;
const innerBorderInsideRadius: number = 30;
const innerBorderOutsideRadius: number = innerBorderInsideRadius + blackStripeWidth;

const centralButtonRadius: number = 5;

// Alpha values to fill notes
const normalNoteAlpha: number = 0.75;
const brightNoteAlpha: number = 1;

// Alpha values for switches
const offSwitchAlpha: number = 0.25;
const onSwitchAlpha: number = 1;

/** Draw the Simon board on the canvas */
export function drawBoard(context: CanvasRenderingContext2D): void {

  // Draw the borders
  centredFilledCircle(context, outerBorderOutsideRadius, "black");
  centredFilledRectangle(context, blackStripeWidth, outerBorderOutsideRadius + outerBorderInsideRadius, "black");
  centredFilledRectangle(context, outerBorderOutsideRadius + outerBorderInsideRadius, blackStripeWidth, "black");
  centredFilledCircle(context, innerBorderOutsideRadius, "black");
  centredFilledCircle(context,  innerBorderInsideRadius, "silver");

  // Draw control buttons
  drawButton(context, "StartButton", 1.0);
  drawButton(context, "StrictButton", 1.0);
  drawButton(context, "PowerButton", 1.0);

  // Draw the note buttons
  drawButton(context, "BlueButton", normalNoteAlpha);
  drawButton(context, "YellowButton", normalNoteAlpha);
  drawButton(context, "GreenButton", normalNoteAlpha);
  drawButton(context, "RedButton", normalNoteAlpha);

  // Add the score
  centredText(context, 0, - 0.3 * innerBorderInsideRadius, "0", "20px sans-serif");

}

// Helper function to draw a buttons
function drawButton(context: CanvasRenderingContext2D, b: canvasButton, alpha: number): void {

  switch (b) {

    case "BlueButton":
      drawNoteButton(context, 0, innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2, "blue", alpha);
      break;

    case "YellowButton":
      drawNoteButton(context, 1, innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2, "yellow", alpha);
      break;

    case "GreenButton":
      drawNoteButton(context, 2, innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2, "green", alpha);
      break;

    case "RedButton":
      drawNoteButton(context, 3, innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2, "red", alpha);
      break;

    case "PowerButton":
      outlinedFilledCircle(context, - 0.5 * innerBorderInsideRadius, innerBorderInsideRadius * 0.3,  centralButtonRadius, "green", offSwitchAlpha);
      centredText(context,  - 0.5 * innerBorderInsideRadius, innerBorderInsideRadius * 0.59, "POWER", "3px sans-serif");
      break;

    case "StartButton":
      outlinedFilledCircle(context,   0   * innerBorderInsideRadius, innerBorderInsideRadius * 0.3,  centralButtonRadius, "red", offSwitchAlpha);
      centredText(context,    0   * innerBorderInsideRadius, innerBorderInsideRadius * 0.59, "START", "3px sans-serif");
      break;

    case "StrictButton":
      outlinedFilledCircle(context, + 0.5 * innerBorderInsideRadius, innerBorderInsideRadius * 0.3,  centralButtonRadius, "yellow", offSwitchAlpha);
      centredText(context,  + 0.5 * innerBorderInsideRadius, innerBorderInsideRadius * 0.59, "STRICT", "3px sans-serif");
      break;

    default:
      throw Error("Unknown button type: " + b);

  }

}




// Main.ts passes references to the globals we need to use and modify
interface CanvasClickHandlerData {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  scale: number;
}

/** Helper function to generates a callback function to handle clicks on our canvas */
export function makeCanvasClickHandler(dat: CanvasClickHandlerData): ((e: MouseEvent) => void) {

  return (event: MouseEvent) => {

    // Pixel coordinates of click relative to canvas
    let pixelX: number = event.pageX - dat.canvas.offsetLeft;
    let pixelY: number = event.pageY - dat.canvas.offsetTop;

    // Coordinates on our -100..100 system
    let x: number = (pixelX - dat.canvas.width / 2) / dat.scale;
    let y: number = (pixelY - dat.canvas.height / 2) / dat.scale;

    console.log("Window innerSize", window.innerWidth, window.innerHeight);
    console.log("Canvas", dat.canvas.width, dat.canvas.height);
    console.log("Click at", pixelX, pixelY, "or", x, y);

    let clicked: canvasButton | null = findCanvasButton(x, y);
    console.log(clicked);
    if (clicked === "RedButton") {
      drawNoteButton(dat.context, 3, innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2, "red", brightNoteAlpha);
    }
  };

}

/** Helper function to turn cliks in our normalized coordinates to buttons  */
function findCanvasButton(x: number, y: number): canvasButton | null {

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

  return null;

}

