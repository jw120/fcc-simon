/*
 * Provide lightly structured output to console.log() switched on by either
 * DEBUG environment variable existing or the localstorage debug string existing and not being empty, "0" or "false" (case insensitive)
 *
 * We use the format console.log("%s %f", "Hi", 2) instead of just console.log("Hi", 2) as the latter shows across multi-lines in Safari
 *
 * Intended use within code:
 *  import * as consoleLog from "consoleLog";
 *  consoleLog.fixed([10, 10], "A", "B", "C"); // pads the first two fields to 10 spaces (and truncates if longer)
 *  consoleLog.free("A", "B", "C"); // space sepearated
 *
 * Then to active logging under node:
 *  DEBUG=YES node prog.js
 *
 * Or to activate in the browser, use (in the console window)
 *  window.localStorage.settItem("debug", 1)
 * And to deactivate
 *  window.localStorage.setItem("debug", 0)
 *
 * Disadvantages of this module
 *  - In browser logging shows the filename of the line number of the fuction in this file, not the caller
 *  - In Safari, the font is not fixed width so the fixed() function has little impact
 *
 */

/** If debugging activated, pass all the argyments as a substituted string to console.log after padding/truncating to given widths (if non-zero) */
export function fixed(widths: number[], ...args: any[]): void {
  if (debugging()) {
    let paddedArgs: string[] = args.map((x: any, i: number): string => padTo(expandUN(x), widths[i]));
    console.log.apply(console, [typeTemplate(paddedArgs)].concat(paddedArgs));
  }
}


/** If debugging is activated, pass all the arguments as a substituted string to console.log */
export function free(...args: any[]): void {

  if (debugging()) {
    console.log.apply(console, [typeTemplate(args)].concat(args));
  }

}

/** We are not building with the node.d.ts (as we don't really use node), so need to declare this for typescript */
declare var process: { env: any };

/** Helper function to see if debugging has been turned on by localStorage or environment variable */
function debugging(): boolean {
  if (typeof window !== "undefined" && window.localStorage)  {
    let d: string = window.localStorage.getItem("debug");
    return d !== null && d !== "" && d !== "0" && d.toLowerCase() !== "false";
  }
  if (typeof process !== "undefined" && process.env && process.env.DEBUG) {
    return true;
  }
  return false;
}

/** Helper function to turn undefined and null into a string, passing through anything else */
function expandUN(s: any): any {
  if (s === null) {
    return "null";
  } else if (s === undefined) {
    return "undefined";
  }
  return s;
}

/** Helper function to truncate or right-pad the string (with spaces) to given width; does nothing if width is non-positive or argument */
function padTo(x: any, width: number | undefined): string {

  if (!width || width <= 0) {
    return x;
  }

  let s: string = x.toString();

  let paddingNeeded: number = width - s.length;
  if (paddingNeeded > 0) {
    return s + "                                                                      ".substr(0, paddingNeeded);
  } else {
    return s.substr(0, width);
  }

}

/** Helper function to provide a template for console.log string substitution based on the types of the given arguments */
function typeTemplate(args: any[]): string {
  return args.map((x: any): string => {
    switch (typeof x) {
      case "string":
      case "undefined":
      case "null":
        return "%s";
      case "number":
        return "%f";  // There is also a %i available for integers, but we just use the float template for all numbers
      default:
        return "%o";
    }
  }).join(" ");
}

