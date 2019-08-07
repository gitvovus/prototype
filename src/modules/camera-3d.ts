import { observable } from 'mobx';
import * as THREE from 'three';

export class Camera {
  public readonly defaultTransform = new THREE.Matrix4();

  public readonly initialTransform = new THREE.Matrix4();


  @observable private _transform = new THREE.Matrix4();

  public constructor(defaultTransform?: THREE.Matrix4) {

  }
}
