/** Test of drawing the game "board" with canvas and handling clicks */

// import { getContext2D, centredFilledRectangle, centredFilledCircle, centredFilledQuadrant } from "./canvas";

// We always draw to a 200x200 rectange
// const canvasWidth: number = 500;
// const canvasHeight: number = 500;

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



// function centredFilledArc(r: number, startAngle: number, endAngle: number, fillStyle: string): void {
//   ctx.beginPath();
//   ctx.arc(centreX, centreY, r, startAngle , endAngle);
//   ctx.fillStyle = fillStyle;
//   ctx.fill();
// }


/** Helper functions to draw on canvas */

/** Return the rendering context from the given canvas, throws on failure  */
function getContext2D(cvs: HTMLCanvasElement): CanvasRenderingContext2D {
  let c: CanvasRenderingContext2D | null = cvs.getContext("2d");
  if (c) {
    return c;
  } else {
    throw Error("Cannot get canvas context");
  }
}

/** Fill a rectangle of given width and height, centred on given centre */
function centredFilledRectangle(ctx: CanvasRenderingContext2D, w: number, h: number, fillStyle: string): void {

  ctx.save();
  ctx.fillStyle = fillStyle;
  ctx.fillRect(- w / 2,  - h / 2, w, h);
  ctx.restore();

}

/** Fill a circle of given radius on given centre */
function centredFilledCircle(ctx: CanvasRenderingContext2D, r: number, fillStyle: string): void {

  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, r, 0 , 2 * Math.PI);
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.restore();

}

/** Fill a quadrant of the circle of given radius around given centre. Quadrants numbered 0 to 3 clockwise from top-right */
function centredFilledQuadrant(ctx: CanvasRenderingContext2D, r: number, q: number, fillStyle: string): void {

  q = q % 4;
  let vertDir: number = q === 1 || q === 2 ? 1 : -1;
  let horizDir: number = q === 0 || q === 1 ? 1 : -1;

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(0,            0);
  ctx.lineTo(0,            vertDir * r);
  ctx.lineTo(horizDir * r, vertDir * r);
  ctx.lineTo(horizDir * r, 0);
  ctx.lineTo(0,            0);
  ctx.clip();

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, 2 * Math.PI);
  ctx.fillStyle = fillStyle;
  ctx.fill();

  ctx.restore();

}
