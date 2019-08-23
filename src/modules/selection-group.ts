import * as THREE from 'three';

import * as geometry from '@/lib/geometry';

export class SelectionGroup {
  public readonly items: THREE.Object3D[] = [];

  private hoveredObject?: THREE.Object3D;
  private selectedObject?: THREE.Object3D;

  private hoveredSavedColor = 0;
  private selectedSavedColor = 0;

  private readonly hoveredColor = 0x00c000;
  private readonly selectedColor = 0xd01010;
  private readonly combinedColor = 0xff2020;

  public get hovered() {
    return this.hoveredObject;
  }

  public set hovered(value: THREE.Object3D | undefined) {
    if (this.hoveredObject === value) {
      return;
    }

    if (this.hoveredObject) {
      geometry.setColor(this.hoveredObject, this.hoveredObject === this.selectedObject ? this.selectedColor : this.hoveredSavedColor);
    }

    this.hoveredObject = value;
    if (this.hoveredObject) {
      this.hoveredSavedColor = geometry.getColor(this.hoveredObject);
      geometry.setColor(this.hoveredObject, this.hoveredObject === this.selectedObject ? this.combinedColor : this.hoveredColor);
    }
  }

  public get selected() {
    return this.selectedObject;
  }

  public set selected(value: THREE.Object3D | undefined) {
    if (this.selectedObject === value) {
      return;
    }

    if (this.selectedObject) {
      geometry.setColor(this.selectedObject, this.selectedObject === this.hoveredObject ? this.hoveredColor : this.selectedSavedColor);
    }

    this.selectedObject = value;
    if (this.selectedObject) {
      this.selectedSavedColor = this.selectedObject === this.hoveredObject ? this.hoveredSavedColor : geometry.getColor(this.selectedObject);
      geometry.setColor(this.selectedObject, this.selectedObject === this.hoveredObject ? this.combinedColor : this.selectedColor);
    }
  }
}
