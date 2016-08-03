/*
 * Functions to draw onto the canvas. Functions simply operate on the given
 * canvas context (which they preserve) and have no game or state logic.
 *
 */

/** Fill a rectangle of given width and height that is centred on given coordinates */
export function fillCentredRectangle(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  fillStyle: string): void {

  ctx.save();
  ctx.fillStyle = fillStyle;
  ctx.fillRect(x - w / 2,  y - h / 2, w, h);
  ctx.restore();

}

/** Fill a circle of given radius that is centered of given coordinates */
export function fillCentredCircle(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, r: number,
  fillStyle: string, alpha?: number): void {

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0 , 2 * Math.PI);
  ctx.fillStyle = fillStyle;
  if (alpha) {
    ctx.globalAlpha = alpha;
  }
  ctx.fill();
  ctx.restore();

}

/** Fill a circle of given radius that is centered of given coordinates first with
 * background fill style (and 100% alpha) then with given fillstyle and alpha
*/
export function fillCentredCircleCleanAlpha(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, r: number,
  bgFillStyle: string, fillStyle: string, alpha: number): void {

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0 , 2 * Math.PI);
  ctx.fillStyle = bgFillStyle;
  ctx.fill();
  ctx.fillStyle = fillStyle;
  ctx.globalAlpha = alpha;
  ctx.fill();
  ctx.restore();

}

/** Draw given text centred on coordinate */
export function centredText(ctx: CanvasRenderingContext2D, x: number, y: number, t: string, font: string): void {

  ctx.save();
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(t, x, y);
  ctx.restore();

}


/** Fill the note button shape (a quadrant with missing borders along axis and the middle) centred on the origin
 * twice: once with background fill style (and 100% alpha) and then with given fillstyle and alpha
 */
export function fillNoteButtonShapeCleanAlpha(
  ctx: CanvasRenderingContext2D,
  quadrant: number, // numbered clockwise 0..3 starting at bottom-right
  rIn: number, // Inside radius
  rOut: number, // Outside radius
  offset: number, // Perpendicular distance from vertices to nearest axis
  bgFillStyle: string, fillStyle: string, alpha: number
  ): void {

  /** Angle to axis of an inside vertex of the note button */
  let thetaIn: number = Math.atan2(offset, rIn);

  /** Angle to axis of an outside vertex of the note button */
  let thetaOut: number = Math.atan2(offset, rOut);

  /** Angle to rotate the whole button to be in the approprate quadrant */
  let thetaRotate: number = (quadrant % 4) * Math.PI / 2;

  ctx.save();
  ctx.beginPath();

  moveToPolar(ctx, rIn, thetaIn + thetaRotate);
  lineToPolar(ctx, rOut, thetaOut + thetaRotate);
  ctx.arc(0, 0, rOut, thetaOut + thetaRotate, Math.PI * 0.5 - thetaOut + thetaRotate);
  lineToPolar(ctx, rIn, Math.PI * 0.5 - thetaIn + thetaRotate);
  ctx.arc(0, 0, rIn, Math.PI * 0.5 - thetaIn + thetaRotate, thetaIn + thetaRotate, true);

  ctx.fillStyle = bgFillStyle;
  ctx.fill();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.restore();

}

/** Helper function to move to given location in polar coordinated */
function moveToPolar(ctx: CanvasRenderingContext2D, r: number, theta: number): void {

  ctx.moveTo(r * Math.cos(theta), r * Math.sin(theta));

}

/** Helper function to add a line to the given location in polar coordinates */
function lineToPolar(ctx: CanvasRenderingContext2D, r: number, theta: number): void {

  ctx.lineTo(r * Math.cos(theta), r * Math.sin(theta));

}


