

import { CanvasButton } from "./state";

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

export function startPlayingSound(audio: AudioState, b: CanvasButton): void {

  let osc: OscillatorNode | undefined = audio.context.createOscillator();
  if (!osc) {
    throw Error("Failed to create oscillator node");
  }
  osc.type = "square";
  osc.connect(audio.gainNode);

  switch (b) {
    case "BlueButton":
      osc.frequency.value = 329.628;
      break;
    case "YellowButton":
      osc.frequency.value = 277.183;
      break;
    case "RedButton":
      osc.frequency.value = 440;
      break;
    case "GreenButton":
      osc.frequency.value = 164.814;
      break;
    default:
      return;
  }

  osc.start();
  audio.playingSound = osc;

}

export function stopPlayingSound(audio: AudioState): void {

  if (audio.playingSound) {
    audio.playingSound.stop();
    audio.playingSound = null;
  }

}
