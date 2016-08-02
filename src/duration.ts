/**
 * Module holding our Duration interface, used to avoid seconds vs milliseconds confusions
 *
 */

/** Interface used for all time intervals to avoid seconds/milliseconds confusions */
export interface Duration {
  seconds(): number;
  millseconds(): number;
}

/** Create a Duration object from a millisecond value */
export function ms(x: number): Duration {
  return {
    millseconds: () => x,
    seconds: () => x / 1000
  };
}
