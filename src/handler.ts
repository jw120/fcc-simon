import { drawButton } from "./board";
import { State, canvasButton } from "./state";
import { dist } from "./utils";
import {
  blackStripeWidth, centralButtonRadius,
  outerBorderInsideRadius, innerBorderOutsideRadius, innerBorderInsideRadius
} from "./boardDimensions";



/** Helper function to generates a callback function to handle clicks on our canvas */
export function makeCanvasClickHandler(state: State): ((e: MouseEvent) => void) {

  return (event: MouseEvent) => {

    let clicked: canvasButton | null = findCanvasButton(scaledCoords(state, event.pageX, event.pageY));
    console.log("Clicked", clicked);

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
        console.log("Ignoring");
    }

  };

}

/** Helper function to generates a callback function to handle mouse down events on our canvas */
export function makeCanvasMouseDownHandler(state: State): ((e: MouseEvent) => void) {

  return (event: MouseEvent) => {

    let oldDepressed: canvasButton | null = state.depressed;

    let down: canvasButton | null = findCanvasButton(scaledCoords(state, event.pageX, event.pageY));
    console.log("Down on", down);

    if (down) {
      switch (down) {
        case "RedButton":
        case "YellowButton":
        case "BlueButton":
        case "GreenButton":
          state.depressed = down;
          console.log("Drawing depressed", down);
          drawButton(state, down);
          break;
        default:
          // do nothing
      }
    }

    if (oldDepressed && oldDepressed !== down) {
      drawButton(state, oldDepressed);
    }

  };

}

/** Helper function to generates a callback function to handle mouse down events on our canvas */
export function makeCanvasMouseUpHandler(state: State): ((e: MouseEvent) => void) {

  return (event: MouseEvent) => {

    console.log("Up");

    if (state.depressed) {
      let oldDepressed: canvasButton = state.depressed;
      console.log("Redrawing", oldDepressed);
      state.depressed = null;
      drawButton(state, oldDepressed);
    }

  };

}


/** Helper function to turn cliks in our normalized coordinates to buttons  */
function findCanvasButton(coords: [number, number]): canvasButton | null {

  let x: number = coords[0];
  let y: number = coords[1];

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


/** Helper function to return scaled coordinates */
function scaledCoords(state: State, pageX: number, pageY: number): [number, number] {

  // Pixel coordinates of click relative to canvas
  let pixelX: number = pageX - state.canvas.offsetLeft;
  let pixelY: number = pageY - state.canvas.offsetTop;

  // Coordinates on our -100..100 system
  let x: number = (pixelX - state.canvas.width / 2) / state.scale;
  let y: number = (pixelY - state.canvas.height / 2) / state.scale;

  // console.log("Window innerSize", window.innerWidth, window.innerHeight);
  // console.log("Canvas", state.canvas.width, state.canvas.height);
  // console.log("Click at", pixelX, pixelY, "or", x, y);

  return [x, y];

}
