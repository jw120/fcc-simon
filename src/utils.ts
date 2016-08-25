/*
 * Utiity functions
 *
 */

import { Duration } from "./duration";
import * as consoleLog from "./consoleLog";

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

/** Wrapped version of setTimeout which takes a Duration (or null for zero) and reverses argument order */
export function timeout(dur: Duration | null, cb: () => void): void {
  setTimeout(cb, dur === null ? 0 : dur.millseconds(), cb);
}

export function eventLog(triggerName: string | null | undefined, target: string | null | undefined,  action: string | undefined): void {
  consoleLog.fixed([6, 0, 12, 0, 0], triggerName, " ", target, " : ", action);
}

export function stepLog(stepName: string | null | undefined, message: string | undefined): void {
  consoleLog.fixed([6, 0, 12, 0, 0], stepName, " ", (Date.now() % 100000).toString(), " : ", message);
}

export function log(...args: any[]): void {
  consoleLog.free.apply(null, args);
}
