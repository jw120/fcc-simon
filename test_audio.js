
/**
 * Simple test programme to diagnose problems with Safari when having a synthesized sound that
 * stops after either a 2 second timeout or a stopped by a click.
 *
 * Programme starts a sound when window is clicked and the sound stops either after 2 seconds or a second click. Repeats
 * this pattern alternately in two modes:
 *      TimedStop - uses .stop(time) to stop the note
 *      TimeOut - uses setTimeout() to call .stop() to stop the note
 *
 * Chrome - both work , only the latter works on Safari
 *
 * Safari - fails whe calling .stop() from click handler using TimedStop with error below (and without stopping the sound)
 * InvalidStateError: DOM Exception 11: An attempt was made to use an object that is not, or is no longer, usable.
 *
 */


"use strict";

var context, gainNode, osc, isPlaying;
var useTimedStop = false;

runWhenDocumentReady(function () {
    context = ("AudioContext" in window) ? new AudioContext() : new webkitAudioContext();
    gainNode = context.createGain();
    gainNode.gain.value = 0.1;
    gainNode.connect(context.destination);

    window.addEventListener("click", function () {

        if (!isPlaying) {
            console.log("Starting sound and using a " + (useTimedStop ? "timed stop(delay)" : "setTimeout triggered stop()"));
            osc = context.createOscillator();
            osc.type = "square";
            osc.connect(gainNode);
            osc.frequency.value = 44;
            osc.start();
            isPlaying = true;

            if (useTimedStop) {
                osc.stop(context.currentTime + 2);
                osc.onended = function () {
                    if (isPlaying) {
                        console.log("stopped from stop(time)");
                        isPlaying = false;
                        useTimedStop = !useTimedStop;
                    } else {
                        console.log("stopped from click - do nothing")
                    }
                };
            } else {
                setTimeout(function () {
                    if (isPlaying) {
                        console.log("Timeout stop");
                        osc.stop();
                        isPlaying = false;
                        useTimedStop = !useTimedStop;
                    } else {
                        console.log("Timeout stop skipped as not playing");
                    }
                }, 2000);
            }

        } else {

            console.log("Click triggered stop");
            osc.stop(context.currentTime); // Safari fails on this line with TimedStop
            isPlaying = false;
            useTimedStop = !useTimedStop;

        }
    });
});

function runWhenDocumentReady(fn) {
    if (document.readyState !== "loading") {
        fn();
    }
    else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

