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

/** Fill a rectangle of given width and height, centred on given centre */
export function centredFilledRectangle(ctx: CanvasRenderingContext2D, w: number, h: number, fillStyle: string): void {

  ctx.save();
  ctx.fillStyle = fillStyle;
  ctx.fillRect(- w / 2,  - h / 2, w, h);
  ctx.restore();

}

/** Fill a circle of given radius on given centre */
export function centredFilledCircle(ctx: CanvasRenderingContext2D, r: number, fillStyle: string): void {

  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, r, 0 , 2 * Math.PI);
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.restore();

}

/** Fill a quadrant of the circle of given radius around given centre. Quadrants numbered 0 to 3 clockwise from top-right */
export function centredFilledQuadrant(ctx: CanvasRenderingContext2D, r: number, q: number, fillStyle: string): void {

  q = q % 4;
  let vertDir: number = q === 1 || q === 2 ? 1 : -1;
  let horizDir: number = q === 0 || q === 1 ? 1 : -1;

  ctx.save();

  ctx.beginPath();
  ctx.moveTo(0,            0);
  ctx.lineTo(0,            vertDir * r);
  ctx.lineTo(horizDir * r, vertDir * r);
  ctx.lineTo(horizDir * r, 0);
  ctx.lineTo(0,            0);
  ctx.clip();

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, 2 * Math.PI);
  ctx.fillStyle = fillStyle;
  ctx.fill();

  ctx.restore();

}
