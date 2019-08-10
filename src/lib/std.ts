export function assert(assertion: any, message?: any) {
  if (!assertion) {
    console.log(message);
    debugger;
  }
}

export function clamp(x: number, min: number, max: number): number {
  return Math.min(Math.max(x, min), max);
}

export function mix(a: number, b: number, x: number) {
  return a + (b - a) * x;
}

export function step(a: number, x: number): number {
  return x < a ? 0 : 1;
}

export function smoothStep(a: number, b: number, x: number): number {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
}

export type Vector2Elements = [number, number];
export type Matrix2x3Elements = [number, number, number, number, number, number];

export class Vector2 {
  public elements: Vector2Elements;

  public constructor(elements?: Vector2Elements) {
    this.elements = elements ? elements : [0, 0];
  }

  public get x() {
    return this.elements[0];
  }

  public set x(value: number) {
    this.elements[0] = value;
  }

  public get y() {
    return this.elements[1];
  }

  public set y(value: number) {
    this.elements[1] = value;
  }
}

export class Matrix2x3 {
  public static translation(x: number, y: number): Matrix2x3 {
    return new Matrix2x3([1, 0, 0, 1, x, y]);
  }

  public static scale(s: number): Matrix2x3 {
    return new Matrix2x3([s, 0, 0, s, 0, 0]);
  }

  public static inverse(matrix: Matrix2x3): Matrix2x3 {
    const m = matrix.elements;
    const k = 1 / (m[0] * m[3] - m[1] * m[2]);
    return new Matrix2x3([
      m[3] * k,
      -m[1] * k,
      -m[2] * k,
      m[0] * k,
      (m[2] * m[5] - m[3] * m[4]) * k,
      (m[1] * m[4] - m[0] * m[5]) * k,
    ]);
  }

  public elements: Matrix2x3Elements;

  public constructor(elements?: Matrix2x3Elements) {
    this.elements = elements ? elements : [1, 0, 0, 1, 0, 0];
  }

  public multiply(m: Matrix2x3): Matrix2x3 {
    const a = this.elements;
    const b = m.elements;
    return new Matrix2x3([
      a[0] * b[0] + a[2] * b[1],
      a[1] * b[0] + a[3] * b[1],
      a[0] * b[2] + a[2] * b[3],
      a[1] * b[2] + a[3] * b[3],
      a[0] * b[4] + a[2] * b[5] + a[4],
      a[1] * b[4] + a[3] * b[5] + a[5],
    ]);
  }

  public transform(vector: Vector2): Vector2 {
    const m = this.elements;
    const v = vector.elements;
    return new Vector2([
      m[0] * v[0] + m[2] * v[1] + m[4],
      m[1] * v[0] + m[3] * v[1] + m[5],
    ]);
  }
}
