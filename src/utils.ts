/** Utiity functions */

/** Run the given function when document load is complete */
export function run_when_document_ready(fn: () => void): void {

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
