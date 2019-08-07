import * as THREE from 'three';

import * as geometry from '@/lib/geometry';
import * as img from '@/lib/images';
import { clamp } from '@/lib/std';
import * as models from '@/modules/models';
import { Orbiter } from '@/modules/orbiter';
import { SelectionGroup } from '@/modules/selection-group';

import { Demo } from '@/modules/demos/demo';

export class Bicubic extends Demo {
  private root!: THREE.Group;

  private z: number[] = [];
  private meshes: THREE.Mesh[] = [];
  private coordinateGrid?: THREE.LineSegments;
  private loRes?: THREE.LineSegments;
  private hiRes?: THREE.LineSegments;
  private group = new SelectionGroup();

  private raycaster = new THREE.Raycaster();
  private trackPointer = false;
  private pointer = { x: 0, y: 0 };
  private dragCenter!: THREE.Vector3;
  private dragScale = 1;

  private gridSize = 5;
  private subdiv = 10;

  private readonly minGridSize = 2;
  private readonly maxGridSize = 8;
  private readonly minSubdiv = 2;
  private readonly maxSubdiv = 16;
  private readonly minZ = -1;
  private readonly maxZ = 1;

  private readonly meshColor = 0xffff00;
  private readonly highlight = 0xff0000;
  private readonly loResColor = 0x800000;
  private readonly hiResColor = 0x008000;
  private readonly fitSize = 2;

  public constructor(scene: THREE.Scene, camera: THREE.Camera, canvas: HTMLCanvasElement) {
    super(scene, camera, canvas);
    this.model = new models.Item({ label: 'Bicubic interpolation' });
    this.canvas.addEventListener('pointerdown', this.pick);
    this.canvas.addEventListener('pointermove', this.drag);
    this.canvas.addEventListener('pointerup', this.drop);
    this.canvas.addEventListener('keydown', this.keyDown);
    this.viewer.dispose();
    this.viewer = new Orbiter(canvas, { phi: -1, theta: 0.5, radius: 6, zoom: 1.5 });
    this.setup();
  }

  public dispose() {
    super.dispose();
    this.canvas.removeEventListener('pointerdown', this.pick);
    this.canvas.removeEventListener('pointermove', this.drag);
    this.canvas.removeEventListener('pointerup', this.drop);
    this.canvas.removeEventListener('keydown', this.keyDown);
    this.scene.remove(this.root);
    geometry.dispose(this.root);
  }

  private setup() {
    const x0 = -this.fitSize / 2;
    const y0 = -this.fitSize / 2;
    const z0 = 0;

    for (let y = 0; y < this.maxGridSize; ++y) {
      for (let x = 0; x < this.maxGridSize; ++x) {
        this.z.push(this.defaultZ(x, y));
      }
    }

    this.root = new THREE.Group();
    this.root.position.set(x0, y0, z0);
    this.scene.add(this.root);

    this.interpolate();
  }

  private defaultZ(x: number, y: number) {
    return 0.5 * Math.cos(x) * Math.cos(y);
  }

