/** Test of drawing the game "board" with canvas and handling clicks */

import * as debug from "debug";
const d: debug.IDebugger = debug("simon:board");

import { getContext2D, centredFilledRectangle, centredFilledCircle, centredFilledQuadrant } from "./canvas";

// We always draw to a 200x200 rectange
// const canvasWidth: number = 500;
// const canvasHeight: number = 500;
d("Starting");
// We set the canvas to fill most of the available window
const canvas: HTMLCanvasElement = document.getElementById("board") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 100; // Allow space for footer

// We transform the canvas so a square with coordinates (-100, -100) to (100, 100)
// appears as the largest centred squate that will fit on the canvas
const canvasMax: number = 100;
let scale: number = Math.min(canvas.width, canvas.height) / (2 * canvasMax);
const context: CanvasRenderingContext2D = getContext2D(canvas);
context.save();
context.transform(scale, 0, 0, scale, canvas.width / 2, canvas.height / 2);

// Sizes of the parts of the SImon board
const blackStripeWidth: number = 10;
const outerBorderOutsideRadius: number = 100;
const outerBorderInsideRadius: number = outerBorderOutsideRadius - blackStripeWidth;
const innerBorderInsideRadius: number = 30;
const innerBorderOutsideRadius: number = innerBorderInsideRadius + blackStripeWidth;

// Draw the Simon board
centredFilledCircle(context, outerBorderOutsideRadius, "black");
centredFilledQuadrant(context, outerBorderInsideRadius, 0, "red");
centredFilledQuadrant(context, outerBorderInsideRadius, 1, "blue");
centredFilledQuadrant(context, outerBorderInsideRadius, 2, "yellow");
centredFilledQuadrant(context, outerBorderInsideRadius, 3, "green");
centredFilledRectangle(context, blackStripeWidth, outerBorderOutsideRadius + outerBorderInsideRadius, "black");
centredFilledRectangle(context, outerBorderOutsideRadius + outerBorderInsideRadius, blackStripeWidth, "black");
centredFilledCircle(context, innerBorderOutsideRadius, "black");
centredFilledCircle(context,  innerBorderInsideRadius, "grey");

canvas.addEventListener("click", handleCanvasClick, false);

type canvasClickable = "RedButton" | "YellowButton" | "GreenButton" | "BlueButton";

function handleCanvasClick(event: MouseEvent): void {

  // Pixel coordinates of click relative to canvas
  let pixelX: number = event.pageX - canvas.offsetLeft;
  let pixelY: number = event.pageY - canvas.offsetTop;

  // Coordinates on our -100..100 system
  let x: number = (pixelX - canvas.width / 2) / scale;
  let y: number = (pixelY - canvas.height / 2) / scale;

  console.log(findCanvasClickable(x, y));
}

function findCanvasClickable(x: number, y: number): canvasClickable | null {

  // console.log("Looking up", x, y);

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

