import * as THREE from 'three';

import * as geometry from '@/lib/geometry';
import * as models from '@/modules/models';
import { Orbiter } from '@/modules/orbiter';

import { Demo } from '@/modules/demos/demo';

class Model extends models.Item {
  public constructor() {
    super({ label: 'Reactor', icon: 'icon-tools' });
  }
}

export class Reactor extends Demo {
  private root!: THREE.Object3D;

  public constructor(scene: THREE.Scene, camera: THREE.Camera, canvas: HTMLCanvasElement) {
    super(scene, camera, canvas);
    this.model = new Model();
    this.viewer.dispose();
    this.viewer = new Orbiter(canvas);
    this.root = new THREE.Group();
    this.scene.add(this.root);
    this.setup();
  }

  public dispose() {
    this.scene.remove(this.root);
    geometry.dispose(this.root);
    super.dispose();
  }

  private setup() {
    const grid = new THREE.LineSegments(
      geometry.grid(10, 10, (x, y) => new THREE.Vector3(0.2 * x - 1, 0.2 * y - 1, 0)),
      new THREE.LineBasicMaterial({ color: 0, transparent: true, opacity: 0.25 }),
    );
    this.root.add(grid);

    const cube = new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.5, 0.5, 0.5),
      new THREE.MeshPhongMaterial({ color: 0x800000 }),
    );
    this.root.add(cube);
  }
}
