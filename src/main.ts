/*
 * Main programme
 *
 */

import { redrawBoard } from "./board";
import { canvasClickHandler, canvasMouseDownHandler, canvasMouseUpOrOutHandler } from "./event";
import { resetState, State, updateScale } from "./state";
import { runWhenDocumentReady } from "./utils";

runWhenDocumentReady((): void => {

  /** Holds all the game's state. This is used in many functions as if it was a global variable, its properties
   * are mutated but the object itself (i.e., the reference itself) is not modified anywhere*/
  const state: State = {} as State;
  resetState(state);

  // Draw the board for the first time
  redrawBoard(state);

  // Handle mouse clicks on the canvas
  state.canvas.addEventListener("click", (e: MouseEvent) => canvasClickHandler(state, e), false);
  state.canvas.addEventListener("mousedown", (e: MouseEvent) => canvasMouseDownHandler(state, e), false);
  state.canvas.addEventListener("mouseup", (e: MouseEvent) => canvasMouseUpOrOutHandler(state, e), false);

  // If user drags the mouse off the canvas, treat this as a mouseup
  state.canvas.addEventListener("mouseout", (e: MouseEvent) => {
    if (e && e.target && e.target === state.canvas) {
      canvasMouseUpOrOutHandler(state, e);
    }
  }, false);

  window.onresize = () => {
    updateScale(state);
    redrawBoard(state);
  };

});





