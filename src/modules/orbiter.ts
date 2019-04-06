import * as THREE from 'three';

import { clamp } from '@/lib/std';

export interface OrbiterOptions {
  phi: number;
  theta: number;
  radius: number;
  lookAt: THREE.Vector3;
  zoom: number;
  minRadius: number;
  maxRadius: number;
  movementSpeed: number;
  rotationSpeed: number;
}

export class Orbiter {
  public lookAt = new THREE.Vector3(0, 0, 0);
  public radius = 6;
  public phi = 0;
  public theta = 0;
  public zoom = 1;

  public minRadius = 2;
  public maxRadius = 10;
  public movementSpeed = 10;
  public rotationSpeed = 1;

  private canvas!: HTMLCanvasElement;

  private minTheta = -1.5;
  private maxTheta = 1.5;
  private movement = 0;
  private phiRotation = 0;
  private thetaRotation = 0;

  private initializer: Partial<OrbiterOptions> = {};
  private lastUpdate = Date.now() * 0.001;
  private trackPointer = false;
  private pointer = { x: 0, y: 0 };
  private panX = new THREE.Vector3();
  private panY = new THREE.Vector3();

  public constructor(canvas: HTMLCanvasElement, initializer?: Partial<OrbiterOptions>) {
    Object.assign(this, initializer);
    Object.assign(this.initializer, {
      phi: this.phi,
      theta: this.theta,
      radius: this.radius,
      lookAt: this.lookAt.clone(),
      zoom: this.zoom,
      minRadius: this.minRadius,
      maxRadius: this.maxRadius,
      movementSpeed: this.movementSpeed,
      rotationSpeed: this.rotationSpeed,
    });

    this.canvas = canvas;
    canvas.addEventListener('pointerdown', this.pick);
    canvas.addEventListener('pointermove', this.drag);
    canvas.addEventListener('pointerup', this.drop);
    canvas.addEventListener('wheel', this.wheel);
    canvas.addEventListener('keydown', this.keyDown);
    canvas.addEventListener('keyup', this.keyUp);
  }

  public update(camera: THREE.Camera) {
    const time = Date.now() * 0.001;
    const dt = time - this.lastUpdate;
    this.lastUpdate = time;

    this.radius += dt * this.movement * this.movementSpeed;
    this.phi += dt * this.phiRotation * this.rotationSpeed;
    this.theta += dt * this.thetaRotation * this.rotationSpeed;

    this.radius = clamp(this.radius, this.minRadius, this.maxRadius);
    this.theta = clamp(this.theta, this.minTheta, this.maxTheta);

    const x = this.lookAt.x + this.radius * Math.cos(this.phi) * Math.cos(this.theta);
    const y = this.lookAt.y + this.radius * Math.sin(this.phi) * Math.cos(this.theta);
    const z = this.lookAt.z + this.radius * Math.sin(this.theta);

    camera.position.set(x, y, z);
    camera.lookAt(this.lookAt);

    if (camera instanceof THREE.OrthographicCamera) {
      camera.zoom = 0.5 * (this.minRadius + this.maxRadius) / this.radius / this.zoom;
      camera.updateProjectionMatrix();
    }
  }

  public dispose() {
    const canvas = this.canvas;
    canvas.removeEventListener('pointerdown', this.pick);
    canvas.removeEventListener('pointermove', this.drag);
    canvas.removeEventListener('pointerup', this.drop);
    canvas.removeEventListener('wheel', this.wheel);
    canvas.removeEventListener('keydown', this.keyDown);
    canvas.removeEventListener('keyup', this.keyUp);
  }

  private keyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
        this.movement = -1;
        break;
      case 'KeyS':
        this.movement = 1;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.phiRotation = -1;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.phiRotation = 1;
        break;
      case 'KeyE':
      case 'ArrowUp':
        this.thetaRotation = 1;
        break;
      case 'KeyQ':
      case 'ArrowDown':
        this.thetaRotation = -1;
        break;
      case 'Digit0':
        this.phi = -Math.PI / 2;
        this.theta = 0;
        break;
      case 'Home':
        Object.assign(this, this.initializer);
        break;
      default: return;
    }
    e.stopImmediatePropagation();
    e.preventDefault();
  }

  private keyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
        this.movement = 0;
        break;
      case 'KeyS':
        this.movement = 0;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.phiRotation = 0;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.phiRotation = 0;
        break;
      case 'KeyE':
      case 'ArrowUp':
        this.thetaRotation = 0;
        break;
      case 'KeyQ':
      case 'ArrowDown':
        this.thetaRotation = 0;
        break;
      default: return;
    }
    e.stopImmediatePropagation();
    e.preventDefault();
  }

  private pick = (e: PointerEvent) => {
    if (!(e.buttons & 3) || this.trackPointer) { return; }

    const cosPhi = Math.cos(this.phi);
    const sinPhi = Math.sin(this.phi);
    const cosTheta = Math.cos(this.theta);
    const sinTheta = Math.sin(this.theta);
    this.panX.set(-sinPhi, cosPhi, 0).multiplyScalar(this.radius);
    this.panY.set(-cosPhi * sinTheta, -sinPhi * sinTheta, cosTheta).multiplyScalar(this.radius);

    this.trackPointer = true;
    this.pointer.x = e.offsetX;
    this.pointer.y = e.offsetY;
    this.canvas.setPointerCapture(e.pointerId);
  }

  private drag = (e: PointerEvent) => {
    if (!this.trackPointer) { return; }

    const dx = e.offsetX - this.pointer.x;
    const dy = e.offsetY - this.pointer.y;
    this.pointer.x = e.offsetX;
    this.pointer.y = e.offsetY;

    if (e.buttons & 1) {
      this.phi -= dx * 2 * Math.PI * this.rotationSpeed / this.canvas.width;
      this.theta += dy * 2 * Math.PI * this.rotationSpeed / this.canvas.height;
    } else if (e.buttons & 2) {
      const delta = this.panX.clone().multiplyScalar(dx / this.canvas.width).add(this.panY.clone().multiplyScalar(-dy / this.canvas.height));
      this.lookAt.sub(delta);
    }
  }

  private drop = (e: PointerEvent) => {
    if (this.trackPointer && !(e.buttons & 3)) {
      this.canvas.releasePointerCapture(e.pointerId);
      this.trackPointer = false;
    }
  }

  private wheel = (e: WheelEvent) => {
    const dy = e.deltaY > 0 ? 1 : -1;
    this.radius += 0.05 * dy * this.movementSpeed;
    e.stopPropagation();
    e.preventDefault();
  }
}
