import { observable } from 'mobx';
import * as THREE from 'three';

import { CameraType } from '@/modules/types';

import { Demo } from '@/modules/demos/demo';
import { Bicubic } from '@/modules/demos/bicubic';
import { Mockup } from '@/modules/demos/mockup';

export class Scene {
  @observable public demo!: Demo;
  @observable public transform = new THREE.Matrix4();

  private element!: HTMLElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.Camera;
  private animationFrame = 0;

  public constructor(element: HTMLElement, canvas: HTMLCanvasElement) {
    this.element = element;
    const background = new THREE.Color(getComputedStyle(element).backgroundColor || 'black');

    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    this.renderer.setClearColor(background);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0x404040));
    this.setCameraType(CameraType.PERSPECTIVE);
    this.demo = new Demo(this.scene, this.camera, element);

    window.addEventListener('resize', this.resize);
    this.resize();
    this.draw();
  }

  public getScene() {
    return this.scene;
  }

  public load(demoName: string) {
    this.demo.dispose();
    switch (demoName) {
      case 'bicubic':
        this.demo = new Bicubic(this.scene, this.camera, this.element);
        return;
      case 'mockup':
        this.demo = new Mockup(this.scene, this.camera, this.element);
        return;
    }
  }

  public setCameraType(type: CameraType) {
    this.scene.remove(this.camera);

    const aspect = this.element.clientWidth / this.element.clientHeight;
    if (type === CameraType.PERSPECTIVE) {
      this.camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 50);
    } else {
      this.camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 50);
    }
    this.camera.up.set(0, 0, 1);
    this.camera.add(new THREE.PointLight(0xa0a0a0));
    this.scene.add(this.camera);
    if (this.demo) {
      this.demo.setCamera(this.camera);
    }
  }

  public dispose() {
    window.cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.resize);
    this.demo.dispose();
    this.renderer.dispose();
  }

  private draw() {
    this.demo.update();
    this.updateTransform();
    this.renderer.render(this.scene, this.camera);
    this.animationFrame = window.requestAnimationFrame(() => this.draw());
  }

  private updateTransform() {
    if (!this.camera.matrixWorldInverse.equals(this.transform)) {
      this.transform = this.camera.matrixWorld.clone();
    }
  }

  private resize = () => {
    const width = this.element.clientWidth;
    const height = this.element.clientHeight;
    const aspect = width / height;
    this.renderer.setSize(width, height);

    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = aspect;
      this.camera.updateProjectionMatrix();
    } else if (this.camera instanceof THREE.OrthographicCamera) {
      this.camera.left = -aspect;
      this.camera.right = aspect;
      this.camera.updateProjectionMatrix();
    }
  }
}
