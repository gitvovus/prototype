import * as img from '@/lib/images';
import * as std from '@/lib/std';
import * as msg from '@/modules/messages';

function saw(x: number) {
  const t = 0.5 * x;
  return Math.abs(t - Math.floor(t) - 0.5) * 2;
}

async function flower(radius: number, petals: number, t: number) {
  return createImageBitmap(img.generate(2 * radius, 2 * radius, (ix, iy) => {
    const x = ix + 0.5 - radius;
    const y = iy + 0.5 - radius;
    const r = Math.hypot(x, y);
    const phi = Math.atan2(y, x);

    const a = petals * phi / Math.PI;
    const b = petals * phi / Math.PI + 1;
    const c = petals * phi / Math.PI + 1;
    const f = [
      (saw(a) ** 0.3 + 0.5) * radius * 0.65,
      (saw(b) ** (0.2 + 0.5 * t) + 0.5) * radius * (4 + t) * 0.13,
      (2 - saw(c) ** (1 + 3 * t)) * radius * (3 + t) * 0.08,
    ];

    const rgba: img.RGBA[] = [
      [0, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 1, 1, 0],
    ];

    for (let i = 0; i < f.length; ++i) {
      if (r > f[i]) {
        rgba[i][3] = std.smoothStep(f[i] + 3, f[i], r);
      } else {
        rgba[i][3] = r / f[i];
      }
    }

    for (let i = 1; i < f.length; ++i) {
      for (let j = 0; j < 3; ++j) {
        rgba[0][j] = rgba[0][j] * (1 - rgba[i][3]) + rgba[i][j] * rgba[i][3];
      }
      rgba[0][3] = 1 - (1 - rgba[0][3]) * (1 - rgba[i][3]);
    }

    for (let i = 0; i < 4; ++i) { rgba[0][i] *= 255; }
    return rgba[0];
  }));
}

const context: Worker = self as any;
context.onmessage = async (e: MessageEvent) => {
  if (e.data.type === 'flower') {
    const request: msg.FlowerRequest = e.data;
    const image = await flower(request.radius, request.petals, request.t);
    context.postMessage({ ...request, image }, [image]);
  } else {
    console.log('[image-generator] unknown request:', e.data);
  }
};
