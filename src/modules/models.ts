import { observable } from 'mobx';
import * as THREE from 'three';

import * as geometry from '@/lib/geometry';

export interface Attributes {
  template?: string;
  label?: string;
  icon?: string;
}

export function merge(attributes: Attributes, overwrite?: Attributes) {
  return Object.assign(attributes, overwrite);
}

export class Item {
  @observable public template!: string;
  @observable public label!: string;
  @observable public icon!: string;
  @observable.shallow public readonly items: Item[] = [];

  protected readonly disposers: Array<() => void> = [];

  public constructor(attributes?: Attributes) {
    Object.assign(this, merge({ template: 'item', label: 'Item', icon: 'icon-home' }, attributes));
  }

  public dispose() {
    this.disposers.forEach(disposer => disposer());
    this.disposers.length = 0;
    this.items.forEach(item => item.dispose());
    this.items.length = 0;
  }
}

export class Object3D extends Item {
  public root!: THREE.Object3D;

  public constructor(attributes?: Attributes) {
    super(merge({ template: 'object-3d', label: 'Object3D', icon: 'icon-view3d' }, attributes));
  }

  public dispose() {
    super.dispose();
    if (this.root.parent) {
      this.root.parent.remove(this.root);
    }
    geometry.dispose(this.root);
  }
}
