/*
 * Utiity functions
 *
 */

import constants from "./constants";
import { Duration } from "./duration";

/** Run the given function when document load is complete */
export function runWhenDocumentReady(fn: () => void): void {

  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }

}

/** Used in default clauses of switch statements where the compiler should be able to tell that the
 * cases are exhaustive. Taken from https://github.com/Microsoft/TypeScript/pull/9163#issuecomment-226038986
 */
export function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}

/** Distance between two points */
export function dist(x1: number, y1: number, x2: number, y2: number): number {

  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

}

/** Return the rendering context from the given canvas, throws on failure  */
export function getContext2D(cvs: HTMLCanvasElement): CanvasRenderingContext2D {
  let c: CanvasRenderingContext2D | null = cvs.getContext("2d");
  if (c) {
    return c;
  } else {
    throw Error("Cannot get canvas context");
  }
}


/** Log click event and how we handle it to console */
export function eventLog(triggerName: string | undefined | null, target: string | undefined | null, action: string): void {

  if (constants.logging) {
    console.log(padTo(triggerName, 6), padTo(target, 12), ":", action);
  }

}

/** Log calll event  */
export function stepLog(stepName: string | undefined | null, message: string): void {

  if (constants.logging) {
    console.log(padTo(stepName, 6), padTo((Date.now() % 100000).toString(), 12), ":", message);
  }

}

/** Log anything */
export function log(...args: any[]): void {

  if (constants.logging) {
    console.log.apply(console, [padTo("", 6)].concat(args));
  }

}

/** Right-pad the string with spaces to reach the given length */
function padTo(s: string | undefined | null, n: number): string {

  if (s === null) {
    s = "null";
  } else if (s === undefined) {
    s = "undefined";
  }

  let pad: number = n - s.length;
  return pad > 0 ? s + "                ".substr(0, pad) : s;

}

/** Wrapped version of setTimeout which takes a Duration (or null for zero) and reverses argument order */
export function timeout(dur: Duration | null, cb: () => void): void {
  setTimeout(cb, dur === null ? 0 : dur.millseconds(), cb);
}
