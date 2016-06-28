/** Main programme */

import { drawBoard, makeCanvasClickHandler } from "./board";
import { getContext2D } from "./canvas";
import { run_when_document_ready } from "./utils";

let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let scale: number;

run_when_document_ready((): void => {

  canvas = document.getElementById("board") as HTMLCanvasElement;
  context = getContext2D(canvas);

  sizeCanvas();
  drawBoard(context);

  canvas.addEventListener("click", makeCanvasClickHandler({canvas, context, scale}), false);

  window.onresize = () => {
    sizeCanvas();
    drawBoard(context);
  };

});


function sizeCanvas(): void {

  // We set the canvas to fill most of the available window
  canvas.width = window.innerWidth - 20;
  canvas.height = window.innerHeight - 100; // Allow space for footer

  // We transform the canvas so a square with coordinates (-100, -100) to (100, 100)
  // appears as the largest centred squate that will fit on the canvas
  const canvasMax: number = 100;
  scale = Math.min(canvas.width, canvas.height) / (2 * canvasMax);
  context = getContext2D(canvas);
  context.transform(scale, 0, 0, scale, canvas.width / 2, canvas.height / 2);

}


