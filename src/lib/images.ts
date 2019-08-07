export type RGB = [number, number, number];
export type RGBA = [number, number, number, number];

/**
 * Generates image data with given size, using generator function.
 * @param width image width.
 * @param height image height.
 * @param f generator function, should accept (x, y) pixel coordinaates, and return rgba value.
 * @returns ImageData.
 */
export function generate(width: number, height: number, f: (x: number, y: number) => RGBA) {
  const image = new ImageData(width, height);
  const data = image.data;
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const i = 4 * (y * width + x);
      [data[i], data[i + 1], data[i + 2], data[i + 3]] = f(x, y);
    }
  }
  return image;
}

/**
 * Converts ImageData to data URL, that can be used as source for html <img> element.
 * @param data IamgeData.
 * @returns string, representing data URL.
 */
export function fromImageData(data: ImageData) {
  const canvas = document.createElement('canvas');
  canvas.width = data.width;
  canvas.height = data.height;
  const c = canvas.getContext('2d', { alpha: true })!;
  c.putImageData(data, 0, 0);
  return canvas.toDataURL();
}

/**
 * Converts ImageBitmap to data URL, that can be used as source for html <img> element.
 * @param data ImageBitmap.
 * @returns string, representing data URL.
 */
export function fromImageBitmap(data: ImageBitmap) {
  const canvas = document.createElement('canvas');
  canvas.width = data.width;
  canvas.height = data.height;
  const c = canvas.getContext('2d', { alpha: true })!;
  c.drawImage(data, 0, 0);
  return canvas.toDataURL();
}

/**
 * Generates image, representing given function graph.
 * @param width image width.
 * @param height image height.
 * @param x0 lower bound of function argument.
 * @param y0 lower bound of function value.
 * @param x1 upper bound of function argument.
 * @param y1 upper bound of function value.
 * @param f function, accepting single argument.
 * @returns ImageData with black pixels below function graph, and white pixels above graph.
 */
export function plot(
  width: number, height: number,
  x0: number, y0: number, x1: number, y1: number, f: (x: number) => number) {
  return generate(width, height, (x, y) => {
    const a = x0 + (x + 0.5) * (x1 - x0) / width;
    const b = height - (f(a) - y0) * height / (y1 - y0);
    return y > b ? [0, 0, 0, 255] : [255, 255, 255, 255];
  });
}

/**
 * Converts (h, s, v) to (r, g, b)
 * @see https://stackoverflow.com/questions/17242144
 * @param h h
 * @param s s
 * @param v v
 * @returns [r, g, b]
 */
export function hsv2rgb(h: number, s: number, v: number): [number, number, number] {
  let r: number = 0;
  let g: number = 0;
  let b: number = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255),
  ];
}

/**
 * Calculates approximate spectrum [r, g, b] value, for given argument in interval [0, 1]
 * 0 corresponds to red end of spectrum, 1 corresponds to violet end of spectrum.
 * @param x argument in range [0, 1]
 * @returns calculated [r, g, b] value.
 */
export function spectrum(x: number) {
  return hsv2rgb(0.85 * x, 1, 1);
}

/**
 * For given argument and function, calculates cubic interpolated value.
 * @see https://www.paulinternet.nl/?page=bicubic
 * @param x argument value, should belong to interval [0, 1]
 * @param f function, defined for argument values in { -1, 0, 1, 2 }
 * @returns calculated value.
 */
export function cubic(x: number, f: (x: number) => number) {
  const a = f(-1);
  const b = f(0);
  const c = f(1);
  const d = f(2);
  return b + 0.5 * x * (c - a + x * (2 * a - 5 * b + 4 * c - d + x * (3 * (b - c) + d - a)));
}

/**
 * For given arguments and function, calculates bicubic interpolated value.
 * @see https://www.paulinternet.nl/?page=bicubic
 * @param x x argument value, should belong to interval [0, 1]
 * @param y y argument value, should belong to interval [0, 1]
 * @param f function, defined for both argument values in { -1, 0, 1, 2 }
 * @returns calculated value.
 */
export function bicubic(x: number, y: number, f: (x: number, y: number) => number) {
  const p = [
    cubic(x, x => f(x, -1)),
    cubic(x, x => f(x, 0)),
    cubic(x, x => f(x, 1)),
    cubic(x, x => f(x, 2)),
  ];
  return cubic(y, x => p[x + 1]);
}
