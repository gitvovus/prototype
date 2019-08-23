import * as THREE from 'three';

import * as geometry from '@/lib/geometry';
import * as std from '@/lib/std';

export type VectorConstraint = (v: THREE.Vector3) => THREE.Vector3;

export function noConstraints(v: THREE.Vector3) {
  return (v: THREE.Vector3) => v;
}

export function dotAxisConstraint(axis: THREE.Vector3) {
  const a = axis.clone().normalize();
  return (v: THREE.Vector3) => {
    const x = a.dot(v);
    return a.clone().multiplyScalar(x);
  };
}

export function smoothAxisConstraint(threshold: number, axis: THREE.Vector3) {
  const a = axis.clone().normalize();
  return (v: THREE.Vector3) => {
    const x = a.dot(v);
    const f = v.length() * Math.sign(x) * std.smoothStep(0, threshold, Math.abs(x));
    return a.clone().multiplyScalar(f);
  };
}

export function stickAxisConstraint(stick: number, threshold: number, axis: THREE.Vector3) {
  const a = axis.clone().normalize();
  return (v: THREE.Vector3) => {
    const x = a.dot(v);
    const f = v.length() * Math.sign(x) * std.smoothStep(stick, threshold, Math.abs(x));
    return a.clone().multiplyScalar(f);
  };
}

export function coneConstraint(axis: THREE.Vector3, angle: number) {
  const a = axis.clone().normalize();
  const dot = Math.cos(angle);
  return (v: THREE.Vector3) => {
    const n = v.clone().normalize();
    if (n.dot(a) >= dot) {
      return n;
    }
    const x = a.clone().cross(n);
    if (x.lengthSq() < 1e-4) {
      return a.clone();
    }
    x.normalize();
    const q = new THREE.Quaternion().setFromAxisAngle(x, angle);
    return a.clone().applyQuaternion(q);
  };
}

export interface DragHandler {
  handle: THREE.Object3D;
  target?: THREE.Object3D;
  constraint: VectorConstraint;
  pick(): void;
  drag(v: THREE.Vector3): void;
}

export class AxisDragHandler implements DragHandler {
  public handle!: THREE.Object3D;

  private t?: THREE.Object3D;                  // target
  private origin = new THREE.Vector3();        // target local position
  private targetMatrix = new THREE.Matrix4();  // target local matrix
  private inverseMatrix = new THREE.Matrix4(); // target world matrix inverse

  public get constraint(): (v: THREE.Vector3) => THREE.Vector3 {
    return this.f;
  }

  public set constraint(f: (v: THREE.Vector3) => THREE.Vector3) {
    this.f = f;
  }

  public get target() {
    return this.t;
  }

  public set target(value: THREE.Object3D | undefined) {
    this.t = value;
  }

  public pick() {
    this.origin.copy(this.t!.position);
    this.targetMatrix.copy(this.t!.matrix);
    this.inverseMatrix.getInverse(this.t!.matrixWorld);
  }

  public drag(v: THREE.Vector3) { // offset from picked origin, in world space
    const inverseRotation = new THREE.Matrix3();
    inverseRotation.setFromMatrix4(this.inverseMatrix);
    v.applyMatrix3(inverseRotation);
    v = this.constraint(v);

    const targetRotation = new THREE.Matrix3();
    targetRotation.setFromMatrix4(this.targetMatrix);
    v.applyMatrix3(targetRotation);
    v.add(this.origin);
    this.t!.position.copy(v);
  }

  private f: (v: THREE.Vector3) => THREE.Vector3 = (v: THREE.Vector3) => v;
}

export class ConeDragHandler implements DragHandler {
  public root = new THREE.Object3D();
  public handle!: THREE.Object3D;

  private t?: THREE.Object3D;
  private origin = new THREE.Vector3();        // target local position
  private targetMatrix = new THREE.Matrix4();  // target local matrix
  private inverseMatrix = new THREE.Matrix4(); // target world matrix inverse

  private axis: THREE.Vector3;
  private vector: THREE.Vector3;
  private angle: number;

