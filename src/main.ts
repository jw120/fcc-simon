/*
 * Main programme
 *
 */

import { redrawBoard } from "./board";
import { makeCanvasClickHandler, makeCanvasMouseDownHandler, makeCanvasMouseUpHandler } from "./event";
import { resetState, State, updateScale } from "./state";
import { run_when_document_ready } from "./utils";

run_when_document_ready((): void => {

  let state: State = resetState();

  redrawBoard(state);

  state.canvas.addEventListener("click", makeCanvasClickHandler(state), false);
  state.canvas.addEventListener("mousedown", makeCanvasMouseDownHandler(state), false);
  state.canvas.addEventListener("mouseup", makeCanvasMouseUpHandler(state), false);

  window.onresize = () => {
    updateScale(state);
    redrawBoard(state);
  };

});





