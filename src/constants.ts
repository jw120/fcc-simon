/*
 * Module holding all the game's constant parameters
 *
 * Used as

 * import constant from "./constant";
 * let x = constants.boardDimensions.outerBorderOutsideRadius;
 * let y = constants.durations.maxReplyaNote.milliseconds();
 *
 */

import { Duration, ms } from "./duration";

/** Type for our constants default export */
interface Constants {
  window: WindowParams;
  boardDimensions: BoardDimensions;
  durations: Durations;
  alphas: Alphas;
  frequencies: Frequencies;
  colours: Colours;
  fonts: Fonts;
  game: Game;
}


/** Type for the window-related parameters */
export interface WindowParams {

  /** Canvas width set to window's innerwidth less width reserved */
  widthReserved: number;

  /** Canvas height set to window's innerwidth less height reserved */
  heightReserved: number;
}

/** Type for the boardDimensions part of the constants default export, all in the scaled -100..100 coordinate space */
export interface BoardDimensions {

  /** Canvas runs from -canvaSize to +canvasSize on x and y axes */
  canvasSize: number;

  /** Width of the horizontal and vertical border stripes */
  stripeWidth: number;

  /** Radius of the outer edge of the black border at the outside of the board */
  outerBorderOutsideRadius: number;

  /** Radius of the inner edge of the black border at the outside of the board */
  outerBorderInsideRadius: number;

  /** Radius of the outer edge of the black border at the inside of the note buttons */
  innerBorderInsideRadius: number;

  /** Radius of the inner edge of the black border at the inside of the note buttons */
  innerBorderOutsideRadius: number;

  /** Radius of the coloued part of the buttons at the centre of the Simon board */
  centralButtonRadius: number;

  /** Outside radius of the black ring around the buttons at the centre of the Simon board */
  centralButtonRingRadius: number;
}

/** Type for the durations part of the constants default export */
export interface Durations {

  /** Length of time for score and blank to appear on screen when flashing the score */
  flash: Duration;

  /** Length of time for blank to appear on screen at the end of flashing the score */
  finalFlash: Duration;

  /** Duration of each note when we play the tune */
  tuneNote: Duration;

  /** Duration of pause between each note when we play the tune */
  tuneGap: Duration;

  /** Maxium duration of a note during replay phase */
  replayNoteTimeout: Duration;

  /** Maximum time to wait for a note during replay phase before triggering failure */
  replayWait: Duration;

  /** Time to wait after completing a replay phase before extending */
  afterReplay: Duration;

  /** Time to wait after the failure noise */
  afterFailure: Duration;

  /** Duration of the failure sound */
  failureSound: Duration;
}

/** Type for the alpha values for drawing the board */
export interface Alphas {
  normalNote: number;
  brightNote: number;
  offSwitch: number;
  onSwitch: number;
}

/** Type for the frequencies used to play the notes */
export interface Frequencies {
  blue: number;
  yellow: number;
  red: number;
  green: number;
  failure: number;
};

export interface Game {
  winCondition: number; // number of notes that must be matched to win the game
}

type Colour = string;
/** Type for the colours used to draw the board */
export interface Colours {
  stripe: Colour;
  powerButton: Colour;
  startButton: Colour;
  strictButton: Colour;
  buttonRing: Colour;
  redNote: Colour;
  yellowNote: Colour;
  greenNote: Colour;
  blueNote: Colour;
  centralBackground: Colour;
}

type Font = string;
/** Type for th fonts used to draw the board */
export interface Fonts {
  buttonLabels: Font;
  score: Font;
}

const stripeWidth: number = 10;
const outsideRadius: number = 100;
const insideRadius: number = 30;

/** Values for the constants default export */
const constants: Constants = {
  window: {
    widthReserved: 20,
    heightReserved: 100
  },
  boardDimensions: {
    canvasSize: 100,
    stripeWidth,
    outerBorderOutsideRadius: outsideRadius,
    outerBorderInsideRadius: outsideRadius - stripeWidth,
    innerBorderInsideRadius: insideRadius,
    innerBorderOutsideRadius: insideRadius + stripeWidth,
    centralButtonRadius: 5,
    centralButtonRingRadius: 6
  },
  durations: {
    flash: ms(300),
    finalFlash: ms(800),
    tuneNote: ms(800),
    tuneGap: ms(400),
    replayNoteTimeout: ms(5000),
    replayWait: ms(5000),
    afterReplay: ms(1000),
    afterFailure: ms(1000),
    failureSound: ms(1500)
  },
  alphas: {
    normalNote: 0.75,
    brightNote: 1,
    offSwitch: 0.5,
    onSwitch: 1
  },
  frequencies: {
    blue: 329.628,
    yellow: 277.183,
    red: 440,
    green: 164.814,
    failure: 66
  },
  colours: {
    stripe: "black",
    powerButton: "green",
    startButton: "red",
    strictButton: "yellow",
    buttonRing: "black",
    redNote: "red",
    yellowNote: "yellow",
    greenNote: "green",
    blueNote: "blue",
    centralBackground: "silver"
  },
  fonts: {
    buttonLabels: "3px sans-serif",
    score: "20px sans-serif"
  },
  game: {
    winCondition: 5
  }
};

export default constants;
