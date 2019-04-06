import { observable } from 'mobx';
import * as THREE from 'three';

import * as geometry from '@/lib/geometry';

export interface ItemOptions {
  template: string;
  label: string;
  icon: string;
}

export function combine(options: Partial<ItemOptions>, add?: Partial<ItemOptions>) {
  return Object.assign(options, add);
}

export class Item {
  @observable public template!: string;
  @observable public label!: string;
  @observable public icon!: string;
  @observable.shallow public readonly items: Item[] = [];

  protected disposers: Array<() => void> = [];

  public constructor(options?: Partial<ItemOptions>) {
    Object.assign(this, combine({ template: 'item', label: 'Item', icon: 'icon-home' }, options));
  }

  public dispose() {
    for (const disposer of this.disposers) {
      disposer();
    }
    for (const item of this.items) {
      item.dispose();
    }
    this.items.length = 0;
  }
}

export class Object3D extends Item {
  public root!: THREE.Object3D;

  public constructor(options?: Partial<ItemOptions>) {
    super(combine({ template: 'object-3d', label: 'Object3D', icon: 'icon-view3d' }, options));
  }

  public dispose() {
    super.dispose();
    if (this.root.parent) {
      this.root.parent.remove(this.root);
    }
    geometry.dispose(this.root);
  }
}
