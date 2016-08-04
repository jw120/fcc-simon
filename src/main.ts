/*
 * Main programme
 *
 */

import { redrawBoard } from "./board";
import { canvasClickHandler, canvasMouseDownHandler, canvasMouseUpHandler } from "./event";
import { resetState, State, updateScale } from "./state";
import { runWhenDocumentReady } from "./utils";

runWhenDocumentReady((): void => {

  /** Holds all the game's state. This is used in many functions as if it was a global variable, its properties
   * are mutated but the object itself (i.e., the value of the reference) is not modified anywhere*/
  const state: State = {} as State;
  resetState(state);

  redrawBoard(state);

  state.canvas.addEventListener("click", (e: MouseEvent) => canvasClickHandler(state, e), false);
  state.canvas.addEventListener("mousedown", (e: MouseEvent) => canvasMouseDownHandler(state, e), false);
  state.canvas.addEventListener("mouseup", (e: MouseEvent) => canvasMouseUpHandler(state, e), false);

  window.onresize = () => {
    updateScale(state);
    redrawBoard(state);
  };

});





