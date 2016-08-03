/**
 * Support setting timeouts during replay phase, and then when they are called checking that then
 * game state has not advanced
 *
 */

import constants from "./constants";
import { replayFailure } from "./handlers";
import { State } from "./state";
import { eventLog, timeout } from "./utils";

/** State stored in the closure for each each replay timeout, when the timeout triggers, it calls the callback if state has not advanced */
interface ReplayState {
  id: number;
  match: number | null;
}
function makeReplayState(state: State): ReplayState {
  return {
    id: state.id,
    match: state.notesMatched
  }
}
function showReplayState(r: ReplayState): string {
  return `(${r.id}, ${r.match})`;
}
function equalReplayState(r1: ReplayState, r2: ReplayState) {
  return r1.id === r2.id && r1.match === r2.match;
}


/** Establish timeout for replays */
export function setReplayTimeout(state: State): void {

  const r: ReplayState = makeReplayState(state);

  eventLog("TOSET", null, "Setting replay timeout at " + showReplayState(r));

  timeout(constants.durations.replayWait, makeReplayTimeoutCallback(state, r));

}

/** Helper to create closure that is called when timeout triggers and during replay (user too slow to enter a note) */
function makeReplayTimeoutCallback(state: State, oldR: ReplayState, ): () => void {

  return () => {

    const newR: ReplayState = makeReplayState(state);

    eventLog("TOCHK", null, `Was ${showReplayState(oldR)}, now ${showReplayState(newR)}`);

    // If no progress has been made, and power is on
    if (state.power && equalReplayState(oldR, newR)) {
      eventLog("TOFAIL", null, "Failure triggered");
      replayFailure(state, null);
    }
  };
}