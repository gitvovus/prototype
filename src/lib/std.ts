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
