let context: AudioContext;


run_when_document_ready(init);


type seconds = number;

function init(): void {

  try {

    context = new AudioContext();
    console.log("Context", context);

    } catch (e) {

    alert("Web Audio API is not supported in this browser");

  }

  let noteVol: GainNode = context.createGain();
  noteVol.gain.value = 0.1;
  noteVol.connect(context.destination);

  let razzVol: GainNode = context.createGain();
  razzVol.gain.value = 0.5;
  razzVol.connect(context.destination);

  let blue: OscillatorNode = createOsc(context, noteVol, 329.628);
  let yellow: OscillatorNode = createOsc(context, noteVol, 277.183);
  let red: OscillatorNode = createOsc(context, noteVol, 440);
  let green: OscillatorNode = createOsc(context, noteVol, 164.814);
  let razz: OscillatorNode = createOsc(context, razzVol, 42);

  let now: seconds = context.currentTime;
  let dur: seconds = 0.5;
  let gap: seconds = 0.05;
  scheduleNote(red,    now,                     now +     dur);
  scheduleNote(blue,   now +     dur +     gap, now + 2 * dur +     gap);
  scheduleNote(yellow, now + 2 * dur + 2 * gap, now + 3 * dur + 2 * gap);
  scheduleNote(green,  now + 3 * dur + 3 * gap, now + 4 * dur + 3 * gap);
  scheduleNote(razz,   now + 4 * dur + 4 * gap, now + 6 * dur + 4 * gap);

}

function createOsc(c: AudioContext, v: GainNode, freq: number): OscillatorNode {

  let osc: OscillatorNode = context.createOscillator();
  osc.type = "square";
  osc.connect(v);
  osc.frequency.value = freq;

  return osc;

}

function scheduleNote(osc: OscillatorNode, start: seconds, stop: seconds): void {
  osc.start(start);
  osc.stop(stop);
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
