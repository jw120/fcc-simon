/** Functions to draw the board */

import { centredFilledRectangle, centredFilledCircle, drawNoteButton } from "./canvas";

// Sizes of the parts of the SImon board
const blackStripeWidth: number = 10;
const outerBorderOutsideRadius: number = 100;
const outerBorderInsideRadius: number = outerBorderOutsideRadius - blackStripeWidth;
const innerBorderInsideRadius: number = 30;
const innerBorderOutsideRadius: number = innerBorderInsideRadius + blackStripeWidth;

// Alpha values to fill notes
const normalNoteAlpha: number = 0.75;
const brightNoteAlpha: number = 1;

/** Draw the Simon board on the canvas */
export function drawBoard(context: CanvasRenderingContext2D): void {

  // Draw the borders
  centredFilledCircle(context, outerBorderOutsideRadius, "black");
  centredFilledRectangle(context, blackStripeWidth, outerBorderOutsideRadius + outerBorderInsideRadius, "black");
  centredFilledRectangle(context, outerBorderOutsideRadius + outerBorderInsideRadius, blackStripeWidth, "black");
  centredFilledCircle(context, innerBorderOutsideRadius, "black");
  centredFilledCircle(context,  innerBorderInsideRadius, "grey");

  // Draw the note buttons
  drawNoteButton(context, 0, innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2, "blue", normalNoteAlpha);
  drawNoteButton(context, 1, innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2, "yellow", normalNoteAlpha);
  drawNoteButton(context, 2, innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2, "green", normalNoteAlpha);
  drawNoteButton(context, 3, innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2, "red", normalNoteAlpha);


}

type canvasClickable = "RedButton" | "YellowButton" | "GreenButton" | "BlueButton";

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

    let clicked: canvasClickable | null = findCanvasClickable(x, y);
    console.log(clicked);
    if (clicked === "RedButton") {
      drawNoteButton(dat.context, 3, innerBorderOutsideRadius, outerBorderInsideRadius, blackStripeWidth / 2, "red", brightNoteAlpha);
    }
  };

}

/** Helper function to turn cliks in our normalized coordinates to buttons  */
function findCanvasClickable(x: number, y: number): canvasClickable | null {

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

