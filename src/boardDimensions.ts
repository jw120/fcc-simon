/*
 * Dimensions of the game board used by both board and event modules
 *
 */

export const blackStripeWidth: number = 10;
export const outerBorderOutsideRadius: number = 100;
export const outerBorderInsideRadius: number = outerBorderOutsideRadius - blackStripeWidth;
export const innerBorderInsideRadius: number = 30;
export const innerBorderOutsideRadius: number = innerBorderInsideRadius + 0.5 * blackStripeWidth;
export const centralButtonRadius: number = 5;
export const centralButtonRingRadius: number = 6;

export const flashDelay: number = 300; // milliseconds
export const finalFlashDelay: number = 800;

/** Duration of each note when we play the tune (in seconds) */
export const tuneNoteDuration: number = 2;

/** Duration of pause between each note when we play the tune (in millseconds) */
export const tuneGapDuration: number = 1000;
