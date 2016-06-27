/** Test of drawing the game "board" with canvas and handling clicks */

import { getContext2D, centredFilledRectangle, centredFilledCircle, centredFilledQuadrant } from "./canvas";

const canvasWidth: number = 500;
const canvasHeight: number = 500;

const centreX: number = canvasWidth / 2;
const centreY: number = canvasHeight / 2;

const blackStripeWidth: number = 20;
const outerBorderOutsideRadius: number = 200;
const outerBorderInsideRadius: number = outerBorderOutsideRadius - blackStripeWidth;
const innerBorderInsideRadius: number = 40;
const innerBorderOutsideRadius: number = innerBorderInsideRadius + blackStripeWidth;

const canvas: HTMLCanvasElement = document.getElementById("board") as HTMLCanvasElement;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

let ctx: CanvasRenderingContext2D = getContext2D(canvas);

centredFilledCircle(ctx, centreX, centreY, outerBorderOutsideRadius, "black");
centredFilledQuadrant(ctx, centreX, centreY, outerBorderInsideRadius, 0, "red");
centredFilledQuadrant(ctx, centreX, centreY, outerBorderInsideRadius, 1, "blue");
centredFilledQuadrant(ctx, centreX, centreY, outerBorderInsideRadius, 2, "yellow");
centredFilledQuadrant(ctx, centreX, centreY, outerBorderInsideRadius, 3, "green");

centredFilledRectangle(ctx, centreX, centreY, blackStripeWidth, outerBorderOutsideRadius + outerBorderInsideRadius, "black");
centredFilledRectangle(ctx, centreX, centreY, outerBorderOutsideRadius + outerBorderInsideRadius, blackStripeWidth, "black");
centredFilledCircle(ctx, centreX, centreY, innerBorderOutsideRadius, "black");
centredFilledCircle(ctx, centreX, centreY, innerBorderInsideRadius, "grey");



// function centredFilledArc(r: number, startAngle: number, endAngle: number, fillStyle: string): void {
//   ctx.beginPath();
//   ctx.arc(centreX, centreY, r, startAngle , endAngle);
//   ctx.fillStyle = fillStyle;
//   ctx.fill();
// }
