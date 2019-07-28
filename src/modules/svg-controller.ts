import { action, computed, observable, reaction } from 'mobx';
import * as std from '@/lib/std';
import { Svg } from '@/lib/svg/svg';

export class Controller {
  @observable public left = 0;
  @observable public top = 0;

  private model!: Svg;

  @observable private baseWidth = 500;
  @observable private baseHeight = 500;

  private readonly zoomRange = 4;
  private readonly scaleRange = 15;
  @observable private scaleIndex = 0;

  private root!: HTMLElement;
  private picked = { x: 0, y: 0 };
  private dragging = false;
  private disposers: Array<() => void> = [];

  public constructor(model: Svg) {
    this.model = model;
  }

  @computed get scale() {
    return this.zoomRange ** (this.scaleIndex / this.scaleRange);
  }

  @computed public get width() {
    return this.baseWidth * this.scale;
  }

  @computed public get height() {
    return this.baseHeight * this.scale;
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
        () => [this.width, this.height],
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
    this.baseWidth = this.root.clientWidth;
    this.baseHeight = this.root.clientHeight;
  }

  private center() {
    const rect = this.root.getBoundingClientRect();
    this.move(0.5 * (rect.width - this.width), 0.5 * (rect.height - this.height));
  }

  @action private zoom(x: number, y: number, delta: number) {
    const dx = (x - this.left) / this.scale;
    const dy = (y - this.top) / this.scale;
    this.scaleIndex = std.clamp(this.scaleIndex + delta, -this.scaleRange, this.scaleRange);
    this.move(x - dx * this.scale, y - dy * this.scale);
  }

  @action private move(left: number, top: number) {
    const rect = this.root.getBoundingClientRect();
    const minLeft = Math.min(0, 0.5 * rect.width - this.width);
    const maxLeft = Math.max(0.5 * rect.width, rect.width - this.width);
    const minTop = Math.min(0, 0.5 * rect.height - this.height);
    const maxTop = Math.max(0.5 * rect.height, rect.height - this.height);
    this.left = std.clamp(left, minLeft, maxLeft);
    this.top = std.clamp(top, minTop, maxTop);
  }

  @action private update() {
    this.model.width = this.width;
    this.model.height = this.height;
  }

  private pick = (e: PointerEvent) => {
    if (e.buttons & 1) {
      e.preventDefault();
      this.root.focus();
      const rect = this.root.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      this.picked.x = offsetX - this.left;
      this.picked.y = offsetY - this.top;
      this.dragging = true;
      this.root.setPointerCapture(e.pointerId);
    }
  }

  private drag = (e: PointerEvent) => {
    if (this.dragging) {
      const rect = this.root.getBoundingClientRect();
      this.move(e.clientX - rect.left - this.picked.x, e.clientY - rect.top - this.picked.y);
    }
  }

  private drop = (e: PointerEvent) => {
    if (!(e.buttons & 1)) {
      this.dragging = false;
      this.root.releasePointerCapture(e.pointerId);
    }
  }

  private wheel = (e: WheelEvent) => {
    const rect = this.root.getBoundingClientRect();
    this.zoom(e.clientX - rect.left, e.clientY - rect.top, -Math.sign(e.deltaY));
  }

  private keyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'Space':
        this.scaleIndex = 0;
        this.center();
        break;
    }
  }
}
