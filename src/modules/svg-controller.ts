import { action, computed, observable, reaction } from 'mobx';
import * as std from '@/lib/std';
import * as svg from '@/lib/svg';

type Vector = [number, number];
type Matrix = [number, number, number, number, number, number];

function mulMV(m: Matrix, v: Vector): Vector {
  return [
    m[0] * v[0] + m[2] * v[1] + m[4],
    m[1] * v[0] + m[3] * v[1] + m[5],
  ];
}

function mulMM(a: Matrix, b: Matrix): Matrix {
  return [
    a[0] * b[0] + a[2] * b[1],
    a[1] * b[0] + a[3] * b[1],
    a[0] * b[2] + a[2] * b[3],
    a[1] * b[2] + a[3] * b[3],
    a[0] * b[4] + a[2] * b[5] + a[4],
    a[1] * b[4] + a[3] * b[5] + a[5],
  ];
}

function translate(x: number, y: number): Matrix {
  return [1, 0, 0, 1, x, y];
}

function scale(s: number): Matrix {
  return [s, 0, 0, s, 0, 0];
}

function inverse(m: Matrix): Matrix {
  const k = 1 / (m[0] * m[3] - m[1] * m[2]);
  return [
    m[3] * k,
    -m[1] * k,
    -m[2] * k,
    m[0] * k,
    (m[2] * m[5] - m[3] * m[4]) * k,
    (m[1] * m[4] - m[0] * m[5]) * k,
  ];
}

function toAttribute(m: Matrix) {
  return `matrix(${m[0]} ${m[1]} ${m[2]} ${m[3]} ${m[4]} ${m[5]})`;
}

export class Controller {
  @observable public width = 0;
  @observable public height = 0;
  @observable public offsetX = 0;
  @observable public offsetY = 0;
  @observable public scale = 1;

  private model!: svg.Svg;
  private scene!: svg.G;
  private root!: HTMLElement;

  private picked = { x: 0, y: 0 };
  private dragging = false;
  private disposers: Array<() => void> = [];

  public constructor(model: svg.Svg) {
    this.model = model;
    for (const item of model.items) {
      if ((item as any).id === 'scene') {
        this.scene = item as svg.G;
      }
    }
  }

  @computed public get transform() {
    return mulMM(translate(this.offsetX, this.offsetY), scale(this.scale));
  }

  @computed public get viewBox() {
    return `0 0 ${this.width} ${this.height}`;
  }

  @computed public get viewTransform() {
    return translate(this.width / 2, this.height / 2);
  }

  public activate(root: HTMLElement) {
    this.root = root;
    this.root.addEventListener('pointerdown', this.pick);
    this.root.addEventListener('pointermove', this.drag);
    this.root.addEventListener('pointerup', this.drop);
    this.root.addEventListener('wheel', this.wheel);
    this.root.addEventListener('keydown', this.keyDown);
    this.disposers = [
      reaction(
        () => [this.viewBox, this.transform],
        () => this.update(),
        { fireImmediately: true },
      ),
    ];
  }

  public dispose() {
    this.disposers.forEach(disposer => disposer());
    this.disposers = [];
    this.root.removeEventListener('pointerdown', this.pick);
    this.root.removeEventListener('pointermove', this.drag);
    this.root.removeEventListener('pointerup', this.drop);
    this.root.removeEventListener('wheel', this.wheel);
    this.root.removeEventListener('keydown', this.keyDown);
  }

  @action public resize() {
    this.width = this.root.clientWidth;
    this.height = this.root.clientHeight;
  }

  private update() {
    this.model.viewBox = this.viewBox;
    this.model.width = this.width;
    this.model.height = this.height;
    this.scene.transform = toAttribute(mulMM(this.transform, this.viewTransform));
  }

  @action private reset() {
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  @action private zoom(x: number, y: number, k: number) {
    const dx = (x - this.offsetX) / this.scale;
    const dy = (y - this.offsetY) / this.scale;
    this.scale = std.clamp(this.scale * k, 0.25, 4);
    this.move(x - dx * this.scale, y - dy * this.scale);
  }

  @action private move(x: number, y: number) {
    this.offsetX = x;
    this.offsetY = y;
  }

  private pick = (e: PointerEvent) => {
    if (e.buttons & 1) {
      e.preventDefault();
      this.root.focus();
      this.picked.x = e.offsetX - this.offsetX;
      this.picked.y = e.offsetY - this.offsetY;
      this.dragging = true;
      this.root.setPointerCapture(e.pointerId);
    }
  }

  private drag = (e: PointerEvent) => {
    if (this.dragging) {
      this.move(e.offsetX - this.picked.x, e.offsetY - this.picked.y);
    }
  }

  private drop = (e: PointerEvent) => {
    if (!(e.buttons & 1)) {
      this.dragging = false;
      this.root.releasePointerCapture(e.pointerId);
    }
  }

  private wheel = (e: WheelEvent) => {
    const k = Math.sign(e.deltaY) < 0 ? 1.1 : 1 / 1.1;
    this.zoom(e.offsetX, e.offsetY, k);
  }

  private keyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'Space':
        this.reset();
        break;
    }
  }
}
