import * as THREE from 'three';

import * as geometry from '@/lib/geometry';
import * as materials from '@/lib/materials';
import * as models from '@/modules/models';
import { Orbiter } from '@/modules/orbiter';

import { Demo } from '@/modules/demos/demo';

export class Terrain extends Demo {
  private root!: THREE.Group;

  public constructor(scene: THREE.Scene, camera: THREE.Camera, canvas: HTMLCanvasElement) {
    super(scene, camera, canvas);
    this.model = new models.Item({ label: 'Terrain custom shader' });

    this.viewer.dispose();
    this.viewer = new Orbiter(canvas, { phi: -0.25 * Math.PI, theta: Math.atan2(1, Math.sqrt(3)), radius: 6, zoom: 1.5 });
    const group = new THREE.Group();

    const sphere = new THREE.Mesh(geometry.sphere(0.5, 8), new THREE.MeshPhongMaterial({ color: 0x50a0f0 }));
    group.add(sphere);

    const wire = new THREE.Mesh(geometry.sphere(0.501, 8),
      new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide, wireframe: true }));
    group.add(wire);

    const ox = new THREE.Mesh(geometry.sphere(0.01, 3), new THREE.MeshPhongMaterial({ color: 0xff0000 }));
    ox.position.set(1, 0, 0);
    group.add(ox);

    const grid = new THREE.LineSegments(geometry.grid(10, 10, (x, y) => new THREE.Vector3(0.2 * x - 1, 0.2 * y - 1, 0)),
      new THREE.LineBasicMaterial({ color: 0x0, transparent: true, opacity: 0.25 }));
    group.add(grid);

    const size = 128;
    const terrain = geometry.terrain(size, size, (ix, iy) => {
      const scale = 2 / size;
      const k = Math.PI;
      const x = scale * ix - 1;
      const y = scale * iy - 1;
      const r2 = x * x + y * y;
      const z = Math.cos(k * x) * Math.cos(k * y) * 0.5 / (1 + r2);
      return new THREE.Vector3(x, y, z);
    });
    const mesh = new THREE.Mesh(terrain, materials.terrain());
    mesh.position.set(0, 0, 0.5);
    group.add(mesh);

    scene.add(group);
    this.root = group;
  }

  public dispose() {
    geometry.dispose(this.root);
    this.scene.remove(this.root);
    super.dispose();
  }
}
