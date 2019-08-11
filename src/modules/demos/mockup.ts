import { computed, observable, reaction } from 'mobx';
import * as THREE from 'three';

import * as geometry from '@/lib/geometry';
import * as drag from '@/modules/drag-controls';
import * as models from '@/modules/models';
import { Orbiter } from '@/modules/orbiter';
import { SelectionGroup } from '@/modules/selection-group';

import { Demo } from '@/modules/demos/demo';

export class Model extends models.Item {
  @observable private index?: number;

  public constructor() {
    super({ template: 'mockup', label: 'Mockup' });

    this.disposers.push(reaction(
      () => this.items.length,
      () => {
        if (this.items.length === 0) {
          this.index = undefined;
        } else {
          if (this.index === undefined) {
            this.index = 0;
          } else {
            if (this.index > this.items.length) {
              this.index = this.items.length - 1;
            }
          }
        }
      },
    ));
  }

  @computed public get selectedIndex() {
    return this.index;
  }

  public set selectedIndex(value: number | undefined) {
    if (value === this.index) {
       return;
    }
    if (value === undefined) {
      this.index = undefined;
    } else if (value >= 0 && value < this.items.length) {
      this.index = value;
    }
  }

  @computed public get selectedItem() {
    return this.index !== undefined ? this.items[this.index] : undefined;
  }

  public set selectedItem(value: models.Item | undefined) {
    if (value === undefined) {
      this.selectedIndex = undefined;
    } else {
      const index = this.items.indexOf(value);
      if (index !== -1) {
        this.index = index;
      }
    }
  }
}

export class Mockup extends Demo {
  private root!: THREE.Object3D;
  private child!: THREE.Object3D;

  private moveControl!: drag.DragControl;
  private coneControl!: drag.DragControl;
  private activeControl?: drag.DragControl;

  private objects = new SelectionGroup();
  private handles = new SelectionGroup();

  private raycaster = new THREE.Raycaster();
  private dragHandler?: drag.DragHandler;
  private dragOrigin = new THREE.Vector3();
  private plane = new THREE.Plane();

  private readonly disposers: Array<() => void> = [];

  private coneTarget!: THREE.Object3D;

  public constructor(scene: THREE.Scene, camera: THREE.Camera, element: HTMLElement) {
    super(scene, camera, element);

    this.element.addEventListener('pointerdown', this.pick);
    this.element.addEventListener('pointermove', this.drag);
    this.element.addEventListener('pointerup', this.drop);

    this.setupScene(element);
    this.setupObjects();

    this.disposers.push(
      reaction(
        () => (this.model as Model).selectedItem,
        (item) => this.select(this.objects, item && (item as models.Object3D).root),
        { fireImmediately: true },
      ),
    );
  }

  public dispose() {
    super.dispose();
    this.disposers.forEach(disposer => disposer());
    this.disposers.length = 0;
    this.element.removeEventListener('pointerdown', this.pick);
    this.element.removeEventListener('pointermove', this.drag);
    this.element.removeEventListener('pointerup', this.drop);
    this.scene.remove(this.root);
    geometry.dispose(this.root);
  }

