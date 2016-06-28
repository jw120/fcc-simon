/** Utiity function */

/** Run the given function when document load is complete */
export function run_when_document_ready(fn: () => void): void {

  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }

}
