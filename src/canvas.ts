/** Helper functions to draw on canvas */

/** Return the rendering context from the given canvas, throws on failure  */
export function getContext2D(cvs: HTMLCanvasElement): CanvasRenderingContext2D {
  let c: CanvasRenderingContext2D | null = cvs.getContext("2d");
  if (c) {
    return c;
  } else {
    throw Error("Cannot get canvas context");
  }
}

/** Fill a rectangle of given width and height */
export function centredFilledRectangle(ctx: CanvasRenderingContext2D, w: number, h: number, fillStyle: string): void {

  ctx.save();
  ctx.fillStyle = fillStyle;
  ctx.fillRect(- w / 2,  - h / 2, w, h);
  ctx.restore();

}

/** Fill a circle of given radius e */
export function centredFilledCircle(ctx: CanvasRenderingContext2D, r: number, fillStyle: string): void {

  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, r, 0 , 2 * Math.PI);
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.restore();

}

/** Fill a circle of given radius on given centre */
export function outlinedFilledCircle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fillStyle: string, alpha?: number): void {

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0 , 2 * Math.PI);
  ctx.fillStyle = fillStyle;
  ctx.stroke();
  if (alpha) {
    ctx.globalAlpha = alpha;
  }
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


/** Fill a quadrant of the circle between given radii radius. Quadrants numbered 0 to 3 clockwise from top-right */
export function centredFilledQuadrant(ctx: CanvasRenderingContext2D, rOut: number, rIn: number, q: number, fillStyle: string, alpha?: number): void {

  q = q % 4;
  let vertDir: number = q === 1 || q === 2 ? 1 : -1;
  let horizDir: number = q === 0 || q === 1 ? 1 : -1;

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(0,               rIn);
  ctx.lineTo(0,               vertDir * rOut);
  ctx.lineTo(horizDir * rOut, vertDir * rOut);
  ctx.lineTo(horizDir * rOut, 0);
  ctx.lineTo(rIn,             0);
  ctx.arc(0, 0, 0, rIn, 2 * Math.PI);
  ctx.clip();

  ctx.beginPath();
  if (alpha) {
    ctx.globalAlpha = alpha;
  }
  ctx.arc(0, 0, rOut, 0, 2 * Math.PI);
  ctx.fillStyle = fillStyle;
  ctx.fill();

  ctx.restore();

}

export function drawNoteButton(
  ctx: CanvasRenderingContext2D,
  quadrant: number, // numbered clockwise 0..3 starting at bottom-right
  rIn: number, // Inside radius
  rOut: number, // Outside radius
  offset: number, // Perpendicular distance from vertices to nearest axis
  fillStyle: string,
  alpha: number
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

  ctx.globalAlpha = alpha;
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.restore();

}

function moveToPolar(ctx: CanvasRenderingContext2D, r: number, theta: number): void {
  // console.log("Move to", r * Math.cos(theta), r * Math.sin(theta));
  ctx.moveTo(r * Math.cos(theta), r * Math.sin(theta));
}

function lineToPolar(ctx: CanvasRenderingContext2D, r: number, theta: number): void {
  // console.log("Line to", r * Math.cos(theta), r * Math.sin(theta));
  ctx.lineTo(r * Math.cos(theta), r * Math.sin(theta));
}