  private setupScene(element: HTMLElement) {
    this.viewer.dispose();
    this.viewer = new Orbiter(element, {
      phi: -Math.PI / 2, theta: Math.PI / 6,
      radius: 5, minRadius: 1,
      lookAt: new THREE.Vector3(0, 0, 0.25), zoom: 1.5 },
    );
    this.root = new THREE.Group();
    this.scene.add(this.root);

    const grid = new THREE.LineSegments(
      geometry.grid(10, 10, (x, y) => new THREE.Vector3(0.2 * x - 1, 0.2 * y - 1, 0)),
      new THREE.LineBasicMaterial({ color: 0, transparent: true, opacity: 0.25 }),
    );
    this.root.add(grid);

    const ox = new THREE.Mesh(geometry.sphere(0.01, 3), new THREE.MeshPhongMaterial({ color: 0xff0000 }));
    ox.position.set(1, 0, 0);
    this.root.add(ox);

    this.child = new THREE.LineSegments(
      geometry.grid(10, 10, (x, y) => new THREE.Vector3(0.2 * x - 1, 0.2 * y - 1, 0)),
      new THREE.LineBasicMaterial({ color: 0x0, transparent: true, opacity: 0.25 }),
    );
    this.child.position.set(0.5, 0.5, 0.5);
    this.child.scale.setScalar(0.5);
    this.child.rotateZ(1);
    this.child.rotateY(-0.5);
    this.child.rotateX(0.2);
    this.root.add(this.child);

    const oxChild = new THREE.Mesh(geometry.sphere(0.02, 3), new THREE.MeshPhongMaterial({ color: 0xff0000 }));
    oxChild.position.set(1, 0, 0);
    this.child.add(oxChild);
  }