  private interpolate() {
    const size = this.gridSize;
    this.root.scale.setScalar(this.fitSize / size);

    const grid = new Float32Array(size * size);
    const idx = (x: number, y: number) => clamp(x, 0, size - 1) + clamp(y, 0, size - 1) * size;
    const get = (x: number, y: number) => grid[idx(x, y)];
    const set = (x: number, y: number, value: number) => grid[idx(x, y)] = value;

    const oldSize = Math.round(Math.sqrt(this.meshes.length));
    if (oldSize !== size) {
      this.group.selected = undefined;
      this.group.hovered = undefined;
      for (const mesh of this.meshes) {
        this.root.remove(mesh);
        geometry.dispose(mesh);
      }
      this.meshes = [];
      for (let y = 0; y < size; ++y) {
        for (let x = 0; x < size; ++x) {
          const sphere = new THREE.Mesh(geometry.sphere(1, 4), new THREE.MeshPhongMaterial({ color: this.meshColor }));
          sphere.scale.setScalar(0.07);
          sphere.position.set(x + 0.5, y + 0.5, this.getZ(x, y));
          this.meshes.push(sphere);
          this.root.add(sphere);
        }
      }
    }

    for (let y = 0; y < size; ++y) {
      for (let x = 0; x < size; ++x) {
        set(x, y, this.getZ(x, y));
      }
    }

    if (this.coordinateGrid) {
      this.root.remove(this.coordinateGrid);
      geometry.dispose(this.coordinateGrid);
    }
    this.coordinateGrid = new THREE.LineSegments(geometry.grid(this.gridSize, this.gridSize, (x, y) => new THREE.Vector3(x, y, this.minZ)),
      new THREE.LineBasicMaterial({ color: 0x0, transparent: true, opacity: 0.25 }));
    this.root.add(this.coordinateGrid);

    const visible = (this.loRes && this.loRes.visible) || false;
    if (this.loRes) {
      this.root.remove(this.loRes);
      geometry.dispose(this.loRes);
    }
    const g = geometry.grid(size + 3, size + 3, (x, y) => new THREE.Vector3(x - 1.5, y - 1.5, get(x - 2, y - 2)));
    this.loRes = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: this.loResColor, transparent: true, opacity: 0.5 }));
    this.loRes.visible = visible;
    this.root.add(this.loRes);

    if (this.hiRes) {
      this.root.remove(this.hiRes);
      geometry.dispose(this.hiRes);
    }

    const subdiv = this.subdiv;
    const h = geometry.grid((size - 1) * this.subdiv, (size - 1) * this.subdiv, (x, y) => {
      let dx = x / subdiv;
      let dy = y / subdiv;
      let x0 = Math.floor(dx);
      let y0 = Math.floor(dy);
      dx -= x0;
      dy -= y0;
      if (dx === 0 && x0 > 0) {
        --x0;
        dx = 1;
      }
      if (dy === 0 && y0 > 0) {
        --y0;
        dy = 1;
      }
      const z = img.bicubic(dx, dy, (x, y) => get(x0 + x, y0 + y));
      return new THREE.Vector3(x / subdiv + 0.5, y / subdiv + 0.5, z);
    });
    this.hiRes = new THREE.LineSegments(h, new THREE.LineBasicMaterial({ color: this.hiResColor, transparent: true, opacity: 0.5 }));
    this.root.add(this.hiRes);
  }

  private getZ(x: number, y: number) {
    return this.z[x + y * this.maxGridSize];
  }

  private setZ(x: number, y: number, value: number) {
    this.z[x + y * this.maxGridSize] = value;
    if (x < this.gridSize && y < this.gridSize) {
      this.meshes[x + y * this.gridSize].position.setZ(value);
    }
  }

  private meshXY(mesh: THREE.Mesh): [number, number] {
    const index = this.meshes.findIndex((m) => m === mesh);
    const x = index % this.gridSize;
    const y = (index - x) / this.gridSize;
    return [x, y];
  }

  private reset(z: (x: number, y: number) => number, all: boolean = false) {
    if (all) {
      for (let y = 0; y < this.maxGridSize; ++y) {
        for (let x = 0; x < this.maxGridSize; ++x) {
          this.setZ(x, y, z(x, y));
        }
      }
      this.interpolate();
    } else if (this.group.selected) {
      const [x, y] = this.meshXY(this.group.selected as THREE.Mesh);
      this.setZ(x, y, z(x, y));
      this.interpolate();
    }
  }

  private xyFromEvent(e: PointerEvent) {
    return {
      x: (e.offsetX / this.canvas.width) * 2 - 1,
      y: (e.offsetY / this.canvas.height) * -2 + 1,
    };
  }

  private rayCast(items: THREE.Object3D[], xy: { x: number, y: number }): THREE.Intersection | undefined {
    this.raycaster.setFromCamera(xy, this.camera);
    const intersections = this.raycaster.intersectObjects(items);
    return intersections.length > 0 ? intersections[0] : undefined;
  }

  private pick = (e: PointerEvent) => {
    if (!(e.buttons & 1)) {
      return;
    }

    const xy = this.xyFromEvent(e);
    const rayCast = this.rayCast(this.meshes, xy);
    if (!rayCast) {
      this.group.selected = undefined;
      return;
    }

    const mesh = rayCast.object as THREE.Mesh;
    this.group.selected = mesh;

    // save initial position to apply delta to it when dragging
    this.dragCenter = mesh.position.clone();

    // calculate mesh parent hierarchy scale
    mesh.updateMatrixWorld(false);
    const worldMatrix = mesh.matrixWorld;
    const worldScale = worldMatrix.getMaxScaleOnAxis();
    const scale = worldScale / mesh.scale.x; // not count mesh own scale

    // calculate viewport height in units, at the mesh's distance,
    // to convert pixels to units when dragging
    const position = mesh.position.clone();
    position.applyMatrix4(worldMatrix);
    let height = 0;
    if (this.camera instanceof THREE.PerspectiveCamera) {
      const distance = position.sub(this.camera.position).length();
      height = 2 * distance * Math.tan(this.camera.fov * Math.PI / 360);
    } else if (this.camera instanceof THREE.OrthographicCamera) {
      height = (this.camera.top - this.camera.bottom) / this.camera.zoom;
    }
    this.dragScale = height / this.canvas.height / scale;

    this.trackPointer = true;
    this.pointer.x = e.offsetX;
    this.pointer.y = e.offsetY;
    this.canvas.setPointerCapture(e.pointerId);
    e.stopImmediatePropagation();
  }

  private drag = (e: PointerEvent) => {
    if (!this.trackPointer) {
      const xy = this.xyFromEvent(e);
      const rayCast = this.rayCast(this.meshes, xy);
      this.group.hovered = rayCast && rayCast.object || undefined;
      return;
    }
    const delta = this.pointer.y - e.offsetY;
    const z = clamp(this.dragCenter.z + delta * this.dragScale, this.minZ, this.maxZ);
    this.reset(() => z);
  }

  private drop = (e: PointerEvent) => {
    if (this.trackPointer && !(e.buttons & 1)) {
      this.canvas.releasePointerCapture(e.pointerId);
      this.trackPointer = false;
    }
  }

  private keyDown = (e: KeyboardEvent) => {
    if (e.altKey || e.shiftKey) {
      return;
    }
    switch (e.code) {
      case 'Digit1':
        this.reset(() => this.minZ, e.ctrlKey);
        break;
      case 'Digit2':
        this.reset(() => 0.5 * (this.minZ + this.maxZ), e.ctrlKey);
        break;
      case 'Digit3':
        this.reset(() => this.maxZ, e.ctrlKey);
        break;
      case 'Digit0':
        this.reset((x, y) => this.defaultZ(x, y), e.ctrlKey);
        break;
      case 'KeyL':
        if (this.loRes) {
          this.loRes.visible = !this.loRes.visible;
        }
        break;
      case 'Comma':
        if (this.gridSize > this.minGridSize) {
          --this.gridSize;
          this.interpolate();
        }
        break;
      case 'Period':
        if (this.gridSize < this.maxGridSize) {
          ++this.gridSize;
          this.interpolate();
        }
        break;
      case 'Minus':
      case 'NumpadSubtract':
        if (this.subdiv > this.minSubdiv) {
          --this.subdiv;
          this.interpolate();
        }
        break;
      case 'Equal':
      case 'NumpadAdd':
        if (this.subdiv < this.maxSubdiv) {
          ++this.subdiv;
          this.interpolate();
        }
        break;
      default: return;
    }
    e.stopImmediatePropagation();
    e.preventDefault();
  }
}
