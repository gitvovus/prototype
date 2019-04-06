import * as THREE from 'three';

import * as geometry from '@/lib/geometry';

export class SelectionGroup {
  public readonly items: THREE.Object3D[] = [];

  private h?: THREE.Object3D;
  private s?: THREE.Object3D;

  private hoc = 0;
  private soc = 0;

  private readonly hc = 0x00c000;
  private readonly sc = 0xd01010;
  private readonly hs = 0xe02020;

  public get hovered() {
    return this.h;
  }

  public set hovered(value: THREE.Object3D | undefined) {
    if (this.h === value) { return; }

    if (this.h) {
      geometry.setColor(this.h, this.h === this.s ? this.sc : this.hoc);
    }

    this.h = value;
    if (this.h) {
      this.hoc = geometry.getColor(this.h);
      geometry.setColor(this.h, this.h === this.s ? this.hs : this.hc);
    }
  }

  public get selected() {
    return this.s;
  }

  public set selected(value: THREE.Object3D | undefined) {
    if (this.s === value) { return; }

    if (this.s) {
      geometry.setColor(this.s, this.s === this.h ? this.hc : this.soc);
    }

    this.s = value;
    if (this.s) {
      this.soc = this.s === this.h ? this.hoc : geometry.getColor(this.s);
      geometry.setColor(this.s, this.s === this.h ? this.hs : this.sc);
    }
  }
}
