import { drawButton } from "./board";
import { State } from "./state";
import { dist } from "./utils";
import {
  blackStripeWidth, centralButtonRadius,
  outerBorderOutsideRadius, outerBorderInsideRadius,
  innerBorderOutsideRadius, innerBorderInsideRadius
} from "./boardDimensions";

export type canvasButton =
  "BlueButton" | "YellowButton" | "GreenButton" | "RedButton" | "StartButton" | "StrictButton" | "PowerButton";


/** Helper function to generates a callback function to handle clicks on our canvas */
export function makeCanvasClickHandler(state: State): ((e: MouseEvent) => void) {

  return (event: MouseEvent) => {

    // Pixel coordinates of click relative to canvas
    let pixelX: number = event.pageX - state.canvas.offsetLeft;
    let pixelY: number = event.pageY - state.canvas.offsetTop;

    // Coordinates on our -100..100 system
    let x: number = (pixelX - state.canvas.width / 2) / state.scale;
    let y: number = (pixelY - state.canvas.height / 2) / state.scale;

    console.log("Window innerSize", window.innerWidth, window.innerHeight);
    console.log("Canvas", state.canvas.width, state.canvas.height);
    console.log("Click at", pixelX, pixelY, "or", x, y);

    let clicked: canvasButton | null = findCanvasButton(x, y);
    console.log(clicked);
    switch (clicked) {
      case "PowerButton":
        state.power = !state.power;
        drawButton(state, "PowerButton");
        break;
      case "StrictButton":
        state.strict = !state.strict;
        drawButton(state, "StrictButton");
        break;
      default:
        // do nothing
    }

  };

}


/** Helper function to turn cliks in our normalized coordinates to buttons  */
function findCanvasButton(x: number, y: number): canvasButton | null {

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

  if (r < innerBorderInsideRadius) {

    if (dist(x, y, - 0.5 * innerBorderInsideRadius, innerBorderInsideRadius * 0.3) < centralButtonRadius) {
      return "PowerButton";
    }
    if (dist(x, y, 0 * innerBorderInsideRadius, innerBorderInsideRadius * 0.3) < centralButtonRadius) {
      return "StartButton";
    }
    if (dist(x, y, + 0.5 * innerBorderInsideRadius, innerBorderInsideRadius * 0.3) < centralButtonRadius) {
      return "StrictButton";
    }

  }

  return null;

}