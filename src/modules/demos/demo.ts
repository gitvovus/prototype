import { observable } from 'mobx';
import * as THREE from 'three';

import * as utils from '@/lib/utils';
import * as models from '@/modules/models';
import { Orbiter } from '@/modules/orbiter';

export class Demo {
  @observable public model!: models.Item;
  protected scene!: THREE.Scene;
  protected camera!: THREE.Camera;
  protected element!: HTMLElement;
  protected viewer!: Orbiter;

  public constructor(scene: THREE.Scene, camera: THREE.Camera, element: HTMLElement) {
    this.scene = scene;
    this.camera = camera;
    this.element = element;
    this.viewer = new Orbiter(element);
  }

  public setCamera(camera: THREE.Camera) {
    this.camera = camera;
  }

  public update() {
    this.viewer.update(this.camera);
  }

  public dispose() {
    this.viewer.dispose();
  }

  protected xyFromEvent(e: PointerEvent) {
    const [x, y] = utils.currentTargetOffset(e);
    return {
      x: (x / this.element.clientWidth) * 2 - 1,
      y: (y / this.element.clientHeight) * -2 + 1,
    };
  }
}
