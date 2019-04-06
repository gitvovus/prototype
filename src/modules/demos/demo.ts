import { observable } from 'mobx';
import * as THREE from 'three';

import * as models from '@/modules/models';
import { Orbiter } from '@/modules/orbiter';

export class Demo {
  @observable public model!: models.Item;
  protected scene!: THREE.Scene;
  protected camera!: THREE.Camera;
  protected canvas!: HTMLCanvasElement;
  protected viewer!: Orbiter;

  public constructor(scene: THREE.Scene, camera: THREE.Camera, canvas: HTMLCanvasElement) {
    this.scene = scene;
    this.camera = camera;
    this.canvas = canvas;
    this.viewer = new Orbiter(canvas);
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
}