  private setupObjects() {
    this.model = new Model();

    const a = new models.Object3D({ label: 'Object A' });
    const b = new models.Object3D({ label: 'Object B' });
    const b1 = new models.Object3D({ label: 'Object B1' });
    const b2 = new models.Object3D({ label: 'Object B2' });
    b.items.push(b1, b2);

    a.root = new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.25, 0.25, 0.25),
      new THREE.MeshPhongMaterial({ color: 0x4080c0, transparent: true, opacity: 0.75 }),
    );
    a.root.renderOrder = 1;
    a.root.position.set(-0.6, 0.2, 0.125);

    b.root = new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.25, 0.25, 0.25),
      new THREE.MeshPhongMaterial({ color: 0x4080c0, transparent: true, opacity: 0.75 }),
    );
    b.root.renderOrder = 1;
    b.root.position.set(0.6, -0.4, 0.25);
    b.root.rotateZ(2);
    b.root.rotateY(0.5);
    b.root.rotateX(-0.2);

    b1.root = new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.1, 0.1, 0.1),
      new THREE.MeshPhongMaterial({ color: 0x00c0d0, transparent: true, opacity: 0.75 }),
    );
    b1.root.renderOrder = 1;
    b1.root.position.set(-0.4, 0.1, -0.1);

    b2.root = new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.1, 0.1, 0.1),
      new THREE.MeshPhongMaterial({ color: 0x00c0d0, transparent: true, opacity: 0.75 }),
    );
    b2.root.renderOrder = 1;
    b2.root.position.set(-0.1, 0.4, -0.1);

    b.root.add(b1.root);
    b.root.add(b2.root);

    const c = new models.Object3D({ label: 'Object C' });
    const d = new models.Object3D({ label: 'Object D' });

    c.root = new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.25, 0.25, 0.25),
      new THREE.MeshPhongMaterial({ color: 0x4080c0, transparent: true, opacity: 0.75 }),
    );
    c.root.renderOrder = 1;
    c.root.position.set(-0.6, 0.2, 0.125);

    d.root = new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.25, 0.25, 0.25),
      new THREE.MeshPhongMaterial({ color: 0x4080c0, transparent: true, opacity: 0.75 }),
    );
    d.root.renderOrder = 1;
    d.root.position.set(0.6, -0.4, 0.25);
    d.root.rotateZ(2);
    d.root.rotateY(0.5);
    d.root.rotateX(-0.2);

    const r = new models.Object3D({ label: 'Object R' });
    r.root = new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.2, 0.2, 0.1),
      new THREE.MeshPhongMaterial({ color: 0x800040, transparent: true, opacity: 0.75 }),
    );
    r.root.renderOrder = 1;
    r.root.position.set(-0.5, -0.5, -0.05);
    this.coneTarget = r.root;

    this.model.items.push(a, b, b1, b2, r, c, d);
    this.model.items.forEach(item => this.objects.items.push((item as models.Object3D).root));

    this.root.add(a.root);
    this.root.add(b.root);
    this.root.add(r.root);
    this.child.add(c.root);
    this.child.add(d.root);

    this.moveControl = new drag.AxisDragControl();
    this.moveControl.root.scale.setScalar(0.2);
    this.moveControl.items.forEach(item => this.handles.items.push(item.handle));

    this.coneControl = new drag.ConeDragControl();
    this.coneControl.root.scale.setScalar(0.25);
    this.coneControl.items.forEach(item => this.handles.items.push(item.handle));
  }

  private hover(group: SelectionGroup, object?: THREE.Object3D) {
    group.hovered = object;
  }

  private select(group: SelectionGroup, object?: THREE.Object3D) {
    if (object === group.selected) {
      return;
    }
    if (group.selected) {
      group.selected.remove(this.activeControl!.root);
    }

    group.selected = object;
    if (!object) {
      return;
    }

    this.activeControl = object === this.coneTarget ? this.coneControl : this.moveControl;
    object.add(this.activeControl.root);
    this.activeControl.target = object;
  }

  private rayCast(items: THREE.Object3D[], xy: { x: number, y: number }): THREE.Intersection | undefined {
    this.raycaster.setFromCamera(xy, this.camera);
    const intersections = this.raycaster.intersectObjects(items);
    return intersections.length > 0 ? intersections[0] : undefined;
  }

  private pick = (e: PointerEvent) => {
    if (this.dragHandler) {
      return;
    }

    if (e.buttons & 2) {
      this.hover(this.handles);
      (this.model as Model).selectedItem = undefined;
      return;
    }

    if (!(e.buttons & 1)) {
      return;
    }

    const xy = this.xyFromEvent(e);
    let rayCast: THREE.Intersection | undefined;
    if (this.objects.selected) {
      rayCast = this.rayCast(this.handles.items, xy);
      if (rayCast) {
        for (const dragger of this.activeControl!.items) {
          if (rayCast.object === dragger.handle) {
            dragger.pick();

            this.dragHandler = dragger;
            this.dragOrigin = rayCast.point;
            const dir = new THREE.Vector3();
            this.camera.getWorldDirection(dir);
            this.plane.setFromNormalAndCoplanarPoint(dir, rayCast.point);

            this.element.setPointerCapture(e.pointerId);
            e.stopImmediatePropagation();
            return;
          }
        }
      }
    }

    rayCast = this.rayCast(this.objects.items, xy);
    if (!rayCast) {
      return;
    }

    for (const item of this.model.items) {
      if (rayCast.object === (item as models.Object3D).root) {
        (this.model as Model).selectedItem = item;
        break;
      }
    }
  }

  private drag = (e: PointerEvent) => {
    const xy = this.xyFromEvent(e);

    if (this.dragHandler) {

      this.raycaster.setFromCamera(xy, this.camera);
      const v = new THREE.Vector3();
      this.raycaster.ray.intersectPlane(this.plane, v);
      v.sub(this.dragOrigin);
      this.dragHandler.drag(v);

    } else {

      if (e.buttons & 3) {
        return;
      }

      let rayCast: THREE.Intersection | undefined;
      if (this.objects.selected) {
        rayCast = this.rayCast(this.handles.items, xy);
        if (rayCast) {
          for (const dragger of this.activeControl!.items) {
            if (rayCast.object === dragger.handle) {
              this.hover(this.handles, rayCast.object);
              this.hover(this.objects);
              return;
            }
          }
        }
      }

      rayCast = this.rayCast(this.objects.items, xy);
      if (rayCast) {
        this.hover(this.handles);
        this.hover(this.objects, rayCast.object);
      } else {
        this.hover(this.handles);
        this.hover(this.objects);
      }
    }
  }

  private drop = (e: PointerEvent) => {
    if (this.dragHandler && (e.buttons & 1) === 0) {
      this.dragHandler = undefined;
      this.element.releasePointerCapture(e.pointerId);
    }
  }
}
