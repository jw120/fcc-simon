/*
 * Manage sound playing and state, no game logic
 *
 */

import { Duration } from "./duration";
import { Note } from "./state";
import constants from "./constants";

export interface AudioState {
  context: AudioContext;
  gainNode: GainNode;
  playingSound: OscillatorNode | null;
}

/** Initialize sound system, updating state */
export function newAudioState(): AudioState {

  let context: AudioContext | undefined = new AudioContext();
  if (!context) {
    throw Error("Failed to create AudioContext");
  }

  let gainNode: GainNode = context.createGain();
  gainNode.gain.value = 0.1;
  gainNode.connect(context.destination);

  return { context, gainNode, playingSound: null };

}

/** Start playing the given note, stopping after the optional duration and applying the optional callback */
export function startPlayingSound(audio: AudioState, n: Note, dur?: Duration, cb?: (() => void)): void {

  let osc: OscillatorNode | undefined = audio.context.createOscillator();
  if (!osc) {
    throw Error("Failed to create oscillator node");
  }
  osc.type = "square";
  osc.connect(audio.gainNode);

  switch (n) {
    case "BlueNote":
      osc.frequency.value = constants.frequencies.blue;
      break;
    case "YellowNote":
      osc.frequency.value = constants.frequencies.yellow;
      break;
    case "RedNote":
      osc.frequency.value = constants.frequencies.red;
      break;
    case "GreenNote":
      osc.frequency.value = constants.frequencies.green;
      break;
    default:
      return;
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

  if (audio.playingSound) {
    audio.playingSound.stop();
    audio.playingSound = null;
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
  osc.frequency.value = constants.frequencies.failure;

  osc.start();
  osc.stop(audio.context.currentTime + constants.durations.failureSound.seconds());
  osc.onended = cb;

}

