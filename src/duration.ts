/**
 * Duration type used for time intervals. Used to reduce mistakes as setTimeout use milliseconds but
 * the audio interface uses seconds
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
