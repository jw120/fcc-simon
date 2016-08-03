/**
 * Support setting timeouts during replay phase, and then when they are called checking the relevant
 * portion of the game state and, if it has not advanced, trigger replayFailure
 *
 */

import constants from "./constants";
import { replayFailure } from "./handlers";
import { State } from "./state";
import { eventLog, timeout } from "./utils";

/** Portion of State that is relevant for checking if the timeout during replay phase should be acted on when it triggers */
interface ReplayState {
  id: number;
  match: number | null;
}

/** Establish timeout for replays */
export function setReplayTimeout(state: State): void {

  const oldR: ReplayState = makeReplayState(state); // Relevant game state when the timeout is set

  eventLog("TOSET", null, "Setting replay timeout at " + showReplayState(oldR));

  timeout(constants.durations.replayWait, () => {

    const newR: ReplayState = makeReplayState(state); // Relevant game state when the timeout is triggered

    eventLog("TOCHK", null, `Was ${showReplayState(oldR)}, now ${showReplayState(newR)}`);

    // If relevant game state has not changed and the power is on, then replay has failed
    if (state.power && equalReplayState(oldR, newR)) {
      eventLog("TOFAIL", null, "Failure triggered");
      replayFailure(state, null);
    }
  });

}

/** Helper function to construct a ReplayState */
function makeReplayState(state: State): ReplayState {
  return {
    id: state.id,
    match: state.notesMatched
  }
}

/** Helper function to produce a string representation of a ReplayState for debugging messages */
function showReplayState(r: ReplayState): string {
  return `(${r.id}, ${r.match})`;
}

/** Helper function to test two replay states for value equality */
function equalReplayState(r1: ReplayState, r2: ReplayState) {
  return r1.id === r2.id && r1.match === r2.match;
}