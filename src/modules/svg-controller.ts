import { action, computed, observable, reaction } from 'mobx';
import * as std from '@/lib/std';
import * as svg from '@/lib/svg';
import * as utils from '@/lib/utils';

function toSvgMatrix(matrix: std.Matrix2x3) {
  const m = matrix.elements;
  return `matrix(${m[0]} ${m[1]} ${m[2]} ${m[3]} ${m[4]} ${m[5]})`;
}

export class Controller {
  @observable public width = 0;
  @observable public height = 0;
  @observable public offsetX = 0;
  @observable public offsetY = 0;
  @observable public scale = 1;

  private el!: HTMLElement;
  private root!: svg.Item;
  private scene!: svg.Item;
  private resetButton!: svg.Item;

  private picked = { x: 0, y: 0 };
  private dragging = false;
  private disposers: Array<() => void> = [];

  public constructor(model: svg.Item) {
    this.root = model;
    this.scene = model.find('scene')!;
    this.resetButton = model.find('center')!;
  }

  @computed public get transform() {
    return std.Matrix2x3.translation(this.offsetX, this.offsetY).multiply(std.Matrix2x3.scale(this.scale));
  }

  @computed public get viewBox() {
    return `0 0 ${this.width} ${this.height}`;
  }

  @computed public get viewTransform() {
    return std.Matrix2x3.translation(this.width / 2, this.height / 2);
  }

  public mount(el: HTMLElement) {
    this.el = el;
    this.el.addEventListener('pointerdown', this.pick);
    this.el.addEventListener('pointermove', this.drag);
    this.el.addEventListener('pointerup', this.drop);
    this.el.addEventListener('wheel', this.wheel);
    this.resetButton.on('pointerdown', this.stop);
    this.resetButton.on('click', this.reset);
    this.disposers = [
      reaction(
        () => [this.viewBox, this.transform],
        () => this.update(),
        { fireImmediately: true },
      ),
    ];
  }

  public unmount() {
    this.disposers.forEach(disposer => disposer());
    this.disposers = [];
    this.resetButton.off();
    this.el.removeEventListener('pointerdown', this.pick);
    this.el.removeEventListener('pointermove', this.drag);
    this.el.removeEventListener('pointerup', this.drop);
    this.el.removeEventListener('wheel', this.wheel);
  }

  @action public reset = () => {
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  @action public resize() {
    this.width = this.el.clientWidth;
    this.height = this.el.clientHeight;
  }

  @action public zoom(x: number, y: number, k: number) {
    const dx = (x - this.offsetX) / this.scale;
    const dy = (y - this.offsetY) / this.scale;
    this.scale = std.clamp(this.scale * k, 0.25, 4);
    this.move(x - dx * this.scale, y - dy * this.scale);
  }

  @action public move(x: number, y: number) {
    this.offsetX = x;
    this.offsetY = y;
  }

  private update() {
    this.root.attributes.viewBox = this.viewBox;
    this.root.attributes.width = this.width;
    this.root.attributes.height = this.height;
    this.scene.attributes.transform = toSvgMatrix(this.transform.multiply(this.viewTransform));
  }

  private stop = (e: Event) => e.stopPropagation();

  private pick = (e: PointerEvent) => {
    if (e.buttons & 1) {
      e.stopPropagation();
      const [offsetX, offsetY] = utils.currentTargetOffset(e);
      this.picked.x = offsetX - this.offsetX;
      this.picked.y = offsetY - this.offsetY;
      this.dragging = true;
      this.el.setPointerCapture(e.pointerId);
    }
  }

  private drag = (e: PointerEvent) => {
    if (this.dragging) {
      const [offsetX, offsetY] = utils.currentTargetOffset(e);
      this.move(offsetX - this.picked.x, offsetY - this.picked.y);
    }
  }

  private drop = (e: PointerEvent) => {
    if (!(e.buttons & 1)) {
      this.dragging = false;
      this.el.releasePointerCapture(e.pointerId);
    }
  }

  private wheel = (e: WheelEvent) => {
    const k = Math.sign(e.deltaY) < 0 ? 1.1 : 1 / 1.1;
    const [offsetX, offsetY] = utils.currentTargetOffset(e);
    this.zoom(offsetX, offsetY, k);
  }
}
