/*
 * Main programme
 *
 */

import { redrawBoard } from "./board";
import { makeCanvasClickHandler, makeCanvasMouseDownHandler, makeCanvasMouseUpHandler } from "./event";
import { resetState, State } from "./state";
import { run_when_document_ready } from "./utils";

run_when_document_ready((): void => {

  let state: State = resetState();

  modifyScale(state);
  redrawBoard(state);

  state.canvas.addEventListener("click", makeCanvasClickHandler(state), false);
  state.canvas.addEventListener("mousedown", makeCanvasMouseDownHandler(state), false);
  state.canvas.addEventListener("mouseup", makeCanvasMouseUpHandler(state), false);

  window.onresize = () => {
    modifyScale(state);
    redrawBoard(state);
  };

});


/** Modify state to reflect canvas and window size */
function modifyScale(state: State): void {

  // We set the canvas to fill most of the available window
  state.canvas.width = window.innerWidth - 20;
  state.canvas.height = window.innerHeight - 100; // Allow space for footer

  // We transform the canvas so a square with coordinates (-100, -100) to (100, 100)
  // appears as the largest centred squate that will fit on the canvas
  const canvasMax: number = 100;
  state.scale = Math.min(state.canvas.width, state.canvas.height) / (2 * canvasMax);
  state.context.transform(state.scale, 0, 0, state.scale, state.canvas.width / 2, state.canvas.height / 2);

}


