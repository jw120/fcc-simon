

type GameMode
  = "Off" // If the Simon machine is turned off
  | "Waiting" // If the Simon machine is turned on but start has not been pressed
  | "Giving" // If the Simon machine is playing its music
  | "Taking"; // If the Simon machine is waiting for the user

export type Note = "Red" | "Green" | "Blue" | "Yellow";

interface GameState {
  mode: GameMode;
  strict: boolean;
  sequence: Note[];
  step: number; // Number of notes completed in this round (0 .. (count -1))
};

/*

If mode is off
 - callback on on/off switch only

If mode is waiting
 - callback on start button
 - callbac on strict button

If mode is giving
 - callbacks on on/off switch
 - callstrict on start buttons
 - play note and chain note callback on note ending
 ( if interrupted - keep track of current note and stop() it after resetting its onended cb)

If mode is taking
 - callback on note buttons
 - callbacks on on/off switch
 - callstrict on start buttons
 - callback on strict button

*/
