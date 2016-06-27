/** Main programme */

import { renderBoard, handleCanvasClick } from "./board";
import { run_when_document_ready } from "./utils";

run_when_document_ready((): void => {

  let canvas: HTMLCanvasElement = document.getElementById("board") as HTMLCanvasElement
  renderBoard(canvas);

  canvas.addEventListener("click", handleCanvasClick(canvas), false);

  window.onresize = () => renderBoard(canvas);


});


