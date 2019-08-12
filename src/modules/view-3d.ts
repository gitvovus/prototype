import { computed, observable, reaction } from 'mobx';
import * as THREE from 'three';

import * as svg from '@/lib/svg';
import { List } from '@/lib/reactive';
import { Scene } from '@/modules/scene';
import { CameraType } from '@/modules/types';

import source from '!!raw-loader!@/assets/overlay.svg';

export class View3d extends List<string> {
  @observable public scene!: Scene;
  @observable public cameraType = CameraType.PERSPECTIVE;

  @observable public root: svg.Item;

  private overlay: svg.Item;
  private azimuth: svg.Item;

  private element!: HTMLElement;
  private disposers: Array<() => void> = [];

  public constructor() {
    super(['bicubic', 'mockup'], 1);
    this.root = svg.fromSource(source)!;
    this.overlay = this.root.find('overlay')!;
    this.azimuth = this.root.find('azimuth')!;
  }

  @computed public get demo() {
    return this.scene && this.scene.demo;
  }

  public mount(element: HTMLElement) {
    this.element = element;
    const canvas = element.getElementsByClassName('v3-canvas')[0] as HTMLCanvasElement;
    this.scene = new Scene(element, canvas);
    this.disposers = [
      reaction(
        () => this.selectedItem,
        () => this.scene.load(this.selectedItem!),
        { fireImmediately: true },
      ),
      reaction(
        () => this.cameraType,
        () => this.scene.setCameraType(this.cameraType),
        { fireImmediately: true },
      ),
      reaction(
        () => this.scene.transform,
        this.updateTransform,
        { fireImmediately: true },
      ),
    ];
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  public unmount() {
    window.removeEventListener('resize', this.resize);
    this.element = undefined!;
    this.disposers.forEach(disposer => disposer());
    this.disposers = [];
    if (this.scene) {
      this.scene.dispose();
      this.scene = undefined!;
    }
  }

  private updateTransform = (transform: THREE.Matrix4) => {
    const elements = transform.elements;
    const angle = Math.atan2(elements[1], elements[0]) * 180 / Math.PI;
    this.azimuth.attributes.transform = `rotate(${angle})`;
  }

  private resize = () => {
    const width = this.element.clientWidth;
    const height = this.element.clientHeight;
    this.root.attributes.viewBox = `${-width / 2} ${-height / 2} ${width} ${height}`;
    this.overlay.attributes.transform = `translate(${ 100 - width / 2} ${height / 2 - 100})`;
  }
}