  public constructor(axis: THREE.Vector3, angle: number) {
    this.axis = axis.clone().normalize();
    this.vector = this.axis.clone();
    this.angle = angle;
    const oz = new THREE.BufferGeometry();
    oz.addAttribute('position', new THREE.Float32BufferAttribute(new Float32Array([0, 0, 0, 0, 0, 1]), 3));
    this.root.add(new THREE.LineSegments(oz, new THREE.LineBasicMaterial({ color: 0x800000 })));

    const r = 16;
    const l = 4;
    const grid = geometry.cylinderGrid(r, l, (ix, iy) => {
      const phi = 2 * Math.PI * ix / r;
      const theta = 0.5 * Math.PI + this.angle * (iy / l - 1);
      const x = Math.cos(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.cos(theta);
      const z = Math.sin(theta);
      return new THREE.Vector3(x, y, z);
    });
    this.root.add(new THREE.LineSegments(grid, new THREE.LineBasicMaterial({ color: 0, transparent: true, opacity: 0.5 })));
    this.handle = new THREE.Mesh(geometry.sphere(0.1, 3), new THREE.MeshPhongMaterial({ color: 0xffff00 }));
    this.handle.position.copy(this.vector);
    this.root.add(this.handle);
    this.constraint = coneConstraint(this.axis, this.angle);
  }

  public get constraint(): (v: THREE.Vector3) => THREE.Vector3 {
    return this.f;
  }

  public set constraint(f: (v: THREE.Vector3) => THREE.Vector3) {
    this.f = f;
  }

  public get target() {
    return this.t;
  }

  public set target(value: THREE.Object3D | undefined) {
    this.t = value;
    if (value) {
      this.targetMatrix.copy(value.matrix);
      this.inverseMatrix.getInverse(value.matrixWorld);
    }
  }

  public pick() {
    this.origin.copy(this.vector);
  }

  public drag(v: THREE.Vector3) {
    const inverseRotation = new THREE.Matrix3();
    inverseRotation.setFromMatrix4(this.inverseMatrix);
    const scale = new THREE.Vector3();
    this.root.getWorldScale(scale);
    v.applyMatrix3(inverseRotation).multiplyScalar(1 / scale.x);
    v.add(this.origin);
    this.vector = this.constraint(v);
    this.handle.position.copy(this.vector);

    const q = new THREE.Quaternion().setFromUnitVectors(this.axis, this.vector);
    const r = new THREE.Matrix4().makeRotationFromQuaternion(q);
    const m = this.targetMatrix.clone().multiply(r);
    m.decompose(this.t!.position, this.t!.quaternion, this.t!.scale);
  }

  private f: VectorConstraint = (v: THREE.Vector3) => v;
}

export class DragControl {
  public root!: THREE.Object3D;
  public items!: DragHandler[];

  private t!: THREE.Object3D;

  public get target() {
    return this.t;
  }

  public set target(value: THREE.Object3D) {
    this.t = value;
    for (const item of this.items) {
      item.target = value;
    }
  }
}

export class AxisDragControl extends DragControl {
  public constructor() {
    super();
    this.root = geometry.axes();
    this.items = [new AxisDragHandler(), new AxisDragHandler(), new AxisDragHandler()];
    const v = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 1),
    ];
    for (let i = 0; i < 3; ++i) {
      const item = this.items[i];
      item.handle = this.createHandle(v[i], 0.1, 0xffff00);
      item.constraint = stickAxisConstraint(0.05, 0.25, v[i]);
      this.root.add(item.handle);
    }
  }

  private createHandle(v: THREE.Vector3, radius: number, color: number) {
    const mesh = new THREE.Mesh(geometry.sphere(radius, 3), new THREE.MeshPhongMaterial({ color }));
    mesh.position.copy(v);
    return mesh;
  }
}

export class ConeDragControl extends DragControl {
  public constructor(axis: THREE.Vector3, angle: number) {
    super();
    this.root = new THREE.Object3D();

    const item = new ConeDragHandler(axis, angle);
    this.items = [item];
    this.root.add(item.root);
  }
}
