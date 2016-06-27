/** Test of drawing the game "board" with canvas and handling clicks */

const canvasWidth: number = 500;
const canvasHeight: number = 500;

const canvas: HTMLCanvasElement = document.getElementById("board") as HTMLCanvasElement;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

let ctx: CanvasRenderingContext2D | null;
ctx = canvas.getContext("2d");
if (!ctx) {
  throw Error("Cannot get canvas context");
}

ctx.beginPath();
ctx.arc(canvasWidth / 2, canvasHeight / 2, 100, 0, 2 * Math.PI);
ctx.stroke();
