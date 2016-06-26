import { Note } from "./game";

let context: AudioContext;


run_when_document_ready(init);


type seconds = number;

function init(): void {

  try {

    context = new AudioContext();

    } catch (e) {

    alert("Web Audio API is not supported in this browser");

  }

  let noteGain: GainNode = context.createGain();
  noteGain.gain.value = 0.1;
  noteGain.connect(context.destination);

  let razzGain: GainNode = context.createGain();
  razzGain.gain.value = 0.5;
  razzGain.connect(context.destination);

  // let blue: OscillatorNode = createOsc(context, noteVol, 329.628);
  // let yellow: OscillatorNode = createOsc(context, noteVol, 277.183);
  // let red: OscillatorNode = createOsc(context, noteVol, 440);
  // let green: OscillatorNode = createOsc(context, noteVol, 164.814);
  // let razz: OscillatorNode = createOsc(context, razzVol, 42);

  // let now: seconds = context.currentTime;
  let dur: seconds = 0.5;
  // let gap: seconds = 0.05;
  // scheduleNote(red,    now,                     now +     dur);
  // scheduleNote(blue,   now +     dur +     gap, now + 2 * dur +     gap);
  // scheduleNote(yellow, now + 2 * dur + 2 * gap, now + 3 * dur + 2 * gap);
  // scheduleNote(green,  now + 3 * dur + 3 * gap, now + 4 * dur + 3 * gap);
  // scheduleNote(razz,   now + 4 * dur + 4 * gap, now + 6 * dur + 4 * gap);

  // playThen(red, dur, () => {
  //   playThen(blue, dur, () => {
  //     playThen(yellow, dur);
  //   });
  // });

  playArray(["Red", "Yellow", "Red", "Green", "Red", "Blue"], noteGain, dur);

}

// function createOsc(c: AudioContext, v: GainNode, freq: number): OscillatorNode {

//   let osc: OscillatorNode = context.createOscillator();
//   osc.type = "square";
//   osc.connect(v);
//   osc.frequency.value = freq;

//   return osc;

// }

// function scheduleNote(osc: OscillatorNode, start: seconds, stop: seconds): void {
//   osc.start(start);
//   osc.stop(stop);
// }

// function playThen(osc: OscillatorNode, duration: seconds, cb?: () => void): void {
//   osc.start();
//   osc.stop(osc.context.currentTime + duration);
//   if (cb !== undefined) {
//     osc.onended = cb;
//   }
// }

function playArray(os: Note[], gain: GainNode, duration: seconds, currentNote: number = 0): void {

  if (currentNote <= os.length) {

    let osc: OscillatorNode = createOscillator(gain, os[currentNote]);
    osc.start();
    osc.stop(gain.context.currentTime + duration);
    osc.onended = () => playArray(os, gain, duration, currentNote + 1);

  }

}

function createOscillator(gain: GainNode, note: Note): OscillatorNode {

  let osc: OscillatorNode = gain.context.createOscillator();
  osc.type = "square";
  osc.connect(gain);
  switch (note) {
    case "Blue":
      osc.frequency.value = 329.628;
      break;
    case "Yellow":
      osc.frequency.value = 277.183;
      break;
    case "Red":
      osc.frequency.value = 440;
      break;
    case "Green":
      osc.frequency.value = 164.814;
      break;
    default:
      throw ("Bad value in createOscillaor switch: " + note);
  }

  return osc;

}


/*
 *
 * Library functions
 *
 */


/** Run the given function when document load is complete */
function run_when_document_ready(fn: () => void): void {

  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }

}
