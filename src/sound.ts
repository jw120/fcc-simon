/*
 * Manage sound playing and state, no game logic
 *
 */

import constants from "./constants";
import { Duration } from "./duration";
import { Note } from "./state";
import { assertNever, eventLog } from "./utils";

/** Audio-relevant portion of the overall game State */
export interface AudioState {
  context: AudioContext;
  gainNode: GainNode;
  playingSound: OscillatorNode | null;
}

// Safari uses webkitAudioContext instead of the standard AudioContext. TypeScript library headers
// only provide the latter, so we provide a copy here for webkitAudioContext
declare var webkitAudioContext: {
    prototype: AudioContext;
    new(): AudioContext;
};

/** Initialize sound system, updating state */
export function newAudioState(): AudioState {

  // Get the AudioContext from either the standard AudioContext or the Safari-esque webkitAudioContext
  let context: AudioContext | undefined = undefined;
  if ("AudioContext" in window) {
    context = new AudioContext();
  } else if ("webkitAudioContext" in window) {
    context = new webkitAudioContext();
  }
  if (!context) {
    throw Error("Failed to create AudioContext");
  }

  let gainNode: GainNode = context.createGain();
  gainNode.gain.value = constants.audio.gain;
  gainNode.connect(context.destination);

  return { context, gainNode, playingSound: null };

}

/** Start playing the given note, stopping after the optional duration and applying the optional callback */
export function startPlayingSound(audio: AudioState, n: Note, dur?: Duration, cb?: (() => void)): void {

  eventLog("StrtPl", n, "");

  let osc: OscillatorNode | undefined = audio.context.createOscillator();
  if (!osc) {
    throw Error("Failed to create oscillator node");
  }
  osc.type = "square";
  osc.connect(audio.gainNode);

  switch (n) {
    case "BlueNote":
      osc.frequency.value = constants.audio.blue;
      break;
    case "YellowNote":
      osc.frequency.value = constants.audio.yellow;
      break;
    case "RedNote":
      osc.frequency.value = constants.audio.red;
      break;
    case "GreenNote":
      osc.frequency.value = constants.audio.green;
      break;
    default:
      assertNever(n); // Compiler will give a type error if the cases above are not exhaustive
      throw Error("bad note in startPlayingSound: " + n);
  }

  osc.start();
  audio.playingSound = osc;
  if (dur !== undefined) {
    osc.stop(audio.context.currentTime + dur.seconds());
  }

  if (cb !== undefined) {
    osc.onended = cb;
  }

}

export function stopPlayingSound(audio: AudioState): void {
  console.log(audio);
  if (audio.playingSound !== null) {
    console.log("playingSound is", audio.playingSound, (audio.playingSound as any).playbackState);
  } else {
    console.log("playingSound is null");
  }

  if (audio.playingSound) {
    console.log("Stopping sound next");
    audio.playingSound.stop();
    console.log("Sound stopped()");
    audio.playingSound = null;
  } else {
    console.log("Skipped stop as no playingSound");
  }

}

/** Stop playing any sound without calling any onended callback */
export function resetPlayingSound(audio: AudioState): void {

  if (audio.playingSound) {
    audio.playingSound.onended = (): void => { /* do nothing */ };
    audio.playingSound.stop();
    audio.playingSound = null;
  }

}


/** Play the failure sound and follow the given callback when sound ends */
export function playFailureSound(audio: AudioState, cb: (() => void)): void {

  let osc: OscillatorNode | undefined = audio.context.createOscillator();
  if (!osc) {
    throw Error("Failed to create oscillator node");
  }
  osc.type = "square";
  osc.connect(audio.gainNode);
  osc.frequency.value = constants.audio.failure;

  osc.start();
  osc.stop(audio.context.currentTime + constants.durations.failureSound.seconds());
  osc.onended = cb;

}

